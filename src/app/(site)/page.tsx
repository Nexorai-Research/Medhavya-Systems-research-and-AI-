import Link from "next/link";
import { ArrowRight, ArrowUpRight, Blocks, Cpu, Eye, GitMerge, Lock, ShieldCheck, Workflow } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CtaBand } from "@/components/CtaBand";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { HeroStage } from "@/components/home/hero/HeroStage";
import { categoryVideos, heroVideos } from "@/lib/hero-videos";
import { CardHoverVideo } from "@/components/visuals/CardHoverVideo";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeading, AccentBar } from "@/components/ui/Section";
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

/** Per-card accent colours for the home industry cards (full class names so Tailwind keeps them). */
const industryAccents = [
  { bar: "from-emerald-500 to-teal-400", glow: "bg-emerald-300/40", callout: "before:bg-emerald-500 bg-emerald-50", chip: "border-emerald-200 bg-emerald-50 hover:border-emerald-600 hover:bg-emerald-600" },
  { bar: "from-rose-500 to-orange-400", glow: "bg-rose-300/40", callout: "before:bg-rose-500 bg-rose-50", chip: "border-rose-200 bg-rose-50 hover:border-rose-600 hover:bg-rose-600" },
  { bar: "from-primary to-electric", glow: "bg-electric/30", callout: "before:bg-primary bg-blue-50", chip: "border-blue-200 bg-blue-50 hover:border-primary hover:bg-primary" },
  { bar: "from-amber-500 to-yellow-400", glow: "bg-amber-300/40", callout: "before:bg-amber-500 bg-amber-50", chip: "border-amber-200 bg-amber-50 hover:border-amber-600 hover:bg-amber-600" },
];

export default function HomePage() {
  const categories = getCategories();
  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const featured = getFeaturedProducts();
  const allProducts = getProducts();
  const services = getEnterpriseServices().slice(0, 3);
  const allIndustries = getIndustries();
  const industries = allIndustries.slice(0, 4);
  const moreIndustries = allIndustries.slice(4);
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

  // One background clip per hero product; the hero crossfades between them as the story moves on.
  const heroClips = Object.fromEntries(ecosystem.flatMap((n) => (heroVideos[n.slug] ? [[n.slug, heroVideos[n.slug]]] : [])));

  return (
    <>
      {/* 2. Hero */}
      <section className="relative overflow-hidden">
        <HeroStage nodes={ecosystem} eyebrow={site.descriptor} videos={heroClips}>
            <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed font-medium text-pretty text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.65),0_0_14px_rgb(0_0_0/0.7)] [animation-delay:520ms]">
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
            <dl className="mt-12 grid max-w-lg animate-rise grid-cols-3 grid-rows-[auto_1fr] gap-x-4 gap-y-0 border-t border-white/30 pt-6 [animation-delay:760ms] sm:gap-x-6">
              {[
                { k: "Categories", v: String(categories.length) },
                { k: "Products", v: String(allProducts.length) },
                { k: "Industries", v: String(allIndustries.length) },
              ].map((s) => (
                <div key={s.k} className="row-span-2 grid grid-rows-subgrid">
                  <dt className="text-xs font-medium text-white/90 [text-shadow:0_1px_3px_rgb(0_0_0/0.65),0_0_14px_rgb(0_0_0/0.7)]">{s.k}</dt>
                  <dd className="mt-1 text-sm font-semibold text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.65),0_0_14px_rgb(0_0_0/0.7)]">{s.v}</dd>
                </div>
              ))}
            </dl>
        </HeroStage>
      </section>

      {/* 3. Product ecosystem — eight categories */}
      <section aria-labelledby="categories-heading" className="relative overflow-hidden border-t border-line bg-white py-20 sm:py-28">
        {/* Soft ambient depth behind the cards (decorative; static, so no motion cost) */}
        <div aria-hidden className="pointer-events-none absolute -top-32 -left-24 size-[28rem] rounded-full bg-electric/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute top-1/3 -right-32 size-[30rem] rounded-full bg-cyan/10 blur-3xl" />
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_65%)]" />
        <Container className="relative">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <SectionHeading eyebrow="Product ecosystem" title={<span id="categories-heading">Eight categories. One standard of engineering.</span>} />
            <p className="max-w-xl leading-relaxed text-muted lg:justify-self-end">
              Every Medhavya product shares the same foundations — identity, data, AI services and integrations — so what you adopt today connects with what you need next.
            </p>
          </div>
          <ol data-reveal-group="55" className="mt-14 grid gap-4 md:grid-cols-2">
            {categories.map((c, i) => {
              const inCategory = allProducts.filter((p) => p.categorySlug === c.slug);
              return (
                <li key={c.slug} className="h-full">
                  <Link
                    href={`/product-categories/${c.slug}`}
                    data-spotlight="light"
                    className={`eco-card card-glow group relative isolate flex h-full items-start gap-5 overflow-hidden rounded-[var(--radius-lg)] p-6 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] focus-visible:-translate-y-1 ${categoryVideos[c.slug] ? "eco-card--video" : ""}`}
                  >
                    {categoryVideos[c.slug] && <CardHoverVideo src={categoryVideos[c.slug]} start={2} />}
                    <span className="eco-num w-5 shrink-0 pt-[0.8rem] font-mono text-xs text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="eco-icon flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-primary transition duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                      <CategoryIcon icon={c.icon} className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="eco-title text-lg font-semibold tracking-tight text-midnight group-hover:text-primary">{c.name}</span>
                        <ArrowUpRight aria-hidden className="eco-arrow size-4 shrink-0 text-line-strong transition-[color,translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                      </span>
                      <span className="eco-text mt-1 block text-sm leading-relaxed text-muted">{c.tagline}</span>
                      {inCategory.length > 0 && (
                        <span className="mt-3 flex flex-wrap gap-1.5">
                          {inCategory.map((p) => (
                            <span key={p.slug} className="eco-chip rounded-full bg-canvas px-2.5 py-0.5 text-xs font-medium text-ink transition-colors">
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
      <section aria-labelledby="featured-heading" className="relative overflow-hidden bg-gradient-to-b from-[#eef3ff] via-[#f3f9fd] to-canvas py-20 sm:py-28">
        {/* Decorative colour (static; no motion cost) */}
        <div aria-hidden className="pointer-events-none absolute -top-24 right-[-8rem] size-[32rem] rounded-full bg-electric/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-[-8rem] left-[-8rem] size-[30rem] rounded-full bg-cyan/20 blur-3xl" />
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_50%_20%,black,transparent_70%)]" />
        <Container className="relative">
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
      <section aria-labelledby="industries-heading" className="relative overflow-hidden bg-gradient-to-b from-canvas via-[#f1f6fd] to-canvas py-20 sm:py-28">
        <div aria-hidden className="pointer-events-none absolute top-1/4 -left-40 size-[30rem] rounded-full bg-electric/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 size-[28rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Industry solutions" title={<span id="industries-heading">Business problems first. Products second.</span>} />
            <ButtonLink href="/industries" variant="ghost" arrow>
              All industries
            </ButtonLink>
          </div>
          <div data-reveal-group="90" className="mt-12 grid gap-5 md:grid-cols-2">
            {industries.map((ind, i) => {
              const a = industryAccents[i % industryAccents.length];
              return (
                <div key={ind.slug} className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-6 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                  <AccentBar className={a.bar} />
                  <span aria-hidden className={`pointer-events-none absolute -top-16 -right-16 size-44 rounded-full opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${a.glow}`} />
                  <div className="relative flex items-center gap-3">
                    <span aria-hidden className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br font-mono text-sm font-semibold text-white shadow-sm ${a.bar}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight text-midnight">
                      <Link href={`/industries/${ind.slug}`} className="inline-block py-1.5 hover:text-primary">
                        {ind.name}
                      </Link>
                    </h3>
                  </div>
                  <p className={`callout-bar mt-4 rounded-[var(--radius-md)] py-3 pr-4 text-sm leading-relaxed text-muted ${a.callout}`}>
                    <span className="font-semibold text-ink">The challenge: </span>
                    {ind.painPoints[0]}.
                  </p>
                  <div className="relative mt-5 flex flex-wrap items-center gap-2">
                    {getProductsBySlugs(ind.relatedProducts).map((p) => (
                      <Link key={p.slug} href={`/products/${p.slug}`} className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:text-white ${a.chip}`}>
                        {p.name}
                        <ArrowRight aria-hidden className="size-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {moreIndustries.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="text-sm font-medium text-muted">More industries</p>
              <ul className="flex flex-wrap gap-2">
                {moreIndustries.map((ind) => (
                  <li key={ind.slug}>
                    <Link href={`/industries/${ind.slug}`} className="inline-flex min-h-9 items-center rounded-full border border-line bg-white px-3.5 text-sm font-medium text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white">
                      {ind.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
          <ul data-reveal-group="100" className="grid gap-4 sm:grid-cols-2 sm:pb-8">
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
                  <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-wider text-muted uppercase">
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
