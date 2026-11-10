import type { MetadataRoute } from "next";
import { getCategories, getEnterpriseServices, getIndustries, getProducts, getResources } from "@/lib/content";
import { siteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const staticPaths = [
    "/",
    "/products",
    "/solutions",
    "/industries",
    "/enterprise-solutions",
    "/technology",
    "/security",
    "/resources",
    "/about",
    "/careers",
    "/partners",
    "/contact",
    "/request-demo",
    "/privacy",
    "/terms",
    "/cookies",
    "/accessibility",
  ];
  const paths = [
    ...staticPaths,
    ...getProducts().map((p) => `/products/${p.slug}`),
    ...getCategories().map((c) => `/product-categories/${c.slug}`),
    ...getIndustries().map((i) => `/industries/${i.slug}`),
    ...getEnterpriseServices().map((s) => `/enterprise-solutions/${s.slug}`),
    ...getResources().map((r) => `/resources/blog/${r.slug}`),
  ];
  return paths.map((p) => ({ url: `${base}${p === "/" ? "" : p}` }));
}
