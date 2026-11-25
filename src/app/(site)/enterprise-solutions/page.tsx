import Link from "next/link";
import { ArrowUpRight, Check, Compass, Hammer, Minus, PackageCheck, PenTool, Plug, Search, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { AccentBar, Container, SectionHeading } from "@/components/ui/Section";
import { deliveryLifecycle } from "@/content/enterprise";
import { LayerStackVisual } from "@/components/visuals/PageVisuals";
import { Starfield } from "@/components/visuals/Starfield";
import { enterpriseLayers } from "@/components/visuals/layers";
import { LeadForm } from "@/features/leads/LeadForm";
import { getEnterpriseServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Enterprise Solutions",
  description: "Custom software, AI & automation, and integration & modernization from Medhavya Enterprise Solutions.",
  path: "/enterprise-solutions",
});

// Tints are full class names so Tailwind keeps them.
const engagementModels: { name: string; fit: string; output: string; Icon: LucideIcon; tint: string; bar: string }[] = [
  { name: "Discovery sprint", fit: "You have a problem but not yet a clear solution.", output: "Findings, options and a phased plan.", Icon: Compass, tint: "bg-violet-100 text-violet-700", bar: "from-violet-500 to-fuchsia-400" },
  { name: "Fixed-scope project", fit: "Requirements and acceptance criteria are well defined.", output: "A delivered, tested and documented system.", Icon: PackageCheck, tint: "bg-blue-100 text-primary", bar: "from-primary to-electric" },
  { name: "Dedicated product team", fit: "You need ongoing product engineering capacity.", output: "Continuous delivery against a shared roadmap.", Icon: Users, tint: "bg-emerald-100 text-emerald-700", bar: "from-emerald-500 to-teal-400" },
];

const governance = [
  "Named delivery lead and client-side owner",
  "Agreed acceptance criteria before build",
  "Demonstrated progress at the end of every increment",
  "Risk and decision log shared with you",
  "Security and privacy review before release",
  "Documented hand-over and runbooks",
];

/** One icon per delivery step, in `deliveryLifecycle` order. */
const stepIcons: LucideIcon[] = [Search, PenTool, Hammer, Plug, TrendingUp];

export default function EnterprisePage() {
  const services = getEnterpriseServices();
  const allCapabilities = services.flatMap((s) => s.capabilities.map((c) => ({ c, slug: s.slug })));

  return (
    <>
      <PageHero
        tone="dark"
        eyebrow="Medhavya Enterprise Solutions"
        title="Custom technology, delivered with accountability."
        intro="When packaged software does not fit, we design, build and integrate solutions with you — scoped in phases, governed openly and handed over properly."
        crumbs={[{ label: "Enterprise Solutions" }]}
        visual={<LayerStackVisual layers={enterpriseLayers} />}
        backdrop={<Starfield />}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#consult" variant="light" arrow>
            Discuss an enterprise project
          </ButtonLink>
        </div>
      </PageHero>

      {/* Capability matrix */}
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd] py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-32 size-[26rem] rounded-full bg-electric/15 blur-3xl" />
        <Container className="relative">
          <SectionHeading eyebrow="Capability matrix" title="What we take on" intro={`${services.length} practices, each with clearly stated boundaries. If a request falls outside them, we will say so.`} />
          <div className="relative mt-12 overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white shadow-[var(--shadow-panel)]">
            <AccentBar className="from-primary via-electric to-cyan" />
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Capabilities by enterprise practice</caption>
              <thead>
                <tr className="border-b border-line bg-gradient-to-r from-[#eef3ff] to-[#f1f9fd]">
                  <th scope="col" className="p-4 pt-5 font-semibold text-muted">
                    Capability
                  </th>
                  {services.map((s) => (
                    <th key={s.slug} scope="col" className="p-4 pt-5 font-semibold text-midnight">
                      <Link href={`/enterprise-solutions/${s.slug}`} className="inline-flex items-center gap-1 hover:text-primary">
                        {s.name} <ArrowUpRight aria-hidden className="size-3.5" />
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allCapabilities.map(({ c, slug }) => (
                  <tr key={c} className="border-b border-line transition-colors last:border-b-0 hover:bg-canvas">
                    <th scope="row" className="p-4 font-normal text-ink">
                      {c}
                    </th>
                    {services.map((s) => (
                      <td key={s.slug} className="p-4">
                        {s.slug === slug ? (
                          <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <Check aria-label="Primary practice" className="size-3.5" strokeWidth={3} />
                          </span>
                        ) : (
                          <Minus aria-label="Not primary" className="size-4 text-line-strong" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Lifecycle */}
      <section className="dark-section relative overflow-hidden bg-midnight py-20 text-white sm:py-24">
        <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div aria-hidden className="absolute -top-40 -left-32 size-[30rem] rounded-full bg-primary/30 blur-[120px]" />
        <Container className="relative">
          <SectionHeading tone="dark" eyebrow="Delivery lifecycle" title="Discover → Design → Build → Integrate → Improve" />
          <ol data-reveal-group="100" className="relative mt-12 grid gap-4 md:grid-cols-5">
            <span aria-hidden className="absolute top-[2.9rem] right-[10%] left-[10%] hidden h-px bg-gradient-to-r from-primary via-cyan to-primary md:block" />
            {deliveryLifecycle.map((s, i) => {
              const Icon = stepIcons[i] ?? Search;
              return (
                <li key={s.step} data-spotlight className="relative rounded-[var(--radius-md)] border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-cyan/50 hover:bg-white/10">
                  <span className="relative z-10 flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-white shadow-[0_8px_20px_-6px_rgb(53_185_214/0.6)]">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span className="mt-4 block font-mono text-xs text-cyan">0{i + 1}</span>
                  <h3 className="mt-1 text-lg font-semibold">{s.step}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{s.description}</p>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* Engagement & governance */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f1f6fd] to-canvas py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[26rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Engagement model" title="Ways to work together" />
            <ul data-reveal-group="80" className="mt-8 space-y-4">
              {engagementModels.map(({ name, fit, output, Icon, tint, bar }) => (
                <li key={name} className="group relative flex gap-4 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-5 transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
                  <AccentBar className={bar} />
                  <span aria-hidden className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tint}`}>
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-midnight">{name}</h3>
                    <p className="mt-1 text-sm text-muted">
                      <span className="font-medium text-ink">Best when: </span>
                      {fit}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      <span className="font-medium text-ink">You receive: </span>
                      {output}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Delivery governance" title="How we stay accountable" />
            <ul data-reveal-group="60" className="mt-8 grid gap-3">
              {governance.map((g) => (
                <li key={g} className="flex items-start gap-3 rounded-[var(--radius-md)] border border-line bg-white p-4 text-ink transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
                  <span aria-hidden className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {g}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">
              Security practices are described on our{" "}
              <Link href="/security" className="font-medium text-primary underline underline-offset-2">
                security page
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* Consultation */}
      <section id="consult" className="relative scroll-mt-20 overflow-hidden border-t border-line bg-white py-20 sm:py-24">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_70%)]" />
        <Container className="relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Project consultation"
            title="Tell us about your project."
            intro="Share the problem, the systems involved and any timelines. We will reply with questions or a proposal for a discovery conversation."
          />
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-white/80 bg-canvas/90 p-6 shadow-[var(--shadow-lift)] backdrop-blur-md sm:p-10">
            <AccentBar className="from-primary via-electric to-cyan" />
            <LeadForm enquiryType="EnterpriseConsultation" submitLabel="Request consultation" />
          </div>
        </Container>
      </section>
    </>
  );
}
