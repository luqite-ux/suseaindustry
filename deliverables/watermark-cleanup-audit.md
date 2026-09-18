# Customer photo watermark cleanup audit

- Site: `https://suseaindustry.com`
- Tenant: `278a288f-069f-449c-97f1-670df744bc66`
- Product: `pla-basic`
- Completed: 2026-09-18
- Result: PASS

## Scope and result

The 80-image PLA Basic gallery was audited image by image. Twenty-two customer phone photographs contained the automatic HONOR X50 / 108MP Ultra Camera overlay, date and time, and the Chinese location text `宁波市宁海县`. Those 22 photographs were cleaned. The other 58 photographs did not contain this overlay and were not altered.

The cleaned files were uploaded to immutable R2 keys under `site-assets/suseaindustry/products/ai-watermark-cleaned/`. The `products.extra_data.gallery` and `products.extra_data.media_manifest` fields were updated only at the 22 affected indexes. Database readback confirmed 80 gallery items, 80 manifest entries, and 22 entries marked `ai_phone_watermark_cleanup`. The `pla-filament` category icon was also updated to the cleaned first gallery image.

Two public site assets were byte-for-byte copies of affected originals and were replaced with their cleaned counterparts:

- `public/images/print-sample-unicorn.jpg` from source `3.jpg`
- `public/images/print-sample-hellokitty.jpg` from source `18.jpg`

The home and applications pages reference the same immutable cleaned R2 objects used by the product gallery, preventing stale local-image delivery while retaining the cleaned local files as deployment fallbacks.

A SHA-256 scan of `public/` confirmed that no public file retains the hash of any of the 22 original affected photographs.

## AI editing method

Mode: precise object edit / background reconstruction.

Prompt intent: remove only the automatic phone camera overlay along the bottom edge; reconstruct the light-gray studio sweep; preserve the photographed product exactly, including shape, color, texture, edges, scale, position, lighting and shadows; preserve the original framing and studio lightbox; add no replacement text, logo, mark, object or product detail; do not crop.

To protect product truthfulness, the final deliverable uses the original photograph above 88.5% of the image height, a feathered transition from 88.5% to 92%, and the AI-reconstructed clean background only in the bottom band after 92%. This prevents generated edits from changing the product body or primary details.

## Evidence

- Visual contact sheet: `deliverables/evidence/watermark-cleanup/contact-sheet.jpg`
- Per-file source, output dimensions and hashes: `materials/processed/ai-watermark-cleaned/manifest.json` (workspace-bound source evidence)
- R2 and Supabase replacement/readback record: `.codex-delivery/watermark-cleanup-update.json` (workspace-bound delivery evidence)

## Verification

- TypeScript: `pnpm exec tsc --noEmit` — PASS
- Application media plus masonry/lightbox tests: `node --test tests/application-media.test.mjs tests/masonry-gallery.test.mjs` — 4/4 PASS
- Production build: `pnpm build` — PASS
