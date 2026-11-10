# 07 — Feature Implementation Matrix

Status: **Done** (code + passing automated test) · **Partial** · **Blocked** (needs a decision, account or data) · **Not built** (deliberately).

| Brief requirement | Status | Implementation | Test evidence |
| --- | --- | --- | --- |
| Responsive header, mega menus, mobile menu, keyboard use, active states | Done | `SiteHeader.tsx` | e2e: menu keyboard/Escape, mobile menu, overflow at 360–1280 px |
| Global search with suggestions and results page | Done | `lib/search*.ts`, `features/search`, `app/search` | `tests/unit/search.test.ts`, e2e search journey |
| Breadcrumbs | Done | `PageHero.tsx` | axe scans |
| Category filters, search, sorting | Done | `CatalogueBrowser.tsx` | e2e catalogue filtering |
| Product comparison | Done | `features/compare` | `compare.test.ts`, 3 e2e tests |
| Product detail pages from structured data | Done | `content/products.ts`, `app/products/[slug]` | e2e product journey |
| Solution finder | Done | `features/finder` | `finder.test.ts`, e2e |
| Services (11 listed in the brief) | Partial | 9 service pages. "Enterprise software development" is covered by Custom Software | build prerenders all 9 |
| Industries (13 listed in the brief) | Partial | 7 pages. Hospitality, Real Estate, Government, plus "Business/Enterprise" and "Other" are not separate pages | Blocked on founder scope |
| Resources: blog and articles | Partial | 3 articles | e2e article axe scan |
| Resources: case studies, whitepapers, reports, webinars | Blocked | No verified material exists | — |
| Careers and Partners | Done | `app/careers`, `app/partners` (no invented roles or partners) | axe, e2e careers submission |
| Contact routing by enquiry type | Done | 8 enquiry types in `features/leads/schema.ts` | `lead-schema.test.ts`, lead e2e |
| Lead forms, validation, spam and duplicate protection | Done | `app/api/leads`, `features/leads/*` | 24+ unit/integration tests, API e2e |
| Newsletter subscription | Not built | Needs an email provider and a consent flow | — |
| Downloadable resources | Not built | No documents exist | — |
| WhatsApp, click-to-call, scheduling | Blocked | `site.contact` values are `null` until approved | — |
| ROI calculator | Not built | No evidence for assumptions; a fake calculator would mislead | — |
| AI assistant, natural-language search | Blocked | Needs a model provider, credentials and a privacy review. Not faked. | — |
| Cookie preferences | Done (UI), no analytics yet | `CookiePreferences.tsx` | e2e opens, saves and closes the dialog |
| i18n | Blocked | Needs approved translations. No switcher is shown. | — |
| Country-aware phone validation | Done | `isPlausiblePhone` | `lead-schema.test.ts` |
| SEO metadata, sitemap, robots | Done | `lib/seo.ts`, `sitemap.ts`, `robots.ts` | e2e headers |
| Organization, Breadcrumb, FAQPage, SoftwareApplication JSON-LD | Done | `JsonLd.tsx`, pages | build |
| Per-page social preview images | Done | `lib/og.tsx` + `opengraph-image` routes | build prerenders `/opengraph-image` and product images |
| Legal pages | Partial | Drafts marked pending legal review | — |
| CMS / admin | Blocked | Payload + PostgreSQL need Docker or a database URL | — |
| Deployment, monitoring, backups | Blocked | Domain, hosting region and data residency undecided | — |
