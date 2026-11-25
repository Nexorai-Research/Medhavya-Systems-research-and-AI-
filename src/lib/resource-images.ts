/**
 * Cover photos for the articles, by resource slug, plus the accent colours for each article type.
 * Photos are free-licence images from Pexels showing Indian settings (Mumbai, an Indian office and school, a clinic).
 * An article with no entry simply renders without a cover.
 */
export const resourceImages: Record<string, { cover: string; position?: string; inline?: string }> = {
  "reviewable-ai-in-operations": { cover: "/images/resources/reviewable-ai.jpg", position: "60% 40%" },
  "phased-delivery-for-enterprise-software": { cover: "/images/resources/phased-delivery.jpg", position: "50% 40%" },
  "privacy-first-product-design": {
    cover: "/images/resources/privacy-first.jpg",
    position: "50% 45%",
    inline: "/images/resources/privacy-clinic.jpg",
  },
};

/** Full class names so Tailwind keeps them. */
export const typeStyles: Record<string, { badge: string; bar: string }> = {
  Insight: { badge: "bg-violet-100 text-violet-800", bar: "from-violet-500 to-fuchsia-400" },
  Guide: { badge: "bg-emerald-100 text-emerald-800", bar: "from-emerald-500 to-teal-400" },
  Article: { badge: "bg-amber-100 text-amber-800", bar: "from-amber-500 to-orange-400" },
};
