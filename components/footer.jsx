"use client";
import React from 'react';
import { useTheme } from './ThemeContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { darkMode } = useTheme();
  
  return (
    <footer className={`${darkMode ? 'bg-[#00483a]' : 'bg-[#f8fafc] border-t border-gray-200'} py-16`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <h3 className={`font-poppins text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#00483a]'}`}>AccessibilityGuard</h3>
            <p className={`font-roboto ${darkMode ? 'text-white/80' : 'text-gray-600'} mb-6 max-w-md`}>
              Making the web accessible for everyone. Protect your business with AI-powered WCAG compliance.
            </p>
            <a href="#trial" className="inline-flex items-center justify-center rounded-md bg-[#00d4ff] text-white font-medium text-sm py-2 px-6 hover:bg-[#00d4ff]/90 transition-all">
              Start Free Trial
            </a>
          </div>
          <div>
            <h4 className={`font-poppins font-semibold mb-4 ${darkMode ? 'text-white' : 'text-[#00483a]'}`}>Product</h4>
            <ul className={`space-y-2 font-roboto ${darkMode ? 'text-white/80' : 'text-gray-600'}`}>
              <li><a className={`hover:text-[#00d4ff] transition-colors`} href="#features">Features</a></li>
              {/* <li><a className={`hover:text-[#00d4ff] transition-colors`} href="#pricing">Pricing</a></li> */}
              <li><a className={`hover:text-[#00d4ff] transition-colors`} href="#">API Docs</a></li>
              <li><a className={`hover:text-[#00d4ff] transition-colors`} href="#">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-poppins font-semibold mb-4 ${darkMode ? 'text-white' : 'text-[#00483a]'}`}>Company</h4>
            <ul className={`space-y-2 font-roboto ${darkMode ? 'text-white/80' : 'text-gray-600'}`}>
              <li><a className={`hover:text-[#00d4ff] transition-colors`} href="#about">About</a></li>
              <li><a className={`hover:text-[#00d4ff] transition-colors`} href="#">Contact</a></li>
              <li><a className={`hover:text-[#00d4ff] transition-colors`} href="#">Privacy</a></li>
              <li><a className={`hover:text-[#00d4ff] transition-colors`} href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className={`${darkMode ? 'border-white/20' : 'border-gray-200'} border-t pt-8 flex flex-col md:flex-row justify-between items-center`}>
          <p className={`font-roboto ${darkMode ? 'text-white/60' : 'text-gray-500'} text-sm`}>
            © {currentYear} AccessibilityGuard. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className={`${darkMode ? 'text-white/60' : 'text-gray-500'} hover:text-[#00d4ff] transition-colors`}>Twitter</a>
            <a href="#" className={`${darkMode ? 'text-white/60' : 'text-gray-500'} hover:text-[#00d4ff] transition-colors`}>LinkedIn</a>
            <a href="#" className={`${darkMode ? 'text-white/60' : 'text-gray-500'} hover:text-[#00d4ff] transition-colors`}>GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
