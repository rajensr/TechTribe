// app/salaries/page.tsx
// Salary Benchmarks page — aggregated salary data from reviews
// BDT format, role-wise breakdown

import { MOCK_SALARY_BENCHMARKS } from "@/lib/mock-data";
import Link from "next/link";

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
    <div className="pt-24 pb-16 min-h-screen bg-[var(--background)]">
      <div className="container">
        {/* ─── HEADER ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[var(--primary-fixed)] text-[var(--primary)] font-mono text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <span aria-hidden="true">📊</span>
            Verified Review Data
          </div>
          <h1 className="text-3xl font-bold text-[var(--on-background)] mb-2">
            IT Salary Benchmarks
          </h1>
          <p className="text-[var(--on-surface-variant)] max-w-xl">
            Aggregated from {totalSamples.toLocaleString()} verified anonymous employee reviews across Bangladesh.
          </p>
        </div>

        {/* ─── STATS ROW ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Samples", value: totalSamples.toLocaleString() },
            { label: "Avg Mid-Level", value: formatBDT(overallAvg) },
            { label: "Roles Tracked", value: benchmarks.length.toString() },
            { label: "Cities Covered", value: "3" },
          ].map(({ label, value }) => (
            <div key={label} className="card text-center">
              <div className="text-2xl font-bold text-[var(--primary)] mb-1">{value}</div>
              <div className="font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-widest">
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
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                city === c || (c === "All" && !city)
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
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
                  <div key={col} className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest">
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
                      <span className="font-mono text-sm font-semibold text-[var(--on-surface)]">
                        {formatBDT(benchmark.avgMin)}
                      </span>
                    </div>

                    {/* Max */}
                    <div className="flex items-center">
                      <span className="font-mono text-sm font-bold text-[var(--primary)]">
                        {formatBDT(benchmark.avgMax)}
                      </span>
                    </div>

                    {/* City */}
                    <div className="flex items-center">
                      <span className="badge">{benchmark.city}</span>
                    </div>

                    {/* Sample count */}
                    <div className="flex items-center">
                      <span className="font-mono text-xs text-[var(--on-surface-variant)]">
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
        <div className="mt-6 p-4 bg-[var(--surface-low)] rounded-lg flex items-start gap-3">
          <span className="text-lg flex-shrink-0" aria-hidden="true">ℹ️</span>
          <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
            Salary data is aggregated from anonymous, OTP-verified employee reviews. All figures are in BDT
            (Bangladeshi Taka) per month. Data is updated continuously as new reviews are submitted. Small
            sample sizes (&lt;5 reviews) are marked with lower confidence.
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
