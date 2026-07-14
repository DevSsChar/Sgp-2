const { URL } = require("url");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getOriginFromUrl(url) {
  return new URL(url).origin;
}

function normalizeSameSite(value) {
  if (!value) return undefined;
  const normalized = String(value).toLowerCase();
  if (normalized === "none" || normalized === "no_restriction") return "None";
  if (normalized === "strict") return "Strict";
  return "Lax";
}

function normalizeCookie(cookie, fallbackOrigin) {
  if (!cookie?.name || cookie.value === undefined) return null;
  const origin = fallbackOrigin ? new URL(fallbackOrigin) : null;
  const rawDomain = cookie.domain || origin?.hostname || "";
  const domain = String(rawDomain).replace(/^\./, "");
  const path = cookie.path || "/";
  const protocol = origin?.protocol || "https:";

  // Prefer url-based cookies for Puppeteer reliability; domain is derived from url.
  const hostForUrl = domain || origin?.hostname;
  if (!hostForUrl) return null;

  const normalized = {
    name: String(cookie.name),
    value: String(cookie.value),
    url: `${protocol}//${hostForUrl}${path.startsWith("/") ? path : `/${path}`}`,
    path,
  };

  if (cookie.expires !== undefined && Number(cookie.expires) > 0) {
    normalized.expires = Math.floor(Number(cookie.expires));
  }
  if (cookie.httpOnly !== undefined) normalized.httpOnly = !!cookie.httpOnly;
  if (cookie.secure !== undefined) {
    normalized.secure = !!cookie.secure;
  } else if (protocol === "https:") {
    normalized.secure = true;
  }
  const sameSite = normalizeSameSite(cookie.sameSite);
  if (sameSite) {
    normalized.sameSite = sameSite;
    if (sameSite === "None") normalized.secure = true;
  }

  return normalized;
}

function normalizeCookies(cookies, origin) {
  if (!Array.isArray(cookies)) return [];
  return cookies.map((c) => normalizeCookie(c, origin)).filter(Boolean);
}

const USERNAME_SELECTORS = [
  "input[type=\"email\"]",
  "input[name=\"email\"]",
  "input[name=\"username\"]",
  "input[name=\"user\"]",
  "input[id=\"email\"]",
  "input[id=\"username\"]",
  "input[autocomplete=\"username\"]",
  "input[autocomplete=\"email\"]",
];

const PASSWORD_SELECTORS = [
  "input[type=\"password\"]",
  "input[name=\"password\"]",
  "input[name=\"passwd\"]",
  "input[id=\"password\"]",
  "input[autocomplete=\"current-password\"]",
];

const SUBMIT_SELECTORS = [
  "button[type=\"submit\"]",
  "input[type=\"submit\"]",
];

function isBlankOrUnreachable(url) {
  if (!url || url === "about:blank") return true;
  try {
    const parsed = new URL(url);
    return !parsed.hostname;
  } catch {
    return true;
  }
}

function buildLoginFieldError(pageUrl, pageTitle, fieldName) {
  return (
    `Could not find a visible ${fieldName} field on the login page (${pageUrl || "unknown URL"}). ` +
    `Confirm the Login Page URL opens the sign-in form directly, provide a custom CSS selector, ` +
    `or use Import Browser Session for OAuth/SSO logins.`
  );
}

async function setupPuppeteerPage(page) {
  await page.setUserAgent(USER_AGENT);
  await page.setBypassCSP(true);
  await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
}

async function capturePuppeteerSession(page) {
  const cookies = await page.cookies();
  const storage = await page.evaluate(() => ({
    localStorage: Object.fromEntries(
      Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)])
    ),
    sessionStorage: Object.fromEntries(
      Object.keys(sessionStorage).map((k) => [k, sessionStorage.getItem(k)])
    ),
  }));
  return {
    cookies,
    localStorage: storage.localStorage,
    sessionStorage: storage.sessionStorage,
    finalUrl: page.url(),
  };
}

async function waitForPuppeteerPageReady(page, loginUrl, timeoutMs = 60000) {
  const expectedHost = new URL(loginUrl).hostname;
  const deadline = Date.now() + timeoutMs;

  const tryNavigate = async () => {
    try {
      await page.goto(loginUrl, {
        waitUntil: "networkidle2",
        timeout: Math.max(5000, deadline - Date.now()),
      });
    } catch {
      await page.goto(loginUrl, {
        waitUntil: "domcontentloaded",
        timeout: Math.max(5000, deadline - Date.now()),
      });
    }
  };

  await tryNavigate();

  while (Date.now() < deadline) {
    const currentUrl = page.url();
    if (!isBlankOrUnreachable(currentUrl) && currentUrl.includes(expectedHost)) {
      await page.waitForSelector("body", { timeout: 10000 }).catch(() => {});
      await sleep(2500);
      return currentUrl;
    }

    await tryNavigate().catch(() => {});
    await sleep(800);
  }

  throw new Error(
    `Login page never loaded — browser is stuck on "${page.url() || "about:blank"}". ` +
      `Verify Login Page URL: ${loginUrl}`
  );
}

async function isSelectorVisible(page, selector) {
  try {
    return await page.evaluate((sel) => {
      const node = document.querySelector(sel);
      if (!node) return false;
      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return (
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        rect.width > 0 &&
        rect.height > 0
      );
    }, selector);
  } catch {
    return false;
  }
}

async function findVisibleSelector(page, selectors, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (isBlankOrUnreachable(page.url())) {
      await sleep(600);
      continue;
    }
    for (const selector of selectors) {
      if (await isSelectorVisible(page, selector)) {
        return selector;
      }
    }
    await sleep(500);
  }
  return null;
}

async function fillPuppeteerField(page, selector, value) {
  if (isBlankOrUnreachable(page.url())) {
    throw new Error(
      `Cannot fill login form — page has not loaded (currently "${page.url()}").`
    );
  }
  await page.waitForSelector(selector, { visible: true, timeout: 20000 });
  await page.focus(selector);
  await page.click(selector, { clickCount: 3 });
  await page.type(selector, value, { delay: 25 });
}

async function clickContinueButton(page) {
  const clicked = await page.evaluate(() => {
    const labels = ["next", "continue", "proceed", "log in", "sign in", "login"];
    const nodes = Array.from(document.querySelectorAll("button, input[type=\"submit\"]"));
    for (const node of nodes) {
      const text = (node.textContent || node.value || "").trim().toLowerCase();
      if (!text) continue;
      if (labels.some((label) => text.includes(label))) {
        node.click();
        return true;
      }
    }
    return false;
  });
  if (clicked) {
    await sleep(2000);
    await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});
    await sleep(1000);
  }
  return clicked;
}

async function performCredentialLoginWithPuppeteer(options) {
  const {
    loginUrl,
    username,
    password,
    usernameSelector,
    passwordSelector,
    submitSelector,
    timeout = 60000,
    browser: existingBrowser = null,
  } = options;

  if (!loginUrl || !password) {
    throw new Error("Login URL and password are required for credential authentication");
  }

  const ownsBrowser = !existingBrowser;
  const browser = existingBrowser || (await require("./scanner.js").createBrowser({ headless: false }));
  const page = await browser.newPage();
  await setupPuppeteerPage(page);

  try {
    await waitForPuppeteerPageReady(page, loginUrl, timeout);

    const passwordSelectors = passwordSelector ? [passwordSelector] : PASSWORD_SELECTORS;
    const userSelectors = usernameSelector ? [usernameSelector] : USERNAME_SELECTORS;

    let passSel = await findVisibleSelector(page, passwordSelectors, 10000);

    if (!passSel && username) {
      const userSel = await findVisibleSelector(page, userSelectors, 12000);
      if (userSel) {
        await fillPuppeteerField(page, userSel, username);
        await clickContinueButton(page);
        await waitForPuppeteerPageReady(page, loginUrl, 20000).catch(() => sleep(1500));
        passSel = await findVisibleSelector(page, passwordSelectors, 20000);
      }
    }

    if (!passSel) {
      const pageUrl = page.url();
      const pageTitle = await page.title().catch(() => "");
      throw new Error(
        buildLoginFieldError(
          pageTitle ? `${pageUrl} — ${pageTitle}` : pageUrl,
          pageTitle,
          "password"
        )
      );
    }

    if (username) {
      const userSel = await findVisibleSelector(page, userSelectors, 4000);
      if (userSel) {
        await fillPuppeteerField(page, userSel, username);
      } else if (!usernameSelector) {
        throw new Error(
          "Could not find a username/email field on the login page — provide a Username Selector"
        );
      }
    }

    await fillPuppeteerField(page, passSel, password);

    const submitSelectors = submitSelector ? [submitSelector] : SUBMIT_SELECTORS;
    let submitted = false;
    for (const sel of submitSelectors) {
      const handle = await page.$(sel);
      if (handle && (await isSelectorVisible(page, sel))) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: "domcontentloaded", timeout }).catch(() => {}),
          handle.click(),
        ]);
        submitted = true;
        break;
      }
    }

    if (!submitted) {
      await page.keyboard.press("Enter");
      await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout }).catch(() => {});
    }

    // Wait until login redirects away from the form (SPA-friendly).
    await sleep(2500);
    const loginHost = new URL(loginUrl).hostname;
    const deadline = Date.now() + Math.min(timeout, 30000);
    while (Date.now() < deadline) {
      const current = page.url();
      const stillOnLogin =
        /login|signin|sign-in|auth/i.test(current) &&
        (await page.$("input[type=\"password\"]").catch(() => null));
      if (!stillOnLogin && !isBlankOrUnreachable(current) && current.includes(loginHost)) {
        break;
      }
      await sleep(800);
    }

    await sleep(1500);
    const sessionData = await capturePuppeteerSession(page);
    await page.close().catch(() => {});
    return sessionData;
  } catch (error) {
    await page.close().catch(() => {});
    throw error;
  } finally {
    if (ownsBrowser) {
      await browser.close().catch(() => {});
    }
  }
}

async function sessionLooksAuthenticated(page) {
  const passwordHandle = await page.$("input[type=\"password\"]");
  if (!passwordHandle) return true;
  return !(await page.evaluate((el) => el && el.offsetParent !== null, passwordHandle));
}

async function validateStoredSession(targetUrl, sessionData, browser = null) {
  const ownsBrowser = !browser;
  const activeBrowser = browser || (await require("./scanner.js").createBrowser({ headless: false }));
  const page = await activeBrowser.newPage();
  await setupPuppeteerPage(page);

  try {
    await applyBrowserSession(page, targetUrl, sessionData);
    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 45000 }).catch(() =>
      page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 45000 })
    );
    return await sessionLooksAuthenticated(page);
  } catch {
    return false;
  } finally {
    await page.close().catch(() => {});
    if (ownsBrowser) {
      await activeBrowser.close().catch(() => {});
    }
  }
}

/**
 * Establish auth inside the scan browser so cookies stay live for crawl/scan.
 * Avoids fragile cookie transfer across separate Chromium processes.
 */
async function establishAuth(targetUrl, authConfig, browser = null) {
  if (authConfig.method === "session") {
    const sessionData = authConfig.session || authConfig;
    if (browser) {
      await primeAuthenticatedBrowser(browser, targetUrl, sessionData);
    }
    return sessionData;
  }

  if (authConfig.method === "credentials") {
    if (authConfig.session?.cookies?.length) {
      const stillValid = await validateStoredSession(targetUrl, authConfig.session, browser).catch(
        () => false
      );
      if (stillValid) {
        if (browser) {
          browser._authSession = authConfig.session;
          browser._authOrigin = getOriginFromUrl(targetUrl);
          // validateStoredSession already applied cookies into this browser.
          browser._authLive = true;
        }
        return authConfig.session;
      }
    }

    const loginUrl = authConfig.loginUrl || `${new URL(targetUrl).origin}/login`;
    const sessionData = await performCredentialLoginWithPuppeteer({
      loginUrl,
      username: authConfig.username,
      password: authConfig.password,
      usernameSelector: authConfig.usernameSelector,
      passwordSelector: authConfig.passwordSelector,
      submitSelector: authConfig.submitSelector,
      timeout: authConfig.timeout || 60000,
      browser,
    });

    if (browser) {
      browser._authSession = sessionData;
      browser._authOrigin = getOriginFromUrl(targetUrl);
      // Cookies are already live in this Chromium process from the login page.
      // Do not re-setCookie (normalization can break domain cookies). Only hydrate storage.
      browser._authLive = true;
      const page = await browser.newPage();
      await setupPuppeteerPage(page);
      try {
        await page.goto(browser._authOrigin, {
          waitUntil: "domcontentloaded",
          timeout: 45000,
        }).catch(() => {});
        await applyStorage(page, sessionData);
      } finally {
        await page.close().catch(() => {});
      }
    }

    return sessionData;
  }

  throw new Error("Unsupported authentication method");
}

async function applyStorage(page, { localStorage = {}, sessionStorage = {} } = {}) {
  await page.evaluate((ls, ss) => {
    for (const [k, v] of Object.entries(ls || {})) {
      try {
        window.localStorage.setItem(k, v);
      } catch {}
    }
    for (const [k, v] of Object.entries(ss || {})) {
      try {
        window.sessionStorage.setItem(k, v);
      } catch {}
    }
  }, localStorage, sessionStorage);
}

async function applyBrowserSession(page, targetUrl, sessionData) {
  const origin = getOriginFromUrl(targetUrl);
  const cookies = normalizeCookies(sessionData?.cookies, origin);

  await page.goto(origin, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});

  if (cookies.length) {
    const applied = [];
    for (const cookie of cookies) {
      try {
        await page.setCookie(cookie);
        applied.push(cookie.name);
      } catch {
        // Fallback without SameSite if Chromium rejects the cookie.
        try {
          const { sameSite, ...rest } = cookie;
          await page.setCookie(rest);
          applied.push(cookie.name);
        } catch {
          // skip invalid cookies
        }
      }
    }
    if (!applied.length) {
      throw new Error("Could not apply any session cookies to the scanner browser");
    }
    await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
  }

  await applyStorage(page, sessionData);
  await sleep(500);
}

function getAuthenticatedSeedUrls(targetUrl, sessionData) {
  const seeds = [];
  const start = normalizeSeedUrl(targetUrl);
  // Prefer post-login landing page first so crawl enters the authenticated area.
  const finalUrl = normalizeSeedUrl(sessionData?.finalUrl);

  if (finalUrl && isSameOrigin(start || targetUrl, finalUrl)) {
    seeds.push(finalUrl);
  }
  if (start && !seeds.includes(start)) {
    seeds.push(start);
  }

  return seeds.length ? seeds : [targetUrl];
}

function normalizeSeedUrl(u) {
  if (!u || u === "about:blank") return null;
  try {
    const url = new URL(u);
    if (!url.hostname) return null;
    url.hash = "";
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }
    return url.toString();
  } catch {
    return null;
  }
}

function isSameOrigin(a, b) {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
}

async function primeAuthenticatedBrowser(browser, targetUrl, sessionData) {
  const page = await browser.newPage();
  await setupPuppeteerPage(page);
  await applyBrowserSession(page, targetUrl, sessionData);
  await page.close().catch(() => {});
  browser._authSession = sessionData;
  browser._authOrigin = getOriginFromUrl(targetUrl);
  browser._authLive = false;
}

function buildStoredPayload(authConfig, sessionData) {
  if (authConfig.method === "credentials") {
    return {
      username: authConfig.username,
      password: authConfig.password,
      usernameSelector: authConfig.usernameSelector || "",
      passwordSelector: authConfig.passwordSelector || "",
      submitSelector: authConfig.submitSelector || "",
      session: sessionData || null,
    };
  }

  return {
    cookies: sessionData?.cookies || authConfig.session?.cookies || [],
    localStorage: sessionData?.localStorage || authConfig.session?.localStorage || {},
    sessionStorage: sessionData?.sessionStorage || authConfig.session?.sessionStorage || {},
  };
}

function parseStoredPayload(method, payload) {
  if (method === "credentials") {
    return {
      method: "credentials",
      loginUrl: payload.loginUrl,
      username: payload.username,
      password: payload.password,
      usernameSelector: payload.usernameSelector,
      passwordSelector: payload.passwordSelector,
      submitSelector: payload.submitSelector,
      session: payload.session || null,
    };
  }

  return {
    method: "session",
    session: {
      cookies: payload.cookies || [],
      localStorage: payload.localStorage || {},
      sessionStorage: payload.sessionStorage || {},
    },
  };
}

module.exports = {
  getOriginFromUrl,
  normalizeCookies,
  applyStorage,
  applyBrowserSession,
  primeAuthenticatedBrowser,
  getAuthenticatedSeedUrls,
  establishAuth,
  establishAuthWithPlaywright: establishAuth,
  buildStoredPayload,
  parseStoredPayload,
};
