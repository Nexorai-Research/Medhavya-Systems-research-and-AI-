# Medhavya Systems — AI · Research · Technology

> **Intelligent software. Practical impact.**

Corporate website and product showcase for **Medhavya Systems** (Nexorai Research). It presents the company's software products, industry solutions and enterprise services, and captures demo and consultation leads.

Creative concept: **"Intelligence in Motion"**. It has a premium light canvas, navy typography, blue and cyan accents, and gold taken from the company logo.

> **Status:** Phases 0–9 are complete (CMS, admin and PostgreSQL included). Phase 10 deployment tooling is ready (Dockerfile, health check, CI, backups, [runbook](docs/website/11_DEPLOYMENT_RUNBOOK.md)); going live needs a domain, hosting and region from the company. All product listings are **demo content** pending company approval. See [Roadmap](#roadmap).

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Quick start](#quick-start)
3. [Scripts](#scripts)
4. [Products and projects](#products-and-projects)
5. [Site map](#site-map)
6. [Project structure](#project-structure)
7. [Architecture](#architecture)
8. [Leads pipeline](#leads-pipeline)
9. [Public API](#public-api)
10. [Security and privacy](#security-and-privacy)
11. [Testing](#testing)
12. [Editing content](#editing-content)
13. [Environment variables](#environment-variables)
14. [Roadmap](#roadmap)
15. [Needs company input before launch](#needs-company-input-before-launch)

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Cache Components, partial prefetching) |
| UI | React 19.3, Tailwind CSS v4, Lucide icons |
| Language | TypeScript (strict) |
| Validation | Zod 4 |
| Motion | Pure CSS: View Transitions, scroll-driven animations, CSS 3D. No Framer Motion. |
| Testing | Vitest (unit and integration), Playwright + axe-core (E2E and accessibility) |
| Tooling | ESLint 9, Prettier |

> **Note for contributors:** this Next.js version has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing framework code (see `AGENTS.md`).

## Quick start

Requirements: Node.js 24 and npm 11.

```bash
npm install
cp .env.example .env.local     # optional: every value has a safe local default
npm run dev                    # http://localhost:3000
```

### CMS and database (Phase 6)

Requires Docker Desktop (or any PostgreSQL 16 and a `DATABASE_URL`).

```bash
npm run db:up                  # PostgreSQL in Docker on 127.0.0.1:5440
# put DATABASE_URL and PAYLOAD_SECRET in .env.local (see .env.example)
npm run cms:migrate            # create the schema
npm run cms:seed               # load src/content into the CMS (idempotent)
npm run dev                    # CMS admin: http://localhost:3000/admin
```

The first account created at `/admin` becomes the Super Admin.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | Generate route types, then `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:watch` | Unit and integration tests (Vitest) |
| `npm run test:e2e` | E2E, accessibility and responsive tests (Playwright). Run `npm run build` first, and `npx playwright install chromium` once. |
| `npm run check` | typecheck → lint → test → build |
| `npm run format` | Prettier |
| `npm run db:up` / `db:down` | Start / stop the local PostgreSQL container |
| `npm run cms:migrate` | Apply database migrations. `npm run cms:migrate:create -- <name>` generates one after a schema change |
| `npm run cms:seed` | Load `src/content` into the CMS (skips records that already exist) |
| `npm run cms:publish` | Export CMS content to `src/content/cms-snapshot.json`; rebuild the site afterwards |
| `npm run brand:assets` | Regenerate the mark, transparent logo and app icons from `public/brand/medhavya-logo-full.jpeg` |

## Products and projects

Product names were supplied by the company. **All listings are marked as demo** until the facts are approved, and no product is shown as "Generally Available".

| Product | Category | Summary | Stage |
| --- | --- | --- | --- |
| **Medhavya Agro** | Agriculture | Season planning, field records and advisory workflows for farms and producer organisations | Private Pilot |
| **Medhavya CRM** | Retail & Business | Leads, customers, follow-ups and sales pipelines for growing teams | Beta |
| **Medhavya Manage** | Retail & Business | Billing, inventory, staff and daily reporting for small and mid-sized businesses | Private Pilot |
| **Medhavya AutoFlow** | AI & Automation | Document intelligence and workflow automation with human review built in | In Development |
| **Medhavya FinSight** | Financial Intelligence | Portfolio analytics, market research workspace and risk monitoring | Research |
| **Medhavya ERP** | Enterprise | Finance, procurement, inventory and HR on one connected platform | In Development |
| **Medhavya EduSphere** | Education | School management: admissions, academics, attendance, fees and parent communication | Beta |
| **MediAI** | Healthcare | AI-assisted clinical documentation and patient-flow visibility for clinics and hospitals | In Development |
| **Medhavya LogiTrack** | Other Industry | Dispatch, live shipment tracking and proof of delivery for logistics teams | In Development |
| *Medhavya HRMS* | Enterprise | **Draft** record that verifies unpublished content never appears publicly | Research |

**Product categories (8):** Agriculture Software · Retail & Business Software · AI & Automation · Financial Intelligence & Trading · Enterprise Software · Education Software · Healthcare Software · Other Industry Solutions.

**Industries (10):** Agriculture · Healthcare · Education · Retail & Distribution · Logistics · Manufacturing · Financial Services · Hospitality · Real Estate · Government & Public Sector. The last three were added from generic industry knowledge and still need founder confirmation of scope and facts. "Business/Enterprise" and "Other" remain covered by categories, not separate pages.

**Enterprise services (3):** Custom Software · AI & Automation · Integration & Modernization. Each has a capability matrix, lifecycle, engagement model, governance section and a consultation form.

## Site map

| Route | Description |
| --- | --- |
| `/` | Home: 3D hero stage, product showcase and 10 sections |
| `/products`, `/products/[slug]` | Catalogue with search, category and lifecycle filters; product detail pages |
| `/product-categories/[slug]` | Category pages |
| `/solutions` | Solutions overview |
| `/industries`, `/industries/[slug]` | Industry pages |
| `/enterprise-solutions`, `/enterprise-solutions/[slug]` | Service pages |
| `/technology`, `/security` | How the company builds, and its security practices |
| `/resources`, `/resources/blog/[slug]` | Articles |
| `/about`, `/contact`, `/request-demo` | Company, contact and demo request |
| `/privacy`, `/terms`, `/cookies`, `/accessibility` | Legal pages (draft, pending legal review) |
| `/sitemap.xml`, `/robots.txt` | SEO (noindex unless `SITE_INDEXABLE=true`) |

## Project structure

```
src/app/(site)/          Website routes and layout
src/app/(payload)/       CMS admin (`/admin`) and CMS REST API (`/cms-api`)
src/app/api/             Public API route handlers (products, categories, leads)
src/cms/                 Payload collections, roles/access rules, publication workflow, content mappers
src/payload.config.ts    CMS configuration
migrations/              Database migrations
docker-compose.yml       Local PostgreSQL
Dockerfile, ops/         Production image; backup and restore scripts
.github/workflows/       CI
src/proxy.ts             Real 404s for unknown or unpublished slugs
src/components/          Shared UI: layout, brand, home (3D hero), ui primitives, visuals, motion
src/content/             Typed content records (CMS-ready shapes)
src/features/products/   Catalogue filtering and browser
src/features/leads/      Zod schema, service, store and notifier adapters, form
src/lib/                 Env validation, content queries, SEO, logging, rate limit, analytics
tests/                   unit, integration, e2e
docs/                    ADRs and the implementation report
scripts/                 Brand assets; CMS migrate, seed and publish scripts
public/brand/            Logo assets
```

## Architecture

- **Modular monolith**: one Next.js app with feature modules.
- **Content layer**: all reads go through `src/lib/content.ts`. Content currently lives in typed modules, so Payload CMS can replace that layer later without changing the pages.
- **Adapters**: `LeadRepository` (local file store now, PostgreSQL later) and `LeadNotifier` (console or none now, email or CRM later).
- **Real 404s**: with Cache Components, unknown dynamic params would otherwise return 200. `src/proxy.ts` rewrites them to an unmatched path.
- **Motion**: purposeful, with no scroll hijacking, and fully disabled under `prefers-reduced-motion`. Browsers without View Transitions or scroll-driven animations show the content without animation.

The full decision log (ADR-001 to ADR-010) is in [`docs/IMPLEMENTATION_REPORT.md`](docs/IMPLEMENTATION_REPORT.md).

## Leads pipeline

`POST /api/leads` runs: **validate → honeypot → rate limit → de-duplicate → persist → notify**.

- Shared Zod schema that rejects privileged fields.
- A filled honeypot gets a fake success and nothing is stored.
- IP rate limit, 16 KB body limit and a same-origin check.
- De-duplication within 10 minutes, and an opaque reference number.
- The privacy acknowledgement and marketing opt-in are separate.
- Locally, leads are written to `.data/leads.ndjson`. This is git-ignored because it contains personal data.

## Public API

| Endpoint | Description |
| --- | --- |
| `GET /api/products` | Filters and pagination. Published records only. |
| `GET /api/products/{slug}` | Single product. Governance fields are stripped. |
| `GET /api/categories` | Categories |
| `POST /api/leads` | Submit a demo request or consultation enquiry |

API responses are sent with `Cache-Control: no-store`.

## Security and privacy

- Headers: CSP, `frame-ancestors 'none'`, `nosniff`, Referrer-Policy, Permissions-Policy, HSTS (production only), and no `X-Powered-By`.
- The analytics facade drops events unless a provider is configured and the visitor has consented. It strips personal fields.
- Logs redact personal fields and record opaque references only.
- Drafts and unpublished records are never served.

## Testing

| Suite | Coverage |
| --- | --- |
| Vitest (24 tests) | Lead schema, content and publication rules, rate limit and analytics, lead service integration |
| Playwright (Desktop Chrome and Pixel 7) | Home, catalogue filtering, product and category pages, draft 404, demo and consultation submissions, API boundaries, security headers |
| axe (WCAG 2.2 AA) | 10 pages, plus keyboard and skip-link behaviour and no horizontal overflow at 360–1280 px |

## Editing content

Products, categories, industries, services and articles are edited in the CMS at `/admin`. The public site is built from `src/content/cms-snapshot.json`, which `npm run cms:publish` exports from the database. After publishing in the CMS: run `npm run cms:publish`, commit the snapshot and rebuild (or set `DEPLOY_HOOK_URL` so the CMS asks your host to rebuild after each change). The typed modules in `src/content/*.ts` are the seed source only.

**Roles:** Super Admin (everything), Content Admin (content, any transition), Editor (create and edit; Draft or In Review only), Reviewer (approve or send back records In Review), Sales (leads), Analyst (read-only leads without personal fields).

- `publication` controls visibility. Only `"Published"` records appear publicly.
- `lifecycle` is the honest product stage, shown on every listing. It is separate from publication.
- `isDemo: true` shows a "Demo listing" badge and banner. Set it to `false` only after founder approval of the facts.
- Company contact details are in `src/content/site.ts`. Missing values are `null` and are never shown as if verified.

## Environment variables

Copy `.env.example` to `.env.local`.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical links, sitemap and Open Graph |
| `SITE_INDEXABLE` | `false` | Set `true` only on the approved production domain |
| `DATABASE_URL` | none | PostgreSQL connection string. When set, leads are stored in PostgreSQL and `/admin` works. When empty, the local file store is used |
| `PAYLOAD_SECRET` | dev placeholder | Signs CMS sessions. **Required in production** |
| `DEPLOY_HOOK_URL` | none | Optional; POSTed after content changes so the host can rebuild |
| `LEAD_STORE_DIR` | `.data` | Local lead store when `DATABASE_URL` is empty (development only) |
| `LEAD_NOTIFIER` | `console` | `console`, `none` or `webhook` |
| `LEAD_WEBHOOK_URL` | none | Required for `webhook`; https (http only for localhost/127.0.0.1). Receives enquiry data as JSON |
| `LEAD_WEBHOOK_SECRET` | none | Optional; signs the body as `X-Medhavya-Signature: sha256=<hex HMAC>` |
| `LEAD_RATE_LIMIT_PER_10_MIN` | `5` | Submissions per IP per 10 minutes |

## Roadmap

- [x] Phases 0–5: discovery, architecture, design system, pages, products, leads, SEO and security
- [x] Phases 7–9: motion and 3D finish, testing and accessibility
- [x] **Phase 6:** Payload CMS + PostgreSQL, six roles, a draft → review → publish workflow, `/admin` and lead administration
- [x] **Phase 10 (preparation):** Dockerfile, `/api/health`, CI workflow, backup and restore scripts, runbook
- [ ] **Phase 10 (go-live):** needs an approved domain, hosting, region and backup targets
- [x] Shared rate-limit store (PostgreSQL; in-memory fallback)
- [ ] Cookie consent banner, once an analytics provider is chosen

> The local file lead store does not persist on serverless hosting. Set `DATABASE_URL` (PostgreSQL) in production.

## Needs company input before launch

1. Real product facts: lifecycle, features, deployment, integrations and support. Then set `isDemo: false`.
2. Real product screenshots to replace the illustrative concept UIs.
3. Confirmation of the enterprise service scope.
4. Contact email, phone, address and hours, and confirmation of the "two business days" reply target.
5. Founder or company story, and approved social profiles.
6. Legal review of Privacy (DPDP), Terms, Cookies and Accessibility.
7. An approved SVG logo (the mark is currently derived from the supplied JPEG).
8. Domain, hosting region, data residency and backup RPO/RTO.
9. Email/CRM provider for lead notifications, and an analytics provider.
10. Trademark clearance for the tagline "Intelligent software. Practical impact."

---

© Medhavya Systems. All rights reserved.
