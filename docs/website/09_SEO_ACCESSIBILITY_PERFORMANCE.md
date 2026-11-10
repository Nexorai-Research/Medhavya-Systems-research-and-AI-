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

### Status: open issue (priority P1)

No optimisation was attempted this round, because guessing would not be evidence. Next step: profile `/products/mediai` and the shared shell in Chrome DevTools on real hardware, then test candidate fixes one at a time (large blur layers, `preserve-3d` scenes, SMIL animation, scroll-driven animation cost, hydration of client components). Re-measure with several runs and report the median. Field data (CrUX / real-user monitoring) needs a deployed site.

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
