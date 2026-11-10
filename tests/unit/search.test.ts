import { describe, expect, it } from "vitest";
import { searchEntries } from "@/lib/search";
import { buildSearchIndex } from "@/lib/search-index";

const index = buildSearchIndex();

describe("searchEntries", () => {
  it("returns nothing for an empty query", () => {
    expect(searchEntries(index, "   ")).toEqual([]);
  });

  it("ranks an exact title match first", () => {
    const hits = searchEntries(index, "MediAI");
    expect(hits[0]?.title).toBe("MediAI");
  });

  it("requires every term to match", () => {
    expect(searchEntries(index, "crm zzzzunknown")).toEqual([]);
  });

  it("finds services added to the catalogue", () => {
    expect(searchEntries(index, "devops").some((h) => h.kind === "Service")).toBe(true);
  });

  it("never exposes unpublished drafts", () => {
    expect(searchEntries(index, "HRMS").some((h) => h.title === "Medhavya HRMS")).toBe(false);
  });
});
