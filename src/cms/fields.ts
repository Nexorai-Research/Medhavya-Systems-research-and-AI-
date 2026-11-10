import type { Field, Option } from "payload";
import { PUBLICATION_STATES } from "../content/types";

export const publicationField: Field = {
  name: "publication",
  type: "select",
  required: true,
  defaultValue: "Draft",
  index: true,
  options: PUBLICATION_STATES.map((s) => ({ label: s, value: s })) as Option[],
  admin: { position: "sidebar", description: "Only “Published” records appear on the public website." },
};

export const seoField: Field = {
  name: "seo",
  type: "group",
  fields: [
    { name: "title", type: "text", required: true, maxLength: 70 },
    { name: "description", type: "textarea", required: true, maxLength: 200 },
  ],
};

export const slugField: Field = {
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  validate: (v: unknown) => (typeof v === "string" && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v) ? true : "Use lowercase letters, numbers and single hyphens"),
  admin: { position: "sidebar" },
};

export const list = (name: string, label?: string): Field => ({ name, label, type: "text", hasMany: true });
