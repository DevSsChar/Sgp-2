"use client";

import { useTheme } from "@/components/ThemeContext";

export default function PageCanvas({ children, className = "" }) {
  const { darkMode } = useTheme();
  return (
    <div className={`page-canvas font-mono-cx mt-14 relative overflow-hidden ${className}`}>
      <main className="relative z-[1] flex-1 pt-8 pb-12 px-4 md:px-8">
        <div className="max-w-[1440px] mx-auto space-y-px">{children}</div>
      </main>
    </div>
  );
}
