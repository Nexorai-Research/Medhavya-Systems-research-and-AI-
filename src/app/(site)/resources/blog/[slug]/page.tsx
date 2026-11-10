import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/PageHero";
import { DemoBadge } from "@/components/ui/Badges";
import { Container } from "@/components/ui/Section";
import { getResource, getResources } from "@/lib/content";
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

  return (
    <article>
      <header className="border-b border-line">
        <Container className="max-w-3xl pt-10 pb-12 sm:pt-14">
          <Breadcrumbs items={[{ label: "Resources", href: "/resources" }, { label: article.title }]} />
          <p className="mt-10 flex flex-wrap items-center gap-3 font-mono text-xs tracking-wider text-muted uppercase">
            {article.type} · <time dateTime={article.publishedAt}>{dateFmt.format(new Date(article.publishedAt))}</time> · {article.readingMinutes} min read
            {article.isDemo && <DemoBadge className="normal-case" />}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance text-midnight sm:text-5xl">{article.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-muted">{article.excerpt}</p>
          <p className="mt-6 text-sm text-ink">By {article.author}</p>
        </Container>
      </header>
      <Container className="max-w-3xl py-12 sm:py-16">
        <div className="space-y-10">
          {article.body.map((section, i) => (
            <section key={i}>
              {section.heading && <h2 className="mb-4 text-2xl font-semibold tracking-tight text-midnight">{section.heading}</h2>}
              <div className="space-y-5 text-lg leading-[1.75] text-ink">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="mt-14 border-t border-line pt-8">
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <ArrowLeft aria-hidden className="size-4" /> All resources
          </Link>
          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="text-sm font-semibold tracking-[0.14em] text-muted uppercase">Related reading</h2>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/resources/blog/${r.slug}`} className="text-lg font-semibold text-midnight hover:text-primary">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </article>
  );
}
