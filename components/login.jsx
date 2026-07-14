"use client";
import React from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: "travel_explore", text: "Deep-crawl WCAG 2.1 audits" },
  { icon: "auto_fix_high", text: "AI-powered fix suggestions" },
  { icon: "history", text: "Full scan history & PDF reports" },
];

const LoginPage = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  const handleGithubSignIn = () => {
    signIn("github", { callbackUrl });
  };

  return (
    <div className="page-canvas font-mono-cx mt-14 relative overflow-hidden min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-10">
      {/* Theme-aware background FX */}
      <div className="scanner-fx absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="scanner-fx-glow absolute inset-x-0 top-0 h-[420px]" />
        <div className="scanner-fx-radar absolute -right-24 top-1/2 w-72 h-72 md:w-96 md:h-96" />
        <div className="scanner-fx-reticle absolute left-[6%] top-[16%] w-24 h-24 md:w-32 md:h-32" />
        <div className="scanner-fx-crosshair absolute left-[14%] bottom-[18%] w-40 h-40 hidden md:block" />
        <div className="scanner-fx-diamond absolute right-[28%] top-[12%] w-2.5 h-2.5" />
        <div className="scanner-fx-diamond scanner-fx-diamond--slow absolute left-[30%] bottom-[12%] w-2 h-2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-[1] w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 border border-cx-outline-variant/40 bg-cx-surface shadow-cx-glow overflow-hidden"
      >
        {/* Brand panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-cx-surface-container-low border-r border-cx-outline-variant/30 relative">
          <div className="absolute top-3 left-3 font-mono-cx text-[10px] tracking-widest text-cx-outline-variant uppercase">
            [AUTH_GATE_01]
          </div>

          <div className="pt-8">
            <Link href="/" className="inline-block mb-8">
              <img
                src="/images/accessibilityguard_logo-removebg-preview.png"
                alt="AccessibilityGuard logo"
                className="h-16 w-auto brightness-[0.35] saturate-[3] dark:brightness-100 dark:saturate-100"
              />
            </Link>
            <h1 className="font-mono-cx text-2xl font-bold uppercase tracking-tight text-cx-on-surface leading-snug mb-3">
              Access<span className="text-cx-primary">_Guard</span>
            </h1>
            <p className="font-mono-cx text-xs leading-relaxed text-cx-on-surface-variant max-w-xs">
              Systemic accessibility oversight for high-performance engineering teams. Scan, audit
              and remediate — all from one terminal.
            </p>
          </div>

          <div className="space-y-3 pt-10">
            {FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-cx-primary text-base">
                  {f.icon}
                </span>
                <span className="font-mono-cx text-[11px] uppercase tracking-wider text-cx-on-surface-variant">
                  {f.text}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-10 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cx-secondary-container animate-pulse" />
            <span className="font-mono-cx text-[10px] uppercase tracking-[0.25em] text-cx-on-surface-variant opacity-70">
              System online // WCAG 2.1 engine
            </span>
          </div>
        </div>

        {/* Sign-in panel */}
        <div className="p-8 md:p-10 flex flex-col justify-center relative">
          <div className="absolute top-3 right-3 font-mono-cx text-[10px] tracking-widest text-cx-outline-variant uppercase">
            SECURE_CHANNEL
          </div>

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden inline-flex justify-center mb-8">
            <img
              src="/images/accessibilityguard_logo-removebg-preview.png"
              alt="AccessibilityGuard logo"
              className="h-12 w-auto brightness-[0.35] saturate-[3] dark:brightness-100 dark:saturate-100"
            />
          </Link>

          <div className="mb-8 text-center lg:text-left">
            <div className="font-mono-cx text-[10px] uppercase tracking-[0.3em] text-cx-primary mb-2">
              Authentication required
            </div>
            <h2 className="font-mono-cx text-2xl font-bold text-cx-on-surface mb-1">
              Welcome back
            </h2>
            <p className="font-mono-cx text-xs text-cx-on-surface-variant">
              Sign in with a verified identity provider to continue
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="group w-full flex items-center gap-3 py-3 px-4 border border-cx-outline-variant/60 bg-cx-surface-container-low text-cx-on-surface hover:border-cx-primary hover:bg-cx-surface-container text-sm font-mono-cx focus:outline-none focus:ring-2 focus:ring-cx-primary cursor-pointer transition-all"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="flex-1 text-left">Continue with Google</span>
              <span className="material-symbols-outlined text-base text-cx-outline-variant group-hover:text-cx-primary group-hover:translate-x-0.5 transition-all">
                arrow_forward
              </span>
            </button>

            <button
              type="button"
              onClick={handleGithubSignIn}
              className="group w-full flex items-center gap-3 py-3 px-4 border border-cx-outline-variant/60 bg-cx-surface-container-low text-cx-on-surface hover:border-cx-primary hover:bg-cx-surface-container text-sm font-mono-cx focus:outline-none focus:ring-2 focus:ring-cx-primary cursor-pointer transition-all"
            >
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.91-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="flex-1 text-left">Continue with GitHub</span>
              <span className="material-symbols-outlined text-base text-cx-outline-variant group-hover:text-cx-primary group-hover:translate-x-0.5 transition-all">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-cx-outline-variant/20 space-y-3">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <span className="material-symbols-outlined text-cx-primary text-sm">lock</span>
              <span className="font-mono-cx text-[10px] uppercase tracking-widest text-cx-on-surface-variant">
                OAuth 2.0 encrypted session
              </span>
            </div>
            <p className="font-mono-cx text-[10px] leading-relaxed text-cx-on-surface-variant opacity-70 text-center lg:text-left">
              New accounts are provisioned automatically on first sign-in. By continuing you agree
              to our{" "}
              <Link href="/legal-guide" className="text-cx-primary hover:underline">
                terms &amp; compliance guidelines
              </Link>
              .
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
