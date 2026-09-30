import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const hero = readFileSync(new URL('../components/home/hero.tsx', import.meta.url), 'utf8')

test('home hero uses all three customer-supplied immutable banner assets', () => {
  assert.match(hero, /2efc3be51a69cb9b-filament-range\.jpg/)
  assert.match(hero, /4261234ff2640766-color-development\.jpg/)
  assert.match(hero, /401005d7000033de-production-process\.jpg/)
  assert.equal((hero.match(/site-assets\/suseaindustry\/banners\/20260930/g) ?? []).length, 3)
})

test('banner remains operable with explicit previous, next, and slide controls', () => {
  assert.match(hero, /aria-label="Previous banner"/)
  assert.match(hero, /aria-label="Next banner"/)
  assert.match(hero, /Show banner/)
})
