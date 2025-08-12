"use client";
import { useTheme } from './ThemeContext';
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function HistoryCard({ item, index }) {
  const { darkMode } = useTheme();
  const nodes = item?.summary?.totalNodes ?? 0;
  const pages = item?.summary?.pages ?? (item?.pages?.length ?? 0);
  
  // Calculate severity distribution
  const criticalCount = item?.summary?.byImpactNodes?.critical ?? 0;
  const seriousCount = item?.summary?.byImpactNodes?.serious ?? 0;
  const moderateCount = item?.summary?.byImpactNodes?.moderate ?? 0;
  const minorCount = item?.summary?.byImpactNodes?.minor ?? 0;
  const needsReviewCount = item?.summary?.byImpactNodes?.["needs-review"] ?? 0;
  
  // Try to get domain from URL
  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };
  
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`rounded-xl ${darkMode ? 'bg-gray-800 ring-gray-700' : 'bg-white ring-gray-200'} shadow-md hover:shadow-lg transition-all duration-300 ring-1 p-5 relative overflow-hidden group`}
    >
      <div className={`absolute right-0 top-0 h-full w-1.5 bg-gradient-to-b ${darkMode ? 'from-[#38bdf8] to-[#0ea5e9]' : 'from-[#00d4ff] to-[#00483a]'}`}></div>
      
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {formatDate(item.finishedAt || item.startedAt)}
        </span>
        <div className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {item.reportId.substring(0, 8)}...
        </div>
      </div>
      
      <div className="mb-4">
        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} break-all text-lg mb-1`}>
          {getDomain(item.baseUrl)}
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} truncate`}>
          {item.baseUrl}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <div className={`flex items-center rounded-full ${darkMode ? 'bg-blue-900/30 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-700'} border px-3 py-1 text-xs`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.342a2 2 0 0 0-.602-1.43l-4.44-4.342A2 2 0 0 0 13.56 2H6a2 2 0 0 0-2 2z"></path>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
          </svg>
          {pages} pages
        </div>
        <div className={`flex items-center rounded-full ${darkMode ? 'bg-purple-900/30 border-purple-800 text-purple-300' : 'bg-purple-50 border-purple-100 text-purple-700'} border px-3 py-1 text-xs`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <rect x="2" y="2" width="8" height="8" rx="2"></rect>
            <rect x="14" y="2" width="8" height="8" rx="2"></rect>
            <rect x="2" y="14" width="8" height="8" rx="2"></rect>
            <rect x="14" y="14" width="8" height="8" rx="2"></rect>
          </svg>
          {nodes} nodes
        </div>
      </div>
      
      {/* Severity indicators */}
      {(criticalCount > 0 || seriousCount > 0 || moderateCount > 0 || minorCount > 0) && (
        <div className="grid grid-cols-4 gap-1 mb-4">
          {criticalCount > 0 && (
            <div className="text-center">
              <div className={`rounded-md px-2 py-1 text-xs font-medium mb-1 ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'}`}>
                {criticalCount}
              </div>
              <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Critical</div>
            </div>
          )}
          {seriousCount > 0 && (
            <div className="text-center">
              <div className={`rounded-md px-2 py-1 text-xs font-medium mb-1 ${darkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-800'}`}>
                {seriousCount}
              </div>
              <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Serious</div>
            </div>
          )}
          {moderateCount > 0 && (
            <div className="text-center">
              <div className={`rounded-md px-2 py-1 text-xs font-medium mb-1 ${darkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-800'}`}>
                {moderateCount}
              </div>
              <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Moderate</div>
            </div>
          )}
          {minorCount > 0 && (
            <div className="text-center">
              <div className={`rounded-md px-2 py-1 text-xs font-medium mb-1 ${darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}`}>
                {minorCount}
              </div>
              <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Minor</div>
            </div>
          )}
        </div>
      )}
      
      <Link 
        href={`/reports/${item.reportId}`} 
        className={`inline-flex items-center justify-center w-full ${
          darkMode ? 'bg-[#38bdf8]/20 hover:bg-[#38bdf8]/30 text-[#38bdf8]' : 'bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00483a]'
        } font-medium rounded-lg px-4 py-2 transition-colors text-sm gap-1.5`}
      >
        <span>View Report</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
             className="group-hover:translate-x-0.5 transition-transform">
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </Link>
    </motion.div>
  );
}

export default function HistoryPage() {
  const { darkMode } = useTheme();
  const [data, setData] = useState({ items: [], total: 0, page: 1, limit: 20 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/reports?limit=20`);
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filteredItems = () => {
    if (filter === "all") return data.items;
    
    // Example filters - implement based on your data structure
    if (filter === "critical") {
      return data.items.filter(item => 
        (item?.summary?.byImpactNodes?.critical ?? 0) > 0
      );
    }
    if (filter === "recent") {
      return [...data.items].sort((a, b) => 
        new Date(b.finishedAt || b.startedAt) - new Date(a.finishedAt || a.startedAt)
      );
    }
    
    return data.items;
  };

  return (
    <section className={`mt-20 md:mt-24 min-h-[calc(100vh-4rem)] ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-white to-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-[#38bdf8]' : 'text-[#00483a]'}`}>Scan History</h1>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-1`}>
                View and analyze your previous accessibility scans
              </p>
            </div>
            <Link 
              href="/scanner" 
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00d4ff] dark:bg-[#38bdf8] text-white font-medium px-4 py-2 hover:bg-[#00d4ff]/90 dark:hover:bg-[#38bdf8]/90 transition-colors shadow-sm text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              New Scan
            </Link>
          </div>
          
          {/* Filter tabs */}
          <div className="flex space-x-1 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "all" 
                  ? `${darkMode ? "bg-[#38bdf8]" : "bg-[#00483a]"} text-white` 
                  : `${darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`
              }`}
            >
              All Scans
            </button>
            <button
              onClick={() => setFilter("recent")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "recent" 
                  ? `${darkMode ? "bg-[#38bdf8]" : "bg-[#00483a]"} text-white` 
                  : `${darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`
              }`}
            >
              Most Recent
            </button>
            <button
              onClick={() => setFilter("critical")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "critical" 
                  ? `${darkMode ? "bg-[#38bdf8]" : "bg-[#00483a]"} text-white` 
                  : `${darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`
              }`}
            >
              With Critical Issues
            </button>
          </div>
        </motion.div>

        {error && (
          <div className={`rounded-lg p-4 mb-6 flex items-center gap-3 ${
            darkMode ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
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
              <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading scan history...</p>
            </div>
          </div>
        ) : filteredItems().length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`rounded-xl shadow-md border p-8 flex flex-col items-center justify-center text-center ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"></path>
              </svg>
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>No scan history yet</h3>
            <p className={`mb-6 max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {filter !== "all" 
                ? "No scans match your current filter. Try changing your filter or run a new scan."
                : "You haven't run any accessibility scans yet. Start by running your first scan to see the results here."}
            </p>
            <Link 
              href="/scanner" 
              className={`inline-flex items-center justify-center gap-2 rounded-lg text-white font-medium px-6 py-3 transition-colors shadow-sm ${
                darkMode ? 'bg-[#38bdf8] hover:bg-[#38bdf8]/90' : 'bg-[#00d4ff] hover:bg-[#00d4ff]/90'
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
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems().map((item, index) => (
              <HistoryCard key={item.reportId} item={item} index={index} />
            ))}
          </div>
        )}
        
        {!loading && data.total > data.items.length && (
          <div className="mt-8 flex justify-center">
            <button 
              className={`rounded-lg px-5 py-2.5 text-sm font-medium border transition-colors ${
                darkMode 
                ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700" 
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Load More Results
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
