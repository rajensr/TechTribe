// app/jobs/page.tsx
// Job Board — loads published jobs from MySQL DB with fallback to mock data

import JobCard from "@/components/JobCard";
import { MOCK_JOBS, MOCK_COMPANIES } from "@/lib/mock-data";
import Link from "next/link";
import { SearchIcon, ArrowRightIcon } from "@/components/Icons";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "IT Jobs in Bangladesh — TechTribe",
  description: "Browse verified IT job listings with transparent salary ranges from top Bangladeshi tech companies.",
};

const STACK_FILTERS = ["All", "React", "Node.js", "Python", "PHP", "Flutter", "Java", "Go", "AWS"];

interface PageProps {
  searchParams: Promise<{ stack?: string; city?: string; q?: string }>;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const { stack = "All", city = "All", q = "" } = resolvedSearchParams || {};

  let jobsWithCompany: any[] = [];

  // 1. Fetch from Database
  try {
    const dbJobs = await prisma.job.findMany({
      where: { status: "PUBLISHED" },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });

    if (dbJobs && dbJobs.length > 0) {
      jobsWithCompany = dbJobs.map((j: any) => ({
        id: j.id,
        companyId: j.companyId,
        companyName: j.company.companyName,
        location: j.company.location || j.company.city,
        jobTitle: j.jobTitle,
        jobDescription: j.jobDescription,
        salaryRangeMin: j.salaryRangeMin,
        salaryRangeMax: j.salaryRangeMax,
        techStack: j.company.techStack,
        postedAt: j.createdAt.toISOString(),
      }));
    }
  } catch (err) {
    console.warn("DB Jobs fetch error, using mock fallback:", err);
  }

  // 2. Fallback to mock data if empty
  if (jobsWithCompany.length === 0) {
    jobsWithCompany = MOCK_JOBS.map((job) => {
      const company = MOCK_COMPANIES.find((c) => c.id === job.companyId);
      return { ...job, location: company?.location ?? "Bangladesh" };
    });
  }

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

  const isNew = (dateStr: string) =>
    Date.now() - new Date(dateStr).getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container">
        {/* HEADER */}
        <div className="page-header-card">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Career Opportunities
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              IT Job Board
            </h1>
            <p className="text-slate-600 text-sm sm:text-base" aria-live="polite">
              {jobsWithCompany.length} verified listings with mandatory salary transparency.
            </p>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="card p-4 sm:p-5 mb-8">
          <form method="GET" className="mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Search by role, company, or stack..."
                  className="input pl-10"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] opacity-60">
                  <SearchIcon className="w-4 h-4" />
                </span>
              </div>
              {stack !== "All" && <input type="hidden" name="stack" value={stack} />}
              <button type="submit" className="btn-primary text-sm h-11 px-6 font-semibold">
                Search
              </button>
            </div>
          </form>

          {/* Stack filter pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-mono text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wider mr-1">
              Filter:
            </span>
            {STACK_FILTERS.map((s) => {
              const isActive = stack === s;
              return (
                <Link
                  key={s}
                  href={`/jobs?${new URLSearchParams({
                    ...(q && { q }),
                    stack: s,
                  }).toString()}`}
                  className={`px-3 py-1.5 min-h-[36px] sm:min-h-0 rounded-full text-xs font-semibold border transition-all ${
                    isActive
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs"
                      : "bg-[var(--surface-lowest)] text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--primary)]"
                  }`}
                >
                  {s}
                </Link>
              );
            })}
          </div>
        </div>

        {/* LISTINGS */}
        {jobsWithCompany.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
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
                postedAt={job.postedAt}
                isNew={isNew(job.postedAt)}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-16 mb-12">
            <div className="text-4xl mb-3" aria-hidden="true">🔍</div>
            <h3 className="font-bold text-lg text-[var(--on-surface)] mb-2">No jobs match your search</h3>
            <p className="text-sm text-[var(--on-surface-variant)] max-w-md mx-auto mb-6">
              Try removing some filters or search for a different stack or location.
            </p>
            <Link href="/jobs" className="btn-primary text-sm">
              Clear All Filters
            </Link>
          </div>
        )}

        {/* EMPLOYER CTA */}
        <div className="bg-white border-2 border-slate-300 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 mb-1">Hiring Engineering Talent?</h3>
            <p className="text-sm text-slate-600">
              Post salary-transparent jobs to attract top engineers across Bangladesh.
            </p>
          </div>
          <Link href="/employer/post-job" className="btn-primary text-sm h-11 px-6 font-bold rounded-xl whitespace-nowrap active:scale-95 transition-all">
            Post a Job Listing
          </Link>
        </div>
      </div>
    </div>
  );
}
