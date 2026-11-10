"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { LifecycleBadge } from "@/components/ui/Badges";
import type { LifecycleStatus } from "@/content/types";
import { NEEDS, SIZES, findSolutions, type FinderIndustry, type FinderProduct, type FinderService } from "./match";

interface Props {
  products: FinderProduct[];
  services: FinderService[];
  industries: FinderIndustry[];
}

export function SolutionFinder({ products, services, industries }: Props) {
  const id = useId();
  const [need, setNeed] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");

  const result = useMemo(() => findSolutions({ need, industry, size }, { products, services, industries }), [need, industry, size, products, services, industries]);
  const answered = Boolean(need || industry);
  const topProduct = result.products[0]?.product.slug;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-7 rounded-[var(--radius-lg)] border border-line bg-white p-6 sm:p-8">
        <fieldset>
          <legend className="text-base font-semibold text-midnight">1. What do you need most?</legend>
          <div className="mt-3 grid gap-2">
            {NEEDS.map((n) => (
              <label key={n.id} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-line p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-electric">
                <input type="radio" name={`${id}-need`} value={n.id} checked={need === n.id} onChange={() => setNeed(n.id)} className="mt-1 size-4 accent-[var(--color-primary)]" />
                <span>
                  <span className="block text-sm font-medium text-midnight">{n.label}</span>
                  <span className="block text-xs text-muted">{n.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor={`${id}-industry`} className="text-base font-semibold text-midnight">
            2. Which industry are you in? <span className="text-sm font-normal text-muted">(optional)</span>
          </label>
          <select id={`${id}-industry`} value={industry} onChange={(e) => setIndustry(e.target.value)} className="mt-3 h-11 w-full rounded-[var(--radius-md)] border border-line bg-canvas px-3 text-sm text-ink">
            <option value="">Not specified</option>
            {industries.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${id}-size`} className="text-base font-semibold text-midnight">
            3. How large is your organisation? <span className="text-sm font-normal text-muted">(optional)</span>
          </label>
          <select id={`${id}-size`} value={size} onChange={(e) => setSize(e.target.value)} className="mt-3 h-11 w-full rounded-[var(--radius-md)] border border-line bg-canvas px-3 text-sm text-ink">
            <option value="">Not specified</option>
            {SIZES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {answered && (
          <button
            type="button"
            onClick={() => {
              setNeed("");
              setIndustry("");
              setSize("");
            }}
            className="min-h-11 text-sm font-medium text-primary hover:text-primary-strong"
          >
            Start over
          </button>
        )}
      </form>

      <div aria-live="polite" className="space-y-6">
        {!answered ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-line-strong p-8 text-center text-sm text-muted">Choose what you need most, or your industry, and your suggestions will appear here.</div>
        ) : (
          <>
            <section aria-labelledby={`${id}-products`}>
              <h3 id={`${id}-products`} className="text-lg font-semibold text-midnight">
                Suggested products
              </h3>
              {result.products.length === 0 ? (
                <p className="mt-2 text-sm text-muted">No catalogue product matches these answers directly. The services below, or a conversation with our team, are the better route.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {result.products.map(({ product, reasons }) => (
                    <li key={product.slug} className="rounded-[var(--radius-md)] border border-line bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Link href={`/products/${product.slug}`} className="font-semibold text-midnight hover:text-primary">
                          {product.name}
                        </Link>
                        <LifecycleBadge status={product.lifecycle as LifecycleStatus} />
                      </div>
                      <p className="mt-1 text-sm text-muted">{product.summary}</p>
                      <ul className="mt-2 list-disc pl-5 text-xs text-ink">
                        {reasons.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {result.services.length > 0 && (
              <section aria-labelledby={`${id}-services`}>
                <h3 id={`${id}-services`} className="text-lg font-semibold text-midnight">
                  Relevant services
                </h3>
                <ul className="mt-3 space-y-3">
                  {result.services.map(({ service, reason }) => (
                    <li key={service.slug} className="rounded-[var(--radius-md)] border border-line bg-white p-4">
                      <Link href={`/enterprise-solutions/${service.slug}`} className="font-semibold text-midnight hover:text-primary">
                        {service.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted">{service.summary}</p>
                      <p className="mt-2 text-xs text-ink">{reason}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {result.industry && (
              <p className="text-sm">
                <Link href={`/industries/${result.industry.slug}`} className="font-semibold text-primary hover:text-primary-strong">
                  Read about {result.industry.name} <ArrowRight aria-hidden className="inline size-4" />
                </Link>
              </p>
            )}
            {result.sizeNote && <p className="text-sm text-muted">{result.sizeNote}</p>}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={topProduct ? `/request-demo?product=${topProduct}` : "/request-demo"} className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white">
                Request a demo
              </Link>
              <Link href="/enterprise-solutions#consult" className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 text-sm font-semibold text-midnight hover:border-primary">
                Discuss an enterprise project
              </Link>
            </div>
            <p className="text-xs text-muted">These are rule-based suggestions to start a conversation. They are not a guarantee of fit, and each product shows its current lifecycle stage.</p>
          </>
        )}
      </div>
    </div>
  );
}
