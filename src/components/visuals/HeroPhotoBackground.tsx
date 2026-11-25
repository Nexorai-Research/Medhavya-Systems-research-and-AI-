import Image from "next/image";

/**
 * Full-bleed photo behind a hero section (use as PageHero `background`). A dark base plus a left-weighted shade keeps
 * white copy clearly readable over any photo, while the right side (where the visual sits) stays bright. The slow
 * drift is CSS and is disabled for prefers-reduced-motion. The file is served as-is (already sized and compressed),
 * so it needs no image-optimiser at the edge.
 */
export function HeroPhotoBackground({ src, position = "center" }: { src: string; position?: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-midnight">
      <div className="hero-video-drift absolute inset-0">
        <Image src={src} alt="" fill priority unoptimized sizes="100vw" className="object-cover" style={{ objectPosition: position }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />
    </div>
  );
}
