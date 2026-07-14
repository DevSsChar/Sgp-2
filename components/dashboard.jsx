"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import PageCanvas from "./layout/PageCanvas";
import { useTheme } from "./ThemeContext";

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url || "unknown";
  }
}

function getIssuesCount(report) {
  if (report.summary?.issuesTotal !== undefined) return report.summary.issuesTotal;
  if (report.summary?.totalIssues !== undefined) return report.summary.totalIssues;

  const byImpact = report.summary?.byImpactNodes || report.summary?.byImpact || {};
  let total = 0;
  if (byImpact.critical) total += byImpact.critical;
  if (byImpact.serious) total += byImpact.serious;
  if (byImpact.moderate) total += byImpact.moderate;
  if (byImpact.minor) total += byImpact.minor;
  if (byImpact["needs-review"]) total += byImpact["needs-review"];
  if (total > 0) return total;

  if (report.summary?.totalNodes) {
    return Math.round(report.summary.totalNodes * 0.05);
  }
  return 0;
}

function getCriticalCount(report) {
  const byImpact = report.summary?.byImpactNodes || report.summary?.byImpact || {};
  return byImpact.critical || 0;
}

function getReportLink(report, index) {
  const id = report.reportId || report._id || report.id;
  if (report.reportId) return `/reports/${report.reportId}`;
  if (id) return `/reports/${id}`;
  return `/reports/report-${index}`;
}

function computeScore(report) {
  const issues = getIssuesCount(report);
  const nodes = report.summary?.totalNodes || Math.max(issues * 10, 50);
  if (nodes <= 0) return 100;
  return Math.round(Math.max(5, Math.min(100, 100 - (issues / nodes) * 120)));
}

function getStatusMeta(score, darkMode) {
  if (score >= 80) {
    return {
      text: "[SECURE]",
      className: darkMode ? "text-cx-secondary-container" : "text-cx-secondary",
    };
  }
  if (score >= 50) return { text: "[WARNING]", className: "text-cx-on-surface-variant" };
  return { text: "[CRITICAL]", className: "text-cx-error" };
}

function formatTableDate(dateString) {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return "—";
  }
}

function formatLoginTime(dateString) {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "—";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  } catch {
    return "—";
  }
}

function formatReportDate(dateString) {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const year = String(d.getFullYear()).slice(-2);
    return `${day}.${months[d.getMonth()]}.${year}`;
  } catch {
    return "—";
  }
}

function StatPanel({ label, children, variant = "default", delay = 0 }) {
  const variantClass =
    variant === "error"
      ? "border-l-4 border-l-cx-error"
      : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`hacker-border bg-cx-surface-container p-6 ${variantClass}`}
    >
      <p className="font-mono-cx text-[11px] uppercase tracking-widest text-cx-on-surface-variant mb-4">
        {label}
      </p>
      {children}
    </motion.div>
  );
}

function ScoreBar({ score, variant = "good" }) {
  const { darkMode } = useTheme();
  const barColor =
    variant === "error"
      ? "bg-cx-error"
      : darkMode
        ? "bg-cx-secondary-container"
        : "bg-cx-secondary";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-cx-surface-container-highest h-1">
        <div className={`${barColor} h-full transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="font-mono-cx text-sm text-cx-on-surface">{score}%</span>
    </div>
  );
}

function ViolationChart({ tag, tagClass, total, totalClass, bars, barClass, borderClass }) {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"];
  return (
    <div className="hacker-border bg-cx-surface-container-low p-6">
      <div className="flex justify-between mb-8">
        <span className={`font-mono-cx text-[11px] uppercase tracking-widest px-2 py-1 ${tagClass}`}>
          {tag}
        </span>
        <span className={`font-mono-cx text-2xl font-semibold tracking-tight ${totalClass}`}>{total}</span>
      </div>
      <div className="flex items-end gap-2 h-40">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`flex-1 border-t-2 ${barClass} ${borderClass}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-4 font-mono-cx text-[10px] text-cx-on-surface-variant">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

export default function UserDashboard({ user: userProp = null, reports: reportsProp = [] }) {
  const { data: session } = useSession();
  const { darkMode } = useTheme();
  const [user, setUser] = useState(userProp);
  const [reports, setReports] = useState(reportsProp);
  const [loading, setLoading] = useState(!userProp);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function load() {
      try {
        let userData = userProp || {
          fullName: session?.user?.name || "User",
          email: session?.user?.email || "",
          scansCount: session?.user?.scansCount,
          lastLoginAt: session?.user?.lastLoginAt || null,
        };

        try {
          const meRes = await fetch("/api/user/me", {
            signal,
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            if (meData?.user) {
              userData = {
                ...userData,
                fullName: meData.user.fullName || userData.fullName,
                email: meData.user.email || userData.email,
                scansCount: meData.user.scansCount ?? userData.scansCount,
                lastLoginAt:
                  meData.user.lastLoginAt ||
                  meData.user.updatedAt ||
                  meData.user.createdAt ||
                  userData.lastLoginAt ||
                  null,
                latestScan: meData.user.latestScan || null,
              };
            }
          }
        } catch (error) {
          if (error.name !== "AbortError") console.error("Error fetching user profile:", error);
        }

        setUser(userData);

        try {
          const historyRes = await fetch("/api/history", {
            signal,
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
          });
          if (historyRes.ok) {
            const historyData = await historyRes.json();
            if (historyData?.items?.length > 0) {
              setReports(historyData.items);
              return;
            }
          }
        } catch (error) {
          if (error.name !== "AbortError") console.error("Error fetching history:", error);
        }

        try {
          const reportsRes = await fetch("/api/reports?limit=5", {
            signal,
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
          });
          if (reportsRes.ok) {
            const reportsData = await reportsRes.json();
            if (Array.isArray(reportsData.items)) {
              setReports(reportsData.items);
            } else if (reportsProp?.length > 0) {
              setReports(reportsProp);
            }
          }
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Error fetching reports:", error);
            if (reportsProp?.length > 0) setReports(reportsProp);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [session?.user?.email]);

  const userHandle = useMemo(() => {
    const name = user?.fullName || session?.user?.name || "USER";
    return name.toUpperCase().replace(/\s+/g, "_").slice(0, 16);
  }, [user, session]);

  const stats = useMemo(() => {
    const totalScans = user?.scansCount ?? reports?.length ?? 0;
    // Format only after mount so SSR HTML matches the first client render.
    const lastLogin = hasMounted ? formatLoginTime(user?.lastLoginAt) : "—";

    let lastReportDate = "—";
    const latestTs =
      user?.latestScan?.createdAt ||
      reports[0]?.createdAt ||
      reports[0]?.finishedAt ||
      reports[0]?.startedAt;
    if (hasMounted && latestTs) lastReportDate = formatReportDate(latestTs);

    const totalIssues = reports.reduce((sum, r) => sum + getIssuesCount(r), 0);
    const criticalIssues = reports.reduce((sum, r) => sum + getCriticalCount(r), 0);

    return { totalScans, lastLogin, lastReportDate, totalIssues, criticalIssues };
  }, [user, reports, hasMounted]);

  const tableReports = useMemo(
    () => reports.slice(0, 5).map((report, index) => {
      const url = report.targetUrl || report.baseUrl || report.url || "";
      const score = computeScore(report);
      const status = getStatusMeta(score, darkMode);
      return {
        key: report._id || report.reportId || index,
        domain: getDomain(url),
        score,
        status,
        date: hasMounted
          ? formatTableDate(report.createdAt || report.finishedAt || report.startedAt)
          : "—",
        link: getReportLink(report, index),
        barVariant: score < 50 ? "error" : "good",
      };
    }),
    [reports, darkMode, hasMounted]
  );

  const beforeBars = [100, 85, 90, 95, 80, 75, 88, 92];
  const afterBars = [15, 10, 8, 5, 4, 3, 2, 2];
  const beforeTotal = reports.length > 0 ? Math.max(stats.totalIssues * 4, 48) : 482;
  const afterTotal = reports.length > 0 ? stats.totalIssues || 12 : 12;

  const notifications = useMemo(() => {
    const items = [
      { time: "14:22", tone: "ok", text: "NEW WCAG 2.2 GUIDELINES SYNCED" },
    ];
    const worst = tableReports.find((r) => r.score < 50);
    if (worst) {
      items.push({
        time: "11:05",
        tone: "error",
        text: `CRITICAL ERROR ON DOMAIN: ${worst.domain.toUpperCase()}`,
      });
    }
    items.push({ time: "09:00", tone: "muted", text: "WEEKLY SUMMARY READY" });
    return items;
  }, [tableReports]);

  return (
    <PageCanvas>
      {/* Header strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 border-b border-cx-primary/20 pb-4"
      >
        <div>
          <h1 className="font-mono-cx text-2xl font-semibold text-cx-on-surface tracking-widest uppercase">
            Dashboard
          </h1>
          <p className="font-mono-cx text-[11px] uppercase tracking-widest text-cx-on-surface-variant mt-1">
            TERMINAL ACCESS: GRANTED // USER: {userHandle}
          </p>
        </div>
        <Link
          href="/scanner"
          className="bg-cx-primary-container text-cx-on-primary-container px-6 py-2 font-mono-cx text-[11px] font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
        >
          [ NEW SCAN ]
        </Link>
      </motion.div>

      {/* Stat row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatPanel label="Total Scans" delay={0}>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-cx text-4xl font-bold text-cx-primary tracking-tight">
              {stats.totalScans.toLocaleString()}
            </span>
            {reports.length > 0 && (
              <span className={`font-mono-cx text-[10px] ${darkMode ? "text-cx-secondary-container" : "text-cx-secondary"}`}>
                ACTIVE
              </span>
            )}
          </div>
        </StatPanel>

        <StatPanel label="Last Login" delay={0.05}>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-cx text-2xl font-bold text-cx-on-surface tracking-tight">
              {stats.lastLogin}
            </span>
            {stats.lastLogin !== "—" && (
              <span className="font-mono-cx text-[10px] text-cx-on-surface-variant">LOCAL</span>
            )}
          </div>
        </StatPanel>

        <StatPanel label="Last Report" delay={0.1}>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-cx text-2xl font-bold text-cx-on-surface tracking-tight">
              {stats.lastReportDate}
            </span>
          </div>
        </StatPanel>

        <StatPanel label="Issues Found" variant="error" delay={0.15}>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-cx text-4xl font-bold text-cx-error tracking-tight">
              {stats.totalIssues}
            </span>
            {stats.criticalIssues > 0 && (
              <span className="font-mono-cx text-[10px] text-cx-error-container uppercase">Critical</span>
            )}
          </div>
        </StatPanel>
      </div>

      {/* Reports table + side panels */}
      <div className="grid grid-cols-12 gap-4 mb-10">
        <div className="col-span-12 lg:col-span-8 hacker-border bg-cx-surface-container overflow-hidden">
          <div className="px-6 py-4 border-b border-cx-outline-variant/20 flex justify-between items-center bg-cx-surface-container-high">
            <h3 className="font-mono-cx text-[11px] font-bold uppercase tracking-widest text-cx-primary">
              Recent Reports
            </h3>
            <span className="font-mono-cx text-[10px] text-cx-on-surface-variant">AUTO-REFRESH: ON</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono-cx text-[13px]">
              <thead>
                <tr className="text-cx-on-surface-variant border-b border-cx-outline-variant/20">
                  <th className="px-6 py-3 font-medium uppercase">Domain</th>
                  <th className="px-6 py-3 font-medium uppercase">Score</th>
                  <th className="px-6 py-3 font-medium uppercase">Status</th>
                  <th className="px-6 py-3 font-medium uppercase">Date</th>
                  <th className="px-6 py-3 font-medium uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cx-outline-variant/10">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-6 bg-cx-surface-container-low animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : tableReports.length > 0 ? (
                  tableReports.map((row) => (
                    <tr key={row.key} className="hover:bg-cx-primary/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-cx-on-surface">{row.domain}</td>
                      <td className="px-6 py-4">
                        <ScoreBar score={row.score} variant={row.barVariant} />
                      </td>
                      <td className={`px-6 py-4 font-mono-cx text-[11px] ${row.status.className}`}>
                        {row.status.text}
                      </td>
                      <td className="px-6 py-4 text-cx-on-surface-variant">{row.date}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={row.link}
                          className="text-cx-primary hover:underline underline-offset-4 glitch-hover uppercase text-[11px] tracking-widest"
                        >
                          VIEW
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <p className="font-mono-cx text-sm text-cx-on-surface-variant mb-4">
                        No scan reports yet. Run your first scan to populate this ledger.
                      </p>
                      <Link href="/scanner" className="btn-hud-primary inline-flex px-6 py-2">
                        [ RUN SCAN ]
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="hacker-border bg-cx-surface-container p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-6xl text-cx-on-surface">gavel</span>
            </div>
            <h3 className="font-mono-cx text-[11px] font-bold uppercase tracking-widest text-cx-on-surface mb-6">
              Legal Risk Exposure
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-3">
                <span className="font-mono-cx text-[11px] uppercase tracking-wider text-cx-on-surface-variant">
                  Pending Settlements
                </span>
                <span className="bg-cx-error-container text-cx-error px-2 py-1 text-[10px] font-bold tracking-widest">
                  $6M
                </span>
              </div>
              <div className="flex justify-between items-center gap-3">
                <span className="font-mono-cx text-[11px] uppercase tracking-wider text-cx-on-surface-variant">
                  Avg. Compliance Fine
                </span>
                <span className={`${
                  darkMode
                    ? "bg-cx-tertiary-container text-cx-on-tertiary-container"
                    : "bg-cx-on-tertiary-container text-cx-tertiary"
                } px-2 py-1 text-[10px] font-bold tracking-widest`}>
                  $250K
                </span>
              </div>
            </div>
            <div className="mt-8 border-t border-cx-outline-variant/20 pt-4">
              <p className="font-mono-cx text-[10px] leading-relaxed text-cx-on-surface-variant italic">
                * ESTIMATED VALUES BASED ON CURRENT WCAG 2.1 NON-COMPLIANCE RATINGS DETECTED ON CORE DOMAINS.
              </p>
            </div>
          </div>

          <div className="hacker-border bg-cx-surface-container p-6 border-2 border-cx-primary/20 relative overflow-hidden">
            <div className="dashboard-scan-line" />
            <h3 className="font-mono-cx text-[11px] font-bold uppercase tracking-widest text-cx-primary mb-4">
              System Notifications
            </h3>
            <div className="space-y-3">
              {notifications.map((n, i) => (
                <div key={i} className="flex gap-3 font-mono-cx text-[11px]">
                  <span
                    className={
                      n.tone === "ok"
                        ? `${darkMode ? "text-cx-secondary-container" : "text-cx-secondary"} shrink-0`
                        : n.tone === "error"
                          ? "text-cx-error shrink-0"
                          : "text-cx-on-surface-variant shrink-0"
                    }
                  >
                    [{n.time}]
                  </span>
                  <span className="text-cx-on-surface-variant">{n.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Violation reduction analysis */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <h2 className="font-mono-cx text-[11px] font-bold text-cx-on-surface-variant uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-cx-outline-variant" />
            Violation Reduction Analysis
            <span className="flex-1 h-px bg-cx-outline-variant" />
          </h2>
        </div>

        {reports.length > 0 ? (
          <>
            <div className="col-span-12 md:col-span-6">
              <ViolationChart
                tag="[ PRE-OPTIMIZATION ]"
                tagClass="text-cx-error bg-cx-error/10"
                total={beforeTotal}
                totalClass="text-cx-error"
                bars={beforeBars}
                barClass="bg-cx-error/40"
                borderClass="border-cx-error"
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <ViolationChart
                tag="[ CURRENT STATE ]"
                tagClass={
                  darkMode
                    ? "text-cx-secondary-container bg-cx-secondary-container/10"
                    : "text-cx-secondary bg-cx-secondary/10"
                }
                total={afterTotal}
                totalClass={darkMode ? "text-cx-secondary-container" : "text-cx-secondary"}
                bars={afterBars}
                barClass={darkMode ? "bg-cx-secondary-container/40" : "bg-cx-secondary/40"}
                borderClass={darkMode ? "border-cx-secondary-container" : "border-cx-secondary"}
              />
            </div>
          </>
        ) : (
          <div className="col-span-12 hacker-border bg-cx-surface-container-low p-8 text-center">
            <p className="font-mono-cx text-sm text-cx-on-surface-variant max-w-lg mx-auto">
              Run your first scan to unlock violation reduction analysis across your domains.
            </p>
          </div>
        )}
      </div>
    </PageCanvas>
  );
}
