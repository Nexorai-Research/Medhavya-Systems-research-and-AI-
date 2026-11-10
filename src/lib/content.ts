import type { ContentSnapshot } from "@/cms/mappers";
import snapshot from "@/content/cms-snapshot.json";
import type { Product, PublicationState } from "@/content/types";
import { filterProducts, type CatalogueFilter } from "@/features/products/filter";

/**
 * Public content queries. Content is authored in the Payload CMS and exported to
 * src/content/cms-snapshot.json by `npm run cms:publish`; the site is built from that snapshot.
 * Only records whose publication state is "Published" are ever returned (Module 04 §3).
 */
const { categories, enterpriseServices, industries, products, resources } = snapshot as unknown as ContentSnapshot;

const isPublic = <T extends { publication: PublicationState }>(record: T) => record.publication === "Published";

export function getCategories() {
  return categories.filter(isPublic).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getCategory(slug: string) {
  return getCategories().find((c) => c.slug === slug);
}

export function getProducts(filter: CatalogueFilter = {}): Product[] {
  const publicCategories = new Set(getCategories().map((c) => c.slug));
  const visible = products.filter((p) => isPublic(p) && publicCategories.has(p.categorySlug));
  return filterProducts(visible, filter);
}

export function getProduct(slug: string) {
  return getProducts().find((p) => p.slug === slug);
}

export function getFeaturedProducts() {
  return getProducts().filter((p) => p.featured);
}

export function getProductsBySlugs(slugs: string[]) {
  const all = getProducts();
  return slugs.map((s) => all.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
}

export function getIndustries() {
  return industries.filter(isPublic);
}

export function getIndustry(slug: string) {
  return getIndustries().find((i) => i.slug === slug);
}

export function getEnterpriseServices() {
  return enterpriseServices;
}

export function getEnterpriseService(slug: string) {
  return enterpriseServices.find((s) => s.slug === slug);
}

export function getResources() {
  return resources.filter(isPublic).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getResource(slug: string) {
  return getResources().find((r) => r.slug === slug);
}

/** Shape returned by the public catalogue API — omits internal governance fields. */
export function toPublicProduct(p: Product) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { governance, publication, ...rest } = p;
  return rest;
}
