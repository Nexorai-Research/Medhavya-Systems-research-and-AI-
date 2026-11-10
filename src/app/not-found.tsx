import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(circle,black,transparent_70%)]" />
      <Container className="relative flex min-h-[60vh] flex-col items-start justify-center py-24">
        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-midnight sm:text-5xl">This page isn’t here.</h1>
        <p className="mt-4 max-w-lg text-lg text-muted">The link may be out of date, or the page may have moved. Try the product catalogue or head back home.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" arrow>
            Back to home
          </ButtonLink>
          <ButtonLink href="/products" variant="secondary">
            Browse products
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
