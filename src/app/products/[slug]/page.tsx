import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type CSSProperties } from "react";
import { Cloud, LifeBuoy, Plug, Users } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CtaBand } from "@/components/CtaBand";
import { Faq } from "@/components/Faq";
import { Breadcrumbs } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { ProductHeroVisual } from "@/components/visuals/PageVisuals";
import { DemoBadge, LifecycleBadge } from "@/components/ui/Badges";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/Section";
import { getCategory, getIndustry, getProduct, getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

// Every valid slug is prerendered at build time and unknown slugs are 404'd by src/proxy.ts,
// so awaiting params here never blocks a real visitor; opt out of instant-shell validation.
export const instant = false;

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return pageMetadata({ title: product.seo.title, description: product.seo.description, path: `/products/${product.slug}` });
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.categorySlug)!;
  const related = getProducts({ category: product.categorySlug }).filter((p) => p.slug !== product.slug);
  const alsoConsider = related.length > 0 ? related : getProducts().filter((p) => p.slug !== product.slug && p.industries.some((i) => product.industries.includes(i))).slice(0, 3);

  const facts = [
    { Icon: Users, label: "Built for", value: product.audience.join(", ") },
    { Icon: Cloud, label: "Deployment", value: product.deployment.join(" · ") },
    { Icon: Plug, label: "Integration areas", value: product.integrations.join(" · ") },
    { Icon: LifeBuoy, label: "Support", value: product.support },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    applicationCategory: "BusinessApplication",
    description: product.summary,
    publisher: { "@type": "Organization", name: "Medhavya Systems" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_80%_30%,black,transparent_70%)]" />
        <Container className="relative pt-10 pb-16 sm:pt-14 sm:pb-20">
          <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: category.shortName, href: `/product-categories/${category.slug}` }, { label: product.name }]} />
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div className="animate-rise">
              <Link href={`/product-categories/${category.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-strong">
                <CategoryIcon icon={category.icon} className="size-4" /> {category.name}
              </Link>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-midnight sm:text-5xl">
                <ViewTransition name={`product-title-${product.slug}`} share="morph" default="none">
                  <span className="inline-block">{product.name}</span>
                </ViewTransition>
              </h1>
              <p className="mt-4 text-xl leading-relaxed text-pretty text-ink">{product.summary}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <LifecycleBadge status={product.lifecycle} />
                {product.isDemo && <DemoBadge />}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/request-demo?product=${product.slug}`} arrow>
                  Request a demo
                </ButtonLink>
                <ButtonLink href="#features" variant="secondary">
                  See features
                </ButtonLink>
              </div>
            </div>
            <ProductHeroVisual product={product} />
          </div>
        </Container>
      </section>

      {product.isDemo && (
        <div className="border-b border-line bg-warning-bg/60">
          <Container className="py-3 text-sm text-gold-ink">
            <strong className="font-semibold">Demo listing.</strong> Product details on this page are illustrative and will be confirmed before launch. Ask us for the current scope and availability.
          </Container>
        </div>
      )}

      {/* Problem & outcomes */}
      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <Eyebrow>The problem</Eyebrow>
            <p className="mt-5 text-2xl leading-snug font-medium tracking-tight text-balance text-midnight sm:text-3xl">{product.problem}</p>
            <p className="mt-6 leading-relaxed text-muted">{product.description}</p>
          </div>
          <div data-spotlight="light" className="card-glow rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-panel)] sm:p-8">
            <h2 className="text-sm font-semibold tracking-[0.14em] text-muted uppercase">Intended outcomes</h2>
            <ol data-reveal-group="110" className="mt-6 space-y-5">
              {product.outcomes.map((o, i) => (
                <li key={o} className="flex gap-4">
                  <span className="font-mono text-sm text-primary tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-lg font-medium text-midnight">{o}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 border-y border-line bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Modules & features" title={`What ${product.name} does`} />
          <ul data-reveal-group="70" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((f, i) => (
              <li key={f.title}>
                <div data-spotlight="light" className="card-glow group h-full rounded-[var(--radius-lg)] p-6 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/8 font-mono text-sm font-semibold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-semibold text-midnight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Workflows */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Workflows" title="How teams use it" />
          <div className={`mt-12 grid gap-6 ${product.useCases.length > 1 ? "lg:grid-cols-2" : "lg:grid-cols-[1.2fr_1fr] lg:items-center"}`}>
            {product.useCases.map((u) => (
              <div key={u.title} data-reveal className="dark-section relative overflow-hidden rounded-[var(--radius-lg)] bg-midnight p-6 text-white sm:p-8">
                <div aria-hidden className="bg-grid-dark absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
                <h3 className="relative font-semibold">{u.title}</h3>
                {/* Live pipeline: a signal travels through the steps, lighting each in turn */}
                <ol className="pipeline relative mt-6" style={{ "--n": u.steps.length } as CSSProperties}>
                  <span aria-hidden className="pipeline-rail" />
                  <span aria-hidden className="pipeline-dot" />
                  {u.steps.map((s, i) => (
                    <li key={s} className="pipeline-step" style={{ "--i": i } as CSSProperties}>
                      <span className="pipeline-node">{i + 1}</span>
                      <span className="text-sm text-white/85">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
            {product.useCases.length === 1 && (
              <p data-reveal className="max-w-md text-lg leading-relaxed text-muted">
                Every step is designed around the people doing the work — with clear ownership, an audit trail, and nothing changed without the right person’s approval.
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Facts */}
      <section className="dark-section bg-midnight py-16 text-white">
        <Container>
          <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(({ Icon, label, value }) => (
              <div key={label}>
                <dt className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-cyan uppercase">
                  <Icon aria-hidden className="size-4" /> {label}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-white/80">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-xs text-white/50">
            Industries:{" "}
            {product.industries
              .map((i) => getIndustry(i))
              .filter((i) => i !== undefined)
              .map((i, idx) => (
                <span key={i.slug}>
                  {idx > 0 && ", "}
                  <Link href={`/industries/${i.slug}`} className="underline underline-offset-2 hover:text-white">
                    {i.name}
                  </Link>
                </span>
              ))}
          </p>
        </Container>
      </section>

      {/* FAQs */}
      {product.faqs.length > 0 && (
        <section className="py-20 sm:py-24">
          <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="FAQs" title="Questions buyers ask" />
            <Faq items={product.faqs} />
          </Container>
        </section>
      )}

      {alsoConsider.length > 0 && (
        <section className="border-t border-line bg-white py-16 sm:py-20">
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight text-midnight">Related products</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {alsoConsider.map((p) => {
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
      )}

      <CtaBand
        title={`See ${product.name} with our team.`}
        intro="We will walk through the workflows relevant to you and be clear about what is available today and what is on the roadmap."
        primary={{ href: `/request-demo?product=${product.slug}`, label: "Request a demo" }}
        secondary={{ href: "/contact", label: "Ask a question" }}
      />
    </>
  );
}
