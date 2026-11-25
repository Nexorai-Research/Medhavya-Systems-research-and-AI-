import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Section";
import { Starfield } from "@/components/visuals/Starfield";
import { SearchBrowser } from "@/features/search/SearchBrowser";
import { buildSearchIndex } from "@/lib/search-index";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Search",
    description: "Search Medhavya Systems products, services, industries and articles.",
    path: "/search",
  }),
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <>
      <PageHero tone="dark" backdrop={<Starfield />} eyebrow="Search" title="Find what you need." intro="Search across products, services, industries and articles." crumbs={[{ label: "Search" }]} />
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd] py-12 sm:py-16">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-32 size-[26rem] rounded-full bg-electric/15 blur-3xl" />
        <Container className="relative">
          <Suspense fallback={<p className="text-sm text-muted">Loading search…</p>}>
            <SearchBrowser index={buildSearchIndex()} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
