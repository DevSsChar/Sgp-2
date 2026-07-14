import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createRequire } from "module";
import { buildProgressPayload } from "../../../utils/scanProgress.js";

const require = createRequire(import.meta.url);
export const runtime = "nodejs";

const authSessionModule = require("../../../actions/lib/authSession.js");
const authSessionLib = authSessionModule?.default || authSessionModule;

function getEstablishAuthFn() {
  return authSessionLib?.establishAuth || authSessionLib?.establishAuthWithPlaywright;
}

function scanErrorResponse(errorMessage, statusOverride) {
  const reporter = require("../../../actions/lib/reporter.js");
  const classified = reporter.classifyScanError(errorMessage);
  return NextResponse.json(
    {
      error: classified.message,
      code: classified.code,
      type: classified.type,
    },
    { status: statusOverride ?? classified.status }
  );
}

function validateUrl(url) {
  if (!/^https?:\/\//i.test(url)) {
    return { valid: false, error: "Invalid URL" };
  }
  try {
    const parsed = new URL(url);
    if (!parsed.hostname) {
      return { valid: false, error: "Invalid URL" };
    }
    return { valid: true, url: parsed.toString() };
  } catch {
    return { valid: false, error: "Invalid URL" };
  }
}

function ndjsonResponse(stream) {
  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
    },
  });
}

function sendLine(controller, encoder, obj) {
  controller.enqueue(encoder.encode(`${JSON.stringify(obj)}\n`));
}

function emitProgress(send, phase, ctx = {}) {
  send(buildProgressPayload(phase, ctx));
}

function emitStreamError(send, errorMessage, statusOverride) {
  const reporter = require("../../../actions/lib/reporter.js");
  const classified = reporter.classifyScanError(errorMessage);
  send({
    type: "error",
    error: classified.message,
    originalError: classified.originalError,
    code: classified.code,
    errorType: classified.type,
    status: statusOverride ?? classified.status,
  });
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return scanErrorResponse("Invalid request body", 400);
  }

  const baseUrl = String(body?.url || "").trim();
  const urlCheck = validateUrl(baseUrl);
  if (!urlCheck.valid) {
    return scanErrorResponse(urlCheck.error, 400);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let browser = null;
      const send = (obj) => sendLine(controller, encoder, obj);

      try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || session?.user?._id || null;

        const db = require("../../../actions/lib/db.js");
        const crawler = require("../../../actions/lib/crawler.js");
        const scanner = require("../../../actions/lib/scanner.js");
        const reporter = require("../../../actions/lib/reporter.js");
        const ScanReport = require("../../../models/scanReport.js");
        const { default: User } = await import("../../../models/user.js");

        const maxPages = Math.max(1, Number(body?.maxPages ?? 30));
        const delayMs = Math.max(0, Number(body?.delay ?? 800));
        const includePattern = body?.include || "";
        const excludePattern = body?.exclude || "";
        const sameOrigin = body?.sameOrigin ?? true;
        // Authenticated areas are often disallowed in robots.txt — skip robots when scanning with login.
        const respectRobots = body?.auth?.enabled ? false : (body?.respectRobots ?? true);
        const waitUntil = body?.waitUntil || "networkidle2";
        const waitMs = Number(body?.waitMs ?? 4000);
        const timeout = Number(body?.timeoutMs ?? 45000);
        const includeIncomplete = body?.includeIncomplete ?? true;
        const rules = Array.isArray(body?.rules) ? body.rules : undefined;
        const disableRules = Array.isArray(body?.disableRules) ? body.disableRules : undefined;
        const impacts = Array.isArray(body?.impacts) ? body.impacts : undefined;

        let authConfig = null;
        if (body?.auth?.enabled) {
          const scanAuthStore = require("../../../actions/lib/scanAuthStore.js");
          const ScanAuthProfile = require("../../../models/scanAuthProfile.js");
          try {
            authConfig = await scanAuthStore.resolveScanAuth(
              body.auth,
              urlCheck.url,
              userId,
              ScanAuthProfile
            );
          } catch (authResolveError) {
            emitStreamError(send, authResolveError?.message || "Invalid authentication configuration", 400);
            return;
          }
        }

        emitProgress(send, "validating", { maxPages });

        await db.connect();
        emitProgress(send, "connecting", { maxPages });

        browser = await scanner.createBrowser({ headless: false });
        emitProgress(send, "initializing", { maxPages });

        let sessionData = null;

        if (authConfig) {
          const establishAuthFn = getEstablishAuthFn();
          const scanAuthStore = require("../../../actions/lib/scanAuthStore.js");
          const ScanAuthProfile = require("../../../models/scanAuthProfile.js");
          const authOrigin = authConfig.origin || authSessionLib.getOriginFromUrl(urlCheck.url);

          emitProgress(send, "authenticating", { maxPages });

          try {
            if (typeof establishAuthFn !== "function") {
              throw new Error(
                "Authentication module failed to load. Stop the dev server, delete the .next folder, and run npm run dev again."
              );
            }

            sessionData = await establishAuthFn(urlCheck.url, authConfig, browser);
            // Session method still needs priming; credentials login already happened in this browser.
            if (authConfig.method === "session") {
              await authSessionLib.primeAuthenticatedBrowser(browser, urlCheck.url, sessionData);
            } else if (!browser._authSession) {
              await authSessionLib.primeAuthenticatedBrowser(browser, urlCheck.url, sessionData);
            }

            if (authConfig.saveForReuse && userId) {
              await scanAuthStore.saveAuthProfile(
                ScanAuthProfile,
                userId,
                authOrigin,
                authConfig,
                sessionData
              );
            }
          } catch (authError) {
            await scanAuthStore.markAuthFailure(
              ScanAuthProfile,
              userId,
              authOrigin,
              authError?.message || "Authentication failed"
            );
            await browser.close().catch(() => {});
            browser = null;
            emitStreamError(send, authError?.message || "Authentication failed", 401);
            return;
          }
        }

        emitProgress(send, "crawling", { discovered: 0, maxPages });

        const crawlSeeds = sessionData
          ? authSessionLib.getAuthenticatedSeedUrls(urlCheck.url, sessionData)
          : [urlCheck.url];

        let urls;
        let crawlPage = null;
        try {
          // Prefer one long-lived page for auth crawls so session cookies/storage stay attached.
          if (sessionData) {
            crawlPage = await browser.newPage();
            await crawlPage.setUserAgent(
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
            );
            await crawlPage.setBypassCSP(true);
            if (browser._authLive) {
              // Keep live login cookies untouched; only restore storage for SPAs.
              await crawlPage.goto(authSessionLib.getOriginFromUrl(urlCheck.url), {
                waitUntil: "domcontentloaded",
                timeout: 45000,
              }).catch(() => {});
              await authSessionLib.applyStorage(crawlPage, sessionData);
            } else {
              await authSessionLib.applyBrowserSession(crawlPage, urlCheck.url, sessionData);
            }
          }

          urls = await crawler.crawl({
            startUrl: urlCheck.url,
            startUrls: crawlSeeds,
            maxPages,
            include: includePattern,
            exclude: excludePattern,
            sameOrigin,
            respectRobots,
            enqueueRenderedLinks: async (url) => {
              if (crawlPage) {
                return scanner.renderAndGetLinks(crawlPage, url, { waitUntil, waitMs, timeout });
              }
              return scanner.withPage(browser, (page) =>
                scanner.renderAndGetLinks(page, url, { waitUntil, waitMs, timeout })
              );
            },
            onProgress: ({ discovered, currentUrl }) => {
              emitProgress(send, "crawling", { discovered, currentUrl, maxPages });
            },
          });
        } catch (crawlError) {
          if (crawlPage) await crawlPage.close().catch(() => {});
          await browser.close().catch(() => {});
          browser = null;
          emitStreamError(send, crawlError?.message || "Unable to reach the website");
          return;
        }

        if (crawlPage) {
          await crawlPage.close().catch(() => {});
          crawlPage = null;
        }

        if (!urls?.length) {
          await browser.close().catch(() => {});
          browser = null;
          emitStreamError(send, "No pages could be discovered at this URL", 404);
          return;
        }

        emitProgress(send, "crawling", {
          discovered: urls.length,
          currentUrl: urls[0],
          maxPages,
        });

        const pageDocs = [];
        const page = await browser.newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
        );
        if (sessionData) {
          if (browser._authLive) {
            await page.goto(authSessionLib.getOriginFromUrl(urlCheck.url), {
              waitUntil: "domcontentloaded",
              timeout: 45000,
            }).catch(() => {});
            await authSessionLib.applyStorage(page, sessionData);
          } else {
            await authSessionLib.applyBrowserSession(page, urlCheck.url, sessionData);
          }
        }
        const pageTotal = urls.length;

        for (let i = 0; i < urls.length; i++) {
          const pageUrl = urls[i];
          const pageIndex = i + 1;

          emitProgress(send, "scanning", {
            pageIndex,
            pageTotal,
            currentUrl: pageUrl,
            maxPages,
          });

          try {
            await scanner.renderAndGetLinks(page, pageUrl, { waitUntil, waitMs, timeout });
            const axe = await scanner.runAxe(page, { rules, disableRules, impacts });
            pageDocs.push(reporter.buildPageDoc(pageUrl, axe, includeIncomplete));
            if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
          } catch (e) {
            pageDocs.push(reporter.buildFailedPageDoc(pageUrl, e.message));
          }
        }

        await page.close().catch(() => {});
        await browser.close().catch(() => {});
        browser = null;

        emitProgress(send, "building", { pageTotal, maxPages });

        const summary = reporter.buildSummary(pageDocs);
        const reportId = `scan_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

        emitProgress(send, "saving", { pageTotal, maxPages });

        const doc = await ScanReport.create({
          reportId,
          user: userId || undefined,
          baseUrl: urlCheck.url,
          startedAt: new Date(),
          finishedAt: new Date(),
          pages: pageDocs,
          summary,
        });

        if (userId) {
          await User.findByIdAndUpdate(userId, {
            $set: { latestScan: doc._id },
            $inc: { scansCount: 1 },
          }).catch(() => {});
        }

        const report = typeof doc.toObject === "function" ? doc.toObject() : doc;

        emitProgress(send, "complete", { pageTotal, maxPages });
        send({ type: "complete", report });
      } catch (e) {
        if (browser) await browser.close().catch(() => {});
        emitStreamError(send, e?.message || "Scan failed");
      } finally {
        controller.close();
      }
    },
  });

  return ndjsonResponse(stream);
}
