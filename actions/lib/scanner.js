const puppeteer = require("puppeteer");
const AxePuppeteer = require("@axe-core/puppeteer").default;

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function createBrowser({ headless = false } = {}) {
  return puppeteer.launch({ 
    headless, 
    args: [
      "--no-sandbox", 
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
      "--ignore-ssl-errors",
      "--ignore-certificate-errors-spki-list",
      "--disable-web-security"
    ] 
  });
}

async function withPage(browser, fn) {
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
  );
  
  // Bypass SSL certificate errors at page level
  await page.setBypassCSP(true);
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9'
  });
  
  try {
    return await fn(page);
  } finally {
    await page.close().catch(() => {});
  }
}

async function renderAndGetLinks(page, url, { waitUntil = "networkidle2", timeout = 45000, waitMs = 3000 } = {}) {
  await page.goto(url, { waitUntil, timeout });
  await page.waitForSelector("body", { timeout: 10000 }).catch(() => {});
  await page.evaluate(() => (document && document.fonts ? document.fonts.ready : Promise.resolve())).catch(() => {});
  if (waitMs > 0) await sleep(waitMs);
  const links = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href')).filter(Boolean));
  return links;
}

async function runAxe(page, { rules, disableRules, impacts } = {}) {
  const axe = new AxePuppeteer(page);
  if (Array.isArray(rules) && rules.length) axe.withRules(rules);
  if (Array.isArray(disableRules) && disableRules.length) axe.configure({ rules: disableRules.reduce((acc, r) => (acc[r] = { enabled: false }, acc), {}) });
  const res = await axe.analyze();
  if (Array.isArray(impacts) && impacts.length) {
    res.violations = (res.violations || []).filter((v) => impacts.includes(v.impact));
  }
  return res;
}

module.exports = { createBrowser, withPage, renderAndGetLinks, runAxe };
