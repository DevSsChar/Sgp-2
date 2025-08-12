"use client";
import React from 'react';
import { useTheme } from './ThemeContext';

export default function Features() {
  const { darkMode } = useTheme();
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-cyan-400"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      ),
      title: "Automated Scanner",
      description:
        "Real-time WCAG 2.1 AA compliance checks across your entire website. Detect issues before they become legal problems.",
      animationDelay: "0s",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-lime-400"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      title: "AI Remediation",
      description:
        "Get specific code suggestions in plain English. Our AI explains exactly what needs to be fixed and how to fix it.",
      animationDelay: "0.2s",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-red-400"
        >
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
        </svg>
      ),
      title: "One-Click Fix",
      description:
        "Apply accessibility patches directly to your codebase with confidence. Preview changes before deployment.",
      animationDelay: "0.4s",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-cyan-400"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      title: "Multilingual Reports",
      description:
        "Generate compliance reports in English, Hindi, and Gujarati. Perfect for diverse teams and global compliance.",
      animationDelay: "0.6s",
    },
  ];

  return (
    <section id="features" className={`py-24 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`font-poppins text-4xl md:text-5xl font-bold ${darkMode ? 'text-[#38bdf8]' : 'text-[#00483a]'} mb-6`}>
            Features That Protect <span className={`${darkMode ? 'text-cyan-300' : 'text-cyan-400'}`}>Your</span> Business
          </h2>
          <p className={`font-roboto text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Comprehensive accessibility compliance tools designed to keep you legal and inclusive
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-sm p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              style={{ animationDelay: feature.animationDelay }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${darkMode ? 'from-gray-700 to-gray-800' : 'from-white to-gray-50'} shadow-md mb-6`}>
                {feature.icon}
              </div>
              <h3 className={`font-poppins text-xl font-semibold ${darkMode ? 'text-[#38bdf8]' : 'text-[#00483a]'} mb-4`}>
                {feature.title}
              </h3>
              <p className={`font-roboto ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className={`inline-flex items-center justify-center gap-2 ${darkMode ? 'bg-[#38bdf8] hover:bg-[#38bdf8]/80' : 'bg-[#00483a] hover:bg-[#00483a]/80'} text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 h-11 rounded-md px-8 py-4 hover:scale-105`}>
            Start Free Scan
          </button>
          <p className={`font-roboto text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-4`}>
            No credit card required • Get results in under 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
}