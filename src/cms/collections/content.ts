import type { CollectionConfig, Field } from "payload";
import { LIFECYCLE_STATUSES } from "../../content/types";
import { contentAccess } from "../access";
import { list, publicationField, seoField, slugField } from "../fields";
import { enforcePublicationWorkflow, triggerRebuild } from "../workflow";

const collection = (slug: string, singular: string, plural: string, useAsTitle: string, fields: Field[], extra: Partial<CollectionConfig> = {}): CollectionConfig => ({
  slug,
  labels: { singular, plural },
  access: contentAccess,
  admin: { useAsTitle, group: "Website content", defaultColumns: [useAsTitle, "slug", "publication", "updatedAt"] },
  versions: { maxPerDoc: 25 }, // revision history for audit and rollback
  hooks: { beforeChange: [enforcePublicationWorkflow], afterChange: [triggerRebuild] },
  fields: [slugField, publicationField, ...fields, seoField],
  ...extra,
});

const options = <T extends readonly string[]>(values: T) => values.map((v) => ({ label: v, value: v }));

export const ProductCategories = collection(
  "product-categories",
  "Product category",
  "Product categories",
  "name",
  [
    { name: "name", type: "text", required: true },
    { name: "shortName", type: "text", required: true },
    { name: "tagline", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    list("context", "Context points"),
    {
      name: "icon",
      type: "select",
      required: true,
      options: options(["agriculture", "retail", "ai", "finance", "enterprise", "education", "healthcare", "other"] as const),
    },
    { name: "displayOrder", type: "number", required: true, defaultValue: 1 },
  ],
  { admin: { useAsTitle: "name", group: "Website content", defaultColumns: ["name", "slug", "displayOrder", "publication"] } },
);

export const Products = collection("products", "Product", "Products", "name", [
  { name: "name", type: "text", required: true },
  { name: "categorySlug", type: "text", required: true, index: true, admin: { description: "Slug of a product category." } },
  { name: "summary", type: "textarea", required: true },
  { name: "description", type: "textarea", required: true },
  { name: "lifecycle", type: "select", required: true, defaultValue: "In Development", options: options(LIFECYCLE_STATUSES) },
  {
    name: "isDemo",
    type: "checkbox",
    defaultValue: true,
    admin: { description: "Leave ticked until founder-approved facts replace the demonstration content." },
  },
  { name: "featured", type: "checkbox", defaultValue: false },
  list("audience"),
  { name: "problem", type: "textarea" },
  list("outcomes"),
  {
    name: "features",
    type: "array",
    fields: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea", required: true },
    ],
  },
  {
    name: "useCases",
    type: "array",
    fields: [{ name: "title", type: "text", required: true }, list("steps")],
  },
  list("industries", "Industry slugs"),
  list("deployment"),
  list("integrations"),
  { name: "support", type: "textarea" },
  {
    name: "faqs",
    type: "array",
    fields: [
      { name: "question", type: "text", required: true },
      { name: "answer", type: "textarea", required: true },
    ],
  },
  { name: "mockup", type: "json", required: true, admin: { description: "Illustrative concept-UI data: { nav, tiles, rows, chart }." } },
  {
    name: "governance",
    type: "group",
    fields: [
      { name: "owner", type: "text", required: true },
      { name: "reviewer", type: "text", required: true },
      { name: "lastReviewed", type: "text", required: true, admin: { description: "ISO date, e.g. 2026-10-31" } },
      { name: "evidenceSource", type: "text", required: true },
    ],
  },
]);

export const Industries = collection("industries", "Industry", "Industries", "name", [
  { name: "name", type: "text", required: true },
  { name: "description", type: "textarea", required: true },
  list("painPoints"),
  list("solutions"),
  list("relatedProducts", "Related product slugs"),
]);

export const EnterpriseServices = collection("enterprise-services", "Enterprise service", "Enterprise services", "name", [
  { name: "name", type: "text", required: true },
  { name: "summary", type: "textarea", required: true },
  list("problems"),
  list("capabilities"),
  list("boundaries"),
  list("deliverables"),
]);

export const Resources = collection("resources", "Resource", "Resources", "title", [
  { name: "title", type: "text", required: true },
  { name: "type", type: "select", required: true, options: options(["Article", "Guide", "Insight"] as const) },
  { name: "author", type: "text", required: true },
  { name: "excerpt", type: "textarea", required: true },
  {
    name: "body",
    type: "array",
    fields: [{ name: "heading", type: "text" }, list("paragraphs")],
  },
  list("tags"),
  { name: "publishedAt", type: "text", required: true, admin: { description: "ISO date, e.g. 2026-10-20" } },
  { name: "readingMinutes", type: "number", required: true, defaultValue: 4 },
  { name: "isDemo", type: "checkbox", defaultValue: true },
]);
