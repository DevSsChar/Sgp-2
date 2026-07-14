"use client";
import { generateComprehensiveReportPDF, generateScanReportPDF } from '../utils/pdfGenerator';
import {
  createInitialScanSteps,
  getPhaseIcon,
  getStepStatus,
} from '../utils/scanProgress';
import AIFixSidebar from './AIFixSidebar';
import ImpactBadge from './impact/ImpactBadge';
import ViolationRow from './impact/ViolationRow';
import { useScanData } from './ScanDataContext';
import { useTheme } from './ThemeContext';
import { countViolationsByImpact, getImpactCountClass } from '@/utils/impactTheme';
import ScannerAuthPanel from './ScannerAuthPanel';
import { buildScanAuthPayload, parseSessionImport } from '@/utils/scanAuthClient';

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function formatHudLabel(text) {
  return (text || "")
    .replace(/\.\.\.$/, "")
    .replace(/[^\w\s]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .toUpperCase();
}

function ScannerIdleBackground() {
  return (
    <div className="scanner-fx absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Soft glow behind the hero */}
      <div className="scanner-fx-glow absolute inset-x-0 top-0 h-[420px]" />

      {/* Rotating radar sweep */}
      <div className="scanner-fx-radar absolute -right-24 top-1/3 w-72 h-72 md:w-96 md:h-96" />

      {/* Target reticle rings */}
      <div className="scanner-fx-reticle absolute right-[10%] top-[14%] w-28 h-28 md:w-40 md:h-40" />
      <div className="scanner-fx-reticle scanner-fx-reticle--delay absolute left-[5%] bottom-[18%] w-20 h-20" />

      {/* Corner HUD brackets */}
      <div className="scanner-fx-corner scanner-fx-corner--tl absolute top-6 left-4 md:left-8 w-12 h-12" />
      <div className="scanner-fx-corner scanner-fx-corner--tr absolute top-6 right-4 md:right-8 w-12 h-12" />
      <div className="scanner-fx-corner scanner-fx-corner--bl absolute bottom-6 left-4 md:left-8 w-10 h-10" />
      <div className="scanner-fx-corner scanner-fx-corner--br absolute bottom-6 right-4 md:right-8 w-10 h-10" />

      {/* Rotating crosshair */}
      <div className="scanner-fx-crosshair absolute left-[16%] top-[38%] w-40 h-40 md:w-56 md:h-56" />

      {/* Floating diamonds */}
      <div className="scanner-fx-diamond absolute right-[30%] top-[10%] w-3 h-3" />
      <div className="scanner-fx-diamond scanner-fx-diamond--slow absolute left-[24%] bottom-[14%] w-2 h-2" />
      <div className="scanner-fx-diamond absolute right-[44%] bottom-[30%] w-2.5 h-2.5" />

      {/* Data stream ticks */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2">
        {["SCAN", "DOM", "ARIA", "WCAG", "NODE"].map((label, i) => (
          <span
            key={label}
            className="ag-data-tick font-mono-cx text-[9px] tracking-[0.3em] text-cx-primary uppercase"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

const SCANNER_FEATURES = [
  {
    icon: "travel_explore",
    title: "Deep Crawl",
    desc: "Discovers internal routes automatically and audits every reachable page in a single pass.",
  },
  {
    icon: "verified",
    title: "WCAG 2.1 Coverage",
    desc: "Runs 90+ axe-core rules across Level A and AA success criteria on every scanned node.",
  },
  {
    icon: "auto_fix_high",
    title: "AI Remediation",
    desc: "Generates prioritized fix suggestions with code patches for every violation found.",
  },
  {
    icon: "picture_as_pdf",
    title: "Exportable Reports",
    desc: "Ship shareable PDF audits and track your full scan history across domains.",
  },
];

const SCANNER_STEPS = ["Input Target", "Crawl Pages", "Run Audit", "Generate Report"];

function StatCard({ label, value, suffix, highlight }) {
  return (
    <div className="bg-cx-surface border border-cx-outline-variant/30 p-6 flex flex-col justify-between group hover:bg-cx-surface-container-low transition-colors">
      <span className="font-mono-cx text-[12px] font-bold uppercase tracking-widest text-cx-on-surface-variant mb-4">
        {label}
      </span>
      <div className={`font-mono-cx text-2xl font-bold ${highlight ? "text-cx-error" : "text-cx-primary"}`}>
        {value}
        {suffix && <span className="text-sm font-normal text-cx-outline ml-1">{suffix}</span>}
      </div>
    </div>
  );
}

// Comprehensive Report Button Component
function ComprehensiveReportButton({ report, url, darkMode }) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper function to extract all violations from pages
  const getAllViolations = (pages) => {
    const allViolations = [];
    if (Array.isArray(pages)) {
      pages.forEach(page => {
        if (Array.isArray(page.violations)) {
          allViolations.push(...page.violations);
        }
      });
    }
    return allViolations;
  };

  const handleGenerateComprehensiveReport = async () => {
    setIsGenerating(true);
    
    try {
      // Prepare scan data for the AI API
      const scanData = {
        baseUrl: report.baseUrl || url,
        reportId: report.reportId,
        summary: report.summary,
        pages: report.pages,
        violations: getAllViolations(report.pages)
      };

      console.log('Sending scan data:', scanData); // Debug log

      // Validate we have violations
      if (!scanData.violations || scanData.violations.length === 0) {
        throw new Error('No violations found to generate report');
      }

      console.log(`Found ${scanData.violations.length} violations to analyze`);

      // Call comprehensive AI report API
      const response = await fetch('/api/ai-comprehensive-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scanData),
      });

      console.log('Response status:', response.status, response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to generate report: ${response.status} - ${errorText}`);
      }

      const aiReportData = await response.json();
      console.log('Received AI report data:', aiReportData); // Debug log

      // Extract the report from the response
      const reportData = aiReportData.report || aiReportData;

      if (!reportData) {
        throw new Error('No report data received from API');
      }

      // Generate metadata for PDF
      const metadata = {
        websiteUrl: report.baseUrl || url,
        generatedAt: new Date().toISOString(),
        totalViolations: report.summary?.totalNodes || 0,
        uniqueViolationTypes: report.summary?.totalRules || 0
      };

      console.log('Generating PDF with metadata:', metadata);

      // Generate and download PDF
      const filename = `comprehensive-accessibility-report-${new Date().toISOString().slice(0,10)}.pdf`;
      
      // Pass raw violation data and pages for detailed formatting
      await generateComprehensiveReportPDF(
        reportData, 
        metadata, 
        filename,
        scanData.violations, // Raw violations with full details
        scanData.pages       // Pages data for page-by-page breakdown
      );

      // Show success message
      alert('Comprehensive report generated successfully!');

    } catch (error) {
      console.error('Error generating comprehensive report:', error);
      alert(`Failed to generate comprehensive report: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGenerateComprehensiveReport}
      disabled={isGenerating}
      className="btn-hud-secondary disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Generating Report...</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <path d="M12 18v-6"></path>
            <path d="M9 15h6"></path>
          </svg>
          <span>Comprehensive AI Report</span>
          <span className="bg-white/20 px-2 py-1 rounded text-xs ml-1">
            PDF
          </span>
        </>
      )}
    </button>
  );
}

export default function Scanner() {
  const { darkMode } = useTheme();
  const { updateScanData, updateScanProgress, clearScanProgress } = useScanData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [showAIFix, setShowAIFix] = useState(false);
  const [isRestoredReport, setIsRestoredReport] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [currentPhase, setCurrentPhase] = useState(null);
  const [scanSteps, setScanSteps] = useState([]);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [expandedViolations, setExpandedViolations] = useState({});
  const [scanJustCompleted, setScanJustCompleted] = useState(false);
  const [authMode, setAuthMode] = useState("public");
  const [authMethod, setAuthMethod] = useState("session");
  const [loginUrl, setLoginUrl] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [usernameSelector, setUsernameSelector] = useState("");
  const [passwordSelector, setPasswordSelector] = useState("");
  const [submitSelector, setSubmitSelector] = useState("");
  const [sessionJson, setSessionJson] = useState("");
  const [saveForReuse, setSaveForReuse] = useState(false);
  const [useStoredAuth, setUseStoredAuth] = useState(false);
  const hydratedRef = useRef(false);

  // Load URL from query param or saved report from localStorage on mount (once)
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const urlParam = searchParams.get("url");
    if (urlParam) {
      setUrl(decodeURIComponent(urlParam));
      return;
    }

    const savedReport = localStorage.getItem('accessibilityReport');
    const savedUrl = localStorage.getItem('scannedUrl');

    if (savedReport && savedUrl) {
      try {
        const parsedReport = JSON.parse(savedReport);
        setReport(parsedReport);
        updateScanData(parsedReport);
        setUrl(savedUrl);
        setIsRestoredReport(true);
      } catch (err) {
        console.error('Error loading saved report:', err);
        localStorage.removeItem('accessibilityReport');
        localStorage.removeItem('scannedUrl');
      }
    }
  }, [searchParams, updateScanData]);

  // Save report to localStorage whenever it changes
  useEffect(() => {
    if (report && url && !isRestoredReport) {
      localStorage.setItem('accessibilityReport', JSON.stringify(report));
      localStorage.setItem('scannedUrl', url);
    }
  }, [report, url, isRestoredReport]);

  // Clear saved data
  const clearSavedData = () => {
    localStorage.removeItem('accessibilityReport');
    localStorage.removeItem('scannedUrl');
    setReport(null);
    updateScanData(null); // Clear scan data context
    setUrl("");
    setIsRestoredReport(false);
    setError("");
    setShowAIFix(false);
    setScanJustCompleted(false);
    setProgress(0);
    setCurrentStep("");
    setCurrentPhase(null);
    setScanSteps([]);
    clearScanProgress();
  };

  function applyProgressEvent(event) {
    setProgress(event.progress ?? 0);
    setCurrentStep(event.message || "");
    setCurrentPhase(event.phase || null);
    updateScanProgress({
      phase: event.phase,
      message: event.message,
      progress: event.progress,
      pageIndex: event.pageIndex,
      pageTotal: event.pageTotal,
      currentUrl: event.currentUrl,
      discovered: event.discovered,
      isScanning: true,
    });
  }

  async function consumeScanStream(res) {
    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("ndjson")) {
      const data = await res.json();
      if (!res.ok) {
        throw {
          errorInfo: {
            message: data.error || data.message || "Scan failed",
            code: data.code || null,
            type: data.type || null,
            status: res.status,
          },
        };
      }
      return data;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finalReport = null;

    const processLine = (line) => {
      if (!line.trim()) return;
      const event = JSON.parse(line);

      if (event.type === "progress") {
        applyProgressEvent(event);
      } else if (event.type === "complete") {
        finalReport = event.report;
      } else if (event.type === "error") {
        throw {
          errorInfo: {
            message: event.error || "Scan failed",
            originalError: event.originalError || event.error,
            code: event.code || null,
            type: event.errorType || null,
            status: event.status || 500,
          },
        };
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        processLine(line);
      }
    }

    if (buffer.trim()) {
      processLine(buffer);
    }

    if (!finalReport) {
      throw {
        errorInfo: {
          message: "Scan ended without a report",
          code: null,
          type: null,
          status: 500,
        },
      };
    }

    return finalReport;
  }

  function getErrorDisplay(errorInfo) {
    const { message, type, status, originalError } = errorInfo;
    const titles = {
      invalid_url: "Invalid URL",
      not_found: "Website Not Found",
      unreachable: "Website Unreachable",
      timeout: "Connection Timed Out",
      forbidden: "Access Denied",
      ssl: "SSL Certificate Error",
      server_error: "Target Server Error",
      auth: "Authentication Failed",
    };
    const title = titles[type] || (status === 500 ? "Scan Failed" : "Unable to Scan");
    const displayMessage =
      message === "Unable to scan this website. Please check the URL and try again." && originalError
        ? originalError
        : message;
    return { title, message: displayMessage };
  }

  async function handleScan(e) {
    e.preventDefault();
    setError("");
    setReport(null);
    updateScanData(null);
    setIsRestoredReport(false);

    if (!/^https?:\/\//i.test(url)) {
      setError("Enter a valid URL starting with http(s)://");
      return;
    }

    let authPayload = { enabled: false };
    if (authMode === "authenticated") {
      try {
        if (!useStoredAuth) {
          if (authMethod === "credentials") {
            if (!loginUrl.trim()) {
              setError("Authentication Error: Login page URL is required");
              return;
            }
            if (!authPassword) {
              setError("Authentication Error: Password is required");
              return;
            }
          } else if (!sessionJson.trim()) {
            setError("Authentication Error: Import a browser session before scanning");
            return;
          } else {
            parseSessionImport(sessionJson);
          }
        }
        authPayload = buildScanAuthPayload({
          authMode,
          authMethod,
          saveForReuse,
          useStored: useStoredAuth,
          loginUrl,
          username: authUsername,
          password: authPassword,
          usernameSelector,
          passwordSelector,
          submitSelector,
          sessionJson,
        });
      } catch (authErr) {
        setError(`Authentication Error: ${authErr.message}`);
        return;
      }
    }

    setLoading(true);
    setScanSteps(createInitialScanSteps());
    setProgress(0);
    setCurrentPhase("validating");
    setCurrentStep("Validating target URL...");
    updateScanProgress({
      phase: "validating",
      message: "Validating target URL...",
      progress: 0,
      isScanning: true,
    });

    let scanSucceeded = false;

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: url.trim(), auth: authPayload }),
      });

      const data = await consumeScanStream(res);

      updateScanData(data);
      setProgress(100);
      setCurrentPhase("complete");
      setCurrentStep("Scan complete");
      setScanJustCompleted(true);
      scanSucceeded = true;

      if (data?.reportId) {
        router.push(`/reports/${data.reportId}?from=scanner`);
        return;
      }

      setReport(data);
      setTimeout(() => setScanJustCompleted(false), 3000);
    } catch (e) {
      if (e?.errorInfo) {
        const { title, message } = getErrorDisplay(e.errorInfo);
        setError(`${title}: ${message}`);
      } else {
        setError(e?.message || "Scan failed. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
      clearScanProgress();
      if (!scanSucceeded) {
        setProgress(0);
        setCurrentStep("");
        setCurrentPhase(null);
        setScanSteps([]);
      }
    }
  }

  function formatDateTime(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  async function handleExportPdf() {
    if (!report || exportingPdf) return;
    setExportingPdf(true);
    try {
      const filename = `a11y-report-${report.reportId || new Date().toISOString().slice(0, 10)}.pdf`;
      await generateScanReportPDF(report, filename);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExportingPdf(false);
    }
  }

  const toggleViolationExpand = (key) => {
    setExpandedViolations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const violationLedger =
    report?.pages?.flatMap((p, pageIdx) =>
      (p.violations || []).map((v, vi) => ({
        ...v,
        pageUrl: p.url,
        pageIdx,
        key: `${pageIdx}-${v.id}-${vi}`,
      }))
    ) || [];

  const pagePath = (rawUrl) => {
    try {
      return new URL(rawUrl).pathname || rawUrl;
    } catch {
      return rawUrl;
    }
  };

  const impactCounts = countViolationsByImpact(violationLedger);

  return (
    <section
      className={`scanner-canvas font-mono-cx mt-14 min-h-[calc(100vh-3.5rem)] relative overflow-hidden ${
        darkMode ? "scanner-canvas--dark" : ""
      }`}
    >
      {darkMode && <div className="scanner-dot-grid absolute inset-0 -z-10 pointer-events-none" />}
      {!report && <ScannerIdleBackground />}

      <main className="flex-1 pt-8 pb-12 px-4 md:px-8 relative z-[1]">
        <div className="max-w-[1440px] mx-auto space-y-px">
          {/* Idle hero header */}
          {!report && !loading && (
            <motion.header
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="relative text-center pt-8 md:pt-14 pb-10 md:pb-12"
            >
              <div className="inline-flex items-center gap-2 border border-cx-outline-variant/40 bg-cx-surface/70 backdrop-blur px-3 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cx-secondary-container animate-pulse" />
                <span className="font-mono-cx text-[10px] font-bold uppercase tracking-[0.25em] text-cx-on-surface-variant">
                  Audit engine online // WCAG 2.1 AA
                </span>
              </div>
              <h1 className="font-mono-cx text-3xl md:text-5xl font-bold tracking-tight text-cx-on-surface mb-4">
                ACCESSIBILITY<span className="text-cx-primary">_SCANNER</span>
              </h1>
              <p className="font-mono-cx text-sm md:text-base text-cx-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                Point the engine at any public URL. It crawls internal pages, runs a full
                axe-core rule set and returns a prioritized, AI-assisted remediation report.
              </p>
            </motion.header>
          )}

          {/* Scanner Input HUD */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-cx-surface border border-cx-outline-variant/30 p-6 relative"
          >
            <div className="absolute top-2 right-2 font-mono-cx text-[11px] text-cx-outline-variant">
              [SCANNER_INPUT_01]
            </div>

            <form onSubmit={handleScan} className="mt-4">
              <div className="flex flex-col md:flex-row gap-0">
                <div className="relative flex-1">
                  <input
                    id="url-input"
                    type="url"
                    placeholder=" "
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    className="scanner-url-field w-full bg-cx-surface border border-cx-outline-variant p-4 text-base focus:outline-none focus:border-cx-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-cx-on-surface"
                    required
                  />
                  <label
                    htmlFor="url-input"
                    className="scanner-url-label absolute left-4 top-4 font-mono-cx text-[12px] font-bold uppercase tracking-widest text-cx-on-surface-variant transition-all pointer-events-none"
                  >
                    Target URL
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className={`px-8 md:px-10 py-4 font-mono-cx text-[12px] font-bold uppercase tracking-widest transition-all duration-150 shrink-0 ${
                    loading
                      ? "bg-cx-primary-container text-white animate-pulse cursor-wait"
                      : scanJustCompleted
                      ? "bg-cx-secondary text-white"
                      : "bg-cx-primary-container text-white hover:bg-cx-on-tertiary-fixed active:scale-95"
                  }`}
                >
                  {loading ? "Scanning..." : scanJustCompleted ? "Scan Complete" : "Start Scan"}
                </button>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-4 border border-cx-error/40 bg-cx-error-container p-4 text-sm text-cx-on-error-container"
                >
                  <p className="font-bold uppercase tracking-widest text-[11px] mb-1">
                    {error.includes(": ") ? error.split(": ")[0] : "Scan Error"}
                  </p>
                  <p>{error.includes(": ") ? error.split(": ").slice(1).join(": ") : error}</p>
                </div>
              )}

              <ScannerAuthPanel
                targetUrl={url}
                authMode={authMode}
                onAuthModeChange={setAuthMode}
                authMethod={authMethod}
                onAuthMethodChange={setAuthMethod}
                loginUrl={loginUrl}
                onLoginUrlChange={setLoginUrl}
                username={authUsername}
                onUsernameChange={setAuthUsername}
                password={authPassword}
                onPasswordChange={setAuthPassword}
                usernameSelector={usernameSelector}
                onUsernameSelectorChange={setUsernameSelector}
                passwordSelector={passwordSelector}
                onPasswordSelectorChange={setPasswordSelector}
                submitSelector={submitSelector}
                onSubmitSelectorChange={setSubmitSelector}
                sessionJson={sessionJson}
                onSessionJsonChange={setSessionJson}
                saveForReuse={saveForReuse}
                onSaveForReuseChange={setSaveForReuse}
                useStored={useStoredAuth}
                onUseStoredChange={setUseStoredAuth}
                disabled={loading}
              />
            </form>

            {isRestoredReport && report && (
              <div className="mt-4 border border-cx-outline-variant/40 bg-cx-surface-container-low p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-sm text-cx-on-surface-variant">
                  Previous scan report restored from your last session
                </span>
                <div className="flex gap-2">
                  {report.reportId && (
                    <button
                      type="button"
                      onClick={() => router.push(`/reports/${report.reportId}?from=scanner`)}
                      className="text-[11px] uppercase tracking-widest bg-cx-primary text-cx-on-primary px-3 py-1.5 hover:brightness-110 transition-colors"
                    >
                      View Report
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearSavedData}
                    className="text-[11px] uppercase tracking-widest border border-cx-outline-variant px-3 py-1.5 hover:bg-cx-surface-container transition-colors"
                  >
                    Clear &amp; New Scan
                  </button>
                </div>
              </div>
            )}
          </motion.section>

          {/* Idle state: protocol steps + capability grid */}
          {!report && !loading && (
            <>
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-cx-surface/80 border border-cx-outline-variant/30 backdrop-blur px-6 py-4"
              >
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
                  {SCANNER_STEPS.map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className="font-mono-cx text-[10px] font-bold text-cx-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono-cx text-[11px] uppercase tracking-widest text-cx-on-surface-variant">
                        {step}
                      </span>
                      {i < SCANNER_STEPS.length - 1 && (
                        <span className="material-symbols-outlined text-sm text-cx-outline-variant" aria-hidden="true">
                          arrow_forward
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>

              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px">
                {SCANNER_FEATURES.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    className="bg-cx-surface border border-cx-outline-variant/30 p-6 group hover:border-cx-primary/50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-cx-primary text-2xl mb-4 block">
                      {feature.icon}
                    </span>
                    <h3 className="font-mono-cx text-[12px] font-bold uppercase tracking-widest text-cx-on-surface mb-2">
                      {feature.title}
                    </h3>
                    <p className="font-mono-cx text-[12px] leading-relaxed text-cx-on-surface-variant">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </section>
            </>
          )}

          {/* Dashboard Stats Row */}
          {report && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <StatCard label="Report ID" value={`#${report.reportId}`} />
              <StatCard
                label="Pages Scanned"
                value={report.summary?.pages ?? 0}
                suffix={report.summary?.pageLimit ? `/ ${report.summary.pageLimit}` : undefined}
              />
              <StatCard label="Affected Nodes" value={report.summary?.totalNodes ?? 0} highlight />
            </section>
          )}

          {/* Progress HUD */}
          {loading && (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cx-surface border border-cx-outline-variant/30 p-6"
            >
              <div className="flex justify-between items-end mb-4">
                <div className="font-mono-cx text-[12px] font-bold uppercase tracking-widest text-cx-on-surface">
                  Live Scan Sequence
                </div>
                <div className="font-mono-cx text-[12px] font-bold uppercase tracking-widest text-cx-primary">
                  {Math.round(progress)}% Complete
                </div>
              </div>
              <div className="w-full bg-cx-surface-container-high h-2 mb-6">
                <div
                  className="bg-cx-primary-container h-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.round(progress)}%` }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                {scanSteps.map((step) => {
                  const status = getStepStatus(currentPhase, step.phase);
                  const isCompleted = status === "completed";
                  const isActive = status === "active";
                  const displayMessage =
                    isActive && currentStep ? currentStep : step.message;

                  return (
                    <div
                      key={step.phase}
                      className={`flex items-center gap-3 py-1 ${
                        isCompleted || isActive ? "opacity-100" : "opacity-60"
                      }`}
                    >
                      {isCompleted ? (
                        <span
                          className="material-symbols-outlined text-cx-primary text-sm shrink-0"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_box
                        </span>
                      ) : isActive ? (
                        <span className="relative flex h-4 w-4 items-center justify-center shrink-0">
                          <span className="absolute inset-0 border-2 border-cx-primary/30 border-t-cx-primary rounded-full animate-spin" />
                          <span
                            className="material-symbols-outlined text-cx-primary text-sm relative"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {getPhaseIcon(step.phase)}
                          </span>
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-cx-outline-variant text-sm shrink-0">
                          check_box_outline_blank
                        </span>
                      )}
                      <span className="font-mono-cx text-[12px] font-bold uppercase tracking-wide truncate">
                        {formatHudLabel(displayMessage)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {report && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-px">
              {/* Meta + actions */}
              <div className="bg-cx-surface border border-cx-outline-variant/30 p-6 space-y-4 relative">
                <div className="absolute top-2 right-2 font-mono-cx text-[11px] text-cx-outline-variant">
                  [REPORT_META_02]
                </div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 text-sm pt-4">
                  <div>
                    <div className="text-[12px] font-bold uppercase tracking-widest text-cx-on-surface-variant mb-1">
                      Base URL
                    </div>
                    <div className="font-mono-cx text-cx-primary break-all">{report.baseUrl}</div>
                  </div>
                  {report.createdAt && (
                    <div className="text-cx-on-surface-variant text-xs md:text-right">
                      Generated: {formatDateTime(report.createdAt)}
                    </div>
                  )}
                </div>

                {Array.isArray(report.summary?.topRules) && report.summary.topRules.length > 0 && (
                  <div>
                    <div className="text-[12px] font-bold uppercase tracking-widest text-cx-on-surface-variant mb-2">
                      Top Rules
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {report.summary.topRules.slice(0, 8).map((r, idx) => {
                        const ruleId = r.rule ?? r.id;
                        return (
                          <span
                            key={ruleId ?? `rule-${idx}`}
                            className="inline-flex items-center gap-2 border border-cx-outline-variant/40 px-2 py-1 text-[11px] font-mono-cx"
                          >
                            <span className="text-cx-primary">{ruleId ?? "Unknown"}</span>
                            <span className="text-cx-secondary">{r.nodes}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleExportPdf}
                    disabled={exportingPdf}
                    className="btn-hud-secondary disabled:opacity-60"
                  >
                    {exportingPdf ? "Exporting..." : "Export PDF"}
                  </button>
                  <button type="button" onClick={clearSavedData} className="btn-hud-secondary">
                    Clear &amp; New Scan
                  </button>
                  {report.pages?.some((p) => p.violations?.length > 0) && (
                    <>
                      <button type="button" onClick={() => setShowAIFix(true)} className="btn-hud-primary">
                        Fix Suggestion
                      </button>
                      <ComprehensiveReportButton report={report} url={url} darkMode={darkMode} />
                    </>
                  )}
                </div>
              </div>

              {/* Page navigation */}
              {Array.isArray(report.pages) && report.pages.length > 0 && (
                <section className="bg-cx-surface border border-cx-outline-variant/30 p-4">
                  <div className="flex items-baseline justify-between border-b border-cx-outline-variant/20 pb-2 mb-3">
                    <h3 className="text-[12px] font-bold uppercase tracking-widest text-cx-on-surface">
                      Scanned Pages
                    </h3>
                    <span className="text-[11px] text-cx-on-surface-variant uppercase tracking-widest">
                      Total: {report.pages.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {report.pages.map((p, idx) => {
                      const id = `page-${idx}`;
                      return (
                        <a
                          key={p.url || id}
                          href={`#${id}`}
                          className="inline-flex items-center gap-2 border border-cx-outline-variant/40 px-3 py-1.5 text-[11px] font-mono-cx text-cx-on-surface-variant hover:text-cx-primary hover:border-cx-primary-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">link</span>
                          {pagePath(p.url)}
                        </a>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Violation Ledger */}
              {violationLedger.length > 0 && (
                <section className="bg-cx-surface-container-low border border-cx-outline-variant/30 overflow-hidden">
                  <div className="bg-cx-surface p-4 border-b border-cx-outline-variant/30 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h3 className="font-mono-cx text-[12px] font-bold uppercase tracking-widest">
                      Violation Ledger
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {impactCounts.critical > 0 && (
                        <span className={`px-2 py-1 font-mono-cx text-[10px] uppercase font-bold impact-count-critical`}>
                          {impactCounts.critical} Critical
                        </span>
                      )}
                      {impactCounts.serious > 0 && (
                        <span className={`px-2 py-1 font-mono-cx text-[10px] uppercase font-bold impact-count-serious`}>
                          {impactCounts.serious} Serious
                        </span>
                      )}
                      {impactCounts.moderate > 0 && (
                        <span className={`px-2 py-1 font-mono-cx text-[10px] uppercase font-bold ${getImpactCountClass("moderate")}`}>
                          {impactCounts.moderate} Moderate
                        </span>
                      )}
                      {impactCounts.minor > 0 && (
                        <span className={`px-2 py-1 font-mono-cx text-[10px] uppercase font-bold impact-count-minor`}>
                          {impactCounts.minor} Minor
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="divide-y divide-cx-outline-variant/20 max-h-[600px] overflow-y-auto scanner-scrollbar">
                    {violationLedger.map((v) => (
                      <ViolationRow
                        key={v.key}
                        violation={v}
                        pageLabel={pagePath(v.pageUrl)}
                        wcagTag={Array.isArray(v.tags) ? v.tags[0] : v.id}
                        onFixSuggestion={() => setShowAIFix(true)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Per-page detail sections */}
              {Array.isArray(report.pages) && report.pages.length > 0 && (
                <section className="space-y-px">
                  {report.pages.map((p, idx) => {
                    const id = `page-${idx}`;
                    const path = pagePath(p.url);
                    const violations = p.violations || [];
                    const hasScanError = p.meta?.scanError;

                    return (
                      <section
                        key={p.url || id}
                        id={id}
                        className="border border-cx-outline-variant/30 p-5 md:p-6 scroll-mt-24 bg-cx-surface"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cx-outline-variant/20 pb-4 mb-4">
                          <h2 className="text-sm font-bold uppercase flex items-center gap-2 text-cx-on-surface">
                            <span className="material-symbols-outlined text-cx-outline-variant text-base">link</span>
                            {path}
                          </h2>
                          <div className="text-xs text-cx-on-surface-variant">
                            {p.scannedAt ? new Date(p.scannedAt).toLocaleString() : ""}
                          </div>
                        </div>

                        {hasScanError ? (
                          <div className="p-8 text-center text-cx-error">
                            <p className="font-bold uppercase text-sm">Page not found or unable to scan</p>
                            <p className="text-xs mt-2 text-cx-on-surface-variant">
                              {p.meta?.errorMessage ||
                                "This page could not be accessed or scanned for accessibility issues."}
                            </p>
                          </div>
                        ) : violations.length === 0 ? (
                          <div className="p-8 text-center">
                            <span
                              className="material-symbols-outlined text-cx-secondary text-3xl mb-2"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              check_circle
                            </span>
                            <p className="text-sm text-cx-on-surface">No accessibility issues found on this page.</p>
                          </div>
                        ) : (
                          <ul className="divide-y divide-cx-outline-variant/20">
                            {violations.map((v, vi) => {
                              const vKey = `${idx}-${v.id}-${vi}`;
                              const expanded = !!expandedViolations[`page-${vKey}`];

                              return (
                                <li key={vKey} className="py-4 first:pt-0 last:pb-0">
                                  <button
                                    type="button"
                                    onClick={() => toggleViolationExpand(`page-${vKey}`)}
                                    className="w-full flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-left"
                                  >
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-center flex-wrap gap-2">
                                        <ImpactBadge impact={v.impact} />
                                        <span className="text-sm font-bold text-cx-on-surface">{v.id}</span>
                                      </div>
                                      <p className="text-xs text-cx-on-surface-variant">{v.description}</p>
                                    </div>
                                    <span className="text-[11px] border border-cx-outline-variant px-2 py-1 text-cx-on-surface-variant shrink-0">
                                      {v.nodes?.length ?? 0} nodes
                                    </span>
                                  </button>

                                  {expanded && Array.isArray(v.nodes) && v.nodes.length > 0 && (
                                    <div className="mt-4 impact-code-block border border-cx-outline-variant/20 space-y-3">
                                      {v.nodes.slice(0, 5).map((n, ni) => (
                                        <div
                                          key={`${vKey}-n-${ni}`}
                                          className="border-b border-cx-outline-variant/20 pb-3 last:border-0"
                                        >
                                          <div className="text-[10px] uppercase text-cx-secondary-fixed mb-2 px-4 pt-3">
                                            {(n.target || []).join(", ")}
                                          </div>
                                          {n.failureSummary && (
                                            <p className="text-xs text-cx-on-surface-variant mb-2 px-4">
                                              {n.failureSummary}
                                            </p>
                                          )}
                                          {n.html && (
                                            <pre className="text-[11px] overflow-x-auto whitespace-pre-wrap px-4 pb-3">
                                              {n.html}
                                            </pre>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </section>
                    );
                  })}
                </section>
              )}
            </motion.div>
          )}
        </div>
      </main>

      <AIFixSidebar
        violations={report?.pages?.flatMap((p) => p.violations || []) || []}
        scanUrl={report?.baseUrl || url}
        isOpen={showAIFix}
        onClose={() => setShowAIFix(false)}
      />
    </section>
  );
}
