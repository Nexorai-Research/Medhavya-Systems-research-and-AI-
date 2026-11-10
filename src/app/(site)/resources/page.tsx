import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { DemoBadge } from "@/components/ui/Badges";
import { DeckVisual } from "@/components/visuals/PageVisuals";
import { Container } from "@/components/ui/Section";
import { getResources } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resources",
  description: "Insights, guides and articles from Medhavya Systems on applied AI, enterprise delivery and product design.",
  path: "/resources",
});

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function ResourcesPage() {
  const [lead, ...rest] = getResources();
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Insights on building software that holds up."
        intro="How we think about applied AI, delivery and responsible product design."
        crumbs={[{ label: "Resources" }]}
        visual={<DeckVisual cards={getResources().map((r) => ({ title: r.title, sub: `${r.type} · ${r.readingMinutes} min read`, lines: 3 }))} />}
      />
      <section className="py-14 sm:py-20">
        <Container>
          {lead && (
            <article className="group grid gap-8 border-b border-line pb-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
              <div>
                <p className="flex flex-wrap items-center gap-3 font-mono text-xs tracking-wider text-muted uppercase">
                  {lead.type} · <time dateTime={lead.publishedAt}>{dateFmt.format(new Date(lead.publishedAt))}</time> · {lead.readingMinutes} min read
                  {lead.isDemo && <DemoBadge className="normal-case" />}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-midnight group-hover:text-primary sm:text-4xl">
                  <Link href={`/resources/blog/${lead.slug}`}>{lead.title}</Link>
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-muted">{lead.excerpt}</p>
            </article>
          )}
          <ul className="mt-12 grid gap-10 md:grid-cols-2">
            {rest.map((r) => (
              <li key={r.slug}>
                <article className="group">
                  <p className="font-mono text-xs tracking-wider text-muted uppercase">
                    {r.type} · <time dateTime={r.publishedAt}>{dateFmt.format(new Date(r.publishedAt))}</time>
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-midnight group-hover:text-primary">
                    <Link href={`/resources/blog/${r.slug}`}>{r.title}</Link>
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted">{r.excerpt}</p>
                  <ul className="mt-4 flex gap-2">
                    {r.tags.map((t) => (
                      <li key={t} className="rounded-full bg-white px-2.5 py-0.5 text-xs text-muted ring-1 ring-line">
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
