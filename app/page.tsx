// app/page.tsx
// Landing page — TechTribe er home, stitch mockup er exact match
// Sections: Hero search, Popular stacks, Top-Rated Workplaces, Highest Rated Management, CTA

import Link from "next/link";
import CompanyCard from "@/components/CompanyCard";
import { MOCK_COMPANIES } from "@/lib/mock-data";

// Popular stack tags — hero section e show hobe
const POPULAR_STACKS = ["Node.js", "Laravel", "React", "Django", "Vue", "Flutter", "Python", "Next.js"];

// Top companies — work-life rating anuzaayi sort kora
const TOP_WORKLIFE = MOCK_COMPANIES
  .filter((c) => c.overallRating !== undefined && c.reviewCount >= 3)
  .sort((a, b) => (b.workLifeRating ?? 0) - (a.workLifeRating ?? 0))
  .slice(0, 3);

// Highest management rated — management rating sort
const TOP_MANAGEMENT = MOCK_COMPANIES
  .filter((c) => c.overallRating !== undefined && c.reviewCount >= 3)
  .sort((a, b) => (b.managementRating ?? 0) - (a.managementRating ?? 0))
  .slice(0, 4);

export const metadata = {
  title: "TechTribe — Bangladesh's IT Workplace Directory",
  description:
    "Find verified employee reviews, salary benchmarks, and job listings from top Bangladeshi IT firms.",
};

export default function HomePage() {
  return (
    <>
      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      {/* Full-width hero — search bar + popular stacks with header clearance */}
      <section
        className="pt-36 sm:pt-40 md:pt-48 pb-20 bg-[var(--background)] text-center flex flex-col items-center justify-center relative z-10"
        aria-label="Search hero"
      >
        <div className="container flex flex-col items-center">
          {/* Eyebrow label — stitch mockup er "VERIFIED ECOSYSTEM" */}
          <div className="inline-flex items-center gap-1.5 bg-[var(--primary-fixed)] text-[var(--primary)] font-mono text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <span aria-hidden="true">✓</span>
            Verified Ecosystem
          </div>

          {/* Main headline — responsive scaling for mobile, tablet, and desktop */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--on-background)] leading-tight tracking-tight mb-4 max-w-3xl px-2">
            Find your next{" "}
            <span className="text-[var(--primary)]">Bangladeshi IT</span>
            <br className="hidden sm:inline" />
            {" "}workplace...
          </h1>

          <p className="text-[var(--on-surface-variant)] text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 text-center px-4">
            Access insider company reviews, salary benchmarks, and tech stacks
            from verified professionals across Bangladesh.
          </p>

          {/* ─── SEARCH BAR ──────────────────────────────────────────────── */}
          {/* Real-time search — companies directory e jaabe */}
          <form
            action="/companies"
            method="GET"
            className="flex flex-col sm:flex-row items-center w-full max-w-xl mx-auto gap-3 mb-6 px-4"
            role="search"
          >
            <div className="flex-1 w-full relative">
              {/* Search icon */}
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] text-base pointer-events-none"
                aria-hidden="true"
              >
                🔍
              </span>
              <input
                type="search"
                name="q"
                placeholder="Search by name, stack, or location..."
                className="input pl-11 h-12 text-sm w-full shadow-xs"
                aria-label="Search companies"
                id="hero-search-input"
              />
            </div>
            <button
              type="submit"
              className="btn-primary h-12 px-6 whitespace-nowrap w-full sm:w-auto text-sm font-semibold active:scale-95 transition-transform duration-150"
              id="hero-search-btn"
            >
              Search
            </button>
          </form>

          {/* ─── POPULAR STACKS ──────────────────────────────────────────── */}
          {/* Quick filter chips — 40px touch targets for mobile accessibility */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl px-2">
            <span className="font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-widest mr-1">
              Popular Stacks:
            </span>
            {POPULAR_STACKS.map((stack) => (
              <Link
                key={stack}
                href={`/companies?stack=${encodeURIComponent(stack)}`}
                className={`px-3.5 py-2 min-h-[40px] sm:min-h-0 inline-flex items-center justify-center rounded-full text-xs font-semibold border transition-all duration-150 ${
                  stack === "Node.js"
                    ? "bg-[var(--primary-fixed)] border-[var(--primary)] text-[var(--primary)] font-bold shadow-xs"
                    : "bg-white border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-fixed)]"
                }`}
                id={`stack-chip-${stack.toLowerCase().replace(".", "-")}`}
              >
                {stack}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TOP-RATED WORK-LIFE SECTION ──────────────────────────────────── */}
      {/* 3-column card grid — stitch mockup match */}
      <section className="section bg-[var(--surface-low)]" aria-labelledby="worklife-heading">
        <div className="container">
          {/* Section header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2
                id="worklife-heading"
                className="text-2xl md:text-3xl font-semibold text-[var(--on-background)] mb-1"
              >
                Top-Rated Workplaces for Work-Life Balance
              </h2>
              <p className="text-[var(--on-surface-variant)] text-sm">
                Based on thousands of verified employee reviews from across Bangladesh.
              </p>
            </div>
            <Link
              href="/companies?sort=work_life"
              className="btn-ghost text-sm hidden md:flex items-center gap-1"
            >
              View All →
            </Link>
          </div>

          {/* 3-column responsive grid with mobile horizontal swipe fallback */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
            {TOP_WORKLIFE.map((company) => (
              <CompanyCard
                key={company.id}
                id={company.id}
                companyName={company.companyName}
                location={company.location}
                techStack={company.techStack}
                overallRating={company.workLifeRating}
                reviewCount={company.reviewCount}
                isVerified={company.isVerified}
                trustBadge={company.trustBadge}
                logoUrl={company.logoUrl ?? undefined}
              />
            ))}
          </div>

          {/* Mobile — view all link */}
          <div className="text-center mt-6 md:hidden">
            <Link href="/companies?sort=work_life" className="btn-secondary text-sm active:scale-95 transition-transform">
              View All →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HIGHEST RATED MANAGEMENT ─────────────────────────────────────── */}
      {/* 4-column compact cards */}
      <section className="section" aria-labelledby="management-heading">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2
                id="management-heading"
                className="text-2xl md:text-3xl font-semibold text-[var(--on-background)] mb-1"
              >
                Highest Rated Management Teams
              </h2>
              <p className="text-[var(--on-surface-variant)] text-sm">
                Leadership excellence and professional development focus.
              </p>
            </div>
            <Link
              href="/companies?sort=management"
              className="btn-ghost text-sm hidden md:flex items-center gap-1"
            >
              View All →
            </Link>
          </div>

          {/* 4-column compact grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOP_MANAGEMENT.map((company) => (
              <CompanyCard
                key={company.id}
                id={company.id}
                companyName={company.companyName}
                location={company.location}
                techStack={company.techStack}
                overallRating={company.managementRating}
                reviewCount={company.reviewCount}
                isVerified={company.isVerified}
                trustBadge={company.trustBadge}
                logoUrl={company.logoUrl ?? undefined}
                size="sm"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────────────────────── */}
      {/* "Is your workplace hiring?" — high contrast card banner */}
      <section
        className="py-16 md:py-20 bg-[var(--primary)] text-white relative overflow-hidden"
        aria-labelledby="cta-heading"
      >
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/20 shadow-xl">
            <div className="text-white max-w-xl text-center md:text-left">
              <h2 id="cta-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight drop-shadow-xs">
                Is your workplace hiring?
              </h2>
              <p className="text-blue-100 text-base sm:text-lg leading-relaxed font-normal">
                Contribute to the ecosystem by sharing your experience and helping
                peers find great workplaces. All reviews are anonymous and verified
                by our system.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-shrink-0">
              {/* Write a review — Solid White button with dark blue bold text (High Contrast) */}
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white text-[var(--primary)] font-extrabold text-base shadow-lg hover:bg-slate-100 transition-all duration-200 active:scale-95 cursor-pointer no-underline"
                id="cta-write-review-btn"
              >
                ✍ Write a Review
              </Link>
              {/* Claim company profile — High contrast dark navy button with white text */}
              <Link
                href="/employer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#001452] text-white hover:bg-[#001d78] border-2 border-white/40 font-bold text-base shadow-md transition-all duration-200 active:scale-95 cursor-pointer no-underline"
                id="cta-claim-company-btn"
              >
                🏢 Claim Company Profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
