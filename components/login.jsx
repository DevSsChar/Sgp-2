"use client";

import React from "react";

export default function Login() {
    return (
        <div className="font-sans min-h-screen bg-gray-900">
            <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
                {/* Background layers */}
                <div className="absolute inset-0 bg-gradient-hero" />
                <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />

                {/* Animated blurred shapes */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <div
                        className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#00d4ff]/40 blur-3xl animate-float"
                        style={{ animationDelay: '0s' }}
                    />
                    <div
                        className="absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-lime-400/30 blur-3xl animate-float-slow"
                        style={{ animationDelay: '3s' }}
                    />
                    <div
                        className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-white/10 blur-2xl animate-float-rev"
                        style={{ animationDelay: '6s' }}
                    />
                    <div
                        className="absolute left-1/3 bottom-1/4 h-72 w-72 rounded-full border border-white/20 blur-xl animate-spin-slower"
                        style={{ animationDelay: '9s' }}
                    />
                </div>

                {/* Existing content container */}
                <div className="relative z-10 w-full max-w-3xl px-6 py-16">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="font-poppins text-3xl md:text-4xl font-bold text-white">
                            Sign in to AccessibilityGuard
                        </h1>
                        <p className="font-roboto text-white/80 mt-2">
                            Choose a provider to continue
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <a
                            href="/sign-in?strategy=oauth_google"
                            aria-label="Continue with Google"
                            className="group block rounded-2xl bg-white/95 backdrop-blur shadow-2xl border border-white/60 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00d4ff]/60 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-gray-200 shadow-sm">
                                    <svg viewBox="0 0 48 48" className="h-6 w-6">
                                        <path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 2.9l6-6C34.6 3 29.6 1 24 1 14.6 1 6.5 6.6 3 14.7l7.4 5.7C12 14.7 17.5 9.5 24 9.5z" />
                                        <path fill="#4285F4" d="M46.5 24c0-1.6-.1-2.7-.4-4H24v8.1h12.7c-.6 3-2.4 5.5-5.1 7.2l7.8 6C43.9 37.9 46.5 31.6 46.5 24z" />
                                        <path fill="#FBBC05" d="M10.4 20.4 3 14.7C1.5 17.8.7 21.1.7 24.5s.8 6.7 2.3 9.8l7.4-5.7c-.5-1.4-.8-2.9-.8-4.1 0-1.4.3-2.9.8-4.1z" />
                                        <path fill="#34A853" d="M24 47.3c5.6 0 10.3-1.8 13.7-4.9l-7.8-6c-2.1 1.4-4.9 2.3-7.9 2.3-6.5 0-12-5.2-13.3-12.1l-7.4 5.7C6.5 41.4 14.6 47.3 24 47.3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-poppins text-lg font-semibold text-[#00483a]">Continue with Google</h3>
                                    <p className="font-roboto text-sm text-gray-600">Use your Google account</p>
                                </div>
                                <span className="ml-auto text-[#00483a] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </div>
                        </a>

                        <a
                            href="/sign-in?strategy=oauth_github"
                            aria-label="Continue with GitHub"
                            className="group block rounded-2xl bg-[#0f172a] text-white shadow-2xl border border-white/10 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00d4ff]/60 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-black/60 ring-1 ring-white/10">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-white">
                                        <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.2-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.5 1.1 3.1.8.1-.7.3-1.1.6-1.4-2.6-.3-5.4-1.3-5.4-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.4 1.2a11.8 11.8 0 0 1 6.2 0c2.4-1.5 3.4-1.2 3.4-1.2.6 1.7.2 3 .1 3.3.8.9 1.2 2 1.2 3.3 0 4.5-2.8 5.5-5.4 5.8.4.3.7.9.7 1.8v2.7c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-poppins text-lg font-semibold">Continue with GitHub</h3>
                                    <p className="font-roboto text-sm text-white/80">Use your GitHub account</p>
                                </div>
                                <span className="ml-auto text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </div>
                        </a>
                    </div>

                    <p className="font-roboto text-xs text-white/70 text-center mt-8">
                        By continuing, you agree to our <a className="underline underline-offset-2 hover:text-white" href="#">Terms</a> and <a className="underline underline-offset-2 hover:text-white" href="#">Privacy Policy</a>.
                    </p>
                </div>

                {/* Component-scoped animation styles */}
                <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(10px, -20px, 0); }
          }
          @keyframes float-rev {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(-12px, 18px, 0); }
          }
          @keyframes spin-slower {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          /* Slow-motion durations */
          .animate-float { animation: float 18s ease-in-out infinite; }
          .animate-float-slow { animation: float 28s ease-in-out infinite; }
          .animate-float-rev { animation: float-rev 22s ease-in-out infinite; }
          .animate-spin-slower { animation: spin-slower 90s linear infinite; }

          /* Respect reduced motion */
          @media (prefers-reduced-motion: reduce) {
            .animate-float, .animate-float-slow, .animate-float-rev, .animate-spin-slower { animation: none; }
          }
        `}</style>
            </section>
        </div>
    );
}
