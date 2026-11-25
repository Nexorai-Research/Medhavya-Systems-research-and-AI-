"use client";

import { useEffect, useRef } from "react";

/**
 * Video layer for a card. Put it first inside a card that is `relative isolate overflow-hidden group`;
 * content that follows paints above it. At rest the video sits paused on a still frame behind a soft white
 * wash; hovering the card lifts the wash and plays it, leaving pauses it. The file is only requested once the
 * card is near the viewport. Touch and reduced-motion visitors keep the still frame and never autoplay.
 * `start` picks the frame (seconds) so cards sharing one clip do not all show the same moment.
 *
 * `reveal="hover"` is for dense grids: nothing is requested or drawn until the card is hovered or focused, then
 * the layer fades in over a dark base (so light text can switch to white at once) and the video fades in when its
 * first frame is ready. Leaving pauses it. Touch visitors never trigger it and the card stays plain.
 */
export function CardHoverVideo({
  src,
  start = 0,
  reveal = "rest",
}: {
  src: string;
  start?: number;
  reveal?: "rest" | "hover";
}) {
  const ref = useHoverPlay(src, start, reveal);
  const onHover = reveal === "hover";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-midnight ${onHover ? "opacity-0 transition-opacity duration-500 ease-out group-focus-visible:opacity-100 group-hover:opacity-100 motion-reduce:hidden [@media(hover:none)]:hidden" : ""}`}
    >
      <video
        ref={ref}
        className={`size-full scale-110 object-cover saturate-110 transition duration-700 ease-out group-hover:scale-100 group-hover:saturate-125 ${onHover ? "opacity-0 data-ready:opacity-100" : ""}`}
        muted
        loop
        playsInline
        preload="none"
        tabIndex={-1}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/30 via-midnight/45 to-midnight/65 transition-opacity duration-700 group-hover:opacity-80" />
    </div>
  );
}

/**
 * Loads card videos one at a time. Several cards often share one clip; requesting it from all of them at once
 * makes Chrome fail one of the requests (MEDIA_ERR_SRC_NOT_SUPPORTED), so each waits for the previous first frame.
 */
let loadQueue: Promise<void> = Promise.resolve();
function enqueueLoad(video: HTMLVideoElement, begin: () => void) {
  loadQueue = loadQueue.then(
    () =>
      new Promise<void>((resolve) => {
        const done = () => {
          window.clearTimeout(timer);
          video.removeEventListener("loadeddata", done);
          video.removeEventListener("error", done);
          resolve();
        };
        const timer = window.setTimeout(done, 6000);
        video.addEventListener("loadeddata", done);
        video.addEventListener("error", done);
        begin();
      }),
  );
}

function useHoverPlay(src: string, start: number, reveal: "rest" | "hover") {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    const card = video?.closest<HTMLElement>(".group");
    if (!video || !card) return;

    // Load lazily, then park on the chosen frame so the card shows a still instead of black.
    let begun = false;
    const begin = () => {
      if (begun) return;
      begun = true;
      video.preload = "auto";
      video.src = src;
      video.addEventListener(
        "loadedmetadata",
        () =>
          (video.currentTime = Number.isFinite(video.duration)
            ? start % video.duration
            : 0),
        { once: true },
      );
    };
    let queued = false;
    const load = () => {
      if (queued) return;
      queued = true;
      enqueueLoad(video, begin);
    };
    // Cards sharing one clip request it together; if one request fails, try that card again a couple of times.
    let retries = 0;
    const retry = () => {
      if (retries++ < 3 && begun)
        window.setTimeout(() => video.load(), 400 * retries);
    };
    video.addEventListener("error", retry);

    // Hover-reveal cards fade their video in once the first frame exists.
    const markReady = () => (video.dataset.ready = "");
    video.addEventListener("loadeddata", markReady);

    // "rest" cards show a still frame, so they load as they near the viewport; "hover" cards wait for hover.
    const io =
      reveal === "rest"
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                // Wait for the window `load` event so loading footage never holds it open.
                if (document.readyState === "complete") load();
                else window.addEventListener("load", load, { once: true });
                io?.disconnect();
              }
            },
            { rootMargin: "300px" },
          )
        : null;
    io?.observe(card);

    const canPlay = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    const play = () => {
      if (!canPlay) return;
      begin(); // hovered before its turn in the queue: load now
      void video.play().catch(() => {});
    };
    // Keyboard focus only (:focus-visible), matching the CSS that turns the card text white.
    const focusPlay = () => {
      if (card.matches(":focus-visible")) play();
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") play();
    };
    const leave = () => video.pause();
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    if (reveal === "hover") {
      card.addEventListener("focusin", focusPlay);
      card.addEventListener("focusout", leave);
    }
    return () => {
      io?.disconnect();
      window.removeEventListener("load", load);
      video.removeEventListener("error", retry);
      video.removeEventListener("loadeddata", markReady);
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      card.removeEventListener("focusin", focusPlay);
      card.removeEventListener("focusout", leave);
    };
  }, [src, start, reveal]);
  return ref;
}
