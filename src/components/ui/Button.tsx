import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "light" | "outline-light";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "btn-shine bg-primary text-white shadow-[0_6px_18px_-8px_rgb(49_95_213/0.7)] hover:bg-primary-strong hover:shadow-[0_10px_26px_-10px_rgb(49_95_213/0.85)]",
  secondary: "border border-line-strong bg-surface text-ink hover:border-primary hover:text-primary",
  ghost: "px-2 text-primary hover:text-primary-strong",
  light: "btn-shine bg-white text-midnight hover:bg-canvas",
  "outline-light": "border border-white/25 text-white hover:border-white/60 hover:bg-white/5",
};

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

export function ButtonLink({
  href,
  variant = "primary",
  arrow = false,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn(buttonClass(variant, className), "group")}>
      {children}
      {arrow && <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
    </Link>
  );
}

export function Button({ variant = "primary", className, ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}
