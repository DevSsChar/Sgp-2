const REQUEST_TYPE = "AG_REQUEST_SESSION_IMPORT";
const RESPONSE_TYPE = "AG_SESSION_IMPORT_RESULT";
const PING_TYPE = "AG_EXTENSION_PING";
const PONG_TYPE = "AG_EXTENSION_PONG";

function waitForExtensionMessage(requestId, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      window.removeEventListener("message", onMessage);
      reject(new Error("EXTENSION_TIMEOUT"));
    }, timeoutMs);

    function onMessage(event) {
      if (event.source !== window || !event.data?.type) return;
      if (event.data.requestId !== requestId) return;

      if (event.data.type === PONG_TYPE) {
        clearTimeout(timer);
        window.removeEventListener("message", onMessage);
        resolve({ installed: true });
        return;
      }

      if (event.data.type === RESPONSE_TYPE) {
        clearTimeout(timer);
        window.removeEventListener("message", onMessage);
        if (event.data.ok && event.data.session) {
          resolve({ installed: true, session: event.data.session });
        } else {
          reject(new Error(event.data.error || "Session import failed"));
        }
      }
    }

    window.addEventListener("message", onMessage);
  });
}

function postExtensionMessage(payload) {
  window.postMessage(payload, "*");
}

export async function isSessionExtensionInstalled(timeoutMs = 1200) {
  if (typeof window === "undefined") return false;
  const requestId = crypto.randomUUID();
  try {
    postExtensionMessage({ type: PING_TYPE, requestId });
    await waitForExtensionMessage(requestId, timeoutMs);
    return true;
  } catch {
    return false;
  }
}

export async function importSessionViaExtension(targetUrl, timeoutMs = 20000) {
  if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
    throw new Error("Enter a valid target URL before importing a session");
  }

  const requestId = crypto.randomUUID();
  postExtensionMessage({
    type: REQUEST_TYPE,
    requestId,
    targetUrl: targetUrl.trim(),
  });

  try {
    const result = await waitForExtensionMessage(requestId, timeoutMs);
    return result.session;
  } catch (error) {
    if (error?.message === "EXTENSION_TIMEOUT") {
      throw new Error(
        "Browser extension not detected. Install the AccessibilityGuard extension (browser-extension folder → Load unpacked), then try again."
      );
    }
    throw error;
  }
}

export function parseSessionImport(raw) {
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  const cookies = parsed?.cookies || parsed?.session?.cookies;
  if (!Array.isArray(cookies) || cookies.length === 0) {
    throw new Error("Session must include at least one cookie");
  }
  return {
    cookies,
    localStorage: parsed?.localStorage || parsed?.session?.localStorage || {},
    sessionStorage: parsed?.sessionStorage || parsed?.session?.sessionStorage || {},
  };
}

export function buildScanAuthPayload({
  authMode,
  authMethod,
  saveForReuse,
  useStored,
  loginUrl,
  username,
  password,
  usernameSelector,
  passwordSelector,
  submitSelector,
  sessionJson,
}) {
  if (authMode !== "authenticated") {
    return { enabled: false };
  }

  if (useStored) {
    return { enabled: true, useStored: true, saveForReuse: false };
  }

  if (authMethod === "credentials") {
    return {
      enabled: true,
      method: "credentials",
      loginUrl: loginUrl.trim(),
      username: username.trim(),
      password,
      usernameSelector: usernameSelector.trim(),
      passwordSelector: passwordSelector.trim(),
      submitSelector: submitSelector.trim(),
      saveForReuse,
    };
  }

  const session = parseSessionImport(sessionJson);
  return {
    enabled: true,
    method: "session",
    session,
    saveForReuse,
  };
}
