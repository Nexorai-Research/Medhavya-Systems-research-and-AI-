import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Container, SectionHeading, AccentBar } from "@/components/ui/Section";
import { DeckVisual } from "@/components/visuals/PageVisuals";
import { CardHoverVideo } from "@/components/visuals/CardHoverVideo";
import { CyclingHeroVideo } from "@/components/visuals/HeroVideoBackground";
import { SolutionFinder } from "@/features/finder/SolutionFinder";
import { getEnterpriseServices, getIndustries, getProducts, getProductsBySlugs } from "@/lib/content";
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
    video: "/videos/solutions/connected-operations.mp4",
    problem: "Sales, inventory and finance run on separate tools, so nobody sees the whole business.",
    products: ["medhavya-crm", "medhavya-manage", "medhavya-erp"],
    how: "Enquiries in CRM become orders, stock moves in Manage or ERP, and finance sees the result without re-keying.",
  },
  {
    title: "Paperless back office",
    video: "/videos/solutions/paperless-office.mp4",
    problem: "Invoices, forms and requests are typed into systems by hand.",
    products: ["medhavya-autoflow", "medhavya-erp"],
    how: "AutoFlow extracts and routes documents for human review, then posts approved results into ERP.",
  },
  {
    title: "Farm-to-market visibility",
    video: "/videos/solutions/farm-to-market.mp4",
    problem: "Harvest timing and volumes are unclear until produce is already moving.",
    products: ["medhavya-agro", "medhavya-logitrack"],
    how: "Field records in Agro inform harvest windows; LogiTrack coordinates pickups and deliveries.",
  },
  {
    title: "Digital campus",
    video: "/videos/solutions/digital-campus.mp4",
    problem: "School offices, teachers and parents work from different, disconnected information.",
    products: ["medhavya-edusphere", "medhavya-autoflow"],
    how: "EduSphere keeps one student record; AutoFlow can digitise admissions paperwork with staff review.",
  },
];

/** Accent per solution card (full class names so Tailwind keeps them). */
const accents = [
  { bar: "from-primary to-electric" },
  { bar: "from-violet-500 to-fuchsia-400" },
  { bar: "from-emerald-500 to-teal-400" },
  { bar: "from-amber-500 to-yellow-400" },
];

export default function SolutionsPage() {
  // One clip per solution theme (warehouse scanning, document checking, harvest transport, campus study).
  const heroClips = solutions.map((s) => ({ label: s.title, video: { hd: s.video } }));
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Products work better together."
        intro="Medhavya products share identity, data and integration foundations. These solution themes show how they combine around common business goals."
        crumbs={[{ label: "Solutions" }]}
        visual={<DeckVisual cards={solutions.map((s) => ({ title: s.title, sub: `${s.products.length} connected products`, icon: "enterprise" as const }))} />}
        background={<CyclingHeroVideo clips={heroClips} every={8000} />}
      />
      <section id="finder" aria-labelledby="finder-heading" className="relative overflow-hidden border-b border-line bg-gradient-to-b from-[#eef3ff] via-[#f3f9fd] to-white py-16 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute -top-24 right-[-8rem] size-[30rem] rounded-full bg-electric/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-[-8rem] left-[-8rem] size-[28rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative">
          <SectionHeading
            eyebrow="Solution finder"
            title={<span id="finder-heading">Tell us what you need. We will point you to a starting place.</span>}
            intro="Three quick questions, no sign-up. The suggestions come from clear rules over our published catalogue."
          />
          <div className="mt-10">
            <SolutionFinder
              products={getProducts().map((p) => ({ slug: p.slug, name: p.name, summary: p.summary, lifecycle: p.lifecycle, industries: p.industries }))}
              services={getEnterpriseServices().map((s) => ({ slug: s.slug, name: s.name, summary: s.summary }))}
              industries={getIndustries().map((i) => ({ slug: i.slug, name: i.name }))}
            />
          </div>
        </Container>
      </section>
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas via-[#f1f6fd] to-canvas py-16 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute top-1/4 -left-40 size-[30rem] rounded-full bg-electric/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 size-[28rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative">
          <SectionHeading eyebrow="Solution themes" title="How the products combine." />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {solutions.map((s, i) => {
              const a = accents[i % accents.length];
              const products = getProductsBySlugs(s.products);
              return (
                <article key={s.title} className="eco-card--video group relative isolate flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line p-7 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-8">
                  <CardHoverVideo src={s.video} start={1} />
                  {/* Extra shade behind the copy so it stays clearly readable over any frame */}
                  <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-black/25 to-black/45" />
                  <AccentBar className={a.bar} />
                  <div className="relative flex items-center gap-3">
                    <span aria-hidden className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br font-mono text-sm font-semibold text-white shadow-sm ${a.bar}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="eco-title text-2xl font-semibold tracking-tight">{s.title}</h2>
                  </div>
                  <p className="eco-text relative mt-5 text-sm leading-relaxed">
                    <span className="font-semibold">Problem: </span>
                    {s.problem}
                  </p>
                  <p className="eco-text callout-bar mt-4 rounded-[var(--radius-md)] bg-black/30 py-3 pr-4 text-sm leading-relaxed backdrop-blur-[2px] before:bg-white/80">
                    <span className="font-semibold">How it connects: </span>
                    {s.how}
                  </p>
                  {/* Connected products read as a flow: A → B → C */}
                  <ul className="relative mt-5 flex flex-wrap items-center gap-2">
                    {products.map((p, j) => (
                      <li key={p.slug} className="flex items-center gap-2">
                        {j > 0 && <ArrowRight aria-hidden className="size-3.5 text-white" />}
                        <Link href={`/products/${p.slug}`} className="eco-chip inline-flex items-center gap-1 rounded-full border border-white/40 px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors hover:bg-white/45">
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
          <p className="pt-6 text-xs text-muted">Solution combinations describe intended product interoperability and are subject to each product’s current lifecycle stage.</p>
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
