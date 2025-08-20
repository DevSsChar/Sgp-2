"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const { darkMode } = useTheme();

  useEffect(() => setMounted(true), []);
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  // Toast state
  const [toast, setToast] = useState("");
  const [toastTimeout, setToastTimeout] = useState(null);
  // Helper: show toast
  const showToast = (msg) => {
    setToast(msg);
    if (toastTimeout) clearTimeout(toastTimeout);
    const timeout = setTimeout(() => setToast(""), 2500);
    setToastTimeout(timeout);
  };

  // Helper: check if on home page
  const isHome = typeof window !== "undefined" && window.location.pathname === "/";

  // Desktop nav links
  const desktopLinks = status === "authenticated"
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/scanner", label: "Scanner" },
        { href: "/history", label: "History" },
        { href: "/legal-guide", label: "Legal Guide" },
        { href: "/", label: "Home" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/demo", label: "Demo" },
        { href: "#features", label: "Features", onClick: (e) => { if (!isHome) { e.preventDefault(); showToast("This applies only on home page."); } } },
        { href: "#how-it-works", label: "How It Works", onClick: (e) => { if (!isHome) { e.preventDefault(); showToast("This applies only on home page."); } } },
        { href: "#about", label: "About", onClick: (e) => { if (!isHome) { e.preventDefault(); showToast("This applies only on home page."); } } },
        { href: "/legal-guide", label: "Legal Guide" },
      ];

  return (
    <nav
      className={`$
        darkMode
          ? "bg-gray-900/95 text-white border-gray-700"
          : "bg-white/95 text-gray-800 border-gray-200"
      } backdrop-blur-sm border-b fixed top-0 left-0 right-0 z-50 transition-colors duration-300`}
    >
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-6 py-2 rounded-lg bg-green-600 text-white font-medium shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className={`font-poppins text-xl font-bold ${
              darkMode ? "text-[#00d4ff]" : "text-blue-600"
            }`}
          >
            AccessibilityGuard
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {desktopLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-roboto hover:text-[#00d4ff] transition-colors font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
                onClick={link.onClick}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right cluster */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle className="mr-2" />
            {status === "authenticated" ? (
              <>
                {session?.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session?.user?.name || "User avatar"}
                    className="h-8 w-8 rounded-full ring-2 ring-[#00d4ff]/30"
                  />
                )}

                {/* Name + sign-out on the same line */}
                <div className="flex items-center gap-2">
                  <span
                    className={`font-poppins text-sm ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {session?.user?.name || "User"}
                  </span>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors
                      ${
                        darkMode
                          ? "border-red-800/40 text-red-300 hover:bg-red-900/30"
                          : "border-red-200 text-red-600 hover:bg-red-50"
                      }`}
                    aria-label="Sign out"
                    title="Sign out"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v4" />
                      <path d="M10 14 21 3" />
                      <path d="M21 10v11a2 2 0 0 1-2 2H8" />
                      <path d="M3 3l7 7" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm border font-medium px-3.5 py-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                  Try Demo
                </Link>
                <Link
                  href="/login"
                  prefetch={false}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm bg-[#00d4ff] text-white font-semibold hover:bg-[#00d4ff]/80 shadow-md transition-all duration-300 h-10 px-4 py-2"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            onClick={toggleMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`lucide lucide-menu h-6 w-6 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>

          {/* Mobile drawer */}
          {mounted && isMenuOpen && (
            <div
              id="mobile-nav"
              className={`md:hidden absolute top-16 left-0 right-0 ${
                darkMode ? "bg-gray-800 shadow-lg" : "bg-white shadow-lg"
              } p-4`}
            >
              <div className="flex flex-col space-y-4">
                {status === "authenticated" && (
                  <>
                    <div className={`flex items-center gap-3 pb-2 ${darkMode ? "border-gray-700" : "border-gray-100"} border-b`}>
                      {session?.user?.image && (
                        <img
                          src={session.user.image}
                          alt={session?.user?.name || "User avatar"}
                          className="h-8 w-8 rounded-full ring-2 ring-[#00d4ff]/30"
                        />
                      )}
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                          {session?.user?.name || "User"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors
                            ${darkMode ? "border-red-800/40 text-red-300 hover:bg-red-900/30" : "border-red-200 text-red-600 hover:bg-red-50"}`}
                          aria-label="Sign out"
                          title="Sign out"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className={`font-roboto ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } hover:text-[#00d4ff] transition-colors font-medium`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/scanner"
                      className={`font-roboto ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } hover:text-[#00d4ff] transition-colors font-medium`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Scanner
                    </Link>
                    <Link
                      href="/history"
                      className={`font-roboto ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } hover:text-[#00d4ff] transition-colors font-medium`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      History
                    </Link>
                    <Link
                      href="/legal-guide"
                      className={`font-roboto ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } hover:text-[#00d4ff] transition-colors font-medium`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Legal Guide
                    </Link>
                    <Link
                      href="/"
                      className={`font-roboto ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } hover:text-[#00d4ff] transition-colors font-medium`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </>
                )}
                {status !== "authenticated" && (
                  <>
                    <Link
                      href="/demo"
                      className={`font-roboto ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } hover:text-[#00d4ff] transition-colors font-medium`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Demo
                    </Link>
                    <Link
                      href="/"
                      className={`font-roboto ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } hover:text-[#00d4ff] transition-colors font-medium`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      href="#features"
                      className={`font-roboto ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } hover:text-[#00d4ff] transition-colors font-medium`}
                      onClick={e => {
                        if (!(typeof window !== "undefined" && window.location.pathname === "/")) {
                          e.preventDefault();
                          setIsMenuOpen(false);
                          showToast("This applies only on home page.");
                        } else {
                          setIsMenuOpen(false);
                        }
                      }}
                    >
                      Features
                    </Link>
                    <Link
                      href="#how-it-works"
                      className={`font-roboto ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } hover:text-[#00d4ff] transition-colors font-medium`}
                      onClick={e => {
                        if (!(typeof window !== "undefined" && window.location.pathname === "/")) {
                          e.preventDefault();
                          setIsMenuOpen(false);
                          showToast("This applies only on home page.");
                        } else {
                          setIsMenuOpen(false);
                        }
                      }}
                    >
                      How It Works
                    </Link>
                    <Link
                      href="#about"
                      className={`font-roboto ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } hover:text-[#00d4ff] transition-colors font-medium`}
                      onClick={e => {
                        if (!(typeof window !== "undefined" && window.location.pathname === "/")) {
                          e.preventDefault();
                          setIsMenuOpen(false);
                          showToast("This applies only on home page.");
                        } else {
                          setIsMenuOpen(false);
                        }
                      }}
                    >
                      About
                    </Link>
                    <Link
                      href="/legal-guide"
                      className={`font-roboto ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } hover:text-[#00d4ff] transition-colors font-medium`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Legal Guide
                    </Link>
                    <Link
                      href="/login"
                      className="font-medium text-[#00d4ff]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/demo"
                      className="inline-flex items-center justify-center rounded-md bg-[#00d4ff] text-white font-semibold px-4 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View Demo
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}