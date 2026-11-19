import type { CSSProperties } from "react";

/**
 * Animated farmland scene shown BEHIND the Agro360AI product mockup: a sun with slow rays,
 * drifting clouds and light rain, three rolling hills and rows of swaying wheat, with pollen
 * rising off the field. Pure SVG + CSS (no client JS); every animation is switched off under
 * prefers-reduced-motion (see visuals.css). Positions are fixed numbers, never random, so the
 * server and client markup always match.
 */

const FRONT = Array.from({ length: 22 }, (_, k) => ({ x: 24 + k * 33, h: 50 + (Math.sin(k * 1.7) + 1) * 14, d: -(k % 7) * 0.55 }));
const BACK = Array.from({ length: 16 }, (_, k) => ({ x: 44 + k * 46, h: 32 + (Math.cos(k * 1.3) + 1) * 9, d: -(k % 5) * 0.7 }));
const RAYS = Array.from({ length: 14 }, (_, k) => k * (360 / 14));
const MOTES = [
  { x: 90, dx: 26, dur: 7.5, d: 0 },
  { x: 190, dx: -18, dur: 9, d: -3 },
  { x: 300, dx: 30, dur: 8, d: -5 },
  { x: 410, dx: -24, dur: 10, d: -1.5 },
  { x: 520, dx: 20, dur: 8.5, d: -6 },
  { x: 610, dx: -30, dur: 9.5, d: -2.5 },
  { x: 680, dx: 14, dur: 7, d: -4 },
];
const RAIN = [
  { x: 96, d: 0 },
  { x: 112, d: -0.45 },
  { x: 128, d: -0.9 },
  { x: 144, d: -0.2 },
  { x: 160, d: -0.7 },
];

const v = (o: Record<string, string | number>) => o as CSSProperties;

function Stalk({ x, y, h, d, tone }: { x: number; y: number; h: number; d: number; tone: "front" | "back" }) {
  const stem = tone === "front" ? "#2f8f5b" : "#58ad7b";
  const leaf = tone === "front" ? "#3fa66b" : "#74c294";
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="abd-stalk" style={v({ "--d": `${d}s` })}>
        <path d={`M0 0 V${-h}`} stroke={stem} strokeWidth={tone === "front" ? 3 : 2.4} strokeLinecap="round" fill="none" />
        <ellipse cx={-7} cy={-h * 0.5} rx={8} ry={3} transform={`rotate(-35 -7 ${-h * 0.5})`} fill={leaf} />
        <ellipse cx={7} cy={-h * 0.68} rx={8} ry={3} transform={`rotate(35 7 ${-h * 0.68})`} fill={leaf} />
        <ellipse cx={0} cy={-h - 7} rx={4} ry={10} fill="var(--color-gold)" opacity={tone === "front" ? 1 : 0.8} />
      </g>
    </g>
  );
}

export function AgroBackdrop() {
  return (
    <div className="h-full w-full overflow-hidden rounded-[28px] border border-white/70 bg-[#eef6fb] shadow-[var(--shadow-lift)]">
      <svg viewBox="0 0 720 600" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="abd-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dcecff" />
            <stop offset="0.55" stopColor="#eef7f2" />
            <stop offset="1" stopColor="#e4f3e6" />
          </linearGradient>
          <radialGradient id="abd-glow" cx="0.85" cy="0.12" r="0.6">
            <stop offset="0" stopColor="#ffd98a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="720" height="600" fill="url(#abd-sky)" />
        <rect width="720" height="600" fill="url(#abd-glow)" />

        {/* Sun */}
        <g transform="translate(610 118)">
          <g className="abd-rays">
            {RAYS.map((a) => (
              <line key={a} x1="0" y1="-64" x2="0" y2="-86" stroke="var(--color-gold)" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" transform={`rotate(${a})`} />
            ))}
          </g>
          <circle className="abd-halo" r="54" fill="var(--color-gold)" opacity="0.22" />
          <circle r="36" fill="var(--color-gold)" />
          <circle r="36" fill="#fff" opacity="0.18" cx="-8" cy="-8" />
        </g>

        {/* Clouds and rain */}
        <g className="abd-cloud" style={v({ "--dur": "34s" })}>
          <g fill="#fff" opacity="0.95" transform="translate(132 98)">
            <ellipse rx="52" ry="17" />
            <ellipse rx="32" ry="17" cx="-26" cy="-12" />
            <ellipse rx="30" ry="18" cx="22" cy="-14" />
          </g>
          {RAIN.map((r) => (
            <line key={r.x} className="abd-rain" style={v({ "--d": `${r.d}s` })} x1={r.x} y1="122" x2={r.x - 4} y2="134" stroke="#6fa8dc" strokeWidth="2.4" strokeLinecap="round" />
          ))}
        </g>
        <g className="abd-cloud" style={v({ "--dur": "46s" })}>
          <g fill="#fff" opacity="0.8" transform="translate(420 52)">
            <ellipse rx="40" ry="13" />
            <ellipse rx="24" ry="13" cx="-18" cy="-9" />
            <ellipse rx="22" ry="14" cx="16" cy="-10" />
          </g>
        </g>

        {/* Hills */}
        <path className="abd-hill" style={v({ "--dur": "22s" })} d="M-80 380 C60 318 200 342 320 366 S560 330 800 362 V640 H-80Z" fill="#cfe8d5" />
        <path className="abd-hill" style={v({ "--dur": "17s" })} d="M-80 436 C100 384 240 424 380 412 S600 382 800 424 V640 H-80Z" fill="#a9d6b6" />
        <path d="M-80 494 C120 458 260 484 400 474 S620 448 800 484 V640 H-80Z" fill="#7cc096" />

        {/* Crop rows */}
        {BACK.map((s) => (
          <Stalk key={`b${s.x}`} x={s.x} y={508} h={s.h} d={s.d} tone="back" />
        ))}
        <path d="M-80 520 C120 506 300 528 460 516 S660 504 800 520 V640 H-80Z" fill="#5eb07f" />
        {FRONT.map((s) => (
          <Stalk key={`f${s.x}`} x={s.x} y={566} h={s.h} d={s.d} tone="front" />
        ))}
        <rect x="-10" y="566" width="740" height="40" fill="#2f8f5b" />

        {/* Pollen rising off the field */}
        {MOTES.map((m) => (
          <circle key={m.x} className="abd-mote" style={v({ "--dx": `${m.dx}px`, "--dur": `${m.dur}s`, "--d": `${m.d}s` })} cx={m.x} cy={500} r="3" fill="#fff6d6" />
        ))}
      </svg>
    </div>
  );
}
