import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const hero = readFileSync(new URL('../components/home/hero.tsx', import.meta.url), 'utf8')
const nextConfig = readFileSync(new URL('../next.config.mjs', import.meta.url), 'utf8')

test('home hero uses local optimized copies of all three customer-supplied banner assets', () => {
  assert.match(hero, /\/images\/banners\/filament-range\.webp/)
  assert.match(hero, /\/images\/banners\/color-development\.webp/)
  assert.match(hero, /\/images\/banners\/production-process\.webp/)
  assert.doesNotMatch(hero, /pub-c7a22068052144a5805830c30d280128\.r2\.dev/)
})

test('banner remains operable with explicit previous, next, and slide controls', () => {
  assert.match(hero, /aria-label="Previous banner"/)
  assert.match(hero, /aria-label="Next banner"/)
  assert.match(hero, /Show banner/)
})

test('home hero only renders the active responsive image', () => {
  assert.match(hero, /src=\{slide\.image\}/)
  assert.doesNotMatch(hero, /slides\.map\(\(item, index\) => <Image/)
  assert.match(hero, /priority=\{active === 0\}/)
})

test('Next image optimization is enabled for the public R2 asset host', () => {
  assert.doesNotMatch(nextConfig, /unoptimized:\s*true/)
  assert.match(nextConfig, /pub-c7a22068052144a5805830c30d280128\.r2\.dev/)
  assert.doesNotMatch(nextConfig, /pathname:/)
  assert.match(nextConfig, /formats:\s*\[['"]image\/avif['"],\s*['"]image\/webp['"]\]/)
})
