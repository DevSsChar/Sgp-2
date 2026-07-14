"use client";

import Link from "next/link";

const capabilities = [
  {
    number: "01",
    title: "Automated Scanner",
    description:
      "Real-time WCAG 2.1 AA compliance checks across your entire website. Neural networks detecting issues before they become legal problems.",
  },
  {
    number: "02",
    title: "AI Remediation",
    description:
      "Dynamic code fix suggestions that adapt to complex UI layouts. Get specific remediation in plain English with copy-ready patches.",
  },
  {
    number: "03",
    title: "Legal Shield",
    description:
      "Audit-ready documentation generated automatically with every scan. ADA, Section 508, and EN 301 549 compliance reports on demand.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 md:px-10 py-14 md:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <span className="font-mono-cx text-[10px] text-cx-primary tracking-[0.35em] uppercase">
            System capabilities
          </span>
          <div className="h-px flex-1 bg-cx-outline-variant/20" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-6">
          {capabilities.map((item) => (
            <div key={item.number} className="flex-1 group cursor-default">
              <span className="font-mono-cx text-cx-primary/20 text-[clamp(2rem,6vw,3rem)] leading-none group-hover:text-cx-primary transition-colors font-extrabold">
                {item.number}
              </span>
              <h3 className="font-mono-cx text-base md:text-lg uppercase mb-4 mt-2 font-semibold tracking-tight">
                {item.title}
              </h3>
              <div className="h-0.5 w-0 bg-cx-primary group-hover:w-full transition-all duration-500 mb-4" />
              <p className="font-mono-cx text-sm opacity-40 group-hover:opacity-100 transition-opacity leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/scanner"
            className="btn-cx-outline inline-flex items-center justify-center gap-2 border-2 border-cx-primary text-cx-primary px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-cx-primary hover:text-cx-bg dark:hover:text-[#050505] transition-all font-mono-cx"
          >
            Initiate Scan
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
