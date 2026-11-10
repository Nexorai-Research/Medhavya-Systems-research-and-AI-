import { FlaskConical } from "lucide-react";
import type { LifecycleStatus } from "@/content/types";
import { cn } from "@/lib/cn";

/** Maps lifecycle to tone. Color is always paired with the status text (Module 02 §5). */
export const lifecycleTone: Record<LifecycleStatus, { dot: string; chip: string }> = {
  Research: { dot: "bg-slate-400", chip: "border-slate-300 bg-slate-50 text-slate-700" },
  "In Development": { dot: "bg-electric", chip: "border-blue-200 bg-blue-50 text-primary-strong" },
  "Private Pilot": { dot: "bg-cyan", chip: "border-cyan-200 bg-cyan-50 text-cyan-ink" },
  Beta: { dot: "bg-gold", chip: "border-amber-200 bg-warning-bg text-gold-ink" },
  "Generally Available": { dot: "bg-success", chip: "border-green-200 bg-success-bg text-success" },
  Deprecated: { dot: "bg-warning", chip: "border-amber-300 bg-warning-bg text-warning" },
  Retired: { dot: "bg-slate-500", chip: "border-slate-300 bg-slate-100 text-slate-600" },
};

export function LifecycleBadge({ status, className }: { status: LifecycleStatus; className?: string }) {
  const tone = lifecycleTone[status];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", tone.chip, className)}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", tone.dot)} />
      <span className="sr-only">Lifecycle status: </span>
      {status}
    </span>
  );
}

export function DemoBadge({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span
      title="Demonstration content — details will be confirmed before launch"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-[0.7rem] font-medium tracking-wide uppercase",
        tone === "light" ? "border-line-strong text-muted" : "border-white/30 text-white/70",
        className,
      )}
    >
      <FlaskConical aria-hidden className="size-3" />
      Demo listing
    </span>
  );
}
