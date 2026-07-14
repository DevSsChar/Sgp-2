const { encryptPayload, decryptPayload } = require("../../utils/secureStorage.js");
const {
  getOriginFromUrl,
  buildStoredPayload,
  parseStoredPayload,
} = require("./authSession.js");

function getOrigin(url) {
  try {
    return getOriginFromUrl(url);
  } catch {
    return null;
  }
}

async function loadAuthProfile(ScanAuthProfile, userId, origin) {
  const doc = await ScanAuthProfile.findOne({ user: userId, origin }).lean();
  if (!doc) return null;

  const payload = decryptPayload(doc.encryptedPayload);
  const config = parseStoredPayload(doc.method, { ...payload, loginUrl: doc.loginUrl });

  return {
    ...config,
    profileId: String(doc._id),
    saveForReuse: true,
    useStored: true,
    origin,
    loginUrl: doc.loginUrl || config.loginUrl,
  };
}

async function saveAuthProfile(ScanAuthProfile, userId, origin, authConfig, sessionData) {
  const payload = buildStoredPayload(authConfig, sessionData);
  const encryptedPayload = encryptPayload(payload);

  return ScanAuthProfile.findOneAndUpdate(
    { user: userId, origin },
    {
      $set: {
        method: authConfig.method,
        loginUrl: authConfig.loginUrl || "",
        encryptedPayload,
        lastUsedAt: new Date(),
        lastAuthSuccessAt: new Date(),
        lastAuthError: "",
      },
    },
    { upsert: true, new: true }
  );
}

async function markAuthFailure(ScanAuthProfile, userId, origin, message) {
  if (!userId || !origin) return;
  await ScanAuthProfile.updateOne(
    { user: userId, origin },
    { $set: { lastAuthError: message, lastUsedAt: new Date() } }
  ).catch(() => {});
}

function resolveInlineAuth(bodyAuth, targetUrl) {
  if (!bodyAuth?.enabled) return null;

  const origin = getOrigin(targetUrl);
  if (!origin) throw new Error("Invalid target URL for authentication");

  if (bodyAuth.useStored) {
    return { useStored: true, origin, saveForReuse: !!bodyAuth.saveForReuse };
  }

  const method = bodyAuth.method;
  if (method === "credentials") {
    if (!bodyAuth.password) {
      throw new Error("Password is required for credential authentication");
    }
    return {
      method: "credentials",
      origin,
      loginUrl: bodyAuth.loginUrl || "",
      username: bodyAuth.username || "",
      password: bodyAuth.password,
      usernameSelector: bodyAuth.usernameSelector || "",
      passwordSelector: bodyAuth.passwordSelector || "",
      submitSelector: bodyAuth.submitSelector || "",
      saveForReuse: !!bodyAuth.saveForReuse,
    };
  }

  if (method === "session") {
    const cookies = bodyAuth.session?.cookies || bodyAuth.cookies;
    if (!Array.isArray(cookies) || cookies.length === 0) {
      throw new Error("At least one cookie is required for session authentication");
    }
    return {
      method: "session",
      origin,
      session: {
        cookies,
        localStorage: bodyAuth.session?.localStorage || bodyAuth.localStorage || {},
        sessionStorage: bodyAuth.session?.sessionStorage || bodyAuth.sessionStorage || {},
      },
      saveForReuse: !!bodyAuth.saveForReuse,
    };
  }

  throw new Error("Select an authentication method: credentials or session");
}

async function resolveScanAuth(bodyAuth, targetUrl, userId, ScanAuthProfile) {
  const inline = resolveInlineAuth(bodyAuth, targetUrl);
  if (!inline) return null;

  if (inline.useStored) {
    if (!userId) {
      throw new Error("Sign in to reuse a saved authentication profile");
    }
    const stored = await loadAuthProfile(ScanAuthProfile, userId, inline.origin);
    if (!stored) {
      throw new Error("No saved authentication found for this site — configure and save it first");
    }
    return stored;
  }

  if (inline.method === "credentials" && inline.saveForReuse && !userId) {
    throw new Error("Sign in to save credentials for future scans");
  }

  if (inline.method === "session" && inline.saveForReuse && !userId) {
    throw new Error("Sign in to save session data for future scans");
  }

  return inline;
}

function toPublicProfile(doc) {
  return {
    origin: doc.origin,
    method: doc.method,
    loginUrl: doc.loginUrl || "",
    hasStoredAuth: true,
    lastUsedAt: doc.lastUsedAt,
    lastAuthSuccessAt: doc.lastAuthSuccessAt,
    lastAuthError: doc.lastAuthError || "",
    updatedAt: doc.updatedAt,
  };
}

module.exports = {
  loadAuthProfile,
  saveAuthProfile,
  markAuthFailure,
  resolveScanAuth,
  toPublicProfile,
  getOrigin,
};
