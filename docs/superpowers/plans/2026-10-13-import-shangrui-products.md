# Shangrui Product Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import every product currently published on `www.shangrui-chemical.com` into the existing `suseaindustry.com` product catalog and prove the complete result on the formal domain at desktop and 390px mobile widths.

**Architecture:** Freeze the source website into a reproducible inventory keyed by source product ID, normalize each real product into the existing multilingual Supabase product/category model, upload source images to tenant-scoped immutable R2 keys, and upsert only tenant `278a288f-069f-449c-97f1-670df744bc66`. Keep the approved public-site visual system and extend its data rendering only where the imported product shapes expose missing states.

**Tech Stack:** Next.js 16, TypeScript, Node.js migration scripts, Supabase Postgres, Cloudflare R2, Vercel Production, Node test runner.

**Spec:** `docs/客户修改任务复审方法论.md`, `docs/网站迁移与1比1复刻规范.md`, customer request dated 2026-10-13.

## Global Constraints

- Import the complete source product set; no representative sampling.
- Preserve customer facts and source image order; do not invent products, specifications, certifications, prices, stock, warranty or guarantee claims.
- Store multilingual product fields in `*_i18n` and keep the public English site readable with the existing locale fallback contract.
- Upload product media to tenant-scoped R2 URLs; do not leave source hotlinks in Production.
- Every database read/write must be restricted to tenant `278a288f-069f-449c-97f1-670df744bc66`.
- Keep the approved current site design; product import does not authorize an unrelated redesign.
- GitHub operations must authenticate as `luqite-ux` using the project company-token procedure.
- Completion requires formal-domain evidence for every product detail on desktop and 390px mobile, with no `FAIL` or unverified requirement.

## Review Focus

- Source anti-bot pages and pagination must not silently truncate discovery; the inventory test asserts the frozen source-ID set and count.
- One source page can contain several model numbers; preserve the source product entity unless the source exposes separate detail pages.
- Source detail copy can contain inconsistent model text; the normalized record must retain traceable source evidence without silently claiming conflicting facts.
- Missing or duplicated images must not produce broken cards or overwrite another product's gallery.
- Existing `pla-basic` and its 80-image/color-variant data must remain unchanged after idempotent import.

---

### Task 1: Freeze and verify the source inventory

**Files:**
- Create: `.codex-migration/source-products.json`
- Create: `.codex-migration/source-inventory.md`
- Create: `scripts/shangrui-source-parser.mjs`
- Test: `tests/shangrui-source-parser.test.mjs`

**Interfaces:**
- Consumes: source product-center and detail HTML captured through the current source-site clearance flow.
- Produces: `parseProductIndex(html)` and `parseProductDetail(html, sourceUrl)` plus a source-ID keyed JSON inventory.

- [ ] Write parser tests for unique product discovery, GB18030-decoded Chinese text, category breadcrumbs, specifications and ordered image URLs.
- [ ] Run the parser test and verify it fails because the parser does not exist.
- [ ] Implement the smallest parser that satisfies the frozen fixtures and rejects challenge-only HTML.
- [ ] Crawl every discovered product detail, record source IDs/URLs, names, categories, descriptions, specifications and images, then verify the source/actual set difference is empty.
- [ ] Run the parser tests and inventory checks until green.

### Task 2: Normalize multilingual catalog records

**Files:**
- Create: `scripts/build-shangrui-product-seed.mjs`
- Create: `.codex-migration/normalized-products.json`
- Test: `tests/shangrui-product-normalization.test.mjs`

**Interfaces:**
- Consumes: `.codex-migration/source-products.json`.
- Produces: deterministic categories/products using source IDs, stable unique slugs, `name_i18n`, `description_i18n`, `overview_i18n`, structured `specs`, and traceability in `extra_data`.

- [ ] Write failing tests for count preservation, stable slugs, category mapping, multilingual fields, forbidden warranty terms and existing-product non-interference.
- [ ] Run the tests and verify the expected failures.
- [ ] Implement normalization without splitting or merging source entities beyond the source detail-page boundaries.
- [ ] Review all normalized names/descriptions/specifications against the source evidence and remove prohibited promises without changing neutral product facts.
- [ ] Run the normalization tests and full suite until green.

### Task 3: Upload images and idempotently upsert tenant data

**Files:**
- Create: `scripts/import-shangrui-products.mjs`
- Create: `.codex-migration/backend-readback.json`
- Test: `tests/shangrui-product-import.test.mjs`

**Interfaces:**
- Consumes: normalized records, project Supabase/R2 credentials, exact tenant ID.
- Produces: tenant-scoped R2 assets plus idempotent `product_categories` and `products` rows with source traceability.

- [ ] Write failing tests for dry-run behavior, tenant guards, idempotent upsert keys, image URL replacement and preservation of `pla-basic`.
- [ ] Run the tests and verify the expected failures.
- [ ] Implement dry-run and apply modes, uploading immutable content-hash keys before database upserts.
- [ ] Execute dry-run, inspect the full change set, then apply only to the exact tenant.
- [ ] Read back categories, products, image URLs, active state, sort order and existing PLA Basic unchanged state; rerun apply to prove idempotency.

### Task 4: Make every imported product shape render correctly

**Files:**
- Modify only if evidence requires: `app/products/page.tsx`
- Modify only if evidence requires: `app/products/[slug]/page.tsx`
- Modify only if evidence requires: `lib/content-db.ts`
- Test: focused renderer/data-contract tests under `tests/`

**Interfaces:**
- Consumes: imported Supabase records through the existing locale-aware data layer.
- Produces: complete product cards/details, galleries and specification states without affecting the approved PLA Basic experience.

- [ ] Write failing tests for every newly observed data shape that current rendering cannot represent.
- [ ] Run focused tests and verify each failure is caused by the missing rendering behavior.
- [ ] Implement the minimum compatible UI/data changes.
- [ ] Run focused tests, full tests, lint and Production build.
- [ ] Verify local desktop/mobile rendering for the entire product set and repair all failures.

### Task 5: Deploy with a traceable company-account evidence chain

**Files:**
- Create: `.codex-migration/deployment-evidence.json`
- Update: `.codex-migration/parity-manifest.json`

**Interfaces:**
- Consumes: tested code/data revision.
- Produces: matching local, GitHub `main`, Vercel Production and formal-domain revision evidence.

- [ ] Verify company token identity is exactly `luqite-ux` and read the current repository/main SHA through GitHub REST.
- [ ] Commit only expected customer-repository files and push with a one-shot Basic authorization header.
- [ ] Read GitHub `main` SHA through the same company token and verify it equals the local target SHA.
- [ ] Verify Vercel Production is `READY`, uses the target Git revision and has the required environment variables.
- [ ] Verify `suseaindustry.com` serves the new deployment rather than stale platform or CDN content.

### Task 6: Perform full formal-domain review and closeout

**Files:**
- Create: `.codex-migration/parity-manifest.json`
- Create: `.codex-migration/formal-domain-review.md`
- Create: `deliverables/evidence/shangrui-import/` screenshots and machine-readable route results.

**Interfaces:**
- Consumes: Production catalog and frozen source inventory.
- Produces: full source-to-target content coverage plus desktop/mobile visual evidence for every product.

- [ ] Verify product index count, names, category coverage, images and links on the formal domain.
- [ ] Open every product detail at desktop width; verify content, ordered gallery/specifications, image integrity, no prohibited promises, no overflow and no broken assets.
- [ ] Repeat every product detail at 390px and record a verdict tied to the formal URL.
- [ ] Verify sitemap contains every active imported slug and every URL returns 200 with correct canonical/Product JSON-LD.
- [ ] Run the migration manifest checker, complete an independent second pass from the customer requirement, and leave no `FAIL` or unverified item.
- [ ] After all evidence is green, perform required GitHub/Production/formal-domain readbacks, update the workbench, and follow the project's final cleanup order.
