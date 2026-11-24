# 14 — Design implementation tracker

Updated 2026-11-24. Statuses: NOT STARTED / IN PROGRESS / IMPLEMENTED / VERIFIED / BLOCKED. VERIFIED requires design, function, responsive, accessibility and relevant tests all checked; nothing is VERIFIED yet.

## Completion gates

| Gate | Status | Evidence / reason |
| --- | --- | --- |
| G1 Repository discovery | PASSED | `12_WEBSITE_DESIGN_AUDIT.md` §1 |
| G2 Page and route inventory | PASSED (counts of dynamic instances approximate) | Audit §2 |
| G3 Design system consistency | IN PROGRESS | Existing tokens documented; per-page token audit not done |
| G4 Typography consistency | NOT STARTED | |
| G5 Responsive coverage | NOT STARTED | Only desktop Chrome seen, one page |
| G6 Parallax where justified | NOT STARTED | Pointer parallax exists; scroll parallax not added |
| G7 Micro-interaction coverage | IN PROGRESS | Existing hover/focus/spotlight; card hover video added on one product |
| G8 Video background optimisation | IN PROGRESS | Fallbacks added; no poster image (no ffmpeg); untested in browser |
| G9 Card design consistency | NOT STARTED | Feature cards on one product restyled; others untouched |
| G10 Page transitions | NOT STARTED | `ViewTransition` template exists; not reviewed |
| G11 Sticky elements | NOT STARTED | |
| G12 Dark mode | BLOCKED | Not supported by current architecture; needs approval |
| G13 Accessibility | NOT STARTED | Existing axe spec not run; changed page not in it |
| G14 Cross-browser | NOT STARTED | |
| G15 Performance | NOT STARTED | No measurements |
| G16 Regression testing | IN PROGRESS | tsc, eslint (partial), vitest PASS; build and e2e NOT RUN |
| G17 Page-by-page completeness | NOT STARTED | 0 of 24 routes VERIFIED |
| G18 Final traceability review | NOT STARTED | |

## Traceability (changes made so far)

| Requirement | Pages | Components / files | Tests / evidence |
| --- | --- | --- | --- |
| Video background (4.1) | `/products/medhavya-agro` | `visuals/HeroVideoBackground.tsx`, `public/videos/agro360ai-hero.mp4` | tsc/eslint; desktop Chrome playback seen (earlier state) |
| Card interaction + video (3.2, 4.2) | `/products/medhavya-agro` | `visuals/CardHoverVideo.tsx`, `products/[slug]/page.tsx` (`featureVideos`), `public/videos/features/*.mp4` | Desktop Chrome: hover plays one card, others paused, 6/6 loaded |
| Hero visual layout | every `/products/[slug]` | `visuals/PageVisuals.tsx` (`ProductHeroVisual`), `ProductMockup.tsx` | Seen on Agro360AI only; **other 9 products not checked** |
| Hero video on home and every published product (4.1, 3.1) | `/`, `/products/{agro, mediai, crm, manage, autoflow, finsight, erp, edusphere, logitrack}` | `lib/hero-videos.ts`, `visuals/HeroVideoBackground.tsx` (`HeroVideoLayer`, `TextSide`), `home/hero/HeroStage.tsx` + `hero.css`, `globals.css` (scroll parallax + drift), `public/videos/heroes/*` (11 files) | tsc, eslint (all `src`), vitest 57/57; desktop Chrome: home (crossfade Agro→MediAI→LogiTrack seen), MediAI, CRM, ERP, EduSphere screenshots. FinSight, Manage, AutoFlow, LogiTrack product pages: page 200 + clip served, **not viewed** |
| Contact email | `/contact`, footer on all pages | `src/content/site.ts` | tsc; not viewed in browser |

## Next stages (not started)

1. Run `npm run build` and the Playwright suite on a machine with enough free RAM; add `/products/medhavya-agro` to the axe page list.
2. Audit `SiteHeader`, `SiteFooter`, `PageHero`, `Button`, `Section` against `05_DESIGN_SYSTEM.md`; then card variants (`ProductCard`, feature/industry/service cards).
3. Page-by-page pass over the other 23 routes, recording status here.
4. Decide on dark mode (approval needed) and scroll parallax scope.
