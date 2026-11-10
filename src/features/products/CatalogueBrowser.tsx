"use client";

import { startTransition, useDeferredValue, useMemo, useState, ViewTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { LIFECYCLE_STATUSES, type CategoryIcon, type LifecycleStatus, type Product } from "@/content/types";
import { cn } from "@/lib/cn";
import { filterProducts } from "./filter";

interface CategoryOption {
  slug: string;
  name: string;
  shortName: string;
  icon: CategoryIcon;
}

export function CatalogueBrowser({ products, categories }: { products: Product[]; categories: CategoryOption[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategoryState] = useState<string | null>(null);
  const [lifecycle, setLifecycleState] = useState<LifecycleStatus | "">("");
  // Wrapping filter updates in transitions lets the grid animate between states.
  const setCategory = (v: string | null) => startTransition(() => setCategoryState(v));
  const setLifecycle = (v: LifecycleStatus | "") => startTransition(() => setLifecycleState(v));
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(
    () => filterProducts(products, { query: deferredQuery, category: category ?? undefined, lifecycle: lifecycle || undefined }),
    [products, deferredQuery, category, lifecycle],
  );
  const byCategory = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const counts = Object.fromEntries(categories.map((c) => [c.slug, products.filter((p) => p.categorySlug === c.slug).length]));
  const hasFilters = Boolean(query || category || lifecycle);

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search products</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product or capability"
            className="h-11 w-full rounded-[var(--radius-md)] bg-canvas pr-3 pl-10 text-sm text-ink placeholder:text-muted focus:bg-white"
          />
        </label>
        <label className="relative flex items-center gap-2 sm:w-60">
          <span className="sr-only">Filter by lifecycle status</span>
          <SlidersHorizontal aria-hidden className="pointer-events-none absolute left-3.5 size-4 text-muted" />
          <select
            value={lifecycle}
            onChange={(e) => setLifecycle(e.target.value as LifecycleStatus | "")}
            className="h-11 w-full appearance-none rounded-[var(--radius-md)] bg-canvas pr-3 pl-10 text-sm text-ink"
          >
            <option value="">All lifecycle stages</option>
            {LIFECYCLE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div role="group" aria-label="Filter by category" className="mt-4 flex flex-wrap gap-2">
        <FilterChip pressed={category === null} onClick={() => setCategory(null)}>
          All <span className="text-muted">{products.length}</span>
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.slug} pressed={category === c.slug} onClick={() => setCategory(category === c.slug ? null : c.slug)}>
            {c.shortName} <span className="text-muted">{counts[c.slug]}</span>
          </FilterChip>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm text-muted">
          {results.length} {results.length === 1 ? "product" : "products"}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory(null);
              setLifecycle("");
            }}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:text-primary-strong"
          >
            <X aria-hidden className="size-4" /> Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            // Cards glide to their new grid position when filters change.
            <ViewTransition key={p.slug} name={`card-${p.slug}`} update="auto" enter="auto" exit="auto" default="none">
              <li>
                <ProductCard product={p} categoryName={byCategory[p.categorySlug]?.name ?? ""} icon={byCategory[p.categorySlug]?.icon ?? "other"} />
              </li>
            </ViewTransition>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-white px-6 py-16 text-center">
          <p className="font-semibold text-midnight">No products match these filters.</p>
          <p className="mt-2 text-sm text-muted">Try a different search, or tell us what you are looking for — we may be building it.</p>
        </div>
      )}
    </div>
  );
}

function FilterChip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors",
        pressed ? "border-midnight bg-midnight text-white [&>span]:text-white/60" : "border-line bg-white text-ink hover:border-primary hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}
