import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Suspense, type CSSProperties, type ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Container, Eyebrow } from "@/components/ui/Section";
import { TimedPop } from "@/components/visuals/TimedPop";
import { siteUrl } from "@/lib/env";
import { cn } from "@/lib/cn";
import "@/components/visuals/visuals.css";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  const base = siteUrl();
  return (
    <nav aria-label="Breadcrumb">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            // The current page (last item) has no link; schema.org allows omitting `item` there.
            ...(c.href && i < trail.length - 1 ? { item: `${base}${c.href === "/" ? "" : c.href}` } : {}),
          })),
        }}
      />
      <ol className={cn("flex flex-wrap items-center gap-1 text-xs", tone === "light" ? "text-muted" : "text-white/60")}>
        {[{ label: "Home", href: "/" }, ...items].map((c, i, all) => (
          <li key={c.label} className="flex items-center gap-1">
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className={cn("inline-block py-1.5", tone === "light" ? "hover:text-primary" : "hover:text-white")}>
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
  background,
  backdrop,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs: Crumb[];
  tone?: "light" | "dark";
  visual?: ReactNode;
  /** Full-bleed video behind the hero (e.g. CyclingHeroVideo). Text turns white with a shadow. */
  background?: ReactNode;
  /** Decorative layer behind the content that does not switch the hero into video mode (visual stays). */
  backdrop?: ReactNode;
  children?: ReactNode;
}) {
  const onVideo = Boolean(background);
  const dark = tone === "dark" || onVideo;
  const ts = onVideo ? "[text-shadow:0_1px_3px_rgb(0_0_0/0.65),0_0_14px_rgb(0_0_0/0.5)]" : "";
  return (
    <section className={cn("relative overflow-hidden border-b", dark ? "dark-section border-white/10 bg-midnight text-white" : "border-line bg-canvas")}>
      {onVideo ? (
        // Video backgrounds are client components; the Suspense boundary keeps the static shell valid for Cache Components.
        <Suspense fallback={<div aria-hidden className="absolute inset-0 bg-midnight" />}>{background}</Suspense>
      ) : (
        <>
          <div aria-hidden className={cn("absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]", dark ? "bg-grid-dark" : "bg-grid")} />
          <div aria-hidden className={cn("pointer-events-none absolute inset-0", dark ? "page-glow-dark" : "page-glow")} />
        </>
      )}
      {backdrop}
      {dark && !onVideo && !backdrop && <div aria-hidden className="absolute -top-40 right-0 size-[520px] rounded-full bg-electric/20 blur-[120px]" />}
      <Container className="relative pt-5 pb-14 sm:pt-7 sm:pb-20">
        <div className={ts}>
          <Breadcrumbs items={crumbs} tone={dark ? "dark" : "light"} />
        </div>
        <div className={cn("mt-8 grid gap-10", visual && "lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-6")}>
          <div className="min-w-0">
            <div className="animate-rise">
              <Eyebrow tone={dark ? "dark" : "light"} className={cn(ts, onVideo && "font-semibold !text-white")}>
                {eyebrow}
              </Eyebrow>
            </div>
            <h1 className={cn("mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl", dark ? "text-white" : "text-midnight", ts)}>
              <AnimatedTitle>{title}</AnimatedTitle>
            </h1>
            {intro && (
              <p className={cn("mt-5 max-w-2xl animate-rise text-lg leading-relaxed text-pretty [animation-delay:380ms]", dark ? (onVideo ? "font-medium text-white" : "text-white/70") : "text-muted", ts)}>{intro}</p>
            )}
            {children && <div className="animate-rise [animation-delay:480ms]">{children}</div>}
          </div>
          {visual && <div className="min-w-0 lg:self-center">{onVideo ? <TimedPop visibleMs={6000}>{visual}</TimedPop> : visual}</div>}
        </div>
      </Container>
    </section>
  );
}
