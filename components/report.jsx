"use client";
import { useTheme } from './ThemeContext';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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

function StatCard({ label, value, icon, variant = "default" }) {
    const { darkMode } = useTheme();

    const getVariant = (variant) => {
        switch (variant) {
            case "default":
                return darkMode ? "bg-gray-800 border-gray-700 shadow-sm" : "bg-white border-gray-100 shadow-sm";
            case "critical":
                return darkMode ? "bg-red-900/20 border-red-800 shadow-sm" : "bg-red-50 border-red-100 shadow-sm";
            case "serious":
                return darkMode ? "bg-orange-900/20 border-orange-800 shadow-sm" : "bg-orange-50 border-orange-100 shadow-sm";
            case "moderate":
                return darkMode ? "bg-amber-900/20 border-amber-800 shadow-sm" : "bg-amber-50 border-amber-100 shadow-sm";
            case "minor":
                return darkMode ? "bg-yellow-900/20 border-yellow-800 shadow-sm" : "bg-yellow-50 border-yellow-100 shadow-sm";
            case "review":
                return darkMode ? "bg-gray-800 border-gray-700 shadow-sm" : "bg-gray-50 border-gray-200 shadow-sm";
            default:
                return darkMode ? "bg-gray-800 border-gray-700 shadow-sm" : "bg-white border-gray-100 shadow-sm";
        }
    };

    const getIconColor = (variant) => {
        switch (variant) {
            case "critical":
                return darkMode ? "text-red-400" : "text-red-500";
            case "serious":
                return darkMode ? "text-orange-400" : "text-orange-500";
            case "moderate":
                return darkMode ? "text-amber-400" : "text-amber-500";
            case "minor":
                return darkMode ? "text-yellow-400" : "text-yellow-500";
            case "review":
                return darkMode ? "text-gray-400" : "text-gray-500";
            default:
                return darkMode ? "text-blue-400" : "text-blue-500";
        }
    };

    return (
        <div className={`rounded-xl ${getVariant(variant)} border p-4 transition-all duration-300 hover:shadow-md block`}>
            <div className="flex items-center gap-3">
                {icon && (
                    <div className={`rounded-full ${darkMode ? 'bg-gray-700/60' : 'bg-white/60'} p-2 ${getIconColor(variant)}`}>
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

export default function ReportDetailPage() {
    const { darkMode } = useTheme();
    const params = useParams();
    const id = params?.id;
    const [report, setReport] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("summary");
    const [selectedPage, setSelectedPage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterImpact, setFilterImpact] = useState("all");

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetch(`/api/reports/${id}`);
                if (!response.ok) {
                    throw new Error(`Failed to load report: ${response.statusText}`);
                }
                const data = await response.json();
                setReport(data);

                // Auto-select the first page if there are pages
                if (data.pages && data.pages.length > 0) {
                    setSelectedPage(data.pages[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchReport();
        }
    }, [id]);

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

    const criticalIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
    );

    const seriousIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    );

    const moderateIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    );

    const reviewIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3"></path>
            <path d="M18.4 17A9 9 0 1 0 12 21a9 9 0 0 0 9-9V8l-3 3-3-3-3 3-3-3"></path>
        </svg>
    );

    // Filter violations by impact level if a filter is applied
    const filterViolations = (violations) => {
        if (!violations) return [];
        if (filterImpact === "all") return violations;
        return violations.filter(v => v.impact === filterImpact);
    };

    // Filter violations by search term
    const searchViolations = (violations) => {
        if (!violations) return [];
        if (!searchTerm) return violations;

        const term = searchTerm.toLowerCase();
        return violations.filter(v => {
            return (
                v.id?.toLowerCase().includes(term) ||
                v.description?.toLowerCase().includes(term) ||
                v.help?.toLowerCase().includes(term) ||
                v.tags?.some(tag => tag.toLowerCase().includes(term))
            );
        });
    };

    // Apply both filters
    const getFilteredViolations = (violations) => {
        return searchViolations(filterViolations(violations));
    };

    // Format date nicely
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";

        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
            }).format(date);
        } catch (e) {
            return dateString;
        }
    };

    // Get overview of violations by impact level across all pages
    const getViolationStats = () => {
        const stats = {
            critical: 0,
            serious: 0,
            moderate: 0,
            minor: 0,
            "needs-review": 0,
            totalNodes: 0,
        };

        if (!report?.pages) return stats;

        report.pages.forEach(page => {
            if (!page.violations) return;

            page.violations.forEach(violation => {
                const impact = violation.impact || "needs-review";
                stats[impact] = (stats[impact] || 0) + (violation.nodes?.length || 0);
                stats.totalNodes += (violation.nodes?.length || 0);
            });
        });

        return stats;
    };

    const violationStats = getViolationStats();

    return (
        <section className={`mt-20 md:mt-24 min-h-[calc(100vh-4rem)] ${darkMode
                ? 'bg-gray-900 text-gray-100'
                : 'bg-gradient-to-b from-white to-gray-50 text-gray-900'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                {error && (
                    <div className={`rounded-lg p-4 mb-6 flex items-center gap-3 ${darkMode ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
                        } border`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-[#38bdf8]' : 'border-[#00d4ff]'}`}></div>
                            <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading report details...</p>
                        </div>
                    </div>
                ) : !report ? (
                    <div className={`rounded-xl shadow-md border p-8 flex flex-col items-center justify-center text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                            }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <h2 className={`text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Report Not Found</h2>
                        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            The accessibility report you're looking for couldn't be found.
                        </p>
                        <Link
                            href="/history"
                            className={`inline-flex items-center justify-center gap-2 rounded-lg text-white font-medium px-6 py-3 transition-colors shadow-sm ${darkMode ? 'bg-[#38bdf8] hover:bg-[#38bdf8]/90' : 'bg-[#00d4ff] hover:bg-[#00d4ff]/90'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12 19-7-7 7-7"></path>
                                <path d="M19 12H5"></path>
                            </svg>
                            Back to History
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2"
                        >
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <Link href="/history" className="hover:text-[#00d4ff] transition-colors">History</Link>
                                    <span>→</span>
                                    <span className="font-medium text-gray-800">Report Details</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-[#00483a]">
                                    Accessibility Report
                                </h1>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href="/scanner"
                                    className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${darkMode
                                            ? 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 12h20"></path>
                                        <path d="m17 7 5 5-5 5"></path>
                                        <path d="M7 7 2 12l5 5"></path>
                                    </svg>
                                    New Scan
                                </Link>
                                <button
                                    onClick={() => {
                                        const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
                                        const href = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = href;
                                        a.download = `a11y-report-${id}.json`;
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
                                        URL.revokeObjectURL(href);
                                    }}
                                    className={`inline-flex items-center justify-center gap-2 rounded-lg text-white px-4 py-2 text-sm font-medium transition-colors shadow-sm ${darkMode
                                            ? 'bg-[#38bdf8] hover:bg-[#38bdf8]/90'
                                            : 'bg-[#00d4ff] hover:bg-[#00d4ff]/90'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    Export
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={`rounded-xl shadow-md border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                                }`}
                        >
                            <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                <div className="flex overflow-x-auto">
                                    <button
                                        onClick={() => setActiveTab("summary")}
                                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === "summary"
                                                ? darkMode
                                                    ? "text-[#38bdf8] border-b-2 border-[#38bdf8]"
                                                    : "text-[#00483a] border-b-2 border-[#00483a]"
                                                : darkMode
                                                    ? "text-gray-400 hover:text-white"
                                                    : "text-gray-600 hover:text-gray-900"
                                            }`}
                                    >
                                        Summary
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("pages")}
                                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === "pages"
                                                ? "text-[#00483a] border-b-2 border-[#00483a]"
                                                : "text-gray-600 hover:text-gray-900"
                                            }`}
                                    >
                                        Pages ({report.pages?.length || 0})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("violations")}
                                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === "violations"
                                                ? "text-[#00483a] border-b-2 border-[#00483a]"
                                                : "text-gray-600 hover:text-gray-900"
                                            }`}
                                    >
                                        Violations ({violationStats.totalNodes || 0})
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                {activeTab === "summary" && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className={`rounded-lg p-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'
                                                }`}>
                                                <h3 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'
                                                    }`}>Report Information</h3>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Base URL</span>
                                                        <span className={`text-sm font-medium max-w-xs truncate ${darkMode ? 'text-gray-200' : 'text-gray-900'
                                                            }`}>{report.baseUrl}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Report ID</span>
                                                        <span className={`text-sm font-mono ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{report.reportId}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Created</span>
                                                        <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{formatDate(report.startedAt)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</span>
                                                        <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{formatDate(report.finishedAt)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`rounded-lg p-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'
                                                }`}>
                                                <h3 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'
                                                    }`}>Violation Overview</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {violationStats.critical > 0 && (
                                                        <div className="bg-red-50 border border-red-100 rounded-md p-3 flex items-center justify-between">
                                                            <span className="text-sm text-red-700">Critical</span>
                                                            <span className="text-lg font-semibold text-red-700">{violationStats.critical}</span>
                                                        </div>
                                                    )}
                                                    {violationStats.serious > 0 && (
                                                        <div className="bg-orange-50 border border-orange-100 rounded-md p-3 flex items-center justify-between">
                                                            <span className="text-sm text-orange-700">Serious</span>
                                                            <span className="text-lg font-semibold text-orange-700">{violationStats.serious}</span>
                                                        </div>
                                                    )}
                                                    {violationStats.moderate > 0 && (
                                                        <div className="bg-amber-50 border border-amber-100 rounded-md p-3 flex items-center justify-between">
                                                            <span className="text-sm text-amber-700">Moderate</span>
                                                            <span className="text-lg font-semibold text-amber-700">{violationStats.moderate}</span>
                                                        </div>
                                                    )}
                                                    {violationStats.minor > 0 && (
                                                        <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 flex items-center justify-between">
                                                            <span className="text-sm text-yellow-700">Minor</span>
                                                            <span className="text-lg font-semibold text-yellow-700">{violationStats.minor}</span>
                                                        </div>
                                                    )}
                                                    {violationStats["needs-review"] > 0 && (
                                                        <div className={`rounded-md p-3 flex items-center justify-between ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                                                            }`}>
                                                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Needs Review</span>
                                                            <span className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{violationStats["needs-review"]}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <StatCard
                                                label="Pages Scanned"
                                                value={report.summary?.pages ?? 0}
                                                icon={pageIcon}
                                                variant="default"
                                            />
                                            <StatCard
                                                label="Affected Nodes"
                                                value={report.summary?.totalNodes ?? 0}
                                                icon={nodeIcon}
                                                variant="default"
                                            />
                                            <StatCard
                                                label="Distinct Rules"
                                                value={report.summary?.totalRules ?? 0}
                                                icon={ruleIcon}
                                                variant="default"
                                            />
                                            <StatCard
                                                label="Needs Review"
                                                value={report.summary?.byImpactNodes?.["needs-review"] ?? 0}
                                                icon={reviewIcon}
                                                variant="review"
                                            />
                                        </div>

                                        {Array.isArray(report.summary?.topRules) && report.summary.topRules.length > 0 && (
                                            <div>
                                                <h3 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Top Violation Rules</h3>
                                                <div className={`border rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                                    <div className="overflow-hidden">
                                                        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                                            <thead className={darkMode ? 'bg-gray-900' : 'bg-gray-50'}>
                                                                <tr>
                                                                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                                                        }`}>Rule</th>
                                                                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                                                        }`}>Affected Nodes</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                                                                {report.summary.topRules.map((rule) => (
                                                                    <tr key={rule.rule} className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                                                                        <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium font-mono ${darkMode ? 'text-gray-300' : 'text-gray-900'
                                                                            }`}>{rule.rule}</td>
                                                                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'
                                                                            }`}>{rule.nodes}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "pages" && report.pages && (
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="md:col-span-1 border-r border-gray-100 pr-6">
                                            <div className="mb-4">
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                            strokeLinejoin="round">
                                                            <circle cx="11" cy="11" r="8"></circle>
                                                            <path d="m21 21-4.3-4.3"></path>
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="search"
                                                        placeholder="Search pages..."
                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent"
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        value={searchTerm}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                                                {report.pages.filter(page => {
                                                    if (!searchTerm) return true;
                                                    try {
                                                        const url = new URL(page.url);
                                                        const path = url.pathname.toLowerCase();
                                                        return path.includes(searchTerm.toLowerCase());
                                                    } catch {
                                                        return page.url.toLowerCase().includes(searchTerm.toLowerCase());
                                                    }
                                                }).map((page, idx) => {
                                                    const path = (() => {
                                                        try {
                                                            return new URL(page.url).pathname || page.url;
                                                        } catch {
                                                            return page.url;
                                                        }
                                                    })();

                                                    const isActive = selectedPage && selectedPage.url === page.url;
                                                    const violationCount = (page.violations || []).length;

                                                    return (
                                                        <button
                                                            key={page.url || `page-${idx}`}
                                                            onClick={() => setSelectedPage(page)}
                                                            className={`w-full text-left p-3 rounded-md flex flex-col border ${isActive
                                                                    ? "bg-[#00d4ff]/10 border-[#00d4ff]/30"
                                                                    : darkMode
                                                                        ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                                                                        : "bg-white border-gray-200 hover:bg-gray-50"
                                                                } transition-colors`}
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className={`text-sm truncate ${isActive
                                                                        ? darkMode ? "font-medium text-[#38bdf8]" : "font-medium text-[#00483a]"
                                                                        : darkMode ? "text-gray-300" : "text-gray-900"
                                                                    }`}>
                                                                    {path}
                                                                </span>
                                                                {violationCount > 0 ? (
                                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${darkMode ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
                                                                        }`}>
                                                                        {violationCount}
                                                                    </span>
                                                                ) : (
                                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"
                                                                        }`}>
                                                                        0
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-gray-500 mt-1 truncate">
                                                                {page.url}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            {selectedPage ? (
                                                <div className="space-y-4">
                                                    <div className={`border rounded-lg p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'
                                                        }`}>
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                            <div>
                                                                <h3 className={`font-medium flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'
                                                                    }`}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                                        strokeLinejoin="round" className={darkMode ? "text-gray-400" : "text-gray-500"}>
                                                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                                                    </svg>
                                                                    Page Details
                                                                </h3>
                                                                <a
                                                                    href={selectedPage.url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className={`text-sm hover:underline break-all ${darkMode ? 'text-[#38bdf8]' : 'text-[#00d4ff]'
                                                                        }`}
                                                                >
                                                                    {selectedPage.url}
                                                                </a>
                                                            </div>
                                                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                Scanned: {formatDate(selectedPage.scannedAt)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={`border-b pb-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Accessibility Issues</h3>
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Filter:</span>
                                                                <select
                                                                    onChange={(e) => setFilterImpact(e.target.value)}
                                                                    value={filterImpact}
                                                                    className={`border rounded-md text-sm py-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'
                                                                        }`}
                                                                >
                                                                    <option value="all">All</option>
                                                                    <option value="critical">Critical</option>
                                                                    <option value="serious">Serious</option>
                                                                    <option value="moderate">Moderate</option>
                                                                    <option value="minor">Minor</option>
                                                                    <option value="needs-review">Needs Review</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {(selectedPage.violations || []).length === 0 ? (
                                                        <div className={`flex items-center justify-center p-10 text-center rounded-lg border ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-100'
                                                            }`}>
                                                            <div>
                                                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-500'
                                                                    }`}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M20 6 9 17l-5-5"></path>
                                                                    </svg>
                                                                </div>
                                                                <h3 className={`text-lg font-medium mb-1 ${darkMode ? 'text-green-400' : 'text-green-700'
                                                                    }`}>No issues found</h3>
                                                                <p className={darkMode ? 'text-green-500' : 'text-green-600'}>This page meets all accessibility standards we tested for.</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {getFilteredViolations(selectedPage.violations).map((violation, idx) => (
                                                                <div
                                                                    key={`${selectedPage.url}-${violation.id}-${idx}`}
                                                                    className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                                                                >
                                                                    <div className={`p-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                                                        <div className="flex items-start justify-between gap-4">
                                                                            <div>
                                                                                <div className="flex items-center gap-2 mb-1">
                                                                                    <ImpactBadge impact={violation.impact} />
                                                                                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{violation.id}</span>
                                                                                </div>
                                                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{violation.description}</p>
                                                                            </div>
                                                                            <div className={`shrink-0 rounded-md px-2 py-1 border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
                                                                                {violation.nodes?.length ?? 0} nodes
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-4">
                                                                        <a
                                                                            href={violation.helpUrl}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className={`inline-flex items-center gap-1.5 text-sm hover:underline mb-3 ${darkMode ? 'text-[#38bdf8]' : 'text-[#00d4ff]'}`}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                                                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                                                strokeLinejoin="round">
                                                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                                                <polyline points="15 3 21 3 21 9"></polyline>
                                                                                <line x1="10" y1="14" x2="21" y2="3"></line>
                                                                            </svg>
                                                                            {violation.help}
                                                                        </a>

                                                                        {Array.isArray(violation.tags) && violation.tags.length > 0 && (
                                                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                                                {violation.tags.map((tag) => (
                                                                                    <span key={`tag-${tag}`} className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'
                                                                                        }`}>
                                                                                        {tag}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        )}

                                                                        {Array.isArray(violation.nodes) && violation.nodes.length > 0 && (
                                                                            <details className="group">
                                                                                <summary className={`cursor-pointer text-sm font-medium flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                                                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                                                        strokeLinejoin="round" className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} group-open:rotate-90 transition-transform`}>
                                                                                        <polyline points="9 18 15 12 9 6"></polyline>
                                                                                    </svg>
                                                                                    View affected nodes ({violation.nodes.length})
                                                                                </summary>
                                                                                <div className="mt-3 space-y-3">
                                                                                    {violation.nodes.slice(0, 3).map((node, ni) => (
                                                                                        <div key={`node-${ni}`} className={`rounded-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                                                                                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                                                <div className={`font-mono text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border inline-block`}>
                                                                                                    {(node.target || []).join(", ")}
                                                                                                </div>
                                                                                            </div>
                                                                                            {node.failureSummary && (
                                                                                                <div className={`p-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                                                                                    {node.failureSummary}
                                                                                                </div>
                                                                                            )}
                                                                                            {node.html && (
                                                                                                <div className="p-3 pt-0">
                                                                                                    <pre className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded p-3 text-xs overflow-auto max-h-48 font-mono ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                                                                                        {node.html}
                                                                                                    </pre>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    ))}
                                                                                    {violation.nodes.length > 3 && (
                                                                                        <div className="text-sm text-gray-600 py-2">
                                                                                            +{violation.nodes.length - 3} more nodes not shown
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </details>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className={`flex items-center justify-center h-64 rounded-lg border ${darkMode
                                                        ? 'bg-gray-800 border-gray-700 text-gray-400'
                                                        : 'bg-gray-50 border-gray-200 text-gray-500'
                                                    }`}>
                                                    Select a page to view details
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "violations" && (
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                                            <div className="relative flex-1">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                        strokeLinejoin="round">
                                                        <circle cx="11" cy="11" r="8"></circle>
                                                        <path d="m21 21-4.3-4.3"></path>
                                                    </svg>
                                                </div>
                                                <input
                                                    type="search"
                                                    placeholder="Search violations by ID, description or tags..."
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent"
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    value={searchTerm}
                                                />
                                            </div>

                                            <select
                                                onChange={(e) => setFilterImpact(e.target.value)}
                                                value={filterImpact}
                                                className="border border-gray-300 rounded-md text-sm py-2 px-3"
                                            >
                                                <option value="all">All Impacts</option>
                                                <option value="critical">Critical</option>
                                                <option value="serious">Serious</option>
                                                <option value="moderate">Moderate</option>
                                                <option value="minor">Minor</option>
                                                <option value="needs-review">Needs Review</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                                            <StatCard
                                                label="Critical"
                                                value={violationStats.critical || 0}
                                                icon={criticalIcon}
                                                variant="critical"
                                            />
                                            <StatCard
                                                label="Serious"
                                                value={violationStats.serious || 0}
                                                icon={seriousIcon}
                                                variant="serious"
                                            />
                                            <StatCard
                                                label="Moderate"
                                                value={violationStats.moderate || 0}
                                                icon={moderateIcon}
                                                variant="moderate"
                                            />
                                            <StatCard
                                                label="Minor"
                                                value={violationStats.minor || 0}
                                                icon={moderateIcon}
                                                variant="minor"
                                            />
                                            <StatCard
                                                label="Needs Review"
                                                value={violationStats["needs-review"] || 0}
                                                icon={reviewIcon}
                                                variant="review"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            {report.pages && report.pages.flatMap(page => {
                                                return (page.violations || []).map(violation => {
                                                    // Apply filters
                                                    if (filterImpact !== "all" && violation.impact !== filterImpact) return null;

                                                    if (searchTerm) {
                                                        const term = searchTerm.toLowerCase();
                                                        const matches =
                                                            violation.id?.toLowerCase().includes(term) ||
                                                            violation.description?.toLowerCase().includes(term) ||
                                                            violation.help?.toLowerCase().includes(term) ||
                                                            violation.tags?.some(tag => tag.toLowerCase().includes(term));

                                                        if (!matches) return null;
                                                    }

                                                    // Extract page path
                                                    const pagePath = (() => {
                                                        try {
                                                            return new URL(page.url).pathname || page.url;
                                                        } catch {
                                                            return page.url;
                                                        }
                                                    })();

                                                    return (
                                                        <div
                                                            key={`${page.url}-${violation.id}`}
                                                            className={`border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
                                                        >
                                                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <ImpactBadge impact={violation.impact} />
                                                                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{violation.id}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                                            strokeLinejoin="round" className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                            <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.342a2 2 0 0 0-.602-1.43l-4.44-4.342A2 2 0 0 0 13.56 2H6a2 2 0 0 0-2 2z"></path>
                                                                            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                                                                        </svg>
                                                                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{pagePath}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="p-4">
                                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'} mb-3`}>{violation.description}</p>
                                                                <a
                                                                    href={violation.helpUrl}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1.5 text-sm text-[#00d4ff] hover:underline mb-3"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                                        strokeLinejoin="round">
                                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                                        <polyline points="15 3 21 3 21 9"></polyline>
                                                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                                                    </svg>
                                                                    {violation.help}
                                                                </a>

                                                                <div className="flex items-center justify-between mt-3">
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {(violation.tags || []).slice(0, 3).map((tag) => (
                                                                            <span key={`${violation.id}-${tag}`} className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'
                                                                                }`}>
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                        {(violation.tags || []).length > 3 && (
                                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'} border`}>
                                                                                +{(violation.tags || []).length - 3} more
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className={`shrink-0 ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'} text-sm font-medium px-3 py-1 rounded-full border`}>
                                                                        {violation.nodes?.length ?? 0} nodes
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                });
                                            }).filter(Boolean)}

                                            {report.pages && report.pages.flatMap(page => (page.violations || [])).filter(v => {
                                                if (filterImpact !== "all" && v.impact !== filterImpact) return false;

                                                if (searchTerm) {
                                                    const term = searchTerm.toLowerCase();
                                                    return v.id?.toLowerCase().includes(term) ||
                                                        v.description?.toLowerCase().includes(term) ||
                                                        v.help?.toLowerCase().includes(term) ||
                                                        v.tags?.some(tag => tag.toLowerCase().includes(term));
                                                }

                                                return true;
                                            }).length === 0 && (
                                                    <div className={`flex items-center justify-center p-10 text-center rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                                                        }`}>
                                                        <div>
                                                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-500 mb-3">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <circle cx="11" cy="11" r="8"></circle>
                                                                    <path d="m21 21-4.3-4.3"></path>
                                                                </svg>
                                                            </div>
                                                            <h3 className={`text-lg font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>No matching violations found</h3>
                                                            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Try adjusting your search or filters to see more results.</p>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </section>
    );
}
