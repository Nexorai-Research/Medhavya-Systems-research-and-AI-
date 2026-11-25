import { Activity, Cpu, Database, FileCode2, KeyRound, Network, TestTube2, Workflow } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { AccentBar, Container, SectionHeading } from "@/components/ui/Section";
import { LayerStackVisual } from "@/components/visuals/PageVisuals";
import { Starfield } from "@/components/visuals/Starfield";
import { platformLayers } from "@/components/visuals/layers";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Technology",
  description: "How Medhavya Systems designs, builds and operates software: shared platform foundations, applied AI with review, and disciplined delivery.",
  path: "/technology",
});

// Tints are full class names so Tailwind keeps them.
const layers = [
  { Icon: KeyRound, name: "Identity & access", text: "Role-based access, least privilege by default, audit trails for sensitive actions.", tile: "from-primary to-electric" },
  { Icon: Database, name: "Data layer", text: "Relational data with explicit ownership, migrations, backups and tested restores.", tile: "from-emerald-500 to-teal-400" },
  { Icon: Cpu, name: "AI services", text: "Extraction, classification and assistance with confidence signals and human review.", tile: "from-violet-500 to-fuchsia-400" },
  { Icon: Network, name: "Integrations", text: "Adapters with server-side credentials — no provider logic scattered through the UI.", tile: "from-amber-500 to-orange-400" },
];

const practices = [
  { Icon: TestTube2, name: "Automated testing", text: "Unit, integration and end-to-end tests run on every change.", tint: "bg-emerald-100 text-emerald-700", bar: "from-emerald-500 to-teal-400" },
  { Icon: FileCode2, name: "Typed contracts", text: "Strictly typed code and validated API contracts on both client and server.", tint: "bg-blue-100 text-primary", bar: "from-primary to-electric" },
  { Icon: Activity, name: "Observability", text: "Structured logs with request IDs, error monitoring and uptime checks — without logging personal data.", tint: "bg-cyan/20 text-cyan-ink", bar: "from-cyan to-sky-400" },
  { Icon: Workflow, name: "Incremental delivery", text: "Small, reviewable releases with rollback plans.", tint: "bg-amber-100 text-amber-700", bar: "from-amber-500 to-orange-400" },
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
        backdrop={<Starfield />}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd] py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-32 size-[26rem] rounded-full bg-electric/15 blur-3xl" />
        <Container className="relative">
          <SectionHeading eyebrow="Platform layers" title="What every product shares" />
          <div data-reveal-group="80" className="mt-12 grid gap-4">
            {layers.map(({ Icon, name, text, tile }, i) => (
              <div
                key={name}
                className="group relative grid items-center gap-4 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-5 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:grid-cols-[56px_220px_1fr] sm:p-6"
                style={{ marginLeft: `min(${i * 3}%, ${i * 24}px)` }}
              >
                <AccentBar className={tile} />
                <span aria-hidden className={`flex size-14 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tile}`}>
                  <Icon className="size-6" strokeWidth={1.7} />
                </span>
                <h3 className="text-lg font-semibold text-midnight">{name}</h3>
                <p className="text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden border-y border-line bg-white py-20 sm:py-24">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_70%)]" />
        <Container className="relative">
          <SectionHeading eyebrow="Engineering practices" title="How we keep quality visible" />
          <ul data-reveal-group="70" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {practices.map(({ Icon, name, text, tint, bar }) => (
              <li key={name} className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-6 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                <AccentBar className={bar} />
                <span aria-hidden className={`flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tint}`}>
                  <Icon className="size-5" strokeWidth={1.8} />
                </span>
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
