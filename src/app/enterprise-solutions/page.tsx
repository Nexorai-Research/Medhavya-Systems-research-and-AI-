import Link from "next/link";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { deliveryLifecycle } from "@/content/enterprise";
import { LayerStackVisual } from "@/components/visuals/PageVisuals";
import { enterpriseLayers } from "@/components/visuals/layers";
import { LeadForm } from "@/features/leads/LeadForm";
import { getEnterpriseServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Enterprise Solutions",
  description: "Custom software, AI & automation, and integration & modernization from Medhavya Enterprise Solutions.",
  path: "/enterprise-solutions",
});

const engagementModels = [
  { name: "Discovery sprint", fit: "You have a problem but not yet a clear solution.", output: "Findings, options and a phased plan." },
  { name: "Fixed-scope project", fit: "Requirements and acceptance criteria are well defined.", output: "A delivered, tested and documented system." },
  { name: "Dedicated product team", fit: "You need ongoing product engineering capacity.", output: "Continuous delivery against a shared roadmap." },
];

const governance = [
  "Named delivery lead and client-side owner",
  "Agreed acceptance criteria before build",
  "Demonstrated progress at the end of every increment",
  "Risk and decision log shared with you",
  "Security and privacy review before release",
  "Documented hand-over and runbooks",
];

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
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#consult" className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-midnight hover:bg-canvas">
            Discuss an enterprise project
          </a>
        </div>
      </PageHero>

      {/* Capability matrix */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Capability matrix" title="What we take on" intro="Three practices with clearly stated boundaries. If a request falls outside them, we will say so." />
          <div className="mt-12 overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Capabilities by enterprise practice</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="p-4 font-semibold text-muted">
                    Capability
                  </th>
                  {services.map((s) => (
                    <th key={s.slug} scope="col" className="p-4 font-semibold text-midnight">
                      <Link href={`/enterprise-solutions/${s.slug}`} className="inline-flex items-center gap-1 hover:text-primary">
                        {s.name} <ArrowUpRight aria-hidden className="size-3.5" />
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allCapabilities.map(({ c, slug }) => (
                  <tr key={c} className="border-b border-line last:border-b-0">
                    <th scope="row" className="p-4 font-normal text-ink">
                      {c}
                    </th>
                    {services.map((s) => (
                      <td key={s.slug} className="p-4">
                        {s.slug === slug ? (
                          <Check aria-label="Primary practice" className="size-4 text-success" />
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
      <section className="dark-section bg-midnight py-20 text-white sm:py-24">
        <Container>
          <SectionHeading tone="dark" eyebrow="Delivery lifecycle" title="Discover → Design → Build → Integrate → Improve" />
          <ol data-reveal-group="100" className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] bg-white/10 md:grid-cols-5">
            {deliveryLifecycle.map((s, i) => (
              <li key={s.step} data-spotlight className="bg-midnight-2 p-6">
                <span className="font-mono text-xs text-cyan">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{s.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Engagement & governance */}
      <section className="py-20 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Engagement model" title="Ways to work together" />
            <ul className="mt-8 space-y-4">
              {engagementModels.map((m) => (
                <li key={m.name} className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
                  <h3 className="font-semibold text-midnight">{m.name}</h3>
                  <p className="mt-1 text-sm text-muted">
                    <span className="font-medium text-ink">Best when: </span>
                    {m.fit}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    <span className="font-medium text-ink">You receive: </span>
                    {m.output}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Delivery governance" title="How we stay accountable" />
            <ul className="mt-8 grid gap-3">
              {governance.map((g) => (
                <li key={g} className="flex gap-3 border-b border-line pb-3 text-ink">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-cyan-ink" />
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
      <section id="consult" className="scroll-mt-20 border-t border-line bg-white py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Project consultation"
            title="Tell us about your project."
            intro="Share the problem, the systems involved and any timelines. We will reply with questions or a proposal for a discovery conversation."
          />
          <div className="rounded-[var(--radius-xl)] border border-line bg-canvas p-6 sm:p-10">
            <LeadForm enquiryType="EnterpriseConsultation" submitLabel="Request consultation" />
          </div>
        </Container>
      </section>
    </>
  );
}
