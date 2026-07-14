"use client";

import { useEffect, useState } from "react";

const DEMO_URLS = [
  [
    { text: "https://", type: "protocol" },
    { text: "example.com", type: "host" },
  ],
  [
    { text: "https://", type: "protocol" },
    { text: "myshop.io", type: "host" },
    { text: "/checkout", type: "path" },
  ],
  [
    { text: "https://", type: "protocol" },
    { text: "startup.app", type: "host" },
    { text: "/dashboard", type: "path" },
  ],
  [
    { text: "https://", type: "protocol" },
    { text: "university.edu", type: "host" },
    { text: "/portal", type: "path" },
  ],
  [
    { text: "https://", type: "protocol" },
    { text: "gov.services", type: "host" },
    { text: "/accessibility", type: "path" },
  ],
];

const QUICK_TARGETS = [
  "https://example.com",
  "https://myshop.io",
  "https://startup.app",
  "https://wikipedia.org",
];

const WORD_STYLES = {
  protocol: "text-cx-secondary-container ag-word-glow",
  host: "text-cx-on-surface",
  path: "text-cx-primary/70",
};

export default function CyberUrlInput({ value, onChange, onSubmit }) {
  const [focused, setFocused] = useState(false);
  const [urlIndex, setUrlIndex] = useState(0);
  const [visibleWords, setVisibleWords] = useState(0);
  const [phase, setPhase] = useState("building");

  const currentTokens = DEMO_URLS[urlIndex];
  const showOverlay = !value && !focused;

  useEffect(() => {
    if (!showOverlay) return;

    let timeout;

    if (phase === "building") {
      if (visibleWords < currentTokens.length) {
        timeout = setTimeout(() => setVisibleWords((w) => w + 1), 520);
      } else {
        timeout = setTimeout(() => setPhase("holding"), 280);
      }
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("exiting"), 2400);
    } else if (phase === "exiting") {
      if (visibleWords > 0) {
        timeout = setTimeout(() => setVisibleWords((w) => w - 1), 180);
      } else {
        timeout = setTimeout(() => {
          setUrlIndex((i) => (i + 1) % DEMO_URLS.length);
          setPhase("building");
        }, 320);
      }
    }

    return () => clearTimeout(timeout);
  }, [showOverlay, phase, visibleWords, currentTokens.length, urlIndex]);

  useEffect(() => {
    if (focused || value) {
      setVisibleWords(0);
      setPhase("building");
    }
  }, [focused, value]);

  const applyQuickTarget = (url) => {
    onChange({ target: { value: url } });
  };

  return (
    <div className="space-y-3">
      <form
        onSubmit={onSubmit}
        className="relative overflow-hidden group flex items-stretch max-w-2xl border border-cx-outline-variant/50 bg-cx-surface/25 backdrop-blur-sm ag-input-glow ag-input-scan"
      >
        <span className="hidden sm:flex items-center gap-1.5 pl-3 pr-2 text-cx-primary/60 font-mono-cx text-[10px] uppercase tracking-widest border-r border-cx-outline-variant/30 shrink-0">
          <span className="ag-target-dot w-1.5 h-1.5 rounded-full bg-cx-secondary-container" />
          Target
        </span>

        <div className="relative flex-1 min-w-0 py-2">
          <input
            type="text"
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Enter website URL to scan"
            required
            className="ag-brutalist-input ag-brutalist-input--compact w-full px-3 text-sm md:text-base font-mono-cx focus:ring-0 text-cx-on-surface border-0 bg-transparent relative z-10"
          />

          {showOverlay && (
            <div
              className="absolute inset-0 flex items-center flex-wrap gap-0 px-3 pointer-events-none overflow-hidden"
              aria-hidden="true"
            >
              {currentTokens.slice(0, visibleWords).map((token, i) => (
                <span
                  key={`${urlIndex}-${i}-${token.text}`}
                  className={`font-mono-cx text-sm md:text-base tracking-tight ag-placeholder-word ${WORD_STYLES[token.type]} ${
                    i === visibleWords - 1 ? "ag-word-pop" : ""
                  }`}
                >
                  {token.text}
                </span>
              ))}
              <span className="ag-type-cursor font-mono-cx text-cx-secondary-container text-sm ml-0.5 shrink-0">
                ▌
              </span>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-3 md:px-4 border-l border-cx-outline-variant/30 text-cx-primary hover:bg-cx-primary/10 hover:text-cx-secondary-container dark:hover:text-cx-secondary-container transition-colors shrink-0"
        >
          <span className="font-mono-cx text-[9px] tracking-widest font-bold uppercase hidden sm:inline">
            Scan
          </span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>

        <div className="absolute -bottom-5 left-0 right-0 hidden sm:flex items-center justify-between px-1">
          <span className="font-mono-cx text-[9px] uppercase tracking-[0.25em] text-cx-primary/35 ag-status-flicker">
            {showOverlay
              ? phase === "building"
                ? "acquiring target coordinates..."
                : phase === "holding"
                  ? "target preview locked"
                  : "clearing channel..."
              : focused
                ? "input channel open — enter URL"
                : "target locked"}
          </span>
          <span className="font-mono-cx text-[9px] uppercase tracking-widest text-cx-outline-variant/40">
            proto/WCAG-2.1
          </span>
        </div>
      </form>

      {/* Quick-pick dummy targets */}
      <div className="flex flex-wrap items-center gap-2 max-w-2xl">
        <span className="font-mono-cx text-[9px] uppercase tracking-widest text-cx-outline-variant/50 shrink-0">
          Quick scan:
        </span>
        {QUICK_TARGETS.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => applyQuickTarget(url)}
            className="ag-quick-target font-mono-cx text-[10px] md:text-[11px] px-2.5 py-1 border border-cx-outline-variant/35 text-cx-on-surface-variant hover:text-cx-primary hover:border-cx-primary/50 hover:bg-cx-primary/5 dark:text-cx-on-surface-variant dark:hover:text-cx-secondary-container transition-all"
          >
            {url.replace("https://", "")}
          </button>
        ))}
      </div>
    </div>
  );
}
