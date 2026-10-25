import { NextResponse } from "next/server";
import { z } from "zod";
import { runDocumentConsolidation } from "@/lib/proof-consolidate";

const Body = z.object({
  companyName: z.string().default("Company"),
  opportunityId: z.string().nullable().optional(),
  publicDocTexts: z
    .array(z.object({ name: z.string(), text: z.string() }))
    .optional(),
  forceSynthetic: z.boolean().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  try {
    const demo = runDocumentConsolidation(parsed.data);
    return NextResponse.json(demo);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
