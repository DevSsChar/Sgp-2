function buildPageDoc(url, axe, includeIncomplete = true) {
  let violations = axe.violations || [];
  const passes = axe.passes || [];
  const incomplete = axe.incomplete || [];
  const inapplicable = axe.inapplicable || [];

  if (includeIncomplete && incomplete.length) {
    const needsReview = incomplete.map((v, i) => ({
      ...v,
      id: `${v.id}-incomplete-${i}`,
      tags: Array.from(new Set([...(v.tags || []), "needs-review"])),
  impact: "needs-review",
    }));
    violations = violations.concat(needsReview);
  }

  return {
    url,
    violations: (violations || []).map((v) => ({
      id: v.id,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      impact: v.impact || null,
      tags: Array.isArray(v.tags) ? v.tags : [],
      nodes: (v.nodes || []).map((n) => ({
        target: n.target,
        html: n.html,
        failureSummary: n.failureSummary || "",
      })),
    })),
    meta: {
      passesCount: passes.length,
      incompleteCount: incomplete.length,
      inapplicableCount: inapplicable.length,
      tags: Array.from(new Set([].concat(...(violations || []).map((v) => v.tags || []))))
    }
  };
}

function classifyRule(ruleId, tags = []) {
  const id = String(ruleId || "");
  // Direct mappings for common rules
  if (id === "color-contrast") return "perceivable";
  if (id === "image-alt") return "perceivable";
  if (id === "heading-order" || id === "page-has-heading-one") return "perceivable";
  if (id === "label" || id === "label-title-only") return "perceivable";
  if (id === "link-name" || id === "button-name") return "understandable";
  if (id === "html-has-lang" || id === "html-lang-valid") return "understandable";
  if (id === "skip-link") return "operable";
  if (id.startsWith("focus-order")) return "operable";
  if (id.startsWith("aria-")) return "robust";
  if (id === "duplicate-id" || id === "unique-id") return "robust";
  if (id === "region" || id === "landmark-one-main") return "operable";
  // Fallback via tags
  if ((tags || []).includes("cat.color")) return "perceivable";
  if ((tags || []).includes("cat.language")) return "understandable";
  if ((tags || []).includes("cat.keyboard")) return "operable";
  if ((tags || []).includes("cat.name-role-value")) return "robust";
  return "robust";
}

function buildSummary(pages) {
  // Count affected nodes per impact bucket; include needs-review
  const byImpactNodes = { minor: 0, moderate: 0, serious: 0, critical: 0, "needs-review": 0 };
  const byCategoryNodes = { perceivable: 0, operable: 0, understandable: 0, robust: 0 };
  const ruleCounts = new Map();
  let totalNodes = 0;

  for (const p of pages) {
    for (const v of p.violations || []) {
      const nodes = Array.isArray(v.nodes) ? v.nodes.length : 0;
      totalNodes += nodes;

      const impactKey = v.impact && byImpactNodes.hasOwnProperty(v.impact) ? v.impact : undefined;
      if (impactKey) byImpactNodes[impactKey] += nodes;

      const cat = classifyRule(v.id, v.tags);
      if (byCategoryNodes.hasOwnProperty(cat)) byCategoryNodes[cat] += nodes;

      ruleCounts.set(v.id, (ruleCounts.get(v.id) || 0) + nodes);
    }
  }

  const topRules = Array.from(ruleCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([rule, count]) => ({ rule, nodes: count }));

  return {
    pages: pages.length,
    byImpactNodes,
    byCategoryNodes,
    totalNodes,
    totalRules: ruleCounts.size,
    topRules,
  };
}

function classifyScanError(errorMessage) {
  const originalError = errorMessage || "Scan failed";
  let message = originalError;
  let code = "SCAN_FAILED";
  let type = "unknown";
  let status = 500;

  if (errorMessage) {
    if (
      /login failed|authentication|credential|password required|username field|session must|unsupported authentication/i.test(
        errorMessage
      )
    ) {
      message = originalError;
      code = "AUTH_FAILED";
      type = "auth";
      status = 401;
    } else if (/Executable doesn't exist|playwright install|browserType\.launch/i.test(errorMessage)) {
      message =
        "Playwright browser is not installed on the server. Run: npx playwright install chromium";
      code = "PLAYWRIGHT_MISSING";
      type = "auth";
      status = 500;
    } else if (/Protocol error.*setCookie|Invalid cookie|setCookie/i.test(errorMessage)) {
      message =
        "Could not apply the authenticated session to the scanner. Try importing your browser session again or re-save credentials.";
      code = "SESSION_APPLY_FAILED";
      type = "auth";
      status = 401;
    } else if (/about:blank|never loaded|has not finished loading|waitForSelector|password field|Could not find a visible password|Login page did not finish loading|Login form not found/i.test(errorMessage)) {
      message = originalError.replace(/\u001b\[[0-9;]*m/g, "").split("Call log:")[0].trim();
      code = "AUTH_LOGIN_FORM";
      type = "auth";
      status = 401;
    } else if (/SCAN_AUTH_ENCRYPTION_KEY|secure auth storage/i.test(errorMessage)) {
      message = "Server encryption is not configured for saving authentication profiles.";
      code = "AUTH_STORAGE_CONFIG";
      type = "auth";
      status = 500;
    } else if (errorMessage.includes("ERR_CERT_AUTHORITY_INVALID")) {
      message = "SSL certificate issue — the website's security certificate could not be verified.";
      code = "SSL_ERROR";
      type = "ssl";
      status = 502;
    } else if (errorMessage.includes("ERR_CERT_COMMON_NAME_INVALID")) {
      message = "SSL certificate mismatch — the certificate doesn't match the domain.";
      code = "SSL_ERROR";
      type = "ssl";
      status = 502;
    } else if (errorMessage.includes("ERR_CERT_DATE_INVALID")) {
      message = "SSL certificate expired — the website's security certificate has expired.";
      code = "SSL_ERROR";
      type = "ssl";
      status = 502;
    } else if (errorMessage.includes("ERR_CONNECTION_REFUSED")) {
      message = "Connection refused — the website is not responding. It may be offline or blocking requests.";
      code = "CONNECTION_REFUSED";
      type = "unreachable";
      status = 503;
    } else if (errorMessage.includes("ERR_NAME_NOT_RESOLVED")) {
      message = "Website not found — the domain could not be resolved. Please check the URL spelling and try again.";
      code = "URL_NOT_FOUND";
      type = "not_found";
      status = 404;
    } else if (errorMessage.includes("ERR_CONNECTION_TIMED_OUT") || errorMessage.includes("Navigation timeout")) {
      message = "Connection timed out — the website took too long to respond. It may be slow or unreachable.";
      code = "TIMEOUT";
      type = "timeout";
      status = 408;
    } else if (errorMessage.includes("net::ERR_ABORTED")) {
      message = "Request aborted — the connection to the website was interrupted.";
      code = "REQUEST_ABORTED";
      type = "unreachable";
      status = 502;
    } else if (/\b404\b/.test(errorMessage) || errorMessage.includes("Not Found")) {
      message = "Page not found (404) — this URL does not exist on the website.";
      code = "PAGE_NOT_FOUND";
      type = "not_found";
      status = 404;
    } else if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
      message = "Access forbidden (403) — this page is restricted and cannot be scanned.";
      code = "ACCESS_FORBIDDEN";
      type = "forbidden";
      status = 403;
    } else if (/\b500\b/.test(errorMessage) || errorMessage.includes("Internal Server Error")) {
      message = "Server error — the target website returned an error. The site may be experiencing issues.";
      code = "TARGET_SERVER_ERROR";
      type = "server_error";
      status = 502;
    } else if (errorMessage.includes("Invalid URL")) {
      message = "Invalid URL — enter a valid address starting with http:// or https://.";
      code = "INVALID_URL";
      type = "invalid_url";
      status = 400;
    } else if (errorMessage.includes("No pages could be discovered")) {
      message = "No pages found — the URL could not be reached or contains no scannable content.";
      code = "URL_NOT_FOUND";
      type = "not_found";
      status = 404;
    }
  }

  return { message, code, type, status, originalError };
}

function buildFailedPageDoc(url, errorMessage) {
  const { message, originalError } = classifyScanError(errorMessage);

  return {
    url,
    violations: [],
    meta: {
      passesCount: 0,
      incompleteCount: 0,
      inapplicableCount: 0,
      tags: [],
      scanError: true,
      errorMessage: message,
      originalError,
    },
  };
}

module.exports = { buildPageDoc, buildFailedPageDoc, buildSummary, classifyScanError };
