import { getProduct, getProducts, toPublicProduct } from "@/lib/content";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

/** GET /api/products/{slug} — returns only published public detail. */
export async function GET(_request: Request, { params }: RouteContext<"/api/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(toPublicProduct(product));
}
