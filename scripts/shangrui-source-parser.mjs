import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const SOURCE_ORIGIN = 'http://www.shangrui-chemical.com'
const CHALLENGE_PATTERN = /js_clearance\s*=/i

function decodeEntities(value) {
  return value
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
}

function textContent(value) {
  return decodeEntities(
    value
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
      .replace(/<br\s*\/?\s*>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ').trim()
}

function assertContentPage(html) {
  if (CHALLENGE_PATTERN.test(html) && html.length < 2_000) {
    throw new Error('Source returned a clearance challenge instead of content')
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function extractBalancedElement(html, startIndex, tagName = 'div') {
  const tagPattern = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gi')
  tagPattern.lastIndex = startIndex
  let depth = 0
  let match
  while ((match = tagPattern.exec(html))) {
    if (/^<\//.test(match[0])) depth -= 1
    else depth += 1
    if (depth === 0) return html.slice(startIndex, tagPattern.lastIndex)
  }
  return html.slice(startIndex)
}

export function parseProductIndex(html) {
  assertContentPage(html)
  const products = new Map()
  const anchorPattern = /<a\b[^>]*href=["']\/pro_(\d+)\.html["'][^>]*>([\s\S]*?)<\/a>/gi
  for (const match of html.matchAll(anchorPattern)) {
    const sourceId = match[1]
    const name = textContent(match[2])
    const previous = products.get(sourceId)
    products.set(sourceId, {
      sourceId,
      sourceUrl: `${SOURCE_ORIGIN}/pro_${sourceId}.html`,
      name: name || previous?.name || '',
    })
  }
  return [...products.values()].sort((a, b) => Number(a.sourceId) - Number(b.sourceId))
}

function parseFacts(detailHtml) {
  const facts = {}
  const factPattern = /<li\b[^>]*>[\s\S]*?<label\b[^>]*>([\s\S]*?)<\/label>[\s\S]*?<span\b[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/li>/gi
  for (const match of detailHtml.matchAll(factPattern)) {
    const key = textContent(match[1]).replace(/[：:]$/, '')
    const value = textContent(match[2])
    if (key && value) facts[key] = value
  }
  return facts
}

function parseSpecifications(detailHtml) {
  const specifications = {}
  for (const tableMatch of detailHtml.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)) {
    for (const rowMatch of tableMatch[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const cells = [...rowMatch[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((match) => textContent(match[1]))
      if (cells.length === 2 && cells[0] && cells[1]) specifications[cells[0]] = cells[1]
    }
  }
  return specifications
}

function parseSummary(detailHtml) {
  const afterFacts = detailHtml.replace(/<ul\b[^>]*class=["'][^"']*pro-itemspecifics-list[^"']*["'][^>]*>[\s\S]*?<\/ul>/i, ' ')
  const beforeSpecs = afterFacts.split(/<table\b/i)[0]
  const paragraphs = [...beforeSpecs.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => textContent(match[1]))
    .filter((text) => text && !/^(商品说明|详细说明|SPECIFICATIONS?|说明)$/i.test(text))
  return unique(paragraphs).join(' ')
}

export function parseProductDetail(html, sourceUrl) {
  assertContentPage(html)
  const sourceId = /\/pro_(\d+)\.html/i.exec(sourceUrl)?.[1]
  if (!sourceId) throw new Error(`Invalid source product URL: ${sourceUrl}`)

  const crumbsHtml = /<span\b[^>]*class=["'][^"']*ContainerCrumbs[^"']*["'][^>]*>([\s\S]*?)<\/span>/i.exec(html)?.[1] ?? ''
  const crumbs = [...crumbsHtml.matchAll(/<b\b[^>]*>([\s\S]*?)<\/b>/gi)].map((match) => textContent(match[1])).filter(Boolean)
  const title = textContent(/<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? '').replace(/_yushunchemical$/i, '')
  const name = crumbs.at(-1) || title
  const category = crumbs.length >= 2 ? crumbs.at(-2) : ''

  const detailStart = html.search(/<div\b[^>]*class=["'][^"']*show-details-article[^"']*["'][^>]*>/i)
  const detailHtml = detailStart >= 0 ? extractBalancedElement(html, detailStart) : ''
  const imagePattern = /(?:bsrc|data-imgsrc)=["']([^"']+)["']/gi
  const images = unique([...html.matchAll(imagePattern)].map((match) => decodeEntities(match[1]).trim()))

  if (!name) throw new Error(`Product name missing at ${sourceUrl}`)
  if (!detailHtml) throw new Error(`Product detail content missing at ${sourceUrl}`)

  return {
    sourceId,
    sourceUrl,
    name,
    category,
    summary: parseSummary(detailHtml),
    facts: parseFacts(detailHtml),
    specifications: parseSpecifications(detailHtml),
    images,
  }
}

async function fetchSourceHtml(url) {
  const headers = { 'user-agent': 'Mozilla/5.0' }
  const firstResponse = await fetch(url, { headers, redirect: 'follow' })
  const firstBytes = new Uint8Array(await firstResponse.arrayBuffer())
  const firstText = new TextDecoder('gbk').decode(firstBytes)
  const clearance = /var\s+t=["']([^"']+)["']/.exec(firstText)?.[1]
  if (!clearance) {
    assertContentPage(firstText)
    return firstText
  }
  const response = await fetch(url, {
    headers: { ...headers, cookie: `js_clearance=${clearance}` },
    redirect: 'follow',
  })
  const bytes = new Uint8Array(await response.arrayBuffer())
  const html = new TextDecoder('gbk').decode(bytes)
  assertContentPage(html)
  return html
}

export async function crawlSourceProducts() {
  const indexUrl = `${SOURCE_ORIGIN}/bk_28536837.html`
  const indexHtml = await fetchSourceHtml(indexUrl)
  const discovered = parseProductIndex(indexHtml)
  const products = []
  for (const item of discovered) {
    const html = await fetchSourceHtml(item.sourceUrl)
    products.push(parseProductDetail(html, item.sourceUrl))
  }
  return {
    sourceOrigin: SOURCE_ORIGIN,
    indexUrl,
    capturedAt: new Date().toISOString(),
    discoveredCount: discovered.length,
    products,
  }
}

async function main() {
  const outputFlag = process.argv.indexOf('--out')
  const output = outputFlag >= 0 ? process.argv[outputFlag + 1] : '.codex-migration/source-products.json'
  const inventory = await crawlSourceProducts()
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8')
  process.stdout.write(`${JSON.stringify({ output, discoveredCount: inventory.discoveredCount })}\n`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
