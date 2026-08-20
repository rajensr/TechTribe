"use client";
// components/Navbar.tsx
// Navigation bar — scroll e glassmorphism effect, mobile responsive hamburger menu

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/companies", label: "Companies" },
  { href: "/jobs", label: "Jobs" },
  { href: "/salaries", label: "Salaries" },
];

export default function Navbar() {
  // Scroll state — glassmorphism activate korbe scroll korlei
  const [isScrolled, setIsScrolled] = useState(false);
  // Mobile menu open/close state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Scroll listener — 10px er beshi scroll korle glassmorphism on
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Route change hole mobile menu bondo hobe
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-[12px] border-b border-[var(--outline-variant)] shadow-sm"
          : "bg-white border-b border-[var(--outline-variant)] shadow-xs"
      }`}
    >
      <div className="container">
        <nav
          className="flex items-center justify-between h-16"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* ─── LOGO / WORDMARK ────────────────────────────────────────── */}
          {/* TechTribe wordmark — Geist Bold, primary blue */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="TechTribe home"
          >
            {/* Logo icon — T shape */}
            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-sm font-mono">TT</span>
            </div>
            <span
              className="text-[var(--primary)] font-bold text-lg leading-none"
              style={{ fontFamily: "var(--font-geist, system-ui)" }}
            >
              TechTribe
            </span>
          </Link>

          {/* ─── DESKTOP NAV LINKS ──────────────────────────────────────── */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => {
              // Active link check — current page highlight
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? "text-[var(--primary)] font-semibold"
                        : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-container)]"
                    }`}
                  >
                    {link.label}
                    {/* Active indicator — bottom border */}
                    {isActive && (
                      <span className="block h-0.5 bg-[var(--primary)] mt-0.5 rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ─── RIGHT SIDE ACTIONS ─────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Sign In — ghost style */}
            <Link
              href="/auth/signin"
              className="btn-ghost text-sm px-4 py-2"
              id="nav-signin-btn"
            >
              Sign In
            </Link>
            {/* Post a Review — primary CTA */}
            <Link
              href="/auth/register"
              className="btn-primary text-sm px-4 py-2"
              id="nav-post-review-btn"
            >
              Post a Review
            </Link>
          </div>

          {/* ─── MOBILE HAMBURGER BUTTON ────────────────────────────────── */}
          <button
            className="md:hidden p-2 rounded-lg text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            id="mobile-menu-toggle"
          >
            {/* Hamburger icon — X hole close, else 3 lines */}
            <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-200 ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-200 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-200 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </nav>

        {/* ─── MOBILE DROPDOWN MENU ───────────────────────────────────── */}
        {/* Slide down when hamburger click kora hoy */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t border-[var(--outline-variant)] bg-white/95 backdrop-blur-[12px] pb-4 animate-fade-in"
            role="menu"
          >
            <ul className="flex flex-col pt-2" role="list">
              {NAV_LINKS.map((link) => (
                <li key={`mobile-${link.href}-${link.label}`} role="none">
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-low)] transition-colors"
                    role="menuitem"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="px-4 pt-3 flex flex-col gap-2">
                <Link href="/auth/signin" className="btn-ghost text-sm w-full text-center py-2.5">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm w-full text-center py-2.5">
                  Post a Review
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
