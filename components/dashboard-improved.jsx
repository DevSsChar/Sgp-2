"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

function StatCard({ label, value, icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 p-5"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="rounded-full bg-[#00d4ff]/10 p-2.5 text-[#00483a]">
            {icon}
          </div>
        )}
        <div>
          <div className="text-sm text-gray-600">{label}</div>
          <div className="font-semibold text-xl text-gray-900">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

function ReportCard({ report, index }) {
  // Format date nicely
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return "Unknown date";
    }
  };

  // Try to get domain from URL
  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-xl bg-white shadow-md hover:shadow-lg border border-gray-100 p-5 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#00d4ff] to-[#00483a]"></div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-sm text-gray-600">{formatDate(report.createdAt)}</div>
          <div className="font-medium text-gray-900 text-lg truncate mt-1">
            {getDomain(report.targetUrl)}
          </div>
          <div className="text-sm text-gray-600 truncate max-w-xs">
            {report.targetUrl}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
            <div className="text-sm font-medium text-blue-700">
              {report.summary?.issuesTotal ?? 0} issues
            </div>
          </div>
          <Link
            href={`/dashboard/reports/${report._id}`}
            className="inline-flex items-center justify-center rounded-lg bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00483a] px-4 py-2 font-medium text-sm transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function UserDashboard({ user: userProp = null, reports: reportsProp = [] }) {
  const { data: session } = useSession();
  const [user, setUser] = useState(userProp);
  const [reports, setReports] = useState(reportsProp);
  const [loading, setLoading] = useState(!userProp);

  // Optional: try to fetch richer user data if an API exists (safe fallback if 404)
  useEffect(() => {
    if (userProp) return;
    let abort = false;
    async function load() {
      try {
        const res = await fetch("/api/user/me", { cache: "no-store" });
        if (!res.ok) throw new Error("no api");
        const data = await res.json();
        if (!abort) {
          setUser(data?.user || null);
          setReports(data?.reports || []);
        }
      } catch {
        // Fallback to session info only
        if (!abort) {
          setUser({
            fullName: session?.user?.name || "User",
            email: session?.user?.email || "",
            scansCount: 0,
            lastLoginAt: null,
          });
        }
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => { abort = true; };
  }, [session, userProp]);

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return "—";
    }
  };

  // Icons for stats
  const scanIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20"></path>
      <path d="m17 7 5 5-5 5"></path>
      <path d="M7 7 2 12l5 5"></path>
    </svg>
  );

  const loginIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
      <polyline points="10 17 15 12 10 7"></polyline>
      <line x1="15" y1="12" x2="3" y2="12"></line>
    </svg>
  );

  const reportIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );

  const stats = useMemo(() => {
    const totalScans = user?.scansCount ?? 0;
    const lastLogin = user?.lastLoginAt
      ? formatDate(user.lastLoginAt)
      : "—";

    // Prefer latestScan (when populated with createdAt), else fallback to reports[0]
    let lastReport = "—";
    if (
      user?.latestScan &&
      typeof user.latestScan === "object" &&
      user.latestScan.createdAt
    ) {
      lastReport = formatDate(user.latestScan.createdAt);
    } else if (reports?.length) {
      lastReport = formatDate(reports[0]?.createdAt);
    }

    return [
      { label: "Total Scans", value: totalScans, icon: scanIcon },
      { label: "Last Login", value: lastLogin, icon: loginIcon },
      { label: "Last Report", value: lastReport, icon: reportIcon },
    ];
  }, [user, reports]);

  return (
    <section className="mt-20 md:mt-24 min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#00483a]">
                Welcome{user?.fullName ? `, ${user.fullName}` : ""} 👋
              </h1>
              <p className="text-lg text-gray-700 mt-1">
                View your accessibility scans and manage reports
              </p>
            </div>
            <Link
              href="/scanner"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00d4ff] text-white font-medium px-5 py-2.5 hover:bg-[#00d4ff]/90 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              New Scan
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          {stats.map((s, i) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              icon={s.icon}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/scanner" 
              className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-4 flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="w-10 h-10 bg-[#00d4ff]/10 rounded-full flex items-center justify-center text-[#00483a] mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12h20"></path>
                  <path d="m17 7 5 5-5 5"></path>
                  <path d="M7 7 2 12l5 5"></path>
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Run Scan</h3>
              <p className="text-xs text-gray-600 mt-1">Scan a website for accessibility issues</p>
            </Link>
            <Link 
              href="/history" 
              className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-4 flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="w-10 h-10 bg-[#00d4ff]/10 rounded-full flex items-center justify-center text-[#00483a] mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">View History</h3>
              <p className="text-xs text-gray-600 mt-1">Access all previous scan reports</p>
            </Link>
            <Link 
              href="/profile" 
              className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-4 flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="w-10 h-10 bg-[#00d4ff]/10 rounded-full flex items-center justify-center text-[#00483a] mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Profile</h3>
              <p className="text-xs text-gray-600 mt-1">Manage your account settings</p>
            </Link>
            <Link 
              href="/settings" 
              className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-4 flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="w-10 h-10 bg-[#00d4ff]/10 rounded-full flex items-center justify-center text-[#00483a] mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Settings</h3>
              <p className="text-xs text-gray-600 mt-1">Configure scan preferences</p>
            </Link>
          </div>
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
              <p className="text-sm text-gray-600 mt-1">Your latest accessibility scan reports</p>
            </div>
            <Link 
              href="/history" 
              className="mt-2 sm:mt-0 text-[#00d4ff] hover:text-[#00483a] text-sm font-medium transition-colors flex items-center gap-1"
            >
              View all reports
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl bg-gray-100 animate-pulse h-24" />
              ))}
            </div>
          ) : reports?.length ? (
            <div className="space-y-4">
              {reports.slice(0, 5).map((report, index) => (
                <ReportCard key={report._id} report={report} index={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                  className="text-gray-500">
                  <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No reports yet</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                You haven't run any accessibility scans yet. Start by running your first scan to see the results here.
              </p>
              <Link
                href="/scanner"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00d4ff] text-white font-medium px-6 py-3 hover:bg-[#00d4ff]/90 transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12h20"></path>
                  <path d="m17 7 5 5-5 5"></path>
                  <path d="M7 7 2 12l5 5"></path>
                </svg>
                Run Your First Scan
              </Link>
            </div>
          )}
        </motion.div>

        {/* Summary Stats */}
        {reports?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Issue Distribution</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="bg-red-100 text-red-800 rounded-lg px-2 py-3 text-xl font-medium">
                    {reports.reduce((total, report) => total + (report.summary?.criticalCount || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">Critical</div>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 text-orange-800 rounded-lg px-2 py-3 text-xl font-medium">
                    {reports.reduce((total, report) => total + (report.summary?.seriousCount || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">Serious</div>
                </div>
                <div className="text-center">
                  <div className="bg-amber-100 text-amber-800 rounded-lg px-2 py-3 text-xl font-medium">
                    {reports.reduce((total, report) => total + (report.summary?.moderateCount || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">Moderate</div>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 text-yellow-800 rounded-lg px-2 py-3 text-xl font-medium">
                    {reports.reduce((total, report) => total + (report.summary?.minorCount || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">Minor</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">Total scans this month</div>
                  <div className="text-lg font-medium text-gray-900">{user?.scansCount || 0}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">Avg. issues per scan</div>
                  <div className="text-lg font-medium text-gray-900">
                    {reports.length 
                      ? Math.round(reports.reduce((total, report) => total + (report.summary?.issuesTotal || 0), 0) / reports.length)
                      : 0}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">Most common issue</div>
                  <div className="text-sm font-medium bg-gray-100 px-2 py-1 rounded text-gray-800">
                    {reports.length ? "aria-required-attr" : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
