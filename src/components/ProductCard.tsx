import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { DemoBadge, LifecycleBadge } from "@/components/ui/Badges";
import type { CategoryIcon as IconKey, Product } from "@/content/types";

/** Compact catalogue card: strong name, status, one-line summary (Module 02 §8). */
export function ProductCard({ product, categoryName, icon }: { product: Product; categoryName: string; icon: IconKey }) {
  return (
    <article
      data-spotlight="light"
      className="card-glow group relative flex h-full flex-col rounded-[var(--radius-lg)] p-5 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-electric has-[a:focus-visible]:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
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
