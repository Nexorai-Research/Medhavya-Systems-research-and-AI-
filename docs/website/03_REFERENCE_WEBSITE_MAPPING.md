# 03 — Reference Website Mapping

Date: 2026-11-10. Method: six pages were fetched with a read-only web fetch tool and described from what was returned. Pages were read as served (some were localised variants). **No interaction was exercised** (no clicking, hover or keyboard testing), so findings are about page structure and content patterns only.

## Inspected (6 of 12)

| Reference | Page(s) fetched | Coverage notes |
| --- | --- | --- |
| IBM | `/case-studies` | Full listing page |
| HubSpot | `/products` | About half read verbatim; the rest was summarised by the tool |
| Stripe | `/` (served as `/in/`) | Full |
| Atlassian | `/` | Truncated: mega-menu read, homepage body not |
| Microsoft | `/` (en-in) | Full |
| Linear | `/` | Full |

## Not inspected (6 of 12)

Accenture, Salesforce, Shopify, Webflow, Adobe and AWS were **not** inspected. No pattern below is attributed to them.

## Patterns observed and how Medhavya adapted them

| Problem to solve | Reference and observed pattern | Adaptation in this repo |
| --- | --- | --- |
| Finding things across a large site | IBM: filterable listing with facets, per-facet counts, sort and "Clear all" | Product catalogue keeps category chips with counts, lifecycle filter, sorting and "Clear filters" (`features/products/CatalogueBrowser.tsx`) |
| Choosing between product options | HubSpot and Atlassian: solutions grouped by use case, team size and industry | Solution finder maps need, industry and organisation size to products and services (`features/finder`) |
| Routing different kinds of enquiry | Atlassian: separate, intent-based contact routes. HubSpot: demo and sales paths beside the primary action | 8 enquiry types and dedicated Demo, Enterprise, Careers and Partners forms |
| Industry navigation | Stripe: industries as their own landing pages under Solutions. Atlassian: a "By industry" group | Industry pages with pain points, solutions and related products, plus a navigation menu |
| Clear primary and secondary actions | HubSpot, Stripe, Linear: a primary start/demo action paired with "Contact sales" | Header "Request a demo", hero "Explore Products" and "Discuss an Enterprise Project" |
| Showing a product without fake data | Linear: a rendered, clearly sample interface | Concept UI mockups labelled as illustrative; demo listings badged "Demo listing" |
| Trust through evidence | Stripe and Linear publish specific numbers or named customers, backed by links | Medhavya publishes **none** until verified. The home page states this openly instead of borrowing credibility |
| Skip links and basic accessibility | HubSpot and Microsoft expose skip links | Skip link in the header, tested by e2e; axe WCAG 2.2 AA scans on 16 pages |

## Observed weaknesses to avoid

- IBM's facet options used placeholder `javascript:` links. Medhavya's filters are real buttons with `aria-pressed`.
- Large mega-menus (Microsoft, Atlassian) become link dumps. Medhavya's menus are capped to its categories, industries and services.

## Limits

This document makes no claim about interaction quality, animation or performance of any reference site. Doc 09 reports measurements only for Medhavya itself.
