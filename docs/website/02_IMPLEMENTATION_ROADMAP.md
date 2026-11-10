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

## Tranche 2 — next (no external dependency)

1. Add `/search`, `/careers`, `/partners` to the axe and console-error e2e lists, plus a search journey test.
2. Organization and Breadcrumb JSON-LD; per-page OG metadata.
3. Home: FAQ section and a technology/integration section built only from facts in the content modules.
4. Product catalogue: sorting, and a feature comparison table for selected products.
5. Solutions page: browse by business function and organisation size, then a solution finder.
6. Country-aware phone validation on the lead form.
7. Cookie preferences UI (needed before enabling any analytics).
8. Measure Lighthouse / Core Web Vitals and record the results in doc 09.

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
