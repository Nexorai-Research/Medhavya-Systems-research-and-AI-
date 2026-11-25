"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { ArrowRight, BarChart3, Blocks, Compass, FileCog, Link2, Sparkles, Truck, Users, Workflow, type LucideIcon } from "lucide-react";
import { LifecycleBadge } from "@/components/ui/Badges";
import type { LifecycleStatus } from "@/content/types";
import { NEEDS, SIZES, findSolutions, type FinderIndustry, type FinderProduct, type FinderService } from "./match";
import { AccentBar } from "@/components/ui/Section";

interface Props {
  products: FinderProduct[];
  services: FinderService[];
  industries: FinderIndustry[];
}

/** Icon + accent per need (full class names so Tailwind keeps them). */
const needStyle: Record<string, { Icon: LucideIcon; tint: string }> = {
  "customers-sales": { Icon: Users, tint: "bg-blue-100 text-primary" },
  "operations-finance": { Icon: Workflow, tint: "bg-violet-100 text-violet-700" },
  "automate-documents": { Icon: FileCog, tint: "bg-fuchsia-100 text-fuchsia-700" },
  "reports-insight": { Icon: BarChart3, tint: "bg-cyan/20 text-cyan-ink" },
  "field-logistics": { Icon: Truck, tint: "bg-emerald-100 text-emerald-700" },
  "custom-build": { Icon: Blocks, tint: "bg-amber-100 text-amber-700" },
  modernise: { Icon: Link2, tint: "bg-sky-100 text-sky-700" },
  "not-sure": { Icon: Compass, tint: "bg-slate-100 text-slate-700" },
};

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
      <form onSubmit={(e) => e.preventDefault()} className="relative space-y-7 overflow-hidden rounded-[var(--radius-lg)] border border-white/80 bg-white/85 p-6 shadow-[var(--shadow-lift)] backdrop-blur-md sm:p-8">
        <AccentBar className="from-primary via-electric to-cyan" />
        <fieldset>
          <legend className="text-base font-semibold text-midnight">1. What do you need most?</legend>
          <div className="mt-3 grid gap-2">
            {NEEDS.map((n) => {
              const { Icon, tint } = needStyle[n.id] ?? needStyle["not-sure"];
              return (
              <label key={n.id} className="group flex min-h-11 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-line bg-white p-3 transition-[translate,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md has-[:checked]:border-primary has-[:checked]:bg-gradient-to-r has-[:checked]:from-blue-50 has-[:checked]:to-cyan/10 has-[:checked]:shadow-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-electric">
                <input type="radio" name={`${id}-need`} value={n.id} checked={need === n.id} onChange={() => setNeed(n.id)} className="size-4 shrink-0 accent-[var(--color-primary)]" />
                <span aria-hidden className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 ${tint}`}>
                  <Icon className="size-[1.1rem]" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-midnight">{n.label}</span>
                  <span className="block text-xs text-muted">{n.hint}</span>
                </span>
              </label>
              );
            })}
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
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-primary/40 bg-gradient-to-br from-blue-50 via-white to-cyan/10 p-10 text-center">
            <span aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-electric/25 blur-3xl" />
            <span aria-hidden className="relative mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-electric text-white shadow-[0_12px_28px_-10px_rgb(49_95_213/0.7)]">
              <Sparkles className="size-7" />
            </span>
            <p className="relative mt-5 text-base font-semibold text-midnight">Ready when you are</p>
            <p className="relative mt-1 text-sm text-muted">Choose what you need most, or your industry, and your suggestions will appear here.</p>
          </div>
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
