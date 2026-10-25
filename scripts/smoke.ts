import { readFileSync } from "node:fs";
import { seedFeed } from "../lib/seed";
import { runDocumentConsolidation } from "../lib/proof-consolidate";

try {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) {
      process.env[m[1].trim()] = m[2].trim();
    }
  }
} catch {
  /* no .env */
}

async function main() {
  const feed = seedFeed();
  const proof = runDocumentConsolidation({
    companyName: "Demo",
    forceSynthetic: true,
  });
  console.log(
    JSON.stringify(
      {
        feedCount: feed.length,
        top: feed.slice(0, 3).map((e) => ({
          name: e.companyName,
          score: e.score,
          action: e.recommendedAction,
        })),
        proof: {
          source: proof.inputSource,
          rows: proof.output.rows.length,
          status: proof.status,
        },
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
