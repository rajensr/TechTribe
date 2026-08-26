// components/CompanyCard.tsx
// Modern, eye-friendly Company Card with clean typography, badges, and comfortable touch padding

import Link from "next/link";
import { StarIcon, CheckIcon, LocationIcon, ShieldIcon, ArrowRightIcon } from "@/components/Icons";

export interface CompanyCardProps {
  id: number | string;
  companyName: string;
  location: string;
  techStack: string;
  overallRating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  isClaimed?: boolean;
  logoUrl?: string;
  trustBadge?: string;
  size?: "sm" | "md";
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
  // Parse tech stack tags
  const stackTags = techStack
    ? techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  const displayRating =
    typeof overallRating === "number" && !isNaN(overallRating)
      ? overallRating.toFixed(1)
      : null;

  return (
    <Link
      href={`/companies/${id}`}
      className={`group flex flex-col justify-between cursor-pointer no-underline bg-white border border-slate-200 hover:border-blue-500 rounded-2xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        size === "sm" ? "p-5" : "p-6 sm:p-7"
      }`}
      aria-label={`View ${companyName} profile`}
      id={`company-card-${id}`}
    >
      <div>
        {/* Top Header: Logo + Name + Verified Badge + Rating */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Company Logo / Initial Tile */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm font-mono font-bold text-lg overflow-hidden">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${companyName} logo`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-1.5 bg-white"
                />
              ) : (
                companyName.charAt(0).toUpperCase()
              )}
            </div>

            {/* Company Name & Location */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base leading-snug truncate">
                  {companyName}
                </h3>
                {isVerified && (
                  <span
                    title="Verified Company"
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex-shrink-0"
                    aria-label="Verified"
                  >
                    <CheckIcon className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <p className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5 truncate">
                <LocationIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </p>
            </div>
          </div>

          {/* Rating Pill */}
          {displayRating ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold shadow-2xs flex-shrink-0">
              <StarIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-400 flex-shrink-0" />
              <span>{displayRating}</span>
            </div>
          ) : (
            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 flex-shrink-0">
              New
            </span>
          )}
        </div>

        {/* Tech Stack Chips */}
        {stackTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3" role="list" aria-label="Tech stack">
            {stackTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-200 transition-colors"
                role="listitem"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Trust Highlight Tag */}
        {trustBadge && (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold mb-2">
            <ShieldIcon className="w-3 h-3 text-blue-600 flex-shrink-0" />
            <span className="truncate">{trustBadge}</span>
          </div>
        )}
      </div>

      {/* Card Footer: Review count & arrow button */}
      <div className="pt-3.5 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium tabular-nums">
          {reviewCount > 0
            ? `${reviewCount} verified review${reviewCount > 1 ? "s" : ""}`
            : "No reviews yet"}
        </span>

        <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Explore
          <ArrowRightIcon className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}
