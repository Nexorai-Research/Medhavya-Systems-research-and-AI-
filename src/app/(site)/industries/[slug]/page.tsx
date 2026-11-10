import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { Container, SectionHeading } from "@/components/ui/Section";
import { CategoryVisual } from "@/components/visuals/PageVisuals";
import type { CategoryIcon } from "@/content/types";

const industryIcon: Record<string, CategoryIcon> = {
  agriculture: "agriculture",
  healthcare: "healthcare",
  education: "education",
  retail: "retail",
  logistics: "other",
  manufacturing: "enterprise",
  "financial-services": "finance",
};
import { getCategory, getIndustries, getIndustry, getProductsBySlugs } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

// All slugs are prerendered; see note in app/products/[slug]/page.tsx.
export const instant = false;

export function generateStaticParams() {
  return getIndustries().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return pageMetadata({ title: industry.seo.title, description: industry.seo.description, path: `/industries/${industry.slug}` });
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();
  const products = getProductsBySlugs(industry.relatedProducts);

  return (
    <>
      <PageHero
        eyebrow={`Industry · ${industry.name}`}
        title={industry.description}
        crumbs={[{ label: "Industries", href: "/industries" }, { label: industry.name }]}
        visual={<CategoryVisual icon={industryIcon[industry.slug] ?? "other"} products={products.map(({ slug, name }) => ({ slug, name }))} />}
      />
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white md:grid-cols-2">
            <div className="border-b border-line p-7 sm:p-10 md:border-r md:border-b-0">
              <h2 className="text-sm font-semibold tracking-[0.14em] text-muted uppercase">Common challenges</h2>
              <ul className="mt-6 space-y-4">
                {industry.painPoints.map((p) => (
                  <li key={p} className="flex gap-3 text-lg text-midnight">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-warning" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-canvas/60 p-7 sm:p-10">
              <h2 className="text-sm font-semibold tracking-[0.14em] text-muted uppercase">How we approach them</h2>
              <ul className="mt-6 space-y-4">
                {industry.solutions.map((s) => (
                  <li key={s} className="flex gap-3 text-lg text-midnight">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-cyan" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
      <section className="border-t border-line bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Relevant products" title={`Products for ${industry.name.toLowerCase()}`} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const c = getCategory(p.categorySlug)!;
              return (
                <li key={p.slug}>
                  <ProductCard product={p} categoryName={c.name} icon={c.icon} />
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
