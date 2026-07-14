"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { generateScanReportPDF } from "@/utils/pdfGenerator";
import { useTheme } from "./ThemeContext";
import AIFixSidebar from "./AIFixSidebar";
import ImpactBadge from "./impact/ImpactBadge";

const IMPACT_COLORS = {
  critical: { text: "text-[#FF4B4B]", border: "border-[#FF4B4B]", bg: "bg-[#FF4B4B]" },
  serious: { text: "text-[#FFB800]", border: "border-[#FFB800]", bg: "bg-[#FFB800]" },
  moderate: { text: "text-cx-primary", border: "border-cx-primary", bg: "bg-cx-primary" },
  minor: { text: "text-cx-outline", border: "border-cx-outline", bg: "bg-cx-outline" },
  "needs-review": { text: "text-cx-outline-variant", border: "border-cx-outline-variant", bg: "bg-cx-outline-variant" },
};

function getPagePath(rawUrl) {
  try {
    return new URL(rawUrl).pathname || rawUrl;
  } catch {
    return rawUrl;
  }
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(
      new Date(dateString)
    );
  } catch {
    return dateString;
  }
}

function formatRelativeTime(dateString) {
  if (!dateString) return "—";
  try {
    const diff = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch {
    return "—";
  }
}

function getViolationStats(report) {
  const stats = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
    "needs-review": 0,
    totalNodes: 0,
    totalViolations: 0,
  };

  if (!report?.pages) return stats;

  report.pages.forEach((page) => {
    (page.violations || []).forEach((violation) => {
      const impact = violation.impact || "needs-review";
      const nodeCount = violation.nodes?.length || 1;
      stats[impact] = (stats[impact] || 0) + nodeCount;
      stats.totalNodes += nodeCount;
      stats.totalViolations += 1;
    });
  });

  return stats;
}

function computeHealthScore(report) {
  const issues = report?.summary?.totalNodes || getViolationStats(report).totalNodes;
  const nodes = Math.max(issues * 10, report?.summary?.totalNodes || 50, 50);
  if (nodes <= 0) return 100;
  return Math.round(Math.max(5, Math.min(100, 100 - (issues / nodes) * 120)));
}

function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B+";
  if (score >= 70) return "B-";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

function getPassedChecks(report) {
  if (!report?.pages) return 0;
  return report.pages.reduce((sum, p) => sum + (p.meta?.passesCount || 0), 0);
}

function aggregateViolations(report) {
  const map = new Map();

  (report?.pages || []).forEach((page) => {
    (page.violations || []).forEach((violation) => {
      const key = violation.id;
      const existing = map.get(key);
      const nodeCount = violation.nodes?.length || 1;

      if (existing) {
        existing.occurrences += nodeCount;
        existing.pages.add(page.url);
        existing.instances.push({ page, violation });
      } else {
        map.set(key, {
          ...violation,
          occurrences: nodeCount,
          pages: new Set([page.url]),
          instances: [{ page, violation }],
        });
      }
    });
  });

  return Array.from(map.values()).sort((a, b) => {
    const order = { critical: 0, serious: 1, moderate: 2, minor: 3, "needs-review": 4 };
    const ai = order[a.impact] ?? 5;
    const bi = order[b.impact] ?? 5;
    if (ai !== bi) return ai - bi;
    return b.occurrences - a.occurrences;
  });
}

function getDomainLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url || "SCAN";
  }
}

function ImpactStatCard({ impact, count, icon }) {
  const colors = IMPACT_COLORS[impact] || IMPACT_COLORS.moderate;
  return (
    <div
      className={`hud-panel border bg-cx-surface-container flex flex-col justify-between h-48 border-l-4 ${colors.border}`}
    >
      <div>
        <span className={`material-symbols-outlined ${colors.text} mb-2`} style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
        <div className="font-mono-cx text-[11px] uppercase tracking-widest text-cx-on-surface-variant">
          {impact === "needs-review" ? "NEEDS REVIEW" : `${impact.toUpperCase()} IMPACT`}
        </div>
      </div>
      <div className={`font-mono-cx text-4xl font-bold leading-none ${colors.text}`}>{count}</div>
    </div>
  );
}

function HealthScoreRing({ score }) {
  const circumference = 364.4;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="hud-panel border p-6 bg-cx-primary-container text-cx-on-primary-container flex flex-col items-center justify-center text-center">
      <div className="font-mono-cx text-[11px] font-bold mb-4 tracking-widest uppercase">Health Score</div>
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            className="opacity-20"
            cx="64"
            cy="64"
            fill="transparent"
            r="58"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle
            cx="64"
            cy="64"
            fill="transparent"
            r="58"
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeWidth="8"
          />
        </svg>
        <div className="absolute font-mono-cx text-4xl font-bold">{score}</div>
      </div>
      <div className="mt-4 font-mono-cx text-[11px] font-medium">{getGrade(score)} GRADE</div>
    </div>
  );
}

function ViolationDensityChart({ pages }) {
  const chartData = useMemo(() => {
    return (pages || []).slice(0, 8).map((page) => {
      const violations = page.violations || [];
      const count = violations.reduce((sum, v) => sum + (v.nodes?.length || 1), 0);
      return { label: getPagePath(page.url), count };
    });
  }, [pages]);

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="md:col-span-3 hud-panel border p-6 bg-cx-surface-container relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-mono-cx text-xl font-semibold text-cx-primary">VIOLATION DENSITY</h3>
          <p className="font-mono-cx text-[11px] text-cx-on-surface-variant">
            Issue distribution across scanned pages
          </p>
        </div>
      </div>
      <div className="h-64 w-full flex items-end gap-1">
        {chartData.map((item, i) => {
          const height = Math.max(8, (item.count / maxCount) * 100);
          const hasCritical = (pages[i]?.violations || []).some((v) => v.impact === "critical");
          const hasSerious = (pages[i]?.violations || []).some((v) => v.impact === "serious");
          const barColor = hasCritical
            ? "bg-[#FF4B4B]/20 border-[#FF4B4B] hover:bg-[#FF4B4B]/40"
            : hasSerious
              ? "bg-[#FFB800]/20 border-[#FFB800] hover:bg-[#FFB800]/40"
              : "bg-cx-primary/20 border-cx-primary hover:bg-cx-primary/40";

          return (
            <div
              key={item.label + i}
              className={`flex-1 border-t transition-all ${barColor}`}
              style={{ height: `${height}%` }}
              title={`${item.label}: ${item.count} issues`}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-4 font-mono-cx text-[10px] text-cx-on-surface-variant uppercase tracking-tighter overflow-hidden">
        {chartData.map((item, i) => (
          <span key={item.label + i} className="truncate max-w-[12%]">
            {item.label.replace(/^\//, "").slice(0, 8) || "root"}
          </span>
        ))}
      </div>
    </div>
  );
}

function SidebarNavItem({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-center gap-3 transition-all text-left ${
        active
          ? "border-l-4 border-cx-secondary-fixed text-cx-primary bg-cx-surface-variant/10"
          : "text-cx-on-surface-variant hover:text-cx-on-surface hover:bg-cx-surface-variant/30"
      }`}
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
      <span className="font-mono-cx text-[13px]">{label}</span>
    </button>
  );
}

export default function ScanResultScreen({ report, breadcrumbSource = "history" }) {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("summary");
  const [sidebarSection, setSidebarSection] = useState("analysis");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(report?.pages?.[0] || null);
  const [pageSearch, setPageSearch] = useState("");
  const [filterImpact, setFilterImpact] = useState("all");
  const [expandedViolations, setExpandedViolations] = useState({});
  const [showAIFix, setShowAIFix] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const violationStats = useMemo(() => getViolationStats(report), [report]);
  const healthScore = useMemo(() => computeHealthScore(report), [report]);
  const passedChecks = useMemo(() => getPassedChecks(report), [report]);
  const aggregatedViolations = useMemo(() => aggregateViolations(report), [report]);

  const allViolations = useMemo(
    () =>
      (report?.pages || []).flatMap((p) =>
        (p.violations || []).map((v) => ({ ...v, pageUrl: p.url }))
      ),
    [report]
  );

  const filteredPages = useMemo(() => {
    if (!report?.pages) return [];
    if (!pageSearch) return report.pages;
    const term = pageSearch.toLowerCase();
    return report.pages.filter((p) => {
      try {
        return getPagePath(p.url).toLowerCase().includes(term) || p.url.toLowerCase().includes(term);
      } catch {
        return p.url.toLowerCase().includes(term);
      }
    });
  }, [report?.pages, pageSearch]);

  const filteredAggregatedViolations = useMemo(() => {
    return aggregatedViolations.filter((v) => {
      if (filterImpact !== "all" && v.impact !== filterImpact) return false;
      return true;
    });
  }, [aggregatedViolations, filterImpact]);

  const scanDuration = useMemo(() => {
    if (!report?.startedAt || !report?.finishedAt) return null;
    const ms = new Date(report.finishedAt) - new Date(report.startedAt);
    return `${(ms / 1000).toFixed(1)}s`;
  }, [report]);

  const toggleViolation = (id) => {
    setExpandedViolations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExportPdf = async () => {
    if (!report || exportingPdf) return;
    setExportingPdf(true);
    try {
      const filename = `a11y-report-${report.reportId || new Date().toISOString().slice(0, 10)}.pdf`;
      await generateScanReportPDF(report, filename);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setExportingPdf(false);
    }
  };

  const getPageViolationCount = (page) =>
    (page.violations || []).reduce((sum, v) => sum + (v.nodes?.length || 1), 0);

  const getImpactBadgeColor = (page) => {
    const violations = page.violations || [];
    if (violations.some((v) => v.impact === "critical")) return "bg-[#FF4B4B] text-white";
    if (violations.some((v) => v.impact === "serious")) return "bg-[#FFB800] text-black";
    if (violations.length > 0) return "bg-cx-primary text-cx-on-primary";
    return "bg-cx-outline-variant text-cx-on-surface";
  };

  const breadcrumbLabel = breadcrumbSource === "scanner" ? "SCANNER" : "HISTORY";

  return (
    <div className="scan-result-canvas font-mono-cx min-h-screen relative">
      <div className="scan-result-dot-grid absolute inset-0 -z-10 pointer-events-none" />

      {/* Left Sidebar */}
      <aside
        className={`fixed left-0 top-14 bottom-12 w-80 z-40 flex flex-col bg-cx-surface-container-high border-r border-cx-outline-variant/20 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-cx-outline-variant/20">
          <div className="font-mono-cx text-xl font-semibold text-cx-primary">AI FIX ENGINE</div>
          <div className="font-mono-cx text-[11px] text-cx-on-surface-variant opacity-60">v2.4.0_STABLE</div>
        </div>

        <nav className="flex-grow py-4 overflow-y-auto scan-result-scrollbar">
          <SidebarNavItem
            icon="code"
            label="Code Analysis"
            active={sidebarSection === "analysis"}
            onClick={() => {
              setSidebarSection("analysis");
              setActiveTab("violations");
            }}
          />
          <SidebarNavItem
            icon="auto_fix_high"
            label="Fix Suggestions"
            active={sidebarSection === "fixes"}
            onClick={() => {
              setSidebarSection("fixes");
              setShowAIFix(true);
            }}
          />
          <SidebarNavItem
            icon="history"
            label="Accessibility Log"
            active={sidebarSection === "log"}
            onClick={() => {
              setSidebarSection("log");
              setActiveTab("pages");
            }}
          />
          {/* <SidebarNavItem
            icon="settings"
            label="Settings"
            active={sidebarSection === "settings"}
            onClick={() => setSidebarSection("settings")}
          /> */}
        </nav>

        <div className="p-6 border-t border-cx-outline-variant/20 bg-cx-surface-container-lowest">
          <div className="font-mono-cx text-[11px] text-cx-on-surface-variant mb-2">QUICK SCAN STATUS</div>
          <div className="h-1 w-full bg-cx-outline-variant/30 rounded-full overflow-hidden">
            <div className="h-full bg-cx-primary w-full" />
          </div>
          <div className="font-mono-cx text-[10px] text-cx-on-surface-variant mt-2 uppercase">COMPLETE — 100%</div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-x-0 top-14 bottom-12 z-30 bg-cx-bg/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-80 mt-14 p-4 md:p-8 pb-12 min-h-[calc(100vh-3.5rem-3rem)] relative">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-14 left-4 z-20 w-12 h-12 bg-cx-primary text-cx-on-primary flex items-center justify-center shadow-lg"
          aria-label="Open AI Fix sidebar"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 font-mono-cx text-[11px] tracking-widest text-cx-on-surface-variant">
          <Link href={breadcrumbSource === "scanner" ? "/scanner" : "/history"} className="hover:text-cx-primary">
            {breadcrumbLabel}
          </Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="text-cx-primary font-bold">REPORT DETAILS</span>
          <span className="ml-auto text-cx-on-surface-variant uppercase">
            ID: {report.reportId?.slice(0, 12) || "—"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="font-mono-cx text-3xl md:text-5xl font-bold text-cx-on-surface mb-2">
              SCAN_RESULT: [{getDomainLabel(report.baseUrl).toUpperCase().slice(0, 12)}]
            </h1>
            <p className="font-mono-cx text-sm text-cx-on-surface max-w-2xl">
              Automated accessibility audit for &quot;{getDomainLabel(report.baseUrl)}&quot;.
              {scanDuration && ` Execution completed in ${scanDuration}`}
              {report.summary?.pages ? ` with ${report.summary.pages} page(s) scanned.` : "."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              href="/scanner"
              className="px-4 py-2 border border-cx-primary text-cx-primary font-mono-cx text-[11px] font-bold uppercase tracking-widest hover:bg-cx-primary/10 transition-colors"
            >
              New Scan
            </Link>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={exportingPdf}
              className="px-4 py-2 bg-cx-primary text-cx-on-primary font-mono-cx text-[11px] font-bold uppercase tracking-widest hover:brightness-110 disabled:opacity-60"
            >
              {exportingPdf ? "Exporting..." : "Export PDF"}
            </button>
            {allViolations.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAIFix(true)}
                className={`px-4 py-2 font-mono-cx text-[11px] font-bold uppercase tracking-widest hover:brightness-110 ${
                  darkMode
                    ? "bg-cx-secondary-fixed text-[var(--on-secondary-fixed)]"
                    : "bg-cx-primary text-cx-on-primary"
                }`}
              >
                AI Fix
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 border-b border-cx-outline-variant/20 mb-8 overflow-x-auto">
          {[
            { id: "summary", label: "SUMMARY", count: violationStats.totalViolations },
            { id: "pages", label: "PAGES", count: report.pages?.length || 0 },
            { id: "violations", label: "VIOLATIONS", count: violationStats.totalNodes },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 md:px-8 py-4 font-mono-cx text-[11px] font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "text-cx-primary border-b-2 border-cx-primary"
                  : "text-cx-on-surface-variant hover:text-cx-primary"
              }`}
            >
              {tab.label} [{tab.count}]
            </button>
          ))}
        </div>

        {/* Summary Tab */}
        {activeTab === "summary" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ImpactStatCard impact="critical" count={violationStats.critical} icon="error" />
            <ImpactStatCard impact="serious" count={violationStats.serious} icon="warning" />
            <ImpactStatCard impact="moderate" count={violationStats.moderate} icon="info" />
            <div className="hud-panel border bg-cx-surface-container flex flex-col justify-between h-48 border-l-4 border-cx-outline-variant">
              <div>
                <span className="material-symbols-outlined text-cx-outline-variant mb-2">check_circle</span>
                <div className="font-mono-cx text-[11px] uppercase tracking-widest text-cx-on-surface-variant">
                  PASSED CHECKS
                </div>
              </div>
              <div className="font-mono-cx text-4xl font-bold leading-none text-cx-on-surface">
                {passedChecks >= 1000 ? `${(passedChecks / 1000).toFixed(1)}K` : passedChecks}
              </div>
            </div>

            <ViolationDensityChart pages={report.pages} />
            <HealthScoreRing score={healthScore} />

            <div className="md:col-span-4 hud-panel border p-6 bg-cx-surface-container">
              <h3 className="font-mono-cx text-[11px] font-bold uppercase tracking-widest text-cx-primary mb-4">
                Report Metadata
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono-cx text-sm">
                <div>
                  <div className="text-[10px] text-cx-on-surface-variant uppercase mb-1">Base URL</div>
                  <div className="text-cx-primary break-all">{report.baseUrl}</div>
                </div>
                <div>
                  <div className="text-[10px] text-cx-on-surface-variant uppercase mb-1">Started</div>
                  <div className="text-cx-on-surface">{formatDate(report.startedAt)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-cx-on-surface-variant uppercase mb-1">Completed</div>
                  <div className="text-cx-on-surface">{formatDate(report.finishedAt)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-cx-on-surface-variant uppercase mb-1">Distinct Rules</div>
                  <div className="text-cx-on-surface">{report.summary?.totalRules ?? aggregatedViolations.length}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === "pages" && (
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-cx-on-surface-variant text-sm">
                  search
                </span>
                <input
                  type="search"
                  placeholder="SEARCH PAGES..."
                  value={pageSearch}
                  onChange={(e) => setPageSearch(e.target.value)}
                  className="w-full bg-cx-surface-container-high border border-cx-outline-variant/40 pl-10 pr-4 py-2 font-mono-cx text-[13px] focus:border-cx-primary outline-none transition-colors text-cx-on-surface"
                />
              </div>
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[600px] scan-result-scrollbar">
                {filteredPages.map((page, idx) => {
                  const isActive = selectedPage?.url === page.url;
                  const count = getPageViolationCount(page);
                  return (
                    <button
                      key={page.url || idx}
                      type="button"
                      onClick={() => setSelectedPage(page)}
                      className={`flex items-center justify-between p-3 text-left transition-colors ${
                        isActive
                          ? "hud-panel border border-cx-primary bg-cx-surface-variant/20 shadow-[inset_0_0_4px_rgba(134,212,208,0.2)]"
                          : "hud-panel border bg-cx-surface-container hover:bg-cx-surface-variant/10"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className={`font-mono-cx text-[13px] font-bold truncate ${isActive ? "text-cx-primary" : "text-cx-on-surface"}`}>
                          {getPagePath(page.url)}
                        </div>
                        <div className="font-mono-cx text-[10px] text-cx-on-surface-variant">
                          Last scanned: {formatRelativeTime(page.scannedAt || report.finishedAt)}
                        </div>
                      </div>
                      {count > 0 && (
                        <span className={`font-mono-cx text-[10px] px-1.5 py-0.5 rounded-sm font-bold shrink-0 ml-2 ${getImpactBadgeColor(page)}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-grow hud-panel border p-6 bg-cx-surface-container min-w-0">
              {selectedPage ? (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-cx-outline-variant/20">
                    <div className="min-w-0">
                      <h2 className="font-mono-cx text-xl font-semibold text-cx-primary">
                        PAGE: {getPagePath(selectedPage.url).toUpperCase()}
                      </h2>
                      <a
                        href={selectedPage.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono-cx text-[11px] text-cx-on-surface-variant hover:text-cx-primary break-all"
                      >
                        {selectedPage.url}
                      </a>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        href={`/scanner?url=${encodeURIComponent(selectedPage.url)}`}
                        className="px-4 py-2 bg-cx-primary text-cx-on-primary font-mono-cx text-[11px] font-bold flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        RESCAN
                      </Link>
                      <button
                        type="button"
                        onClick={handleExportPdf}
                        className="px-4 py-2 border border-cx-primary text-cx-primary font-mono-cx text-[11px] font-bold"
                      >
                        EXPORT
                      </button>
                    </div>
                  </div>

                  {selectedPage.meta?.scanError ? (
                    <div className="p-8 text-center text-cx-error">
                      <p className="font-bold uppercase text-sm">Page not found or unable to scan</p>
                      <p className="text-xs mt-2 text-cx-on-surface-variant">
                        {selectedPage.meta?.errorMessage || "This page could not be accessed."}
                      </p>
                    </div>
                  ) : (selectedPage.violations || []).length === 0 ? (
                    <div className="p-8 text-center text-cx-primary">
                      <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                      <p className="font-bold uppercase text-sm">No issues found on this page</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(selectedPage.violations || []).map((violation, idx) => {
                        const colors = IMPACT_COLORS[violation.impact] || IMPACT_COLORS.moderate;
                        const firstNode = violation.nodes?.[0];
                        return (
                          <div
                            key={`${violation.id}-${idx}`}
                            className={`p-4 hud-panel border bg-cx-surface-container-high border-l-4 ${colors.border}`}
                          >
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <ImpactBadge impact={violation.impact} />
                              <span className="font-mono-cx text-[13px] font-bold text-cx-on-surface">
                                {violation.description || violation.id}
                              </span>
                            </div>
                            <p className="font-mono-cx text-sm text-cx-on-surface mb-4">
                              Rule: {violation.id} | WCAG 2.1
                            </p>
                            {firstNode?.html && (
                              <div className="scan-result-code-block bg-cx-surface-container-high p-3 border border-cx-outline-variant/30">
                                <div className="font-mono-cx text-[10px] text-cx-on-surface-variant mb-2 font-bold">
                                  AFFECTED ELEMENT [1]
                                </div>
                                <code className="font-mono-cx text-[13px] break-all">
                                  {firstNode.html.slice(0, 200)}
                                  {firstNode.html.length > 200 ? "…" : ""}
                                </code>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-cx-on-surface-variant">
                  Select a page to view details
                </div>
              )}
            </div>
          </div>
        )}

        {/* Violations Tab */}
        {activeTab === "violations" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "ALL", count: violationStats.totalNodes },
                  { id: "critical", label: "CRITICAL", count: violationStats.critical },
                  { id: "serious", label: "SERIOUS", count: violationStats.serious },
                  { id: "moderate", label: "MODERATE", count: violationStats.moderate },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterImpact(f.id)}
                    className={`px-3 py-1 hud-panel border font-mono-cx text-[11px] transition-colors ${
                      filterImpact === f.id
                        ? "bg-cx-primary/10 text-cx-primary border-cx-primary"
                        : "text-cx-on-surface-variant hover:text-cx-primary"
                    }`}
                  >
                    {f.label} [{f.count}]
                  </button>
                ))}
              </div>
              <div className="font-mono-cx text-[11px] text-cx-on-surface-variant">SORT: SEVERITY ↓</div>
            </div>

            <div className="space-y-4">
              {filteredAggregatedViolations.map((violation) => {
                const colors = IMPACT_COLORS[violation.impact] || IMPACT_COLORS.moderate;
                const isExpanded = expandedViolations[violation.id];
                const firstInstance = violation.instances?.[0]?.violation;
                const firstNode = firstInstance?.nodes?.[0];

                return (
                  <div key={violation.id} className="hud-panel border bg-cx-surface-container overflow-hidden group">
                    <button
                      type="button"
                      onClick={() => toggleViolation(violation.id)}
                      className="w-full p-4 bg-cx-surface-container-high flex items-center justify-between cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-10 h-10 border flex items-center justify-center font-bold shrink-0 ${colors.text} ${colors.border}`}
                        >
                          {violation.impact === "critical" ? "!" : violation.impact === "serious" ? "W" : "i"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono-cx text-[13px] font-bold text-cx-on-surface truncate">
                            {violation.description || violation.help || violation.id}
                          </div>
                          <div className="font-mono-cx text-[11px] text-cx-on-surface-variant uppercase tracking-tighter">
                            Rule ID: {violation.id} | WCAG 2.1
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 shrink-0 ml-4">
                        <div className="text-right hidden sm:block">
                          <div className="font-mono-cx text-[11px] text-cx-on-surface-variant">OCCURRENCES</div>
                          <div className="font-mono-cx text-xl leading-none font-bold text-cx-on-surface">
                            {String(violation.occurrences).padStart(2, "0")}
                          </div>
                        </div>
                        <span
                          className="material-symbols-outlined text-cx-on-surface-variant transition-transform"
                          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                        >
                          expand_more
                        </span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-cx-outline-variant/20">
                        <div className="p-6 bg-cx-surface-container-lowest grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-mono-cx text-[11px] font-bold text-cx-primary mb-2">DESCRIPTION</h4>
                            <p className="font-mono-cx text-sm text-cx-on-surface leading-relaxed">
                              {violation.description || "No description available."}
                            </p>
                            <h4 className="font-mono-cx text-[11px] font-bold text-cx-primary mb-2 mt-6">REMEDIATION</h4>
                            <p className="font-mono-cx text-sm text-cx-on-surface leading-relaxed">
                              {violation.help || "Refer to WCAG guidelines for remediation steps."}
                            </p>
                            {violation.helpUrl && (
                              <a
                                href={violation.helpUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 mt-3 font-mono-cx text-[11px] text-cx-primary hover:underline"
                              >
                                Learn more
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                              </a>
                            )}
                          </div>
                          <div className="space-y-4">
                            {firstNode?.html && (
                              <>
                                <h4 className="font-mono-cx text-[11px] font-bold text-cx-primary mb-2">CODE INSTANCE</h4>
                                <div className="scan-result-code-block hud-panel border p-4 relative">
                                  <pre className="font-mono-cx text-[13px] overflow-x-auto">
                                    <code>{firstNode.html}</code>
                                  </pre>
                                </div>
                              </>
                            )}
                            <div className="p-3 bg-cx-error-container/30 border border-cx-error/30 flex gap-3 items-start">
                              <span className="material-symbols-outlined text-cx-error text-sm">lightbulb</span>
                              <div className="font-mono-cx text-[11px] text-cx-on-surface leading-relaxed">
                                <span className="font-bold text-cx-error">FIX SUGGESTION:</span>{" "}
                                {violation.help || "Use the AI Fix Engine for automated remediation suggestions."}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowAIFix(true)}
                              className={`w-full px-4 py-2 font-mono-cx text-[11px] font-bold uppercase ${
                                darkMode
                                  ? "bg-cx-secondary-fixed text-[var(--on-secondary-fixed)]"
                                  : "bg-cx-primary text-cx-on-primary"
                              }`}
                            >
                              Generate AI Fix
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredAggregatedViolations.length === 0 && (
                <div className="hud-panel border p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-cx-primary mb-3">check_circle</span>
                  <p className="font-mono-cx text-sm text-cx-on-surface-variant">No violations match the current filter.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <AIFixSidebar
        violations={allViolations}
        scanUrl={report.baseUrl}
        isOpen={showAIFix}
        onClose={() => setShowAIFix(false)}
      />
    </div>
  );
}
