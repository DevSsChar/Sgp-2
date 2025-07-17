"use client";
import React, { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <a className="font-poppins text-xl font-bold text-blue-600" href="/">
            AccessibilityGuard
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <a className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" href="#features">Features</a>
            <a className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" href="#how-it-works">How It Works</a>
            <a className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" href="#pricing">Pricing</a>
            <a className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" href="#about">About</a>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <a 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-4 py-2" 
              href="/dashboard/overview"
            >
              Sign In
            </a>
            <a 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm bg-[#00d4ff] text-white font-semibold hover:bg-[#00d4ff]/90 shadow-md transition-all duration-300 h-10 px-4 py-2" 
              href="/dashboard/overview"
            >
              Get Started Free
            </a>
          </div>
          <button 
            className="md:hidden p-2"
            aria-label="Toggle menu"
            onClick={toggleMenu}
          >
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
              className="lucide lucide-menu h-6 w-6 text-gray-600"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
          
          {/* Mobile menu, show/hide based on menu state */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg p-4">
              <div className="flex flex-col space-y-4">
                <a className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" href="#features">Features</a>
                <a className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" href="#how-it-works">How It Works</a>
                <a className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" href="#pricing">Pricing</a>
                <a className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" href="#about">About</a>
                <a className="font-medium text-[#00d4ff]" href="/dashboard/overview">Sign In</a>
                <a className="inline-flex items-center justify-center rounded-md bg-[#00d4ff] text-white font-semibold px-4 py-2" href="/dashboard/overview">Get Started Free</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
