import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Responsive lockup: supplied logo mark + HTML wordmark.
 * The wordmark is live text so it stays crisp and accessible; replace the mark
 * at public/brand/ with approved SVG assets when available.
 */
export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <Link href="/" aria-label="Medhavya Systems — home" className={cn("group inline-flex items-center gap-2.5", className)}>
      <Image src="/brand/medhavya-mark.png" alt="" width={218} height={192} priority className="h-9 w-auto sm:h-10" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.05rem] font-extrabold tracking-[0.06em] sm:text-[1.15rem]",
            tone === "light" ? "text-midnight" : "text-white",
          )}
        >
          MEDHAVYA
        </span>
        <span
          className={cn(
            "mt-1 text-[0.58rem] font-medium tracking-[0.42em]",
            tone === "light" ? "text-muted" : "text-white/70",
          )}
        >
          SYSTEMS
        </span>
      </span>
    </Link>
  );
}
