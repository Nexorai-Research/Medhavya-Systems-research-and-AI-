import type { CollectionConfig } from "payload";
import { ROLES, isSuperAdmin, superAdminField } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Staff user", plural: "Staff users" },
  auth: { maxLoginAttempts: 5, lockTime: 10 * 60 * 1000, tokenExpiration: 8 * 60 * 60 },
  admin: { useAsTitle: "email", defaultColumns: ["email", "name", "roles"], group: "Administration" },
  access: {
    admin: ({ req }) => Boolean(req.user),
    read: ({ req }) => (isSuperAdmin(req.user) ? true : req.user ? { id: { equals: req.user.id } } : false),
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => (isSuperAdmin(req.user) ? true : req.user ? { id: { equals: req.user.id } } : false),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  hooks: {
    // The very first account created through /admin becomes the Super Admin.
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === "create" && !req.user) {
          const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true });
          if (totalDocs === 0) return { ...data, roles: ["super-admin"] };
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      defaultValue: ["editor"],
      options: ROLES.map((r) => ({ label: r, value: r })),
      access: {
        create: ({ req }) => !req.user || isSuperAdmin(req.user),
        update: superAdminField,
      },
      admin: { description: "Super Admin · Content Admin · Editor · Reviewer · Sales · Analyst" },
    },
  ],
};
