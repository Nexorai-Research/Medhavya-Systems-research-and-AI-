import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { DemoBadge, LifecycleBadge } from "@/components/ui/Badges";
import type { CategoryIcon as IconKey, Product } from "@/content/types";
import { AccentBar } from "@/components/ui/Section";

/** Accent per category (full class names so Tailwind keeps them): top bar, icon tint, hover glow. */
const accents: Record<string, { bar: string; icon: string; glow: string }> = {
  agriculture: { bar: "from-emerald-500 to-teal-400", icon: "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600", glow: "bg-emerald-300/40" },
  "retail-business": { bar: "from-amber-500 to-yellow-400", icon: "bg-amber-50 text-amber-700 group-hover:bg-amber-500", glow: "bg-amber-300/40" },
  "ai-automation": { bar: "from-violet-500 to-fuchsia-400", icon: "bg-violet-50 text-violet-700 group-hover:bg-violet-600", glow: "bg-violet-300/40" },
  "financial-intelligence": { bar: "from-cyan to-teal-400", icon: "bg-cyan/15 text-cyan-ink group-hover:bg-cyan-ink", glow: "bg-cyan/30" },
  enterprise: { bar: "from-primary to-electric", icon: "bg-blue-50 text-primary group-hover:bg-primary", glow: "bg-electric/30" },
  education: { bar: "from-sky-500 to-indigo-400", icon: "bg-sky-50 text-sky-700 group-hover:bg-sky-600", glow: "bg-sky-300/40" },
  healthcare: { bar: "from-rose-500 to-orange-400", icon: "bg-rose-50 text-rose-700 group-hover:bg-rose-600", glow: "bg-rose-300/40" },
  other: { bar: "from-slate-500 to-slate-400", icon: "bg-slate-100 text-slate-700 group-hover:bg-slate-600", glow: "bg-slate-300/40" },
};

/** Compact catalogue card: strong name, status, one-line summary (Module 02 §8). */
export function ProductCard({ product, categoryName, icon }: { product: Product; categoryName: string; icon: IconKey }) {
  const a = accents[product.categorySlug] ?? accents.other;
  return (
    <article
      data-spotlight="light"
      className="card-glow group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] p-5 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-electric has-[a:focus-visible]:ring-offset-2"
    >
      <AccentBar className={a.bar} />
      <span aria-hidden className={`pointer-events-none absolute -top-14 -right-14 size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${a.glow}`} />
      <div className="relative flex items-start justify-between gap-3">
        <span className={`flex size-10 items-center justify-center rounded-xl transition-colors duration-300 group-hover:text-white ${a.icon}`}>
          <CategoryIcon icon={icon} className="size-5" />
        </span>
        <ArrowUpRight aria-hidden className="size-4 text-line-strong transition-[color,translate] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
      </div>
      <p className="mt-5 text-xs font-medium text-muted">{categoryName}</p>
      <h3 className="mt-1 text-lg font-semibold tracking-tight text-midnight">
        <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none">
          <ViewTransition name={`product-title-${product.slug}`} share="morph" default="none">
            <span className="inline-block">{product.name}</span>
          </ViewTransition>
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{product.summary}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <LifecycleBadge status={product.lifecycle} />
        {product.isDemo && <DemoBadge />}
      </div>
    </article>
  );
}
