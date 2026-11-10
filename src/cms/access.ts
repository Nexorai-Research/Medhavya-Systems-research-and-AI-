import type { Access, FieldAccess, Where } from "payload";

export const ROLES = ["super-admin", "content-admin", "editor", "reviewer", "sales", "analyst"] as const;
export type Role = (typeof ROLES)[number];

type MaybeUser = object | null | undefined;

export const rolesOf = (user: MaybeUser): string[] => {
  const roles = (user as { roles?: unknown } | null | undefined)?.roles;
  return Array.isArray(roles) ? (roles as string[]) : [];
};
export const hasRole = (user: MaybeUser, ...roles: Role[]) => rolesOf(user).some((r) => (roles as string[]).includes(r));

export const isSuperAdmin = (user: MaybeUser) => hasRole(user, "super-admin");
/** Staff who may see content collections in the admin. */
export const isContentStaff = (user: MaybeUser) => hasRole(user, "super-admin", "content-admin", "editor", "reviewer");

export const contentAccess = {
  read: (({ req }) => isContentStaff(req.user)) as Access,
  create: (({ req }) => hasRole(req.user, "super-admin", "content-admin", "editor")) as Access,
  update: (({ req }): boolean | Where => {
    const u = req.user;
    if (hasRole(u, "super-admin", "content-admin")) return true;
    // Editors may change only records that are not live; reviewers only records waiting for review.
    if (hasRole(u, "editor")) return { publication: { in: ["Draft", "In Review"] } };
    if (hasRole(u, "reviewer")) return { publication: { equals: "In Review" } };
    return false;
  }) as Access,
  delete: (({ req }) => hasRole(req.user, "super-admin", "content-admin")) as Access,
};

export const superAdminOnly: Access = ({ req }) => isSuperAdmin(req.user);
export const superAdminField: FieldAccess = ({ req }) => isSuperAdmin(req.user);
