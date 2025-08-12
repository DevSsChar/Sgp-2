"use client";

import { useMemo, useState } from "react";

const ALL_IMPACTS = ["critical", "serious", "moderate", "minor"];
const RULE_PRESETS = [
  { id: "color-contrast", label: "Color contrast" },
  { id: "image-alt", label: "Image alt" },
  { id: "label", label: "Form label" },
  { id: "heading-order", label: "Heading order" },
  { id: "link-name", label: "Link name" },
  { id: "button-name", label: "Button name" },
];
const DISABLE_RULE_PRESETS = [
  { id: "region", label: "Region (no landmark)" },
  { id: "landmark-one-main", label: "Single main landmark" },
  { id: "page-has-heading-one", label: "Has H1" },
];

function ImpactBadge({ impact }) {
  const color =
    impact === "critical"
      ? "bg-red-100 text-red-700"
      : impact === "serious"
      ? "bg-orange-100 text-orange-700"
      : impact === "moderate"
      ? "bg-amber-100 text-amber-700"
      : "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {impact || "needs-review"}
    </span>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-4">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="mt-1 text-xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}

export default function ScannerPage() {
  const [url, setUrl] = useState("");
  const [profile, setProfile] = useState("accurate"); // 'fast' | 'accurate'
  const [selectedImpacts, setSelectedImpacts] = useState(new Set(ALL_IMPACTS));
  const [selectedRules, setSelectedRules] = useState(
    new Set(["color-contrast", "image-alt", "heading-order", "label"])
  );
  const [disabledRules, setDisabledRules] = useState(new Set(["region", "landmark-one-main"]));
  const [includeIncomplete, setIncludeIncomplete] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const impactsArray = useMemo(() => Array.from(selectedImpacts), [selectedImpacts]);
  const rulesArray = useMemo(() => Array.from(selectedRules), [selectedRules]);
  const disableRulesArray = useMemo(() => Array.from(disabledRules), [disabledRules]);

  function toggleSet(setter, currentSet, key) {
    const next = new Set(currentSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setter(next);
  }

  function setAllImpacts(on) {
    setSelectedImpacts(on ? new Set(ALL_IMPACTS) : new Set());
  }
  function setAllRules(on) {
    setSelectedRules(on ? new Set(RULE_PRESETS.map((r) => r.id)) : new Set());
  }
  function setAllDisableRules(on) {
    setDisabledRules(on ? new Set(DISABLE_RULE_PRESETS.map((r) => r.id)) : new Set());
  }

  async function handleScan(e) {
    e?.preventDefault?.();
    setError("");
    setResult(null);
    if (!url || !/^https?:\/\//i.test(url)) {
      setError("Enter a valid URL starting with http(s)://");
      return;
    }
    setIsScanning(true);
    try {
      const body = {
        url: url.trim(),
        rules: rulesArray.length ? rulesArray : undefined,
        disableRules: disableRulesArray.length ? disableRulesArray : undefined,
        impacts: impactsArray.length ? impactsArray : undefined,
        includeIncomplete,
        headful: profile === "accurate",
        waitMs: profile === "accurate" ? 4000 : 1500,
        waitUntil: profile === "accurate" ? "networkidle" : "domcontentloaded",
        timeoutMs: profile === "accurate" ? 45000 : 20000,
      };

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Scan failed with ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err?.message || "Scan failed");
    } finally {
      setIsScanning(false);
    }
  }

  function downloadJson(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  }

  const totalViolations = result?.violations?.length || 0;
  const passedCount = result?.passed ?? 0;
  const incompleteCount = result?.incomplete ?? 0;
  const score = result?.score ?? (totalViolations ? Math.max(0, 100 - totalViolations * 10) : 100);

  return (
    <section className="mt-20 md:mt-24 min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-8 md:py-10">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#00483a]">Accessibility Scanner</h1>
          <p className="text-gray-700 mt-1">
            Audit a page with axe. Choose Fast or Accurate mode and refine checks below.
          </p>
        </header>

        <form
          onSubmit={handleScan}
          className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-5 md:p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-800">URL to scan</label>
            <input
              type="url"
              placeholder="https://mini-project-1-xi.vercel.app/dashboard"
              className="mt-1 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent px-3 py-2 text-gray-900 placeholder-gray-400"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-800">Profile</label>
              <div className="mt-2 inline-flex rounded-md border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  className={`px-3 py-2 text-sm ${
                    profile === "fast" ? "bg-gray-900 text-white" : "bg-white text-gray-700"
                  }`}
                  onClick={() => setProfile("fast")}
                  aria-pressed={profile === "fast"}
                >
                  Fast
                </button>
                <button
                  type="button"
                  className={`px-3 py-2 text-sm border-l border-gray-300 ${
                    profile === "accurate" ? "bg-gray-900 text-white" : "bg-white text-gray-700"
                  }`}
                  onClick={() => setProfile("accurate")}
                  aria-pressed={profile === "accurate"}
                >
                  Accurate
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Fast: headless, short waits. Accurate: headful-like waits (recommended).
              </p>
            </div>

            <fieldset className="col-span-1">
              <legend className="block text-sm font-medium text-gray-800">Impacts</legend>
              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
                {ALL_IMPACTS.map((imp) => (
                  <label key={imp} className="inline-flex items-center gap-2 text-sm text-gray-800">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedImpacts.has(imp)}
                      onChange={() => toggleSet(setSelectedImpacts, selectedImpacts, imp)}
                    />
                    {imp}
                  </label>
                ))}
              </div>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAllImpacts(true)}
                  className="text-xs text-[#00d4ff] hover:underline"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={() => setAllImpacts(false)}
                  className="text-xs text-[#00d4ff] hover:underline"
                >
                  Clear all
                </button>
              </div>
            </fieldset>

            <div className="col-span-1 flex items-end">
              <label className="inline-flex items-center gap-2 text-sm text-gray-800">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={includeIncomplete}
                  onChange={(e) => setIncludeIncomplete(e.target.checked)}
                />
                Include “incomplete” as needs-review
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <fieldset>
              <legend className="block text-sm font-medium text-gray-800">Only run rules</legend>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
                {RULE_PRESETS.map((r) => (
                  <label key={r.id} className="inline-flex items-center gap-2 text-sm text-gray-800">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedRules.has(r.id)}
                      onChange={() => toggleSet(setSelectedRules, selectedRules, r.id)}
                    />
                    {r.label}
                  </label>
                ))}
              </div>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAllRules(true)}
                  className="text-xs text-[#00d4ff] hover:underline"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={() => setAllRules(false)}
                  className="text-xs text-[#00d4ff] hover:underline"
                >
                  Clear all
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend className="block text-sm font-medium text-gray-800">Disable rules</legend>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
                {DISABLE_RULE_PRESETS.map((r) => (
                  <label key={r.id} className="inline-flex items-center gap-2 text-sm text-gray-800">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={disabledRules.has(r.id)}
                      onChange={() => toggleSet(setDisabledRules, disabledRules, r.id)}
                    />
                    {r.label}
                  </label>
                ))}
              </div>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAllDisableRules(true)}
                  className="text-xs text-[#00d4ff] hover:underline"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={() => setAllDisableRules(false)}
                  className="text-xs text-[#00d4ff] hover:underline"
                >
                  Clear all
                </button>
              </div>
            </fieldset>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isScanning}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#00d4ff] text-white font-semibold hover:bg-[#00d4ff]/90 disabled:opacity-60 h-10 px-4"
            >
              {isScanning ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
                  </svg>
                  Scanning…
                </>
              ) : (
                "Run Scan"
              )}
            </button>

            {result && (
              <button
                type="button"
                onClick={() =>
                  downloadJson(
                    result,
                    `accessibility-report-${new Date().toISOString().slice(0, 10)}.json`
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50 h-10 px-4"
              >
                Download JSON
              </button>
            )}
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>

        {result && (
          <div className="mt-8 space-y-6">
            <div className="grid sm:grid-cols-4 gap-4">
              <Stat label="Score" value={score} />
              <Stat label="Violations" value={result?.violations?.length ?? 0} />
              <Stat label="Passed" value={passedCount} />
              <Stat label="Incomplete" value={incompleteCount} />
            </div>

            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Violations</h2>
                <span className="text-sm text-gray-600">
                  {result?.url ? new URL(result.url).pathname : ""}
                </span>
              </div>

              {totalViolations === 0 ? (
                <p className="text-gray-700">No violations found.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {result.violations.map((v, i) => (
                    <li key={`${v.id}-${i}`} className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <ImpactBadge impact={v.impact} />
                            <span className="font-medium text-gray-900">{v.id}</span>
                          </div>
                          <p className="text-sm text-gray-800 mt-1">{v.description}</p>
                          <a
                            href={v.helpUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-[#00d4ff] hover:underline"
                          >
                            {v.help}
                          </a>
                          {Array.isArray(v.tags) && v.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {v.tags.slice(0, 6).map((t) => (
                                <span
                                  key={t}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-gray-100 text-gray-700"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0 text-sm text-gray-600">
                          {v.nodes?.length ?? 0} nodes
                        </div>
                      </div>

                      {Array.isArray(v.nodes) && v.nodes.length > 0 && (
                        <details className="mt-3">
                          <summary className="cursor-pointer text-sm text-gray-800">
                            View affected nodes
                          </summary>
                          <div className="mt-2 space-y-3">
                            {v.nodes.slice(0, 5).map((n, ni) => (
                              <div
                                key={ni}
                                className="rounded-md bg-gray-50 border border-gray-200 p-3 text-sm"
                              >
                                <div className="text-gray-900">
                                  <span className="font-mono text-xs bg-white border px-1 py-0.5 rounded">
                                    {(n.target || []).join(", ")}
                                  </span>
                                </div>
                                {n.failureSummary && (
                                  <p className="mt-1 text-gray-800">{n.failureSummary}</p>
                                )}
                                {n.html && (
                                  <pre className="mt-2 overflow-auto rounded bg-white border p-2 text-xs text-gray-900">
                                    {n.html}
                                  </pre>
                                )}
                              </div>
                            ))}
                            {v.nodes.length > 5 && (
                              <p className="text-xs text-gray-600">
                                +{v.nodes.length - 5} more nodes not shown
                              </p>
                            )}
                          </div>
                        </details>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}