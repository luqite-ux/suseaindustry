import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { normalizeSourceProducts } from '../scripts/build-shangrui-product-seed.mjs'

const source = JSON.parse(await readFile(new URL('../.codex-migration/source-products.json', import.meta.url), 'utf8'))

test('normalization preserves every source entity and creates deterministic unique slugs', () => {
  const result = normalizeSourceProducts(source.products)
  assert.equal(result.products.length, 40)
  assert.equal(new Set(result.products.map((product) => product.slug)).size, 40)
  assert.deepEqual(
    normalizeSourceProducts(source.products).products.map((product) => product.slug),
    result.products.map((product) => product.slug),
  )
})

test('normalization maps every used source category to multilingual category records', () => {
  const result = normalizeSourceProducts(source.products)
  assert.equal(result.categories.length, 8)
  assert.ok(result.categories.every((category) => category.name_i18n.en && category.name_i18n.zh))
  assert.ok(result.products.every((product) => result.categories.some((category) => category.slug === product.category_slug)))
})

test('normalized products have English-first multilingual fields and source traceability', () => {
  const result = normalizeSourceProducts(source.products)
  for (const product of result.products) {
    assert.ok(product.name_i18n.en)
    assert.ok(product.name_i18n.zh)
    assert.ok(product.description_i18n.en)
    assert.ok(product.description_i18n.zh)
    assert.equal(product.extra_data.source_site, 'www.shangrui-chemical.com')
    assert.match(product.extra_data.source_url, new RegExp(`/pro_${product.extra_data.source_product_id}\\.html$`))
    assert.deepEqual(product.extra_data.source_images, product.extra_data.gallery)
  }
})

test('normalized English fields contain no Chinese and no prohibited promises', () => {
  const result = normalizeSourceProducts(source.products)
  const english = JSON.stringify(result.products.map((product) => ({
    name: product.name_i18n.en,
    description: product.description_i18n.en,
    overview: product.overview_i18n.en,
    specs: product.specs,
  })))
  assert.doesNotMatch(english, /[\u3400-\u9fff]/)
  assert.doesNotMatch(english, /质保|保修|质量保证|warrant(?:y|ies)|guarantee(?:d)?/i)
})

test('English source specification labels keep their original technical wording', () => {
  const result = normalizeSourceProducts(source.products)
  const product = result.products.find((item) => item.extra_data.source_product_id === '57770104')
  assert.ok(product)
  assert.ok(Object.keys(product.specs).some((key) => key.includes('Toluene Solution Viscosity')))
  assert.ok(Object.keys(product.specs).every((key) => !key.startsWith('Source specification')))
})

test('normalization output cannot target or overwrite the existing PLA Basic slug', () => {
  const result = normalizeSourceProducts(source.products)
  assert.ok(result.products.every((product) => product.slug !== 'pla-basic'))
  assert.ok(result.products.every((product) => product.extra_data.source_product_key !== 'pla-basic-filament'))
})
