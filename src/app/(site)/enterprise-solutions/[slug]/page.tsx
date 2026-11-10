import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CircleDot, PackageCheck, ShieldAlert } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { LayerStackVisual } from "@/components/visuals/PageVisuals";
import { enterpriseFocus, enterpriseLayers } from "@/components/visuals/layers";
import { deliveryLifecycle } from "@/content/enterprise";
import { getEnterpriseService, getEnterpriseServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

// All slugs are prerendered; see note in app/products/[slug]/page.tsx.
export const instant = false;

export function generateStaticParams() {
  return getEnterpriseServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/enterprise-solutions/[slug]">) {
  const { slug } = await params;
  const service = getEnterpriseService(slug);
  if (!service) return {};
  return pageMetadata({ title: service.seo.title, description: service.seo.description, path: `/enterprise-solutions/${service.slug}` });
}

export default async function EnterpriseServicePage({ params }: PageProps<"/enterprise-solutions/[slug]">) {
  const { slug } = await params;
  const service = getEnterpriseService(slug);
  if (!service) notFound();
  const others = getEnterpriseServices().filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        tone="dark"
        eyebrow="Enterprise Solutions"
        title={service.name}
        intro={service.summary}
        crumbs={[{ label: "Enterprise Solutions", href: "/enterprise-solutions" }, { label: service.name }]}
        visual={<LayerStackVisual layers={enterpriseLayers} focus={enterpriseFocus[service.slug]} />}
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Problems we solve" title="Sound familiar?" />
          <ul className="space-y-4">
            {service.problems.map((p) => (
              <li key={p} className="flex gap-4 rounded-[var(--radius-md)] border border-line bg-white p-5 text-lg text-midnight">
                <CircleDot aria-hidden className="mt-1 size-5 shrink-0 text-primary" />
                {p}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-y border-line bg-white py-20 sm:py-24">
        <Container className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold tracking-[0.14em] text-muted uppercase">Capabilities</h2>
            <ul className="mt-5 space-y-3">
              {service.capabilities.map((c) => (
                <li key={c} className="font-medium text-midnight">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-[0.14em] text-muted uppercase">
              <PackageCheck aria-hidden className="size-4" /> Deliverables
            </h2>
            <ul className="mt-5 space-y-3">
              {service.deliverables.map((d) => (
                <li key={d} className="text-ink">
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-canvas p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-[0.14em] text-muted uppercase">
              <ShieldAlert aria-hidden className="size-4" /> Boundaries
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink">
              {service.boundaries.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Process" title="From discovery to hand-over" />
          <ol className="mt-10 grid gap-4 md:grid-cols-5">
            {deliveryLifecycle.map((s, i) => (
              <li key={s.step} className="rounded-[var(--radius-md)] border border-line bg-white p-5">
                <span className="font-mono text-xs text-primary">0{i + 1}</span>
                <h3 className="mt-2 font-semibold text-midnight">{s.step}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.description}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/enterprise-solutions/${o.slug}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-sm font-medium text-ink hover:border-primary hover:text-primary">
                {o.name} <ArrowRight aria-hidden className="size-3.5" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title={`Discuss a ${service.name.toLowerCase()} project.`}
        intro="Tell us about the problem and the systems involved. We will reply with questions or a proposal for a discovery conversation."
        primary={{ href: "/enterprise-solutions#consult", label: "Request a consultation" }}
        secondary={{ href: "/products", label: "Explore products" }}
      />
    </>
  );
}
