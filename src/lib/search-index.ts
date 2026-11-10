import { getCategories, getEnterpriseServices, getIndustries, getProducts, getResources } from "@/lib/content";
import type { SearchEntry } from "@/lib/search";

/** Builds the site search index from published content only. */
export function buildSearchIndex(): SearchEntry[] {
  return [
    ...getProducts().map<SearchEntry>((p) => ({
      kind: "Product",
      title: p.name,
      href: `/products/${p.slug}`,
      summary: p.summary,
      keywords: [p.description, ...p.features.map((f) => f.title), ...p.audience, ...p.integrations, p.lifecycle].join(" "),
    })),
    ...getCategories().map<SearchEntry>((c) => ({
      kind: "Category",
      title: c.name,
      href: `/product-categories/${c.slug}`,
      summary: c.tagline,
      keywords: c.description,
    })),
    ...getEnterpriseServices().map<SearchEntry>((s) => ({
      kind: "Service",
      title: s.name,
      href: `/enterprise-solutions/${s.slug}`,
      summary: s.summary,
      keywords: [...s.capabilities, ...s.problems, ...s.deliverables].join(" "),
    })),
    ...getIndustries().map<SearchEntry>((i) => ({
      kind: "Industry",
      title: i.name,
      href: `/industries/${i.slug}`,
      summary: i.description,
      keywords: [...i.painPoints, ...i.solutions].join(" "),
    })),
    ...getResources().map<SearchEntry>((r) => ({
      kind: "Resource",
      title: r.title,
      href: `/resources/blog/${r.slug}`,
      summary: r.excerpt,
      keywords: r.tags.join(" "),
    })),
    { kind: "Page", title: "Contact", href: "/contact", summary: "Talk to the Medhavya Systems team.", keywords: "enquiry sales support partnership careers" },
    { kind: "Page", title: "Request a demo", href: "/request-demo", summary: "See a Medhavya product with our team.", keywords: "demo trial walkthrough" },
    { kind: "Page", title: "Solution finder", href: "/solutions#finder", summary: "Answer three questions to find a suitable product or service.", keywords: "recommend match which product help choose" },
    { kind: "Page", title: "Compare products", href: "/compare-products", summary: "Compare products side by side.", keywords: "comparison versus difference" },
    { kind: "Page", title: "Careers", href: "/careers", summary: "Work with Medhavya Systems.", keywords: "jobs hiring work join" },
    { kind: "Page", title: "Partners", href: "/partners", summary: "Technology and channel partnerships.", keywords: "partner reseller alliance integration" },
    { kind: "Page", title: "Security", href: "/security", summary: "How we approach security and privacy.", keywords: "privacy data protection" },
    { kind: "Page", title: "Technology", href: "/technology", summary: "How we build and deliver.", keywords: "architecture engineering stack" },
    { kind: "Page", title: "About", href: "/about", summary: "Our story, mission and principles.", keywords: "company mission vision values" },
  ];
}
