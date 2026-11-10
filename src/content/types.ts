/**
 * Content model mirroring the Module 04 collections. Today these records live in
 * typed modules under src/content; the shapes are kept CMS-ready so Payload
 * collections can replace the static source without changing page code.
 */

export const LIFECYCLE_STATUSES = [
  "Research",
  "In Development",
  "Private Pilot",
  "Beta",
  "Generally Available",
  "Deprecated",
  "Retired",
] as const;
export type LifecycleStatus = (typeof LIFECYCLE_STATUSES)[number];

export const PUBLICATION_STATES = ["Draft", "In Review", "Published", "Archived"] as const;
export type PublicationState = (typeof PUBLICATION_STATES)[number];

export type CategoryIcon =
  | "agriculture"
  | "retail"
  | "ai"
  | "finance"
  | "enterprise"
  | "education"
  | "healthcare"
  | "other";

export interface Governance {
  owner: string;
  reviewer: string;
  lastReviewed: string; // ISO date
  evidenceSource: string;
}

export interface SeoFields {
  title: string;
  description: string;
}

export interface ProductCategory {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  context: string[];
  icon: CategoryIcon;
  displayOrder: number;
  publication: PublicationState;
  seo: SeoFields;
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface MockupSpec {
  /** Product area shown in the concept UI navigation. */
  nav: string[];
  /** Headline metric tiles (sample data, rendered as illustrative). */
  tiles: { label: string; value: string; trend?: "up" | "down" | "flat" }[];
  /** Rows in the concept UI list panel. */
  rows: { primary: string; secondary: string; state: "ok" | "attention" | "pending" }[];
  chart: number[];
}

export interface Product {
  slug: string;
  name: string;
  categorySlug: string;
  summary: string;
  description: string;
  lifecycle: LifecycleStatus;
  publication: PublicationState;
  /** True while the listing is demonstration content awaiting founder-approved facts. */
  isDemo: boolean;
  audience: string[];
  problem: string;
  outcomes: string[];
  features: ProductFeature[];
  useCases: { title: string; steps: string[] }[];
  industries: string[];
  deployment: string[];
  integrations: string[];
  support: string;
  faqs: ProductFaq[];
  mockup: MockupSpec;
  featured: boolean;
  seo: SeoFields;
  governance: Governance;
}

export interface Industry {
  slug: string;
  name: string;
  description: string;
  painPoints: string[];
  solutions: string[];
  relatedProducts: string[];
  publication: PublicationState;
  seo: SeoFields;
}

export interface EnterpriseService {
  slug: string;
  name: string;
  summary: string;
  problems: string[];
  capabilities: string[];
  boundaries: string[];
  deliverables: string[];
  seo: SeoFields;
}

export interface Resource {
  slug: string;
  title: string;
  type: "Article" | "Guide" | "Insight";
  author: string;
  excerpt: string;
  body: { heading?: string; paragraphs: string[] }[];
  tags: string[];
  publishedAt: string;
  readingMinutes: number;
  isDemo: boolean;
  publication: PublicationState;
  seo: SeoFields;
}
