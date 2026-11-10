import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Section";
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
      <PageHero eyebrow="Search" title="Find what you need." intro="Search across products, services, industries and articles." crumbs={[{ label: "Search" }]} />
      <section className="py-12 sm:py-16">
        <Container>
          <Suspense fallback={<p className="text-sm text-muted">Loading search…</p>}>
            <SearchBrowser index={buildSearchIndex()} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
