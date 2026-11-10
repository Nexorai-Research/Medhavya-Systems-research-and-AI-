"use client";

import { useId, type CSSProperties } from "react";
import "./hero.css";

/**
 * Tiny animated scenes that express what each product means. They mount only while
 * their product is active, so every activation replays from the start. Pure SVG/CSS
 * (plus one SMIL motion path); all decorative and hidden from assistive technology.
 */
import type { VignetteKind } from "./vignette-map";

export function ProductVignette({ kind, reduced = false }: { kind: VignetteKind; reduced?: boolean }) {
  return (
    <div aria-hidden className="vignette relative h-16 w-full overflow-hidden rounded-[10px] bg-gradient-to-b from-canvas to-white ring-1 ring-line">
      {kind === "agro" && <Agro />}
      {kind === "health" && <Health />}
      {kind === "crm" && <Crm />}
      {kind === "edu" && <Edu />}
      {kind === "erp" && <Erp />}
      {kind === "logistics" && <Logistics reduced={reduced} />}
      {kind === "finance" && <Finance />}
      {kind === "automation" && <Automation />}
      {kind === "manage" && <Manage />}
    </div>
  );
}

function Finance() {
  // Candles grow in sequence, a trend line traces them and a scan line sweeps.
  const candles = [
    { x: 18, o: 40, c: 32, h: 26, l: 46, up: true },
    { x: 34, o: 32, c: 38, h: 28, l: 42, up: false },
    { x: 50, o: 38, c: 28, h: 24, l: 41, up: true },
    { x: 66, o: 28, c: 30, h: 22, l: 35, up: false },
    { x: 82, o: 30, c: 20, h: 16, l: 33, up: true },
    { x: 98, o: 20, c: 24, h: 17, l: 29, up: false },
    { x: 114, o: 24, c: 14, h: 10, l: 27, up: true },
  ];
  return (
    <svg viewBox="0 0 160 64" className="size-full">
      {[16, 32, 48].map((y) => (
        <line key={y} x1="0" x2="160" y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="2 4" />
      ))}
      {candles.map((c, i) => (
        <g key={c.x} className="v-candle" style={{ animationDelay: `${i * 0.12}s`, transformOrigin: `${c.x}px 52px` }}>
          <line x1={c.x} x2={c.x} y1={c.h} y2={c.l} stroke={c.up ? "#17794A" : "#B42318"} strokeWidth="1.2" />
          <rect x={c.x - 4} y={Math.min(c.o, c.c)} width="8" height={Math.max(2, Math.abs(c.o - c.c))} rx="1" fill={c.up ? "#22A06B" : "#E5484D"} />
        </g>
      ))}
      <path className="v-trend" pathLength={1} d="M18 36 L34 35 L50 33 L66 29 L82 25 L98 22 L114 19 L140 12" fill="none" stroke="#527BFF" strokeWidth="1.8" strokeDasharray="1" />
      <circle className="v-trend-dot" cx="140" cy="12" r="3" fill="#527BFF" />
      <rect className="v-scan" x="0" y="0" width="14" height="64" fill="url(#v-scan-grad)" />
      <defs>
        <linearGradient id="v-scan-grad" x1="0" x2="1">
          <stop offset="0" stopColor="#35B9D6" stopOpacity="0" />
          <stop offset="0.5" stopColor="#35B9D6" stopOpacity="0.25" />
          <stop offset="1" stopColor="#35B9D6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Automation() {
  // Documents enter, pass a scanning gear, and leave as approved records.
  return (
    <svg viewBox="0 0 160 64" className="size-full">
      <path d="M8 34 H152" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <g key={i} className="v-doc" style={{ animationDelay: `${i * 0.8}s` }}>
          <rect x="4" y="22" width="16" height="20" rx="2" fill="#fff" stroke="#315FD5" strokeWidth="1.4" />
          <line x1="8" x2="16" y1="28" y2="28" stroke="#315FD5" strokeOpacity="0.5" strokeWidth="1.4" />
          <line x1="8" x2="14" y1="32" y2="32" stroke="#315FD5" strokeOpacity="0.35" strokeWidth="1.4" />
          <line x1="8" x2="16" y1="36" y2="36" stroke="#315FD5" strokeOpacity="0.35" strokeWidth="1.4" />
          <circle className="v-doc-ok" cx="18" cy="23" r="4.5" fill="#17794A" />
          <path className="v-doc-ok" d="M16 23 L17.5 24.5 L20.2 21.6" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      ))}
      <g className="v-gear" style={{ transformOrigin: "80px 20px" }}>
        <circle cx="80" cy="20" r="9" fill="none" stroke="#101A2D" strokeWidth="4" strokeDasharray="3.2 2.4" />
        <circle cx="80" cy="20" r="5" fill="#101A2D" />
        <circle cx="80" cy="20" r="2" fill="#35B9D6" />
      </g>
      <path d="M80 29 L72 50 H88Z" fill="#35B9D6" opacity="0.18" className="v-beam" />
    </svg>
  );
}

function Manage() {
  // A barcode is scanned, stock bars update and the daily total ticks up.
  const bars = [
    { x: 92, h: 18 },
    { x: 106, h: 30 },
    { x: 120, h: 22 },
    { x: 134, h: 36 },
  ];
  return (
    <svg viewBox="0 0 160 64" className="size-full">
      <g>
        {[10, 13, 15, 19, 21, 24, 28, 30, 33, 36, 40, 42, 46, 49, 52].map((x, i) => (
          <rect key={x} x={x} y="16" width={i % 3 === 0 ? 2 : 1} height="30" fill="#101A2D" />
        ))}
        <line className="v-laser" x1="6" x2="58" y1="20" y2="20" stroke="#E5484D" strokeWidth="1.6" />
      </g>
      <path d="M64 31 h14" stroke="#527BFF" strokeWidth="1.6" strokeDasharray="2 2" className="v-dash" />
      <line x1="86" x2="152" y1="52" y2="52" stroke="#CBD5E1" />
      {bars.map((b, i) => (
        <rect key={b.x} className="v-bar" style={{ animationDelay: `${0.2 + i * 0.15}s`, transformOrigin: `${b.x}px 52px` }} x={b.x - 5} y={52 - b.h} width="10" height={b.h} rx="2" fill={i === 3 ? "#D4A038" : "#315FD5"} />
      ))}
      <g className="v-receipt">
        <rect x="102" y="4" width="40" height="12" rx="3" fill="#E8F6EE" />
        <text x="122" y="12.5" textAnchor="middle" fontSize="7" fontWeight="600" fill="#17794A">+1 sale</text>
      </g>
    </svg>
  );
}

function Agro() {
  const sprouts = [36, 80, 124];
  return (
    <svg viewBox="0 0 160 64" className="size-full">
      <circle className="v-sun" cx="134" cy="16" r="8" fill="#D4A038" />
      <circle className="v-sun-halo" cx="134" cy="16" r="13" fill="none" stroke="#D4A038" strokeOpacity="0.35" />
      {[20, 58, 98, 142].map((x, i) => (
        <line key={x} className="v-rain" style={{ animationDelay: `${i * 0.35}s` }} x1={x} x2={x - 2} y1="4" y2="10" stroke="#35B9D6" strokeWidth="1.6" strokeLinecap="round" />
      ))}
      <path d="M6 54 Q40 49 80 54 T154 54" fill="none" stroke="#8A6416" strokeOpacity="0.45" strokeWidth="2" />
      {sprouts.map((x, i) => (
        <g key={x} style={{ animationDelay: `${0.2 + i * 0.25}s` }} className="v-sprout">
          <path d={`M${x} 54 C${x} 46 ${x + 1} 40 ${x} 30`} pathLength={1} className="v-stem" style={{ animationDelay: `${0.2 + i * 0.25}s` }} fill="none" stroke="#17794A" strokeWidth="2" strokeLinecap="round" />
          <path className="v-leaf v-leaf-l" style={{ animationDelay: `${0.7 + i * 0.25}s`, transformOrigin: `${x}px 36px` }} d={`M${x} 36 C${x - 10} 34 ${x - 12} 26 ${x - 12} 24 C${x - 4} 24 ${x} 30 ${x} 36Z`} fill="#22A06B" />
          <path className="v-leaf v-leaf-r" style={{ animationDelay: `${0.85 + i * 0.25}s`, transformOrigin: `${x}px 33px` }} d={`M${x} 33 C${x + 9} 31 ${x + 12} 23 ${x + 12} 20 C${x + 4} 21 ${x} 27 ${x} 33Z`} fill="#35B9D6" />
        </g>
      ))}
    </svg>
  );
}

function Health() {
  return (
    <svg viewBox="0 0 160 64" className="size-full">
      {[16, 32, 48].map((y) => (
        <line key={y} x1="0" x2="160" y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="2 4" />
      ))}
      <path
        className="v-ecg-base"
        d="M0 36 H38 L44 36 L50 22 L57 50 L63 8 L70 44 L76 36 H104 L109 30 L114 36 H124"
        fill="none"
        stroke="#35B9D6"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        className="v-ecg"
        pathLength={1}
        d="M0 36 H38 L44 36 L50 22 L57 50 L63 8 L70 44 L76 36 H104 L109 30 L114 36 H124"
        fill="none"
        stroke="#0E6F86"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <g className="v-heart" style={{ transformOrigin: "142px 32px" }}>
        <path d="M142 42 C130 34 132 22 138 22 C141 22 142 25 142 26 C142 25 143 22 146 22 C152 22 154 34 142 42Z" fill="#E5484D" />
      </g>
      <path className="v-spark" style={{ transformOrigin: "150px 12px" }} d="M150 6 L151.6 10.4 L156 12 L151.6 13.6 L150 18 L148.4 13.6 L144 12 L148.4 10.4Z" fill="#527BFF" />
    </svg>
  );
}

function Crm() {
  const people = [
    { y: 13, d: "0s" },
    { y: 32, d: "0.35s" },
    { y: 51, d: "0.7s" },
  ];
  return (
    <svg viewBox="0 0 160 64" className="size-full">
      {people.map((p) => (
        <g key={p.y}>
          <path d={`M30 ${p.y} L118 32`} pathLength={1} className="v-link" style={{ animationDelay: p.d }} fill="none" stroke="#527BFF" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle className="v-packet" style={{ animationDelay: p.d, "--dx": "88px", "--dy": `${32 - p.y}px` } as CSSProperties} cx="30" cy={p.y} r="2.4" fill="#35B9D6" />
          <g className="v-person" style={{ animationDelay: p.d }}>
            <circle cx="20" cy={p.y - 3} r="3.6" fill="#315FD5" />
            <path d={`M13 ${p.y + 6} C13 ${p.y + 1} 27 ${p.y + 1} 27 ${p.y + 6}`} fill="#315FD5" />
          </g>
        </g>
      ))}
      <circle className="v-deal" style={{ transformOrigin: "128px 32px" }} cx="128" cy="32" r="13" fill="#17794A" />
      <path className="v-check" pathLength={1} d="M121.5 32.5 L126.5 37.5 L135 27.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Edu() {
  return (
    <div className="v-edu absolute inset-0 flex items-end justify-center pb-2">
      <div className="v-book relative h-9 w-24">
        <div className="absolute inset-y-0 left-0 w-1/2 rounded-l-sm border border-line-strong bg-white" />
        <div className="absolute inset-y-0 right-0 w-1/2 rounded-r-sm border border-line-strong bg-white" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="v-page absolute inset-y-0 right-0 w-1/2 rounded-r-sm border border-primary/30 bg-gradient-to-r from-blue-50 to-white" style={{ animationDelay: `${0.15 + i * 0.45}s` }}>
            <span className="absolute top-2 left-2 h-0.5 w-6 rounded bg-primary/30" />
            <span className="absolute top-4 left-2 h-0.5 w-4 rounded bg-primary/20" />
          </div>
        ))}
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line-strong" />
      </div>
      <svg viewBox="0 0 40 28" className="v-cap absolute top-1 left-[58%] h-6 w-9">
        <path d="M20 2 L38 10 L20 18 L2 10Z" fill="#101A2D" />
        <path d="M10 14 V20 C10 23 30 23 30 20 V14 L20 18Z" fill="#16233B" />
        <path d="M33 12 V20" stroke="#D4A038" strokeWidth="1.6" />
        <circle cx="33" cy="21" r="1.8" fill="#D4A038" />
      </svg>
      {[18, 132, 146].map((x, i) => (
        <span key={x} className="v-twinkle absolute size-1.5 rounded-full bg-gold" style={{ left: `${(x / 160) * 100}%`, top: `${20 + i * 12}%`, animationDelay: `${0.6 + i * 0.3}s` }} />
      ))}
    </div>
  );
}

function Erp() {
  // Isometric module blocks that drop in and stack.
  const blocks = [
    { x: 52, y: 40, c: ["#315FD5", "#2449AD", "#527BFF"], d: "0s" },
    { x: 80, y: 40, c: ["#0E6F86", "#0B5B6E", "#35B9D6"], d: "0.18s" },
    { x: 108, y: 40, c: ["#8A6416", "#6F500F", "#D4A038"], d: "0.36s" },
    { x: 66, y: 24, c: ["#16233B", "#101A2D", "#596579"], d: "0.6s" },
    { x: 94, y: 24, c: ["#315FD5", "#2449AD", "#527BFF"], d: "0.78s" },
  ];
  const cube = (x: number, y: number) => ({
    top: `M${x} ${y - 8} L${x + 12} ${y - 14} L${x + 24} ${y - 8} L${x + 12} ${y - 2}Z`,
    left: `M${x} ${y - 8} L${x + 12} ${y - 2} L${x + 12} ${y + 10} L${x} ${y + 4}Z`,
    right: `M${x + 12} ${y - 2} L${x + 24} ${y - 8} L${x + 24} ${y + 4} L${x + 12} ${y + 10}Z`,
  });
  return (
    <svg viewBox="0 0 160 64" className="size-full">
      <ellipse cx="80" cy="56" rx="52" ry="5" fill="#101A2D" opacity="0.08" />
      {blocks.map((b) => {
        const f = cube(b.x - 12, b.y);
        return (
          <g key={`${b.x}-${b.y}`} className="v-block" style={{ animationDelay: b.d }}>
            <path d={f.left} fill={b.c[0]} />
            <path d={f.right} fill={b.c[1]} />
            <path d={f.top} fill={b.c[2]} />
          </g>
        );
      })}
      <path className="v-spark" style={{ transformOrigin: "130px 14px", animationDelay: "1.1s" }} d="M130 8 L131.6 12.4 L136 14 L131.6 15.6 L130 20 L128.4 15.6 L124 14 L128.4 12.4Z" fill="#D4A038" />
    </svg>
  );
}

function Logistics({ reduced }: { reduced: boolean }) {
  const route = "M10 48 C34 48 40 18 70 18 S112 50 136 26";
  const routeId = `v-route-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 160 64" className="size-full">
      <path d={route} fill="none" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />
      <path id={routeId} className="v-route" pathLength={1} d={route} fill="none" stroke="#315FD5" strokeWidth="2" strokeDasharray="0.04 0.03" strokeLinecap="round" />
      <circle cx="10" cy="48" r="3.5" fill="#101A2D" />
      <g className="v-pin" style={{ transformOrigin: "136px 26px" }}>
        <ellipse cx="136" cy="27" rx="5" ry="1.6" fill="#101A2D" opacity="0.18" />
        <path d="M136 26 C130 18 129 15 129 12 A7 7 0 0 1 143 12 C143 15 142 18 136 26Z" fill="#E5484D" />
        <circle cx="136" cy="12" r="2.6" fill="#fff" />
      </g>
      <g>
        <g transform="translate(-9 -7)">
          <rect x="0" y="2" width="11" height="9" rx="1.5" fill="#315FD5" />
          <path d="M11 5 H15 L18 8 V11 H11Z" fill="#101A2D" />
          <circle cx="4" cy="12" r="1.8" fill="#101A2D" />
          <circle cx="14" cy="12" r="1.8" fill="#101A2D" />
        </g>
        {reduced ? (
          <animateMotion dur="0.01s" fill="freeze" keyPoints="1;1" keyTimes="0;1" calcMode="linear">
            <mpath href={`#${routeId}`} />
          </animateMotion>
        ) : (
          <animateMotion dur="2.4s" begin="0.2s" fill="freeze" rotate="auto" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.45 0 0.2 1">
            <mpath href={`#${routeId}`} />
          </animateMotion>
        )}
      </g>
    </svg>
  );
}
