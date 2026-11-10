import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { DeckVisual } from "@/components/visuals/PageVisuals";
import { getProductsBySlugs } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Solutions",
  description: "Cross-product solutions that combine Medhavya products and services around common business goals.",
  path: "/solutions",
});

/** Cross-product solution themes. Combinations are illustrative until validated with customers. */
const solutions = [
  {
    title: "Connected operations",
    problem: "Sales, inventory and finance run on separate tools, so nobody sees the whole business.",
    products: ["medhavya-crm", "medhavya-manage", "medhavya-erp"],
    how: "Enquiries in CRM become orders, stock moves in Manage or ERP, and finance sees the result without re-keying.",
  },
  {
    title: "Paperless back office",
    problem: "Invoices, forms and requests are typed into systems by hand.",
    products: ["medhavya-autoflow", "medhavya-erp"],
    how: "AutoFlow extracts and routes documents for human review, then posts approved results into ERP.",
  },
  {
    title: "Farm-to-market visibility",
    problem: "Harvest timing and volumes are unclear until produce is already moving.",
    products: ["medhavya-agro", "medhavya-logitrack"],
    how: "Field records in Agro inform harvest windows; LogiTrack coordinates pickups and deliveries.",
  },
  {
    title: "Digital campus",
    problem: "School offices, teachers and parents work from different, disconnected information.",
    products: ["medhavya-edusphere", "medhavya-autoflow"],
    how: "EduSphere keeps one student record; AutoFlow can digitise admissions paperwork with staff review.",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Products work better together."
        intro="Medhavya products share identity, data and integration foundations. These solution themes show how they combine around common business goals."
        crumbs={[{ label: "Solutions" }]}
        visual={<DeckVisual cards={solutions.map((s) => ({ title: s.title, sub: `${s.products.length} connected products`, icon: "enterprise" as const }))} />}
      />
      <section className="py-16 sm:py-24">
        <Container className="space-y-6">
          {solutions.map((s, i) => (
            <article key={s.title} className="grid gap-6 rounded-[var(--radius-lg)] border border-line bg-white p-7 sm:p-9 lg:grid-cols-[60px_1fr_1fr_auto] lg:items-start lg:gap-10">
              <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-midnight">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  <span className="font-medium text-ink">Problem: </span>
                  {s.problem}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-ink">{s.how}</p>
              <ul className="flex flex-wrap gap-2 lg:flex-col">
                {getProductsBySlugs(s.products).map((p) => (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-xs font-medium whitespace-nowrap text-ink hover:border-primary hover:text-primary">
                      {p.name} <ArrowRight aria-hidden className="size-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <p className="pt-2 text-xs text-muted">Solution combinations describe intended product interoperability and are subject to each product’s current lifecycle stage.</p>
        </Container>
      </section>
      <section className="pb-4">
        <Container>
          <SectionHeading eyebrow="Browse by sector" title="Looking for your industry?" />
          <Link href="/industries" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary-strong">
            See industries <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
