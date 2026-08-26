"use client";
// components/ReviewCard.tsx
// Verified employee review card with triple-metric ratings, helpful voting, and safe number rendering

import { useState } from "react";
import { StarIcon } from "@/components/Icons";

export interface ReviewCardProps {
  id: number | string;
  authorName?: string;
  isAnonymous?: boolean;
  workLifeRating?: number;
  salaryRating?: number;
  managementRating?: number;
  reviewText: string;
  voteScore: number;
  createdAt: string;
  userVote?: "UPVOTE" | "DOWNVOTE" | null;
  onVote?: (reviewId: number | string, type: "UPVOTE" | "DOWNVOTE") => void;
}

function RatingBar({ label, value = 0 }: { label: string; value?: number }) {
  const safeValue = typeof value === "number" && !isNaN(value) ? Math.min(Math.max(value, 0), 5) : 0;
  const percentage = (safeValue / 5) * 100;

  const barColor =
    safeValue >= 4.0 ? "bg-emerald-500" : safeValue >= 3.0 ? "bg-blue-500" : "bg-amber-500";

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-[var(--on-surface-variant)] w-24 flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2 bg-[var(--surface-container)] rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={safeValue}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-label={`${label}: ${safeValue} out of 5`}
        />
      </div>
      <span className="font-mono text-xs font-bold tabular-nums text-[var(--on-surface)] w-6 text-right">
        {safeValue.toFixed(1)}
      </span>
    </div>
  );
}

export default function ReviewCard({
  id,
  authorName,
  isAnonymous = true,
  workLifeRating = 0,
  salaryRating = 0,
  managementRating = 0,
  reviewText,
  voteScore: initialVoteScore = 0,
  createdAt,
  userVote: initialUserVote = null,
  onVote,
}: ReviewCardProps) {
  const [voteScore, setVoteScore] = useState(initialVoteScore);
  const [userVote, setUserVote] = useState(initialUserVote);

  const safeWorkLife = typeof workLifeRating === "number" ? workLifeRating : 0;
  const safeSalary = typeof salaryRating === "number" ? salaryRating : 0;
  const safeManagement = typeof managementRating === "number" ? managementRating : 0;

  const avgRating = ((safeWorkLife + safeSalary + safeManagement) / 3).toFixed(1);

  const handleVote = (type: "UPVOTE" | "DOWNVOTE") => {
    if (!onVote) return;

    if (userVote === type) {
      setVoteScore((prev) => (type === "UPVOTE" ? prev - 1 : prev + 1));
      setUserVote(null);
    } else if (userVote !== null) {
      setVoteScore((prev) => (type === "UPVOTE" ? prev + 2 : prev - 2));
      setUserVote(type);
    } else {
      setVoteScore((prev) => (type === "UPVOTE" ? prev + 1 : prev - 1));
      setUserVote(type);
    }

    onVote(id, type);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
    try {
      return new Date(dateStr).toLocaleDateString("en-BD", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <article className="card animate-fade-in" id={`review-${id}`}>
      {/* Top Row: Author + Date + Score */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
              <span className="font-mono text-xs font-bold text-[var(--primary)]">
                {isAnonymous ? "A" : (authorName?.charAt(0) ?? "U")}
              </span>
            </div>
            <span className="text-sm font-semibold text-[var(--on-surface)]">
              {isAnonymous ? "Anonymous TechTribe Member" : (authorName ?? "Member")}
            </span>
            {isAnonymous && (
              <span className="text-xs font-semibold text-[var(--primary)] bg-[var(--primary-fixed)] px-2 py-0.5 rounded-full">
                Verified Anonymous
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--on-surface-variant)]">{formatDate(createdAt)}</p>
        </div>

        <div className="flex items-center gap-1 bg-[var(--primary-fixed)] px-2.5 py-1 rounded-full flex-shrink-0">
          <StarIcon className="w-3.5 h-3.5 text-[var(--primary)] flex-shrink-0" />
          <span className="font-mono text-xs font-bold tabular-nums text-[var(--primary)]">{avgRating}</span>
        </div>
      </div>

      {/* Triple Metric Rating Bars */}
      <div className="flex flex-col gap-2.5 mb-4 p-4 bg-[var(--surface-low)] rounded-xl border border-[var(--outline-variant)]">
        <RatingBar label="Work-Life" value={safeWorkLife} />
        <RatingBar label="Salary" value={safeSalary} />
        <RatingBar label="Management" value={safeManagement} />
      </div>

      {/* Review Text */}
      <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed max-w-[75ch] mb-4 whitespace-pre-line">
        {reviewText}
      </p>

      {/* Community Helpful Votes */}
      <div className="flex items-center gap-3 pt-3 border-t border-[var(--outline-variant)]">
        <span className="text-xs text-[var(--on-surface-variant)]">Helpful?</span>
        <button
          onClick={() => handleVote("UPVOTE")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            userVote === "UPVOTE"
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--surface-container)] text-[var(--on-surface-variant)] hover:bg-[var(--primary-fixed)] hover:text-[var(--primary)]"
          }`}
          aria-label="Upvote this review"
          aria-pressed={userVote === "UPVOTE"}
          id={`upvote-review-${id}`}
        >
          ▲ Helpful ({voteScore})
        </button>

        <button
          onClick={() => handleVote("DOWNVOTE")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            userVote === "DOWNVOTE"
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--surface-container)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-high)]"
          }`}
          aria-label="Downvote this review"
          aria-pressed={userVote === "DOWNVOTE"}
          id={`downvote-review-${id}`}
        >
          ▼
        </button>
      </div>
    </article>
  );
}
