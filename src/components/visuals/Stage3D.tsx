"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import "./visuals.css";

/**
 * Reusable 3D stage (the hero's camera, generalised). The scene eases toward the pointer
 * anywhere inside the surrounding <section>, sways gently on its own when idle, pauses
 * off-screen, and stays still under prefers-reduced-motion.
 */
export function Stage3D({
  children,
  className,
  base = { rx: 10, ry: -14 },
  range = { x: 14, y: 8 },
}: {
  children: ReactNode;
  className?: string;
  base?: { rx: number; ry: number };
  range?: { x: number; y: number };
}) {
  const cameraRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const { rx: baseRx, ry: baseRy } = base;
  const { x: rangeX, y: rangeY } = range;

  useEffect(() => {
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (!camera || !scene) return;
    const base = { rx: baseRx, ry: baseRy };
    const range = { x: rangeX, y: rangeY };
    // Write `transform` directly. Updating inherited custom properties (--rx/--ry) every frame
    // invalidated style for the whole 3D subtree (measured: ~1.5 s of style recalc at 4x CPU throttle).
    const apply = (rx: number, ry: number) => {
      scene.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    };
    apply(base.rx, base.ry);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const area = camera.closest("section") ?? camera;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let target: { x: number; y: number } | null = null;
    let cur = { ...base };
    let raf = 0;
    let visible = false;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      target = { x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 };
      area.style.setProperty("--hx", `${e.clientX - r.left}px`);
      area.style.setProperty("--hy", `${e.clientY - r.top}px`);
    };
    const onLeave = () => (target = null);

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const goal = target
        ? { rx: base.rx - target.y * range.y, ry: base.ry + target.x * range.x }
        : { rx: base.rx + Math.sin(t * 0.5) * 2.2, ry: base.ry + Math.sin(t * 0.32) * 4.5 };
      cur = { rx: cur.rx + (goal.rx - cur.rx) * 0.06, ry: cur.ry + (goal.ry - cur.ry) * 0.06 };
      apply(cur.rx, cur.ry);
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(camera);
    if (fine) {
      area.addEventListener("pointermove", onMove as EventListener);
      area.addEventListener("pointerleave", onLeave);
    }
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      area.removeEventListener("pointermove", onMove as EventListener);
      area.removeEventListener("pointerleave", onLeave);
    };
  }, [baseRx, baseRy, rangeX, rangeY]);

  return (
    <div ref={cameraRef} aria-hidden className={cn("s3d-camera relative mx-auto w-full", className)}>
      <div ref={sceneRef} className="s3d-scene absolute inset-0">
        {children}
      </div>
    </div>
  );
}
