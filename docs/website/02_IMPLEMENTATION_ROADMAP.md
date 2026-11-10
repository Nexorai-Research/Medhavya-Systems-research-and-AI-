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

## Tranche 2b — still open (no external dependency)

1. Feature comparison table for selected products.
2. Solutions page: browse by business function and organisation size, then a solution finder.
3. Cookie preferences UI. It is deliberately postponed until an analytics provider is chosen, because a banner with nothing behind it would be decorative.
4. Per-page OG images.
5. Measure Lighthouse / Core Web Vitals and record the results in doc 09. Not measured yet.
6. Inspect the reference websites and write doc 03. Not done yet.

## Tranche 3 — needs a decision or an external account

| Item | Blocked by |
| --- | --- |
| Hospitality, Real Estate and Government industry pages | Founder confirms scope and facts |
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
