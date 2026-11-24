# 15 — Design QA report

Written 2026-11-24. Only commands actually run are listed as run; everything else is NOT RUN. No Lighthouse, Core Web Vitals, cross-browser or e2e figures exist yet, and none are claimed.

## Verification executed

| Check | Result | Notes |
| --- | --- | --- |
| `tsc --noEmit` | PASS | After the final change in this pass. |
| `eslint` on `src/components/visuals`, `products/[slug]/page.tsx`, `src/content/site.ts` | PASS (no output) | Not run repo-wide in this pass. |
| `vitest run` | PASS — 11 files, 57 tests | Unit/integration only; none cover the changed visual components. |
| Manual desktop Chrome check (earlier in the session) | Partly done | Hero video plays; hero visual cards no longer cover sidebar/caption; feature-card hover plays only the hovered card; all six card videos load without error after a load-queue fix. Window ≈1520 px wide. |

| Hero video pass (home + 9 products), desktop Chrome ~1520 px | Partly done | Viewed: home, MediAI, CRM, ERP, EduSphere. All 13 clip URLs return 206 `video/mp4`. Home hero: videos mount lazily and crossfade; all six confirmed loaded. Fixed during check: gradient-clipped headline word turned grey (inherited text-shadow) |
| `eslint src` (whole tree) and `vitest run` after the hero pass | PASS | 57/57 tests |

## Not run

| Check | Why |
| --- | --- |
| `next build` | Machine had ~740 MB free RAM; a dev server had already been killed once by the memory guard. |
| Playwright e2e + axe (desktop + Pixel 7) | Needs a production build first (see above). Existing spec covers 16 pages; the Agro360AI product page is **not** in it (it covers `/products/mediai`). |
| Lighthouse / LCP / INP / CLS / JS payload | Not measured. |
| Firefox, Safari, Edge | Not tested. Only Chrome (desktop) was used. |
| Mobile and tablet layouts of the changed page | Not viewed. |
| Final-state visual check of the Agro360AI hero after the last overlay removal | Not re-viewed after the shared `HeroVideoBackground` rewrite; the home, MediAI, CRM, ERP and EduSphere heroes use the same component and were viewed. |

## Known limitations

- **Possible licensing problem:** the supplied Agro360AI clip (`public/videos/agro360ai-hero.mp4`) shows a faint Getty Images watermark in the frame. Watermarked stock preview footage is generally not licensed for a production site; confirm the licence or replace it.
- **4K:** 4K/QHD masters exist only for MediAI (17.8 MiB), AutoFlow (22.3 MiB) and EduSphere (7.0 MiB, QHD 2560x1080), served only to displays ≥1700 CSS px wide and ≥3000 physical px on a 4g, non-Save-Data connection; this path was **not exercised** (the test display is ~1520 px). Other clips have no 4K master under the 25 MiB per-asset Cloudflare limit, or the source clip is 1080p. The 4K selection logic is untested in a browser.
- `medhavya-hrms` is an unpublished draft product (404 by design); it deliberately has no clip.
- Hero clips add ~111 MiB (`public/videos/heroes`, 11 files) plus ~20 MiB of feature-card clips; git history grows by that much.
- Feature-card and hero text are white with a dark text-shadow over video; legibility is judged by eye on earlier frames, not measured against WCAG contrast.
- `Save-Data` / reduced-motion fallback in `HeroVideoBackground` is implemented but untested in a browser.
- Hero video is 768x432; feature clips are 720p Pexels files (2–5 MB each). 4K sources were rejected: 39–162 MB each, and files over 100 MB cannot be pushed to GitHub.
- All changes are uncommitted in the working tree.
