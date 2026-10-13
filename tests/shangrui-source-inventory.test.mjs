import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const inventory = JSON.parse(await readFile(new URL('../.codex-migration/source-products.json', import.meta.url), 'utf8'))

test('frozen source inventory contains the complete forty-product set', () => {
  assert.equal(inventory.discoveredCount, 40)
  assert.equal(inventory.products.length, 40)
  assert.equal(new Set(inventory.products.map((product) => product.sourceId)).size, 40)
})

test('every source product remains traceable and has at least one source image', () => {
  for (const product of inventory.products) {
    assert.match(product.sourceUrl, new RegExp(`/pro_${product.sourceId}\\.html$`))
    assert.ok(product.name, `missing name for ${product.sourceId}`)
    assert.ok(product.category, `missing category for ${product.sourceId}`)
    assert.ok(product.images.length > 0, `missing image for ${product.sourceId}`)
  }
})

test('source inventory does not contain prohibited warranty promises', () => {
  const serialized = JSON.stringify(inventory)
  assert.doesNotMatch(serialized, /质保|保修|质量保证|warrant(?:y|ies)|guarantee(?:d)?/i)
})
