import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Demonstration } from "@/types/proofpulse";

function loadSynthetic(): { name: string; text: string }[] {
  const dir = join(process.cwd(), "data", "synthetic-proof");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".txt"))
    .map((f) => ({
      name: f,
      text: readFileSync(join(dir, f), "utf8"),
    }));
}

function parseCsvish(text: string): Record<string, string>[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const rows: Record<string, string>[] = [];
  for (const line of lines) {
    if (!line.includes(",")) continue;
    const parts = line.split(",").map((p) => p.trim());
    if (parts.length < 2) continue;
    if (/^metric$/i.test(parts[0])) continue;
    rows.push({
      metric: parts[0],
      value: parts[1] || "",
      unit: parts[2] || "",
    });
  }
  return rows;
}

export function runDocumentConsolidation(input: {
  companyName: string;
  opportunityId?: string | null;
  publicDocTexts?: { name: string; text: string }[];
  forceSynthetic?: boolean;
}): Demonstration {
  const publicDocs = (input.publicDocTexts || []).filter(
    (d) => d.text && d.text.trim().length > 40
  );
  const useSynthetic = input.forceSynthetic || publicDocs.length === 0;
  const docs = useSynthetic ? loadSynthetic() : publicDocs;

  const allRows = docs.flatMap((d) => parseCsvish(d.text));
  const byMetric = new Map<string, string[]>();
  for (const row of allRows) {
    const key = row.metric || "unknown";
    const list = byMetric.get(key) || [];
    list.push(row.value);
    byMetric.set(key, list);
  }

  const consolidated = [...byMetric.entries()].map(([metric, values]) => ({
    metric,
    values: values.join(" | "),
    sources: String(values.length),
  }));

  return {
    id: `proof-${Date.now()}`,
    opportunityId: input.opportunityId || null,
    type: "document-consolidation",
    inputSource: useSynthetic ? "synthetic-fallback" : "company-public",
    inputs: docs.map((d) => ({
      name: d.name,
      excerpt: d.text.slice(0, 280),
    })),
    output: {
      tablesExtracted: docs.length,
      rows: consolidated.slice(0, 20),
      summary: useSynthetic
        ? `Synthetic consolidation for ${input.companyName}: merged ${docs.length} sample ops reports into ${consolidated.length} metric rows.`
        : `Consolidated ${docs.length} public/text inputs for ${input.companyName} into ${consolidated.length} structured metric rows.`,
    },
    limitations: [
      useSynthetic
        ? "Inputs are synthetic demo data — not the prospect's private files."
        : "Public/text excerpts only; binary PDFs may be incomplete.",
      "No access to internal ERP/CRM systems.",
      "Manual review still required before operational use.",
      "Estimates of savings are separate from this proof output.",
    ],
    status: "complete",
  };
}
