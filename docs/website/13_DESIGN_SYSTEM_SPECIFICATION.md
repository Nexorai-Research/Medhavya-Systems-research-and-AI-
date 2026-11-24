# 13 — Design system specification (addendum)

The authoritative system is `05_DESIGN_SYSTEM.md` plus the `@theme` block in `src/app/(site)/globals.css` (colours, Geist fonts, radii, shadows, `--animate-*`, `--ease-out-expo`, `--ease-in-out`). This file records only what was added or decided in the visual-experience pass, and gaps still open. Nothing in the existing token set was changed.

## Rules for text over photo or video (new)

1. A media layer (`HeroVideoBackground`, `CardHoverVideo`) always sits on a `bg-midnight` base, so light text stays readable while the media loads, fails, or is withheld.
2. Text over unscrimmed media is white with a dark text-shadow; text over a normal surface keeps `text-midnight` / `text-ink` / `text-muted`. Do not mix the two on one surface.
3. Media never autoplays for `prefers-reduced-motion` or Save-Data users (they get the first frame), pauses when off-screen or the tab is hidden, and is not requested by cards until they are near the viewport.
4. One clip per card, assigned in feature order in `featureVideos` (`products/[slug]/page.tsx`); a card with no entry renders as a normal card.
5. Clip budget: ≤ ~6 MB per card clip at 720p; ≤ ~5 MB hero clip. Never commit a file over 100 MB.

## Component APIs added

| Component | Props | Notes |
| --- | --- | --- |
| `HeroVideoBackground` | `src` | Client component. Put in a `relative overflow-hidden` section. |
| `CardHoverVideo` | `src`, `start?` | Client component. Parent card needs `group relative isolate overflow-hidden`. Loads videos through a one-at-a-time queue (works around a Chrome failure when several elements request one file together). |
| `ProductMockup` | `captionClassName?` | Optional backing for the caption when over media. |

## Open gaps (not decided or implemented)

- **Dark theme tokens:** none exist; needs approval (see audit finding 1).
- **Typography scale:** only Tailwind defaults plus per-page sizes; a fluid scale has not been specified.
- **Scroll-linked parallax:** only pointer parallax and CSS scroll-reveal exist.
- **Skeleton/loading components:** none audited.
