import { NextResponse } from "next/server";
import { GenerateAuditRequestSchema } from "@/lib/schemas";
import { generateAuditPack } from "@/lib/generate-audit";

export const maxDuration = 120;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = GenerateAuditRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input: provide { input: string } (1–500 chars)" },
      { status: 400 }
    );
  }

  try {
    const pack = await generateAuditPack(parsed.data.input);
    const httpStatus =
      pack.status === "error" && !pack.company ? 502 : 200;
    return NextResponse.json(pack, { status: httpStatus });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("GROQ_API_KEY") || message.includes("OPENROUTER_API_KEY")) {
      return NextResponse.json(
        {
          status: "error",
          mode: "aggressive-auditor",
          company: null,
          signals: [],
          leaks: [],
          drafts: [],
          gaps: [message],
          generatedAt: new Date().toISOString(),
          warnings: [],
        },
        { status: 502 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
