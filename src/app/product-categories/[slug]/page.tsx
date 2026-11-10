import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { ProductMockup } from "@/components/ProductMockup";
import { DemoBadge, LifecycleBadge } from "@/components/ui/Badges";
import { ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Section";
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

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Industry context" title="What we hear from teams in this space" />
          <ul className="space-y-4">
            {category.context.map((c) => (
              <li key={c} className="flex gap-4 rounded-[var(--radius-md)] border border-line bg-white p-5 text-ink">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan" />
                {c}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-y border-line bg-white py-16 sm:py-24">
        <Container>
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
        <section className="py-16">
          <Container>
            <h2 className="text-sm font-semibold tracking-[0.14em] text-muted uppercase">Relevant industries</h2>
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

      <section className="pb-4">
        <Container>
          <h2 className="text-sm font-semibold tracking-[0.14em] text-muted uppercase">Other categories</h2>
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
