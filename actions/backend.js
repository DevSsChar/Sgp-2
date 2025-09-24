#!/usr/bin/env node
// Crawl → Render (Puppeteer) → Axe → JSON → Save (MongoDB)
// Usage (PowerShell):
//   npm run scan -- --url https://example.com --max-pages 50 --delay 1000 --json ./.scan-out
//   --concurrency 2 --include "*/docs/*" --exclude "*/privacy/*" --wait-ms 4000 --wait-until networkidle --timeout-ms 45000

const fs = require("fs");
const path = require("path");
const { connect, close } = require("./lib/db");
const { crawl } = require("./lib/crawler");
const { createBrowser, withPage, renderAndGetLinks, runAxe } = require("./lib/scanner");
const { buildPageDoc, buildSummary } = require("./lib/reporter");
const ScanReport = require("../models/scanReport");
const { randomBytes } = require("crypto");

function getArg(name, def) {
  const argv = process.argv;
  const i = argv.findIndex((a) => a === name || a.startsWith(`${name}=`));
  if (i === -1) return def;
  const eq = argv[i].indexOf("=");
  if (eq !== -1) return argv[i].slice(eq + 1);
  const nxt = argv[i + 1];
  if (!nxt || nxt.startsWith("--")) return true;
  return nxt;
}

(async function main() {
  const startUrl = String(getArg("--url", "")).trim();
  if (!startUrl) {
    console.error("--url is required");
    process.exit(1);
  }

  const maxPages = Number(getArg("--max-pages", 50));
  const delay = Math.max(250, Number(getArg("--delay", 1000)));
  const include = String(getArg("--include", ""));
  const exclude = String(getArg("--exclude", ""));
  const sameOrigin = getArg("--same-origin", "true") !== "false";
  const respectRobots = getArg("--no-robots", "false") !== "true";
  const concurrency = Math.max(1, Number(getArg("--concurrency", 2)));
  const waitUntil = String(getArg("--wait-until", "networkidle2"));
  const waitMs = Number(getArg("--wait-ms", 4000));
  const timeout = Number(getArg("--timeout-ms", 45000));
  const impacts = String(getArg("--impacts", "")).split(",").map(s=>s.trim()).filter(Boolean);
  const rules = String(getArg("--rules", "")).split(",").map(s=>s.trim()).filter(Boolean);
  const disableRules = String(getArg("--disable-rules", "")).split(",").map(s=>s.trim()).filter(Boolean);
  const includeIncomplete = getArg("--include-incomplete", "true") !== "false";
  const jsonOut = String(getArg("--json", "")).trim();
  const userId = String(getArg("--user-id", "")).trim() || undefined;
  const reportId = `scan_${Date.now()}_${randomBytes(4).toString("hex")}`;

  await connect();
  const browser = await createBrowser({ headless: false });

  async function enqueueRenderedLinks(url) {
    return withPage(browser, async (page) => {
      try {
        return await renderAndGetLinks(page, url, { waitUntil, waitMs, timeout });
      } catch {
        return [];
      }
    });
  }

  console.log(`[crawl] starting ${startUrl}`);
  const t0 = Date.now();
  const urls = await crawl({ startUrl, maxPages, include, exclude, sameOrigin, respectRobots, enqueueRenderedLinks });
  console.log(`[crawl] discovered ${urls.length} page(s)`);

  const pageDocs = [];
  // simple worker pool
  async function worker(iter) {
    while (urls.length) {
      const url = urls.shift();
      try {
  const axe = await withPage(browser, async (page) => {
          // Render before axe
          await renderAndGetLinks(page, url, { waitUntil, waitMs, timeout });
          return await runAxe(page, { rules, disableRules, impacts });
        });
  const pageDoc = buildPageDoc(url, axe, includeIncomplete);
  pageDocs.push(pageDoc);
      } catch (e) {
        console.warn(`[scan] ${url} failed: ${e.message}`);
        // Add a failed page entry instead of skipping entirely
        const { buildFailedPageDoc } = require("./lib/reporter");
        pageDocs.push(buildFailedPageDoc(url, e.message));
      }
      if (delay) await new Promise((r) => setTimeout(r, delay));
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, urls.length || 1) }, (_, i) => worker(i));
  await Promise.all(workers);
  await browser.close().catch(()=>{});

  // Aggregate and save a single report document
  const summary = buildSummary(pageDocs);
  const reportDoc = await ScanReport.create({
    reportId,
    user: userId,
    baseUrl: startUrl,
    startedAt: new Date(),
    finishedAt: new Date(),
    pages: pageDocs,
    summary,
  });

  // Build simple summary JSON

  if (jsonOut) {
    const outDir = path.isAbsolute(jsonOut) ? jsonOut : path.resolve(process.cwd(), jsonOut);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "a11y-report.json"), JSON.stringify(reportDoc.toObject ? reportDoc.toObject() : reportDoc, null, 2));
    fs.writeFileSync(path.join(outDir, "a11y-summary.json"), JSON.stringify(summary, null, 2));
    console.log(`[json] written to ${outDir}`);
  }

  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[done] reportId=${reportId} pages=${pageDocs.length} in ${dt}s`);
  await close();
  process.exit(0);
})().catch(async (e) => {
  console.error(e);
  await close();
  process.exit(1);
});
