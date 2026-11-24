/**
 * Background clips for hero sections, keyed by product slug. `hd` is Full HD (the default); `uhd` is a 4K (or
 * QHD where no 4K exists) master that is only fetched on very large, fast displays — see HeroVideoLayer.
 *
 * Source: free-licence footage from Pexels (https://www.pexels.com/license/); Agro360AI uses the supplied clip.
 * Budget: every file stays under 25 MiB, the per-asset limit of the Cloudflare deployment. A clip without a
 * `uhd` has no suitable 4K file under that limit.
 */
export interface HeroVideoSource {
  hd: string;
  uhd?: string;
}

export const heroVideos: Record<string, HeroVideoSource> = {
  "medhavya-agro": { hd: "/videos/agro360ai-hero.mp4" },
  mediai: { hd: "/videos/heroes/mediai-hd.mp4", uhd: "/videos/heroes/mediai-4k.mp4" }, // doctor reading an X-ray
  "medhavya-crm": { hd: "/videos/heroes/crm-hd.mp4" }, // employee presenting ideas
  "medhavya-manage": { hd: "/videos/heroes/manage-hd.mp4" }, // retail market interior
  "medhavya-autoflow": { hd: "/videos/heroes/autoflow-hd.mp4", uhd: "/videos/heroes/autoflow-4k.mp4" }, // industrial robotics
  "medhavya-finsight": { hd: "/videos/heroes/finsight-hd.mp4" }, // financial market charts
  "medhavya-erp": { hd: "/videos/heroes/erp-hd.mp4" }, // skyscraper facade
  "medhavya-edusphere": { hd: "/videos/heroes/edusphere-hd.mp4", uhd: "/videos/heroes/edusphere-4k.mp4" }, // classroom
  "medhavya-logitrack": { hd: "/videos/heroes/logitrack-hd.mp4" }, // shipping containers and trucks
};
