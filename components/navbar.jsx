"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // added signOut

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession(); // added

  useEffect(() => setMounted(true), []);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-poppins text-xl font-bold text-blue-600">
            AccessibilityGuard
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" href="#features">Features</Link>
            <Link className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" href="#how-it-works">How It Works</Link>
            <Link className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" href="#about">About</Link>
            {status === "authenticated" && (
              <Link className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" href="/history">History</Link>
            )}
            {status === "authenticated" && (
              <Link className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" href="/scanner">Scanner</Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {status === "authenticated" ? (
              <>
                {session?.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session?.user?.name || "User avatar"}
                    className="h-8 w-8 rounded-full ring-2 ring-[#00d4ff]/30"
                  />
                )}
                <div className="flex flex-col items-end leading-tight">
                  <span className="font-poppins text-sm text-gray-700">
                    {session?.user?.name || "User"}
                  </span>
                  <div className="flex items-center gap-3">
                    <a
                      href={session?.user?.profileUrl || "/dashboard"}
                      className="text-xs text-[#00d4ff] hover:underline"
                      target={session?.user?.profileUrl ? "_blank" : undefined}
                      rel={session?.user?.profileUrl ? "noreferrer" : undefined}
                    >
                      {session?.user?.profileUrl ? "Profile" : "Dashboard"}
                    </a>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-xs text-red-500 hover:text-red-600"
                      aria-label="Sign out"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                prefetch={false}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm bg-[#00d4ff] text-white font-semibold hover:bg-[#00d4ff]/80 shadow-md transition-all duration-300 h-10 px-4 py-2"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            onClick={toggleMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className="lucide lucide-menu h-6 w-6 text-gray-600"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>

          {mounted && isMenuOpen && (
            <div id="mobile-nav" className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg p-4">
              <div className="flex flex-col space-y-4">
                {status === "authenticated" && (
                  <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                    {session?.user?.image && (
                      <img
                        src={session.user.image}
                        alt={session?.user?.name || "User avatar"}
                        className="h-8 w-8 rounded-full ring-2 ring-[#00d4ff]/30"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">{session?.user?.name || "User"}</span>
                      <a
                        href={session?.user?.profileUrl || "/dashboard"}
                        className="text-sm text-[#00d4ff]"
                        target={session?.user?.profileUrl ? "_blank" : undefined}
                        rel={session?.user?.profileUrl ? "noreferrer" : undefined}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {session?.user?.profileUrl ? "Profile" : "Dashboard"}
                      </a>
                      <button
                        type="button"
                        onClick={() => { setIsMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                        className="text-sm text-red-500 text-left mt-1 cursor-pointer hover:cursor-pointer"
                        aria-label="Sign out"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}

                <Link href="#features" className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Features</Link>
                <Link href="#how-it-works" className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>How It Works</Link>
                <Link href="#pricing" className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                <Link href="#about" className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>About</Link>

                {status !== "authenticated" && (
                  <>
                    <Link href="/login" className="font-medium text-[#00d4ff]" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                    <Link href="/dashboard" className="inline-flex items-center justify-center rounded-md bg-[#00d4ff] text-white font-semibold px-4 py-2" onClick={() => setIsMenuOpen(false)}>Get Started Free</Link>
                  </>
                )}
                {status === "authenticated" && (
                  <Link href="/history" className="font-roboto text-gray-600 hover:text-[#00d4ff] transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>History</Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}