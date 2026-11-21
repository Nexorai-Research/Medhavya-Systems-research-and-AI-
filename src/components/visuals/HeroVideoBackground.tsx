/**
 * Full-bleed looping video behind a hero section.
 * Place inside a `relative overflow-hidden` section; content above it needs `relative`.
 * Muted + playsInline so autoplay is allowed on mobile; hidden for reduced-motion users.
 * A light scrim keeps the dark hero text readable over any frame.
 */
export function HeroVideoBackground({ src }: { src: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <video className="absolute inset-0 size-full object-cover motion-reduce:hidden" src={src} autoPlay muted loop playsInline preload="metadata" tabIndex={-1} />
      <div className="absolute inset-0 bg-canvas/35 sm:bg-gradient-to-r sm:from-canvas/60 sm:via-canvas/20 sm:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-canvas/70 to-transparent" />
    </div>
  );
}
