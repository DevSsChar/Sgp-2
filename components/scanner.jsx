"use client";
import { useTheme } from './ThemeContext';

import { useState } from "react";
import { motion } from "framer-motion";

function ImpactBadge({ impact }) {
  const { darkMode } = useTheme();
  
  const getImpactStyles = () => {
    switch (impact) {
      case "critical":
        return darkMode
          ? "bg-red-900/30 text-red-300 border-red-800" 
          : "bg-red-100 text-red-800 border-red-200";
      case "serious":
        return darkMode
          ? "bg-orange-900/30 text-orange-300 border-orange-800" 
          : "bg-orange-100 text-orange-800 border-orange-200";
      case "moderate":
        return darkMode
          ? "bg-amber-900/30 text-amber-300 border-amber-800" 
          : "bg-amber-100 text-amber-800 border-amber-200";
      case "minor":
        return darkMode
          ? "bg-yellow-900/30 text-yellow-300 border-yellow-800" 
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return darkMode
          ? "bg-gray-700 text-gray-300 border-gray-600" 
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getImpactStyles()}`}>
      {impact || "needs-review"}
    </span>
  );
}

function StatCard({ label, value, icon }) {
  const { darkMode } = useTheme();
  
  return (
    <div className={`rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-md border p-4 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`rounded-full ${darkMode ? 'bg-[#38bdf8]/20 text-[#38bdf8]' : 'bg-[#00d4ff]/10 text-[#00483a]'} p-2`}>
            {icon}
          </div>
        )}
        <div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
          <div className={`font-semibold text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</div>
        </div>
      </div>
    </div>
  );
}

export default function Scanner() {
  const { darkMode } = useTheme();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");

  async function handleScan(e) {
    e.preventDefault();
    setError("");
    setReport(null);
    if (!/^https?:\/\//i.test(url)) {
      setError("Enter a valid URL starting with http(s)://");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setReport(data);
      setActiveTab("summary"); // Reset to summary tab
    } catch (e) {
      setError(e?.message || "Scan failed");
    } finally {
      setLoading(false);
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

  // Icons for stats
  const pageIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.342a2 2 0 0 0-.602-1.43l-4.44-4.342A2 2 0 0 0 13.56 2H6a2 2 0 0 0-2 2z"></path>
      <path d="M9 13h6"></path>
      <path d="M9 17h3"></path>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
    </svg>
  );

  const nodeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="8" height="8" rx="1"></rect>
      <path d="M6 10v12"></path>
      <path d="M10 6h12"></path>
      <rect x="14" y="14" width="8" height="8" rx="1"></rect>
    </svg>
  );

  const ruleIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 6 4 14"></path>
      <path d="M12 6v14"></path>
      <path d="M8 8v12"></path>
      <path d="M4 4v16"></path>
    </svg>
  );

  const reviewIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8v4l3 3"></path>
      <path d="M18.4 17A9 9 0 1 0 12 21a9 9 0 0 0 9-9V8l-3 3-3-3-3 3-3-3"></path>
    </svg>
  );

  return (
    <section className={`mt-20 md:mt-24 min-h-[calc(100vh-4rem)] ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-white to-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-[#00483a]'} mb-3`}>Accessibility Scanner</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Scan your website for accessibility issues and get detailed reports on WCAG compliance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-lg border p-6 mb-10`}
        >
          <form onSubmit={handleScan}>
            <div className="space-y-4">
              <div>
                <label htmlFor="url-input" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
                  Website URL to Scan
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        <path d="M2 12h20"></path>
                      </svg>
                    </div>
                    <input
                      id="url-input"
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className={`w-full pl-10 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'} px-4 py-3 focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent`}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="sm:w-auto w-full rounded-lg bg-[#00d4ff] text-white font-semibold px-6 py-3 hover:bg-[#00d4ff]/90 disabled:opacity-60 transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Scanning...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12h20"></path>
                          <path d="m17 7 5 5-5 5"></path>
                          <path d="M7 7 2 12l5 5"></path>
                        </svg>
                        <span>Start Scan</span>
                      </>
                    )}
                  </button>
                </div>
                {error && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {error}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Guidelines</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                       className="mt-0.5 text-green-500 shrink-0">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  <span>Public URLs only (no auth unless preconfigured)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                       className="mt-0.5 text-green-500 shrink-0">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  <span>We wait for network idle and 4s extra to reduce false "incomplete" results</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                       className="mt-0.5 text-green-500 shrink-0">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  <span>"Incomplete" checks are included as needs-review</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Limitations</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                       className="mt-0.5 text-amber-500 shrink-0">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>Cross-origin iframes and canvas aren't analyzed</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                       className="mt-0.5 text-amber-500 shrink-0">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>Highly dynamic content may still need manual review</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                       className="mt-0.5 text-amber-500 shrink-0">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>Large sites may need higher page limits or more time</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {report && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="rounded-xl bg-white shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
                <div>
                  <div className="text-sm text-gray-600">Report ID</div>
                  <div className="font-mono text-sm">{report.reportId}</div>
                </div>
                <div className="sm:text-right">
                  <div className="text-sm text-gray-600">Base URL</div>
                  <div className="font-medium text-gray-900 break-all">{report.baseUrl}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard 
                  label="Pages Scanned" 
                  value={report.summary?.pages ?? 0} 
                  icon={pageIcon}
                />
                <StatCard 
                  label="Affected Nodes" 
                  value={report.summary?.totalNodes ?? 0} 
                  icon={nodeIcon}
                />
                <StatCard 
                  label="Distinct Rules" 
                  value={report.summary?.totalRules ?? 0} 
                  icon={ruleIcon}
                />
                <StatCard 
                  label="Needs Review" 
                  value={report.summary?.byImpactNodes?.["needs-review"] ?? 0} 
                  icon={reviewIcon}
                />
              </div>

              {Array.isArray(report.summary?.topRules) && report.summary.topRules.length > 0 && (
                <div className="mt-6">
                  <div className="text-sm font-medium text-gray-700 mb-3">Top Rules (by affected nodes)</div>
                  <div className="flex flex-wrap gap-2">
                    {report.summary.topRules.slice(0, 8).map((r) => (
                      <span key={r.rule} className="inline-flex items-center gap-2 rounded-full bg-gray-100 text-gray-800 text-xs px-3 py-1.5 border border-gray-200">
                        <span className="font-mono">{r.rule}</span>
                        <span className="bg-white text-gray-600 rounded-full px-1.5 py-0.5 text-xs border border-gray-200">{r.nodes}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => downloadJson(report, `a11y-report-${new Date().toISOString().slice(0,10)}.json`)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 px-4 py-2 text-sm font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download JSON
                </button>
              </div>
            </div>

            {Array.isArray(report.pages) && report.pages.length > 0 && (
              <div className="space-y-6">
                <div className="rounded-xl bg-white shadow-lg border border-gray-100 p-6">
                  <div className="border-b border-gray-100 pb-4 mb-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-900">Scanned Pages</h2>
                      <div className="text-sm text-gray-600">Total: {report.pages.length}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {report.pages.map((p, idx) => {
                      const id = `page-${idx}`;
                      const label = (() => { try { return new URL(p.url).pathname || p.url; } catch { return p.url; } })();
                      return (
                        <a 
                          key={p.url || id} 
                          href={`#${id}`} 
                          className="inline-flex items-center rounded-full bg-gray-100 border border-gray-200 px-4 py-1.5 text-sm text-gray-800 hover:bg-gray-200 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" 
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                               className="mr-1.5 text-gray-500">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                          </svg>
                          {label}
                        </a>
                      );
                    })}
                  </div>
                </div>

                {report.pages.map((p, idx) => {
                  const id = `page-${idx}`;
                  const path = (() => { try { return new URL(p.url).pathname || p.url; } catch { return p.url; } })();
                  const violations = p.violations || [];
                  
                  return (
                    <section key={p.url || id} id={id} className="rounded-xl bg-white shadow-lg border border-gray-100 p-6 scroll-mt-24">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                               className="text-gray-500">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                          </svg>
                          {path}
                        </h2>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                               className="text-gray-400">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {p.scannedAt ? new Date(p.scannedAt).toLocaleString() : ""}
                        </div>
                      </div>

                      {violations.length === 0 ? (
                        <div className="flex items-center justify-center p-8 text-center">
                          <div>
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5"></path>
                              </svg>
                            </div>
                            <p className="text-gray-700 font-medium">No accessibility issues found on this page.</p>
                            <p className="text-gray-500 text-sm mt-1">This page appears to meet accessibility standards.</p>
                          </div>
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {violations.map((v, vi) => (
                            <li key={`${p.url || id}-${v.id}-${vi}`} className="py-4 first:pt-0 last:pb-0">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <ImpactBadge impact={v.impact} />
                                    <span className="font-medium text-gray-900">{v.id}</span>
                                  </div>
                                  <p className="text-sm text-gray-800 mb-2">{v.description}</p>
                                  <a href={v.helpUrl} target="_blank" rel="noreferrer" 
                                     className="inline-flex items-center gap-1.5 text-sm text-[#00d4ff] hover:underline">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" 
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                                    </svg>
                                    {v.help}
                                  </a>
                                  {Array.isArray(v.tags) && v.tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                      {v.tags.slice(0, 6).map((t) => (
                                        <span key={`${v.id}-${t}`} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 border border-gray-200">
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="shrink-0 flex items-center justify-center bg-gray-100 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" 
                                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                                       className="mr-1.5 text-gray-500">
                                    <rect x="2" y="2" width="8" height="8" rx="2"></rect>
                                    <rect x="14" y="2" width="8" height="8" rx="2"></rect>
                                    <rect x="2" y="14" width="8" height="8" rx="2"></rect>
                                    <rect x="14" y="14" width="8" height="8" rx="2"></rect>
                                  </svg>
                                  {v.nodes?.length ?? 0} nodes
                                </div>
                              </div>
                              
                              {Array.isArray(v.nodes) && v.nodes.length > 0 && (
                                <details className="mt-4 group">
                                  <summary className="cursor-pointer text-sm font-medium flex items-center gap-2 text-gray-700 hover:text-gray-900">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                                         className="text-gray-500 group-open:rotate-90 transition-transform">
                                      <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                    View affected nodes ({v.nodes.length})
                                  </summary>
                                  <div className="mt-3 space-y-3 pl-6 border-l-2 border-gray-100">
                                    {v.nodes.slice(0, 5).map((n, ni) => (
                                      <div key={`${p.url || id}-${v.id}-${(n.target || []).join('|')}-${ni}`} 
                                           className="rounded-lg border border-gray-200 overflow-hidden">
                                        <div className="bg-gray-50 p-3 border-b border-gray-200">
                                          <div className="font-mono text-xs px-2 py-1 rounded bg-white border border-gray-200 inline-block">
                                            {(n.target || []).join(", ")}
                                          </div>
                                        </div>
                                        {n.failureSummary && (
                                          <div className="p-3 text-sm text-gray-800">
                                            {n.failureSummary}
                                          </div>
                                        )}
                                        {n.html && (
                                          <div className="p-3 pt-0">
                                            <pre className="bg-gray-50 border rounded p-3 text-xs overflow-auto max-h-48 font-mono">
                                              {n.html}
                                            </pre>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                    {v.nodes.length > 5 && (
                                      <div className="text-sm text-gray-600 py-2">
                                        +{v.nodes.length - 5} more nodes not shown
                                      </div>
                                    )}
                                  </div>
                                </details>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
