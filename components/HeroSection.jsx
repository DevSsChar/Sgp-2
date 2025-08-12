"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useTheme } from './ThemeContext';

export default function HeroSection() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const { darkMode } = useTheme();

  const handleInputChange = (e) => {
    setWebsiteUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission - scan website
    console.log('Scanning website:', websiteUrl);
    // Add your API call or other logic here
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        {/* Primary background - gradient */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gray-950' : 'bg-gray-900'}`}></div>

        {/* SVG Background */}
        <div className={`absolute inset-0 flex items-center justify-center ${darkMode ? 'opacity-10' : 'opacity-20'}`}>
          <Image
            src="/images/OIPD.jpeg"
            alt="accessibility background"
            fill="cover"
            className="w-full h-screen object-cover"
            loading="lazy"
          // width={1920}
          // height={1080}
          // priority
          />
        </div>

        {/* Subtle pattern overlay for added texture */}
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white py-16">
        <div className="animate-fade-in">
          <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Make Your Website<br />
            Accessible with AI<br />
            <span className={`${darkMode ? 'text-lime-300' : 'text-lime-400'} inline-block animate-bounce`}>
              WCAG 2.1 AA
            </span>
          </h1>

          <p className="font-roboto text-xl md:text-xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Automated WCAG 2.1 compliance scanning, AI-powered fixes, and
            multilingual accessibility reports. Get 99.9% compliance in minutes, not months.
          </p>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-stretch mb-16 max-w-3xl mx-auto">
            <div className={`flex items-center ${darkMode ? 'bg-white/5' : 'bg-white/10'} backdrop-blur-sm rounded-lg p-4 flex-grow`}>
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
                className="h-5 w-5 text-white/70 mr-3 shrink-0"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <input
                type="url"
                placeholder="Enter your website URL..."
                className="bg-transparent text-white placeholder-white/70 flex-1 outline-none font-roboto w-full"
                value={websiteUrl}
                onChange={handleInputChange}
                required
              />
            </div>
            <button
              type="submit"
              className={`inline-flex items-center justify-center whitespace-nowrap text-white font-semibold ${darkMode ? 'bg-[#38bdf8] hover:bg-[#0ea5e9]' : 'bg-cyan-400 hover:bg-cyan-600'} rounded-lg px-8 py-4 text-lg transition-all duration-300 shadow-lg`}
            >
              Scan My Website
            </button>
          </form>

          {/* Compliance badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-white/70 font-roboto text-sm">
            <span>✓ WCAG 2.1 AA Compliant</span>
            <span>✓ ADA Title III Ready</span>
            <span>✓ EU EN 301 549</span>
            <span>✓ India RPwD Act</span>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
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
            className="h-6 w-6 text-white/60 dark:text-white/60"
          >
            <path d="M12 5v14"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </section>
  );
}
