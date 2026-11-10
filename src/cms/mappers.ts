import type { EnterpriseService, Industry, Product, ProductCategory, Resource } from "../content/types";

/**
 * Two-way mapping between the site's content types (src/content/types.ts) and Payload documents.
 * `toDoc` is used by the seed; `fromDoc` by the publish snapshot.
 */
type Doc = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const rows = (value: unknown): Doc[] => (Array.isArray(value) ? (value as Doc[]) : []);
const strings = (value: unknown): string[] => (Array.isArray(value) ? (value as string[]) : []);
const clean = ({ id, ...rest }: Doc) => {
  void id;
  return rest;
};
const seo = (d: Doc) => ({ title: d.seo?.title ?? "", description: d.seo?.description ?? "" });

export const categoryToDoc = (c: ProductCategory) => ({ ...c });
export const categoryFromDoc = (d: Doc): ProductCategory => ({
  slug: d.slug,
  name: d.name,
  shortName: d.shortName,
  tagline: d.tagline,
  description: d.description,
  context: strings(d.context),
  icon: d.icon,
  displayOrder: d.displayOrder,
  publication: d.publication,
  seo: seo(d),
});

export const productToDoc = (p: Product) => ({ ...p });
export const productFromDoc = (d: Doc): Product => ({
  slug: d.slug,
  name: d.name,
  categorySlug: d.categorySlug,
  summary: d.summary,
  description: d.description,
  lifecycle: d.lifecycle,
  publication: d.publication,
  isDemo: Boolean(d.isDemo),
  audience: strings(d.audience),
  problem: d.problem,
  outcomes: strings(d.outcomes),
  features: rows(d.features).map((f) => ({ title: f.title, description: f.description })),
  useCases: rows(d.useCases).map((u) => ({ title: u.title, steps: strings(u.steps) })),
  industries: strings(d.industries),
  deployment: strings(d.deployment),
  integrations: strings(d.integrations),
  support: d.support ?? "",
  faqs: rows(d.faqs).map((f) => ({ question: f.question, answer: f.answer })),
  mockup: d.mockup,
  featured: Boolean(d.featured),
  seo: seo(d),
  governance: {
    owner: d.governance?.owner ?? "",
    reviewer: d.governance?.reviewer ?? "",
    lastReviewed: d.governance?.lastReviewed ?? "",
    evidenceSource: d.governance?.evidenceSource ?? "",
  },
});

export const industryToDoc = (i: Industry) => ({ ...i });
export const industryFromDoc = (d: Doc): Industry => ({
  slug: d.slug,
  name: d.name,
  description: d.description,
  painPoints: strings(d.painPoints),
  solutions: strings(d.solutions),
  relatedProducts: strings(d.relatedProducts),
  publication: d.publication,
  seo: seo(d),
});

export const serviceToDoc = (s: EnterpriseService) => ({ ...s, publication: "Published" as const });
export const serviceFromDoc = (d: Doc): EnterpriseService => ({
  slug: d.slug,
  name: d.name,
  summary: d.summary,
  problems: strings(d.problems),
  capabilities: strings(d.capabilities),
  boundaries: strings(d.boundaries),
  deliverables: strings(d.deliverables),
  seo: seo(d),
});

export const resourceToDoc = (r: Resource) => ({ ...r, body: r.body.map((b) => ({ heading: b.heading, paragraphs: b.paragraphs })) });
export const resourceFromDoc = (d: Doc): Resource => ({
  slug: d.slug,
  title: d.title,
  type: d.type,
  author: d.author,
  excerpt: d.excerpt,
  body: rows(d.body).map((b) => {
    const { heading, paragraphs } = clean(b);
    return heading ? { heading, paragraphs: strings(paragraphs) } : { paragraphs: strings(paragraphs) };
  }),
  tags: strings(d.tags),
  publishedAt: d.publishedAt,
  readingMinutes: d.readingMinutes,
  isDemo: Boolean(d.isDemo),
  publication: d.publication,
  seo: seo(d),
});

export interface ContentSnapshot {
  generatedAt: string;
  categories: ProductCategory[];
  products: Product[];
  industries: Industry[];
  enterpriseServices: EnterpriseService[];
  resources: Resource[];
}
