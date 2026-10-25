import { NextResponse } from "next/server";
import { seedFeed } from "@/lib/seed";

export async function GET() {
  try {
    return NextResponse.json({ entries: seedFeed() });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
