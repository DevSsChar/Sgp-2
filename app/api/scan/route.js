import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const baseUrl = String(body?.url || "").trim();
    if (!/^https?:\/\//i.test(baseUrl)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

  const session = await getServerSession(authOptions);
    const userId = session?.user?.id || session?.user?._id || null;

  // Import CommonJS libs statically so bundling doesn't complain about dynamic expressions
  const db = require("../../../actions/lib/db.js");
  const crawler = require("../../../actions/lib/crawler.js");
  const scanner = require("../../../actions/lib/scanner.js");
  const reporter = require("../../../actions/lib/reporter.js");
  const ScanReport = require("../../../models/scanReport.js");
  const { default: User } = await import("../../../models/user.js");

    await db.connect();

    const maxPages = Math.max(1, Number(body?.maxPages ?? 30));
    const delayMs = Math.max(0, Number(body?.delay ?? 800));
    const includePattern = body?.include || "";
    const excludePattern = body?.exclude || "";
    const sameOrigin = body?.sameOrigin ?? true;
    const respectRobots = body?.respectRobots ?? true;
    const waitUntil = body?.waitUntil || "networkidle2";
    const waitMs = Number(body?.waitMs ?? 4000);
    const timeout = Number(body?.timeoutMs ?? 45000);
    const includeIncomplete = body?.includeIncomplete ?? true;
    const rules = Array.isArray(body?.rules) ? body.rules : undefined;
    const disableRules = Array.isArray(body?.disableRules) ? body.disableRules : undefined;
    const impacts = Array.isArray(body?.impacts) ? body.impacts : undefined;

    const browser = await scanner.createBrowser({ headless: false });

    // Rendered crawl
    const urls = await crawler.crawl({
      startUrl: baseUrl,
      maxPages,
      include: includePattern,
      exclude: excludePattern,
      sameOrigin,
      respectRobots,
      enqueueRenderedLinks: async (url) => {
        return scanner.withPage(browser, (page) => scanner.renderAndGetLinks(page, url, { waitUntil, waitMs, timeout }));
      },
    });

    // Scan
    const pageDocs = [];
    const page = await browser.newPage();
    for (const url of urls) {
      try {
        await scanner.renderAndGetLinks(page, url, { waitUntil, waitMs, timeout });
        const axe = await scanner.runAxe(page, { rules, disableRules, impacts });
        pageDocs.push(reporter.buildPageDoc(url, axe, includeIncomplete));
        if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
      } catch (e) {
        // continue
      }
    }
    await page.close().catch(() => {});
    await browser.close().catch(() => {});

    const summary = reporter.buildSummary(pageDocs);
    const reportId = `scan_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

    const doc = await ScanReport.create({
      reportId,
      user: userId || undefined,
      baseUrl,
      startedAt: new Date(),
      finishedAt: new Date(),
      pages: pageDocs,
      summary,
    });

    // maintain user counters if available
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $set: { latestScan: doc._id },
        $inc: { scansCount: 1 },
      }).catch(() => {});
    }

    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Scan failed" }, { status: 500 });
  }
}
