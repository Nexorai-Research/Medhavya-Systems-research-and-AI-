import { BrandOrbitVisual } from "@/components/visuals/PageVisuals";
import { Starfield } from "@/components/visuals/Starfield";
import { Boxes, Brain, Building2, Eye, HeartHandshake, Telescope, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { AccentBar, Container, SectionHeading } from "@/components/ui/Section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description: "Medhavya Systems is a product-led technology company building intelligent software and delivering practical enterprise solutions.",
  path: "/about",
});

/** Each value gets its own icon and colour (full class names so Tailwind keeps them). */
const values: { name: string; text: string; Icon: LucideIcon; tint: string; bar: string }[] = [
  { name: "Intelligent", text: "We apply AI and data where they create real value — and say so plainly when they do not.", Icon: Brain, tint: "bg-violet-100 text-violet-700", bar: "from-violet-500 to-fuchsia-400" },
  { name: "Clear", text: "We explain technical ideas in business language and write documentation people can use.", Icon: Eye, tint: "bg-cyan/20 text-cyan-ink", bar: "from-cyan to-sky-400" },
  { name: "Dependable", text: "We commit to what we can deliver, and deliver what we commit to.", Icon: ShieldCheck, tint: "bg-emerald-100 text-emerald-700", bar: "from-emerald-500 to-teal-400" },
  { name: "Practical", text: "We build for real constraints: budgets, connectivity, existing systems and people’s time.", Icon: Wrench, tint: "bg-amber-100 text-amber-700", bar: "from-amber-500 to-orange-400" },
  { name: "Forward-looking", text: "We design products that can grow with an organisation instead of being replaced by it.", Icon: Telescope, tint: "bg-blue-100 text-primary", bar: "from-primary to-electric" },
  { name: "Human", text: "Technology should give people time and confidence back, not take them away.", Icon: HeartHandshake, tint: "bg-rose-100 text-rose-700", bar: "from-rose-500 to-orange-400" },
];

const operatingPrinciples = [
  "Product status is always shown honestly.",
  "No fabricated metrics, logos or testimonials — ever.",
  "Consequential AI decisions stay with people.",
  "Security and privacy are designed in, not added on.",
  "Every engagement has a named owner on both sides.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Medhavya Systems"
        title="A product-led technology company."
        intro={site.positioning}
        crumbs={[{ label: "About" }]}
        tone="dark"
        backdrop={<Starfield />}
        visual={<BrandOrbitVisual values={["Intelligent", "Practical", "Dependable", "Human"]} />}
      />

      {/* Mission */}
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd] py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-32 size-[26rem] rounded-full bg-electric/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[24rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="Mission" title="Help organisations operate, adapt and grow with software that is intelligent and practical." />
          <div data-reveal-group="90" className="grid gap-5 sm:grid-cols-2">
            <div className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-6 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
              <AccentBar className="from-primary to-cyan" />
              <span aria-hidden className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-primary transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <Boxes className="size-6" strokeWidth={1.7} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-midnight">Software Products</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">Repeatable products across eight categories, from agriculture and education to healthcare and enterprise.</p>
              <ButtonLink href="/products" variant="secondary" arrow className="mt-5 self-start">
                Products
              </ButtonLink>
            </div>
            <div className="dark-section group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] bg-midnight p-6 text-white transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
              <AccentBar className="from-amber-400 to-yellow-300" />
              <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-primary/40 blur-3xl" />
              <span aria-hidden className="relative flex size-12 items-center justify-center rounded-xl bg-white/10 text-cyan ring-1 ring-white/15 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <Building2 className="size-6" strokeWidth={1.7} />
              </span>
              <h3 className="relative mt-5 text-lg font-semibold">Enterprise Solutions</h3>
              <p className="relative mt-2 flex-1 text-sm leading-relaxed text-white/75">Custom software, AI and integration work for organisations whose needs packaged products do not meet.</p>
              <ButtonLink href="/enterprise-solutions" variant="light" arrow className="relative mt-5 self-start">
                Enterprise Solutions
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden border-y border-line bg-white py-20 sm:py-24">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_70%)]" />
        <Container className="relative">
          <SectionHeading eyebrow="Values" title="What we want to be known for" />
          <ul data-reveal-group="70" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <li key={v.name} className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-6 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                <AccentBar className={v.bar} />
                <span aria-hidden className={`flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${v.tint}`}>
                  <v.Icon className="size-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-midnight">{v.name}</h3>
                <p className="mt-2 leading-relaxed text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Operating principles */}
      <section className="dark-section relative overflow-hidden bg-midnight py-20 text-white sm:py-24">
        <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div aria-hidden className="absolute -top-40 -left-32 size-[30rem] rounded-full bg-primary/30 blur-[120px]" />
        <Container className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading tone="dark" eyebrow="Operating principles" title="Commitments you can hold us to" />
          <ol data-reveal-group="80" className="space-y-3">
            {operatingPrinciples.map((p, i) => (
              <li key={p} className="flex items-center gap-4 rounded-[var(--radius-md)] border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-cyan/50 hover:bg-white/10">
                <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan font-mono text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgb(53_185_214/0.6)]">
                  0{i + 1}
                </span>
                <span className="text-lg font-medium text-white">{p}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
