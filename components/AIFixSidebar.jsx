"use client";
import { useTheme } from '@/components/ThemeContext';
import { useState } from 'react';

export default function AIFixSidebar({ violations, scanUrl, isOpen, onClose }) {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  const generateAIFixes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          violations: violations,
          url: scanUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate AI suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error('AI Fix Error:', err);
      if (err.message.includes('ECONNREFUSED')) {
        setError('Ollama is not running. Please start Ollama locally on port 11434.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getSeverityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex pointer-events-none">
      {/* Sidebar only - no backdrop at all */}
      <div className={`relative ml-auto w-full max-w-2xl h-full overflow-y-auto pointer-events-auto ${
        darkMode ? 'bg-gray-900 text-white border-l border-gray-700' : 'bg-white text-gray-900 border-l border-gray-200'
      } shadow-2xl`}>
        
        {/* Header */}
        <div className={`sticky top-0 z-10 p-6 border-b ${
          darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI Accessibility Fixes
              </h2>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Powered by Qwen 2.5 • {violations?.length || 0} violations detected
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Generate Button */}
          {!suggestions && !loading && (
            <button
              onClick={generateAIFixes}
              disabled={!violations || violations.length === 0}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate AI Fix Suggestions
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500 mx-auto mb-4"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
              </div>
              <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                AI is analyzing your accessibility violations...
              </p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                This may take a few moments
              </p>
            </div>
          )}

          {error && (
            <div className={`p-6 rounded-lg border-l-4 border-red-500 ${
              darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Error generating suggestions</h3>
                  <p className="text-sm mb-4">{error}</p>
                  {error.includes('Ollama') && (
                    <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} text-sm`}>
                      <p className="font-medium mb-2">Quick fix:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Open terminal/command prompt</li>
                        <li>Run: <code className="bg-gray-700 text-white px-1 rounded">ollama serve</code></li>
                        <li>Wait for "Ollama is running" message</li>
                        <li>Try generating suggestions again</li>
                      </ol>
                    </div>
                  )}
                  <button
                    onClick={generateAIFixes}
                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {suggestions && (
            <div className="space-y-6">
              {/* Summary */}
              <div className={`p-6 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Assessment Summary</h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {suggestions.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fix Suggestions */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔧</span>
                  Specific Fix Recommendations
                </h3>
                <div className="space-y-6">
                  {suggestions.fixes?.map((fix, index) => (
                    <div key={index} className={`p-6 rounded-lg border ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } shadow-sm`}>
                      
                      {/* Rule Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          {getSeverityIcon(fix.priority)}
                          <code className={`px-2 py-1 rounded text-sm ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            {fix.rule}
                          </code>
                          {fix.affectedElements && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {fix.affectedElements} elements
                            </span>
                          )}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(fix.priority)}`}>
                          {fix.priority?.toUpperCase()} PRIORITY
                        </span>
                      </div>

                      {/* User Impact */}
                      {fix.userImpact && (
                        <div className="mb-4">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <span>👥</span>
                            User Impact:
                          </h5>
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed text-sm`}>
                            {fix.userImpact}
                          </p>
                        </div>
                      )}

                      {/* Explanation */}
                      <div className="mb-4">
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                          <span>💡</span>
                          What this means:
                        </h5>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                          {fix.explanation}
                        </p>
                      </div>

                      {/* Steps */}
                      <div className="mb-4">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          <span>📝</span>
                          How to fix:
                        </h5>
                        <ol className={`list-decimal list-inside space-y-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {fix.steps?.map((step, stepIndex) => (
                            <li key={stepIndex} className="leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Code Example */}
                      {fix.codeExample && (
                        <div className="mb-4">
                          <h5 className="font-medium mb-3 flex items-center gap-2">
                            <span>💻</span>
                            Code Example:
                          </h5>
                          <pre className={`p-4 rounded-lg text-sm overflow-x-auto border ${
                            darkMode ? 'bg-gray-900 text-gray-300 border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-200'
                          }`}>
                            <code>{fix.codeExample}</code>
                          </pre>
                        </div>
                      )}

                      {/* Testing Tips */}
                      {fix.testingTips && (
                        <div className="mb-4">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <span>🧪</span>
                            Testing:
                          </h5>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                            {fix.testingTips}
                          </p>
                        </div>
                      )}

                      {/* Common Mistakes */}
                      {fix.commonMistakes && (
                        <div className="mb-4">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <span>⚠️</span>
                            Common Mistakes to Avoid:
                          </h5>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                            {fix.commonMistakes}
                          </p>
                        </div>
                      )}

                      {/* WCAG Reference and Additional Resources */}
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-sm">
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              WCAG Reference: 
                            </span>
                            <a 
                              href={fix.wcagReference?.startsWith('http') ? fix.wcagReference : `https://www.w3.org/WAI/WCAG21/Understanding/${fix.wcagReference}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline ml-1 font-medium"
                            >
                              {fix.wcagReference}
                            </a>
                          </div>
                          {fix.additionalResources && (
                            <div className="text-sm">
                              <a 
                                href={fix.additionalResources}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-500 hover:underline font-medium flex items-center gap-1"
                              >
                                <span>📚</span>
                                Additional Resources
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Recommendations */}
              {suggestions.generalRecommendations && suggestions.generalRecommendations.length > 0 && (
                <div className={`p-6 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-green-50 border-green-200'
                }`}>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    General Recommendations
                  </h3>
                  <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {suggestions.generalRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-green-500 mt-1 font-bold">✓</span>
                        <span className="leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Priority Order */}
              {suggestions.priorityOrder && (
                <div className={`p-6 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-purple-50 border-purple-200'
                }`}>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    Recommended Implementation Order
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    {suggestions.priorityOrder}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={generateAIFixes}
                  className={`flex-1 py-3 px-4 rounded-lg border border-dashed transition-colors flex items-center justify-center gap-2 ${
                    darkMode 
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' 
                      : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate Suggestions
                </button>
                <button
                  onClick={() => {
                    const content = JSON.stringify(suggestions, null, 2);
                    const blob = new Blob([content], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'accessibility-fixes.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
