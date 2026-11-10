import Link from "next/link";
import { ArrowRight, ArrowUpRight, Blocks, Cpu, Eye, GitMerge, Lock, ShieldCheck, Workflow } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CtaBand } from "@/components/CtaBand";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { HeroStage } from "@/components/home/hero/HeroStage";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Section";
import { deliveryLifecycle } from "@/content/enterprise";
import { site } from "@/content/site";
import { getCategories, getEnterpriseServices, getFeaturedProducts, getIndustries, getProducts, getProductsBySlugs, getResources } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({ title: `${site.name} — ${site.tagline}`, description: site.positioning, path: "/" }),
  title: { absolute: `${site.name} — ${site.tagline}` },
};

const serviceIcons = { "custom-software": Blocks, "ai-automation": Cpu, "integration-modernization": GitMerge } as const;

const principles = [
  { Icon: Eye, title: "Honest by default", text: "Every product shows its real lifecycle status. We publish outcomes only when they are verified." },
  { Icon: Workflow, title: "Reviewable AI", text: "AI proposes, people decide. Suggestions are traceable to their source and approved before they change records." },
  { Icon: ShieldCheck, title: "Secure foundations", text: "Least-privilege access, audit trails and privacy-conscious data handling are designed in from the first sprint." },
  { Icon: Lock, title: "Ownership you can rely on", text: "Clear scope, named owners, documented hand-over and no lock-in to undocumented work." },
];

const homeFaqs = [
  {
    question: "What does Medhavya Systems do?",
    answer: "We build our own software products and deliver custom software, applied AI, integration and related enterprise services for organisations in India and internationally.",
  },
  {
    question: "Are your products ready to buy today?",
    answer: "Each product shows its real lifecycle stage, from Research to Beta. The current listings are demonstration content, so please contact us for the confirmed status of any product.",
  },
  {
    question: "Can you build something that is not in the catalogue?",
    answer: "Yes. Our enterprise services cover custom software, web and mobile applications, AI and automation, integration, cloud and data work. We agree scope and acceptance criteria in phases before building.",
  },
  {
    question: "How is AI handled in your solutions?",
    answer: "AI output is treated as a proposal that a person reviews. For clinical, legal and credit decisions, AI assists people and does not decide for them.",
  },
  {
    question: "How quickly will you reply to an enquiry?",
    answer: site.contact.responseExpectation,
  },
];

export default function HomePage() {
  const categories = getCategories();
  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const featured = getFeaturedProducts();
  const allProducts = getProducts();
  const services = getEnterpriseServices().slice(0, 3);
  const industries = getIndustries().slice(0, 4);
  const resources = getResources().slice(0, 3);

  const ecosystem = ["medhavya-agro", "mediai", "medhavya-crm", "medhavya-edusphere", "medhavya-erp", "medhavya-logitrack"]
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter((p) => p !== undefined)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      category: categoryBySlug[p.categorySlug].shortName,
      icon: categoryBySlug[p.categorySlug].icon,
      lifecycle: p.lifecycle,
      summary: p.summary,
    }));

  return (
    <>
      {/* 2. Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_40%,black_20%,transparent_75%)]" />
        <div aria-hidden className="absolute top-20 right-[-10%] size-[620px] rounded-full bg-electric/10 blur-[120px]" />
        <HeroStage nodes={ecosystem} eyebrow={site.descriptor}>
            <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-pretty text-muted [animation-delay:520ms]">
              Purpose-built products and intelligent enterprise solutions for a changing world — from farms and schools to hospitals, warehouses and boardrooms.
            </p>
            <div className="mt-9 flex animate-rise flex-col gap-3 [animation-delay:640ms] sm:flex-row">
              <ButtonLink href="/products" arrow>
                Explore Products
              </ButtonLink>
              <ButtonLink href="/enterprise-solutions#consult" variant="secondary">
                Discuss an Enterprise Project
              </ButtonLink>
            </div>
            <dl className="mt-12 grid max-w-lg animate-rise grid-cols-3 gap-6 border-t border-line pt-6 [animation-delay:760ms]">
              {[
                { k: "Product categories", v: String(categories.length) },
                { k: "Business lines", v: "Products + Services" },
                { k: "Markets", v: "India & global" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="text-xs text-muted">{s.k}</dt>
                  <dd className="mt-1 text-sm font-semibold text-midnight">{s.v}</dd>
                </div>
              ))}
            </dl>
        </HeroStage>
      </section>

      {/* 3. Product ecosystem — eight categories */}
      <section aria-labelledby="categories-heading" className="border-t border-line bg-white py-20 sm:py-28">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <SectionHeading eyebrow="Product ecosystem" title={<span id="categories-heading">Eight categories. One standard of engineering.</span>} />
            <p className="max-w-xl leading-relaxed text-muted lg:justify-self-end">
              Every Medhavya product shares the same foundations — identity, data, AI services and integrations — so what you adopt today connects with what you need next.
            </p>
          </div>
          <ol data-reveal-group="55" className="mt-14 grid border-t border-line md:grid-cols-2">
            {categories.map((c, i) => {
              const inCategory = allProducts.filter((p) => p.categorySlug === c.slug);
              return (
                <li key={c.slug} className="border-b border-line md:odd:border-r md:odd:pr-8 md:even:pl-8">
                  <Link href={`/product-categories/${c.slug}`} className="row-sweep group -mx-3 flex items-start gap-5 rounded-[var(--radius-md)] px-3 py-6 transition-colors">
                    <span className="font-mono text-xs text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                      <CategoryIcon icon={c.icon} className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-lg font-semibold tracking-tight text-midnight group-hover:text-primary">{c.name}</span>
                        <ArrowUpRight aria-hidden className="size-4 shrink-0 text-line-strong transition-[color,translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">{c.tagline}</span>
                      {inCategory.length > 0 && (
                        <span className="mt-3 flex flex-wrap gap-1.5">
                          {inCategory.map((p) => (
                            <span key={p.slug} className="rounded-full bg-canvas px-2.5 py-0.5 text-xs font-medium text-ink">
                              {p.name}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* 4. Featured products */}
      <section aria-labelledby="featured-heading" className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Featured products"
              title={<span id="featured-heading">A closer look at the portfolio.</span>}
              intro="Concept interfaces show the direction of each product. Lifecycle badges show exactly where it stands today."
            />
            <ButtonLink href="/products" variant="secondary" arrow className="shrink-0">
              Explore all products
            </ButtonLink>
          </div>
          <div className="mt-14">
            <ProductShowcase products={featured} categoryNames={Object.fromEntries(categories.map((c) => [c.slug, c.name]))} />
          </div>
        </Container>
      </section>

      {/* 5. Enterprise capabilities — distinct dark treatment */}
      <section aria-labelledby="enterprise-heading" className="dark-section relative overflow-hidden bg-midnight py-20 text-white sm:py-28">
        <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div aria-hidden className="absolute -top-48 -left-40 size-[560px] rounded-full bg-primary/25 blur-[140px]" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                tone="dark"
                eyebrow="Medhavya Enterprise Solutions"
                title={<span id="enterprise-heading">When the right software doesn’t exist yet, we build it with you.</span>}
                intro="Custom software, applied AI and integration work — scoped in phases, delivered with governance, and handed over with documentation."
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/enterprise-solutions#consult" variant="light" arrow>
                  Discuss an Enterprise Project
                </ButtonLink>
                <ButtonLink href="/enterprise-solutions" variant="outline-light">
                  How we engage
                </ButtonLink>
              </div>
            </div>
            <ul data-reveal-group="120" className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-white/10">
              {services.map((s) => {
                const Icon = serviceIcons[s.slug as keyof typeof serviceIcons] ?? Blocks;
                return (
                  <li key={s.slug} className="bg-midnight-2/95">
                    <Link
                      href={`/enterprise-solutions/${s.slug}`}
                      data-spotlight
                      className="group grid gap-5 p-6 transition-colors hover:bg-white/[0.02] sm:grid-cols-[48px_1fr_auto] sm:p-8"
                    >
                      <span className="flex size-12 items-center justify-center rounded-xl border border-white/15 text-cyan">
                        <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                      </span>
                      <span>
                        <span className="block text-xl font-semibold tracking-tight">{s.name}</span>
                        <span className="mt-2 block text-sm leading-relaxed text-white/65">{s.summary}</span>
                        <span className="mt-4 flex flex-wrap gap-1.5">
                          {s.capabilities.map((c) => (
                            <span key={c} className="rounded-full border border-white/12 px-2.5 py-0.5 text-xs text-white/75">
                              {c}
                            </span>
                          ))}
                        </span>
                      </span>
                      <ArrowUpRight aria-hidden className="hidden size-5 text-white/40 transition-colors group-hover:text-cyan sm:block" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      {/* 6. Industry solutions */}
      <section aria-labelledby="industries-heading" className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Industry solutions" title={<span id="industries-heading">Business problems first. Products second.</span>} />
            <ButtonLink href="/industries" variant="ghost" arrow>
              All industries
            </ButtonLink>
          </div>
          <div data-reveal-group="90" className="mt-12 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white">
            {industries.map((ind) => (
              <div key={ind.slug} className="row-sweep grid gap-4 border-b border-line p-6 last:border-b-0 md:grid-cols-[200px_1fr_1fr] md:items-center md:gap-8 md:px-8">
                <h3 className="text-lg font-semibold tracking-tight text-midnight">
                  <Link href={`/industries/${ind.slug}`} className="hover:text-primary">
                    {ind.name}
                  </Link>
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  <span className="font-medium text-ink">The challenge: </span>
                  {ind.painPoints[0]}.
                </p>
                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  {getProductsBySlugs(ind.relatedProducts).map((p) => (
                    <Link key={p.slug} href={`/products/${p.slug}`} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-xs font-medium text-ink transition-colors hover:border-primary hover:text-primary">
                      {p.name}
                      <ArrowRight aria-hidden className="size-3" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 7. How Medhavya works */}
      <section aria-labelledby="process-heading" className="border-y border-line bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="How Medhavya works"
            title={<span id="process-heading">A delivery rhythm you can see.</span>}
            intro="Each phase ends with something you can review — a report, a prototype, a tested increment — so progress is demonstrated, not just reported."
          />
          <div className="relative mt-14">
          <span aria-hidden className="absolute top-5 right-[10%] left-[10%] hidden h-px bg-line md:block" />
          <span aria-hidden className="timeline-fill absolute top-5 right-[10%] left-[10%] hidden h-[2px] -translate-y-px rounded-full bg-gradient-to-r from-primary via-cyan to-gold md:block" />
          <ol data-reveal-group="120" className="relative grid gap-8 md:grid-cols-5 md:gap-4">
            {deliveryLifecycle.map((s, i) => (
              <li key={s.step} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-white font-mono text-sm font-semibold text-primary shadow-[0_0_0_6px_white]">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-base font-semibold text-midnight md:mt-4">{s.step}</span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-muted">{s.description}</span>
                </span>
              </li>
            ))}
          </ol>
          </div>
        </Container>
      </section>

      {/* 8. Proof — transparent "Our approach" until verified outcomes exist */}
      <section aria-labelledby="approach-heading" className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <SectionHeading
              eyebrow="Our approach"
              title={<span id="approach-heading">Principles we hold ourselves to.</span>}
              intro="Rather than borrow credibility, we would rather show you how we work. Verified client outcomes will appear here as they are earned."
            />
          </div>
          <ul data-reveal-group="100" className="grid gap-4 sm:grid-cols-2">
            {principles.map(({ Icon, title, text }, i) => (
              <li key={title} className={i % 2 === 1 ? "sm:translate-y-8" : undefined}>
                <div data-spotlight="light" className="card-glow group h-full rounded-[var(--radius-lg)] p-6 hover:shadow-[var(--shadow-panel)]">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-midnight">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 9. Resources */}
      <section aria-labelledby="resources-heading" className="pt-8 pb-4 sm:pt-16">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Insights" title={<span id="resources-heading">Thinking we share openly.</span>} />
            <ButtonLink href="/resources" variant="ghost" arrow>
              All resources
            </ButtonLink>
          </div>
          <ul data-reveal-group="100" className="mt-12 grid gap-6 md:grid-cols-3">
            {resources.map((r) => (
              <li key={r.slug}>
                <article className="group relative flex h-full flex-col border-t-2 border-midnight pt-5">
                  <span aria-hidden className="absolute -top-0.5 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-cyan transition-[width] duration-700 ease-out group-hover:w-full" />
                  <p className="flex items-center gap-2 font-mono text-[0.7rem] tracking-wider text-muted uppercase">
                    {r.type} · {r.readingMinutes} min read
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-midnight group-hover:text-primary">
                    <Link href={`/resources/blog/${r.slug}`}>{r.title}</Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{r.excerpt}</p>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="FAQ" title={<span id="faq-heading">Questions people ask us first.</span>} />
          <Faq items={homeFaqs} />
        </Container>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: homeFaqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
          }}
        />
      </section>

      {/* 10. Final CTA */}
      <CtaBand />
    </>
  );
}
