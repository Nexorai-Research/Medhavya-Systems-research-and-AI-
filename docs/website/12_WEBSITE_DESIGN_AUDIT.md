# 12 — Website design audit (visual experience, interaction, consistency)

Status: **Phase 0–1 complete (discovery). Phase 2+ in progress.** Written 2026-11-24. Everything below was read from the repository; items not yet inspected are marked _not audited_. Nothing here is a performance or accessibility measurement — see `15_DESIGN_QA_REPORT.md` for what has actually been run.

## 1. Stack (G1)

| Area | Finding |
| --- | --- |
| Framework | Next.js 16 App Router, React 19.3, TypeScript. `AGENTS.md` warns Next APIs differ from training data; read `node_modules/next/dist/docs/` before using Next-specific APIs. |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/app/(site)/globals.css`), plain CSS for visuals (`src/components/visuals/visuals.css`, `src/components/home/hero/hero.css`). No component library. |
| Fonts | Geist Sans / Geist Mono via `next/font/google`. |
| Motion | No animation library. Pure-CSS scroll-driven reveals (`[data-reveal]`), React `ViewTransition` in `src/app/(site)/template.tsx`, pointer spotlight + parallax variables in `MotionEffects.tsx`, 3D camera in `Stage3D.tsx`. All gated by `prefers-reduced-motion`. |
| CMS | Payload CMS under `src/app/(payload)` (admin UI, out of scope for visual work). |
| Hosting | Cloudflare via OpenNext (`wrangler.jsonc`), also a `Dockerfile`. |
| Checks | `npm run check` = typecheck + lint + vitest + build. Playwright e2e (axe WCAG 2.2 AA on 16 pages, desktop + Pixel 7) runs against a **production build** on port 3100. |
| Formatting | `npm run format` runs `prettier --write .` but **the repo has no Prettier config**; files are hand-formatted at ~180 columns. Running it reformats the whole repo at 80 columns. Do not run it. |

## 2. Route inventory (G2)

Public site, `src/app/(site)` — **24 page routes**:

`/`, `/about`, `/accessibility`, `/careers`, `/compare-products`, `/contact`, `/cookies`, `/enterprise-solutions`, `/enterprise-solutions/[slug]`, `/industries`, `/industries/[slug]`, `/partners`, `/privacy`, `/product-categories/[slug]`, `/products`, `/products/[slug]`, `/request-demo`, `/resources`, `/resources/blog/[slug]`, `/search`, `/security`, `/solutions`, `/technology`, `/terms`.

Also: `(site)/error.tsx`, `(site)/not-found.tsx`, `(site)/template.tsx`, `(site)/layout.tsx` (header, footer, skip link, JSON-LD).
Admin: `/admin/[[...segments]]` (Payload, 1 page). API: `/api/health`, `/api/leads`, `/api/categories`, `/api/products`, `/api/products/[slug]`, `/cms-api/[...slug]` — **no UI, out of scope**.
Authenticated routes (public site): none found. Payload admin has its own auth and is not restyled.

Dynamic instances (counted from `slug:` occurrences in `src/content`, approximate until confirmed against `generateStaticParams`): products 10, categories 8, industries 10, enterprise services ≈9, blog posts 3.

Shared components: `src/components/{layout/SiteHeader,layout/SiteFooter,PageHero,CtaBand,Faq,ProductCard,ProductMockup,CategoryIcon,CookiePreferences,LegalDraft,JsonLd}`, `ui/{Button,Badges,Section}`, `home/*`, `visuals/*`, `motion/MotionEffects`, features `compare/finder/leads/products/search`.

## 3. Page coverage matrix (G17)

Statuses use the vocabulary in the brief. "Audited" means the source was read; none of these has had a full visual + responsive + axe review in this pass.

| Route | Layout | Status | Notes |
| --- | --- | --- | --- |
| `/products/[slug]` (Agro360AI only) | site | **IMPLEMENTED** (not VERIFIED) | Hero video background, 3D hero visual, feature cards with per-feature hover video. Verified in desktop Chrome only. |
| Header / footer (all routes) | site | NOT STARTED | Footer now shows the support email once `site.contact.email` is set (done, unverified in browser). |
| All other 23 routes | site | NOT STARTED | Source not yet audited for token or card consistency. |

## 4. Findings so far

Evidence-backed:

1. **Dark mode is not supported by the architecture.** `:root { color-scheme: light }`, no dark tokens, no theme switch, `themeColor: "#F6F8FC"`. Adding it is a cross-cutting architecture change (tokens, ~every component, charts, 3D visuals). **Needs approval before starting** (brief: "where supported").
2. **Video fallbacks were incomplete** (found in this pass, fixed): the hero video was hidden for reduced-motion users, and the hero/feature-card text had been switched to white, which left white-on-light text if the video was hidden, slow or failed. Fixed: dark base colour under both video layers; hero shows the first frame (no playback) for reduced-motion and Save-Data; hero pauses off-screen and when the tab is hidden.
3. **Hero video source is low resolution.** `public/videos/agro360ai-hero.mp4` is 768x432 (a WhatsApp export). There is no poster image and no ffmpeg in this environment to generate one.
4. **Only one product has video.** The hero and feature-card video are opt-in per slug (`heroVideos`, `featureVideos` in `products/[slug]/page.tsx`); the other nine products keep the plain layout, which is intentional for now.
5. **Page transitions, scroll reveal, parallax (pointer-driven), spotlight, 3D stages already exist** and respect `prefers-reduced-motion`. Scroll-linked (scroll-position) parallax is **not** implemented; only pointer parallax and the CSS-driven reveal exist.
6. Hero text on the video page is white with a dark text-shadow; contrast over arbitrary frames is **not measured**.

Not yet audited (open): typography consistency per page, card variants across pages, sticky header behaviour on mobile, forms' validation/loading/success states, empty/error states, responsive behaviour at the seven target breakpoints, Lighthouse/Core Web Vitals.

## 5. Risks to existing functionality

- Changes so far are confined to the product page, `HeroVideoBackground`, `CardHoverVideo`, `PageVisuals.ProductHeroVisual`, `ProductMockup` (one optional prop) and `site.ts` (contact email). `ProductHeroVisual` is shared by every product page: its floating cards moved to new positions for all products and have **not** been checked on the other nine.
- `featureVideos`/`heroVideos` do not affect other slugs.
- No backend, API, schema or auth file was touched.
