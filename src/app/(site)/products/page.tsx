import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Section";
import { CatalogueBrowser } from "@/features/products/CatalogueBrowser";
import { DeckVisual } from "@/components/visuals/PageVisuals";
import { CyclingHeroVideo } from "@/components/visuals/HeroVideoBackground";
import { heroVideos } from "@/lib/hero-videos";
import { getCategories, getFeaturedProducts, getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Products",
  description: "Explore Medhavya Systems software products across agriculture, retail, AI, finance, enterprise, education, healthcare and logistics.",
  path: "/products",
});

export default function ProductsPage() {
  const categories = getCategories().map(({ slug, name, shortName, icon }) => ({ slug, name, shortName, icon }));
  const iconOf = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const deck = getFeaturedProducts()
    .slice(0, 5)
    .map((p) => ({ title: p.name, sub: iconOf[p.categorySlug].shortName, icon: iconOf[p.categorySlug].icon, lifecycle: p.lifecycle }));
  // The supplied Agro360AI clip is low resolution, so the full-bleed catalogue hero uses the Full HD clips only.
  const heroClips = getProducts()
    .filter((p) => p.slug !== "medhavya-agro" && heroVideos[p.slug])
    .map((p) => ({ label: p.name, video: heroVideos[p.slug] }));
  return (
    <>
      <PageHero
        eyebrow="Product catalogue"
        title="Software built for the work that matters."
        intro="Search the portfolio by name or capability, or browse by category. Every listing shows its real lifecycle stage, so you know what is available today and what is still being built."
        crumbs={[{ label: "Products" }]}
        visual={<DeckVisual cards={deck} />}
        background={<CyclingHeroVideo clips={heroClips} />}
      />
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eef3ff] via-[#f3f9fd] to-canvas py-12 sm:py-16">
        <div aria-hidden className="pointer-events-none absolute -top-24 right-[-8rem] size-[30rem] rounded-full bg-electric/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-[-8rem] size-[28rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative">
          <CatalogueBrowser products={getProducts()} categories={categories} />
        </Container>
      </section>
      <CtaBand title="Looking for something we have not listed?" intro="Many of our products started as a client’s specific need. Tell us the problem and we will tell you honestly whether we can help." primary={{ href: "/contact", label: "Tell us what you need" }} />
    </>
  );
}
