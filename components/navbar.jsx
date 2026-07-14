"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => setMounted(true), []);
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const [toast, setToast] = useState("");
  const [toastTimeout, setToastTimeout] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimeout) clearTimeout(toastTimeout);
    const timeout = setTimeout(() => setToast(""), 2500);
    setToastTimeout(timeout);
  };

  const anchorGuard = (e) => {
    if (!isHome) {
      e.preventDefault();
      showToast("This applies only on home page.");
    }
  };

  const isLinkActive = (href) => {
    if (href.startsWith("#") || href.includes("/#")) {
      return isHome;
    }
    const path = href.split("#")[0];
    if (!path || path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const linkClass = (href) => {
    const active = isLinkActive(href);
    if (active) {
      return "text-cx-primary font-bold border-b-2 border-cx-primary pb-0.5";
    }
    return "text-cx-on-surface-variant hover:text-cx-primary";
  };

  const publicLinks = [
    { href: isHome ? "#features" : "/#features", label: "System", onClick: isHome ? undefined : anchorGuard },
    { href: "/legal-guide", label: "Docs" },
    { href: "/demo", label: "Network" },
  ];

  const authLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/scanner", label: "Scanner" },
    { href: "/history", label: "History" },
    { href: "/legal-guide", label: "Docs" },
  ];

  const navLinks = status === "authenticated" ? authLinks : publicLinks;

  const navClass =
    "fixed top-0 w-full z-[60] flex justify-between items-center px-4 md:px-10 h-14 bg-cx-surface-container-low/95 backdrop-blur-xl border-b border-cx-outline-variant/30";

  return (
    <nav className={navClass}>
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] px-4 py-1.5 bg-cx-secondary-container text-cx-on-secondary-container font-mono-cx text-[10px] uppercase tracking-widest shadow-lg">
          {toast}
        </div>
      )}

      <Link href="/" className="flex items-center gap-2">
        <img
          src="/images/accessibilityguard_logo-removebg-preview.png"
          alt="AccessibilityGuard logo"
          className="h-8 w-auto shrink-0 brightness-[0.35] saturate-[3] dark:brightness-100 dark:saturate-100"
        />
        <span className="font-mono-cx text-sm font-bold uppercase tracking-widest text-cx-primary">
          Access<span className="text-cx-on-surface">_Guard</span>
        </span>
      </Link>

      <div className="hidden md:flex gap-5 lg:gap-8 items-center h-full">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={link.onClick}
            aria-current={isLinkActive(link.href) ? "page" : undefined}
            className={`font-mono-cx text-[10px] tracking-widest uppercase transition-all ${linkClass(link.href)}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-3">
        <ThemeToggle className="scale-75" />
        {status === "authenticated" ? (
          <div className="flex items-center gap-3">
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt={session?.user?.name || "User avatar"}
                className="h-6 w-6 ring-2 ring-cx-primary/40"
              />
            )}
            <span className="font-mono-cx text-[11px] uppercase tracking-widest text-cx-on-surface-variant">
              {session?.user?.name?.split(" ")[0] || "User"}
            </span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="font-mono-cx text-[10px] uppercase tracking-widest border px-2 py-1 transition-colors border-cx-outline-variant text-cx-on-surface-variant hover:border-cx-primary hover:text-cx-primary"
            >
              Sign out
            </button>
          </div>
        ) : (
          <>
            <span className="font-mono-cx text-cx-primary text-[11px] uppercase tracking-widest hidden lg:inline">
              Uptime: 99.998%
            </span>
            <Link
              href="/login"
              prefetch={false}
              className="font-mono-cx text-[11px] uppercase tracking-widest border px-3 py-1.5 transition-colors border-cx-primary text-cx-primary hover:bg-cx-primary hover:text-[#050505] dark:hover:text-[#050505]"
            >
              Sign In
            </Link>
          </>
        )}
      </div>

      <button
        className="md:hidden p-2 text-cx-on-surface"
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-nav"
        onClick={toggleMenu}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      {mounted && isMenuOpen && (
        <div
          id="mobile-nav"
          className="md:hidden absolute top-full left-0 right-0 bg-cx-surface-container-low border-b border-cx-outline-variant/30 p-4"
        >
          <div className="flex flex-col gap-4 font-mono-cx text-xs uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  link.onClick?.(e);
                  setIsMenuOpen(false);
                }}
                aria-current={isLinkActive(link.href) ? "page" : undefined}
                className={`transition-colors ${
                  isLinkActive(link.href)
                    ? "text-cx-primary font-bold border-l-2 border-cx-primary pl-2"
                    : "text-cx-on-surface-variant hover:text-cx-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-cx-outline-variant/20 pt-4 flex items-center justify-between">
              <ThemeToggle />
              {status === "authenticated" ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-cx-error border border-cx-error/40 px-3 py-1"
                >
                  Sign out
                </button>
              ) : (
                <Link href="/login" className="border border-cx-primary text-cx-primary hover:bg-cx-primary hover:text-[#050505] px-3 py-1.5" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
