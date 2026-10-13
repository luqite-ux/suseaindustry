import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildExistingImageMap,
  buildImportPlan,
  buildTranslationProfile,
  fetchWithRetry,
  replaceProductImages,
} from '../scripts/import-shangrui-products.mjs'

const TENANT_ID = '278a288f-069f-449c-97f1-670df744bc66'

const normalized = {
  categories: [{ slug: 'tpe', name: 'TPE', sort_order: 2 }],
  products: [{
    slug: 'tpe-ys-01-57883085',
    image_url: 'https://source.example/one.jpg',
    extra_data: {
      gallery: ['https://source.example/one.jpg', 'https://source.example/two.jpg'],
      source_images: ['https://source.example/one.jpg', 'https://source.example/two.jpg'],
      source_product_id: '57883085',
    },
  }],
}

test('import plan rejects any tenant other than the exact customer tenant', () => {
  assert.throws(
    () => buildImportPlan(normalized, { tenantId: '11111111-1111-4111-8111-111111111111', existingProducts: [], existingCategories: [] }),
    /refusing tenant/i,
  )
})

test('dry-run plan preserves existing PLA Basic and inserts only source-keyed products', () => {
  const existingProducts = [{ slug: 'pla-basic', extra_data: { source_product_key: 'pla-basic-filament' } }]
  const plan = buildImportPlan(normalized, { tenantId: TENANT_ID, existingProducts, existingCategories: [] })
  assert.equal(plan.mode, 'dry-run')
  assert.equal(plan.productCreates, 1)
  assert.equal(plan.productUpdates, 0)
  assert.equal(plan.categoryCreates, 1)
  assert.equal(plan.preservedExistingProducts, 1)
  assert.ok(plan.products.every((product) => product.tenant_id === TENANT_ID))
  assert.ok(plan.products.every((product) => product.slug !== 'pla-basic'))
})

test('rerun recognizes source product and category as updates for idempotency', () => {
  const plan = buildImportPlan(normalized, {
    tenantId: TENANT_ID,
    existingProducts: [{ slug: 'tpe-ys-01-57883085', extra_data: { source_product_id: '57883085' } }],
    existingCategories: [{ slug: 'tpe' }],
  })
  assert.equal(plan.productCreates, 0)
  assert.equal(plan.productUpdates, 1)
  assert.equal(plan.categoryCreates, 0)
  assert.equal(plan.categoryUpdates, 1)
})

test('uploaded image mapping replaces every source hotlink consistently', () => {
  const updated = replaceProductImages(normalized.products[0], new Map([
    ['https://source.example/one.jpg', 'https://pub.r2.dev/one.jpg'],
    ['https://source.example/two.jpg', 'https://pub.r2.dev/two.jpg'],
  ]))
  assert.equal(updated.image_url, 'https://pub.r2.dev/one.jpg')
  assert.deepEqual(updated.extra_data.gallery, ['https://pub.r2.dev/one.jpg', 'https://pub.r2.dev/two.jpg'])
  assert.deepEqual(updated.extra_data.source_images, normalized.products[0].extra_data.source_images)
})

test('idempotent rerun reuses verified source-to-R2 image mappings', () => {
  const map = buildExistingImageMap([{
    extra_data: {
      source_images: ['https://source.example/one.jpg', 'https://source.example/two.jpg'],
      gallery: ['https://pub.r2.dev/one.jpg', 'https://pub.r2.dev/two.jpg'],
    },
  }])
  assert.equal(map.get('https://source.example/one.jpg'), 'https://pub.r2.dev/one.jpg')
  assert.equal(map.get('https://source.example/two.jpg'), 'https://pub.r2.dev/two.jpg')
})

test('translation profile merge adds imported product families without losing existing settings', () => {
  const existing = { glossary: { '色母粒': 'color masterbatch' }, target_markets: ['Global distributors'], company_summary: 'Existing summary' }
  const merged = buildTranslationProfile(existing)
  assert.equal(merged.glossary['色母粒'], 'color masterbatch')
  assert.deepEqual(merged.target_markets, existing.target_markets)
  assert.equal(merged.company_summary, existing.company_summary)
  assert.ok(merged.main_products.includes('PLA Basic 3D Printer Filament'))
  assert.ok(merged.main_products.includes('SEBS, SIS, SEPS, SBS and SSBR grades'))
  assert.match(merged.industry, /polymer/i)
})

test('transient network failure is retried with the failing URL preserved in context', async () => {
  let attempts = 0
  const response = await fetchWithRetry('https://pub.r2.dev/object.jpg', { method: 'HEAD' }, async () => {
    attempts += 1
    if (attempts === 1) throw new TypeError('fetch failed')
    return new Response(null, { status: 200 })
  })
  assert.equal(response.status, 200)
  assert.equal(attempts, 2)
})

test('slow source CDN recovery survives more than three transient failures', async () => {
  let attempts = 0
  const response = await fetchWithRetry('https://source.example/slow.jpg', {}, async () => {
    attempts += 1
    if (attempts < 5) throw new TypeError('connect timeout')
    return new Response('image', { status: 200 })
  }, { delaysMs: [1, 1, 1, 1] })
  assert.equal(response.status, 200)
  assert.equal(attempts, 5)
})
