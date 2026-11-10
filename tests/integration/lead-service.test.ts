import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitLead } from "@/features/leads/service";
import { FileLeadRepository } from "@/features/leads/store";

const valid = {
  name: "Asha Rao",
  email: "asha@example.com",
  enquiryType: "EnterpriseConsultation",
  message: "We need to integrate our ERP with a logistics partner.",
  privacyAcknowledged: true,
};

describe("submitLead (file repository)", () => {
  let dir: string;
  let repo: FileLeadRepository;
  const notifier = { notify: vi.fn(async () => {}) };
  const quiet = () => vi.spyOn(console, "log").mockImplementation(() => {});

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "leads-"));
    repo = new FileLeadRepository(dir);
    notifier.notify.mockClear();
    quiet();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(dir, { recursive: true, force: true });
  });

  const read = async () =>
    (await readFile(path.join(dir, "leads.ndjson"), "utf8").catch(() => ""))
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l));

  it("persists a valid lead with server-controlled fields and notifies", async () => {
    const r = await submitLead(valid, { repo, notifier, requestId: "t1" });
    expect(r.ok).toBe(true);
    const rows = await read();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ status: "New", assignedTo: null, enquiryType: "EnterpriseConsultation" });
    expect(rows[0].reference).toMatch(/^MS-[0-9A-F]{10}$/);
    expect(rows[0].consent.privacyAcknowledgedAt).toBeTruthy();
    expect(notifier.notify).toHaveBeenCalledTimes(1);
  });

  it("returns field errors and stores nothing for invalid input", async () => {
    const r = await submitLead({ ...valid, email: "bad" }, { repo, notifier, requestId: "t2" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.email).toBeTruthy();
    expect(await read()).toHaveLength(0);
  });

  it("de-duplicates repeated submissions and returns the same reference", async () => {
    const a = await submitLead(valid, { repo, notifier, requestId: "t3" });
    const b = await submitLead(valid, { repo, notifier, requestId: "t4" });
    expect(a.ok && b.ok && a.reference === b.reference).toBe(true);
    expect(await read()).toHaveLength(1);
  });

  it("silently drops honeypot submissions", async () => {
    const r = await submitLead({ ...valid, website: "http://spam.example" }, { repo, notifier, requestId: "t5" });
    expect(r.ok).toBe(true);
    expect(await read()).toHaveLength(0);
    expect(notifier.notify).not.toHaveBeenCalled();
  });

  it("keeps the lead when notification fails", async () => {
    const failing = { notify: vi.fn(async () => Promise.reject(new Error("smtp down"))) };
    const r = await submitLead(valid, { repo, notifier: failing, requestId: "t6" });
    expect(r.ok).toBe(true);
    expect(await read()).toHaveLength(1);
  });

  it("never writes personal data to logs", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await submitLead(valid, { repo, notifier, requestId: "t7" });
    const output = spy.mock.calls.flat().join("\n");
    expect(output).not.toContain(valid.email);
    expect(output).not.toContain(valid.name);
    expect(output).not.toContain(valid.message);
  });
});
