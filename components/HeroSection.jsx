"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CyberUrlInput from "./CyberUrlInput";
import HeroCyberBackground from "./HeroCyberBackground";

export default function HeroSection() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const router = useRouter();
  const { status } = useSession();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = websiteUrl.trim();
    if (!trimmed) return;

    const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const scannerPath = `/scanner?url=${encodeURIComponent(url)}`;

    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(scannerPath)}`);
      return;
    }

    router.push(scannerPath);
  };

  return (
    <section className="relative min-h-[70vh] flex flex-col justify-center px-4 md:px-10 py-12 pt-20 overflow-hidden">
      <HeroCyberBackground />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <div className="mb-6 flex items-center gap-3">
          <span className="px-2 py-0.5 bg-cx-primary text-cx-bg font-bold text-[10px] tracking-tighter uppercase font-mono-cx">
            Protocol 00-X
          </span>
          <div className="h-px flex-1 bg-cx-outline-variant/30" />
        </div>

        <h1 className="font-mono-cx text-[clamp(2.5rem,8.5vw,5.5rem)] mb-8 uppercase ag-text-glow leading-none font-extrabold tracking-tighter">
          MAKE THE WEB
          <br />
          <span className="text-cx-primary italic">UNSTOPPABLE</span>
        </h1>

        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-7">
            <p className="font-mono-cx text-sm md:text-base leading-snug text-cx-on-surface-variant mb-6 max-w-xl opacity-80">
              The definitive AI remediation engine for the modern terminal. Automated WCAG
              compliance for systems that demand perfection. No compromises.
            </p>

            <div className="pb-6">
              <CyberUrlInput
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                onSubmit={handleSubmit}
              />
            </div>

            <div className="flex flex-wrap gap-4 text-[10px] font-mono-cx uppercase tracking-widest text-cx-on-surface-variant/70 -mt-1">
              <span>WCAG 2.1 AA</span>
              <span>ADA Title III</span>
              <span>EN 301 549</span>
              <span>RPwD Act</span>
            </div>
          </div>

          <div className="hidden lg:flex col-span-5 flex-col items-end gap-4 pb-2">
            <div className="w-full h-px bg-cx-outline-variant/20" />
            <div className="flex flex-col items-end">
              <span className="font-mono-cx text-[9px] text-cx-primary/40 mb-1.5 uppercase tracking-widest">
                Neural_Load
              </span>
              <div className="flex gap-1">
                <div className="w-1 h-6 bg-cx-primary ag-bar-pulse" />
                <div className="w-1 h-6 bg-cx-primary ag-bar-pulse ag-bar-pulse--d1" />
                <div className="w-1 h-6 bg-cx-primary ag-bar-pulse ag-bar-pulse--d2" />
                <div className="w-1 h-6 bg-cx-primary/40 ag-bar-pulse ag-bar-pulse--d3" />
                <div className="w-1 h-6 bg-cx-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
