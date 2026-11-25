import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Blocks, Check, Code2, Cpu, Gauge, Hammer, Layers, ListChecks, PackageCheck, PenTool, Plug, Search, ShieldAlert, ShieldCheck, TrendingUp, Workflow, type LucideIcon } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Container, SectionHeading, AccentBar, CardLabel } from "@/components/ui/Section";
import { LayerStackVisual } from "@/components/visuals/PageVisuals";
import { HeroPhotoBackground } from "@/components/visuals/HeroPhotoBackground";
import { enterpriseFocus, enterpriseLayers } from "@/components/visuals/layers";
import { deliveryLifecycle } from "@/content/enterprise";
import { getEnterpriseService, getEnterpriseServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

/** Icons and tints for the capability cards, cycled by position (full class names so Tailwind keeps them). */
const capabilityStyles: { Icon: LucideIcon; tint: string }[] = [
  { Icon: Layers, tint: "bg-blue-100 text-primary" },
  { Icon: Cpu, tint: "bg-violet-100 text-violet-700" },
  { Icon: Workflow, tint: "bg-cyan/20 text-cyan-ink" },
  { Icon: ShieldCheck, tint: "bg-emerald-100 text-emerald-700" },
  { Icon: Gauge, tint: "bg-amber-100 text-amber-700" },
  { Icon: Blocks, tint: "bg-rose-100 text-rose-700" },
  { Icon: Code2, tint: "bg-sky-100 text-sky-700" },
];

/** One icon per delivery step, in `deliveryLifecycle` order. */
const stepIcons: LucideIcon[] = [Search, PenTool, Hammer, Plug, TrendingUp];

// All slugs are prerendered; see note in app/products/[slug]/page.tsx.
export const instant = false;

export function generateStaticParams() {
  return getEnterpriseServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/enterprise-solutions/[slug]">) {
  const { slug } = await params;
  const service = getEnterpriseService(slug);
  if (!service) return {};
  return pageMetadata({ title: service.seo.title, description: service.seo.description, path: `/enterprise-solutions/${service.slug}` });
}

export default async function EnterpriseServicePage({ params }: PageProps<"/enterprise-solutions/[slug]">) {
  const { slug } = await params;
  const service = getEnterpriseService(slug);
  if (!service) notFound();
  const others = getEnterpriseServices().filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        tone="dark"
        eyebrow="Enterprise Solutions"
        title={service.name}
        intro={service.summary}
        crumbs={[{ label: "Enterprise Solutions", href: "/enterprise-solutions" }, { label: service.name }]}
        visual={<LayerStackVisual layers={enterpriseLayers} focus={enterpriseFocus[service.slug]} />}
        background={<HeroPhotoBackground src={`/images/services/${service.slug}.jpg`} />}
      >
        {/* Jump links; the counts come straight from this service's content */}
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2.5">
          {[
            { href: "#problems", label: `${service.problems.length} problems we solve` },
            { href: "#capabilities", label: `${service.capabilities.length} capabilities` },
            { href: "#deliverables", label: `${service.deliverables.length} deliverables` },
            { href: "#process", label: "5-step process" },
          ].map((l) => (
            <a key={l.href} href={l.href} className="inline-flex min-h-11 items-center rounded-full border border-white/40 bg-white/15 px-4 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-midnight">
              {l.label}
            </a>
          ))}
        </nav>
      </PageHero>

      {/* Problems */}
      <section id="problems" className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd] py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute -top-20 -left-32 size-[26rem] rounded-full bg-electric/15 blur-3xl" />
        <Container className="relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Problems we solve" title="Sound familiar?" />
          <ul data-reveal-group="70" className="space-y-4">
            {service.problems.map((p, i) => (
              <li key={p} className="group flex items-start gap-4 rounded-[var(--radius-md)] border border-line bg-white p-5 text-lg text-midnight transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
                <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 font-mono text-sm font-semibold text-white shadow-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="relative scroll-mt-24 overflow-hidden border-y border-line bg-white py-20 sm:py-24">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_70%)]" />
        <Container className="relative">
          <SectionHeading eyebrow="Capabilities" title="What this covers" />
          <ul data-reveal-group="60" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.capabilities.map((c, i) => {
              const { Icon, tint } = capabilityStyles[i % capabilityStyles.length];
              return (
                <li key={c} className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-6 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                  <span aria-hidden className={`flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tint}`}>
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-4 text-base font-semibold text-midnight">{c}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Deliverables and boundaries */}
      <section id="deliverables" className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#f1f6fd] to-canvas py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[26rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-7 shadow-[var(--shadow-panel)] sm:p-9">
            <AccentBar className="from-emerald-500 to-teal-400" />
            <CardLabel tone="emerald" icon={<PackageCheck aria-hidden className="size-4" />}>
              Deliverables
            </CardLabel>
            <ul className="mt-6 space-y-3">
              {service.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-ink">
                  <span aria-hidden className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-7 shadow-[var(--shadow-panel)] sm:p-9">
            <AccentBar className="from-amber-500 to-orange-400" />
            <CardLabel tone="amber" icon={<ShieldAlert aria-hidden className="size-4" />}>
              Boundaries
            </CardLabel>
            <p className="mt-3 text-sm text-muted">What we will and will not take on, stated up front.</p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink">
              {service.boundaries.map((b) => (
                <li key={b} className="callout-bar rounded-[var(--radius-md)] bg-amber-50 py-3 pr-4 before:bg-amber-500">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section id="process" className="dark-section relative scroll-mt-24 overflow-hidden bg-midnight py-20 text-white sm:py-24">
        <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div aria-hidden className="absolute -top-40 -left-32 size-[30rem] rounded-full bg-primary/30 blur-[120px]" />
        <Container className="relative">
          <SectionHeading eyebrow="Process" title="From discovery to hand-over" tone="dark" />
          <ol data-reveal-group="80" className="relative mt-12 grid gap-4 md:grid-cols-5">
            <span aria-hidden className="absolute top-[2.9rem] right-[10%] left-[10%] hidden h-px bg-gradient-to-r from-primary via-cyan to-primary md:block" />
            {deliveryLifecycle.map((st, i) => {
              const Icon = stepIcons[i] ?? ListChecks;
              return (
                <li key={st.step} className="relative rounded-[var(--radius-md)] border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-cyan/50 hover:bg-white/10">
                  <span className="relative z-10 flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-white shadow-[0_8px_20px_-6px_rgb(53_185_214/0.6)]">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span className="mt-4 block font-mono text-xs text-cyan">0{i + 1}</span>
                  <h3 className="mt-1 font-semibold text-white">{st.step}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/75">{st.description}</p>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* Other services */}
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd] py-20 sm:py-24">
        <Container className="relative">
          <SectionHeading eyebrow="More services" title="Other ways we can help" />
          <ul data-reveal-group="50" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/enterprise-solutions/${o.slug}`} className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-white p-5 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                  <span className="text-base font-semibold text-midnight group-hover:text-primary">{o.name}</span>
                  <span className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{o.summary}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Explore <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand
        title={`Discuss a ${service.name.toLowerCase()} project.`}
        intro="Tell us about the problem and the systems involved. We will reply with questions or a proposal for a discovery conversation."
        primary={{ href: "/enterprise-solutions#consult", label: "Request a consultation" }}
        secondary={{ href: "/products", label: "Explore products" }}
      />
    </>
  );
}
