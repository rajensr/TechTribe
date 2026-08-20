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
      {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
      {/* Full-width hero — search bar + popular stacks */}
      <section
        className="pt-40 pb-20 bg-[var(--background)] text-center flex flex-col items-center justify-center relative z-10"
        aria-label="Search hero"
      >
        <div className="container flex flex-col items-center">
          {/* Eyebrow label — stitch mockup er "VERIFIED ECOSYSTEM" */}
          <div className="inline-flex items-center gap-1.5 bg-[var(--primary-fixed)] text-[var(--primary)] font-mono text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <span aria-hidden="true">✓</span>
            Verified Ecosystem
          </div>

          {/* Main headline — DESIGN.md: display-lg */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--on-background)] leading-tight tracking-tight mb-4 max-w-3xl">
            Find your next{" "}
            <span className="text-[var(--primary)]">Bangladeshi IT</span>
            <br />
            workplace...
          </h1>

          <p className="text-[var(--on-surface-variant)] text-lg max-w-xl mx-auto mb-10 text-center">
            Access insider company reviews, salary benchmarks, and tech stacks
            from verified professionals across Bangladesh.
          </p>

          {/* ─── SEARCH BAR ──────────────────────────────────────────────── */}
          {/* Real-time search — companies directory e jaabe */}
          <form
            action="/companies"
            method="GET"
            className="flex flex-col sm:flex-row items-center w-full max-w-xl mx-auto gap-2 mb-6"
            role="search"
          >
            <div className="flex-1 w-full relative">
              {/* Search icon */}
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]"
                aria-hidden="true"
              >
                🔍
              </span>
              <input
                type="search"
                name="q"
                placeholder="Search by name, stack, or location..."
                className="input pl-10 h-12 text-sm w-full"
                aria-label="Search companies"
                id="hero-search-input"
              />
            </div>
            <button
              type="submit"
              className="btn-primary h-12 px-6 whitespace-nowrap w-full sm:w-auto"
              id="hero-search-btn"
            >
              Search
            </button>
          </form>

          {/* ─── POPULAR STACKS ──────────────────────────────────────────── */}
          {/* Quick filter chips — click hole directory filter kore dekhabe */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
            <span className="font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-widest mr-1">
              Popular Stacks:
            </span>
            {POPULAR_STACKS.map((stack) => (
              <Link
                key={stack}
                href={`/companies?stack=${encodeURIComponent(stack)}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                  stack === "Node.js"
                    ? "bg-[var(--primary-fixed)] border-[var(--primary)] text-[var(--primary)] font-semibold"
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

          {/* 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <Link href="/companies?sort=work_life" className="btn-secondary text-sm">
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
      {/* "Is your workplace hiring?" — dark blue banner, stitch mockup */}
      <section
        className="py-16 bg-[var(--primary)]"
        aria-labelledby="cta-heading"
      >
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white max-w-lg">
              <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold mb-3">
                Is your workplace hiring?
              </h2>
              <p className="text-[var(--on-primary-container)] text-sm leading-relaxed">
                Contribute to the ecosystem by sharing your experience and helping
                peers find great workplaces. All reviews are anonymous and verified
                by our system.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              {/* Write a review */}
              <Link
                href="/auth/register"
                className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-[var(--primary)] px-6 py-3"
                id="cta-write-review-btn"
              >
                Write a Review
              </Link>
              {/* Claim company profile */}
              <Link
                href="/employer"
                className="btn-primary bg-white text-[var(--primary)] hover:bg-[var(--primary-fixed)] px-6 py-3"
                id="cta-claim-company-btn"
              >
                Claim Company Profile
              </Link>
            </div>

            {/* Decorative icon */}
            <div
              className="text-white/20 text-8xl hidden lg:block select-none"
              aria-hidden="true"
            >
              ✍
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
