# 10 — Testing and Release Report

Date: 2026-11-10. Branch: `1-medhavya-systems-enterprise-website-transformation`.

## Results

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `eslint src tests` | 0 problems |
| `vitest run` | 38/38 passed (7 files) |
| `npm run build` | Pass. All public pages static or partially prerendered; product social images prerendered |
| Playwright, desktop project | All passed in the full run |
| Playwright, mobile project | 46 passed, 7 skipped by design. In the first full run 14 mobile tests failed with 30 s **timeouts** (machine under load: Playwright, `npm audit` and other processes ran together). Re-run alone, 12 of them passed; the last 2 (axe on `/` and `/enterprise-solutions`) failed once more and passed when run individually. |
| `npm audit --omit=dev` | 0 vulnerabilities in production dependencies |
| `npm audit` (all) | 7 moderate, all in dev tooling (`@typescript-eslint` chain). Not fixed: `npm audit fix` could change lint tooling and was not requested |

Total Playwright tests: 110 (8 are skipped because they only apply to the other project).

## Flakiness to be aware of

The suite is heavy on a slow machine: 4 workers, many animated pages, axe scans and `networkidle` waits. Timeouts, not assertion failures, were the only failures seen. If this appears in CI, reduce workers (`--workers=2`) or raise the per-test timeout before treating it as a product bug. This has **not** been tuned.

## Coverage against the brief's journeys

| Journey | Covered by |
| --- | --- |
| Home, mega menu, mobile navigation | e2e home, menu keyboard, mobile menu |
| Search, empty results | e2e search journey, `search.test.ts` |
| Filter products, open a product | e2e catalogue journey |
| Industry, service, category pages | axe scans, console-error checks, build |
| Contact, demo, consultation and careers forms: validation and success | e2e lead workflows, careers journey |
| Validation messages | `lead-schema.test.ts`, e2e |
| Keyboard-only use, dialogs | skip link, menu Escape, cookie dialog (open, save, Escape) |
| Legal pages | axe on pages that render them; privacy, terms, cookies and accessibility pages are not in the axe list |
| Network or API errors | API boundary e2e (oversize, bad JSON, cross-origin, rate limit unit tests). A browser-level "server down" form state is **not** tested |
| Compare and finder | unit and e2e |

## Release readiness: not ready for production

| Blocker | Type |
| --- | --- |
| Performance below target (LCP 4–6 s in lab, see doc 09) | Engineering, open |
| Lead store is a local file; rate limiter is in-memory | Engineering (needs PostgreSQL / shared store) |
| No email or CRM delivery of leads | Needs provider |
| All product facts are demonstration content | Company input |
| Legal pages are drafts | Legal review |
| Contact details, social links, founder story missing | Company input |
| Domain, hosting region, data residency, backups, monitoring | Decision needed |
| `SITE_INDEXABLE` must stay `false` until launch | Configuration |
| Screen-reader and manual WCAG audit not done | QA |
| Multi-language, AI assistant, WhatsApp, scheduling, CMS | Blocked, see doc 07 |

## What this release can honestly be used for

A staging or review site that shows the full information architecture, the working search, finder, comparison and forms, and an honest, claim-free tone. It is not a launch candidate until the blockers above are closed.
