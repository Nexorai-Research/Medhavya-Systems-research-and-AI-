import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Eyebrow({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 font-mono text-xs font-medium tracking-[0.18em] uppercase",
        tone === "light" ? "text-primary" : "text-cyan",
        className,
      )}
    >
      <span aria-hidden className={cn("eyebrow-rule h-px w-6", tone === "light" ? "bg-primary" : "bg-cyan")} />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "left",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div data-reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center [&>p:first-child]:justify-center", className)}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <Heading
        className={cn(
          "mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl",
          tone === "light" ? "text-midnight" : "text-white",
        )}
      >
        {title}
      </Heading>
      {intro && (
        <p className={cn("mt-4 text-base leading-relaxed text-pretty sm:text-lg", tone === "light" ? "text-muted" : "text-white/70")}>{intro}</p>
      )}
    </div>
  );
}
