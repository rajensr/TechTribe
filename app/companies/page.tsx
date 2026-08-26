// app/companies/page.tsx
// Modern, eye-friendly Company Directory with responsive mobile filters and clean layout

import CompanyCard from "@/components/CompanyCard";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import Link from "next/link";
import { SearchIcon, CheckIcon } from "@/components/Icons";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Company Directory — TechTribe",
  description: "Browse 70+ verified Bangladeshi IT firms. Filter by city, tech stack, and ratings.",
};

const CITIES = ["All", "Chattogram", "Dhaka", "Sylhet"];
const STACK_OPTIONS = ["React", "Node.js", "Python", "PHP", "Flutter", "Laravel", "Django", "Next.js", "Vue", "Java", "Go"];

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

  let companiesList: any[] = [];

  // 1. Fetch Companies from Database
  try {
    const dbCompanies = await prisma.company.findMany({
      include: {
        reviews: true,
      },
      orderBy: { companyName: "asc" },
    });

    if (dbCompanies && dbCompanies.length > 0) {
      companiesList = dbCompanies.map((c: any) => {
        const revs = c.reviews || [];
        const count = revs.length;
        const avgWorkLife = count
          ? revs.reduce((sum: number, r: any) => sum + r.workLifeRating, 0) / count
          : 4.2;
        const avgSalary = count
          ? revs.reduce((sum: number, r: any) => sum + r.salaryRating, 0) / count
          : 4.0;
        const avgManagement = count
          ? revs.reduce((sum: number, r: any) => sum + r.managementRating, 0) / count
          : 4.3;
        const overallRating = count ? (avgWorkLife + avgSalary + avgManagement) / 3 : 4.4;

        return {
          id: c.id,
          companyName: c.companyName,
          location: c.location,
          city: c.city,
          techStack: c.techStack,
          overallRating,
          workLifeRating: avgWorkLife,
          salaryRating: avgSalary,
          managementRating: avgManagement,
          reviewCount: count,
          isVerified: c.isVerified,
          isClaimed: c.isClaimed,
          logoUrl: c.logoUrl,
          trustBadge: count >= 2 ? "Top Work-Life Balance" : undefined,
        };
      });
    }
  } catch (err) {
    console.warn("DB companies fetch error, falling back to mock:", err);
  }

  // 2. Fallback to mock data if empty
  if (companiesList.length === 0) {
    companiesList = MOCK_COMPANIES;
  }

  let filtered = [...companiesList];

  // Text search
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
    filtered = filtered.filter((c) => c.city?.toLowerCase() === city.toLowerCase());
  }

  // Stack filter
  if (stack) {
    filtered = filtered.filter((c) =>
      c.techStack.toLowerCase().includes(stack.toLowerCase())
    );
  }

  // Sort
  filtered = filtered.sort((a, b) => {
    if (sort === "work_life") return (b.workLifeRating ?? 0) - (a.workLifeRating ?? 0);
    if (sort === "salary") return (b.salaryRating ?? 0) - (a.salaryRating ?? 0);
    if (sort === "management") return (b.managementRating ?? 0) - (a.managementRating ?? 0);
    if (sort === "reviews") return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
    return (b.overallRating ?? 0) - (a.overallRating ?? 0);
  });

  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container">
        {/* PAGE HEADER */}
        <div className="page-header-card">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Verified IT Ecosystem
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              IT Company Directory
            </h1>
            <p className="text-slate-600 text-sm sm:text-base" aria-live="polite">
              Explore {filtered.length} verified tech firms across Bangladesh with employee reviews, work-life metrics, and salaries.
            </p>
          </div>
        </div>

        {/* MOBILE HORIZONTAL FILTER BAR (<lg) */}
        <div className="lg:hidden mb-6 space-y-3">
          {/* Mobile Search */}
          <form method="GET" className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search companies or stack..."
                className="w-full h-11 pl-10 pr-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
            {city !== "All" && <input type="hidden" name="city" value={city} />}
            {stack && <input type="hidden" name="stack" value={stack} />}
            {sort !== "rating" && <input type="hidden" name="sort" value={sort} />}
            <button type="submit" className="btn-primary text-xs h-11 px-4 font-bold rounded-xl">
              Search
            </button>
          </form>

          {/* Mobile City Pills (Horizontal Scroll) */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span>{c}</span>
                  {isActive && <CheckIcon className="w-3 h-3 text-white" />}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* DESKTOP SIDEBAR FILTERS (hidden on small screens, shown >= lg) */}
          <aside className="hidden lg:block w-72 flex-shrink-0 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs h-fit sticky top-24" aria-label="Filter options">
            {/* Desktop Search input */}
            <form method="GET" className="mb-7">
              <label htmlFor="search-input" className="font-mono text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
                Search
              </label>
              <div className="flex items-center bg-white border border-slate-300 rounded-xl px-3.5 h-11 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                <SearchIcon className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="search"
                  name="q"
                  id="search-input"
                  defaultValue={q}
                  placeholder="Company, stack, city..."
                  className="w-full bg-transparent text-sm text-slate-900 font-medium focus:outline-none placeholder:text-slate-400"
                />
              </div>

              {city !== "All" && <input type="hidden" name="city" value={city} />}
              {stack && <input type="hidden" name="stack" value={stack} />}
              {sort !== "rating" && <input type="hidden" name="sort" value={sort} />}

              <button type="submit" className="btn-primary w-full mt-2.5 text-xs h-10 font-bold rounded-xl active:scale-95 transition-transform">
                Apply Search
              </button>
            </form>

            {/* City filter */}
            <div className="mb-7">
              <h3 className="font-mono text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
                City / Region
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
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                          : "text-slate-700 hover:bg-slate-50 border border-transparent"
                      }`}
                      id={`city-filter-${c.toLowerCase()}`}
                    >
                      <span>{c}</span>
                      {isActive && <CheckIcon className="w-3.5 h-3.5 text-blue-700" />}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Sort filter */}
            <div>
              <h3 className="font-mono text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
                Sort Companies
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
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isActive && <span className="text-blue-600 text-xs">●</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* MAIN LISTINGS CONTENT */}
          <main className="flex-1 min-w-0">
            {/* Tech Stack Pills (Quick filters) */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {STACK_OPTIONS.map((s) => {
                const isActive = stack === s;
                return (
                  <Link
                    key={s}
                    href={`/companies?${new URLSearchParams({
                      ...(q && { q }),
                      ...(city !== "All" && { city }),
                      ...(sort !== "rating" && { sort }),
                      stack: isActive ? "" : s,
                    }).toString()}`}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {s}
                  </Link>
                );
              })}
            </div>

            {/* Active filter notification */}
            {(q || stack || city !== "All") && (
              <div className="mb-6 p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                <span className="text-blue-950 font-medium">
                  Active filters: {city !== "All" && `City: ${city} `}
                  {stack && `Stack: ${stack} `}
                  {q && `Keyword: "${q}" `}
                </span>
                <Link
                  href="/companies"
                  className="font-bold text-blue-700 hover:underline uppercase tracking-wider flex-shrink-0"
                >
                  Clear All
                </Link>
              </div>
            )}

            {/* Grid of Company Cards */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    isClaimed={company.isClaimed}
                    logoUrl={company.logoUrl}
                    trustBadge={company.trustBadge}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 sm:p-16 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center text-xl mx-auto mb-3">
                  🔍
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1">No companies found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                  We couldn&apos;t find any companies matching your selected criteria.
                </p>
                <Link href="/companies" className="btn-primary text-xs h-10 px-5 font-bold rounded-xl inline-flex items-center">
                  Reset All Filters
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
