"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import {
  importSessionViaExtension,
  isSessionExtensionInstalled,
  parseSessionImport,
} from "@/utils/scanAuthClient";

export default function ScannerAuthPanel({
  targetUrl,
  authMode,
  onAuthModeChange,
  authMethod,
  onAuthMethodChange,
  loginUrl,
  onLoginUrlChange,
  username,
  onUsernameChange,
  password,
  onPasswordChange,
  usernameSelector,
  onUsernameSelectorChange,
  passwordSelector,
  onPasswordSelectorChange,
  submitSelector,
  onSubmitSelectorChange,
  sessionJson,
  onSessionJsonChange,
  saveForReuse,
  onSaveForReuseChange,
  useStored,
  onUseStoredChange,
  disabled = false,
}) {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [storedProfile, setStoredProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [sessionImportError, setSessionImportError] = useState("");
  const [importingSession, setImportingSession] = useState(false);
  const [extensionInstalled, setExtensionInstalled] = useState(null);
  const [sessionMeta, setSessionMeta] = useState(null);

  const fetchStoredProfile = useCallback(async () => {
    if (!isLoggedIn || !targetUrl || !/^https?:\/\//i.test(targetUrl)) {
      setStoredProfile(null);
      return;
    }

    setProfileLoading(true);
    try {
      const res = await fetch(`/api/scan-auth?url=${encodeURIComponent(targetUrl)}`);
      if (!res.ok) throw new Error("Failed to load saved authentication");
      const data = await res.json();
      setStoredProfile(data.profile || null);
    } catch {
      setStoredProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, [isLoggedIn, targetUrl]);

  useEffect(() => {
    fetchStoredProfile();
  }, [fetchStoredProfile]);

  useEffect(() => {
    let active = true;
    isSessionExtensionInstalled().then((installed) => {
      if (active) setExtensionInstalled(installed);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!sessionJson) {
      setSessionImportError("");
      setSessionMeta(null);
      return;
    }
    try {
      const parsed = parseSessionImport(sessionJson);
      setSessionImportError("");
      setSessionMeta({
        cookieCount: parsed.cookies.length,
        storageKeys:
          Object.keys(parsed.localStorage || {}).length +
          Object.keys(parsed.sessionStorage || {}).length,
      });
    } catch (e) {
      setSessionImportError(e.message);
      setSessionMeta(null);
    }
  }, [sessionJson]);

  async function handleDeleteStored() {
    if (!targetUrl) return;
    setProfileMessage("");
    const res = await fetch(`/api/scan-auth?url=${encodeURIComponent(targetUrl)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setProfileMessage("Could not remove saved authentication");
      return;
    }
    setStoredProfile(null);
    onUseStoredChange(false);
    setProfileMessage("Saved authentication removed");
  }

  async function handleImportSession() {
    setSessionImportError("");
    setProfileMessage("");

    if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
      setSessionImportError("Enter the target URL above before importing a session");
      return;
    }

    setImportingSession(true);
    try {
      const session = await importSessionViaExtension(targetUrl);
      onSessionJsonChange(JSON.stringify(session));
      setSessionMeta({
        cookieCount: session.cookies?.length || 0,
        storageKeys:
          Object.keys(session.localStorage || {}).length +
          Object.keys(session.sessionStorage || {}).length,
        origin: session.origin,
        protocol: session.protocol,
      });
      setExtensionInstalled(true);
      setProfileMessage(
        `Session imported from ${session.origin} (${session.cookies?.length || 0} cookies)`
      );
    } catch (error) {
      setSessionImportError(error.message);
      if (error.message?.includes("extension not detected")) {
        setExtensionInstalled(false);
      }
    } finally {
      setImportingSession(false);
    }
  }

  function handleClearImportedSession() {
    onSessionJsonChange("");
    setSessionMeta(null);
    setProfileMessage("");
    setSessionImportError("");
  }

  return (
    <div className="mt-6 border border-cx-outline-variant/30 bg-cx-surface-container-low/60 p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-mono-cx text-[12px] font-bold uppercase tracking-widest text-cx-on-surface">
            Authentication Mode
          </h3>
          <p className="font-mono-cx text-[11px] text-cx-on-surface-variant mt-1">
            Test public pages or scan behind a login wall
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onAuthModeChange("public")}
            className={`px-3 py-1.5 font-mono-cx text-[10px] uppercase tracking-widest border transition-colors ${
              authMode === "public"
                ? "border-cx-primary bg-cx-primary/10 text-cx-primary"
                : "border-cx-outline-variant text-cx-on-surface-variant hover:border-cx-primary/50"
            }`}
          >
            Without Login
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onAuthModeChange("authenticated")}
            className={`px-3 py-1.5 font-mono-cx text-[10px] uppercase tracking-widest border transition-colors ${
              authMode === "authenticated"
                ? "border-cx-primary bg-cx-primary/10 text-cx-primary"
                : "border-cx-outline-variant text-cx-on-surface-variant hover:border-cx-primary/50"
            }`}
          >
            With Login
          </button>
        </div>
      </div>

      {authMode === "authenticated" && (
        <div className="space-y-5 pt-2 border-t border-cx-outline-variant/20">
          {isLoggedIn && storedProfile && (
            <div className="border border-cx-primary/30 bg-cx-primary/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-mono-cx text-[11px] uppercase tracking-widest text-cx-primary font-bold">
                  Saved session available
                </p>
                <p className="font-mono-cx text-[11px] text-cx-on-surface-variant mt-1">
                  Method: {storedProfile.method} · Last used{" "}
                  {storedProfile.lastUsedAt
                    ? new Date(storedProfile.lastUsedAt).toLocaleString()
                    : "never"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onUseStoredChange(!useStored)}
                  className="font-mono-cx text-[10px] uppercase tracking-widest border border-cx-primary px-3 py-1.5 text-cx-primary"
                >
                  {useStored ? "Using Saved" : "Use Saved"}
                </button>
                <button
                  type="button"
                  disabled={disabled || profileLoading}
                  onClick={handleDeleteStored}
                  className="font-mono-cx text-[10px] uppercase tracking-widest border border-cx-outline-variant px-3 py-1.5 text-cx-on-surface-variant hover:border-cx-error hover:text-cx-error"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {!useStored && (
            <>
              <fieldset className="space-y-3">
                <legend className="font-mono-cx text-[11px] uppercase tracking-widest text-cx-on-surface-variant mb-2">
                  Authentication Method
                </legend>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="auth-method"
                    value="credentials"
                    checked={authMethod === "credentials"}
                    onChange={() => onAuthMethodChange("credentials")}
                    disabled={disabled}
                    className="mt-1 accent-cx-primary"
                  />
                  <span>
                    <span className="font-mono-cx text-[11px] uppercase tracking-widest text-cx-on-surface block">
                      Login with Credentials
                    </span>
                    <span className="font-mono-cx text-[11px] text-cx-on-surface-variant">
                      The scanner logs in automatically after the login page fully loads
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="auth-method"
                    value="session"
                    checked={authMethod === "session"}
                    onChange={() => onAuthMethodChange("session")}
                    disabled={disabled}
                    className="mt-1 accent-cx-primary"
                  />
                  <span>
                    <span className="font-mono-cx text-[11px] uppercase tracking-widest text-cx-on-surface block">
                      Import Browser Session
                      <span className="ml-2 text-cx-primary">(Recommended)</span>
                    </span>
                    <span className="font-mono-cx text-[11px] text-cx-on-surface-variant">
                      One-click import from your logged-in browser tab (HTTP or HTTPS)
                    </span>
                  </span>
                </label>
              </fieldset>

              {authMethod === "credentials" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <p className="font-mono-cx text-[10px] text-cx-on-surface-variant leading-relaxed border border-cx-outline-variant/30 bg-cx-surface p-3 mb-4">
                      Tip: open the login page in your browser and copy its full URL. For two-step logins
                      (email first, then password), the scanner will try to click Continue automatically.
                      OAuth/SSO sites should use <strong className="text-cx-primary">Import Browser Session</strong>.
                    </p>
                    <label className="scanner-auth-label" htmlFor="login-url">
                      Login Page URL
                    </label>
                    <input
                      id="login-url"
                      type="url"
                      value={loginUrl}
                      onChange={(e) => onLoginUrlChange(e.target.value)}
                      disabled={disabled}
                      placeholder="https://example.com/login"
                      className="scanner-auth-field"
                    />
                  </div>
                  <div>
                    <label className="scanner-auth-label" htmlFor="auth-username">
                      Email / Username
                    </label>
                    <input
                      id="auth-username"
                      type="text"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => onUsernameChange(e.target.value)}
                      disabled={disabled}
                      className="scanner-auth-field"
                    />
                  </div>
                  <div>
                    <label className="scanner-auth-label" htmlFor="auth-password">
                      Password
                    </label>
                    <input
                      id="auth-password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => onPasswordChange(e.target.value)}
                      disabled={disabled}
                      className="scanner-auth-field"
                    />
                  </div>
                  <div>
                    <label className="scanner-auth-label" htmlFor="user-selector">
                      Username Selector (optional)
                    </label>
                    <input
                      id="user-selector"
                      type="text"
                      value={usernameSelector}
                      onChange={(e) => onUsernameSelectorChange(e.target.value)}
                      disabled={disabled}
                      placeholder="#email"
                      className="scanner-auth-field"
                    />
                  </div>
                  <div>
                    <label className="scanner-auth-label" htmlFor="pass-selector">
                      Password Selector (optional)
                    </label>
                    <input
                      id="pass-selector"
                      type="text"
                      value={passwordSelector}
                      onChange={(e) => onPasswordSelectorChange(e.target.value)}
                      disabled={disabled}
                      placeholder="input[type=password]"
                      className="scanner-auth-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="scanner-auth-label" htmlFor="submit-selector">
                      Submit Button Selector (optional)
                    </label>
                    <input
                      id="submit-selector"
                      type="text"
                      value={submitSelector}
                      onChange={(e) => onSubmitSelectorChange(e.target.value)}
                      disabled={disabled}
                      placeholder="button[type=submit]"
                      className="scanner-auth-field"
                    />
                  </div>
                </div>
              )}

              {authMethod === "session" && (
                <div className="space-y-4 border border-cx-outline-variant/30 bg-cx-surface p-4">
                  <div className="border border-cx-outline-variant/40 bg-cx-surface-container-low p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cx-primary text-base">
                        extension
                      </span>
                      <h4 className="font-mono-cx text-[11px] font-bold uppercase tracking-widest text-cx-on-surface">
                        How to install the helper extension
                      </h4>
                      {extensionInstalled === true && (
                        <span className="ml-auto font-mono-cx text-[10px] uppercase tracking-widest text-cx-secondary">
                          Installed
                        </span>
                      )}
                    </div>

                    <p className="font-mono-cx text-[11px] text-cx-on-surface-variant leading-relaxed">
                      This small browser add-on lets AccessibilityGuard safely import your logged-in
                      cookies from the site you want to scan. Install it once in Chrome or Edge —
                      you do not need the project source code.
                    </p>

                    <a
                      href="/extensions/accessibilityguard-session-import.zip"
                      download="accessibilityguard-session-import.zip"
                      className="inline-flex items-center gap-2 font-mono-cx text-[11px] font-bold uppercase tracking-widest border border-cx-primary text-cx-primary px-4 py-2.5 hover:bg-cx-primary hover:text-cx-on-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      Download extension (ZIP)
                    </a>

                    <ol className="list-decimal list-outside ml-4 space-y-2 font-mono-cx text-[11px] text-cx-on-surface-variant leading-relaxed">
                      <li>
                        Click <strong className="text-cx-on-surface">Download extension (ZIP)</strong>{" "}
                        above and save the file to your computer.
                      </li>
                      <li>
                        Right-click the downloaded ZIP →{" "}
                        <strong className="text-cx-on-surface">Extract All…</strong> (Windows) or
                        double-click to unzip (Mac). You should get a folder that contains{" "}
                        <code className="text-cx-primary">manifest.json</code>.
                      </li>
                      <li>
                        Open a new browser tab and go to{" "}
                        <code className="text-cx-primary">chrome://extensions</code> (Chrome) or{" "}
                        <code className="text-cx-primary">edge://extensions</code> (Edge).
                      </li>
                      <li>
                        Turn on <strong className="text-cx-on-surface">Developer mode</strong> (switch
                        in the top-right corner).
                      </li>
                      <li>
                        Click <strong className="text-cx-on-surface">Load unpacked</strong>, then
                        choose the <strong className="text-cx-on-surface">unzipped folder</strong>{" "}
                        (the one that has <code className="text-cx-primary">manifest.json</code>{" "}
                        inside — not the ZIP file itself).
                      </li>
                      <li>
                        You should see <strong className="text-cx-on-surface">AccessibilityGuard Session Import</strong>{" "}
                        in the list. Leave it enabled.
                      </li>
                      <li>
                        In another tab, log into the website you want to scan and leave that tab open.
                      </li>
                      <li>
                        Come back here, enter that same website URL above, then click{" "}
                        <strong className="text-cx-on-surface">Import Current Session</strong>.
                      </li>
                    </ol>

                    <p className="font-mono-cx text-[10px] text-cx-on-surface-variant/80 leading-relaxed">
                      If import says the extension was not found, reload this Scanner page after
                      installing. Keep the ZIP/extracted folder — Chrome may ask you to reload the
                      extension after a browser update.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      type="button"
                      disabled={disabled || importingSession}
                      onClick={handleImportSession}
                      className="font-mono-cx text-[11px] font-bold uppercase tracking-widest bg-cx-primary text-cx-on-primary px-5 py-3 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                      {importingSession ? "Importing Session..." : "Import Current Session"}
                    </button>
                    {sessionMeta && (
                      <button
                        type="button"
                        disabled={disabled || importingSession}
                        onClick={handleClearImportedSession}
                        className="font-mono-cx text-[10px] uppercase tracking-widest border border-cx-outline-variant px-3 py-2 text-cx-on-surface-variant hover:border-cx-error hover:text-cx-error"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {extensionInstalled === false && (
                    <p className="font-mono-cx text-[11px] text-cx-error leading-relaxed">
                      Extension not detected yet. Download and install it using the steps above,
                      then reload this page and try again.
                    </p>
                  )}

                  {sessionMeta && (
                    <div className="flex items-center gap-2 border border-cx-secondary/40 bg-cx-secondary/10 px-3 py-2">
                      <span
                        className="material-symbols-outlined text-cx-secondary text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                      <span className="font-mono-cx text-[11px] text-cx-on-surface">
                        Session ready · {sessionMeta.cookieCount} cookies · {sessionMeta.storageKeys}{" "}
                        storage keys
                        {sessionMeta.protocol ? ` · ${sessionMeta.protocol.replace(":", "")}` : ""}
                      </span>
                    </div>
                  )}

                  {sessionImportError && (
                    <p className="text-[11px] text-cx-error">{sessionImportError}</p>
                  )}
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveForReuse}
                  onChange={(e) => onSaveForReuseChange(e.target.checked)}
                  disabled={disabled || !isLoggedIn}
                  className="accent-cx-primary"
                />
                <span className="font-mono-cx text-[11px] text-cx-on-surface-variant">
                  {isLoggedIn
                    ? "Encrypt and save authentication for future scans on this domain"
                    : "Sign in to save authentication for reuse across scans"}
                </span>
              </label>
            </>
          )}

          <p className="font-mono-cx text-[10px] text-cx-on-surface-variant/80 leading-relaxed">
            Credentials and session data are encrypted at rest. Passwords and cookies are never logged
            or displayed after import.
          </p>

          {profileMessage && (
            <p className="font-mono-cx text-[11px] text-cx-primary">{profileMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
