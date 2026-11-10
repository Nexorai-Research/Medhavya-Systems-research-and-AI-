import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Section";
import { CompareView } from "@/features/compare/CompareView";
import type { CompareProduct } from "@/features/compare/shared";
import { getCategories, getIndustries, getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Compare products",
  description: "Compare Medhavya Systems products side by side: category, lifecycle stage, capabilities, deployment and integrations.",
  path: "/compare-products",
});

export default function CompareProductsPage() {
  const categoryName = Object.fromEntries(getCategories().map((c) => [c.slug, c.name]));
  const industryName = Object.fromEntries(getIndustries().map((i) => [i.slug, i.name]));
  const products: CompareProduct[] = getProducts().map((p) => ({
    slug: p.slug,
    name: p.name,
    category: categoryName[p.categorySlug] ?? "",
    lifecycle: p.lifecycle,
    isDemo: p.isDemo,
    summary: p.summary,
    audience: p.audience,
    industries: p.industries.map((i) => industryName[i] ?? i),
    features: p.features.map((f) => f.title),
    deployment: p.deployment,
    integrations: p.integrations,
    support: p.support,
  }));
  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Compare products side by side."
        intro="Pick two or three products to see how their capabilities, deployment and lifecycle stage line up."
        crumbs={[{ label: "Products", href: "/products" }, { label: "Compare" }]}
      />
      <section className="py-12 sm:py-16">
        <Container>
          <Suspense fallback={<p className="text-sm text-muted">Loading comparison…</p>}>
            <CompareView products={products} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
