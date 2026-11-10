import { describe, expect, it } from "vitest";
import { categories } from "@/content/categories";
import { industries } from "@/content/industries";
import { products } from "@/content/products";
import { LIFECYCLE_STATUSES } from "@/content/types";
import { getCategories, getProduct, getProducts, getProductsBySlugs, toPublicProduct } from "@/lib/content";

describe("public content queries", () => {
  it("never returns unpublished products", () => {
    const drafts = products.filter((p) => p.publication !== "Published");
    expect(drafts.length).toBeGreaterThan(0); // fixture guard: at least one draft exists
    const visible = new Set(getProducts().map((p) => p.slug));
    for (const d of drafts) {
      expect(visible.has(d.slug)).toBe(false);
      expect(getProduct(d.slug)).toBeUndefined();
    }
    expect(getProductsBySlugs(drafts.map((d) => d.slug))).toEqual([]);
  });

  it("exposes exactly the eight approved categories in display order", () => {
    const slugs = getCategories().map((c) => c.slug);
    expect(slugs).toEqual(["agriculture", "retail-business", "ai-automation", "financial-intelligence", "enterprise", "education", "healthcare", "other"]);
  });

  it("filters by category, lifecycle and query", () => {
    expect(getProducts({ category: "healthcare" }).map((p) => p.slug)).toEqual(["mediai"]);
    expect(getProducts({ lifecycle: "Beta" }).every((p) => p.lifecycle === "Beta")).toBe(true);
    expect(getProducts({ query: "attendance" }).map((p) => p.slug)).toContain("medhavya-edusphere");
    expect(getProducts({ query: "zzz-no-match" })).toEqual([]);
  });

  it("keeps lifecycle and publication separate and valid", () => {
    for (const p of products) expect(LIFECYCLE_STATUSES).toContain(p.lifecycle);
  });

  it("does not mark any demo product as Generally Available", () => {
    for (const p of products.filter((p) => p.isDemo)) expect(p.lifecycle).not.toBe("Generally Available");
  });

  it("references only existing categories and unique slugs", () => {
    const catSlugs = new Set(categories.map((c) => c.slug));
    const seen = new Set<string>();
    for (const p of products) {
      expect(catSlugs.has(p.categorySlug)).toBe(true);
      expect(seen.has(p.slug)).toBe(false);
      seen.add(p.slug);
    }
  });

  it("keeps industry and product cross-references valid", () => {
    const published = new Set(products.filter((p) => p.publication === "Published").map((p) => p.slug));
    const industrySlugs = new Set(industries.map((i) => i.slug));
    expect(industrySlugs.size).toBe(industries.length);
    for (const i of industries) {
      expect(i.relatedProducts.length).toBeGreaterThan(0);
      for (const slug of i.relatedProducts) expect(published.has(slug)).toBe(true);
    }
    for (const p of products) for (const slug of p.industries) expect(industrySlugs.has(slug)).toBe(true);
  });

  it("strips internal governance fields from public API shape", () => {
    const shape = toPublicProduct(getProducts()[0]) as Record<string, unknown>;
    expect(shape.governance).toBeUndefined();
    expect(shape.publication).toBeUndefined();
  });
});
