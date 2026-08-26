// app/salaries/page.tsx
// Salary Benchmarks page — aggregated salary data from reviews
// BDT format, role-wise breakdown

import { MOCK_SALARY_BENCHMARKS } from "@/lib/mock-data";
import Link from "next/link";
import { MoneyIcon, ShieldIcon } from "@/components/Icons";

export const metadata = {
  title: "IT Salary Benchmarks in Bangladesh — TechTribe",
  description: "Compare software developer salaries across Bangladesh. Data sourced from verified anonymous employee reviews.",
};

// BDT format helper
function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

// City filter options
const CITIES = ["All", "Chattogram", "Dhaka", "Sylhet"];

interface PageProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function SalariesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const { city = "All" } = resolvedSearchParams || {};

  // City filter apply kora
  const benchmarks = city === "All"
    ? MOCK_SALARY_BENCHMARKS
    : MOCK_SALARY_BENCHMARKS.filter((b) => b.city === city);

  // Sort by avg max salary — highest paying role prothome
  const sorted = [...benchmarks].sort((a, b) => b.avgMax - a.avgMax);

  // Overall stats
  const totalSamples = benchmarks.reduce((s, b) => s + b.sampleCount, 0);
  const overallAvg = benchmarks.length
    ? Math.round(benchmarks.reduce((s, b) => s + (b.avgMin + b.avgMax) / 2, 0) / benchmarks.length)
    : 0;

  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container">
        {/* ─── HEADER CARD ─────────────────────────────────────────────── */}
        <div className="page-header-card">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4">
            <MoneyIcon className="w-4 h-4 text-blue-700" />
            <span>Verified Review Data</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            IT Salary Benchmarks
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Aggregated from {totalSamples.toLocaleString()} verified anonymous employee reviews across Bangladesh.
          </p>
        </div>

        {/* ─── STATS ROW ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Samples", value: totalSamples.toLocaleString() },
            { label: "Avg Mid-Level", value: formatBDT(overallAvg) },
            { label: "Roles Tracked", value: benchmarks.length.toString() },
            { label: "Cities Covered", value: "3" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border-1.5 border-slate-300 p-6 rounded-2xl shadow-2xs text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums mb-1">{value}</div>
              <div className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ─── CITY FILTER ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CITIES.map((c) => (
            <Link
              key={c}
              href={`/salaries?city=${c}`}
              className={`px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-full text-xs font-semibold border transition-all inline-flex items-center active:scale-95 ${
                city === c || (c === "All" && !city)
                  ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs"
                  : "bg-white border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              }`}
              id={`salary-city-${c.toLowerCase()}`}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* ─── SALARY TABLE ────────────────────────────────────────────── */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[650px]">
              {/* Table header */}
              <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-[var(--surface-low)] border-b border-[var(--outline-variant)]">
                {["Role", "Min Salary", "Max Salary", "City", "Data Points"].map((col) => (
                  <div key={col} className="font-mono text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wider">
                    {col}
                  </div>
                ))}
              </div>

              {/* Table rows */}
              {sorted.map((benchmark, idx) => {
                // Bar width — relative to highest max salary
                const maxSalary = sorted[0]?.avgMax ?? 1;
                const barWidth = (benchmark.avgMax / maxSalary) * 100;

                return (
                  <div
                    key={`${benchmark.role}-${idx}`}
                    className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-[var(--outline-variant)] last:border-0 hover:bg-[var(--surface-low)] transition-colors group"
                  >
                    {/* Role name */}
                    <div>
                      <p className="text-sm font-semibold text-[var(--on-surface)]">{benchmark.role}</p>
                      {/* Mini bar — visual salary indicator */}
                      <div className="mt-1.5 h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>

                    {/* Min */}
                    <div className="flex items-center">
                      <span className="font-mono text-sm font-semibold tabular-nums text-[var(--on-surface)]">
                        {formatBDT(benchmark.avgMin)}
                      </span>
                    </div>

                    {/* Max */}
                    <div className="flex items-center">
                      <span className="font-mono text-sm font-bold tabular-nums text-[var(--primary)]">
                        {formatBDT(benchmark.avgMax)}
                      </span>
                    </div>

                    {/* City */}
                    <div className="flex items-center">
                      <span className="badge">{benchmark.city}</span>
                    </div>

                    {/* Sample count */}
                    <div className="flex items-center">
                      <span className="font-mono text-xs tabular-nums text-[var(--on-surface-variant)]">
                        {benchmark.sampleCount} reviews
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── DATA DISCLAIMER ─────────────────────────────────────────── */}
        <div className="mt-6 p-4 bg-[var(--surface-low)] rounded-xl border border-[var(--outline-variant)] flex items-start gap-3">
          <ShieldIcon className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
            Salary data is aggregated from anonymous, OTP-verified employee reviews. All figures are in BDT
            (Bangladeshi Taka) per month. Data is updated continuously as new reviews are submitted.
          </p>
        </div>

        {/* ─── CONTRIBUTE CTA ──────────────────────────────────────────── */}
        <div className="mt-8 card bg-[var(--primary-fixed)] border-[var(--primary)] text-center py-8">
          <h2 className="font-semibold text-[var(--primary)] text-lg mb-2">
            Help improve salary transparency
          </h2>
          <p className="text-sm text-[var(--on-surface-variant)] mb-4">
            Share your salary anonymously to help fellow engineers make informed career decisions.
          </p>
          <Link href="/auth/register" className="btn-primary text-sm" id="salary-contribute-cta">
            Submit a Review (Anonymous)
          </Link>
        </div>
      </div>
    </div>
  );
}
