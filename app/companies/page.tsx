// app/companies/page.tsx
// Company Directory page — search, filter by city + stack + rating
// SSR: searchParams theke query parameter read kore filter apply korbe

import CompanyCard from "@/components/CompanyCard";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import Link from "next/link";

// Metadata for SEO
export const metadata = {
  title: "Company Directory — TechTribe",
  description: "Browse 60+ verified Bangladeshi IT firms. Filter by city, tech stack, and ratings.",
};

// Available cities — filter er jonno
const CITIES = ["All", "Chattogram", "Dhaka", "Sylhet"];

// Stack options — filter chips
const STACK_OPTIONS = ["React", "Node.js", "Python", "PHP", "Flutter", "Laravel", "Django", "Next.js", "Vue", "Java", "Go"];

// Sort options
const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "work_life", label: "Work-Life Balance" },
  { value: "salary", label: "Salary & Benefits" },
  { value: "management", label: "Management" },
  { value: "reviews", label: "Most Reviewed" },
];

interface PageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
    stack?: string;
    sort?: string;
  }>;
}

export default async function CompaniesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const { q = "", city = "All", stack = "", sort = "rating" } = resolvedSearchParams || {};

  // ─── CLIENT-SIDE FILTER LOGIC ────────────────────────────────────────────
  // Backend wire-up korar somoy ekhane API call hobe
  // Ekhane search/filter apply kora hocche
  let filtered = MOCK_COMPANIES;

  // Text search — name e match
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.companyName.toLowerCase().includes(lower) ||
        c.location.toLowerCase().includes(lower) ||
        c.techStack.toLowerCase().includes(lower)
    );
  }

  // City filter
  if (city && city !== "All") {
    filtered = filtered.filter((c) => c.city === city);
  }

  // Stack filter — tech stack string contains check
  if (stack) {
    filtered = filtered.filter((c) =>
      c.techStack.toLowerCase().includes(stack.toLowerCase())
    );
  }

  // Sort kora
  filtered = [...filtered].sort((a, b) => {
    if (sort === "work_life") return (b.workLifeRating ?? 0) - (a.workLifeRating ?? 0);
    if (sort === "salary") return (b.salaryRating ?? 0) - (a.salaryRating ?? 0);
    if (sort === "management") return (b.managementRating ?? 0) - (a.managementRating ?? 0);
    if (sort === "reviews") return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
    return (b.overallRating ?? 0) - (a.overallRating ?? 0); // default: highest rated
  });

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[var(--background)]">
      <div className="container">
        {/* ─── PAGE HEADER ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--on-background)] mb-1">
            IT Company Directory
          </h1>
          <p className="text-[var(--on-surface-variant)] text-sm" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "company" : "companies"} found across Bangladesh
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── SIDEBAR FILTERS ─────────────────────────────────────────── */}
          <aside className="w-full lg:w-64 flex-shrink-0" aria-label="Filter options">
            {/* Search input */}
            <form method="GET" className="mb-6">
              <label htmlFor="search-input" className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-2">
                Search Companies
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] text-sm pointer-events-none" aria-hidden="true">
                  🔍
                </span>
                <input
                  type="search"
                  name="q"
                  id="search-input"
                  defaultValue={q}
                  placeholder="Company, stack, location..."
                  className="input pl-10 text-sm h-10"
                />
              </div>

              {/* Hidden fields — existing filters preserve kora */}
              {city !== "All" && <input type="hidden" name="city" value={city} />}
              {stack && <input type="hidden" name="stack" value={stack} />}
              {sort !== "rating" && <input type="hidden" name="sort" value={sort} />}

              <button type="submit" className="btn-primary w-full mt-3 text-sm h-10 font-semibold">
                Search
              </button>
            </form>

            {/* City filter */}
            <div className="mb-6">
              <h3 className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest mb-3">
                City
              </h3>
              <div className="flex flex-col gap-1.5">
                {CITIES.map((c) => {
                  const isActive = city === c || (c === "All" && (!city || city === "All"));
                  return (
                    <Link
                      key={c}
                      href={`/companies?${new URLSearchParams({
                        ...(q && { q }),
                        city: c,
                        ...(stack && { stack }),
                        ...(sort !== "rating" && { sort }),
                      }).toString()}`}
                      className={`px-3.5 py-2.5 min-h-[44px] sm:min-h-0 rounded text-sm transition-all flex items-center justify-between ${
                        isActive
                          ? "bg-[var(--primary)] text-white font-semibold shadow-xs"
                          : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]"
                      }`}
                      id={`city-filter-${c.toLowerCase()}`}
                    >
                      <span>{c}</span>
                      {isActive && <span className="text-xs">✓</span>}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Sort filter */}
            <div className="mb-6">
              <h3 className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest mb-3">
                Sort By
              </h3>
              <div className="flex flex-col gap-1.5">
                {SORT_OPTIONS.map((opt) => {
                  const isActive = sort === opt.value;
                  return (
                    <Link
                      key={opt.value}
                      href={`/companies?${new URLSearchParams({
                        ...(q && { q }),
                        ...(city !== "All" && { city }),
                        ...(stack && { stack }),
                        sort: opt.value,
                      }).toString()}`}
                      className={`px-3.5 py-2.5 min-h-[44px] sm:min-h-0 rounded text-sm transition-all flex items-center justify-between ${
                        isActive
                          ? "bg-[var(--primary)] text-white font-semibold shadow-xs"
                          : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]"
                      }`}
                      id={`sort-filter-${opt.value}`}
                    >
                      <span>{opt.label}</span>
                      {isActive && <span className="text-xs">✓</span>}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tech stack chips */}
            <div>
              <h3 className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest mb-3">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {STACK_OPTIONS.map((s) => {
                  const isActive = stack === s;
                  return (
                    <Link
                      key={s}
                      href={`/companies?${new URLSearchParams({
                        ...(q && { q }),
                        ...(city !== "All" && { city }),
                        stack: isActive ? "" : s, // toggle
                        ...(sort !== "rating" && { sort }),
                      }).toString()}`}
                      className={`px-3 py-2 min-h-[40px] sm:min-h-0 rounded-full text-xs font-semibold border transition-all inline-flex items-center gap-1 ${
                        isActive
                          ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs"
                          : "bg-white border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      }`}
                      id={`stack-filter-${s.toLowerCase().replace(".", "-")}`}
                    >
                      <span>{s}</span> {isActive && <span>✕</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ─── COMPANY GRID ─────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              // No results state
              <div className="text-center py-20">
                <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
                <h2 className="text-xl font-semibold text-[var(--on-surface)] mb-2">
                  No companies found
                </h2>
                <p className="text-[var(--on-surface-variant)] text-sm mb-6">
                  Try adjusting your search or filters.
                </p>
                <Link href="/companies" className="btn-secondary text-sm">
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((company) => (
                  <CompanyCard
                    key={company.id}
                    id={company.id}
                    companyName={company.companyName}
                    location={company.location}
                    techStack={company.techStack}
                    overallRating={company.overallRating}
                    reviewCount={company.reviewCount}
                    isVerified={company.isVerified}
                    trustBadge={company.trustBadge}
                    logoUrl={company.logoUrl ?? undefined}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
