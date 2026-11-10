import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Section";
import { CatalogueBrowser } from "@/features/products/CatalogueBrowser";
import { DeckVisual } from "@/components/visuals/PageVisuals";
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
  return (
    <>
      <PageHero
        eyebrow="Product catalogue"
        title="Software built for the work that matters."
        intro="Search the portfolio by name or capability, or browse by category. Every listing shows its real lifecycle stage, so you know what is available today and what is still being built."
        crumbs={[{ label: "Products" }]}
        visual={<DeckVisual cards={deck} />}
      />
      <section className="py-12 sm:py-16">
        <Container>
          <CatalogueBrowser products={getProducts()} categories={categories} />
        </Container>
      </section>
      <CtaBand title="Looking for something we have not listed?" intro="Many of our products started as a client’s specific need. Tell us the problem and we will tell you honestly whether we can help." primary={{ href: "/contact", label: "Tell us what you need" }} />
    </>
  );
}
