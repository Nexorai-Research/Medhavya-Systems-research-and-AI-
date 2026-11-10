/**
 * Loads the typed content modules (src/content) into the CMS. Idempotent: records are matched by
 * slug and left untouched if they already exist, so editors' changes are never overwritten.
 * Run with: npm run cms:seed
 */
import { getCms } from "./_payload.mts";
import { categories } from "../src/content/categories";
import { enterpriseServices } from "../src/content/enterprise";
import { industries } from "../src/content/industries";
import { products } from "../src/content/products";
import { resources } from "../src/content/resources";
import { categoryToDoc, industryToDoc, productToDoc, resourceToDoc, serviceToDoc } from "../src/cms/mappers";

async function main() {
  const payload = await getCms();

  async function load<T extends { slug: string }>(collection: string, items: T[], toDoc: (item: T) => Record<string, unknown>) {
    let created = 0;
    for (const item of items) {
      const existing = await payload.find({ collection: collection as never, where: { slug: { equals: item.slug } }, limit: 1, depth: 0, overrideAccess: true });
      if (existing.totalDocs > 0) continue;
      await payload.create({ collection: collection as never, data: toDoc(item) as never, overrideAccess: true });
      created++;
    }
    console.log(`${collection}: ${created} created, ${items.length - created} already present`);
  }

  await load("product-categories", categories, categoryToDoc);
  await load("products", products, productToDoc);
  await load("industries", industries, industryToDoc);
  await load("enterprise-services", enterpriseServices, serviceToDoc);
  await load("resources", resources, resourceToDoc);



}

main().then(() => process.exit(0), (error) => {
  console.error(error);
  process.exit(1);
});
