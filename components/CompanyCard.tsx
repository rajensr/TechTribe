// components/CompanyCard.tsx
// Company card — directory listing + home page featured section e use hobe
// Card design: logo slot, rating badge, stack tags, trust indicators — stitch mockup match

import Link from "next/link";

// Company card props — mock data ba real API data duita-i support korbe
export interface CompanyCardProps {
  id: number | string;
  companyName: string;
  location: string;
  techStack: string;        // comma-separated string, e.g. "React, Node.js, AWS"
  overallRating?: number;   // 1-5 average rating — undefined hole skeleton dikh
  reviewCount?: number;
  isVerified?: boolean;
  isClaimed?: boolean;
  logoUrl?: string;
  trustBadge?: string;      // e.g. "Top 10 Work-Life Balance", "Remote-First Policy"
  size?: "sm" | "md";       // sm = compact (4-col grid), md = full card (3-col)
}

export default function CompanyCard({
  id,
  companyName,
  location,
  techStack,
  overallRating,
  reviewCount = 0,
  isVerified = false,
  isClaimed = false,
  logoUrl,
  trustBadge,
  size = "md",
}: CompanyCardProps) {
  // Tech stack string ke array e convert kora — display er jonno
  const stackTags = techStack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3); // max 3 tags show korbo

  // Rating color — score anuzaayi rang change hobe
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (rating >= 4.0) return "bg-blue-50 text-blue-700 border-blue-200";
    if (rating >= 3.0) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  return (
    <Link
      href={`/companies/${id}`}
      className={`card group flex flex-col gap-3 cursor-pointer no-underline animate-fade-in ${
        size === "sm" ? "p-4" : "p-6"
      }`}
      aria-label={`View ${companyName} profile`}
      id={`company-card-${id}`}
    >
      {/* ─── TOP ROW: Logo + Rating ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        {/* Company logo slot — rounded rect, DESIGN.md: never circles */}
        <div className="w-12 h-12 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-low)] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            // Placeholder — company name er first letter
            <span className="font-mono font-bold text-lg text-[var(--primary)]">
              {companyName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Rating badge — star + score */}
        {overallRating !== undefined ? (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-mono font-semibold ${getRatingColor(overallRating)}`}
          >
            <span aria-hidden="true">★</span>
            <span>{overallRating.toFixed(1)}</span>
          </div>
        ) : (
          // Review nai hole dash diekhabo
          <div className="px-2 py-1 rounded-full border border-[var(--outline-variant)] text-xs font-mono text-[var(--on-surface-variant)] bg-[var(--surface-low)]">
            No reviews
          </div>
        )}
      </div>

      {/* ─── COMPANY INFO ────────────────────────────────────────────────── */}
      <div className="flex-1">
        {/* Company name */}
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          <h3
            className={`font-semibold text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors leading-tight ${
              size === "sm" ? "text-sm" : "text-base"
            }`}
          >
            {companyName}
          </h3>
          {/* Verified checkmark — admin approve korlei dekhabe */}
          {isVerified && (
            <span
              title="Verified Company"
              className="text-[var(--primary)] text-xs"
              aria-label="Verified"
            >
              ✓
            </span>
          )}
        </div>

        {/* Location — DESIGN.md: uppercase mono font */}
        <p className="font-mono text-[10px] font-medium text-[var(--on-surface-variant)] uppercase tracking-wider">
          {location}
        </p>
      </div>

      {/* ─── TECH STACK TAGS ─────────────────────────────────────────────── */}
      {/* Pill-shaped chips — DESIGN.md compliant */}
      <div className="flex flex-wrap gap-1.5" role="list" aria-label="Tech stack">
        {stackTags.map((tag) => (
          <span key={tag} className="badge" role="listitem">
            {tag}
          </span>
        ))}
      </div>

      {/* ─── TRUST BADGE ─────────────────────────────────────────────────── */}
      {/* e.g. "Top 10 Work-Life Balance" — stitch mockup e aache */}
      {trustBadge && (
        <div className="flex items-center gap-1 text-[var(--primary)]">
          <span className="text-xs" aria-hidden="true">◎</span>
          <span className="font-mono text-[10px] font-semibold text-[var(--primary)]">
            {trustBadge}
          </span>
        </div>
      )}

      {/* ─── REVIEW COUNT ────────────────────────────────────────────────── */}
      {reviewCount > 0 && (
        <p className="text-xs text-[var(--on-surface-variant)] mt-auto">
          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </p>
      )}
    </Link>
  );
}
