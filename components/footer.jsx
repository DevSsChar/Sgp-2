"use client";
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#00483a] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <h3 className="font-poppins text-2xl font-bold mb-4">AccessibilityGuard</h3>
            <p className="font-roboto text-white/80 mb-6 max-w-md">
              Making the web accessible for everyone. Protect your business with AI-powered WCAG compliance.
            </p>
            <a href="#trial" className="inline-flex items-center justify-center rounded-md bg-[#00d4ff] text-white font-medium text-sm py-2 px-6 hover:bg-[#00d4ff]/90 transition-all">
              Start Free Trial
            </a>
          </div>
          <div>
            <h4 className="font-poppins font-semibold mb-4">Product</h4>
            <ul className="space-y-2 font-roboto text-white/80">
              <li><a className="hover:text-[#00d4ff] transition-colors" href="#features">Features</a></li>
              <li><a className="hover:text-[#00d4ff] transition-colors" href="#pricing">Pricing</a></li>
              <li><a className="hover:text-[#00d4ff] transition-colors" href="#">API Docs</a></li>
              <li><a className="hover:text-[#00d4ff] transition-colors" href="#">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-poppins font-semibold mb-4">Company</h4>
            <ul className="space-y-2 font-roboto text-white/80">
              <li><a className="hover:text-[#00d4ff] transition-colors" href="#about">About</a></li>
              <li><a className="hover:text-[#00d4ff] transition-colors" href="#">Contact</a></li>
              <li><a className="hover:text-[#00d4ff] transition-colors" href="#">Privacy</a></li>
              <li><a className="hover:text-[#00d4ff] transition-colors" href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-roboto text-white/60 text-sm">
            © {currentYear} AccessibilityGuard. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-white/60 hover:text-[#00d4ff] transition-colors">Twitter</a>
            <a href="#" className="text-white/60 hover:text-[#00d4ff] transition-colors">LinkedIn</a>
            <a href="#" className="text-white/60 hover:text-[#00d4ff] transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
