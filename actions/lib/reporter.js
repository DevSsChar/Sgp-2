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

function buildFailedPageDoc(url, errorMessage) {
  // Provide user-friendly error messages for common issues
  let friendlyMessage = errorMessage || "Page not found or unable to scan";
  
  if (errorMessage) {
    if (errorMessage.includes("ERR_CERT_AUTHORITY_INVALID")) {
      friendlyMessage = "SSL certificate issue - the website's security certificate could not be verified";
    } else if (errorMessage.includes("ERR_CERT_COMMON_NAME_INVALID")) {
      friendlyMessage = "SSL certificate mismatch - the certificate doesn't match the domain";
    } else if (errorMessage.includes("ERR_CERT_DATE_INVALID")) {
      friendlyMessage = "SSL certificate expired - the website's security certificate has expired";
    } else if (errorMessage.includes("ERR_CONNECTION_REFUSED")) {
      friendlyMessage = "Connection refused - the website is not responding";
    } else if (errorMessage.includes("ERR_NAME_NOT_RESOLVED")) {
      friendlyMessage = "Domain not found - the website address could not be resolved";
    } else if (errorMessage.includes("ERR_CONNECTION_TIMED_OUT")) {
      friendlyMessage = "Connection timeout - the website took too long to respond";
    } else if (errorMessage.includes("404")) {
      friendlyMessage = "Page not found (404) - this page does not exist on the website";
    } else if (errorMessage.includes("403")) {
      friendlyMessage = "Access forbidden (403) - this page is restricted";
    } else if (errorMessage.includes("500")) {
      friendlyMessage = "Server error (500) - the website is experiencing technical difficulties";
    }
  }
  
  return {
    url,
    violations: [],
    meta: {
      passesCount: 0,
      incompleteCount: 0,
      inapplicableCount: 0,
      tags: [],
      scanError: true,
      errorMessage: friendlyMessage,
      originalError: errorMessage // Keep original for debugging
    }
  };
}

module.exports = { buildPageDoc, buildFailedPageDoc, buildSummary };
