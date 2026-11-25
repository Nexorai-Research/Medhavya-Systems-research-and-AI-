import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/PageHero";
import { DemoBadge } from "@/components/ui/Badges";
import { Container, AccentBar, CardLabel } from "@/components/ui/Section";
import { getResource, getResources } from "@/lib/content";
import { resourceImages, typeStyles } from "@/lib/resource-images";
import { pageMetadata } from "@/lib/seo";

// All slugs are prerendered; see note in app/products/[slug]/page.tsx.
export const instant = false;

export function generateStaticParams() {
  return getResources().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/blog/[slug]">) {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) return {};
  return pageMetadata({ title: r.seo.title, description: r.seo.description, path: `/resources/blog/${r.slug}` });
}

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function ArticlePage({ params }: PageProps<"/resources/blog/[slug]">) {
  const { slug } = await params;
  const article = getResource(slug);
  if (!article) notFound();
  const related = getResources().filter((r) => r.slug !== article.slug && r.tags.some((t) => article.tags.includes(t))).slice(0, 2);
  const img = resourceImages[article.slug];
  const st = typeStyles[article.type] ?? typeStyles.Article;

  return (
    <article>
      <header className="relative overflow-hidden border-b border-line bg-gradient-to-b from-[#eef3ff] to-canvas">
        <AccentBar className={st.bar} />
        <Container className="max-w-3xl pt-5 pb-10 sm:pt-7">
          <Breadcrumbs items={[{ label: "Resources", href: "/resources" }, { label: article.title }]} />
          <p className="mt-8 flex flex-wrap items-center gap-2.5 text-xs">
            <span className={`rounded-full px-2.5 py-1 font-semibold ${st.badge}`}>{article.type}</span>
            <time dateTime={article.publishedAt} className="text-muted">
              {dateFmt.format(new Date(article.publishedAt))}
            </time>
            <span className="inline-flex items-center gap-1 text-muted">
              <Clock aria-hidden className="size-3.5" /> {article.readingMinutes} min read
            </span>
            {article.isDemo && <DemoBadge className="normal-case" />}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance text-midnight sm:text-5xl">{article.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-muted">{article.excerpt}</p>
          <p className="mt-6 text-sm text-ink">By {article.author}</p>
        </Container>
        {img && (
          <Container className="max-w-5xl pb-0">
            <div className="relative aspect-[21/9] overflow-hidden rounded-t-[var(--radius-lg)] bg-midnight shadow-[var(--shadow-lift)]">
              <Image src={img.cover} alt="" fill priority unoptimized sizes="(min-width: 1024px) 64rem, 100vw" className="object-cover" style={{ objectPosition: img.position }} />
            </div>
          </Container>
        )}
      </header>
      <Container className="max-w-3xl py-12 sm:py-16">
        <div className="space-y-10">
          {article.body.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-midnight">{section.heading}</h2>
              )}
              <div className="space-y-5 text-lg leading-[1.75] text-ink">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {i === 0 && img?.inline && (
                <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] bg-midnight">
                  <Image src={img.inline} alt="" fill unoptimized sizes="48rem" className="object-cover" />
                </div>
              )}
            </section>
          ))}
        </div>
        <div className="mt-14 border-t border-line pt-8">
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <ArrowLeft aria-hidden className="size-4" /> All resources
          </Link>
          {related.length > 0 && (
            <div className="mt-10">
              <CardLabel>Related reading</CardLabel>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((r) => {
                  const rs = typeStyles[r.type] ?? typeStyles.Article;
                  return (
                    <li key={r.slug}>
                      <Link href={`/resources/blog/${r.slug}`} className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-line bg-white p-5 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                        <AccentBar className={rs.bar} />
                        <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${rs.badge}`}>{r.type}</span>
                        <span className="mt-3 text-lg font-semibold text-midnight group-hover:text-primary">{r.title}</span>
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary">
                          Read <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </article>
  );
}
