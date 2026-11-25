import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { AccentBar, Container } from "@/components/ui/Section";
import { MosaicVisual } from "@/components/visuals/PageVisuals";
import { Starfield } from "@/components/visuals/Starfield";
import { getIndustries, getProductsBySlugs } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Industries",
  description: "How Medhavya Systems products and services support agriculture, healthcare, education, retail, logistics, manufacturing and financial services.",
  path: "/industries",
});

// Accent colours cycle by position (full class names so Tailwind keeps them).
const accents = [
  { bar: "from-emerald-500 to-teal-400", badge: "from-emerald-500 to-teal-400" },
  { bar: "from-rose-500 to-orange-400", badge: "from-rose-500 to-orange-400" },
  { bar: "from-primary to-electric", badge: "from-primary to-electric" },
  { bar: "from-amber-500 to-yellow-400", badge: "from-amber-500 to-yellow-400" },
  { bar: "from-violet-500 to-fuchsia-400", badge: "from-violet-500 to-fuchsia-400" },
];

export default function IndustriesPage() {
  const industries = getIndustries();
  return (
    <>
      <PageHero
        tone="dark"
        eyebrow="Industries"
        title="Built around how each industry actually works."
        intro="We start from the operational problems of a sector, then map the products and services that address them."
        crumbs={[{ label: "Industries" }]}
        visual={<MosaicVisual />}
        backdrop={<Starfield />}
      />
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd] py-14 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-32 size-[26rem] rounded-full bg-electric/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[24rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative">
          <ul data-reveal-group="70" className="grid gap-6 md:grid-cols-2">
            {industries.map((ind, i) => {
              const a = accents[i % accents.length];
              return (
                <li key={ind.slug}>
                  <Link href={`/industries/${ind.slug}`} className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                    <AccentBar className={a.bar} />
                    <div aria-hidden className="relative aspect-[16/8] overflow-hidden bg-midnight">
                      <Image src={`/images/industries/${ind.slug}.jpg`} alt="" fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <span className={`absolute bottom-4 left-4 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br font-mono text-sm font-semibold text-white shadow-sm ${a.badge}`}>{String(i + 1).padStart(2, "0")}</span>
                      <ArrowUpRight className="absolute right-4 bottom-4 size-6 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <span className="text-2xl font-semibold tracking-tight text-midnight group-hover:text-primary">{ind.name}</span>
                      <span className="mt-3 flex-1 text-sm leading-relaxed text-muted">{ind.description}</span>
                      <span className="mt-5 flex flex-wrap gap-1.5">
                        {getProductsBySlugs(ind.relatedProducts).map((p) => (
                          <span key={p.slug} className="rounded-full bg-canvas px-2.5 py-0.5 text-xs font-medium text-ink ring-1 ring-line">
                            {p.name}
                          </span>
                        ))}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
