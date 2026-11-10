# 06 — Component Inventory

Reuse these before adding new ones. Paths are under `src/`.

## Layout and brand

| Component | File | Notes |
| --- | --- | --- |
| SiteHeader (mega menus, mobile menu, skip link, search link) | `components/layout/SiteHeader.tsx` | Keyboard and Escape tested |
| SiteFooter | `components/layout/SiteFooter.tsx` | Includes `CookiePreferences` |
| Logo | `components/brand/Logo.tsx` | Mark plus HTML wordmark |
| Breadcrumbs (with BreadcrumbList JSON-LD) | `components/PageHero.tsx` | |
| Container, Eyebrow, SectionHeading | `components/ui/Section.tsx` | |

## Content

| Component | File |
| --- | --- |
| PageHero (+ AnimatedTitle) | `components/PageHero.tsx` |
| ProductCard | `components/ProductCard.tsx` |
| ProductMockup (illustrative concept UI) | `components/ProductMockup.tsx` |
| CategoryIcon | `components/CategoryIcon.tsx` |
| CtaBand | `components/CtaBand.tsx` |
| Faq (native disclosure) | `components/Faq.tsx` |
| LegalDraft | `components/LegalDraft.tsx` |
| Badges (LifecycleBadge, DemoBadge) | `components/ui/Badges.tsx` |
| Button, ButtonLink | `components/ui/Button.tsx` |
| JsonLd | `components/JsonLd.tsx` |
| HeroStage, Ecosystem3D, ProductVignette | `components/home/hero/*` |
| ProductShowcase | `components/home/ProductShowcase.tsx` |
| Stage3D and page visuals | `components/visuals/*` |
| MotionEffects | `components/motion/MotionEffects.tsx` |

## Interactive features

| Feature | Files |
| --- | --- |
| Catalogue browser (search, filters, sort, compare selection) | `features/products/CatalogueBrowser.tsx`, `filter.ts` |
| Site search | `features/search/SearchBrowser.tsx`, `lib/search.ts`, `lib/search-index.ts` |
| Solution finder | `features/finder/SolutionFinder.tsx`, `match.ts` |
| Product comparison | `features/compare/CompareView.tsx`, `shared.ts` |
| Lead form (multi-purpose) | `features/leads/LeadForm.tsx` |
| Cookie preferences dialog | `components/CookiePreferences.tsx` |
| Social preview images | `lib/og.tsx`, `app/opengraph-image.tsx`, `app/products/[slug]/opengraph-image.tsx` |

## Not built from the brief's list

MultiStepForm, FileUpload, TestimonialCard, CaseStudyCard, StatisticsSection, ROI calculator, TanStack Table/Query and React Flow. They are deliberately absent: no verified testimonials, case studies or statistics exist, no file upload is justified (it would add attack surface), and the reference stack in the brief is not required here.
