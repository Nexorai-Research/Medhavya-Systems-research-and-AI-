"use client";

import { useEffect } from "react";

/**
 * Pointer-driven effects (Module 02 §9). Scroll reveals are pure CSS (see globals.css);
 * this engine only updates CSS custom properties:
 *  - [data-spotlight]  soft light following the pointer
 *  - [data-parallax]   gentle depth shift of children marked [data-depth]
 * It starts once the browser is idle (so it never touches content mid-hydration) and
 * only for fine pointers without a reduced-motion preference.
 */
export function MotionEffects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let last: PointerEvent | null = null;
    let activeScene: HTMLElement | null = null;

    const apply = () => {
      frame = 0;
      if (!last || reduced.matches || !finePointer.matches) return;
      const target = last.target instanceof Element ? last.target : null;

      const spot = target?.closest<HTMLElement>("[data-spotlight]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${last.clientX - r.left}px`);
        spot.style.setProperty("--my", `${last.clientY - r.top}px`);
      }

      const scene = target?.closest<HTMLElement>("[data-parallax]") ?? null;
      if (activeScene && activeScene !== scene) {
        activeScene.style.setProperty("--px", "0");
        activeScene.style.setProperty("--py", "0");
      }
      activeScene = scene;
      if (scene) {
        const r = scene.getBoundingClientRect();
        scene.style.setProperty("--px", (((last.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
        scene.style.setProperty("--py", (((last.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
      }
    };

    const onPointer = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const start = () => window.addEventListener("pointermove", onPointer, { passive: true });
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle ? window.requestIdleCallback(start, { timeout: 2000 }) : globalThis.setTimeout(start, 1200);

    return () => {
      if (hasIdle) window.cancelIdleCallback(idle as number);
      else globalThis.clearTimeout(idle);
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
