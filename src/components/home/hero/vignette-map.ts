/**
 * Product → story-animation mapping. Kept in a plain module (not "use client") so Server
 * Components can read it; values exported from a client module arrive as references.
 */
export type VignetteKind = "agro" | "health" | "crm" | "edu" | "erp" | "logistics" | "finance" | "automation" | "manage";

export const vignetteBySlug: Record<string, VignetteKind> = {
  "medhavya-agro": "agro",
  mediai: "health",
  "medhavya-crm": "crm",
  "medhavya-edusphere": "edu",
  "medhavya-erp": "erp",
  "medhavya-logitrack": "logistics",
  "medhavya-finsight": "finance",
  "medhavya-autoflow": "automation",
  "medhavya-manage": "manage",
};
