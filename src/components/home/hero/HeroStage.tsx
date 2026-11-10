"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Container, Eyebrow } from "@/components/ui/Section";
import type { CategoryIcon as IconKey, LifecycleStatus } from "@/content/types";
import { Ecosystem3D } from "./Ecosystem3D";
import { ProductVignette } from "./ProductVignette";
import { vignetteBySlug } from "./vignette-map";
import "./hero.css";

export interface HeroNode {
  slug: string;
  name: string;
  category: string;
  icon: IconKey;
  lifecycle: LifecycleStatus;
  summary: string;
}

/** What each product moves forward — the headline word is synced with the 3D scene. */
const audienceWord: Record<string, string> = {
  "medhavya-agro": "farms",
  mediai: "hospitals",
  "medhavya-crm": "sales teams",
  "medhavya-edusphere": "schools",
  "medhavya-erp": "enterprises",
  "medhavya-logitrack": "supply chains",
};

const CYCLE_MS = 3600;
const BASE = { rx: 8, ry: -12 };

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function HeroStage({ nodes, eyebrow, children }: { nodes: HeroNode[]; eyebrow: string; children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  const [cycle, setCycle] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [inView, setInView] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const active = hovered ?? cycle;
  const word = active !== null ? (audienceWord[nodes[active].slug] ?? "businesses") : "businesses";

  // Story cycle: walks through the products while the visitor is not interacting.
  useEffect(() => {
    if (reduced || hovered !== null || !inView) return;
    const id = window.setTimeout(() => setCycle((c) => (c === null ? 0 : (c + 1) % nodes.length)), cycle === null ? 1900 : CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [cycle, hovered, inView, reduced, nodes.length]);

  // Pause everything when the hero is off-screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Camera: eases toward the pointer; sways gently on its own when idle.
  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    if (!section || !scene || reduced || !inView) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let target: { x: number; y: number } | null = null;
    let cur = { rx: BASE.rx, ry: BASE.ry };
    let raf = 0;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      target = { x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 };
      section.style.setProperty("--hx", `${e.clientX - r.left}px`);
      section.style.setProperty("--hy", `${e.clientY - r.top}px`);
    };
    const onLeave = () => (target = null);

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const goal = target
        ? { rx: BASE.rx - target.y * 9, ry: BASE.ry + target.x * 16 }
        : { rx: BASE.rx + Math.sin(t * 0.45) * 2.5, ry: BASE.ry + Math.sin(t * 0.3) * 5 };
      cur = { rx: cur.rx + (goal.rx - cur.rx) * 0.06, ry: cur.ry + (goal.ry - cur.ry) * 0.06 };
      scene.style.setProperty("--rx", `${cur.rx.toFixed(2)}deg`);
      scene.style.setProperty("--ry", `${cur.ry.toFixed(2)}deg`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    if (fine) {
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, inView]);

  const spotlight = nodes[active ?? 0];
  const spotlightKind = vignetteBySlug[spotlight.slug];

  return (
    <div ref={sectionRef} className="hero-stage relative">
      {/* Pointer-following ambient light */}
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
      <Container className="relative grid gap-12 pt-12 pb-16 sm:pt-16 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-6 lg:pt-20 lg:pb-24">
        <div className="min-w-0">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 text-[2.55rem] leading-[1.06] font-semibold tracking-[-0.035em] text-midnight sm:text-6xl lg:text-[3.3rem] xl:text-[3.55rem]">
            <span className="sr-only">Software that moves businesses forward.</span>
            <span aria-hidden>
              {["Software", "that", "moves"].map((w, i) => (
                <Fragment key={w}>
                  <span className="hero-word" style={{ "--i": i } as CSSProperties}>
                    {w}
                  </span>{" "}
                </Fragment>
              ))}
              <br />
              <span className="hero-word hero-flip-wrap" style={{ "--i": 3 } as CSSProperties}>
                <span key={word} className="hero-flip">
                  {word}
                  <span className="hero-flip-bar" />
                </span>
              </span>
              <br />
              <span className="hero-word" style={{ "--i": 4 } as CSSProperties}>
                forward.
              </span>
            </span>
          </h1>
          {children}

          {/* Mobile: synced product spotlight */}
          <div className="mt-10 sm:hidden">
            <Link
              href={`/products/${spotlight.slug}`}
              className="dark-section relative block overflow-hidden rounded-[var(--radius-lg)] bg-midnight p-4 text-white shadow-[var(--shadow-lift)]"
            >
              <div aria-hidden className="bg-grid-dark absolute inset-0 opacity-60" />
              <div aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-electric/30 blur-3xl" />
              <div key={spotlight.slug} className="eco3d-status relative">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-cyan">
                    <CategoryIcon icon={spotlight.icon} className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{spotlight.name}</span>
                    <span className="block truncate text-xs text-white/65">{spotlight.summary}</span>
                  </span>
                  <ArrowRight aria-hidden className="size-4 text-white/60" />
                </div>
                {spotlightKind && (
                  <div className="mt-3">
                    <ProductVignette kind={spotlightKind} reduced={reduced} />
                  </div>
                )}
              </div>
              <div aria-hidden className="relative mt-3 flex gap-1.5">
                {nodes.map((n, i) => (
                  <span key={n.slug} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i === (active ?? 0) ? "bg-cyan" : "bg-white/15"}`} />
                ))}
              </div>
            </Link>
          </div>
        </div>

        <figure aria-label="Illustration of the Medhavya product ecosystem" className="hidden sm:block">
          <Ecosystem3D nodes={nodes} active={active} onHover={setHovered} sceneRef={sceneRef} reduced={reduced} />
          <figcaption className="mt-10 text-center font-mono text-[0.66rem] tracking-wide text-muted">Illustrative ecosystem · demo product listings · hover a product</figcaption>
        </figure>
      </Container>
    </div>
  );
}
