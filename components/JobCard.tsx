// components/JobCard.tsx
// Job listing card — job board + company profile page e use hobe
// Salary range mandatory — stitch mockup: "Verified Salary" badge

import Link from "next/link";
import { MoneyIcon, CheckIcon } from "@/components/Icons";

export interface JobCardProps {
  id: number | string;
  jobTitle: string;
  companyName: string;
  companyId: number | string;
  location?: string;
  salaryRangeMin: number;   // BDT — mandatory
  salaryRangeMax: number;   // BDT — mandatory
  techStack?: string;       // comma-separated
  postedAt?: string;        // ISO date string
  isNew?: boolean;          // posted 7 diner moddhe hole "New" badge show hobe
}

// BDT format kora — e.g. 50000 -> "৳50,000"
function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function JobCard({
  id,
  jobTitle,
  companyName,
  companyId,
  location = "Chattogram, BD",
  salaryRangeMin,
  salaryRangeMax,
  techStack,
  postedAt,
  isNew = false,
}: JobCardProps) {
  // Tech stack tags — max 4 show korbo
  const stackTags = techStack
    ? techStack.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4)
    : [];

  // Time ago — e.g. "3 days ago"
  const getTimeAgo = (dateStr?: string) => {
    if (!dateStr) return null;
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <article
      className="group bg-white border-1.5 border-slate-300 rounded-2xl p-7 sm:p-8 transition-all duration-200 hover:border-blue-600 hover:shadow-md"
      id={`job-card-${id}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left — job info */}
        <div className="flex-1 min-w-0">
          {/* Job title + "New" badge */}
          <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap mb-1.5">
            <Link
              href={`/jobs/${id}`}
              className="font-semibold text-base sm:text-lg text-[var(--on-surface)] hover:text-[var(--primary)] transition-colors leading-tight"
            >
              {jobTitle}
            </Link>
            <div className="flex items-center gap-2">
              {isNew && (
                <span className="badge text-xs px-2.5 py-0.5">New</span>
              )}
              {postedAt && (
                <span className="sm:hidden text-xs text-[var(--on-surface-variant)] font-medium">
                  {getTimeAgo(postedAt)}
                </span>
              )}
            </div>
          </div>

          {/* Company name + location */}
          <p className="text-xs text-[var(--on-surface-variant)] font-medium mb-3">
            <Link
              href={`/companies/${companyId}`}
              className="hover:text-[var(--primary)] transition-colors font-semibold"
            >
              {companyName}
            </Link>
            {" • "}{location}{" • Full-time"}
          </p>

          {/* Tech stack tags */}
          {stackTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4" role="list" aria-label="Required skills">
              {stackTags.map((tag) => (
                <span key={tag} className="badge text-xs px-2.5 py-1" role="listitem">{tag}</span>
              ))}
            </div>
          )}

          {/* ─── SALARY RANGE ─────────────────────────────────────────── */}
          {/* BDT format, "Verified Salary" badge — stitch mockup match */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-[var(--surface-low)] rounded-xl sm:bg-transparent sm:p-0 sm:pt-2 border-t border-[var(--outline-variant)] sm:border-none">
            <div className="flex items-center gap-1.5">
              <MoneyIcon className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
              <span className="font-mono font-bold tabular-nums text-[var(--primary)] text-sm sm:text-base">
                {formatBDT(salaryRangeMin)} – {formatBDT(salaryRangeMax)}
              </span>
              <span className="text-xs text-[var(--on-surface-variant)]">/month</span>
            </div>

            {/* Verified salary badge — salary transparent thakle show hobe */}
            <div className="flex items-center gap-1.5 text-[var(--primary)]">
              <CheckIcon className="w-3.5 h-3.5 text-[var(--primary)] flex-shrink-0" />
              <span className="text-xs font-semibold">
                Verified Salary
              </span>
            </div>
          </div>
        </div>

        {/* Right — posted time (desktop view) */}
        {postedAt && (
          <div className="hidden sm:block flex-shrink-0 text-right">
            <span className="text-xs text-[var(--on-surface-variant)] font-medium">
              {getTimeAgo(postedAt)}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
