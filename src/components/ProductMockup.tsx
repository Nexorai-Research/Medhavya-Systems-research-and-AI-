import { AlertTriangle, CheckCircle2, Clock3, TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { Product } from "@/content/types";
import { cn } from "@/lib/cn";

const stateMeta = {
  ok: { Icon: CheckCircle2, className: "text-success", label: "On track" },
  attention: { Icon: AlertTriangle, className: "text-warning", label: "Needs attention" },
  pending: { Icon: Clock3, className: "text-primary", label: "Pending" },
} as const;

const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus } as const;

/** Builds a smooth area path for the sparkline from 0–100-ish values. */
function chartPath(values: number[], w: number, h: number) {
  if (values.length < 2) return { line: "", area: "" };
  const max = Math.max(...values) * 1.1;
  const min = Math.min(...values) * 0.8;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - ((v - min) / (max - min)) * h] as const);
  const line = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x.toFixed(1)},${y.toFixed(1)}`)).join(" ");
  return { line, area: `${line} L${w},${h} L0,${h} Z` };
}

/**
 * Concept interface for a product. Always labelled as illustrative so it is never
 * mistaken for a released product screenshot (Module 05 §5).
 */
export function ProductMockup({ product, compact = false, className }: { product: Product; compact?: boolean; className?: string }) {
  const { mockup } = product;
  const { line, area } = chartPath(mockup.chart, 320, 90);
  const gradientId = `grad-${product.slug}`;

  return (
    <figure data-reveal="scale" className={cn("relative", className)}>
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white shadow-[var(--shadow-lift)]">
        <div className="flex items-center gap-2 border-b border-line bg-canvas px-4 py-2.5">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
          </span>
          <span className="ml-2 truncate font-mono text-[0.68rem] text-muted">{product.name}</span>
        </div>
        <div className={cn("grid", compact ? "grid-cols-1" : "grid-cols-[132px_1fr]")}>
          {!compact && (
            <ul aria-hidden className="space-y-0.5 border-r border-line bg-canvas/60 p-3 text-[0.72rem]">
              {mockup.nav.map((n, i) => (
                <li key={n} className={cn("rounded-md px-2.5 py-1.5", i === 0 ? "bg-white font-semibold text-primary shadow-sm" : "text-muted")}>
                  {n}
                </li>
              ))}
            </ul>
          )}
          <div className="space-y-3 p-4">
            <div className="grid grid-cols-3 gap-2">
              {mockup.tiles.map((t) => {
                const Trend = trendIcon[t.trend ?? "flat"];
                return (
                  <div key={t.label} className="rounded-[var(--radius-md)] border border-line p-2.5">
                    <p className="truncate text-[0.62rem] text-muted">{t.label}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm font-semibold whitespace-nowrap text-midnight tabular-nums">
                      {t.value}
                      <Trend aria-hidden className="size-3 text-cyan-ink" />
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="rounded-[var(--radius-md)] border border-line p-3">
              <svg viewBox="0 0 320 90" className="h-20 w-full" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#527BFF" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#527BFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[22, 45, 68].map((y) => (
                  <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="3 4" />
                ))}
                <path d={area} fill={`url(#${gradientId})`} />
                <path d={line} pathLength={1} className="chart-line" fill="none" stroke="#315FD5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            {!compact && (
              <ul className="divide-y divide-line rounded-[var(--radius-md)] border border-line">
                {mockup.rows.map((r) => {
                  const meta = stateMeta[r.state];
                  return (
                    <li key={r.primary} className="flex items-center gap-2.5 px-3 py-2">
                      <meta.Icon aria-label={meta.label} className={cn("size-3.5 shrink-0", meta.className)} />
                      <span className="min-w-0">
                        <span className="block truncate text-[0.72rem] font-medium text-midnight">{r.primary}</span>
                        <span className="block truncate text-[0.66rem] text-muted">{r.secondary}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
      <figcaption className="mt-2.5 font-mono text-[0.66rem] tracking-wide text-muted">Illustrative concept UI · sample data</figcaption>
    </figure>
  );
}
