import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const detailPage = await readFile(new URL('../app/products/[slug]/page.tsx', import.meta.url), 'utf8')
const gallery = await readFile(new URL('../components/product-media-gallery.tsx', import.meta.url), 'utf8').catch(() => '')

test('non-PLA products render the generic product detail instead of the old color placeholder', () => {
  assert.match(detailPage, /ProductMediaGallery/)
  assert.match(detailPage, /product\.gallery/)
  assert.match(detailPage, /product\.specs/)
  assert.doesNotMatch(detailPage, /Color photography is being updated/)
})

test('generic product gallery keeps every source image complete and provides thumbnail controls', () => {
  assert.match(gallery, /object-contain/)
  assert.match(gallery, /gallery\.map/)
  assert.match(gallery, /aria-label=.*image/i)
  assert.match(gallery, /setSelected/)
})

test('generic product detail keeps the existing nineteen-color PLA experience', () => {
  assert.match(detailPage, /variants\.length===19/)
  assert.match(detailPage, /ProductColorVariants/)
})
