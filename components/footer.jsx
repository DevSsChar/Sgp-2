"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="fixed bottom-0 w-full z-[60] bg-cx-on-tertiary-fixed dark:bg-cx-surface-container-low border-t border-cx-outline-variant/30 px-4 md:px-10 py-2 backdrop-blur-xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-3">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cx-secondary-container animate-pulse" />
            <span className="font-mono-cx text-[10px] uppercase text-cx-primary-container dark:text-cx-primary tracking-widest">
              System Online
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-4 opacity-60 dark:opacity-40">
            <span className="font-mono-cx text-[10px] uppercase tracking-widest text-cx-on-tertiary-fixed-variant dark:text-cx-on-surface-variant">Node: DX-992</span>
            <span className="font-mono-cx text-[10px] uppercase tracking-widest text-cx-on-tertiary-fixed-variant dark:text-cx-on-surface-variant">Ping: 4ms</span>
          </div>
        </div>

        <div className="flex gap-4 md:gap-8 font-mono-cx text-[9px] uppercase tracking-[0.15em] text-cx-on-tertiary-fixed-variant dark:text-cx-on-surface-variant">
          <Link href="#" className="hover:text-cx-primary transition-colors">
            Privacy_Protocol
          </Link>
          <Link href="#" className="hover:text-cx-primary transition-colors">
            Terms_of_Engagement
          </Link>
          <Link href="/legal-guide" className="hover:text-cx-primary transition-colors">
            Security_Vault
          </Link>
        </div>

        <div className="font-mono-cx text-[10px] opacity-60 dark:opacity-40 uppercase tracking-widest text-cx-on-tertiary-fixed-variant dark:text-cx-on-surface-variant">
          © {currentYear} AG_CORE // ACCESSIBILITY_GUARD
        </div>
      </div>
    </footer>
  );
}
