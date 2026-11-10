import type { NextRequest } from "next/server";
import { z } from "zod";
import { LIFECYCLE_STATUSES } from "@/content/types";
import { getProducts, toPublicProduct } from "@/lib/content";

const querySchema = z.object({
  category: z.string().max(80).optional(),
  industry: z.string().max(80).optional(),
  lifecycle: z.enum(LIFECYCLE_STATUSES).optional(),
  query: z.string().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

/** GET /api/products — published products only (Module 04 §5). */
export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return Response.json({ error: "Invalid query", issues: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }
  const { page, pageSize, ...filter } = parsed.data;
  const all = getProducts(filter);
  const items = all.slice((page - 1) * pageSize, page * pageSize).map(toPublicProduct);
  return Response.json({ items, page, pageSize, total: all.length });
}
