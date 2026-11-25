"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Shows its children with a pop-in, keeps them for `visibleMs`, then fades and shrinks them away, so the photo or
 * video behind a hero is fully visible afterwards. The space is kept (visibility hidden, not unmounted) so the hero
 * does not change height when the visual leaves. Used for decorative hero visuals only.
 * The content is rendered on the server (nothing is hidden before hydration); reduced-motion visitors get no
 * animation, just the same timing.
 */
export function TimedPop({ children, visibleMs = 6000 }: { children: ReactNode; visibleMs?: number }) {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");

  useEffect(() => {
    const out = window.setTimeout(() => setPhase("out"), visibleMs);
    const gone = window.setTimeout(() => setPhase("gone"), visibleMs + 800);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(gone);
    };
  }, [visibleMs]);

  return (
    <div className={phase === "gone" ? "invisible" : phase === "out" ? "pop-out" : "pop-in"} aria-hidden>
      {children}
    </div>
  );
}
