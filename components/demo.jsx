"use client";
import { useTheme } from './ThemeContext';
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function DemoStatCard({ label, value, icon, color, delay = 0 }) {
  const { darkMode } = useTheme();
  
  const getColorStyles = () => {
    switch (color) {
      case "critical":
        return darkMode 
          ? { bg: "bg-red-900/30", text: "text-red-300", icon: "text-red-400" }
          : { bg: "bg-red-50", text: "text-red-800", icon: "text-red-600" };
      case "serious":
        return darkMode 
          ? { bg: "bg-orange-900/30", text: "text-orange-300", icon: "text-orange-400" }
          : { bg: "bg-orange-50", text: "text-orange-800", icon: "text-orange-600" };
      case "moderate":
        return darkMode 
          ? { bg: "bg-amber-900/30", text: "text-amber-300", icon: "text-amber-400" }
          : { bg: "bg-amber-50", text: "text-amber-800", icon: "text-amber-600" };
      case "minor":
        return darkMode 
          ? { bg: "bg-yellow-900/30", text: "text-yellow-300", icon: "text-yellow-400" }
          : { bg: "bg-yellow-50", text: "text-yellow-800", icon: "text-yellow-600" };
      case "primary":
        return darkMode 
          ? { bg: "bg-[#38bdf8]/20", text: "text-[#38bdf8]", icon: "text-[#38bdf8]" }
          : { bg: "bg-[#00d4ff]/10", text: "text-[#00483a]", icon: "text-[#00d4ff]" };
      default:
        return darkMode 
          ? { bg: "bg-gray-800", text: "text-white", icon: "text-gray-400" }
          : { bg: "bg-white", text: "text-gray-900", icon: "text-gray-500" };
    }
  };
  
  const colors = getColorStyles();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-md border p-4 transition-all duration-300 hover:shadow-lg`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`rounded-full ${colors.bg} p-2 ${colors.icon}`}>
            {icon}
          </div>
        )}
        <div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
          <div className={`font-semibold text-2xl ${colors.text}`}>{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ title, description, icon, delay = 0 }) {
  const { darkMode } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-md border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
    >
      <div className={`rounded-full ${darkMode ? 'bg-[#38bdf8]/20 text-[#38bdf8]' : 'bg-[#00d4ff]/10 text-[#00d4ff]'} p-3 w-12 h-12 flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description, delay = 0 }) {
  const { darkMode } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative ${darkMode ? 'text-white' : 'text-gray-900'}`}
    >
      <div className="flex">
        <div className="flex-shrink-0 relative">
          <div className={`rounded-full ${darkMode ? 'bg-[#38bdf8] text-gray-900' : 'bg-[#00d4ff] text-white'} w-10 h-10 flex items-center justify-center text-lg font-bold z-10`}>
            {number}
          </div>
          {number < 4 && (
            <div className={`absolute top-10 left-1/2 transform -translate-x-1/2 h-full w-1 ${darkMode ? 'bg-gradient-to-b from-[#38bdf8] to-gray-700' : 'bg-gradient-to-b from-[#00d4ff] to-gray-100'}`}></div>
          )}
        </div>
        <div className="ml-4 pb-12">
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-[#38bdf8]' : 'text-[#00483a]'}`}>{title}</h3>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ImpactBadge({ impact, count }) {
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
    <div className="flex flex-col items-center">
      <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-semibold mb-2 border ${getImpactStyles()}`}>
        {count}
      </span>
      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} capitalize`}>{impact}</span>
    </div>
  );
}

export default function Demo() {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("features");
  
  // Icons
  const scannerIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20"></path>
      <path d="m17 7 5 5-5 5"></path>
      <path d="M7 7 2 12l5 5"></path>
    </svg>
  );
  
  const reportIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <path d="M14 2v6h6"></path>
      <path d="M16 13H8"></path>
      <path d="M16 17H8"></path>
      <path d="M10 9H8"></path>
    </svg>
  );
  
  const historyIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8v4l3 3"></path>
      <path d="M14 21.14a9 9 0 1 0-4 0"></path>
      <path d="M7 3.5V2"></path>
      <path d="M17 3.5V2"></path>
      <path d="M10 21v1"></path>
      <path d="M14 21v1"></path>
    </svg>
  );
  
  const aiIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c1.4 0 2.742.47 3.841 1.33a7.017 7.017 0 0 1 2.6 3.5 7.031 7.031 0 0 1 .145 4.83 7.091 7.091 0 0 1-2.345 3.264"></path>
      <path d="M12 22c-3.37 0-6.319-2.113-7.354-5.269a8.024 8.024 0 0 1 .07-5.18 8.046 8.046 0 0 1 3.02-4.029"></path>
      <path d="M19.5 14.5 17 16V8.5"></path>
      <path d="M12 12a8 8 0 0 1 8 8"></path>
      <path d="M12 12a8 8 0 0 0-8 8"></path>
    </svg>
  );
  
  const pageIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.342a2 2 0 0 0-.602-1.43l-4.44-4.342A2 2 0 0 0 13.56 2H6a2 2 0 0 0-2 2z"></path>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
      <path d="M9 13h6"></path>
      <path d="M9 17h3"></path>
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

  return (
    <section className={`mt-20 md:mt-24 min-h-[calc(100vh-4rem)] ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-white to-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#00483a]'}`}>
            AccessibilityGuard Demo
          </h1>
          <p className={`text-xl mx-auto max-w-3xl ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Experience how our accessibility scanner works to identify and fix WCAG compliance issues on your website
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className={`inline-flex rounded-md p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <button 
              onClick={() => setActiveTab("features")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "features" 
                  ? darkMode 
                    ? "bg-[#38bdf8] text-white" 
                    : "bg-[#00d4ff] text-white"
                  : darkMode 
                    ? "text-gray-400 hover:text-white" 
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Features
            </button>
            <button 
              onClick={() => setActiveTab("workflow")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "workflow" 
                  ? darkMode 
                    ? "bg-[#38bdf8] text-white" 
                    : "bg-[#00d4ff] text-white"
                  : darkMode 
                    ? "text-gray-400 hover:text-white" 
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              How It Works
            </button>
            <button 
              onClick={() => setActiveTab("results")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "results" 
                  ? darkMode 
                    ? "bg-[#38bdf8] text-white" 
                    : "bg-[#00d4ff] text-white"
                  : darkMode 
                    ? "text-gray-400 hover:text-white" 
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sample Results
            </button>
          </div>
        </div>

        {/* Features Tab */}
        {activeTab === "features" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <FeatureCard 
                title="Automated Scanner" 
                description="Scan any public website for WCAG compliance issues with detailed node-level insights"
                icon={scannerIcon}
                delay={0.1}
              />
              <FeatureCard 
                title="Detailed Reports" 
                description="View comprehensive reports with impact levels, affected elements, and recommended fixes"
                icon={reportIcon}
                delay={0.2}
              />
              <FeatureCard 
                title="Scan History" 
                description="Track your progress over time with a searchable history of all previous scans"
                icon={historyIcon}
                delay={0.3}
              />
              <FeatureCard 
                title="AI Remediation" 
                description="Get AI-powered suggestions to fix accessibility violations quickly"
                icon={aiIcon}
                delay={0.4}
              />
            </div>
            
            <div className={`rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-lg border p-6 mb-10`}>
              <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-[#00483a]'}`}>
                Accessibility Standards Coverage
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>WCAG 2.1 AA</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Full coverage of level A and AA success criteria</div>
                </div>
                <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>ARIA 1.2</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Complete ARIA landmarks and pattern testing</div>
                </div>
                <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Section 508</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>U.S. federal accessibility requirements</div>
                </div>
                <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Best Practices</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Additional usability and accessibility checks</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* How It Works Tab */}
        {activeTab === "workflow" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-lg border p-8 mb-10`}
          >
            <h2 className={`text-2xl font-semibold mb-8 ${darkMode ? 'text-white' : 'text-[#00483a]'}`}>
              How AccessibilityGuard Works
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <StepCard 
                number={1}
                title="Enter Your Website URL"
                description="Start by entering any public website URL in our scanner. The tool will validate the URL and prepare for scanning."
                delay={0.1}
              />
              
              <StepCard 
                number={2}
                title="Automated Accessibility Scan"
                description="Our scanner crawls the website, analyzing the DOM for WCAG violations, ARIA issues, and other accessibility problems."
                delay={0.2}
              />
              
              <StepCard 
                number={3}
                title="View Detailed Report"
                description="Get comprehensive results showing all detected issues categorized by impact level (critical, serious, moderate, minor)."
                delay={0.3}
              />
              
              <StepCard 
                number={4}
                title="Fix Issues & Rescan"
                description="Follow our suggested fixes to improve accessibility, then rescan to track your progress over time."
                delay={0.4}
              />
            </div>
          </motion.div>
        )}

        {/* Sample Results Tab */}
        {activeTab === "results" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-lg border p-6 mb-10`}>
              <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-[#00483a]'}`}>
                Sample Scan Results
              </h2>
              
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2 mb-4 items-center">
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Base URL:</div>
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>https://example.com</div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-5">
                  <DemoStatCard 
                    label="Pages Scanned" 
                    value="8" 
                    icon={pageIcon}
                    color="primary"
                    delay={0.1}
                  />
                  <DemoStatCard 
                    label="Affected Nodes" 
                    value="26" 
                    icon={nodeIcon}
                    color="primary"
                    delay={0.15}
                  />
                  <DemoStatCard 
                    label="Distinct Rules" 
                    value="12" 
                    icon={ruleIcon}
                    color="primary"
                    delay={0.2}
                  />
                </div>
              </div>
              
              <h3 className={`text-xl font-semibold mb-5 ${darkMode ? 'text-white' : 'text-[#00483a]'}`}>
                Violations By Impact Level
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-6">
                <ImpactBadge impact="critical" count="2" />
                <ImpactBadge impact="serious" count="8" />
                <ImpactBadge impact="moderate" count="10" />
                <ImpactBadge impact="minor" count="4" />
                <ImpactBadge impact="needs-review" count="2" />
              </div>
              
              <h3 className={`text-xl font-semibold mt-8 mb-4 ${darkMode ? 'text-white' : 'text-[#00483a]'}`}>
                Top Issues Found
              </h3>
              
              <div className="space-y-4">
                <div className={`rounded-lg border overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${darkMode ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-red-100 text-red-800 border-red-200'}`}>
                          critical
                        </span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>color-contrast</span>
                      </div>
                      <div className={`shrink-0 rounded-md px-2 py-1 border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
                        7 nodes
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      Elements must have sufficient color contrast
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'} border`}>
                        cat:color
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'} border`}>
                        wcag2aa
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'} border`}>
                        wcag143
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-lg border overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${darkMode ? 'bg-orange-900/30 text-orange-300 border-orange-800' : 'bg-orange-100 text-orange-800 border-orange-200'}`}>
                          serious
                        </span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>landmark-one-main</span>
                      </div>
                      <div className={`shrink-0 rounded-md px-2 py-1 border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
                        1 node
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      Document should have one main landmark
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'} border`}>
                        cat:semantics
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'} border`}>
                        best-practice
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-lg border overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${darkMode ? 'bg-amber-900/30 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                          moderate
                        </span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>region</span>
                      </div>
                      <div className={`shrink-0 rounded-md px-2 py-1 border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
                        5 nodes
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      All page content should be contained by landmarks
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'} border`}>
                        cat:keyboard
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'} border`}>
                        best-practice
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-2xl ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-gradient-to-r from-[#00d4ff]/10 to-[#00483a]/10 border-[#00d4ff]/20'} border p-8 text-center`}
        >
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#00483a]'}`}>
            Ready to Make Your Website Accessible?
          </h2>
          <p className={`max-w-2xl mx-auto mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Start scanning your website now and get a comprehensive accessibility report in minutes. Fix issues before they become barriers for your users.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/scanner"
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-colors shadow-md ${darkMode ? 'bg-[#38bdf8] hover:bg-[#38bdf8]/90' : 'bg-[#00d4ff] hover:bg-[#00d4ff]/90'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h20"></path>
                <path d="m17 7 5 5-5 5"></path>
                <path d="M7 7 2 12l5 5"></path>
              </svg>
              Start Scanning
            </Link>
            <Link
              href="/dashboard"
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            >
              View Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}