import { Activity, Cpu, Database, FileCode2, KeyRound, Network, TestTube2, Workflow } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { LayerStackVisual } from "@/components/visuals/PageVisuals";
import { platformLayers } from "@/components/visuals/layers";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Technology",
  description: "How Medhavya Systems designs, builds and operates software: shared platform foundations, applied AI with review, and disciplined delivery.",
  path: "/technology",
});

const layers = [
  { Icon: KeyRound, name: "Identity & access", text: "Role-based access, least privilege by default, audit trails for sensitive actions." },
  { Icon: Database, name: "Data layer", text: "Relational data with explicit ownership, migrations, backups and tested restores." },
  { Icon: Cpu, name: "AI services", text: "Extraction, classification and assistance with confidence signals and human review." },
  { Icon: Network, name: "Integrations", text: "Adapters with server-side credentials — no provider logic scattered through the UI." },
];

const practices = [
  { Icon: TestTube2, name: "Automated testing", text: "Unit, integration and end-to-end tests run on every change." },
  { Icon: FileCode2, name: "Typed contracts", text: "Strictly typed code and validated API contracts on both client and server." },
  { Icon: Activity, name: "Observability", text: "Structured logs with request IDs, error monitoring and uptime checks — without logging personal data." },
  { Icon: Workflow, name: "Incremental delivery", text: "Small, reviewable releases with rollback plans." },
];

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        tone="dark"
        eyebrow="Technology & delivery"
        title="Shared foundations. Disciplined engineering."
        intro="Every Medhavya product is built on the same platform layers, so capabilities like access control, data handling and AI review are consistent — and improvements reach every product."
        crumbs={[{ label: "Technology" }]}
        visual={<LayerStackVisual layers={platformLayers} />}
      />

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Platform layers" title="What every product shares" />
          <div className="mt-12 grid gap-3">
            {layers.map(({ Icon, name, text }, i) => (
              <div
                key={name}
                className="grid items-center gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-5 sm:grid-cols-[48px_220px_1fr] sm:p-6"
                style={{ marginLeft: `min(${i * 3}%, ${i * 24}px)` }}
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-midnight text-cyan">
                  <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                </span>
                <h3 className="text-lg font-semibold text-midnight">{name}</h3>
                <p className="text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Engineering practices" title="How we keep quality visible" />
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {practices.map(({ Icon, name, text }) => (
              <li key={name}>
                <Icon aria-hidden className="size-6 text-primary" strokeWidth={1.6} />
                <h3 className="mt-4 font-semibold text-midnight">{name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand title="Evaluating our architecture?" intro="Technical evaluators can request architecture, deployment and data-handling details as part of a demo or consultation." />
    </>
  );
}
