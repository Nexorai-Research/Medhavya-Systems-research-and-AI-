import { describe, expect, it } from "vitest";
import { hasRole } from "@/cms/access";
import { categoryFromDoc, categoryToDoc, industryFromDoc, industryToDoc, productFromDoc, productToDoc, resourceFromDoc, resourceToDoc } from "@/cms/mappers";
import { enforcePublicationWorkflow } from "@/cms/workflow";
import { categories } from "@/content/categories";
import { industries } from "@/content/industries";
import { products } from "@/content/products";
import { resources } from "@/content/resources";

type HookArgs = Parameters<typeof enforcePublicationWorkflow>[0];
const run = (roles: string[] | null, operation: "create" | "update", next: string | undefined, prev?: string) =>
  enforcePublicationWorkflow({
    data: next ? { publication: next } : {},
    originalDoc: prev ? { publication: prev } : undefined,
    operation,
    req: { user: roles ? { roles } : undefined },
  } as unknown as HookArgs);

describe("publication workflow", () => {
  it("lets scripts without a user and admins make any transition", () => {
    expect(() => run(null, "create", "Published")).not.toThrow();
    expect(() => run(["content-admin"], "update", "Published", "Draft")).not.toThrow();
    expect(() => run(["super-admin"], "update", "Archived", "Published")).not.toThrow();
  });

  it("limits editors to Draft and In Review, and keeps live records out of reach", () => {
    expect(() => run(["editor"], "create", "Draft")).not.toThrow();
    expect(() => run(["editor"], "update", "In Review", "Draft")).not.toThrow();
    expect(() => run(["editor"], "create", "Published")).toThrow();
    expect(() => run(["editor"], "update", "Published", "In Review")).toThrow();
    expect(() => run(["editor"], "update", undefined, "Published")).toThrow();
  });

  it("lets reviewers approve or send back only records that are In Review", () => {
    expect(() => run(["reviewer"], "update", "Published", "In Review")).not.toThrow();
    expect(() => run(["reviewer"], "update", "Draft", "In Review")).not.toThrow();
    expect(() => run(["reviewer"], "update", "Published", "Draft")).toThrow();
    expect(() => run(["reviewer"], "update", "Archived", "In Review")).toThrow();
  });

  it("denies roles without content permissions", () => {
    expect(() => run(["sales"], "update", "Published", "Draft")).toThrow();
    expect(() => run(["analyst"], "create", "Draft")).toThrow();
  });
});

describe("roles", () => {
  it("reads roles defensively", () => {
    expect(hasRole({ roles: ["sales"] }, "sales")).toBe(true);
    expect(hasRole({ roles: ["sales"] }, "super-admin")).toBe(false);
    expect(hasRole(undefined, "sales")).toBe(false);
    expect(hasRole({ roles: null }, "sales")).toBe(false);
  });
});

describe("CMS document mapping", () => {
  const withIds = (rows: object[]) => rows.map((r, i) => ({ id: `row${i}`, ...r }));

  it("round-trips products, categories, industries and resources without loss", () => {
    const json = (v: unknown) => JSON.parse(JSON.stringify(v));
    for (const p of products) {
      const doc = { ...productToDoc(p), features: withIds(p.features), faqs: withIds(p.faqs), useCases: withIds(p.useCases) };
      expect(productFromDoc(doc)).toEqual(json(p));
    }
    for (const c of categories) expect(categoryFromDoc(categoryToDoc(c))).toEqual(c);
    for (const i of industries) expect(industryFromDoc(industryToDoc(i))).toEqual(i);
    for (const r of resources) expect(resourceFromDoc({ ...resourceToDoc(r), body: withIds(r.body) })).toEqual(json(r));
  });
});
