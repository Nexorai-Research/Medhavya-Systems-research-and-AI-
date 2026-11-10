import type { Metadata } from "next";
import { site } from "@/content/site";

/** Builds consistent page metadata with a canonical path (Module 03 §8). */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      images: [{ url: "/brand/medhavya-logo-full.png", width: 960, alt: site.name }],
    },
  };
}
