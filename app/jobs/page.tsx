// app/jobs/page.tsx
// Job Board — only verified salary range jobs show hobe
// PRD Section 5.4: "Strict Salary Rule"

import JobCard from "@/components/JobCard";
import { MOCK_JOBS, MOCK_COMPANIES } from "@/lib/mock-data";
import Link from "next/link";

export const metadata = {
  title: "IT Jobs in Bangladesh — TechTribe",
  description: "Browse verified IT job listings with transparent salary ranges from top Bangladeshi tech companies.",
};

// Stack filter options
const STACK_FILTERS = ["All", "React", "Node.js", "Python", "PHP", "Flutter", "Java", "Go", "AWS"];

interface PageProps {
  searchParams: Promise<{ stack?: string; city?: string; q?: string }>;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const { stack = "All", city = "All", q = "" } = resolvedSearchParams || {};

  // Jobs + company name merge kora — display er jonno
  // Backend wire-up korar somoy Prisma join query hobe
  let jobsWithCompany = MOCK_JOBS.map((job) => {
    const company = MOCK_COMPANIES.find((c) => c.id === job.companyId);
    return { ...job, location: company?.location ?? "Bangladesh" };
  });

  // Text search filter
  if (q) {
    const lower = q.toLowerCase();
    jobsWithCompany = jobsWithCompany.filter(
      (j) => j.jobTitle.toLowerCase().includes(lower) || j.companyName.toLowerCase().includes(lower)
    );
  }

  // Stack filter
  if (stack && stack !== "All") {
    jobsWithCompany = jobsWithCompany.filter((j) =>
      j.techStack?.toLowerCase().includes(stack.toLowerCase())
    );
  }

  // New jobs — posted within 7 days
  const isNew = (dateStr: string) =>
    Date.now() - new Date(dateStr).getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[var(--background)]">
      <div className="container">
        {/* ─── HEADER ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[var(--primary-fixed)] text-[var(--primary)] font-mono text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <span aria-hidden="true">💰</span>
            Salary Transparent Only
          </div>
          <h1 className="text-3xl font-bold text-[var(--on-background)] mb-2">
            IT Job Board
          </h1>
          <p className="text-[var(--on-surface-variant)]">
            {jobsWithCompany.length} open positions — all with verified salary ranges.
          </p>
        </div>

        {/* ─── SEARCH + STACK FILTER ROW ──────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <form method="GET" className="flex gap-2 flex-1">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search jobs or companies..."
              className="input text-sm flex-1"
              id="jobs-search-input"
            />
            {stack !== "All" && <input type="hidden" name="stack" value={stack} />}
            <button type="submit" className="btn-primary text-sm px-5">Search</button>
          </form>

          {/* Stack chips */}
          <div className="flex flex-wrap gap-2">
            {STACK_FILTERS.map((s) => (
              <Link
                key={s}
                href={`/jobs?${new URLSearchParams({
                  ...(q && { q }),
                  stack: s,
                }).toString()}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  stack === s || (s === "All" && !stack)
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
                id={`jobs-stack-${s.toLowerCase()}`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        {/* ─── JOB LISTINGS ───────────────────────────────────────────── */}
        {jobsWithCompany.length === 0 ? (
          <div className="text-center py-20 card">
            <div className="text-5xl mb-4" aria-hidden="true">💼</div>
            <h2 className="text-xl font-semibold text-[var(--on-surface)] mb-2">No jobs found</h2>
            <p className="text-sm text-[var(--on-surface-variant)] mb-6">
              Try clearing your filters or check back later.
            </p>
            <Link href="/jobs" className="btn-secondary text-sm">Clear filters</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobsWithCompany.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                jobTitle={job.jobTitle}
                companyName={job.companyName}
                companyId={job.companyId}
                location={job.location}
                salaryRangeMin={job.salaryRangeMin}
                salaryRangeMax={job.salaryRangeMax}
                techStack={job.techStack}
                postedAt={job.createdAt}
                isNew={isNew(job.createdAt)}
              />
            ))}
          </div>
        )}

        {/* ─── EMPLOYER CTA ────────────────────────────────────────────── */}
        <div className="mt-12 p-6 bg-[var(--primary-fixed)] border border-[var(--primary)] rounded-xl text-center">
          <h2 className="font-semibold text-[var(--primary)] text-lg mb-2">
            Hiring IT talent in Bangladesh?
          </h2>
          <p className="text-sm text-[var(--on-surface-variant)] mb-4">
            Post a job with a transparent salary range and reach the top 5% of tech talent.
          </p>
          <Link href="/employer/post-job" className="btn-primary text-sm" id="post-job-cta">
            Post a Job →
          </Link>
        </div>
      </div>
    </div>
  );
}
