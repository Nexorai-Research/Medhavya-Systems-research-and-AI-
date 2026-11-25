"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * The Medhavya "M" built from particles, drawn straight on the page (no backdrop).
 * Thousands of glowing points swirl as a milky-way spiral, then flow in a wave from the centre
 * outward and lock into the logo. Once formed, the real logo fades in underneath so the mark looks
 * whole and crisp, while the particles keep shimmering on top.
 *
 * Interactive: moving the pointer (or a finger) over it parts the stars like water;
 * a click or tap bursts it back into the galaxy, and it re-forms. The finished logo stays crisp at all times; only the stars behind it react.
 * Decorative only (aria-hidden); reduced-motion users get the finished logo, drawn once.
 */
const SRC = "/brand/medhavya-mark-hd.png";
const SAMPLE_W = 160; // logo sampling resolution
const DUST = 2200; // extra stars that stay in the galaxy
const LOGO = 0.714; // logo width as a fraction of the square canvas
const ARMS = 3;

const GALAXY = 2.5; // seconds: swirl only
const FORM = 3.2; // seconds: converge into the M
const BURST = 1.2; // seconds: click scatter

type P = {
  tx: number; ty: number; col: string;
  arm: number; rad: number; ang0: number; jit: number; size: number; delay: number; tw: number;
  dust: boolean; ox: number; oy: number;
};

/** Push a sampled colour toward full saturation so the particles glow instead of looking washed out. */
function vivid(r: number, g: number, b: number) {
  const k = 1.3;
  const y = 0.3 * r + 0.59 * g + 0.11 * b;
  const f = (v: number) => Math.round(Math.min(255, Math.max(0, y + (v - y) * k)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

/** Soft round glow sprites, one per colour, drawn behind the brightest stars. */
const sprites = new Map<string, HTMLCanvasElement>();
function sprite(col: string) {
  let c = sprites.get(col);
  if (!c) {
    c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d");
    if (x) {
      const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, col.replace("rgb(", "rgba(").replace(")", ",0.95)"));
      g.addColorStop(0.25, col.replace("rgb(", "rgba(").replace(")", ",0.45)"));
      g.addColorStop(1, col.replace("rgb(", "rgba(").replace(")", ",0)"));
      x.fillStyle = g;
      x.fillRect(0, 0, 64, 64);
    }
    sprites.set(col, c);
  }
  return c;
}

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const ease = (n: number) => n * n * (3 - 2 * n);

function morph(s: number, d: number) {
  if (s < GALAXY) return 0;
  if (s < GALAXY + FORM) return ease(clamp(((s - GALAXY) / FORM - d * 0.5) / 0.5));
  return 1;
}

function build(img: HTMLImageElement): P[] {
  const sh = Math.round((SAMPLE_W * img.naturalHeight) / img.naturalWidth);
  const off = document.createElement("canvas");
  off.width = SAMPLE_W;
  off.height = sh;
  const c = off.getContext("2d", { willReadFrequently: true });
  if (!c) return [];
  c.drawImage(img, 0, 0, SAMPLE_W, sh);
  const data = c.getImageData(0, 0, SAMPLE_W, sh).data;
  const out: P[] = [];
  const base = (arm: number) => ({ arm, rad: Math.pow(Math.random(), 0.55), ang0: Math.random() - 0.5, jit: Math.random() - 0.5 });
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < SAMPLE_W; x++) {
      const i = (y * SAMPLE_W + x) * 4;
      if (data[i + 3] < 130) continue;
      const tx = ((x + Math.random()) / SAMPLE_W - 0.5) * 2 * LOGO;
      const ty = ((y + Math.random()) / SAMPLE_W - sh / SAMPLE_W / 2) * 2 * LOGO;
      out.push({
        tx, ty, col: vivid(data[i], data[i + 1], data[i + 2]), ...base(Math.floor(Math.random() * ARMS)),
        size: 0.5 + Math.random() * 1.2, delay: Math.min(1, Math.hypot(tx, ty) / LOGO), tw: Math.random() * 6.28,
        dust: false, ox: 0, oy: 0,
      });
    }
  }
  const dustCols = ["rgb(40,100,255)", "rgb(0,200,240)", "rgb(255,176,32)", "rgb(120,110,255)", "rgb(30,140,255)", "rgb(255,120,180)"];
  for (let k = 0; k < DUST; k++) {
    out.push({
      tx: 0, ty: 0, col: dustCols[k % dustCols.length], ...base(Math.floor(Math.random() * ARMS)),
      size: 0.5 + Math.random() * 1.6, delay: 0, tw: Math.random() * 6.28, dust: true, ox: 0, oy: 0,
    });
  }
  return out;
}

export function GalaxyMark() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const box = wrap.current;
    if (!cv || !box) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let parts: P[] = [];
    let logo: HTMLImageElement | null = null;
    let size = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let running = false;
    let epoch = performance.now();
    let burstAt = -1;
    const mouse = { x: 9, y: 9, on: false };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      size = box.clientWidth;
      cv.width = Math.round(size * dpr);
      cv.height = Math.round(size * dpr);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!parts.length || !logo) return;
      const t = now / 1000;
      let s = reduced ? GALAXY + FORM + 1 : (now - epoch) / 1000;
      // click burst: everything scatters back to the galaxy, then the cycle restarts
      let bt = -1;
      if (burstAt >= 0) {
        bt = (now - burstAt) / 1000;
        if (bt > BURST) {
          burstAt = -1;
          epoch = now;
          s = 0;
          bt = -1;
        }
      }
      const half = (size * dpr) / 2;
      const unit = half / 200;
      const spin = reduced ? 0 : t * 0.32;
      const formedAt = GALAXY + FORM;
      const pOf = (d: number) => (bt >= 0 ? 1 - ease(clamp((bt / BURST - (1 - d) * 0.5) / 0.5)) : morph(s, d));
      const global = pOf(0.5);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);

      // soft nebula glow behind the galaxy, fading as the logo takes over
      const glow = 0.22 * (1 - 0.3 * global);
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(half, half, 0, half, half, half * 0.9);
      g.addColorStop(0, `rgba(255,214,140,${glow * 0.9})`);
      g.addColorStop(0.12, `rgba(90,130,255,${glow})`);
      g.addColorStop(0.5, `rgba(40,190,235,${glow * 0.4})`);
      g.addColorStop(1, "rgba(53,185,214,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cv.width, cv.height);

      ctx.globalCompositeOperation = "source-over";
      const imgA = bt >= 0 ? 1 - clamp(bt / 0.3) : ease(clamp((s - (formedAt - 0.5)) / 1.2));
      // additive blending on the dark stage makes overlapping points glow like light
      const drawParticle = (p: P) => {
        if (!p.dust && imgA >= 0.995) return; // the M is whole: draw only the crisp logo
        const m = p.dust ? 0 : pOf(p.delay);
        // galaxy position: broad spiral arms, inner stars orbit faster
        const ang = (p.arm * Math.PI * 2) / ARMS + p.rad * 4.2 + p.ang0 * 0.4 + spin / (0.3 + p.rad);
        const rr = 0.06 + p.rad * 0.84 + p.jit * 0.07 * (0.3 + p.rad);
        const gx = Math.cos(ang) * rr;
        const gy = Math.sin(ang) * rr * 0.9;
        let x = gx;
        let y = gy;
        if (!p.dust) {
          // flow from the galaxy to the logo with a sideways swirl so it reads as a wave
          const dx = p.tx - gx;
          const dy = p.ty - gy;
          const sw = Math.sin(Math.PI * m) * 0.24;
          const len = Math.hypot(dx, dy) || 1;
          x = gx + dx * m - (dy / len) * sw;
          y = gy + dy * m + (dx / len) * sw;
          if (m > 0.98) {
            x += Math.sin(t * 1.5 + p.tw) * 0.003;
            y += Math.cos(t * 1.3 + p.tw) * 0.003;
          }
        }
        // pointer parts the particles like water; they ease back when it leaves
        if (mouse.on) {
          const mx = x - mouse.x;
          const my = y - mouse.y;
          const md = Math.hypot(mx, my);
          if (md < 0.3) {
            const f = (1 - md / 0.3) ** 2 * 0.045;
            const l = md || 1;
            p.ox += (mx / l) * f + (-my / l) * f * 0.5;
            p.oy += (my / l) * f + (mx / l) * f * 0.5;
          }
        }
        p.ox *= 0.92;
        p.oy *= 0.92;
        x += p.ox;
        y += p.oy;
        const tw = 0.72 + 0.28 * Math.sin(t * 2.3 + p.tw);
        const alpha = p.dust ? 0.55 * tw : (0.5 + 0.5 * m) * (0.7 + 0.3 * tw) * (1 - imgA);
        const px = half + x * half;
        const py = half + y * half;
        const r = (p.size * (1 - 0.3 * m) + 0.45) * unit * 1.1;
        ctx.fillStyle = p.col;
        if (p.size > 1.15 && m < 0.9) {
          ctx.globalAlpha = alpha * 0.3;
          const gs = r * 7;
          ctx.drawImage(sprite(p.col), px - gs / 2, py - gs / 2, gs, gs);
        }
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fillRect(px - r, py - r, r * 2, r * 2);
      };
      // 1) the galaxy keeps swirling behind the logo
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) if (p.dust) drawParticle(p);
      ctx.globalCompositeOperation = "source-over";
      // the real logo, once the particles have locked in, so the mark reads as complete
      if (imgA > 0.01) {
        const lw = size * dpr * LOGO;
        const lh = (lw * logo.naturalHeight) / logo.naturalWidth;
        const lx = half - lw / 2;
        const ly = half - lh / 2;
        ctx.globalAlpha = imgA;
        ctx.drawImage(logo, lx, ly, lw, lh);
      }

      // 2) the particles that form the M shimmer on top of the logo
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) if (!p.dust) drawParticle(p);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(frame);
      else running = false;
    };

    const kick = () => {
      if (running && raf) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const img = new window.Image();
    img.onload = () => {
      logo = img;
      parts = build(img);
      resize();
      epoch = performance.now();
      box.dataset.ready = "true";
      kick();
    };
    img.src = SRC;

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced || !running) kick();
    });
    ro.observe(box);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(box);
    const onVis = () => {
      if (!document.hidden) kick();
    };
    document.addEventListener("visibilitychange", onVis);
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      mouse.on = true;
    };
    const onLeave = () => {
      mouse.on = false;
    };
    const onDown = () => {
      const s = (performance.now() - epoch) / 1000;
      if (burstAt < 0 && s > GALAXY + FORM * 0.9) burstAt = performance.now();
    };
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);
    cv.addEventListener("pointerdown", onDown);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
      cv.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div className="relative aspect-[218/192] w-full" aria-hidden>
      <div ref={wrap} className="absolute top-1/2 left-1/2 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100">
        <canvas ref={canvas} className="absolute inset-0 size-full cursor-pointer touch-pan-y" />
      </div>
      <noscript>
        <Image src={SRC} alt="" width={218} height={192} className="w-full" />
      </noscript>
    </div>
  );
}
