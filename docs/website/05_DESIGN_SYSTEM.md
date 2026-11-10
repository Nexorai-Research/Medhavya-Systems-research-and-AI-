# 05 — Design System

Source of truth: `src/app/globals.css` (`@theme` tokens, Tailwind v4). Concept: **"Intelligence in Motion"**, a light canvas, navy typography, blue and cyan accents, and gold taken from the logo.

## Colour tokens

| Token | Value | Use |
| --- | --- | --- |
| `midnight` / `midnight-2` | `#101a2d` / `#16233b` | Headings, dark sections |
| `primary` / `primary-strong` | `#315fd5` / `#2449ad` | Actions, links |
| `electric`, `cyan`, `cyan-ink` | `#527bff`, `#35b9d6`, `#0e6f86` | Accents, focus rings, 3D scenes |
| `gold` / `gold-ink` | `#d4a038` / `#8a6416` | `gold` is decorative only. Use `gold-ink` for text (ADR-010) |
| `canvas`, `surface` | `#f6f8fc`, `#ffffff` | Page and card backgrounds |
| `ink`, `muted` | `#172238`, `#596579` | Body and secondary text |
| `line`, `line-strong` | `#e2e8f0`, `#cbd5e1` | Borders |
| `success`, `warning`, `danger` (+ `-bg`) | see file | Status; always paired with text or icon, never colour alone |

## Typography

Geist Sans (UI) and Geist Mono (labels, step numbers), loaded through `next/font`. Eyebrows are mono, uppercase and tracked. Headings are semibold with tight tracking.

## Shape, depth, motion

- Radius: `sm` 6 · `md` 10 · `lg` 16 · `xl` 24 px.
- Shadows: `panel` (resting) and `lift` (hover and menus).
- Motion is CSS only: `rise`, `draw`, `pulse-soft`, `flow`, View Transitions, scroll-driven animations and CSS 3D. Everything is disabled under `prefers-reduced-motion`; browsers without support show static content.

## Interaction rules

- Visible focus ring (`electric`) on every interactive element, including cards with `has-[:focus-visible]`.
- Touch targets are at least 44 px (`min-h-11`) on buttons, chips, checkboxes and menu rows.
- Disclosures use native `<details>`; modals use native `<dialog>`.
- Forms: visible labels, field-level errors linked with `aria-describedby`, success announced with `role="status"`.

## Component states

| State | Where it is handled |
| --- | --- |
| Hover / focus / active | `Button`, cards, chips, menu rows |
| Disabled | Compare checkboxes beyond the limit, disabled compare action |
| Loading | Suspense fallbacks (search, compare), form "submitting" status |
| Error / success | `LeadForm` field errors, error banner with request id, success reference |
| Empty | Catalogue, search, finder and compare empty states |

## Gaps

No dark theme (the page is light by design; dark sections are used selectively). No documented spacing scale beyond Tailwind's defaults.
