# 09 — SEO, Accessibility and Performance

Measured 2026-11-10 against the **production build** (`next start`) on a local development machine.

## Performance (Lighthouse 12, default mobile emulation, headless Chromium from Playwright)

| Page | Perf | A11y | Best practices | LCP | FCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 45 | 100 | 100 | 4.7 s | 1.8 s | 2.9 s | 0 |
| `/products` | 47 | 98 | 100 | 5.1 s | 1.1 s | 9.4 s | 0 |
| `/products/mediai` | 37 | 100 | 100 | 6.3 s | 1.7 s | 14.5 s | 0 |
| `/solutions` | 53 | 100 | 100 | 4.3 s | 1.1 s | 4.0 s | 0 |
| `/enterprise-solutions` | 47 | 100 | 96 | 4.2 s | 1.3 s | 9.7 s | 0.003 |
| `/contact` | 45 | 100 | 96 | 4.8 s | 1.2 s | 6.9 s | 0.035 |
| `/terms` (plain text page, baseline) | 54 | — | — | 4.4 s | — | 5.6 s | — |

### Reading the numbers honestly

- **The Core Web Vitals targets are not met in this lab setup.** LCP target is 2.5 s, and every measured page is above it. INP was not measured (Lighthouse does not report it). CLS meets its target (< 0.1) on every page.
- Single runs, not medians. Results vary between runs.
- Lighthouse's own CPU benchmark index on this machine was about 400, which indicates a slow or busy host. Headless Chromium also renders without a GPU. So the absolute values are probably worse than a typical phone, but this is **not proven**.
- The plain `/terms` page also scores 54 with 5.6 s of blocking time, so a large share of the cost sits in the shared shell and framework, not only in the 3D hero.
- Pages with the heaviest CSS 3D and animation (`/products/mediai`) are worst: Lighthouse attributed about 6.9 s to style and layout there. The LCP element is plain text (the logo wordmark or an eyebrow), so the delay is main-thread blocking, not slow assets.
- Page weight is about 610 KB transferred and the DOM is 770–1,370 elements, which is moderate.

### Investigation and one fix (same day)

Method: Playwright + Chrome DevTools Protocol, 4x CPU throttling, mobile viewport, medians of 3 runs, plus a main-thread trace.

1. **A/B of candidate causes** on `/products/mediai` (style recalculation, seconds): baseline 1.9, animations off 2.5, blur and backdrop filters off 2.0, `preserve-3d` off 1.9, SVG animation removed 1.7. None of the CSS features was the cause. Stopping `requestAnimationFrame` halved it (1.7 → 0.8), and hiding the 3D scene gave the same result (1.6 → 0.7).
2. **Trace**: `Document::recalcStyle` was the largest item at about 1.5 s of main-thread time.
3. **Cause**: the 3D camera (`Stage3D.tsx`, `HeroStage.tsx`) ran a never-ending animation loop that wrote the inherited custom properties `--rx` and `--ry` every frame. Each write restyled the whole 3D subtree.
4. **Fix**: write `style.transform` on the scene element directly. Same visual behaviour, only one element is invalidated.
5. **Result of the fix on the same harness**: style recalculation on `/products/mediai` fell from about 1.5 s to 0.27 s (trace) and from 1.7 s to 0.35 s (profile script).

### What was and was not proven

- The style-cost reduction is **measured and repeatable** with the CDP harness.
- Lighthouse results on this machine are **too noisy to claim the end-to-end gain**. The CPU benchmark index swung between about 480 and 1,300 between runs. Same-load comparisons (benchmark index roughly 500–900):

| Page | Old code | New code |
| --- | --- | --- |
| `/` | perf 47, TBT 7.0 s | perf 53, TBT 3.2 s (better) |
| `/products/mediai` | perf 43, TBT 11.3 s | perf 49, TBT 11.1 s (no clear change) |

  One run on a quieter machine (benchmark index 900–1,300) gave perf 69–75 and TBT 0.5–0.8 s on home, products and mediai, but the old code was not measured under that condition, so it is **not** a valid before/after.
- LCP stayed at 3.7–4.5 s in every run, so **the 2.5 s target is still not met**.

### Status: partly addressed, still open (P1)

Remaining main-thread work on `/products/mediai` after the fix is mostly JavaScript (hydration and the animation loop, about 1.2 s) and paint (about 0.8 s). Next candidates, to be tested one at a time on real hardware: pause the idle sway on touch devices, lazy-load the product vignette and mockup, and reduce client component hydration. Field data (CrUX / real-user monitoring) needs a deployed site.

## SEO

- Unique title, description and canonical on every page (`lib/seo.ts`). `sitemap.xml` and `robots.txt` generated.
- JSON-LD: Organization (site-wide), BreadcrumbList (pages with a hero), FAQPage (home), SoftwareApplication (products; no ratings or reviews).
- Generated social preview image for the site and for every product (`opengraph-image`).
- Real 404 status for unknown or unpublished slugs (`src/proxy.ts`, tested).
- **Lighthouse SEO is 69 on every page for one reason only: `is-crawlable` fails**, because the site is deliberately `noindex` until `SITE_INDEXABLE=true` is set on the approved production domain. That is expected, not a defect. Re-measure after launch.
- Not done: multilingual SEO (single language), per-page OG images for categories, industries and articles (they use the site card).

## Accessibility

- Lighthouse accessibility: 96–100 on the six pages (98 on `/products`; not investigated).
- Automated axe (WCAG 2.0/2.1/2.2 A and AA tags) scans: 16 pages with no serious or critical violations, run in the e2e suite.
- Manual coverage: skip link, keyboard-operated menus with Escape, native `<dialog>` and `<details>`, 44 px targets, reduced-motion support.
- **Not done:** screen-reader testing with real assistive technology, and a manual WCAG audit. Automated tools catch only part of the issues, so WCAG 2.2 AA conformance is **not** claimed.

## Security notes relevant to release

CSP and security headers are tested. The CSP keeps `'unsafe-inline'` for scripts (needed for Next.js hydration without nonces). Dependency vulnerability scanning (`npm audit`) has not been run yet.
