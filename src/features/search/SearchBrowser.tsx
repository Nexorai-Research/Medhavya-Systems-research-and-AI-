"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { searchEntries, type SearchEntry } from "@/lib/search";

const suggestions = ["CRM", "AI automation", "School management", "Logistics", "Integration"];

export function SearchBrowser({ index }: { index: SearchEntry[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const urlQuery = params.get("q") ?? "";
  const [draft, setDraft] = useState(urlQuery);
  const hits = useMemo(() => searchEntries(index, urlQuery), [index, urlQuery]);

  const submit = (value: string) => {
    const q = value.trim();
    router.replace(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <div>
      <form
        role="search"
        action="/search"
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft);
        }}
        className="flex gap-2 rounded-[var(--radius-lg)] border border-line bg-white p-3"
      >
        <label className="relative flex-1">
          <span className="sr-only">Search Medhavya Systems</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Search products, services, industries and articles"
            className="h-11 w-full rounded-[var(--radius-md)] bg-canvas pr-3 pl-10 text-sm text-ink placeholder:text-muted focus:bg-white"
          />
        </label>
        <button type="submit" className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-white">
          Search
        </button>
      </form>

      <div aria-live="polite" className="mt-8">
        {!urlQuery.trim() ? (
          <div>
            <p className="text-sm text-muted">Try one of these:</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <li key={s}>
                  <Link href={`/search?q=${encodeURIComponent(s)}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm text-ink hover:border-primary hover:text-primary">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : hits.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-line-strong p-8 text-center">
            <p className="font-semibold text-midnight">No results for “{urlQuery}”.</p>
            <p className="mt-2 text-sm text-muted">Check the spelling or try a broader word. You can also browse the catalogue or contact us.</p>
            <div className="mt-4 flex justify-center gap-4 text-sm font-semibold text-primary">
              <Link href="/products">All products</Link>
              <Link href="/contact">Contact us</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted">
              {hits.length} result{hits.length === 1 ? "" : "s"} for “{urlQuery}”
            </p>
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white">
              {hits.map((h) => (
                <li key={`${h.kind}-${h.href}`}>
                  <Link href={h.href} className="row-sweep group flex items-start justify-between gap-4 p-5">
                    <span>
                      <span className="font-mono text-[0.7rem] tracking-wider text-muted uppercase">{h.kind}</span>
                      <span className="mt-1 block text-lg font-semibold text-midnight group-hover:text-primary">{h.title}</span>
                      <span className="mt-1 block text-sm text-muted">{h.summary}</span>
                    </span>
                    <ArrowUpRight aria-hidden className="mt-1 size-4 shrink-0 text-line-strong group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
