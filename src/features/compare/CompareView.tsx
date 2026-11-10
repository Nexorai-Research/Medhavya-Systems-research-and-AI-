"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { LifecycleBadge } from "@/components/ui/Badges";
import type { LifecycleStatus } from "@/content/types";
import { MAX_COMPARE, compareHref, parseCompare, type CompareProduct } from "./shared";

export function CompareView({ products }: { products: CompareProduct[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const known = useMemo(() => new Set(products.map((p) => p.slug)), [products]);
  const selected = parseCompare(params.get("p"), known);
  const chosen = selected.map((s) => products.find((p) => p.slug === s)).filter((p): p is CompareProduct => Boolean(p));

  const toggle = (slug: string) => {
    const next = selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug];
    router.replace(compareHref(next.slice(0, MAX_COMPARE)), { scroll: false });
  };

  const list = (items: string[]) => (items.length ? items.join(", ") : "Not specified");
  const rows: { label: string; render: (p: CompareProduct) => React.ReactNode }[] = [
    { label: "Category", render: (p) => p.category },
    { label: "Lifecycle stage", render: (p) => <LifecycleBadge status={p.lifecycle as LifecycleStatus} /> },
    { label: "Summary", render: (p) => p.summary },
    { label: "Built for", render: (p) => list(p.audience) },
    { label: "Industries", render: (p) => list(p.industries) },
    {
      label: "Key capabilities",
      render: (p) => (
        <ul className="list-disc space-y-1 pl-4">
          {p.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      ),
    },
    { label: "Deployment", render: (p) => list(p.deployment) },
    { label: "Integration areas", render: (p) => list(p.integrations) },
    { label: "Support", render: (p) => p.support },
    { label: "Listing status", render: (p) => (p.isDemo ? "Demonstration listing, facts pending approval" : "Approved listing") },
  ];

  return (
    <div>
      <fieldset className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-midnight">Choose up to {MAX_COMPARE} products</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const checked = selected.includes(p.slug);
            const disabled = !checked && selected.length >= MAX_COMPARE;
            return (
              <label key={p.slug} className={`flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] border border-line px-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-electric ${disabled ? "opacity-50" : "cursor-pointer"}`}>
                <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggle(p.slug)} className="size-4 accent-[var(--color-primary)]" />
                {p.name}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div aria-live="polite" className="mt-8">
        {chosen.length < 2 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-line-strong p-8 text-center text-sm text-muted">Select at least two products to compare them side by side.</div>
        ) : (
          <div role="region" aria-label="Product comparison table" tabIndex={0} className="overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="sr-only">Comparison of {chosen.map((p) => p.name).join(", ")}</caption>
              <thead>
                <tr className="border-b border-line">
                  <td className="w-40 p-4" />
                  {chosen.map((p) => (
                    <th key={p.slug} scope="col" className="p-4 align-top text-base font-semibold text-midnight">
                      <Link href={`/products/${p.slug}`} className="hover:text-primary">
                        {p.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-line last:border-b-0">
                    <th scope="row" className="bg-canvas p-4 align-top font-medium text-midnight">
                      {r.label}
                    </th>
                    {chosen.map((p) => (
                      <td key={p.slug} className="p-4 align-top text-ink">
                        {r.render(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs text-muted">Comparison reflects the information on each product page. Lifecycle stages show what is available today, and listings marked as demonstration are pending approval.</p>
      </div>
    </div>
  );
}
