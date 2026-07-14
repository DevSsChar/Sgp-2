"use client";
import PageCanvas from './layout/PageCanvas';
import ImpactBadge from './impact/ImpactBadge';
import ViolationRow from './impact/ViolationRow';
import { getImpactCountClass } from '@/utils/impactTheme';
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function DemoStatCard({ label, value, icon, impact, delay = 0 }) {
  const countClass = impact ? getImpactCountClass(impact) : 'bg-cx-surface-container-low text-cx-on-surface border border-cx-outline-variant';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="hud-panel border p-4 hover:bg-cx-surface-container-low transition-colors"
    >
      <div className="flex items-center gap-3">
        {icon && <div className={`p-2 shrink-0 ${countClass}`}>{icon}</div>}
        <div>
          <div className="font-mono-cx text-[11px] uppercase tracking-widest text-cx-on-surface-variant">{label}</div>
          <div className="font-mono-cx font-bold text-2xl text-cx-on-surface">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ title, description, icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="hud-panel border p-6 hover:bg-cx-surface-container-low transition-colors"
    >
      <div className="border border-cx-outline-variant bg-cx-surface-container-low p-3 w-12 h-12 flex items-center justify-center mb-4 text-cx-primary">
        {icon}
      </div>
      <h3 className="font-mono-cx text-lg font-semibold mb-2 text-cx-on-surface">{title}</h3>
      <p className="font-mono-cx text-sm text-cx-on-surface-variant">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative text-cx-on-surface"
    >
      <div className="flex">
        <div className="flex-shrink-0 relative">
          <div className="bg-cx-primary-container text-cx-on-primary-container w-10 h-10 flex items-center justify-center text-lg font-bold font-mono-cx z-10">
            {number}
          </div>
          {number < 4 && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 h-full w-px bg-cx-outline-variant/40" />
          )}
        </div>
        <div className="ml-4 pb-12">
          <h3 className="font-mono-cx text-xl font-semibold mb-2 text-cx-primary">{title}</h3>
          <p className="font-mono-cx text-sm text-cx-on-surface-variant">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ImpactCountDisplay({ impact, count }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`inline-flex items-center justify-center w-12 h-12 text-lg font-bold font-mono-cx mb-2 border ${getImpactCountClass(impact)}`}>
        {count}
      </span>
      <ImpactBadge impact={impact} />
    </div>
  );
}

export default function Demo() {
  const [activeTab, setActiveTab] = useState("features");

  const sampleViolations = [
    {
      id: 'color-contrast',
      impact: 'critical',
      help: 'color-contrast',
      description: 'Elements must have sufficient color contrast',
      tags: ['cat:color', 'wcag2aa', 'wcag143'],
    },
    {
      id: 'landmark-one-main',
      impact: 'serious',
      help: 'landmark-one-main',
      description: 'Document should have one main landmark',
      tags: ['cat:semantics', 'best-practice'],
    },
    {
      id: 'region',
      impact: 'moderate',
      help: 'region',
      description: 'All page content should be contained by landmarks',
      tags: ['cat:keyboard', 'best-practice'],
    },
  ];
  
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
    <PageCanvas className="min-h-[calc(100vh-3.5rem)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="font-mono-cx text-4xl md:text-5xl font-bold mb-4 text-cx-primary">
            AccessibilityGuard Demo
          </h1>
          <p className="font-mono-cx text-xl mx-auto max-w-3xl text-cx-on-surface-variant">
            Experience how our accessibility scanner works to identify and fix WCAG compliance issues on your website
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12 gap-px border border-cx-outline-variant/30 bg-cx-surface-container-low p-px max-w-md mx-auto">
            {[
              { id: 'features', label: 'Features' },
              { id: 'workflow', label: 'How It Works' },
              { id: 'results', label: 'Sample Results' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 font-mono-cx text-[11px] uppercase tracking-widest transition-colors ${
                  activeTab === tab.id
                    ? 'bg-cx-primary-container text-cx-on-primary-container border-b-2 border-cx-primary'
                    : 'text-cx-on-surface-variant hover:text-cx-primary hover:bg-cx-surface-container'
                }`}
              >
                {tab.label}
              </button>
            ))}
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
            
            <div className="hud-panel border p-6 mb-10">
              <h2 className="font-mono-cx text-2xl font-semibold mb-6 text-cx-primary">
                Accessibility Standards Coverage
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-cx-outline-variant/30 bg-cx-surface-container-low">
                  <div className="font-mono-cx font-medium mb-1 text-cx-on-surface">WCAG 2.1 AA</div>
                  <div className="font-mono-cx text-sm text-cx-on-surface-variant">Full coverage of level A and AA success criteria</div>
                </div>
                <div className="p-4 border border-cx-outline-variant/30 bg-cx-surface-container-low">
                  <div className="font-mono-cx font-medium mb-1 text-cx-on-surface">ARIA 1.2</div>
                  <div className="font-mono-cx text-sm text-cx-on-surface-variant">Complete ARIA landmarks and pattern testing</div>
                </div>
                <div className="p-4 border border-cx-outline-variant/30 bg-cx-surface-container-low">
                  <div className="font-mono-cx font-medium mb-1 text-cx-on-surface">Section 508</div>
                  <div className="font-mono-cx text-sm text-cx-on-surface-variant">U.S. federal accessibility requirements</div>
                </div>
                <div className="p-4 border border-cx-outline-variant/30 bg-cx-surface-container-low">
                  <div className="font-mono-cx font-medium mb-1 text-cx-on-surface">Best Practices</div>
                  <div className="font-mono-cx text-sm text-cx-on-surface-variant">Additional usability and accessibility checks</div>
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
            className="hud-panel border p-8 mb-10"
          >
            <h2 className="font-mono-cx text-2xl font-semibold mb-8 text-cx-primary">
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
            <div className="hud-panel border p-6 mb-10">
              <h2 className="font-mono-cx text-2xl font-semibold mb-6 text-cx-primary">
                Sample Scan Results
              </h2>
              
              <div className="mb-6 pb-6 border-b border-cx-outline-variant/30">
                <div className="flex flex-wrap gap-2 mb-4 items-center">
                  <div className="font-mono-cx text-sm text-cx-on-surface-variant">Base URL:</div>
                  <div className="font-mono-cx font-medium text-cx-on-surface">https://example.com</div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-5">
                  <DemoStatCard 
                    label="Pages Scanned" 
                    value="8" 
                    icon={pageIcon}
                    impact=""
                    delay={0.1}
                  />
                  <DemoStatCard 
                    label="Affected Nodes" 
                    value="26" 
                    icon={nodeIcon}
                    impact=""
                    delay={0.15}
                  />
                  <DemoStatCard 
                    label="Distinct Rules" 
                    value="12" 
                    icon={ruleIcon}
                    impact=""
                    delay={0.2}
                  />
                </div>
              </div>
              
              <h3 className="font-mono-cx text-xl font-semibold mb-5 text-cx-primary">
                Violations By Impact Level
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-6">
                <ImpactCountDisplay impact="critical" count="2" />
                <ImpactCountDisplay impact="serious" count="8" />
                <ImpactCountDisplay impact="moderate" count="10" />
                <ImpactCountDisplay impact="minor" count="4" />
                <ImpactCountDisplay impact="needs-review" count="2" />
              </div>
              
              <h3 className="font-mono-cx text-xl font-semibold mt-8 mb-4 text-cx-primary">
                Top Issues Found
              </h3>
              
              <div className="space-y-px border border-cx-outline-variant/30">
                {sampleViolations.map((v) => (
                  <ViolationRow
                    key={v.id}
                    violation={v}
                    wcagTag={v.tags[0]}
                    showActions={false}
                    compact
                  >
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {v.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono-cx inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider border border-cx-outline-variant bg-cx-surface-container-low text-cx-on-surface-variant"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </ViolationRow>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hud-panel border p-8 text-center"
        >
          <h2 className="font-mono-cx text-2xl md:text-3xl font-bold mb-4 text-cx-primary">
            Ready to Make Your Website Accessible?
          </h2>
          <p className="font-mono-cx max-w-2xl mx-auto mb-6 text-cx-on-surface-variant">
            Start scanning your website now and get a comprehensive accessibility report in minutes. Fix issues before they become barriers for your users.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/scanner"
              className="btn-hud-primary inline-flex items-center gap-2 px-6 py-3"
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
              className="btn-hud-secondary inline-flex items-center gap-2 px-6 py-3"
            >
              View Dashboard
            </Link>
          </div>
        </motion.div>
    </PageCanvas>
  );
}