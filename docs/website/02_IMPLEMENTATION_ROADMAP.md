# 02 — Implementation Roadmap

Status as of 2026-11-10. Items marked ✅ have code and passing checks. Nothing else is claimed.

## Tranche 1 — done in this branch

| Item | Evidence |
| --- | --- |
| 6 new services (9 total) flowing into nav, footer, sitemap, proxy 404 list and search | `src/content/enterprise.ts`, build prerenders the pages |
| Global search page and header link, ranked, noindex | `src/lib/search.ts`, `src/features/search/SearchBrowser.tsx`, `tests/unit/search.test.ts` (5 tests) |
| Enquiry types extended to Sales, Service, Support, Career | `src/features/leads/schema.ts` |
| Careers and Partners pages, honest copy, no fake roles or partners | `src/app/careers`, `src/app/partners` |
| Checks | typecheck pass · eslint 0 problems · vitest 29/29 · build pass · Playwright 68 passed, 8 skipped |

## Tranche 2 — done (2026-11-10)

| Item | Evidence |
| --- | --- |
| ✅ `/search`, `/careers`, `/partners`, `/enterprise-solutions/cloud-devops` added to axe scans; search and careers added to console-error checks | `tests/e2e/accessibility-responsive.spec.ts`, `journeys.spec.ts` |
| ✅ Search, new-service 404 and careers-submission journeys | `tests/e2e/journeys.spec.ts` ("search and company journeys") |
| ✅ Organization JSON-LD site-wide; BreadcrumbList JSON-LD on every page with a hero | `src/components/JsonLd.tsx`, `layout.tsx`, `PageHero.tsx` |
| ✅ Home FAQ section with FAQPage JSON-LD (answers contain no unverified claims) | `src/app/page.tsx` |
| ✅ Catalogue sorting (Featured, Name, Most mature first) | `CatalogueBrowser.tsx` |
| ✅ Country-aware phone validation (E.164 digit counts) | `schema.ts`, `tests/unit/lead-schema.test.ts` |
| Result | typecheck pass · eslint 0 problems · vitest 29/29 · build pass · Playwright 88 passed, 8 skipped |

## Tranche 2b — done (2026-11-10)

| Item | Evidence |
| --- | --- |
| ✅ Solution finder on `/solutions#finder`: need, industry and organisation size map to products and services by transparent rules. Shows lifecycle badges and a "not a guarantee" note; never suggests drafts. | `src/features/finder/match.ts`, `SolutionFinder.tsx`, `tests/unit/finder.test.ts` (5 tests) |
| ✅ Product comparison: "Compare" checkboxes on catalogue cards (max 3), sticky compare bar, `/compare-products?p=a,b` with a semantic table. Unknown slugs are ignored and the limit is enforced. | `src/features/compare/*`, `src/app/compare-products`, `tests/unit/compare.test.ts` (4 tests) |
| ✅ Both added to site search and the sitemap; `/solutions` and `/compare-products` added to axe scans | `search-index.ts`, `sitemap.ts`, e2e specs |
| Result | typecheck pass · eslint 0 problems · vitest 38/38 · build pass · Playwright 98 passed, 8 skipped (one test of mine was wrong, fixed and re-run) |

## Tranche 2c — done (2026-11-10)

| Item | Evidence |
| --- | --- |
| ✅ Cookie preferences dialog in the footer (necessary-only today; analytics choice off by default) | `components/CookiePreferences.tsx`, e2e |
| ✅ Generated social preview images (site-wide and per product) | `lib/og.tsx`, `opengraph-image` routes, e2e |
| ✅ Lighthouse measured on 7 pages; results recorded as they are, including failures | doc 09 |
| ✅ Six reference websites inspected (structure only); six not inspected and stated as such | doc 03 |
| ✅ Docs 03–10 written from evidence | `docs/website/` |

## Open engineering issue found by measurement

**P1: performance (partly fixed).** The 3D camera loop restyled the whole scene every frame; fixed by writing `transform` directly (style recalculation 1.5 s to 0.27 s in a trace). Lab LCP is still 3.7–4.5 s against a 2.5 s target, and Lighthouse is too noisy on this host to claim the end-to-end gain. Next: pause idle sway on touch, lazy-load vignettes, trim hydration (see doc 09).

## Tranche 3 — needs a decision or an external account

| Item | Blocked by |
| --- | --- |
| Hospitality, Real Estate and Government industry pages (added from generic industry knowledge) | Founder confirms scope and facts |
| Real product facts, screenshots, case studies | Company input |
| Payload CMS + PostgreSQL, lead administration, roles | Docker running or a Postgres URL |
| Lead notification (email/CRM) | Provider choice |
| AI assistant and natural-language search | Model provider, credentials, privacy review |
| WhatsApp and meeting scheduling | Approved number / scheduling provider |
| Multi-language | Approved translations |
| Production deployment and monitoring | Domain, hosting region, data residency |
| Legal pages | Legal review |

## Documents still to write

`03` reference mapping (requires actually inspecting the reference sites), `04` information architecture, `05` design system, `06` component inventory, `07` feature matrix, `08` forms and validation, `09` SEO/accessibility/performance, `10` testing and release report. They are deliberately not created yet, because empty documents that claim completion are forbidden by the brief.
