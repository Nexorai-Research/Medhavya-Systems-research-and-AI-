import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export function CtaBand({
  title = "Let’s talk about what you need to build.",
  intro = "Explore a product with our team, or discuss a custom enterprise project. We reply with a clear next step — not a sales script.",
  primary = { href: "/request-demo", label: "Request a demo" },
  secondary = { href: "/enterprise-solutions#consult", label: "Discuss an enterprise project" },
}: {
  title?: string;
  intro?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div data-reveal="scale" data-spotlight className="dark-section relative overflow-hidden rounded-[var(--radius-xl)] bg-midnight px-6 py-12 text-white sm:px-12 sm:py-16">
          <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(circle_at_80%_20%,black,transparent_70%)]" />
          <div aria-hidden className="absolute -right-24 -bottom-32 size-[420px] rounded-full border border-gold/30" />
          <div aria-hidden className="absolute -right-10 -bottom-20 size-[300px] rounded-full border border-electric/40" />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-white/70">{intro}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <ButtonLink href={primary.href} variant="light" arrow>
                {primary.label}
              </ButtonLink>
              <ButtonLink href={secondary.href} variant="outline-light">
                {secondary.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
