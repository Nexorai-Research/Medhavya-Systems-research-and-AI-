import type { CollectionAfterChangeHook, CollectionBeforeChangeHook } from "payload";
import { APIError } from "payload";
import { hasRole } from "./access";

/**
 * Draft → In Review → Published → Archived workflow (Module 04 §3), enforced on the server
 * so it cannot be bypassed from the API:
 * - Super Admin / Content Admin: any transition.
 * - Editor: can only save as Draft or request review.
 * - Reviewer: can only approve (Published) or send back (Draft) records that are In Review.
 */
export const enforcePublicationWorkflow: CollectionBeforeChangeHook = ({ data, originalDoc, operation, req }) => {
  const user = req.user;
  if (!user) return data; // local API / seed scripts run without a user
  if (hasRole(user, "super-admin", "content-admin")) return data;

  const next = (data?.publication ?? originalDoc?.publication ?? "Draft") as string;
  const prev = operation === "create" ? undefined : (originalDoc?.publication as string | undefined);
  if (next === prev) {
    if (hasRole(user, "editor") && (prev === "Published" || prev === "Archived")) {
      throw new APIError("Published and archived records can only be changed by a Content Admin.", 403);
    }
    return data;
  }
  if (hasRole(user, "editor") && ["Draft", "In Review"].includes(next)) return data;
  if (hasRole(user, "reviewer") && prev === "In Review" && ["Published", "Draft"].includes(next)) return data;
  throw new APIError(`Your role cannot move this record from "${prev ?? "new"}" to "${next}".`, 403);
};

/** Optional: ask the host to rebuild the public site after content changes (static export model). */
export const triggerRebuild: CollectionAfterChangeHook = ({ doc, previousDoc, operation }) => {
  const url = process.env.DEPLOY_HOOK_URL;
  if (!url) return doc;
  const touchesLive = doc?.publication === "Published" || previousDoc?.publication === "Published" || operation === "create";
  if (touchesLive) void fetch(url, { method: "POST" }).catch(() => undefined);
  return doc;
};
