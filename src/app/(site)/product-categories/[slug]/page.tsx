import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { ProductMockup } from "@/components/ProductMockup";
import { DemoBadge, LifecycleBadge } from "@/components/ui/Badges";
import { ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeading, CardLabel } from "@/components/ui/Section";
import { CategoryVisual } from "@/components/visuals/PageVisuals";
import { getCategories, getCategory, getIndustries, getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

// All slugs are prerendered; see note in app/products/[slug]/page.tsx.
export const instant = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product-categories/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return pageMetadata({ title: category.seo.title, description: category.seo.description, path: `/product-categories/${category.slug}` });
}

export default async function CategoryPage({ params }: PageProps<"/product-categories/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const products = getProducts({ category: category.slug });
  const productSlugs = new Set(products.map((p) => p.slug));
  const relatedIndustries = getIndustries().filter((i) => i.relatedProducts.some((s) => productSlugs.has(s)));
  const others = getCategories().filter((c) => c.slug !== category.slug);

  return (
    <>
      <PageHero
        eyebrow={category.name}
        title={category.tagline}
        intro={category.description}
        crumbs={[{ label: "Products", href: "/products" }, { label: category.shortName }]}
        visual={<CategoryVisual icon={category.icon} products={products.map(({ slug, name }) => ({ slug, name }))} />}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd] py-16 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-32 size-[26rem] rounded-full bg-electric/15 blur-3xl" />
        <Container className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Industry context" title="What we hear from teams in this space" />
          <ul data-reveal-group="70" className="space-y-4">
            {category.context.map((c, i) => (
              <li key={c} className="group relative flex items-start gap-4 overflow-hidden rounded-[var(--radius-md)] border border-line bg-white p-5 text-ink transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
                <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan font-mono text-sm font-semibold text-white shadow-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {c}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="relative overflow-hidden border-y border-line bg-white py-16 sm:py-24">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_70%)]" />
        <Container className="relative">
          <SectionHeading eyebrow="Products" title={products.length ? `${category.shortName} products` : "Products coming soon"} />
          {products.length === 0 ? (
            <p className="mt-6 max-w-xl text-muted">We are not yet listing a product in this category. If you have a need here, we would like to hear about it.</p>
          ) : (
            <div className="mt-12 space-y-16">
              {products.map((p, i) => (
                <article key={p.slug} className="grid gap-10 lg:grid-cols-2 lg:items-center">
                  <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                    <div className="flex flex-wrap items-center gap-2">
                      <LifecycleBadge status={p.lifecycle} />
                      {p.isDemo && <DemoBadge />}
                    </div>
                    <h3 className="mt-4 text-3xl font-semibold tracking-tight text-midnight">{p.name}</h3>
                    <p className="mt-3 text-lg leading-relaxed text-muted">{p.summary}</p>
                    <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                      {p.features.slice(0, 4).map((f) => (
                        <li key={f.title} className="flex items-center gap-2 text-sm text-ink">
                          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                          {f.title}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <ButtonLink href={`/products/${p.slug}`} arrow>
                        View product
                      </ButtonLink>
                      <ButtonLink href={`/request-demo?product=${p.slug}`} variant="secondary">
                        Request a demo
                      </ButtonLink>
                    </div>
                  </div>
                  <ProductMockup product={p} />
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>

      {relatedIndustries.length > 0 && (
        <section className="bg-gradient-to-b from-white to-[#f1f6fd] py-16">
          <Container>
            <CardLabel>Relevant industries</CardLabel>
            <ul className="mt-4 flex flex-wrap gap-2">
              {relatedIndustries.map((i) => (
                <li key={i.slug}>
                  <Link href={`/industries/${i.slug}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-sm font-medium text-ink hover:border-primary hover:text-primary">
                    {i.name} <ArrowRight aria-hidden className="size-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="bg-[#f1f6fd] py-14">
        <Container>
          <CardLabel>Other categories</CardLabel>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {others.map((c) => (
              <li key={c.slug}>
                <Link href={`/product-categories/${c.slug}`} className="flex h-full min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink hover:border-primary hover:text-primary">
                  <CategoryIcon icon={c.icon} className="size-4 shrink-0 text-primary" />
                  {c.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
