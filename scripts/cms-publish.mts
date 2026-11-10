/**
 * Exports CMS content to src/content/cms-snapshot.json, which the public site is built from.
 * Every record is included with its publication state; the site's content queries show only
 * "Published" records. Run with: npm run cms:publish, then rebuild the site.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { getCms } from "./_payload.mts";
import { categoryFromDoc, industryFromDoc, productFromDoc, resourceFromDoc, serviceFromDoc, type ContentSnapshot } from "../src/cms/mappers";

async function main() {
  const payload = await getCms();

  async function all(collection: string) {
    const res = await payload.find({ collection: collection as never, limit: 0, pagination: false, depth: 0, sort: "id", overrideAccess: true });
    return res.docs as unknown as Record<string, unknown>[];
  }

  const snapshot: ContentSnapshot = {
    generatedAt: new Date().toISOString(),
    categories: (await all("product-categories")).map(categoryFromDoc),
    products: (await all("products")).map(productFromDoc),
    industries: (await all("industries")).map(industryFromDoc),
    enterpriseServices: (await all("enterprise-services")).filter((d) => d.publication === "Published").map(serviceFromDoc),
    resources: (await all("resources")).map(resourceFromDoc),
  };

  if (!snapshot.categories.length || !snapshot.products.length) {
    console.error("Refusing to write an empty snapshot. Run `npm run cms:seed` first.");
    process.exit(1);
  }

  const file = path.resolve(process.cwd(), "src/content/cms-snapshot.json");
  await writeFile(file, JSON.stringify(snapshot, null, 2) + "\n", "utf8");
  console.log(
    `Wrote ${file}: ${snapshot.products.length} products, ${snapshot.categories.length} categories, ${snapshot.industries.length} industries, ${snapshot.enterpriseServices.length} services, ${snapshot.resources.length} resources.`,
  );


}

main().then(() => process.exit(0), (error) => {
  console.error(error);
  process.exit(1);
});
