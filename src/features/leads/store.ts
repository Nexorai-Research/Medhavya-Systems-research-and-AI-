import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { mkdir, appendFile, readFile } from "node:fs/promises";
import path from "node:path";
import { env } from "@/lib/env";
import type { LeadInput } from "./schema";

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Disqualified" | "Converted";

export interface LeadRecord extends Omit<LeadInput, "website" | "privacyAcknowledged"> {
  reference: string;
  status: LeadStatus;
  assignedTo: string | null;
  consent: { privacyAcknowledgedAt: string; marketingOptIn: boolean };
  fingerprint: string;
  createdAt: string;
  updatedAt: string;
}

/** Storage port for leads. Replace with the Payload/PostgreSQL adapter in Phase 6. */
export interface LeadRepository {
  findRecentByFingerprint(fingerprint: string, sinceMs: number): Promise<LeadRecord | undefined>;
  create(record: LeadRecord): Promise<void>;
}

/** Local development adapter: newline-delimited JSON under LEAD_STORE_DIR (git-ignored). */
export class FileLeadRepository implements LeadRepository {
  constructor(private readonly dir: string) {}

  private get file() {
    return path.join(this.dir, "leads.ndjson");
  }

  async findRecentByFingerprint(fingerprint: string, sinceMs: number) {
    let raw: string;
    try {
      raw = await readFile(this.file, "utf8");
    } catch {
      return undefined;
    }
    const cutoff = Date.now() - sinceMs;
    return raw
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as LeadRecord)
      .find((r) => r.fingerprint === fingerprint && Date.parse(r.createdAt) >= cutoff);
  }

  async create(record: LeadRecord) {
    await mkdir(this.dir, { recursive: true });
    await appendFile(this.file, JSON.stringify(record) + "\n", "utf8");
  }
}

let repo: LeadRepository | undefined;
export function leadRepository(): LeadRepository {
  repo ??= new FileLeadRepository(path.resolve(/* turbopackIgnore: true */ process.cwd(), env().LEAD_STORE_DIR));
  return repo;
}

/** Identifies duplicate submissions without storing anything reversible beyond the record itself. */
export function leadFingerprint(input: Pick<LeadInput, "email" | "enquiryType" | "message">) {
  return createHash("sha256").update(`${input.email}\u0000${input.enquiryType}\u0000${input.message}`).digest("hex");
}

/** Opaque, non-sequential reference shown to the visitor. */
export function newLeadReference() {
  return `MS-${randomBytes(5).toString("hex").toUpperCase()}`;
}
