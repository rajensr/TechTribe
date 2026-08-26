"use client";

// app/page.tsx
// TechTribe Homepage — Search Results appear in dedicated section below Hero,
// leaving WLB & Management sections intact with centered subtitles.

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Building2,
  MessageSquare,
  BadgeCheck,
  Star,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  PlusCircle,
} from "lucide-react";

export interface Company {
  id: number | string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  stacks: string[];
  highlightTag: string;
  category: "wlb" | "management" | "both";
  logoBg: string;
  initial: string;
}

// ─── FIXED CURATED COMPANIES FOR HOMEPAGE LEADERBOARDS ─────────────────────────
const WLB_FEATURED_COMPANIES: Company[] = [
  {
    id: 62, // Brain Station 23
    name: "Brain Station 23",
    location: "Mohakhali, Dhaka",
    rating: 4.8,
    reviewCount: 47,
    stacks: ["REACT", "NODE.JS", "AI"],
    highlightTag: "Top 10 Work-Life Balance",
    category: "both",
    logoBg: "bg-indigo-600",
    initial: "B",
  },
  {
    id: 6, // EchoLogyx Ltd
    name: "EchoLogyx Ltd",
    location: "Muradpur, Chattogram",
    rating: 4.6,
    reviewCount: 23,
    stacks: ["REACT", "NODE.JS", "GO"],
    highlightTag: "Remote-First Policy",
    category: "both",
    logoBg: "bg-blue-600",
    initial: "E",
  },
  {
    id: 63, // NewsCred
    name: "NewsCred",
    location: "Gulshan-1, Dhaka",
    rating: 4.6,
    reviewCount: 31,
    stacks: ["RUBY", "REACT", "NODE.JS"],
    highlightTag: "Flexible Hours",
    category: "wlb",
    logoBg: "bg-cyan-600",
    initial: "N",
  },
];

const MANAGEMENT_FEATURED_COMPANIES: Company[] = [
  {
    id: 61, // Kaz Software
    name: "Kaz Software",
    location: "Dhanmondi, Dhaka",
    rating: 4.7,
    reviewCount: 38,
    stacks: ["PYTHON", "DJANGO", "AWS"],
    highlightTag: "Top Mentorship",
    category: "management",
    logoBg: "bg-emerald-600",
    initial: "K",
  },
  {
    id: 70, // AuthLab
    name: "AuthLab",
    location: "Jalalabad R/A, Sylhet",
    rating: 4.5,
    reviewCount: 15,
    stacks: ["NEXT.JS", "TAILWIND", "GO"],
    highlightTag: "Transparent Ops",
    category: "both",
    logoBg: "bg-sky-600",
    initial: "A",
  },
  {
    id: 65, // SSL Wireless
    name: "SSL Wireless",
    location: "New DOHS Mohakhali, Dhaka",
    rating: 4.4,
    reviewCount: 52,
    stacks: ["JAVA", "SPRING", "FLUTTER"],
    highlightTag: "Competitive Pay",
    category: "management",
    logoBg: "bg-slate-700",
    initial: "S",
  },
];

// All searchable companies for real-time live preview
const ALL_SEARCHABLE_COMPANIES: Company[] = [
  ...WLB_FEATURED_COMPANIES,
  ...MANAGEMENT_FEATURED_COMPANIES,
  {
    id: 1,
    name: "Blendin",
    location: "Agrabad, Chittagong",
    rating: 4.3,
    reviewCount: 12,
    stacks: ["REACT", "NODE.JS", "TAILWIND"],
    highlightTag: "Modern Office",
    category: "both",
    logoBg: "bg-purple-600",
    initial: "B",
  },
  {
    id: 2,
    name: "Xponent Infosystem",
    location: "Dewanhat, Chittagong",
    rating: 4.2,
    reviewCount: 8,
    stacks: ["PHP", "LARAVEL", "VUE.JS"],
    highlightTag: "Career Growth",
    category: "both",
    logoBg: "bg-teal-600",
    initial: "X",
  },
  {
    id: 3,
    name: "Softrobotics",
    location: "Panchlaish, Chittagong",
    rating: 4.4,
    reviewCount: 14,
    stacks: ["PYTHON", "ROBOTICS", "C++"],
    highlightTag: "High Innovation",
    category: "both",
    logoBg: "bg-rose-600",
    initial: "S",
  },
];

const TRENDING_STACKS = [
  "All",
  "Node.js",
  "React",
  "Django",
  "Laravel",
  "Vue.js",
  "Flutter",
  "Python",
  "Next.js",
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStack, setSelectedStack] = useState("All");
  const router = useRouter();

  // Search handler that navigates to the directory with search parameters
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedStack !== "All") params.set("stack", selectedStack);
    router.push(`/companies?${params.toString()}`);
  };

  const isFiltering = Boolean(searchQuery.trim() || selectedStack !== "All");

  // Search Results for the Dedicated Search Preview Section only
  const searchResults = useMemo(() => {
    if (!isFiltering) return [];
    return ALL_SEARCHABLE_COMPANIES.filter((company) => {
      const matchesSearch =
        !searchQuery.trim() ||
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.stacks.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStack =
        selectedStack === "All" ||
        company.stacks.some((s) => s.toLowerCase() === selectedStack.toLowerCase());

      return matchesSearch && matchesStack;
    });
  }, [searchQuery, selectedStack, isFiltering]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">

      {/* ─── HERO SECTION ─── */}
      <section className="page-hero bg-slate-50/70 border-b border-slate-200">
        <div className="container flex flex-col items-center text-center">

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Bangladesh&apos;s Verified Tech Community</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-3xl mb-5 text-center">
            Transparent Reviews for <span className="text-blue-600">Bangladeshi Tech</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed mb-8 text-center">
            Explore 70+ verified IT companies across Dhaka, Chattogram &amp; Sylhet. Real culture ratings, work-life balance insights, and calibrated engineering salaries.
          </p>

          {/* Working Search Bar Form */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl mb-7"
          >
            <div className="bg-white border border-slate-300 rounded-2xl p-2 shadow-sm hover:border-blue-500 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center flex-1 pl-3 pr-2 py-1">
                <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by company name, stack, or city..."
                  className="w-full h-10 sm:h-11 bg-transparent text-sm font-medium text-slate-900 focus:outline-none placeholder:text-slate-400"
                  aria-label="Search companies"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-7 rounded-xl text-sm font-bold active:scale-95 transition-all w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2"
              >
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
              Popular:
            </span>
            {TRENDING_STACKS.map((stack) => {
              const isActive = selectedStack === stack;
              return (
                <button
                  key={stack}
                  type="button"
                  onClick={() => setSelectedStack(stack)}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-95 ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {stack}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── DEDICATED SEARCH RESULTS SECTION (Only appears when user searches/filters) ─── */}
      {isFiltering && (
        <section className="py-12 bg-blue-50/50 border-b border-blue-200">
          <div className="container">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Search Results ({searchResults.length})
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  {searchQuery && `Matching "${searchQuery}" `}
                  {selectedStack !== "All" && `in ${selectedStack}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/companies?${new URLSearchParams({
                    ...(searchQuery && { q: searchQuery }),
                    ...(selectedStack !== "All" && { stack: selectedStack }),
                  }).toString()}`}
                  className="text-xs font-bold text-blue-700 bg-white px-4 py-2 rounded-xl border border-blue-300 hover:bg-blue-50 shadow-2xs"
                >
                  View Full Directory →
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStack("All");
                  }}
                  className="text-xs font-bold text-slate-500 hover:underline uppercase tracking-wide"
                >
                  Clear
                </button>
              </div>
            </div>

            {searchResults.length > 0 ? (
              <div className="card-grid">
                {searchResults.map((company) => (
                  <CompanyCardItem key={company.id} company={company} />
                ))}
              </div>
            ) : (
              /* If company does not exist — Add Company CTA */
              <div className="bg-white border border-blue-200 rounded-3xl p-8 sm:p-12 text-center shadow-xs max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
                  Company not listed yet?
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  We couldn&apos;t find &ldquo;{searchQuery || selectedStack}&rdquo; in our current index. You can add this workplace or submit an anonymous review to create its profile!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/employer"
                    className="btn-primary text-xs h-11 px-6 font-bold rounded-xl w-full sm:w-auto inline-flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add / Claim Company</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-secondary text-xs h-11 px-6 font-bold rounded-xl w-full sm:w-auto inline-flex items-center justify-center"
                  >
                    Write Anonymous Review
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── STATS STRIP ─── */}
      <section className="page-stats bg-white border-b border-slate-200">
        <div className="container">
          <div className="stats-grid">
            {[
              { label: "Verified IT Firms", value: "70+", icon: Building2 },
              { label: "Employee Reviews", value: "1,200+", icon: MessageSquare },
              { label: "Avg Engineer Salary", value: "৳85k/mo", icon: Briefcase },
              { label: "Salary Transparency", value: "100%", icon: ShieldCheck },
            ].map((metric) => {
              const IconComp = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="border border-slate-200 rounded-2xl flex flex-col items-center text-center hover:border-blue-500 hover:shadow-xs transition-all p-6 sm:p-8"
                >
                  <div className="rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center w-12 h-12 mb-3">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums mb-1">{metric.value}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider leading-tight">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FIXED CURATED COMPANY SECTIONS ─── */}
      <div className="container">

        {/* ── Section 1: Top-Rated Workplaces for Work-Life Balance ── */}
        <section className="page-section">
          <div className="section-header text-center flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3 text-center">
              Top-Rated Workplaces for Work-Life Balance
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed mb-6 text-center">
              Ranked by verified Bangladeshi software engineers and tech professionals.
            </p>
            <Link
              href="/companies?sort=work_life"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-full border border-blue-200 transition-colors group"
            >
              Explore All Work-Life Balance Firms
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="card-grid">
            {WLB_FEATURED_COMPANIES.map((company) => (
              <CompanyCardItem key={company.id} company={company} />
            ))}
          </div>
        </section>

        <hr className="border-slate-200 my-2" />

        {/* ── Section 2: Highest Rated Management Teams ── */}
        <section className="page-section">
          <div className="section-header text-center flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3 text-center">
              Highest Rated Management Teams
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed mb-6 text-center">
              Evaluated on leadership transparency, mentorship, and career growth.
            </p>
            <Link
              href="/companies?sort=management"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-full border border-blue-200 transition-colors group"
            >
              Explore Top Management Teams
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="card-grid">
            {MANAGEMENT_FEATURED_COMPANIES.map((company) => (
              <CompanyCardItem key={company.id} company={company} />
            ))}
          </div>
        </section>

      </div>

      {/* ─── CTA BANNER ─── */}
      <section className="page-cta bg-slate-50 border-t border-slate-200">
        <div className="container">
          <div className="bg-blue-600 rounded-3xl text-white shadow-lg flex flex-col items-center text-center p-8 sm:p-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Is your workplace hiring?
            </h2>
            <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              Share your experience anonymously or explore companies across Bangladesh.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link
                href="/companies"
                className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-8 rounded-xl font-bold text-sm shadow-sm inline-flex items-center justify-center active:scale-95 transition-all"
              >
                Browse All Companies
              </Link>
              <Link
                href="/jobs"
                className="border-2 border-white/80 hover:bg-white/10 text-white h-12 px-8 rounded-xl font-bold text-sm inline-flex items-center justify-center active:scale-95 transition-all"
              >
                Browse Job Board
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// ─── HOMEPAGE COMPANY CARD ITEM COMPONENT ────────────────────────────────────

function CompanyCardItem({ company }: { company: Company }) {
  return (
    <Link
      href={`/companies/${company.id}`}
      className="group bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-6 sm:p-7 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
    >
      <div>
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-12 h-12 rounded-xl ${company.logoBg} text-white font-bold flex items-center justify-center shadow-2xs flex-shrink-0`}
            >
              {company.initial}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors truncate">
                  {company.name}
                </h3>
                <BadgeCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{company.location}</span>
              </p>
            </div>
          </div>

          <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 flex-shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{company.rating.toFixed(1)}</span>
          </span>
        </div>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {company.stacks.map((stack) => (
            <span
              key={stack}
              className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              {stack}
            </span>
          ))}
        </div>

        {/* Culture Highlight Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>{company.highlightTag}</span>
        </div>
      </div>

      {/* Footer Row */}
      <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 tabular-nums">
          {company.reviewCount} verified reviews
        </span>

        <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>Explore Team</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
