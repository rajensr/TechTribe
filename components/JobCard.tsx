// components/JobCard.tsx
// Job listing card — job board + company profile page e use hobe
// Salary range mandatory — stitch mockup: "Verified Salary" badge

import Link from "next/link";

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
      className="card group"
      id={`job-card-${id}`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left — job info */}
        <div className="flex-1 min-w-0">
          {/* Job title + "New" badge */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link
              href={`/jobs/${id}`}
              className="font-semibold text-base text-[var(--on-surface)] hover:text-[var(--primary)] transition-colors leading-tight"
            >
              {jobTitle}
            </Link>
            {isNew && (
              <span className="badge text-[10px] px-2 py-0.5">New</span>
            )}
          </div>

          {/* Company name + location — mono font */}
          <p className="font-mono text-[11px] text-[var(--on-surface-variant)] uppercase tracking-wider mb-3">
            <Link
              href={`/companies/${companyId}`}
              className="hover:text-[var(--primary)] transition-colors"
            >
              {companyName}
            </Link>
            {" • "}{location}{" • Full-time"}
          </p>

          {/* Tech stack tags */}
          {stackTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3" role="list" aria-label="Required skills">
              {stackTags.map((tag) => (
                <span key={tag} className="badge" role="listitem">{tag}</span>
              ))}
            </div>
          )}

          {/* ─── SALARY RANGE ─────────────────────────────────────────── */}
          {/* BDT format, "Verified Salary" badge — stitch mockup match */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              {/* Taka icon */}
              <span className="text-[var(--primary)] text-sm" aria-hidden="true">💰</span>
              <span className="font-semibold text-[var(--primary)] text-sm">
                {formatBDT(salaryRangeMin)} – {formatBDT(salaryRangeMax)}
              </span>
              <span className="text-xs text-[var(--on-surface-variant)]">/month</span>
            </div>

            {/* Verified salary badge — salary transparent thakle show hobe */}
            <div className="flex items-center gap-1 text-[var(--primary)]">
              <span className="text-xs" aria-hidden="true">✓</span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wide">
                Verified Salary
              </span>
            </div>
          </div>
        </div>

        {/* Right — posted time */}
        {postedAt && (
          <div className="flex-shrink-0 text-right">
            <span className="font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-wider">
              {getTimeAgo(postedAt)}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
