"use client";

import ImpactBadge from "@/components/impact/ImpactBadge";
import { useState } from "react";

function SectionLabel({ children }) {
  return (
    <span className="font-mono-cx text-[10px] uppercase tracking-[0.25em] text-cx-primary/70">
      {children}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = { high: "critical", medium: "serious", low: "minor" };
  const impact = map[priority?.toLowerCase()] || "needs-review";
  return <ImpactBadge impact={impact} className="text-[9px]" />;
}

export default function AIFixSidebar({ violations, scanUrl, isOpen, onClose }) {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const violationCount = violations?.length || 0;

  const generateAIFixes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ violations, url: scanUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to generate AI suggestions");
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error("AI Fix Error:", err);
      if (err.message.includes("ECONNREFUSED")) {
        setError("Ollama is not running. Please start Ollama locally on port 11434.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[55] pointer-events-none">
      {/* Backdrop — below navbar, above footer */}
      <button
        type="button"
        aria-label="Close AI fix panel"
        onClick={onClose}
        className="absolute top-14 right-0 bottom-10 left-0 bg-cx-bg/70 backdrop-blur-sm pointer-events-auto"
      />

      {/* Panel */}
      <aside
        className="absolute top-14 right-0 bottom-10 w-full max-w-xl flex flex-col pointer-events-auto border-l bg-cx-surface-container-low border-cx-outline-variant/40 backdrop-blur-xl"
      >
        {/* Header */}
        <div
          className="shrink-0 border-b border-cx-outline-variant/30 bg-cx-surface-container px-5 py-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-cx-secondary-container animate-pulse shrink-0" />
                <SectionLabel>Remediation engine</SectionLabel>
              </div>
              <h2 className="font-mono-cx text-lg font-bold uppercase tracking-tight text-cx-on-surface">
                AI Fix Protocol
              </h2>
              <p className="font-mono-cx text-[11px] text-cx-on-surface-variant mt-1 truncate">
                {scanUrl || "No target URL"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="shrink-0 p-2 border border-cx-outline-variant/40 text-cx-on-surface-variant hover:text-cx-primary hover:border-cx-primary/50 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="border border-cx-outline-variant/30 px-3 py-2 bg-cx-surface/50">
              <div className="font-mono-cx text-[9px] uppercase tracking-widest text-cx-on-surface-variant">
                Violations
              </div>
              <div className="font-mono-cx text-lg font-bold text-cx-primary">{violationCount}</div>
            </div>
            <div className="border border-cx-outline-variant/30 px-3 py-2 bg-cx-surface/50">
              <div className="font-mono-cx text-[9px] uppercase tracking-widest text-cx-on-surface-variant">
                Model
              </div>
              <div className="font-mono-cx text-xs font-semibold text-cx-on-surface truncate">Qwen 2.5</div>
            </div>
            <div className="border border-cx-outline-variant/30 px-3 py-2 bg-cx-surface/50">
              <div className="font-mono-cx text-[9px] uppercase tracking-widest text-cx-on-surface-variant">
                Status
              </div>
              <div className="font-mono-cx text-xs font-semibold text-cx-secondary-container uppercase">
                {loading ? "Running" : suggestions ? "Ready" : "Idle"}
              </div>
            </div>
          </div>

          {!suggestions && !loading && (
            <button
              type="button"
              onClick={generateAIFixes}
              disabled={!violations || violations.length === 0}
              className="mt-4 w-full btn-cx-gradient py-2.5 px-4 text-sm font-semibold uppercase tracking-widest font-mono-cx hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">bolt</span>
              Generate fix suggestions
            </button>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative w-14 h-14 mb-6">
                <div className="absolute inset-0 border-2 border-cx-outline-variant/30" />
                <div className="absolute inset-0 border-2 border-t-cx-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-cx-primary text-2xl">memory</span>
                </div>
              </div>
              <p className="font-mono-cx text-sm font-semibold uppercase tracking-widest text-cx-on-surface">
                Analyzing violations
              </p>
              <p className="font-mono-cx text-xs text-cx-on-surface-variant mt-2 max-w-xs">
                Neural remediation engine is processing WCAG failure patterns...
              </p>
            </div>
          )}

          {error && (
            <div className="border border-cx-error/40 bg-cx-error/10 p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-cx-error shrink-0">error</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-mono-cx text-sm font-bold uppercase tracking-wide text-cx-error mb-2">
                    Generation failed
                  </h3>
                  <p className="font-mono-cx text-xs text-cx-on-surface-variant leading-relaxed mb-4">
                    {error}
                  </p>
                  {error.includes("Ollama") && (
                    <div className="border border-cx-outline-variant/30 bg-cx-surface/60 p-3 text-xs font-mono-cx text-cx-on-surface-variant">
                      <p className="uppercase tracking-widest text-[10px] text-cx-primary mb-2">
                        Quick fix
                      </p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Open terminal</li>
                        <li>
                          Run:{" "}
                          <code className="text-cx-secondary-container">ollama serve</code>
                        </li>
                        <li>Wait for ready state</li>
                        <li>Retry generation</li>
                      </ol>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={generateAIFixes}
                    className="mt-3 px-4 py-2 border border-cx-error/50 text-cx-error font-mono-cx text-xs uppercase tracking-widest hover:bg-cx-error/10 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {suggestions && (
            <div className="space-y-5">
              {/* Summary */}
              <section className="border border-cx-primary/25 bg-cx-primary/5 p-4">
                <SectionLabel>Assessment summary</SectionLabel>
                <p className="font-mono-cx text-sm text-cx-on-surface-variant leading-relaxed mt-2">
                  {suggestions.summary}
                </p>
              </section>

              {/* Fixes */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <SectionLabel>Fix recommendations</SectionLabel>
                  <span className="font-mono-cx text-[10px] text-cx-on-surface-variant">
                    {suggestions.fixes?.length || 0} rules
                  </span>
                </div>

                <div className="space-y-4">
                  {suggestions.fixes?.map((fix, index) => (
                    <article
                      key={`${fix.rule}-${index}`}
                      className="border border-cx-outline-variant/30 bg-cx-surface/40 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                        <code className="font-mono-cx text-xs px-2 py-1 border border-cx-outline-variant/40 text-cx-primary bg-cx-surface/60">
                          {fix.rule}
                        </code>
                        <div className="flex items-center gap-2">
                          {fix.affectedElements != null && (
                            <span className="font-mono-cx text-[9px] uppercase tracking-widest text-cx-on-surface-variant border border-cx-outline-variant/30 px-2 py-0.5">
                              {fix.affectedElements} nodes
                            </span>
                          )}
                          <PriorityBadge priority={fix.priority} />
                        </div>
                      </div>

                      {fix.userImpact && (
                        <div className="mb-3">
                          <p className="font-mono-cx text-[10px] uppercase tracking-widest text-cx-on-surface-variant mb-1">
                            User impact
                          </p>
                          <p className="font-mono-cx text-xs text-cx-on-surface leading-relaxed">
                            {fix.userImpact}
                          </p>
                        </div>
                      )}

                      <div className="mb-3">
                        <p className="font-mono-cx text-[10px] uppercase tracking-widest text-cx-on-surface-variant mb-1">
                          Explanation
                        </p>
                        <p className="font-mono-cx text-xs text-cx-on-surface-variant leading-relaxed">
                          {fix.explanation}
                        </p>
                      </div>

                      {fix.steps?.length > 0 && (
                        <div className="mb-3">
                          <p className="font-mono-cx text-[10px] uppercase tracking-widest text-cx-on-surface-variant mb-2">
                            Remediation steps
                          </p>
                          <ol className="font-mono-cx text-xs text-cx-on-surface-variant space-y-1.5 list-decimal list-inside">
                            {fix.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="leading-relaxed">
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {fix.codeExample && (
                        <div className="mb-3">
                          <p className="font-mono-cx text-[10px] uppercase tracking-widest text-cx-on-surface-variant mb-2">
                            Code patch
                          </p>
                          <pre className="p-3 text-xs overflow-x-auto border border-cx-outline-variant/30 bg-cx-bg text-cx-secondary-container font-mono-cx leading-relaxed">
                            <code>{fix.codeExample}</code>
                          </pre>
                        </div>
                      )}

                      {fix.testingTips && (
                        <div className="mb-3">
                          <p className="font-mono-cx text-[10px] uppercase tracking-widest text-cx-on-surface-variant mb-1">
                            Verification
                          </p>
                          <p className="font-mono-cx text-xs text-cx-on-surface-variant leading-relaxed">
                            {fix.testingTips}
                          </p>
                        </div>
                      )}

                      {fix.commonMistakes && (
                        <div className="mb-3">
                          <p className="font-mono-cx text-[10px] uppercase tracking-widest text-cx-on-surface-variant mb-1">
                            Avoid
                          </p>
                          <p className="font-mono-cx text-xs text-cx-on-surface-variant leading-relaxed">
                            {fix.commonMistakes}
                          </p>
                        </div>
                      )}

                      <div className="pt-3 border-t border-cx-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="font-mono-cx text-[10px] text-cx-on-surface-variant">
                          WCAG:{" "}
                          <a
                            href={
                              fix.wcagReference?.startsWith("http")
                                ? fix.wcagReference
                                : `https://www.w3.org/WAI/WCAG21/Understanding/${fix.wcagReference}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cx-primary hover:underline ml-1"
                          >
                            {fix.wcagReference}
                          </a>
                        </div>
                        {fix.additionalResources && (
                          <a
                            href={fix.additionalResources}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono-cx text-[10px] uppercase tracking-widest text-cx-primary hover:text-cx-secondary-container transition-colors flex items-center gap-1"
                          >
                            Resources
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {suggestions.generalRecommendations?.length > 0 && (
                <section className="border border-cx-secondary-container/30 bg-cx-secondary-container/5 p-4">
                  <SectionLabel>General recommendations</SectionLabel>
                  <ul className="mt-3 space-y-2">
                    {suggestions.generalRecommendations.map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 font-mono-cx text-xs text-cx-on-surface-variant"
                      >
                        <span className="text-cx-secondary-container shrink-0">›</span>
                        <span className="leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {suggestions.priorityOrder && (
                <section className="border border-cx-outline-variant/30 p-4">
                  <SectionLabel>Implementation order</SectionLabel>
                  <p className="font-mono-cx text-xs text-cx-on-surface-variant leading-relaxed mt-2">
                    {suggestions.priorityOrder}
                  </p>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {suggestions && (
          <div
            className="shrink-0 border-t border-cx-outline-variant/30 bg-cx-surface-container px-5 py-3 flex gap-2"
          >
            <button
              type="button"
              onClick={generateAIFixes}
              className="flex-1 py-2 px-3 border border-dashed border-cx-outline-variant text-cx-on-surface-variant font-mono-cx text-[10px] uppercase tracking-widest hover:border-cx-primary hover:text-cx-primary transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              Regenerate
            </button>
            <button
              type="button"
              onClick={() => {
                const content = JSON.stringify(suggestions, null, 2);
                const blob = new Blob([content], { type: "application/json" });
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = "accessibility-fixes.json";
                a.click();
                URL.revokeObjectURL(blobUrl);
              }}
              className="py-2 px-4 btn-cx-gradient font-mono-cx text-[10px] uppercase tracking-widest hover:opacity-90 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Export
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
