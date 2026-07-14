"use client";

import Link from "next/link";

export default function FinalCTA() {
  return (
    <section
      id="about"
      className="flex flex-col items-center justify-center text-center px-4 md:px-10 py-14 md:py-16 bg-cx-primary text-cx-bg"
    >
      <h2 className="font-mono-cx text-[clamp(1.75rem,5vw,3.5rem)] leading-none uppercase mb-8 tracking-tighter font-extrabold">
        JOIN THE FRONT
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/login"
          className="bg-cx-bg text-cx-primary dark:bg-[#050505] dark:text-[#a2f0ec] px-8 md:px-12 py-3 md:py-4 text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform font-mono-cx border-0"
        >
          Get Access Now
        </Link>
        <Link
          href="/legal-guide"
          className="border-2 border-cx-bg text-cx-bg dark:border-[#050505] dark:text-[#050505] px-8 md:px-12 py-3 md:py-4 text-sm font-bold uppercase tracking-widest hover:bg-cx-bg hover:text-cx-primary dark:hover:bg-[#050505] dark:hover:text-[#a2f0ec] transition-all font-mono-cx"
        >
          Documentation
        </Link>
      </div>
    </section>
  );
}
