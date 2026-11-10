import Link from "next/link";
import { BrandOrbitVisual } from "@/components/visuals/PageVisuals";
import { Boxes, Building2 } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description: "Medhavya Systems is a product-led technology company building intelligent software and delivering practical enterprise solutions.",
  path: "/about",
});

const values = [
  { name: "Intelligent", text: "We apply AI and data where they create real value — and say so plainly when they do not." },
  { name: "Clear", text: "We explain technical ideas in business language and write documentation people can use." },
  { name: "Dependable", text: "We commit to what we can deliver, and deliver what we commit to." },
  { name: "Practical", text: "We build for real constraints: budgets, connectivity, existing systems and people’s time." },
  { name: "Forward-looking", text: "We design products that can grow with an organisation instead of being replaced by it." },
  { name: "Human", text: "Technology should give people time and confidence back, not take them away." },
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
        visual={<BrandOrbitVisual values={["Intelligent", "Practical", "Dependable", "Human"]} />}
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="Mission" title="Help organisations operate, adapt and grow with software that is intelligent and practical." />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[var(--radius-lg)] border border-line bg-white p-6">
              <Boxes aria-hidden className="size-6 text-primary" strokeWidth={1.6} />
              <h3 className="mt-4 text-lg font-semibold text-midnight">Software Products</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">Repeatable products across eight categories, from agriculture and education to healthcare and enterprise.</p>
              <ButtonLink href="/products" variant="ghost" arrow className="mt-3 -ml-2">
                Products
              </ButtonLink>
            </div>
            <div className="dark-section rounded-[var(--radius-lg)] bg-midnight p-6 text-white">
              <Building2 aria-hidden className="size-6 text-cyan" strokeWidth={1.6} />
              <h3 className="mt-4 text-lg font-semibold">Enterprise Solutions</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">Custom software, AI and integration work for organisations whose needs packaged products do not meet.</p>
              <Link href="/enterprise-solutions" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-cyan hover:text-white">
                Enterprise Solutions →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Values" title="What we want to be known for" />
          <dl data-reveal-group="80" className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.name} className="border-t-2 border-midnight pt-5">
                <dt className="text-xl font-semibold tracking-tight text-midnight">{v.name}</dt>
                <dd className="mt-2 leading-relaxed text-muted">{v.text}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="Operating principles" title="Commitments you can hold us to" />
          <ol className="space-y-4">
            {operatingPrinciples.map((p, i) => (
              <li key={p} className="flex items-baseline gap-5 border-b border-line pb-4">
                <span className="font-mono text-sm text-primary">0{i + 1}</span>
                <span className="text-lg font-medium text-midnight">{p}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
