import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { register } from "node:module";

// Load .env
try {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
} catch {}

const { generateProofPack } = await import("../lib/generate-pack.ts").catch(
  async () => {
    // Fallback: use compiled path via next isn't available; use dynamic tsx loader
    throw new Error("import failed");
  }
);

const pack = await generateProofPack(process.argv[2] || "kone.com");
console.log(
  JSON.stringify(
    {
      status: pack.status,
      company: pack.company?.name,
      signals: pack.signals.length,
      opps: pack.opportunities.map((o) => ({
        rank: o.rank,
        title: o.title,
        conf: o.confidence,
        sigs: o.signalIds.length,
      })),
      drafts: pack.drafts.map((d) => d.channel),
      gaps: pack.gaps.slice(0, 4),
    },
    null,
    2
  )
);
