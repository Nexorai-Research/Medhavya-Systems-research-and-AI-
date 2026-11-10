# 04 — Information Architecture

## Primary navigation (as implemented)

Products (mega menu) · Solutions · Industries (menu) · Enterprise Services (menu) · Resources · Company (menu). Plus a search icon and a "Request a demo" button. Source: `src/content/site.ts`, `components/layout/SiteHeader.tsx`.

The brief's list (Home, About, Products, Services, Industries, Solutions, Resources, Company, Contact) is covered like this: About, Careers, Partners, Technology, Security and Contact sit under **Company**; "Services" is labelled **Enterprise Services** to keep the product/service distinction clear.

## Route map

| Section | Routes | Template |
| --- | --- | --- |
| Home | `/` | Custom (3D hero, 10 sections, FAQ) |
| Products | `/products`, `/products/[slug]`, `/product-categories/[slug]`, `/compare-products` | Catalogue, product detail, category, comparison |
| Services | `/enterprise-solutions`, `/enterprise-solutions/[slug]` (9 services) | Overview and one reusable service template |
| Industries | `/industries`, `/industries/[slug]` (7) | Overview and one reusable industry template |
| Solutions | `/solutions` (themes and the finder at `#finder`) | Custom |
| Resources | `/resources`, `/resources/blog/[slug]` (3 articles) | Listing and article |
| Company | `/about`, `/technology`, `/security`, `/careers`, `/partners`, `/contact`, `/request-demo` | Editorial pages with forms |
| Legal | `/privacy`, `/terms`, `/cookies`, `/accessibility` | `LegalDraft` (marked pending legal review) |
| Utility | `/search`, `/sitemap.xml`, `/robots.txt`, `/api/*`, 404, error | — |

## Content model

Typed records in `src/content/*.ts` (products, categories, industries, enterprise services, resources). Every public read goes through `src/lib/content.ts`, which returns **only `Published` records**. Pages are templates over this data, so there are no hard-coded duplicate product layouts.

## Cross-links

- Products ↔ categories ↔ industries via slugs (`categorySlug`, `industries`, `relatedProducts`).
- Search index (`lib/search-index.ts`) is built from the same published data.
- Unknown slugs get a real 404 through `src/proxy.ts`.

## Gaps against the brief

| Gap | Reason |
| --- | --- |
| Industries: Hospitality, Real Estate, Government | Scope and facts need founder confirmation |
| Resources: case studies, whitepapers, reports, events, news | No verified material exists; none is invented |
| Multi-language | No approved translations; no non-working language switcher is shown |
