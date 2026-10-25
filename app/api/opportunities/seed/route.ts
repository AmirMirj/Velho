import { NextResponse } from "next/server";
import { loadSeedRecords } from "@/lib/seed";

export async function GET() {
  try {
    return NextResponse.json({ records: loadSeedRecords() });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
