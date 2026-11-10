import { describe, expect, it } from "vitest";
import { MAX_COMPARE, compareHref, parseCompare } from "@/features/compare/shared";

const known = new Set(["a", "b", "c", "d"]);

describe("compare selection", () => {
  it("keeps only known slugs without duplicates", () => {
    expect(parseCompare("a,zzz,a,b", known)).toEqual(["a", "b"]);
  });

  it("caps the selection", () => {
    expect(parseCompare("a,b,c,d", known)).toHaveLength(MAX_COMPARE);
  });

  it("handles a missing query value", () => {
    expect(parseCompare(null, known)).toEqual([]);
  });

  it("builds a stable link", () => {
    expect(compareHref(["a", "b"])).toBe("/compare-products?p=a,b");
    expect(compareHref([])).toBe("/compare-products");
  });
});
