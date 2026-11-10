import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Section";
import { MosaicVisual } from "@/components/visuals/PageVisuals";
import { getIndustries, getProductsBySlugs } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Industries",
  description: "How Medhavya Systems products and services support agriculture, healthcare, education, retail, logistics, manufacturing and financial services.",
  path: "/industries",
});

export default function IndustriesPage() {
  const industries = getIndustries();
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Built around how each industry actually works."
        intro="We start from the operational problems of a sector, then map the products and services that address them."
        crumbs={[{ label: "Industries" }]}
        visual={<MosaicVisual />}
      />
      <section className="py-14 sm:py-20">
        <Container>
          <ul data-reveal-group="70" className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line md:grid-cols-2">
            {industries.map((ind, i) => (
              <li key={ind.slug} className="bg-white">
                <Link href={`/industries/${ind.slug}`} className="group flex h-full flex-col p-7 transition-colors hover:bg-canvas sm:p-9">
                  <span className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <ArrowUpRight aria-hidden className="size-5 text-line-strong transition-colors group-hover:text-primary" />
                  </span>
                  <span className="mt-6 text-2xl font-semibold tracking-tight text-midnight group-hover:text-primary">{ind.name}</span>
                  <span className="mt-3 text-sm leading-relaxed text-muted">{ind.description}</span>
                  <span className="mt-6 flex flex-wrap gap-1.5">
                    {getProductsBySlugs(ind.relatedProducts).map((p) => (
                      <span key={p.slug} className="rounded-full bg-canvas px-2.5 py-0.5 text-xs font-medium text-ink group-hover:bg-white">
                        {p.name}
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
