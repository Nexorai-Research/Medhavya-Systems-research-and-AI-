"use client";

import Link from "next/link";
import { startTransition, useId, useRef, useState, ViewTransition, type KeyboardEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { ProductMockup } from "@/components/ProductMockup";
import { DemoBadge, LifecycleBadge } from "@/components/ui/Badges";
import type { Product } from "@/content/types";
import { cn } from "@/lib/cn";

export function ProductShowcase({ products, categoryNames }: { products: Product[]; categoryNames: Record<string, string> }) {
  const [active, setActiveState] = useState(0);
  // Transitions activate ViewTransition animations (panel crossfade + indicator morph).
  const setActive = (i: number) => startTransition(() => setActiveState(i));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const product = products[active];

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | undefined;
    if (e.key in keys) next = (active + keys[e.key] + products.length) % products.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = products.length - 1;
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
      <div
        role="tablist"
        aria-label="Featured products"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible"
      >
        {products.map((p, i) => (
          <button
            key={p.slug}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "relative isolate shrink-0 rounded-[var(--radius-md)] px-4 py-3 text-left transition-colors duration-200 lg:shrink",
              i !== active && "hover:bg-white/60",
            )}
          >
            {i === active && (
              // The active surface morphs from tab to tab (React ViewTransition).
              <ViewTransition name="showcase-indicator" share="morph" default="none">
                <span aria-hidden className="absolute inset-0 -z-10 rounded-[inherit] border border-primary/25 bg-white shadow-[var(--shadow-panel)]">
                  <span className="absolute top-3 bottom-3 left-0 hidden w-0.5 rounded-full bg-gradient-to-b from-primary to-cyan lg:block" />
                </span>
              </ViewTransition>
            )}
            <span className={cn("block text-sm font-semibold whitespace-nowrap transition-colors lg:whitespace-normal", i === active ? "text-primary" : "text-midnight")}>{p.name}</span>
            <span className="mt-0.5 hidden text-xs text-muted lg:block">{categoryNames[p.categorySlug]}</span>
          </button>
        ))}
      </div>

      <ViewTransition key={product.slug} name="showcase-panel" share="auto" enter="auto" default="none">
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} className="grid gap-8 xl:grid-cols-[1fr_1.15fr] xl:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <LifecycleBadge status={product.lifecycle} />
            {product.isDemo && <DemoBadge />}
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-midnight">{product.name}</h3>
          <p className="mt-3 leading-relaxed text-muted">{product.description}</p>
          <ul className="mt-5 space-y-2.5">
            {product.outcomes.map((o) => (
              <li key={o} className="flex gap-2.5 text-sm text-ink">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-cyan-ink" />
                {o}
              </li>
            ))}
          </ul>
          <Link href={`/products/${product.slug}`} className="group mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-strong">
            View {product.name}
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <ProductMockup product={product} />
      </div>
      </ViewTransition>
    </div>
  );
}
