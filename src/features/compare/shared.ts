export const MAX_COMPARE = 3;

export interface CompareProduct {
  slug: string;
  name: string;
  category: string;
  lifecycle: string;
  isDemo: boolean;
  summary: string;
  audience: string[];
  industries: string[];
  features: string[];
  deployment: string[];
  integrations: string[];
  support: string;
}

export const compareHref = (slugs: string[]) => (slugs.length ? `/compare-products?p=${slugs.join(",")}` : "/compare-products");

/** Parses the `p` query value, keeping only known slugs, without duplicates, up to the limit. */
export function parseCompare(value: string | null, known: Set<string>): string[] {
  const out: string[] = [];
  for (const slug of (value ?? "").split(",")) {
    if (known.has(slug) && !out.includes(slug)) out.push(slug);
  }
  return out.slice(0, MAX_COMPARE);
}
