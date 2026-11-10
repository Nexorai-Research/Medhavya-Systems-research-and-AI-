# 01 — Existing Website Audit

Date: 2026-11-10. Branch: `1-medhavya-systems-enterprise-website-transformation`.

## Method and evidence

- Read the source of the app shell, home page, content layer, lead pipeline, header, proxy and config.
- Ran the existing checks before changing anything: `npm run typecheck` (pass). Then, after the changes in this branch: `eslint` (0 problems), `vitest` (29/29), `npm run build` (pass), `playwright test` (68 passed, 8 skipped by design, Desktop Chrome and Pixel 7).
- Later the same day: Lighthouse was run (doc 09) and six reference sites were inspected (doc 03). **Still not done:** a manual visual review in a real browser and screen-reader testing.

## Stack (preserved)

Next.js 16.4 (App Router, Cache Components), React 19.3, TypeScript strict, Tailwind v4, Zod 4, Vitest, Playwright + axe. The master prompt lists a Vite/React Router reference stack. It says that is not permission to replace an equivalent stable stack, so **no migration is planned**.

## Status legend

A Complete · B Needs improvement · C Incomplete · D Missing · E Defective · F Not applicable

## Inventory

| Feature | Files | Status | Notes / next action | Priority |
| --- | --- | --- | --- | --- |
| Header, mega menus, mobile menu, skip link | `components/layout/SiteHeader.tsx` | A | Keyboard and Escape tested by e2e. A search link was added in this branch. | Done |
| Footer | `components/layout/SiteFooter.tsx` | A | Services list now follows the content module automatically. | Done |
| Home page (10 sections, 3D hero) | `app/page.tsx`, `components/home/*` | B | Strong visually. Missing: trust/ecosystem section and FAQ. Home shows 3 of 9 services by design. | P2 |
| Product catalogue, filters, detail pages | `features/products`, `app/products` | A/B | Filtering works. No sorting, no comparison table. | P2 |
| Product / industry / service data model | `content/*`, `lib/content.ts` | A | CMS-ready. Content is static until Phase 6. | — |
| Services | `content/enterprise.ts`, `app/enterprise-solutions` | **C → improved** | Was 3 services. Now 9: added Web, Mobile, Cloud & DevOps, Data & Analytics, Consulting, Maintenance. "Enterprise software development" is covered by Custom Software, so it is not duplicated. | Done |
| Industries (10) | `content/industries.ts` | B | Hospitality, Real Estate and Government & Public Sector were added from generic industry knowledge and still need founder confirmation of scope and facts. "Business/Enterprise" and "Other" are covered by categories, not separate pages. | P2 |
| Solutions page | `app/solutions` | B | Organised by industry only. The prompt also asks for business function, organisation size and a solution finder. | P2 |
| Global search | `lib/search.ts`, `lib/search-index.ts`, `features/search`, `app/search` | **D → built** | Client-side ranked search over published content. Unit-tested. Static prerender preserved. | Done |
| Contact routing | `features/leads/schema.ts`, `app/contact` | **B → improved** | Enquiry types were 4. Now 8: Sales, Service, Support and Career added. | Done |
| Careers, Partners | `app/careers`, `app/partners` | **D → built** | No fake roles or partners. Both use the lead form with a fixed enquiry type. | Done |
| Lead pipeline security | `app/api/leads`, `features/leads` | A | Honeypot, rate limit, same-origin, size limit, dedupe, strict schema. | — |
| Lead storage | `features/leads/store.ts` | E (for production) | Local file store does not persist on serverless. Needs PostgreSQL. | P1 |
| Rate limiter | `lib/rate-limit.ts` | B | In-memory, single instance. Needs a shared store at scale. | P1 |
| SEO | `lib/seo.ts`, `sitemap.ts`, `robots.ts` | B | Canonical, OG, sitemap and robots exist. Missing: Organization and Breadcrumb JSON-LD, per-page OG images. | P2 |
| Accessibility | axe e2e on 10 pages | B | WCAG 2.2 AA axe scans pass. New pages (`/search`, `/careers`, `/partners`) are not yet in the axe list. | P1 |
| Cookie preferences / consent UI | — | D | Analytics facade is consent-gated, but there is no banner. Needed before any analytics provider. | P2 |
| Internationalisation | — | D | English only. No language switcher is shown, which is correct until translations exist. Country-aware phone validation is missing. | P3 |
| Resources: case studies, whitepapers, FAQs, events | `content/resources.ts` | C | 3 articles only. No verified case studies exist, so none are invented. | P3 |
| Product comparison, solution finder, ROI calculator | — | D | Only build with transparent assumptions. | P3 |
| AI assistant | — | D | Not built. A fake chatbot is forbidden. Needs an approved model provider, credentials and privacy review. | Blocked |
| WhatsApp / scheduling | — | D | Needs approved business number or scheduling provider. | Blocked |
| CMS / admin | — | D | Phase 6 (Payload + PostgreSQL). Needs Docker or a Postgres URL. | P1 |
| Tests | `tests/*` | B | Good journey and API coverage. Search, careers and partners journeys still need e2e. | P1 |
| Legal pages | `app/privacy`, `terms`, `cookies`, `accessibility` | C | Marked "Draft pending legal review". | Blocked on legal |

## Technical debt

1. Lead store and rate limiter are not production-safe.
2. Static content means every copy change needs a deploy.
3. All product facts are demo content (`isDemo: true`).
4. `next typegen` must run before `tsc` (already in `npm run typecheck`).
5. The 3D hero and visuals are CSS-heavy. Their cost on low-end devices has not been measured.
