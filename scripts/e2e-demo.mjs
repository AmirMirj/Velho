#!/usr/bin/env node
// End-to-end check for the interactive demo (feature 005).
// Usage: DEMO_URL=http://127.0.0.1:3002/demo node scripts/e2e-demo.mjs
// Needs `playwright` or `playwright-core` resolvable, or PLAYWRIGHT_CORE=/path/to/playwright-core.
// Optional: CHROME_PATH=/path/to/chrome (falls back to Playwright's bundled browser).
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
function loadPlaywright() {
  for (const id of [process.env.PLAYWRIGHT_CORE, "playwright", "playwright-core"].filter(Boolean)) {
    try {
      return require(id);
    } catch {}
  }
  console.error("Playwright not found. Install it (npm i -D playwright) or set PLAYWRIGHT_CORE.");
  process.exit(2);
}

const { chromium } = loadPlaywright();
const URL = process.env.DEMO_URL ?? "http://127.0.0.1:3002/demo";
let failures = 0;
const check = (ok, msg) => {
  console.log(`${ok ? "✓" : "✗"} ${msg}`);
  if (!ok) failures++;
};

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--no-sandbox"],
});

async function fresh(viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(URL, { waitUntil: "networkidle" });
  return page;
}
const bar = (page) => page.getByRole("region", { name: "Next action" });
const primaryCount = (page) => bar(page).locator("button:not(:has-text('Play guided demo'))").count();

// 1. Guided tour only → recap
{
  const page = await fresh({ width: 1280, height: 800 });
  await page.getByRole("button", { name: /Play guided demo/ }).click();
  let steps = 0;
  for (; steps < 10; steps++) {
    const card = page.getByRole("dialog");
    if (!(await card.count())) break;
    await card.getByRole("button", { name: /Next: do it|Finish/ }).click();
    await page.waitForTimeout(300);
  }
  check(steps === 7, `guided tour has 7 steps (got ${steps})`);
  check((await page.getByText("Run again").count()) > 0, "tour ends on recap");
  await page.close();
}

// 2. Manual run with keyboard → one primary action per state
{
  const page = await fresh({ width: 1280, height: 800 });
  const labels = [];
  for (let i = 0; i < 6; i++) {
    check((await primaryCount(page)) === 1, `state ${i}: exactly one primary action`);
    labels.push(await bar(page).locator("button").last().innerText());
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(300);
  }
  check((await page.getByText("Run again").count()) > 0, "ArrowRight reaches recap");
  check(new Set(labels).size === labels.length, `primary label changes each step (${labels.join(" | ")})`);
  await page.close();
}

// 3. Escape exits the tour
{
  const page = await fresh({ width: 1280, height: 800 });
  await page.getByRole("button", { name: /Play guided demo/ }).click();
  check((await page.getByRole("dialog").count()) === 1, "coach card opens");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  check((await page.getByRole("dialog").count()) === 0, "Escape closes coach card");
  await page.close();
}

// 4. Narrow screen: no horizontal overflow, action bar visible
{
  const page = await fresh({ width: 390, height: 844 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  check(!overflow, "390px: no horizontal overflow");
  check(await bar(page).isVisible(), "390px: action bar visible");
  await page.close();
}

// 5. Workspace feed rows: all text lines share one left edge (score in its own column)
{
  const page = await browser.newPage({ viewport: { width: 540, height: 900 } });
  await page.goto(new globalThis.URL("/", URL).href, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const edges = await page.$$eval(".opp-row", (rows) =>
    rows.flatMap((r) =>
      [...r.children].filter((c) => !c.classList.contains("rank")).map((c) => Math.round(c.getBoundingClientRect().left)),
    ),
  );
  check(edges.length === 0 || new Set(edges).size === 1, `workspace feed text aligned (${new Set(edges).size} left edge(s))`);
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : "\nAll e2e checks passed");
process.exit(failures ? 1 : 0);
