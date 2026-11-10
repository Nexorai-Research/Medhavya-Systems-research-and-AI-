import { describe, expect, it } from "vitest";
import { NEEDS, SIZES, findSolutions } from "@/features/finder/match";
import { getEnterpriseServices, getIndustries, getProducts } from "@/lib/content";

const data = {
  products: getProducts().map((p) => ({ slug: p.slug, name: p.name, summary: p.summary, lifecycle: p.lifecycle, industries: p.industries })),
  services: getEnterpriseServices().map((s) => ({ slug: s.slug, name: s.name, summary: s.summary })),
  industries: getIndustries().map((i) => ({ slug: i.slug, name: i.name })),
};

describe("solution finder", () => {
  it("returns nothing when no answers are given", () => {
    const r = findSolutions({}, data);
    expect(r.products).toEqual([]);
    expect(r.services).toEqual([]);
  });

  it("ranks products matching both need and industry first", () => {
    const r = findSolutions({ need: "field-logistics", industry: "agriculture" }, data);
    expect(r.products[0]?.product.slug).toBe("medhavya-agro");
    expect(r.products[0]?.reasons).toHaveLength(2);
  });

  it("adds consulting for large organisations without duplicating services", () => {
    const r = findSolutions({ need: "not-sure", size: "large" }, data);
    const slugs = r.services.map((s) => s.service.slug);
    expect(slugs).toContain("consulting-digital-transformation");
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("never recommends unpublished drafts", () => {
    for (const need of NEEDS) {
      for (const industry of data.industries) {
        const r = findSolutions({ need: need.id, industry: industry.slug }, data);
        expect(r.products.some((p) => p.product.slug === "medhavya-hrms")).toBe(false);
      }
    }
  });

  it("only references products and services that exist", () => {
    const productSlugs = new Set(data.products.map((p) => p.slug));
    const serviceSlugs = new Set(data.services.map((s) => s.slug));
    for (const n of NEEDS) {
      n.productSlugs.forEach((s) => expect(productSlugs.has(s), s).toBe(true));
      n.serviceSlugs.forEach((s) => expect(serviceSlugs.has(s), s).toBe(true));
    }
    for (const z of SIZES) z.extraServiceSlugs.forEach((s) => expect(serviceSlugs.has(s), s).toBe(true));
  });
});
