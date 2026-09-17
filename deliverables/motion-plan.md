# Motion Plan — Ningbo Shuzhihai New Materials Co., Ltd.

## Context

- Industry: FDM 3D-printing filament and color-masterbatch materials.
- Brand character: precise, material-science oriented, colorful but controlled; blue logo is the stable anchor.
- Conversion goal: help distributors, cross-border sellers, makers and industrial buyers understand material consistency, color range and OEM/ODM capability, then request a quote.
- Recent-combination check: the latest delivery ledger frequently uses generic fade-up/card stagger/CTA feedback. This plan keeps the mandatory fail-safe viewport reveal, but differentiates the main experience through a filament-path narrative, a color-spectrum mask and an interactive material/color selector.

## External fresh candidates

| Candidate | Source | Score / 30 | Decision |
|---|---|---:|---|
| EXT-MOTION-INVIEW | https://motion.dev/docs/react-scroll-animations | 27 | Adopt the per-element viewport lifecycle principle; use once-only entry only after the element actually intersects. |
| EXT-GSAP-BATCH | https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.batch%28%29/ | 23 | Adopt the bounded batching/stagger idea; reject adding GSAP solely for simple reveals because native IntersectionObserver or the downloaded stack can do it with less weight. |
| EXT-GSAP-SCRUB-PIN | https://gsap.com/docs/v3/Plugins/ScrollTrigger/ | 17 | Reject pinning/scrubbing: it would compete with product recognition, complicate 390px behavior and risk scroll-jacking for a concise B2B catalog. |
| EXT-SVG-PATH | https://motion.dev/docs/react-svg-animation | 28 | Adopt a short, one-time filament path draw in the Hero/Capabilities narrative; no infinite loop. |

Scoring considers industry fit, information hierarchy, conversion help, recent-client differentiation, desktop/mobile adaptation, performance and reduced-motion fallback.

## Selected scenes

### MOT-SZH-01 — Filament path narrative

- Responsibility: narrative / industry signature.
- Location: Home Hero and the first transition into Capabilities.
- Effect: a restrained SVG filament line draws 0→1 while the real product composition reveals through a soft mask; headline, proof line and CTA enter in priority order. Duration 650–800ms, no loop.
- Why: the line physically resembles filament extrusion and makes the material category understandable without invented equipment.
- Implementation: SVG path length + CSS/Framer Motion; real raster product image remains a normal accessible image layer.
- 390px: shorten the path, remove lateral travel and keep the product/CTA visible from the first frame.
- Reduced motion/failure: static fully drawn line; all copy, product and CTA immediately visible.

### MOT-SZH-02 — Color spectrum mask and selector

- Responsibility: content / product understanding.
- Location: Home color-system section and PLA Basic product detail.
- Effect: color swatches/cards reveal left-to-right with a clipped mask when the group enters the viewport; selecting a swatch crossfades between the corresponding real spool/sample image and updates the label/SKU without layout shift.
- Why: makes 19 customer-supplied variants useful instead of presenting 19 duplicate products.
- Implementation: semantic buttons, short 180–240ms crossfade, image dimensions reserved, keyboard focus visible.
- 390px: horizontally scrollable snap-free swatch rail with direct tap; no auto movement.
- Reduced motion/failure: all swatches shown statically; selection updates instantly.

### MOT-SZH-03 — Bounded viewport reveal for every section and card

- Responsibility: site-wide content hierarchy and mandatory coverage.
- Location: every major section on Home, Products, product detail, Capabilities, Applications, About, News, article detail and Contact; every repeated product/capability/application/process/news/FAQ card.
- Effect: 16–24px upward reveal over 520–620ms; cards stagger 70ms with a 210ms cumulative cap. A section/card becomes `hasAnimated` only after its own real intersection event.
- Why: preserves readable pacing while meeting all-page/card coverage without turning the site into a demo reel.
- Implementation: progressive enhancement with content visible by default; `data-motion-ready` may enable temporary pre-entry styles. Fallback visibility and `hasAnimated` are separate states. No fixed/global timeout can consume unseen animations.
- 390px: 10–14px movement, 420–520ms, maximum two-card simultaneous batch.
- Reduced motion/failure: no transform/stagger; all content immediately visible. Observer/script failure restores visibility but does not record playback.

### MOT-SZH-04 — Precise buyer-action feedback

- Responsibility: interaction / conversion.
- Location: navigation, quote CTA, product cards, FAQ, mobile menu and form controls.
- Effect: 150–220ms border/color/arrow response, product-card image scale capped at 1.025 with no crop, FAQ height/opacity transition, visible focus states and pressed feedback.
- Why: reinforces control and responsiveness without decorative looping.
- Implementation: CSS transitions and accessible state attributes; no pointer-only information.
- 390px: tap/pressed feedback replaces hover; menu/FAQ transitions never trap focus.
- Reduced motion: color/border/focus changes remain, transform and animated height are removed or made immediate.

## Verification contract

- Desktop: 1440px Chromium evidence on every public route; confirm first and last major section, first and last card in every collection, selector keyboard behavior and Hero sequence.
- Mobile: 390px evidence on the same route inventory; confirm no horizontal overflow, no cropped product subject, direct swatch access and tap feedback.
- Viewport lifecycle: leave each page at the top longer than the longest fallback interval, then scroll to untouched middle/bottom sections; those sections must still animate on entry.
- Fail-safe: verify normal JS, JavaScript disabled, motion script blocked and slow loading. Content is always visible.
- Reduced motion: emulate `prefers-reduced-motion: reduce`; all content and controls remain immediately usable.

## Gate result

- Scene count: 4
- External candidates: 4
- Desktop design review: PASS
- 390px design review: PASS
- Reduced-motion design review: PASS
