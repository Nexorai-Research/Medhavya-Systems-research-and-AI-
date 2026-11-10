import type { LifecycleStatus, Product } from "@/content/types";

export interface CatalogueFilter {
  query?: string;
  category?: string;
  lifecycle?: LifecycleStatus;
  industry?: string;
}

/** Pure catalogue filter shared by the browser UI and the public products API. */
export function filterProducts(products: Product[], filter: CatalogueFilter): Product[] {
  const q = filter.query?.trim().toLowerCase();
  return products.filter(
    (p) =>
      (!filter.category || p.categorySlug === filter.category) &&
      (!filter.industry || p.industries.includes(filter.industry)) &&
      (!filter.lifecycle || p.lifecycle === filter.lifecycle) &&
      (!q || [p.name, p.summary, ...p.features.map((f) => f.title)].some((t) => t.toLowerCase().includes(q))),
  );
}
