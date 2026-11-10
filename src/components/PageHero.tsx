import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import "@/components/visuals/visuals.css";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn("flex flex-wrap items-center gap-1 text-xs", tone === "light" ? "text-muted" : "text-white/60")}>
        {[{ label: "Home", href: "/" }, ...items].map((c, i, all) => (
          <li key={c.label} className="flex items-center gap-1">
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className={tone === "light" ? "hover:text-primary" : "hover:text-white"}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
            {i < all.length - 1 && <ChevronRight aria-hidden className="size-3" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Splits a plain-string title into words that rise in sequence; rich titles render as-is. */
export function AnimatedTitle({ children }: { children: ReactNode }) {
  if (typeof children !== "string") return <>{children}</>;
  return (
    <>
      {children.split(" ").map((w, i, all) => (
        <span key={`${w}-${i}`}>
          <span className="title-word" style={{ "--i": i } as CSSProperties}>
            {w}
          </span>
          {i < all.length - 1 && " "}
        </span>
      ))}
    </>
  );
}

/**
 * Editorial page header used by inner pages. `visual` adds a 3D scene that reacts to the
 * pointer; `dark` is reserved for AI/technology storytelling.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  tone = "light",
  visual,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs: Crumb[];
  tone?: "light" | "dark";
  visual?: ReactNode;
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <section className={cn("relative overflow-hidden border-b", dark ? "dark-section border-white/10 bg-midnight text-white" : "border-line bg-canvas")}>
      <div aria-hidden className={cn("absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]", dark ? "bg-grid-dark" : "bg-grid")} />
      <div aria-hidden className={cn("pointer-events-none absolute inset-0", dark ? "page-glow-dark" : "page-glow")} />
      {dark && <div aria-hidden className="absolute -top-40 right-0 size-[520px] rounded-full bg-electric/20 blur-[120px]" />}
      <Container className="relative pt-10 pb-14 sm:pt-14 sm:pb-20">
        <Breadcrumbs items={crumbs} tone={tone} />
        <div className={cn("mt-10 grid gap-10", visual && "lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-6")}>
          <div className="min-w-0">
            <div className="animate-rise">
              <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
            </div>
            <h1 className={cn("mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl", dark ? "text-white" : "text-midnight")}>
              <AnimatedTitle>{title}</AnimatedTitle>
            </h1>
            {intro && (
              <p className={cn("mt-5 max-w-2xl animate-rise text-lg leading-relaxed text-pretty [animation-delay:380ms]", dark ? "text-white/70" : "text-muted")}>{intro}</p>
            )}
            {children && <div className="animate-rise [animation-delay:480ms]">{children}</div>}
          </div>
          {visual && <div className="min-w-0">{visual}</div>}
        </div>
      </Container>
    </section>
  );
}
