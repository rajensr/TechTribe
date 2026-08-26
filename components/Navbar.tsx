"use client";
// components/Navbar.tsx
// Navigation bar supporting 3 User Personas:
// 1. General Member (reviews & exploration)
// 2. Employer / Company Manager (post jobs & manage workplace)
// 3. Super Admin (platform administration & claims)

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
  { href: "/companies", label: "Companies" },
  { href: "/jobs", label: "Jobs" },
  { href: "/salaries", label: "Salaries" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const userRole = String((session?.user as { role?: string })?.role || "").toUpperCase();
  const isAdmin = userRole === "ADMIN";
  const isEmployer = userRole === "EMPLOYER";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="container">
        <nav
          className="flex items-center justify-between h-20"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="TechTribe home"
          >
            <div className="w-9.5 h-9.5 bg-[var(--primary)] rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-xs">
              <span className="text-white font-bold text-sm font-mono tracking-tighter">TT</span>
            </div>
            <span
              className="text-[var(--primary)] font-bold text-xl leading-none"
              style={{ fontFamily: "var(--font-geist, system-ui)" }}
            >
              TechTribe
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 relative ${
                      isActive
                        ? "text-[var(--primary)] font-bold"
                        : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Direct Link to Admin Panel for Super Admin */}
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    pathname.startsWith("/admin")
                      ? "bg-red-600 text-white shadow-xs"
                      : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                  }`}
                >
                  🛡️ Admin Panel
                </Link>
              </li>
            )}
          </ul>

          {/* Desktop Auth State */}
          <div className="hidden md:flex items-center gap-3">
            {status === "authenticated" && session?.user ? (
              <>
                <Link
                  href={isAdmin ? "/admin" : isEmployer ? "/employer" : "/dashboard"}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  <div className={`w-6 h-6 rounded-full text-white font-mono text-[10px] flex items-center justify-center ${
                    isAdmin ? "bg-red-600" : isEmployer ? "bg-purple-600" : "bg-blue-600"
                  }`}>
                    {session.user.name?.charAt(0).toUpperCase() || (isAdmin ? "A" : "U")}
                  </div>
                  <span className="max-w-[120px] truncate">{session.user.name || session.user.email}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn-ghost text-xs h-10 px-3 font-semibold text-slate-600 hover:text-red-600"
                >
                  Sign Out
                </button>

                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="h-10 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl active:scale-95 transition-all inline-flex items-center justify-center shadow-xs"
                  >
                    Admin Portal
                  </Link>
                ) : isEmployer ? (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/employer"
                      className="h-10 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl active:scale-95 transition-all inline-flex items-center justify-center"
                    >
                      Portal
                    </Link>
                    <Link
                      href="/employer/post-job"
                      className="h-10 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl active:scale-95 transition-all inline-flex items-center justify-center shadow-xs"
                      id="nav-post-job-btn"
                    >
                      + Post a Job
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/companies"
                    className="h-10 px-5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl active:scale-95 transition-all inline-flex items-center justify-center shadow-xs"
                    id="nav-post-review-btn"
                  >
                    Post a Review
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="btn-ghost text-sm h-11 px-5 font-semibold text-slate-700 hover:text-slate-900"
                  id="nav-signin-btn"
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/signin?callbackUrl=/companies"
                  className="h-11 px-6 text-sm font-bold text-[var(--primary)] border-1.5 border-[var(--primary)] rounded-xl hover:bg-blue-50/80 active:scale-95 transition-all inline-flex items-center justify-center"
                  id="nav-post-review-btn"
                >
                  Post a Review
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            id="mobile-menu-toggle"
          >
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

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-[12px] pb-4 animate-fade-in"
            role="menu"
          >
            <ul className="flex flex-col pt-2" role="list">
              {NAV_LINKS.map((link) => (
                <li key={`mobile-${link.href}-${link.label}`} role="none">
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                    role="menuitem"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {isAdmin && (
                <li role="none">
                  <Link
                    href="/admin"
                    className="block px-4 py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    role="menuitem"
                  >
                    🛡️ Admin Panel
                  </Link>
                </li>
              )}

              {status === "authenticated" && session?.user ? (
                <li className="px-4 pt-3 flex flex-col gap-2">
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Role: <strong>{userRole}</strong></span>
                  </div>
                  {isAdmin ? (
                    <Link href="/admin" className="bg-red-600 text-white font-bold text-xs w-full text-center py-2.5 rounded-xl">
                      Open Admin Panel
                    </Link>
                  ) : isEmployer ? (
                    <div className="flex flex-col gap-2 w-full">
                      <Link href="/employer/post-job" className="btn-primary text-xs w-full text-center py-2.5">
                        + Post a Job
                      </Link>
                      <Link href="/employer" className="btn-ghost text-xs w-full text-center py-2.5 bg-slate-100 font-bold">
                        Employer Portal
                      </Link>
                    </div>
                  ) : (
                    <Link href="/companies" className="btn-primary text-xs w-full text-center py-2.5">
                      Explore &amp; Post Review
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="btn-ghost text-xs w-full text-center py-2 text-red-600 font-bold"
                  >
                    Sign Out
                  </button>
                </li>
              ) : (
                <li className="px-4 pt-3 flex flex-col gap-2">
                  <Link href="/auth/signin" className="btn-ghost text-sm w-full text-center py-2.5">
                    Sign In
                  </Link>
                  <Link href="/auth/signin?callbackUrl=/companies" className="btn-primary text-sm w-full text-center py-2.5">
                    Sign In to Post Review
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
