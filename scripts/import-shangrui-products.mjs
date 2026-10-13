import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const EXPECTED_TENANT_ID = '278a288f-069f-449c-97f1-670df744bc66'

function assertTenant(tenantId) {
  if (tenantId !== EXPECTED_TENANT_ID) {
    throw new Error(`Refusing tenant ${tenantId || '(missing)'}; expected ${EXPECTED_TENANT_ID}`)
  }
}

export function buildImportPlan(normalized, { tenantId, existingProducts, existingCategories }) {
  assertTenant(tenantId)
  const existingProductSlugs = new Set(existingProducts.map((product) => product.slug))
  const existingCategorySlugs = new Set(existingCategories.map((category) => category.slug))
  const products = normalized.products.map((product) => ({ ...product, tenant_id: tenantId }))
  const categories = normalized.categories.map((category) => ({ ...category, tenant_id: tenantId }))
  if (products.some((product) => product.slug === 'pla-basic')) throw new Error('Import may not overwrite pla-basic')
  return {
    mode: 'dry-run',
    tenantId,
    categoryCreates: categories.filter((category) => !existingCategorySlugs.has(category.slug)).length,
    categoryUpdates: categories.filter((category) => existingCategorySlugs.has(category.slug)).length,
    productCreates: products.filter((product) => !existingProductSlugs.has(product.slug)).length,
    productUpdates: products.filter((product) => existingProductSlugs.has(product.slug)).length,
    preservedExistingProducts: existingProducts.filter((product) => !products.some((incoming) => incoming.slug === product.slug)).length,
    categories,
    products,
  }
}

export function replaceProductImages(product, uploadedBySourceUrl) {
  const gallery = product.extra_data.gallery.map((url) => {
    const uploaded = uploadedBySourceUrl.get(url)
    if (!uploaded) throw new Error(`Uploaded image missing for ${url}`)
    return uploaded
  })
  return {
    ...product,
    image_url: gallery[0],
    extra_data: {
      ...product.extra_data,
      gallery,
      source_images: [...product.extra_data.source_images],
      r2_imported_at: new Date().toISOString(),
    },
  }
}

export function buildExistingImageMap(existingProducts) {
  const map = new Map()
  for (const product of existingProducts) {
    const sourceImages = product.extra_data?.source_images
    const gallery = product.extra_data?.gallery
    if (!Array.isArray(sourceImages) || !Array.isArray(gallery) || sourceImages.length !== gallery.length) continue
    sourceImages.forEach((sourceUrl, index) => {
      const r2Url = gallery[index]
      if (sourceUrl && /\.r2\.dev\//.test(r2Url || '')) map.set(sourceUrl, r2Url)
    })
  }
  return map
}

export function buildTranslationProfile(existing = {}) {
  return {
    ...existing,
    industry: 'FDM 3D printing consumables, thermoplastic elastomers, synthetic rubber and polymer materials',
    main_products: [
      'PLA Basic 3D Printer Filament',
      'SEBS, SIS, SEPS, SBS and SSBR grades',
      'TPE compounds',
      'EVA grades',
      'PA6 chips and polypropylene',
      'Color masterbatch and carbon black',
    ],
    glossary: {
      ...(existing.glossary || {}),
      '热塑性弹性体': 'thermoplastic elastomer',
      '聚合物改性': 'polymer modification',
      '胶黏剂': 'adhesive materials',
      '色母粒': existing.glossary?.['色母粒'] || 'color masterbatch',
      '炭黑': 'carbon black',
    },
  }
}

function parseEnv(text) {
  const result = {}
  for (const line of text.split(/\r?\n/)) {
    const match = /^([^#=]+)=(.*)$/.exec(line)
    if (!match) continue
    result[match[1].trim()] = match[2].trim().replace(/^(['"])(.*)\1$/, '$2')
  }
  return result
}

function required(config, name) {
  const value = config[name]?.trim()
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

function contentExtension(contentType, sourceUrl) {
  if (/png/i.test(contentType)) return '.png'
  if (/webp/i.test(contentType)) return '.webp'
  if (/gif/i.test(contentType)) return '.gif'
  const fromPath = path.extname(new URL(sourceUrl).pathname).toLowerCase()
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(fromPath) ? fromPath : '.jpg'
}

export async function fetchWithRetry(url, options = {}, fetchImpl = fetch, retryOptions = {}) {
  const delaysMs = retryOptions.delaysMs || [1_000, 2_000, 5_000, 10_000]
  let lastError
  const maxAttempts = delaysMs.length + 1
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, options)
      if (response.ok || (response.status < 500 && response.status !== 429)) return response
      lastError = new Error(`HTTP ${response.status}`)
    } catch (error) {
      lastError = error
    }
    if (attempt < maxAttempts) await new Promise((resolve) => setTimeout(resolve, delaysMs[attempt - 1]))
  }
  throw new Error(`Fetch failed after ${maxAttempts} attempts: ${url}`, { cause: lastError })
}

async function uploadSourceImages(products, config, uploaded = new Map()) {
  const { PutObjectCommand, S3Client } = await import('@aws-sdk/client-s3')
  const client = new S3Client({
    region: 'auto',
    endpoint: required(config, 'R2_S3_ENDPOINT'),
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
    credentials: {
      accessKeyId: required(config, 'R2_ACCESS_KEY_ID'),
      secretAccessKey: required(config, 'R2_SECRET_ACCESS_KEY'),
    },
  })
  const bucket = required(config, 'R2_BUCKET_NAME')
  const publicBase = required(config, 'R2_PUBLIC_URL_PREFIX').replace(/\/$/, '')
  for (const product of products) {
    for (const sourceUrl of product.extra_data.gallery) {
      if (uploaded.has(sourceUrl)) continue
      const response = await fetchWithRetry(sourceUrl)
      if (!response.ok) throw new Error(`Image download failed ${response.status}: ${sourceUrl}`)
      const body = new Uint8Array(await response.arrayBuffer())
      const hash = createHash('sha256').update(body).digest('hex')
      const contentType = response.headers.get('content-type')?.split(';')[0] || 'image/jpeg'
      const extension = contentExtension(contentType, sourceUrl)
      const key = `tenants/suseaindustry/products/shangrui-import/${product.extra_data.source_product_id}/${hash.slice(0, 20)}${extension}`
      await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      }))
      const publicUrl = `${publicBase}/${key}`
      const readback = await fetchWithRetry(publicUrl, { method: 'HEAD' })
      if (!readback.ok) throw new Error(`R2 readback failed ${readback.status}: ${publicUrl}`)
      uploaded.set(sourceUrl, publicUrl)
    }
  }
  return uploaded
}

async function loadDatabase(config) {
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(
    required(config, 'NEXT_PUBLIC_SUPABASE_URL'),
    required(config, 'SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}

async function readCurrent(db, tenantId) {
  const [{ data: products, error: productError }, { data: categories, error: categoryError }, { data: tenant, error: tenantError }] = await Promise.all([
    db.from('products').select('id,slug,name,extra_data,image_url,sort_order').eq('tenant_id', tenantId).order('sort_order'),
    db.from('product_categories').select('id,slug,name,extra_data,sort_order').eq('tenant_id', tenantId).order('sort_order'),
    db.from('tenants').select('id,display_name,extra_settings').eq('id', tenantId).single(),
  ])
  if (productError) throw productError
  if (categoryError) throw categoryError
  if (tenantError) throw tenantError
  return { products, categories, tenant }
}

async function applyImport(db, plan, config, existingProducts) {
  const uploaded = await uploadSourceImages(plan.products, config, buildExistingImageMap(existingProducts))
  const products = plan.products.map((product) => replaceProductImages(product, uploaded))
  const firstImageByCategory = new Map()
  for (const product of products) {
    if (!firstImageByCategory.has(product.category_slug)) firstImageByCategory.set(product.category_slug, product.image_url)
  }
  const categories = plan.categories.map((category) => ({ ...category, icon: firstImageByCategory.get(category.slug) || null }))

  const { error: categoryError } = await db.from('product_categories').upsert(categories, { onConflict: 'tenant_id,slug' })
  if (categoryError) throw categoryError
  const { error: productError } = await db.from('products').upsert(products, { onConflict: 'tenant_id,slug' })
  if (productError) throw productError

  const current = await readCurrent(db, plan.tenantId)
  const extraSettings = current.tenant.extra_settings || {}
  const { error: tenantError } = await db.from('tenants').update({
    extra_settings: {
      ...extraSettings,
      translation_profile: buildTranslationProfile(extraSettings.translation_profile || {}),
    },
  }).eq('id', plan.tenantId)
  if (tenantError) throw tenantError
  return { products, categories, uploaded }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const envIndex = process.argv.indexOf('--env')
  const envPath = envIndex >= 0 ? process.argv[envIndex + 1] : 'D:/Cursor/Grand/huanqiu-admin/.env'
  const config = { ...parseEnv(await readFile(envPath, 'utf8')), ...process.env }
  const tenantId = required(config, 'NEXT_PUBLIC_TENANT_ID')
  assertTenant(tenantId)
  const normalized = JSON.parse(await readFile('.codex-migration/normalized-products.json', 'utf8'))
  const db = await loadDatabase(config)
  const before = await readCurrent(db, tenantId)
  const plan = buildImportPlan(normalized, { tenantId, existingProducts: before.products, existingCategories: before.categories })
  const summary = {
    mode: apply ? 'apply' : 'dry-run',
    tenantId,
    beforeProductCount: before.products.length,
    beforeCategoryCount: before.categories.length,
    categoryCreates: plan.categoryCreates,
    categoryUpdates: plan.categoryUpdates,
    productCreates: plan.productCreates,
    productUpdates: plan.productUpdates,
    preservedExistingProducts: plan.preservedExistingProducts,
  }
  if (!apply) {
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)
    return
  }

  const applied = await applyImport(db, plan, config, before.products)
  const after = await readCurrent(db, tenantId)
  const sourceRows = after.products.filter((product) => product.extra_data?.source_site === 'www.shangrui-chemical.com')
  const plaBasic = after.products.find((product) => product.slug === 'pla-basic')
  const readback = {
    ...summary,
    afterProductCount: after.products.length,
    afterCategoryCount: after.categories.length,
    importedProductCount: sourceRows.length,
    importedCategoryCount: after.categories.filter((category) => category.extra_data?.source_site === 'www.shangrui-chemical.com').length,
    r2ImageCount: new Set(applied.products.flatMap((product) => product.extra_data.gallery)).size,
    allImagesOnR2: applied.products.every((product) => product.extra_data.gallery.every((url) => /\.r2\.dev\//.test(url))),
    plaBasicPreserved: Boolean(plaBasic && plaBasic.extra_data?.source_product_key === 'pla-basic-filament'),
    importedSourceIds: sourceRows.map((product) => product.extra_data.source_product_id).sort(),
    importedSlugs: sourceRows.map((product) => product.slug).sort(),
    categorySlugs: after.categories.map((category) => category.slug).sort(),
    checkedAt: new Date().toISOString(),
  }
  if (readback.importedProductCount !== 40 || readback.r2ImageCount !== 68 || !readback.allImagesOnR2 || !readback.plaBasicPreserved) {
    throw new Error(`Import readback failed: ${JSON.stringify(readback)}`)
  }
  await writeFile('.codex-migration/backend-readback.json', `${JSON.stringify(readback, null, 2)}\n`, 'utf8')
  process.stdout.write(`${JSON.stringify(readback, null, 2)}\n`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
