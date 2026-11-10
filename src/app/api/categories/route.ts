import { getCategories } from "@/lib/content";

/** GET /api/categories — published categories only. */
export async function GET() {
  const items = getCategories().map(({ slug, name, shortName, tagline, description, icon, displayOrder }) => ({
    slug,
    name,
    shortName,
    tagline,
    description,
    icon,
    displayOrder,
  }));
  return Response.json({ items });
}
