function mapSameSite(value) {
  if (value === "no_restriction") return "None";
  if (value === "lax") return "Lax";
  if (value === "strict") return "Strict";
  return undefined;
}

function toScannerCookie(cookie) {
  return {
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain,
    path: cookie.path || "/",
    expires: cookie.expirationDate,
    httpOnly: !!cookie.httpOnly,
    secure: !!cookie.secure,
    sameSite: mapSameSite(cookie.sameSite),
  };
}

async function getCookiesForTarget(targetUrl) {
  const parsed = new URL(targetUrl);
  const hostname = parsed.hostname;
  const variants = new Set([
    targetUrl,
    `${parsed.origin}/`,
    `http://${hostname}/`,
    `https://${hostname}/`,
  ]);

  if (hostname.startsWith("www.")) {
    const bare = hostname.slice(4);
    variants.add(`${parsed.protocol}//${bare}/`);
    variants.add(`http://${bare}/`);
    variants.add(`https://${bare}/`);
  } else {
    variants.add(`${parsed.protocol}//www.${hostname}/`);
    variants.add(`http://www.${hostname}/`);
    variants.add(`https://www.${hostname}/`);
  }

  const seen = new Set();
  const collected = [];

  for (const url of variants) {
    try {
      const batch = await chrome.cookies.getAll({ url });
      for (const cookie of batch) {
        const key = `${cookie.name}|${cookie.domain}|${cookie.path}`;
        if (seen.has(key)) continue;
        seen.add(key);
        collected.push(cookie);
      }
    } catch {
      // ignore invalid url variants
    }
  }

  if (!collected.length) {
    const byDomain = await chrome.cookies.getAll({ domain: hostname });
    for (const cookie of byDomain) {
      const key = `${cookie.name}|${cookie.domain}|${cookie.path}`;
      if (seen.has(key)) continue;
      seen.add(key);
      collected.push(cookie);
    }
  }

  return collected.map(toScannerCookie);
}

async function readStorageFromOrigin(origin) {
  const tabs = await chrome.tabs.query({});
  const matchingTab =
    tabs.find((tab) => {
      try {
        return new URL(tab.url || "").origin === origin;
      } catch {
        return false;
      }
    }) || tabs.find((tab) => tab.active && (tab.url || "").startsWith("http"));

  if (!matchingTab?.id) {
    return { localStorage: {}, sessionStorage: {} };
  }

  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId: matchingTab.id },
      func: () => ({
        localStorage: Object.fromEntries(
          Object.keys(localStorage).map((key) => [key, localStorage.getItem(key)])
        ),
        sessionStorage: Object.fromEntries(
          Object.keys(sessionStorage).map((key) => [key, sessionStorage.getItem(key)])
        ),
      }),
    });
    return injection?.result || { localStorage: {}, sessionStorage: {} };
  } catch {
    return { localStorage: {}, sessionStorage: {} };
  }
}

async function captureSession(targetUrl) {
  const parsed = new URL(targetUrl);
  const cookies = await getCookiesForTarget(targetUrl);
  const storage = await readStorageFromOrigin(parsed.origin);

  if (!cookies.length) {
    throw new Error(
      `No cookies found for ${parsed.origin}. Open that site in a browser tab while logged in, then click Import again.`
    );
  }

  return {
    cookies,
    localStorage: storage.localStorage || {},
    sessionStorage: storage.sessionStorage || {},
    capturedAt: new Date().toISOString(),
    origin: parsed.origin,
    protocol: parsed.protocol,
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.action !== "captureSession" || !message?.targetUrl) {
    return false;
  }

  captureSession(message.targetUrl)
    .then((session) => sendResponse({ ok: true, session }))
    .catch((error) => sendResponse({ ok: false, error: error?.message || "Session capture failed" }));

  return true;
});
