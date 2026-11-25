"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Starfield } from "@/components/visuals/Starfield";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="dark-section relative overflow-hidden bg-midnight text-white">
      <Starfield />
      <Container className="relative flex min-h-[60vh] flex-col items-start justify-center py-24">
        <p className="font-mono text-sm text-rose-300">Something went wrong</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">We could not load this page.</h1>
        <p className="mt-4 max-w-lg text-lg text-white/75">Please try again. If the problem continues, contact us and quote the reference below.</p>
        {error.digest && <p className="mt-3 font-mono text-xs text-white/60">Reference: {error.digest}</p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="light" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href="/" variant="outline-light">
            Back to home
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
