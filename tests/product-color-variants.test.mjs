import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { selectColorVariant } from '../lib/color-variant-preview.mjs'

const productPage = readFileSync(new URL('../app/products/[slug]/page.tsx', import.meta.url), 'utf8')
const component = readFileSync(new URL('../components/product-color-variants.tsx', import.meta.url), 'utf8')

test('product detail requires the complete nineteen-color mapping', () => {
  assert.match(productPage, /variants\.length===19/)
  assert.match(productPage, /color_variants/)
})

test('selected color keeps the spool and printed horse sample paired', () => {
  assert.match(component, /selected\.productImage/)
  assert.match(component, /selected\.sampleImage/)
  assert.match(component, /printed horse sample/)
})

test('one color selection provides both images for an immediate paired preview', () => {
  const variants = [
    { slug: 'purple', name: 'Purple', productImage: '/purple-spool.png', sampleImage: '/purple-horse.png' },
    { slug: 'gold', name: 'Gold', productImage: '/gold-spool.png', sampleImage: '/gold-horse.png' },
  ]

  assert.deepEqual(selectColorVariant(variants, 'gold'), variants[1])
  assert.deepEqual(selectColorVariant(variants, 'missing'), variants[0])
})

test('legacy masonry gallery is not rendered on the product detail page', () => {
  assert.doesNotMatch(productPage, /ProductMasonryGallery/)
  assert.doesNotMatch(productPage, /product\.gallery/)
})
