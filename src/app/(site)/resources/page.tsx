import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { DemoBadge } from "@/components/ui/Badges";
import { DeckVisual } from "@/components/visuals/PageVisuals";
import { HeroPhotoBackground } from "@/components/visuals/HeroPhotoBackground";
import { Container, AccentBar } from "@/components/ui/Section";
import { getResources } from "@/lib/content";
import { resourceImages, typeStyles } from "@/lib/resource-images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resources",
  description: "Insights, guides and articles from Medhavya Systems on applied AI, enterprise delivery and product design.",
  path: "/resources",
});

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function Cover({ slug, className }: { slug: string; className?: string }) {
  const img = resourceImages[slug];
  if (!img) return <div aria-hidden className={`bg-gradient-to-br from-primary to-electric ${className ?? ""}`} />;
  return (
    <div aria-hidden className={`relative overflow-hidden bg-midnight ${className ?? ""}`}>
      <Image src={img.cover} alt="" fill unoptimized sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" style={{ objectPosition: img.position }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
    </div>
  );
}

export default function ResourcesPage() {
  const [lead, ...rest] = getResources();
  const leadStyle = lead ? (typeStyles[lead.type] ?? typeStyles.Article) : typeStyles.Article;
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Insights on building software that holds up."
        intro="How we think about applied AI, delivery and responsible product design."
        crumbs={[{ label: "Resources" }]}
        visual={<DeckVisual cards={getResources().map((r) => ({ title: r.title, sub: `${r.type} · ${r.readingMinutes} min read`, lines: 3 }))} />}
        background={<HeroPhotoBackground src="/images/resources/hero.jpg" position="50% 60%" />}
      />
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eef3ff] via-[#f3f9fd] to-canvas py-14 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -top-24 right-[-8rem] size-[30rem] rounded-full bg-electric/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-[-8rem] size-[28rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative">
          {lead && (
            <article className="group relative grid overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white shadow-[var(--shadow-lift)] transition-shadow duration-300 hover:shadow-[0_30px_60px_-30px_rgb(16_26_45/0.35)] lg:grid-cols-[1.1fr_1fr]">
              <AccentBar className={leadStyle.bar} />
              <Cover slug={lead.slug} className="min-h-64 lg:min-h-[22rem]" />
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span className={`rounded-full px-2.5 py-1 font-semibold ${leadStyle.badge}`}>{lead.type}</span>
                  <span className="text-muted">
                    <time dateTime={lead.publishedAt}>{dateFmt.format(new Date(lead.publishedAt))}</time>
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted">
                    <Clock aria-hidden className="size-3.5" /> {lead.readingMinutes} min read
                  </span>
                  {lead.isDemo && <DemoBadge className="normal-case" />}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-midnight group-hover:text-primary sm:text-4xl">
                  <Link href={`/resources/blog/${lead.slug}`} className="after:absolute after:inset-0">
                    {lead.title}
                  </Link>
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">{lead.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-primary">
                  Read the article <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          )}
          <ul data-reveal-group="80" className="mt-10 grid gap-6 md:grid-cols-2">
            {rest.map((r) => {
              const st = typeStyles[r.type] ?? typeStyles.Article;
              return (
                <li key={r.slug}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                    <AccentBar className={st.bar} />
                    <Cover slug={r.slug} className="aspect-[16/9]" />
                    <div className="flex flex-1 flex-col p-6">
                      <p className="flex flex-wrap items-center gap-2.5 text-xs">
                        <span className={`rounded-full px-2.5 py-1 font-semibold ${st.badge}`}>{r.type}</span>
                        <span className="text-muted">
                          <time dateTime={r.publishedAt}>{dateFmt.format(new Date(r.publishedAt))}</time>
                        </span>
                        <span className="inline-flex items-center gap-1 text-muted">
                          <Clock aria-hidden className="size-3.5" /> {r.readingMinutes} min
                        </span>
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-midnight group-hover:text-primary">
                        <Link href={`/resources/blog/${r.slug}`} className="after:absolute after:inset-0">
                          {r.title}
                        </Link>
                      </h2>
                      <p className="mt-3 flex-1 leading-relaxed text-muted">{r.excerpt}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {r.tags.map((t) => (
                          <li key={t} className="rounded-full bg-canvas px-2.5 py-0.5 text-xs font-medium text-ink ring-1 ring-line">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
      <CtaBand title="Want to talk through any of this for your team?" intro="These are working notes on how we build. If one of them matches a problem you have, tell us about it." primary={{ href: "/contact", label: "Start a conversation" }} secondary={{ href: "/enterprise-solutions", label: "Enterprise services" }} />
    </>
  );
}
