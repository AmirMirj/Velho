import { NextResponse } from "next/server";
import { z } from "zod";
import { investigateCompany } from "@/lib/investigate-company";

const Body = z.object({ input: z.string().min(1).max(500) });

export const maxDuration = 120;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide { input: string }" },
      { status: 400 }
    );
  }
  try {
    const result = await investigateCompany(parsed.data.input);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("GROQ_API_KEY")) {
      return NextResponse.json({ error: message }, { status: 502 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
