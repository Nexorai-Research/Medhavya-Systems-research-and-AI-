import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { Container, SectionHeading, AccentBar, CardLabel } from "@/components/ui/Section";
import { CategoryVisual } from "@/components/visuals/PageVisuals";
import { HeroPhotoBackground } from "@/components/visuals/HeroPhotoBackground";
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
/** Where each photo is anchored so its subject stays in frame beside the hero copy. */
const photoPosition: Record<string, string> = {
  agriculture: "70% 60%",
  healthcare: "40% 40%",
  education: "50% 40%",
  retail: "50% 50%",
  logistics: "50% 50%",
  manufacturing: "50% 50%",
  "financial-services": "50% 60%",
  hospitality: "50% 45%",
  "real-estate": "50% 50%",
  government: "55% 55%",
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
        background={<HeroPhotoBackground src={`/images/industries/${industry.slug}.jpg`} position={photoPosition[industry.slug]} />}
      />
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas via-[#f1f6fd] to-canvas py-16 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute top-0 -left-40 size-[28rem] rounded-full bg-electric/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 size-[26rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-7 shadow-[var(--shadow-panel)] sm:p-9">
              <AccentBar className="from-amber-500 to-orange-400" />
              <CardLabel tone="amber" icon={<span aria-hidden className="size-2 rounded-full bg-amber-500" />}>
                Common challenges
              </CardLabel>
              <ul className="mt-6 space-y-3">
                {industry.painPoints.map((p, i) => (
                  <li key={p} className="flex items-start gap-3 rounded-[var(--radius-md)] bg-amber-50 p-4 text-base font-medium text-midnight">
                    <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-500 font-mono text-xs font-semibold text-white">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-7 shadow-[var(--shadow-panel)] sm:p-9">
              <AccentBar className="from-primary to-cyan" />
              <CardLabel tone="primary" icon={<span aria-hidden className="size-2 rounded-full bg-cyan" />}>
                How we approach them
              </CardLabel>
              <ul className="mt-6 space-y-3">
                {industry.solutions.map((s, i) => (
                  <li key={s} className="flex items-start gap-3 rounded-[var(--radius-md)] bg-blue-50 p-4 text-base font-medium text-midnight">
                    <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan font-mono text-xs font-semibold text-white">
                      {i + 1}
                    </span>
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
