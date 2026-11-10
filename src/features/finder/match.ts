export interface FinderNeed {
  id: string;
  label: string;
  hint: string;
  productSlugs: string[];
  serviceSlugs: string[];
}

export interface FinderSize {
  id: string;
  label: string;
  /** Services added for organisations of this size, with the reason shown to the visitor. */
  extraServiceSlugs: string[];
  note: string;
}

/**
 * Transparent, rule-based mapping from a business need to Medhavya products and services.
 * These are suggestions for a first conversation, not a guarantee of fit.
 */
export const NEEDS: FinderNeed[] = [
  { id: "customers-sales", label: "Manage customers and sales", hint: "Leads, follow-ups, billing and daily reporting", productSlugs: ["medhavya-crm", "medhavya-manage"], serviceSlugs: ["web-application-development"] },
  { id: "operations-finance", label: "Run operations, inventory and finance", hint: "Connected finance, procurement, stock and HR", productSlugs: ["medhavya-erp", "medhavya-manage"], serviceSlugs: ["integration-modernization"] },
  { id: "automate-documents", label: "Automate documents and workflows", hint: "Reduce re-keying with human review built in", productSlugs: ["medhavya-autoflow"], serviceSlugs: ["ai-automation"] },
  { id: "reports-insight", label: "Get better reports and insight", hint: "Analytics, research and risk monitoring", productSlugs: ["medhavya-finsight", "medhavya-erp"], serviceSlugs: ["data-engineering-analytics"] },
  { id: "field-logistics", label: "Coordinate field work, deliveries and logistics", hint: "Dispatch, tracking and field records", productSlugs: ["medhavya-logitrack", "medhavya-agro"], serviceSlugs: ["mobile-application-development"] },
  { id: "custom-build", label: "Build something custom", hint: "A workflow no packaged product fits", productSlugs: [], serviceSlugs: ["custom-software", "web-application-development", "mobile-application-development"] },
  { id: "modernise", label: "Connect or modernise existing systems", hint: "Integration, migration and cloud readiness", productSlugs: [], serviceSlugs: ["integration-modernization", "cloud-devops"] },
  { id: "not-sure", label: "I am not sure yet", hint: "Start with an assessment and a roadmap", productSlugs: [], serviceSlugs: ["consulting-digital-transformation"] },
];

export const SIZES: FinderSize[] = [
  { id: "individual", label: "Individual or professional", extraServiceSlugs: [], note: "Products are usually the faster route; ask us about a demo." },
  { id: "small", label: "Small business or startup", extraServiceSlugs: [], note: "Products are usually the faster route; custom work can follow once the need is clear." },
  { id: "mid", label: "Mid-size organisation", extraServiceSlugs: ["maintenance-support"], note: "Consider ongoing support for anything you adopt." },
  { id: "large", label: "Large enterprise", extraServiceSlugs: ["consulting-digital-transformation", "maintenance-support"], note: "A phased assessment and governance model is recommended before committing to scope." },
  { id: "institution", label: "Government or institution", extraServiceSlugs: ["consulting-digital-transformation", "maintenance-support"], note: "A phased assessment and governance model is recommended before committing to scope." },
];

export interface FinderProduct {
  slug: string;
  name: string;
  summary: string;
  lifecycle: string;
  industries: string[];
}
export interface FinderService {
  slug: string;
  name: string;
  summary: string;
}
export interface FinderIndustry {
  slug: string;
  name: string;
}

export interface FinderInput {
  need?: string;
  industry?: string;
  size?: string;
}

export interface FinderResult {
  products: { product: FinderProduct; reasons: string[]; score: number }[];
  services: { service: FinderService; reason: string }[];
  industry?: FinderIndustry;
  sizeNote?: string;
}

const NEED_WEIGHT = 3;
const INDUSTRY_WEIGHT = 2;

export function findSolutions(
  input: FinderInput,
  data: { products: FinderProduct[]; services: FinderService[]; industries: FinderIndustry[] },
): FinderResult {
  const need = NEEDS.find((n) => n.id === input.need);
  const size = SIZES.find((s) => s.id === input.size);
  const industry = data.industries.find((i) => i.slug === input.industry);

  const products = data.products
    .map((product) => {
      const reasons: string[] = [];
      let score = 0;
      if (need?.productSlugs.includes(product.slug)) {
        score += NEED_WEIGHT;
        reasons.push(`Fits your need: ${need.label.toLowerCase()}`);
      }
      if (industry && product.industries.includes(industry.slug)) {
        score += INDUSTRY_WEIGHT;
        reasons.push(`Relevant to ${industry.name}`);
      }
      return { product, reasons, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));

  const services: FinderResult["services"] = [];
  const addService = (slug: string, reason: string) => {
    const service = data.services.find((s) => s.slug === slug);
    if (service && !services.some((s) => s.service.slug === slug)) services.push({ service, reason });
  };
  need?.serviceSlugs.forEach((slug) => addService(slug, `Supports your need: ${need.label.toLowerCase()}`));
  size?.extraServiceSlugs.forEach((slug) => addService(slug, `Commonly useful for a ${size.label.toLowerCase()}`));

  return { products, services, industry, sizeNote: size?.note };
}
