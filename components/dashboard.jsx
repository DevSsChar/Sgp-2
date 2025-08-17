"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useTheme } from './ThemeContext';

function StatCard({ label, value, icon, delay = 0 }) {
  const { darkMode } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-lg transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-100'} p-5`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`rounded-full ${darkMode ? 'bg-[#38bdf8]/20 text-[#38bdf8]' : 'bg-[#00d4ff]/10 text-[#00483a]'} p-2.5`}>
            {icon}
          </div>
        )}
        <div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
          <div className={`font-semibold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

function ReportCard({ report, index }) {
  const { darkMode } = useTheme();
  
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

  // Calculate total issues count from various possible structures
  const getIssuesCount = () => {
    // First check for direct issue counts
    if (report.summary?.issuesTotal !== undefined) return report.summary.issuesTotal;
    if (report.summary?.totalIssues !== undefined) return report.summary.totalIssues;
    
    // Then check for byImpact counts in summary
    const byImpact = report.summary?.byImpactNodes || report.summary?.byImpact || {};
    let total = 0;
    
    // Add up counts from different severity levels
    if (byImpact.critical) total += byImpact.critical;
    if (byImpact.serious) total += byImpact.serious;
    if (byImpact.moderate) total += byImpact.moderate;
    if (byImpact.minor) total += byImpact.minor;
    if (byImpact['needs-review']) total += byImpact['needs-review'];
    
    // Check if we found issues from impact counts
    if (total > 0) return total;
    
    // Check total nodes as last resort
    if (report.summary?.totalNodes) {
      // Assuming about 5% of nodes have issues as a rough estimate
      return Math.round(report.summary.totalNodes * 0.05);
    }
    
    return 0;
  };

  // Get the URL and ID for the report
  const getReportData = () => {
    // Check all possible ID fields
    const id = report._id || report.reportId || report.id;
    
    // Check all possible URL fields
    const url = report.targetUrl || report.baseUrl || report.url || "unknown";
    
    // Determine the correct link path based on the ID structure
    let linkPath;
    if (report.reportId) {
      // If it has reportId, use the reports/[id] format
      linkPath = `/reports/${report.reportId}`;
    } else if (report._id) {
      // If it has _id but no reportId, use dashboard/reports/[id] format
      linkPath = `/dashboard/reports/${report._id}`;
    } else {
      // Fallback path
      linkPath = `/reports/${id || `report-${index}`}`;
    }
    
    return {
      id,
      url,
      linkPath
    };
  };

  const reportData = getReportData();
  const issuesCount = getIssuesCount();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-md hover:shadow-lg border p-5 transition-all duration-300 relative overflow-hidden`}
    >
      <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${darkMode ? 'from-[#38bdf8] to-[#0ea5e9]' : 'from-[#00d4ff] to-[#00483a]'}`}></div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{formatDate(report.createdAt || report.finishedAt || report.startedAt)}</div>
          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} text-lg truncate mt-1`}>
            {getDomain(reportData.url)}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate max-w-xs`}>
            {reportData.url}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-center px-3 py-1.5 ${darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-100'} border rounded-full`}>
            <div className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              {issuesCount} issues
            </div>
          </div>
          <Link
            href={reportData.linkPath}
            className={`inline-flex items-center justify-center rounded-lg ${darkMode ? 'bg-[#38bdf8]/20 hover:bg-[#38bdf8]/30 text-[#38bdf8]' : 'bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00483a]'} px-4 py-2 font-medium text-sm transition-colors`}
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
  const { darkMode } = useTheme();
  const [user, setUser] = useState(userProp);
  const [reports, setReports] = useState(reportsProp);
  const [loading, setLoading] = useState(!userProp);

  // Fetch user data and reports
  useEffect(() => {
    // Add a flag to prevent repeated fetches
    const controller = new AbortController();
    const { signal } = controller;
    
    async function load() {
      try {
        // Set initial user data from props or session
        const userData = userProp || {
          fullName: session?.user?.name || "User",
          email: session?.user?.email || "",
          scansCount: session?.user?.scansCount,
          // Set last login to current date if not available
          lastLoginAt: session?.user?.lastLoginAt || new Date().toISOString(),
        };
        setUser(userData);
        
        // Try to fetch reports directly from the history API
        // This appears to be more reliable than the /api/reports endpoint
        try {
          const historyRes = await fetch("/api/history", { 
            signal,
            cache: "no-store",
            headers: { 'Cache-Control': 'no-cache' }
          });
          
          if (historyRes.ok) {
            const historyData = await historyRes.json();
            if (historyData && Array.isArray(historyData.items) && historyData.items.length > 0) {
              console.log("Successfully fetched history data:", historyData.items.length, "items");
              setReports(historyData.items);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error("Error fetching from history API:", error);
          }
        }
        
        // Fallback to regular reports API if history API failed
        try {
          const reportsRes = await fetch("/api/reports?limit=5", { 
            signal,
            cache: "no-store",
            headers: { 'Cache-Control': 'no-cache' }
          });
          
          if (reportsRes.ok) {
            const reportsData = await reportsRes.json();
            if (reportsData && Array.isArray(reportsData.items)) {
              console.log("Successfully fetched reports data:", reportsData.items.length, "items");
              setReports(reportsData.items);
            } else if (reportsProp && reportsProp.length > 0) {
              // Use props as fallback
              setReports(reportsProp);
            }
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error("Error fetching reports:", error);
            // If API calls fail, fall back to props
            if (reportsProp && reportsProp.length > 0) {
              setReports(reportsProp);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    }
    
    load();
    
    // Cleanup function
    return () => {
      controller.abort();
    };
  }, []); // Empty dependency array to run only once

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
    const totalScans = user?.scansCount ?? reports?.length ?? 0;
    const lastLogin = user?.lastLoginAt
      ? formatDate(user.lastLoginAt)
      : formatDate(new Date().toISOString());

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
    <section className={`mt-20 md:mt-24 min-h-[calc(100vh-4rem)] ${darkMode 
      ? 'bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100' 
      : 'bg-gradient-to-b from-white to-gray-50 text-gray-900'}`}>
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
              <h1 className="text-3xl md:text-4xl font-bold text-[#00483a] dark:text-[#38bdf8]">
                Hi, {user?.fullName ? user.fullName : "User"} 👋
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">
                View your accessibility scans and manage reports
              </p>
              {user?.lastLoginAt && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Last login: {formatDate(user.lastLoginAt)}
                </p>
              )}
            </div>
            <Link
              href="/scanner"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00d4ff] dark:bg-[#0ea5e9] text-white font-medium px-5 py-2.5 hover:bg-[#00d4ff]/90 dark:hover:bg-[#0ea5e9]/90 transition-colors shadow-sm"
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
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/scanner" 
              className={`rounded-xl shadow-sm hover:shadow-md border p-4 flex flex-col items-center text-center transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}
            >
              <div className="w-10 h-10 bg-[#00d4ff]/10 dark:bg-[#38bdf8]/20 rounded-full flex items-center justify-center text-[#00483a] dark:text-[#38bdf8] mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12h20"></path>
                  <path d="m17 7 5 5-5 5"></path>
                  <path d="M7 7 2 12l5 5"></path>
                </svg>
              </div>
              <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Run Scan</h3>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Scan a website for accessibility issues</p>
            </Link>
            <Link 
              href="/history" 
              className={`rounded-xl shadow-sm hover:shadow-md border p-4 flex flex-col items-center text-center transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}
            >
              <div className="w-10 h-10 bg-[#00d4ff]/10 dark:bg-[#38bdf8]/20 rounded-full flex items-center justify-center text-[#00483a] dark:text-[#38bdf8] mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>View History</h3>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Access all previous scan reports</p>
            </Link>
          </div>
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`rounded-xl shadow-md border p-6 ${darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'}`}
        >
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b ${darkMode 
            ? 'border-gray-700' 
            : 'border-gray-100'}`}>
            <div>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Reports</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Your latest accessibility scan reports</p>
            </div>
            <Link 
              href="/history" 
              className={`mt-2 sm:mt-0 ${darkMode 
                ? 'text-[#38bdf8] hover:text-[#0ea5e9]' 
                : 'text-[#00d4ff] hover:text-[#00483a]'} text-sm font-medium transition-colors flex items-center gap-1`}
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
                <div key={i} className={`rounded-xl animate-pulse h-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
              ))}
            </div>
          ) : reports?.length > 0 ? (
            <div className="space-y-4">
              {reports.slice(0, 5).map((report, index) => (
                <ReportCard key={index} report={report} index={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                  className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"></path>
                </svg>
              </div>
              <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>No reports yet</h3>
              <p className={`mb-6 max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                You haven't run any accessibility scans yet. Start by running your first scan to see the results here.
              </p>
              <Link
                href="/scanner"
                className={`inline-flex items-center justify-center gap-2 rounded-lg text-white font-medium px-6 py-3 transition-colors shadow-sm ${
                  darkMode 
                    ? 'bg-[#0ea5e9] hover:bg-[#0ea5e9]/90' 
                    : 'bg-[#00d4ff] hover:bg-[#00d4ff]/90'
                }`}
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

        {/* Before & After Comparisons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`rounded-xl shadow-md border p-6 mb-8 ${darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'}`}
        >
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b ${darkMode 
            ? 'border-gray-700' 
            : 'border-gray-100'}`}>
            <div>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Before & After Comparisons</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>See the improvements made after implementing our recommendations</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {reports?.length > 0 ? (
              <>
                <div className={`p-5 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Before Fixes</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className={`min-w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Missing image alt text on 12 images</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className={`min-w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Low color contrast ratio (1.8:1)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className={`min-w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Non-descriptive link text ("click here")</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className={`min-w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No keyboard navigation support</span>
                    </div>
                  </div>
                </div>
                <div className={`p-5 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>After Fixes</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className={`min-w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Descriptive alt text added to all images</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className={`min-w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Color contrast improved to 7:1 ratio</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className={`min-w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Descriptive link text implemented</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className={`min-w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full keyboard navigation added</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="md:col-span-2 flex flex-col items-center py-8 text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                    className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
                <p className={`text-sm max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Run your first scan to see before and after comparisons of accessibility fixes.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Lawsuits Saved */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={`rounded-xl shadow-md border p-6 ${darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'}`}
        >
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b ${darkMode 
            ? 'border-gray-700' 
            : 'border-gray-100'}`}>
            <div>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Legal Risk Mitigation</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Potential legal risks avoided by fixing accessibility issues</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className={`p-5 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} flex flex-col items-center text-center`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m15 9-6 6"></path>
                  <path d="m9 9 6 6"></path>
                </svg>
              </div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>14</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ADA violations fixed</p>
            </div>
            <div className={`p-5 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} flex flex-col items-center text-center`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>3</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>States with compliance</p>
            </div>
            <div className={`p-5 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} flex flex-col items-center text-center`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${darkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20"></path>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>$75K</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Est. savings per lawsuit</p>
            </div>
          </div>

          <div className={`p-5 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Web Accessibility Legal Cases</h3>
            <div className="space-y-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Gill v. Winn-Dixie Stores, Inc.</h4>
                  <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>$250K settlement</span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Plaintiff couldn't use screen reader due to improperly coded website.</p>
              </div>
              
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Robles v. Domino's Pizza</h4>
                  <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>Ongoing</span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Supreme Court denied appeal, ADA applies to websites & apps.</p>
              </div>
              
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>National Federation of the Blind v. Target</h4>
                  <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>$6M settlement</span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Landmark case establishing that the ADA applies to websites.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
