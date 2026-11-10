# Implementation Report — Phases 0–5, 7–9 (partial 8)

Date: 2026-10-31

## Phase 0: Discovery

- The workspace contained only the five master documents and a logo (`Logo of System.jpeg`). There was no existing code and no git repository.
- Following Module 03 defaults, the site was scaffolded with `create-next-app` (Next.js 16.4.3, React 19.3, TypeScript, Tailwind v4).
- Environment: Node 24, npm 11. Docker is installed but its daemon was **not running**, and PostgreSQL is not installed.

## Architecture decisions

| ADR | Decision |
| --- | --- |
| ADR-001 | Next.js/TypeScript baseline, adopted. Cache Components is enabled (scaffold default); public pages are prerendered. |
| ADR-002 | **Deferred, which deviates from the docs:** Payload CMS + PostgreSQL. No database was available, so content lives in typed modules under `src/content`, using the collection shapes from Module 04. All reads go through `src/lib/content.ts`, so Payload can replace that layer without changing pages. |
| ADR-003 | Modular monolith, adopted. |
| ADR-006 | Integrations go through adapters: `LeadRepository` (local file store now, Postgres later) and `LeadNotifier` (console/none now, email/CRM later). |
| ADR-008 (new) | Framer Motion is not used. Motion is pure CSS, which keeps bundles small and is fully disabled under `prefers-reduced-motion`. |
| ADR-009 (new) | `src/proxy.ts` returns real 404s for unknown slugs. With Cache Components, the fallback shell would otherwise return 200. |
| ADR-010 (new) | The logo's gold (#D4A038) is added as a decorative accent. Text uses `gold-ink` (#8A6416) for contrast. |

## Implemented

- **Creative system:** design tokens, logo lockup (the supplied mark is cropped and given a transparent background, with an HTML wordmark), favicon and Apple icon, buttons, badges, a header with keyboard-accessible mega menus and a mobile menu, the footer, and motion primitives.
- **Pages:** Home (all 10 sections from Module 01 §8), Products catalogue (search, category and lifecycle filters), 9 product detail pages, 8 category pages, Solutions, Industries plus 10 industry pages, Enterprise Solutions plus 3 service pages (capability matrix, lifecycle, engagement model, governance, consultation form), Technology, Security, Resources plus 3 articles, About, Contact, Request Demo, 4 legal draft pages, 404 and error pages.
- **Products** (names supplied by the company; all marked as demo): Medhavya Agro, Medhavya CRM, Medhavya Manage, Medhavya AutoFlow, Medhavya FinSight, Medhavya ERP, Medhavya EduSphere, MediAI and Medhavya LogiTrack. One draft (Medhavya HRMS) verifies that drafts are never public. No demo product is marked "Generally Available".
- **Leads:** shared Zod schema with strict rejection of privileged fields, honeypot, IP rate limit, 16 KB body limit, same-origin check, de-duplication, an opaque reference number, and field-level errors. The privacy acknowledgement and marketing opt-in are separate.
- **APIs:** `GET /api/products` (filters and pagination), `GET /api/products/{slug}`, `GET /api/categories`. Only published records are returned, and governance fields are stripped.
- **SEO and security:** per-page metadata with canonical URLs, sitemap.xml, and robots.txt (noindex unless `SITE_INDEXABLE=true`). Product pages carry SoftwareApplication JSON-LD. Security headers include CSP, frame-ancestors none, nosniff, a Referrer-Policy, a Permissions-Policy and HSTS in production. The `X-Powered-By` header is removed.
- **Privacy:** the analytics facade drops events unless a provider is configured and the visitor has consented, and it strips personal fields. Logs redact personal fields and record only opaque references.

## Motion and interaction finish ("Intelligence in Motion")

All motion follows Module 02 §9: it is purposeful, there is no scroll hijacking and no particles, and everything is disabled under `prefers-reduced-motion`.

| Effect | Technique |
| --- | --- |
| Page transitions (fade and rise; header stays put) | React `<ViewTransition>` in `app/template.tsx` |
| Product name morphs from its card into the product page heading | Shared `ViewTransition` name |
| Showcase tabs: sliding active surface and panel crossfade | `ViewTransition` + `startTransition` |
| Catalogue cards glide to new positions when filtering | Per-card `ViewTransition` |
| Scroll reveals, staggered list items, eyebrow rule, chart line drawing, process timeline fill, header reading-progress bar | CSS scroll-driven animations (`animation-timeline: view()/scroll()`). No JS, and no hydration coupling. |
| Hero: word-by-word headline, underline draw, staggered copy | CSS keyframes |
| Hero 3D stage (`components/home/hero/`): perspective camera that tilts with the pointer and sways when idle; stacked platform core; floating logo orb; panels at different depths with float animation and contact shadows; grid floor; rotating orbit rings | CSS 3D (`preserve-3d`) + one rAF loop that pauses off-screen |
| Headline word flips through "farms / hospitals / sales teams / schools / enterprises / supply chains", synced with the matching product. Screen readers get one stable sentence. | React state + CSS 3D flip |
| Product story animations on hover/focus or during the story cycle: Agro (sun, rain, sprouts), MediAI (ECG, heartbeat), CRM (contacts to a won deal), EduSphere (3D page flip, cap toss), ERP (stacking 3D blocks), LogiTrack (truck drives the route, pin drops) | SVG/CSS + SMIL `animateMotion` (`ProductVignette.tsx`) |
| Mobile: synced product spotlight card with the same animations and a progress indicator | `HeroStage` |
| Inner-page 3D heroes (`components/visuals/`): a reusable `Stage3D` camera plus page-specific scenes. Fanned deck (Products, Resources, Solutions); 3D concept UI with popped-out tiles and story animation (product pages); glass monolith with orbiting products (category and industry pages); exploded architecture stack with layers lighting in sequence (Technology, Enterprise, service pages focus their layer); layered shield with scan line (Security); wave mosaic (Industries); brand orbit (About); floating conversation and paper plane (Contact, Demo) | CSS 3D using the individual `translate` property for depth |
| Story animations for FinSight (candles, trend, scan), AutoFlow (documents through the AI gear, approved) and Manage (barcode scan, stock bars, sale) | `ProductVignette.tsx` |
| Section upgrades: live workflow pipeline, glowing feature cards, smooth FAQ open (`::details-content`), form focus glow and animated success state | CSS |
| Cursor spotlight (dark cards, CTA), gradient border (logo colours), button shine, row hover sweep | CSS + pointer variables |
| Footer outlined "MEDHAVYA" wordmark | CSS text stroke |

Browsers without View Transitions or scroll-driven animation support show the content normally, with no animation.

## Commands run and results

| Command | Result |
| --- | --- |
| `npx tsc --noEmit` | Pass |
| `npx eslint src` | Pass (0 problems) |
| `npm run build` | Pass, with no warnings. All public pages are static or prerendered. |
| `npx vitest run` | **24/24 passed** (4 files: lead schema, content and publication, rate limit and analytics, lead service integration) |
| `npx playwright test` | **48 passed, 8 skipped** (the skips are device-specific checks that run in the other project). Desktop Chrome and Pixel 7. |

The E2E suite covers:
- Home, catalogue filtering, product detail, category pages and the draft-product 404
- Demo request (validation errors, then success) and enterprise consultation submission
- API boundaries: privileged fields, invalid input, oversized bodies and cross-origin requests are rejected
- Catalogue API publication filtering and security headers
- axe scans (WCAG 2.2 AA tags) on 10 pages
- Skip link, menu keyboard and Escape behaviour, the mobile menu, and no horizontal overflow at 360, 390, 768, 1024 and 1280 px

Bugs found by tests and fixed:
1. A filled honeypot returned a 400 instead of being dropped silently.
2. Unknown slugs returned a soft 404 (status 200).
3. The contact page's `<dl>` markup was invalid (axe).
4. A 6 px horizontal overflow at 360 px.

## Not yet done

- **Phase 6, CMS/admin:** Payload CMS, PostgreSQL, roles (Super Admin, Content Admin, Editor, Reviewer, Sales, Analyst), the draft → review → publish workflow, the `/admin` route and lead administration. Docker must be running, or a Postgres URL provided.
- The in-memory rate limiter is single-instance only. Production with several instances needs a shared store.
- No cookie consent banner, because no analytics provider is configured yet.
- **Phase 10:** deployment, monitoring, backups. This needs approval of the domain, hosting and region.

## Needs company input before launch

1. Real product facts for each product: lifecycle status, features, deployment, integrations and support. Then set `isDemo: false`.
2. Real product screenshots, to replace the illustrative concept UIs.
3. Confirmation of the enterprise service scope and boundaries.
4. Contact email, phone, address and office hours, plus confirmation of the "two business days" reply target.
5. Founder or company story, and approved social profiles.
6. Legal review of Privacy (DPDP), Terms, Cookies and Accessibility. These pages currently show "Draft pending legal review".
7. An approved SVG logo, if available. The mark is currently derived from the supplied JPEG.
8. Domain, hosting region, data residency and backup RPO/RTO (ADR-007).
9. Email/CRM provider for lead notifications, and an analytics provider.
10. Approval of the tagline "Intelligent software. Practical impact." It is not trademark-cleared.

## Recommended next step

Phase 6: start Docker Desktop and add Payload CMS with PostgreSQL. Then migrate `src/content` into collections and the lead store into a `leads` table with role-based access.
