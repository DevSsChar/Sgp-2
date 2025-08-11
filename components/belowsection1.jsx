"use client";
import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      bgColor: "bg-cyan-400",
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
          className="h-6 w-6 text-[#00483a]"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      ),
      title: "Enter URL",
      description:
        "Simply paste your website URL and our AI scanner will analyze every page for WCAG 2.1 AA compliance issues."
    },
    {
      number: 2,
      bgColor: "bg-lime-400",
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
          className="h-6 w-6 text-[#00483a]"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" x2="12" y1="15" y2="3"></line>
        </svg>
      ),
      title: "View AI Report",
      description:
        "Get a detailed breakdown of all accessibility issues with specific code examples and remediation suggestions."
    },
    {
      number: 3,
      bgColor: "bg-red-400",
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
          className="h-6 w-6 text-[#00483a]"
        >
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
        </svg>
      ),
      title: "Click 'AI Fix'",
      description:
        "Apply our AI-generated fixes with one click, or download the patches to implement manually."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-poppins text-4xl md:text-5xl font-bold text-[#00483a] mb-6">
            How It <span className="text-cyan-400">Works</span>
          </h2>
          <p className="font-roboto text-xl text-gray-600 max-w-3xl mx-auto">
            Three simple steps to complete accessibility compliance
          </p>
        </div>

        <div className="relative">
          {/* Connecting line between steps - visible only on larger screens */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-lime-400 to-red-400 transform -translate-y-1/2 z-0"></div>

          <div className="grid lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="rounded-lg text-card-foreground shadow-sm text-center p-8 bg-white hover:shadow-lg transition-all duration-300 border-0"
              >
                {/* Step number circle with different colors */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.bgColor} text-white font-poppins font-bold text-2xl mb-6 mx-auto shadow-md`}>
                  {step.number}
                </div>
                
                {/* Icon circle */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-6">
                  {step.icon}
                </div>
                
                <h3 className="font-poppins text-2xl font-semibold text-[#00483a] mb-4">
                  {step.title}
                </h3>
                <p className="font-roboto text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-white font-semibold hover:bg-cyan-500 shadow-md hover:shadow-lg transition-all duration-300 h-11 rounded-md px-8 py-4">
            See It In Action
          </button>
        </div>
      </div>
    </section>
  );
}