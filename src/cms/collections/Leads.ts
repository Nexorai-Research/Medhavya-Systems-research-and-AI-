import type { CollectionConfig, FieldAccess } from "payload";
import { ENQUIRY_TYPES } from "../../features/leads/schema";
import { hasRole } from "../access";

/** Analysts see pipeline metrics, not people: personal fields are hidden from them. */
const notAnalystOnly: FieldAccess = ({ req }) => hasRole(req.user, "super-admin", "sales");

export const Leads: CollectionConfig = {
  slug: "leads",
  labels: { singular: "Lead", plural: "Leads" },
  admin: { useAsTitle: "reference", defaultColumns: ["reference", "enquiryType", "status", "assignedTo", "createdAt"], group: "Sales" },
  access: {
    // Public submissions go through the validated /api/leads route using the local API, never through REST.
    create: () => false,
    read: ({ req }) => hasRole(req.user, "super-admin", "sales", "analyst"),
    update: ({ req }) => hasRole(req.user, "super-admin", "sales"),
    delete: ({ req }) => hasRole(req.user, "super-admin"),
  },
  fields: [
    { name: "reference", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: "status", type: "select", required: true, defaultValue: "New", index: true, options: ["New", "Contacted", "Qualified", "Disqualified", "Converted"] },
    { name: "assignedTo", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
    { name: "enquiryType", type: "select", required: true, index: true, options: [...ENQUIRY_TYPES], admin: { readOnly: true } },
    { name: "name", type: "text", required: true, access: { read: notAnalystOnly }, admin: { readOnly: true } },
    { name: "email", type: "email", required: true, access: { read: notAnalystOnly }, admin: { readOnly: true } },
    { name: "phone", type: "text", access: { read: notAnalystOnly }, admin: { readOnly: true } },
    { name: "countryCode", type: "text", admin: { readOnly: true } },
    { name: "organization", type: "text", access: { read: notAnalystOnly }, admin: { readOnly: true } },
    { name: "message", type: "textarea", required: true, access: { read: notAnalystOnly }, admin: { readOnly: true } },
    { name: "productSlug", type: "text", index: true, admin: { readOnly: true } },
    { name: "categorySlug", type: "text", index: true, admin: { readOnly: true } },
    { name: "preferredContactTime", type: "text", access: { read: notAnalystOnly }, admin: { readOnly: true } },
    { name: "source", type: "text", admin: { readOnly: true } },
    { name: "campaign", type: "text", admin: { readOnly: true } },
    {
      name: "consent",
      type: "group",
      admin: { readOnly: true },
      fields: [
        { name: "privacyAcknowledgedAt", type: "date", required: true },
        { name: "marketingOptIn", type: "checkbox", defaultValue: false },
      ],
    },
    { name: "fingerprint", type: "text", required: true, index: true, access: { read: () => false }, admin: { hidden: true } },
    { name: "internalNotes", type: "textarea", access: { read: notAnalystOnly, update: notAnalystOnly, create: notAnalystOnly } },
  ],
};
