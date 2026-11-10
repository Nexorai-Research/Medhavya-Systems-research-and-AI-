import { NextResponse, type NextRequest } from "next/server";
import { getCategories, getEnterpriseServices, getIndustries, getProducts, getResources } from "@/lib/content";

/**
 * With Cache Components, unknown dynamic params are served from the prerendered fallback shell,
 * so the 200 status is committed before notFound() runs. Rewriting unknown slugs to an
 * unmatched path returns a real 404 (important for SEO and for unpublished content).
 */
const known: Record<string, Set<string>> = {
  products: new Set(getProducts().map((p) => p.slug)),
  "product-categories": new Set(getCategories().map((c) => c.slug)),
  industries: new Set(getIndustries().map((i) => i.slug)),
  "enterprise-solutions": new Set(getEnterpriseServices().map((s) => s.slug)),
  "resources/blog": new Set(getResources().map((r) => r.slug)),
};

export function proxy(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/(products|product-categories|industries|enterprise-solutions|resources\/blog)\/([^/]+)\/?$/);
  if (match && !known[match[1]].has(decodeURIComponent(match[2]))) {
    return NextResponse.rewrite(new URL("/__not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:slug", "/product-categories/:slug", "/industries/:slug", "/enterprise-solutions/:slug", "/resources/blog/:slug"],
};
