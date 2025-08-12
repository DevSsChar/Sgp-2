const robotsParser = require("robots-parser");
const { URL } = require("url");

function wildcardToRegExp(pattern) {
  if (!pattern) return null;
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`, "i");
}

function normalizeUrl(u) {
  try {
    const url = new URL(u);
    url.hash = "";
    if (url.pathname !== "/" && url.pathname.endsWith("/")) url.pathname = url.pathname.slice(0, -1);
    return url.toString();
  } catch {
    return null;
  }
}

function isSameOrigin(a, b) {
  try {
    const A = new URL(a).origin;
    const B = new URL(b).origin;
    return A === B;
  } catch {
    return false;
  }
}

async function fetchRobotsTxt(baseUrl) {
  try {
    const robotsUrl = new URL("/robots.txt", baseUrl).toString();
    const res = await fetch(robotsUrl);
    if (!res.ok) return null;
    const txt = await res.text();
    return robotsParser(robotsUrl, txt);
  } catch {
    return null;
  }
}

async function crawl({ startUrl, maxPages = 50, include, exclude, sameOrigin = true, respectRobots = true, enqueueRenderedLinks }) {
  const includeRe = wildcardToRegExp(include);
  const excludeRe = wildcardToRegExp(exclude);
  const origin = new URL(startUrl).origin;
  const robots = respectRobots ? await fetchRobotsTxt(startUrl) : null;

  const queue = [normalizeUrl(startUrl)].filter(Boolean);
  const seen = new Set(queue);

  function allowed(u) {
    if (!u) return false;
    if (sameOrigin && !isSameOrigin(origin, u)) return false;
    if (includeRe && !includeRe.test(u)) return false;
    if (excludeRe && excludeRe.test(u)) return false;
    if (robots && !robots.isAllowed(u, "Mozilla/5.0")) return false;
    return true;
  }

  while (queue.length && seen.size < maxPages) {
    const current = queue.shift();
    const nextLinks = await enqueueRenderedLinks(current);
    for (const href of nextLinks) {
      const abs = normalizeUrl(new URL(href, current).toString());
      if (!abs) continue;
      if (seen.has(abs)) continue;
      if (!allowed(abs)) continue;
      seen.add(abs);
      queue.push(abs);
      if (seen.size >= maxPages) break;
    }
  }

  return Array.from(seen);
}

module.exports = { crawl };
