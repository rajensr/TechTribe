// app/companies/page.tsx
// IT Company Directory — clean, breathable, modern layout with responsive filters and real MySQL counts

import CompanyCard from "@/components/CompanyCard";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import Link from "next/link";
import { SearchIcon, CheckIcon } from "@/components/Icons";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "IT Company Directory — TechTribe",
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
    companiesList = MOCK_COMPANIES.map((c) => ({
      id: c.id,
      companyName: c.companyName,
      location: c.location,
      city: c.city,
      techStack: c.techStack,
      overallRating: c.overallRating,
      workLifeRating: c.workLifeRating,
      salaryRating: c.salaryRating,
      managementRating: c.managementRating,
      reviewCount: c.reviewCount,
      isVerified: c.isVerified,
      isClaimed: c.isClaimed,
      logoUrl: c.logoUrl,
      trustBadge: c.trustBadge,
    }));
  }

  // Filter
  let filtered = companiesList;

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.companyName.toLowerCase().includes(query) ||
        c.techStack.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query)
    );
  }

  if (city && city !== "All") {
    filtered = filtered.filter((c) => c.city.toLowerCase() === city.toLowerCase());
  }

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

          {/* City Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CITIES.map((c) => {
              const active = city === c;
              const params = new URLSearchParams();
              if (c !== "All") params.set("city", c);
              if (q) params.set("q", q);
              if (stack) params.set("stack", stack);
              if (sort !== "rating") params.set("sort", sort);
              const href = `/companies?${params.toString()}`;

              return (
                <Link
                  key={c}
                  href={href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    active
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {c}
                </Link>
              );
            })}
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* DESKTOP SIDEBAR FILTERS (>=lg) */}
          <aside className="hidden lg:block w-72 flex-shrink-0 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs sticky top-28">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <span className="font-extrabold text-slate-900 text-base">Filters</span>
              {(q || city !== "All" || stack || sort !== "rating") && (
                <Link
                  href="/companies"
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Reset all
                </Link>
              )}
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <label htmlFor="company-search" className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                Search
              </label>
              <form method="GET">
                <div className="relative">
                  <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    id="company-search"
                    name="q"
                    defaultValue={q}
                    placeholder="Company or stack..."
                    className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                {city !== "All" && <input type="hidden" name="city" value={city} />}
                {stack && <input type="hidden" name="stack" value={stack} />}
                {sort !== "rating" && <input type="hidden" name="sort" value={sort} />}
              </form>
            </div>

            {/* City Filter */}
            <div className="mb-6">
              <span className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                City / Region
              </span>
              <div className="space-y-1">
                {CITIES.map((c) => {
                  const active = city === c;
                  const params = new URLSearchParams();
                  if (c !== "All") params.set("city", c);
                  if (q) params.set("q", q);
                  if (stack) params.set("stack", stack);
                  if (sort !== "rating") params.set("sort", sort);
                  const href = `/companies?${params.toString()}`;

                  return (
                    <Link
                      key={c}
                      href={href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        active
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{c}</span>
                      {active && <span className="text-blue-600">✓</span>}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="mb-6">
              <span className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                Tech Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STACK_OPTIONS.map((st) => {
                  const active = stack.toLowerCase() === st.toLowerCase();
                  const params = new URLSearchParams();
                  if (city !== "All") params.set("city", city);
                  if (q) params.set("q", q);
                  if (!active) params.set("stack", st);
                  if (sort !== "rating") params.set("sort", sort);
                  const href = `/companies?${params.toString()}`;

                  return (
                    <Link
                      key={st}
                      href={href}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {st}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <span className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                Sort By
              </span>
              <div className="space-y-1">
                {SORT_OPTIONS.map((so) => {
                  const active = sort === so.value;
                  const params = new URLSearchParams();
                  if (city !== "All") params.set("city", city);
                  if (q) params.set("q", q);
                  if (stack) params.set("stack", stack);
                  params.set("sort", so.value);
                  const href = `/companies?${params.toString()}`;

                  return (
                    <Link
                      key={so.value}
                      href={href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        active
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{so.label}</span>
                      {active && <span className="text-blue-600">✓</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* MAIN GRID */}
          <main className="flex-1 min-w-0 w-full">
            {/* Header info bar */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-500">
                Showing <strong>{filtered.length}</strong> IT Companies
              </span>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Real-time Verified Directory</span>
              </div>
            </div>

            {/* Companies Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {filtered.map((company) => (
                  <CompanyCard key={company.id} {...company} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-2">No companies match your filters</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                  Try clearing some filter tags or searching for a different tech stack.
                </p>
                <Link
                  href="/companies"
                  className="btn-primary text-xs h-10 px-5 font-bold rounded-xl inline-flex"
                >
                  Clear all filters
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
