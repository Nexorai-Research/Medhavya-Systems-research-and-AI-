export type SearchKind = "Product" | "Service" | "Industry" | "Category" | "Resource" | "Page";

export interface SearchEntry {
  kind: SearchKind;
  title: string;
  href: string;
  summary: string;
  /** Extra searchable text that is not displayed. */
  keywords: string;
}

export interface SearchHit extends SearchEntry {
  score: number;
}

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);

/**
 * Ranks entries for a free-text query. Every query term must match somewhere (AND);
 * title matches outrank summary matches, which outrank keyword matches.
 * Pure and dependency-free so it runs on the server, in the browser and in tests.
 */
export function searchEntries(entries: SearchEntry[], query: string, limit = 30): SearchHit[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  const hits: SearchHit[] = [];
  for (const entry of entries) {
    const title = entry.title.toLowerCase();
    const summary = entry.summary.toLowerCase();
    const keywords = entry.keywords.toLowerCase();
    let score = 0;
    let matchedAll = true;
    for (const term of terms) {
      let s = 0;
      if (title === term) s = 12;
      else if (title.startsWith(term)) s = 9;
      else if (title.includes(term)) s = 7;
      else if (summary.includes(term)) s = 3;
      else if (keywords.includes(term)) s = 1;
      if (s === 0) {
        matchedAll = false;
        break;
      }
      score += s;
    }
    if (matchedAll) hits.push({ ...entry, score });
  }
  return hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
}
