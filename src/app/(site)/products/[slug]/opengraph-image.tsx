import { getProduct, getProducts } from "@/lib/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Medhavya Systems product";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  return ogImage({ eyebrow: product ? `Product · ${product.lifecycle}` : "Products", title: product?.name ?? "Medhavya Systems", subtitle: product?.summary });
}
