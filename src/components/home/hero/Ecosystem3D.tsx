"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, RefObject } from "react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { lifecycleTone } from "@/components/ui/Badges";
import { cn } from "@/lib/cn";
import { ProductVignette } from "./ProductVignette";
import { vignetteBySlug } from "./vignette-map";
import type { HeroNode } from "./HeroStage";

/** Node placement: centre (% of scene) and resting depth (px toward the viewer). */
const layout = [
  { x: 19, y: 13, z: 70, float: 7.2 },
  { x: 81, y: 13, z: 45, float: 8.4 },
  { x: 15, y: 50, z: 35, float: 6.6 },
  { x: 85, y: 50, z: 80, float: 7.8 },
  { x: 19, y: 87, z: 55, float: 8.8 },
  { x: 81, y: 87, z: 40, float: 7 },
];

const CORE = { x: 500, y: 450 };
const toView = (p: { x: number; y: number }) => ({ x: p.x * 10, y: p.y * 9 });

function curve(to: { x: number; y: number }) {
  const midX = (CORE.x + to.x) / 2;
  return `M${CORE.x},${CORE.y} C${midX},${CORE.y} ${midX},${to.y} ${to.x},${to.y}`;
}

const services = ["Identity & roles", "Data layer", "AI services", "Integrations"];

/**
 * A true 3D scene ("4D": depth + time). The camera tilts with the pointer and sways when idle
 * (driven by HeroStage through --rx/--ry); panels float at different depths, the platform core is
 * a stack of layers, and the active product lifts toward the viewer and plays its story.
 */
export function Ecosystem3D({
  nodes,
  active,
  onHover,
  sceneRef,
  reduced,
}: {
  nodes: HeroNode[];
  active: number | null;
  onHover: (i: number | null) => void;
  sceneRef: RefObject<HTMLDivElement | null>;
  reduced: boolean;
}) {
  const activeNode = active !== null ? nodes[active] : null;

  return (
    <div className="eco3d-camera relative mx-auto aspect-[10/9] w-full max-w-[620px]">
      <div ref={sceneRef} className="eco3d-scene absolute inset-0">
        {/* Floor: precision grid far behind the scene */}
        <div aria-hidden className="eco3d-floor bg-grid absolute -inset-[12%] rounded-[40px]" />

        {/* Orbit rings */}
        <svg aria-hidden viewBox="0 0 1000 900" className="eco3d-rings absolute inset-0 size-full overflow-visible">
          <g className="eco3d-spin" style={{ transformOrigin: "500px 450px" }}>
            <circle cx="500" cy="450" r="330" fill="none" stroke="#315FD5" strokeOpacity="0.18" strokeDasharray="2 12" />
          </g>
          <g className="eco3d-spin-rev" style={{ transformOrigin: "500px 450px" }}>
            <circle cx="500" cy="450" r="445" fill="none" stroke="#D4A038" strokeOpacity="0.28" strokeDasharray="1 16" strokeWidth="2" />
            <circle cx="945" cy="450" r="5" fill="#D4A038" />
          </g>
        </svg>

        {/* Connections on the ground plane */}
        <svg aria-hidden viewBox="0 0 1000 900" className="eco3d-links absolute inset-0 size-full overflow-visible">
          <defs>
            <linearGradient id="eco-flow" x1="0" x2="1">
              <stop offset="0%" stopColor="#35B9D6" />
              <stop offset="100%" stopColor="#527BFF" />
            </linearGradient>
            <radialGradient id="eco-core-glow">
              <stop offset="0%" stopColor="#527BFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#527BFF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={CORE.x} cy={CORE.y} r="280" fill="url(#eco-core-glow)" />
          {nodes.map((n, i) => {
            const d = curve(toView(layout[i]));
            const on = active === i;
            return (
              <g key={n.slug}>
                <path d={d} fill="none" stroke="#315FD5" strokeWidth={on ? 3 : 2} strokeOpacity={on ? 0.75 : active === null ? 0.18 : 0.08} className="transition-[stroke-opacity,stroke-width] duration-500" />
                <path
                  d={d}
                  fill="none"
                  stroke="url(#eco-flow)"
                  strokeWidth={on ? 3.5 : 2.5}
                  strokeLinecap="round"
                  strokeDasharray={on ? "28 120" : "10 260"}
                  className={on ? "eco3d-flow-fast" : "animate-flow"}
                  style={{ animationDelay: `${i * -0.8}s`, opacity: active === null || on ? 1 : 0.35 }}
                />
              </g>
            );
          })}
        </svg>

        {/* Contact shadows under each panel (stay on the ground while panels lift) */}
        {nodes.map((n, i) => (
          <span
            key={`shadow-${n.slug}`}
            aria-hidden
            className={cn("eco3d-shadow absolute h-6 w-[24%] rounded-[50%] bg-midnight/25 blur-md", active === i && "is-active")}
            style={{ left: `${layout[i].x}%`, top: `${layout[i].y + 6}%` }}
          />
        ))}

        {/* Platform core: a stack of layers */}
        <div className="eco3d-core absolute w-[34%]" style={{ left: "50%", top: "50%" }}>
          <span aria-hidden className="eco3d-plate absolute inset-0 rounded-[22px] border border-electric/30 bg-electric/15" style={{ "--z": "-44px" } as CSSProperties} />
          <span aria-hidden className="eco3d-plate absolute inset-0 rounded-[22px] border border-white/10 bg-midnight-2/80" style={{ "--z": "-22px" } as CSSProperties} />
          <div className="eco3d-plate dark-section relative overflow-hidden rounded-[22px] border border-white/10 bg-midnight p-5 text-white shadow-[0_40px_80px_-30px_rgb(16_26_45/0.7)]" style={{ "--z": "0px" } as CSSProperties}>
            <div aria-hidden className="bg-grid-dark absolute inset-0 opacity-50" />
            <div aria-hidden className="eco3d-scan absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-cyan/15 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <Image src="/brand/medhavya-mark.png" alt="" width={218} height={192} className="h-6 w-auto" />
                <span className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase">Platform</span>
              </div>
              <ul className="mt-3.5 space-y-1.5">
                {services.map((s, i) => (
                  <li key={s} className="flex items-center gap-2 text-[0.7rem] text-white/80">
                    <span aria-hidden className="size-1.5 animate-pulse-soft rounded-full bg-cyan" style={{ animationDelay: `${i * 0.4}s` }} />
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-3.5 flex items-center gap-1.5 border-t border-white/10 pt-2.5 font-mono text-[0.6rem] tracking-wide text-cyan">
                <span aria-hidden className="relative flex size-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-cyan/70" />
                  <span className="relative size-1.5 rounded-full bg-cyan" />
                </span>
                <span key={activeNode?.slug ?? "all"} className="eco3d-status truncate">
                  {activeNode ? `${activeNode.name.replace(/^Medhavya /, "")} · connected` : `${nodes.length} products connected`}
                </span>
              </p>
            </div>
          </div>
          {/* Floating logo orb above the core */}
          <div aria-hidden className="eco3d-orb absolute left-1/2 flex size-16 items-center justify-center rounded-full border border-white/70 bg-white/80 shadow-[0_18px_40px_-12px_rgb(49_95_213/0.55)]">
            <span className="absolute inset-0 animate-ping rounded-full border border-electric/30 [animation-duration:2.8s]" />
            <Image src="/brand/medhavya-mark.png" alt="" width={218} height={192} className="h-9 w-auto" />
          </div>
        </div>

        {/* Product panels */}
        {nodes.map((n, i) => {
          const l = layout[i];
          const on = active === i;
          const kind = vignetteBySlug[n.slug];
          return (
            <div
              key={n.slug}
              className="eco3d-node absolute w-[31%]"
              style={{ left: `${l.x}%`, top: `${l.y}%`, "--z": `${l.z}px` } as CSSProperties}
            >
              <div className="eco3d-float" style={{ animationDuration: `${l.float}s`, animationDelay: `${i * -1.3}s` }}>
                <Link
                  href={`/products/${n.slug}`}
                  onPointerEnter={() => onHover(i)}
                  onPointerLeave={() => onHover(null)}
                  onFocus={() => onHover(i)}
                  onBlur={() => onHover(null)}
                  className={cn(
                    "eco3d-card group relative block rounded-[16px] border bg-white p-3",
                    on ? "is-active border-transparent" : "border-line",
                    active !== null && !on && "is-dimmed",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300", on ? "bg-primary text-white" : "bg-primary/8 text-primary")}>
                      <CategoryIcon icon={n.icon} className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[0.8rem] font-semibold text-midnight">{n.name.replace(/^Medhavya /, "")}</span>
                      <span className="block truncate text-[0.66rem] text-muted">{n.category}</span>
                    </span>
                  </span>
                  <span className={cn("grid transition-[grid-template-rows,margin] duration-500 ease-out", on ? "mt-2.5 grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <span className="overflow-hidden">{on && kind && <ProductVignette kind={kind} reduced={reduced} />}</span>
                  </span>
                  <span className="mt-2.5 flex items-center gap-1.5 border-t border-line pt-2 text-[0.64rem] text-muted">
                    <span aria-hidden className={cn("size-1.5 rounded-full", lifecycleTone[n.lifecycle].dot)} />
                    {n.lifecycle}
                  </span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
