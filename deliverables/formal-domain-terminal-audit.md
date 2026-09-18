# Formal-domain terminal audit

- Verified at: 2026-09-18 18:14 (Asia/Shanghai)
- Formal host: `https://suseaindustry.com`
- Production deployment: `dpl_HsEE6f148JuBeCnkxRhopTtGQgnj`
- Delivery commit: `084594073ce87915f1833c095d2ce941d1c3f698`

## Domain and HTTPS

- Cloudflare zone `088e1f382ef439db0558d245635ccf10`: `active`.
- Authoritative NS: `eleanor.ns.cloudflare.com`, `sterling.ns.cloudflare.com` (Cloudflare DNS and Google Public DNS both returned the same pair).
- Root A: `216.150.1.1`, `216.150.16.1`.
- `www` CNAME: `9768e9ef343539f8.vercel-dns-016.com`.
- Vercel domain configuration: bare and `www` both `verified=true` and `misconfigured=false`.
- Vercel certificate: `cert_KCfRP5krVgtIApfCcDbNPrsJ`, covering bare and `www`, auto-renew enabled.
- Bare domain, `www`, `/robots.txt`, and `/sitemap.xml`: HTTPS 200.

## Public-route and SEO audit

- Sitemap contains 8 formal URLs; every URL returned 200.
- Every sitemap URL has a self-referencing formal-domain canonical, matching `og:url`, and an absolute HTTPS Open Graph image.
- Homepage JSON-LD: `Organization`, `WebSite`.
- Product detail JSON-LD: `Product`, `BreadcrumbList` plus the site entities.
- All 8 sitemap pages passed the English UI scan with no CJK leakage.
- All 8 sitemap pages passed the prohibited warranty/guarantee keyword scan.
- `/llms.txt` remains opt-out and returns 404 as intended.

## Responsive, visual, favicon, and accessibility audit

- Desktop homepage and 390 px mobile homepage visually reviewed on the formal domain.
- A real mobile overflow defect in the color selector was found and fixed; final readback is `innerWidth=390`, `document.scrollWidth=390`.
- Formal-domain homepage and contact-page axe audits reported zero WCAG A/AA violations. The homepage retained only an automated contrast `incomplete` result where axe could not calculate image-backed backgrounds; the rendered text was visually reviewed and remained readable.
- Contact form shows the 4-character image CAPTCHA input and refresh control; its formal-domain contact page has no broken image assets.
- `app/icon.png` and `public/images/logo.png` are both 200×172 PNG files with identical SHA-256 and the live `/icon.png` payload exactly matches the live header Logo asset. Online icon and Logo both return 200.
- Footer Logo, home link, legal owner and runtime year were reviewed on desktop and mobile. Copyright output is `© 2026 Ningbo Shuzhihai New Materials Co., Ltd. All rights reserved.`

## Backend and translation verification

- Product structured translation from English to Chinese persisted to all six product i18n field groups and was read back successfully.
- An unpublished temporary article was translated as one atomic title/excerpt/content group, persisted, and read back successfully.
- Future-language enablement was exercised by temporarily adding Chinese to `supported_languages`.
- Cleanup readback: temporary article residual `0`; product i18n was restored; `supported_languages` was restored to `en` only.
- Existing product/article roundtrip, admin login, CAPTCHA server checks, inquiry residual cleanup, tenant group, SEO-disabled default, site settings and service-expiry guard remained PASS from the platform Production audit.

## Evidence

- `deliverables/evidence/formal/home-desktop-final.png`
- `deliverables/evidence/formal/home-mobile-390-final-fixed-loaded.png`
- `deliverables/evidence/formal/product-mobile-390.png`
- `deliverables/evidence/formal/contact-mobile-390.png`
- `.codex-delivery/evidence/cloudflare-dns-before.json`
- `.codex-delivery/evidence/cloudflare-dns-after.json`

Result: **PASS**. Production, formal domain, responsive layout, SEO, backend, translation persistence, test-data cleanup and domain identity propagation are verified.
