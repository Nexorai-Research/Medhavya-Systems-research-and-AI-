import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Starfield } from "@/components/visuals/Starfield";

export default function NotFound() {
  return (
    <section className="dark-section relative overflow-hidden bg-midnight text-white">
      <Starfield />
      <Container className="relative flex min-h-[60vh] flex-col items-start justify-center py-24">
        <p className="bg-gradient-to-r from-primary via-cyan to-amber-300 bg-clip-text font-mono text-7xl font-semibold text-transparent sm:text-8xl">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">This page isn’t here.</h1>
        <p className="mt-4 max-w-lg text-lg text-white/75">The link may be out of date, or the page may have moved. Try the product catalogue or head back home.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="light" arrow>
            Back to home
          </ButtonLink>
          <ButtonLink href="/products" variant="outline-light">
            Browse products
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
