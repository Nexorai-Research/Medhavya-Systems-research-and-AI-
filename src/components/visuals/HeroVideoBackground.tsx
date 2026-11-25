"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroVideoSource } from "@/lib/hero-videos";

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/** True on a genuinely large, fast display, where the 4K master is worth its download. */
function wantsUhd() {
  const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
  if (conn?.saveData || (conn?.effectiveType && conn.effectiveType !== "4g")) return false;
  return window.innerWidth >= 1700 && window.innerWidth * window.devicePixelRatio >= 3000;
}

/**
 * One looping, muted background clip. It fills its positioned parent and is meant to sit on a dark base.
 *  - Full HD by default; the 4K master only on large, fast, non-Save-Data displays.
 *  - Fades in once the first frame is ready, so there is never a flash of an empty box.
 *  - prefers-reduced-motion / Save-Data: shows the first frame and never plays.
 *  - Pauses while off-screen, while the tab is hidden, or while `active` is false.
 * Motion effects (scroll parallax, slow drift) are pure CSS in globals.css and are disabled for reduced motion.
 */
export function HeroVideoLayer({ video, active = true }: { video: HeroVideoSource; active?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
    ref.current?.dispatchEvent(new Event("hero:sync"));
  }, [active]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: NetworkInfo }).connection?.saveData === true;

    let visible = true;
    const sync = () => {
      const play = visible && activeRef.current && !document.hidden && !reduced.matches && !saveData;
      if (play) void el.play().catch(() => {});
      else el.pause();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(el);

    // The file is attached only after the window `load` event. A media element that is loading holds `load` open
    // (and this hero can mount several clips over time), which would delay load indicators, Lighthouse and tests
    // for as long as footage is still downloading. Until then the dark base shows.
    const attach = () => {
      el.src = video.uhd && wantsUhd() ? video.uhd : video.hd;
      sync();
    };
    if (document.readyState === "complete") attach();
    else window.addEventListener("load", attach, { once: true });

    el.addEventListener("hero:sync", sync);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    sync();
    return () => {
      io.disconnect();
      window.removeEventListener("load", attach);
      el.removeEventListener("hero:sync", sync);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, [video]);

  return (
    <div className={`hero-video-parallax absolute inset-x-0 -top-[10vh] bottom-0 transition-opacity duration-1000 ${active ? "opacity-100" : "opacity-0"}`}>
      <video
        ref={ref}
        className={`hero-video-drift absolute inset-0 size-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
        muted
        loop
        playsInline
        preload="auto"
        tabIndex={-1}
        onLoadedData={() => setReady(true)}
      />
    </div>
  );
}

/**
 * Whisper-light shade on the text side only (left on desktop, full width on small screens where text spans the
 * hero). The footage on the visual side stays completely unshaded; this only keeps white copy legible over
 * bright frames such as windows or sky.
 */
export function TextSide() {
  return <div aria-hidden className="absolute inset-0 bg-black/20 sm:bg-gradient-to-r sm:from-black/40 sm:via-black/15 sm:via-45% sm:to-transparent" />;
}

/**
 * Full-bleed video behind a hero section, at full strength (no scrim or wash).
 * Place inside a `relative overflow-hidden` section; content above it needs `relative`, and its text should be
 * white with a shadow so it stays readable over any frame. The dark base keeps white text readable while the
 * clip loads, if it fails, or when it is withheld.
 */
export function HeroVideoBackground({ video }: { video: HeroVideoSource }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden bg-midnight">
      <HeroVideoLayer video={video} />
      <TextSide />
    </div>
  );
}

/**
 * Full-bleed hero background that crossfades through several clips (one every `every` ms). A clip's file is only
 * requested once it is first shown, and clips that are not current are paused. Reduced-motion visitors stay on
 * the first clip (its first frame).
 */
export function CyclingHeroVideo({ clips, every = 7000 }: { clips: { label: string; video: HeroVideoSource }[]; every?: number }) {
  const [current, setCurrent] = useState(0);
  // Clips are shown in order, so everything up to the furthest index reached has been requested already.
  const [reached, setReached] = useState(0);

  useEffect(() => {
    if (clips.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % clips.length;
      setCurrent(index);
      setReached((r) => Math.max(r, index));
    }, every);
    return () => window.clearInterval(timer);
  }, [clips.length, every]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-midnight">
      {clips.map((c, i) => i <= reached && <HeroVideoLayer key={c.label} video={c.video} active={i === current} />)}
      <TextSide />
    </div>
  );
}
