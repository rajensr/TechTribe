// components/ReviewCard.tsx
// Employee review card — triple metric rating bars + vote buttons + anonymous badge
// Privacy: isAnonymous = true hole author name hide hobe

"use client";

import { useState } from "react";

export interface ReviewCardProps {
  id: number | string;
  authorName?: string;          // isAnonymous = true hole undefined
  isAnonymous: boolean;
  workLifeRating: number;       // 1-5
  salaryRating: number;         // 1-5
  managementRating: number;     // 1-5
  reviewText: string;
  voteScore: number;            // upvote - downvote
  createdAt: string;            // ISO date string
  userVote?: "UPVOTE" | "DOWNVOTE" | null; // logged in user er current vote
  onVote?: (reviewId: number | string, voteType: "UPVOTE" | "DOWNVOTE") => void;
}

// Rating bar — 1-5 scale, colored fill
function RatingBar({ label, value }: { label: string; value: number }) {
  // 1-5 scale ke percentage convert
  const percentage = ((value - 1) / 4) * 100;

  // Color — score anuzaayi
  const barColor =
    value >= 4.5 ? "bg-emerald-500" :
    value >= 3.5 ? "bg-blue-500" :
    value >= 2.5 ? "bg-amber-500" :
    "bg-red-400";

  return (
    <div className="flex items-center gap-3">
      {/* Label — JetBrains Mono */}
      <span className="font-mono text-[10px] font-medium text-[var(--on-surface-variant)] uppercase tracking-wider w-24 flex-shrink-0">
        {label}
      </span>
      {/* Bar container */}
      <div className="flex-1 h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-label={`${label}: ${value} out of 5`}
        />
      </div>
      {/* Score */}
      <span className="font-mono text-xs font-semibold text-[var(--on-surface)] w-6 text-right">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default function ReviewCard({
  id,
  authorName,
  isAnonymous,
  workLifeRating,
  salaryRating,
  managementRating,
  reviewText,
  voteScore: initialVoteScore,
  createdAt,
  userVote: initialUserVote = null,
  onVote,
}: ReviewCardProps) {
  // Local vote state — optimistic UI update er jonno
  const [voteScore, setVoteScore] = useState(initialVoteScore);
  const [userVote, setUserVote] = useState(initialUserVote);

  // Average rating — tintai merge kore ekta number
  const avgRating = ((workLifeRating + salaryRating + managementRating) / 3).toFixed(1);

  // Vote handle kora — upvote ba downvote, toggle support
  const handleVote = (type: "UPVOTE" | "DOWNVOTE") => {
    if (!onVote) return; // login na hole vote kaj korbe na

    // Optimistic update — API response er age UI update
    if (userVote === type) {
      // Same button again click — undo vote
      setVoteScore((prev) => (type === "UPVOTE" ? prev - 1 : prev + 1));
      setUserVote(null);
    } else if (userVote !== null) {
      // Different vote — switch kora
      setVoteScore((prev) => (type === "UPVOTE" ? prev + 2 : prev - 2));
      setUserVote(type);
    } else {
      // New vote
      setVoteScore((prev) => (type === "UPVOTE" ? prev + 1 : prev - 1));
      setUserVote(type);
    }

    onVote(id, type);
  };

  // Date format — e.g. "August 2024"
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <article
      className="card animate-fade-in"
      id={`review-${id}`}
    >
      {/* ─── TOP: Author + Date + Avg Rating ────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          {/* Author — anonymous ba real name */}
          <div className="flex items-center gap-2 mb-0.5">
            {/* Avatar circle */}
            <div className="w-7 h-7 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
              <span className="font-mono text-xs font-bold text-[var(--primary)]">
                {isAnonymous ? "A" : (authorName?.charAt(0) ?? "U")}
              </span>
            </div>
            <span className="text-sm font-medium text-[var(--on-surface)]">
              {isAnonymous ? "Anonymous TechTribe Member" : (authorName ?? "Member")}
            </span>
            {/* Anonymous shield badge */}
            {isAnonymous && (
              <span className="font-mono text-[9px] font-semibold text-[var(--primary)] bg-[var(--primary-fixed)] px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                Anonymous
              </span>
            )}
          </div>
          {/* Posted date */}
          <p className="font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-wider">
            {formatDate(createdAt)}
          </p>
        </div>

        {/* Overall average rating */}
        <div className="flex items-center gap-1 bg-[var(--primary-fixed)] px-2.5 py-1 rounded-full flex-shrink-0">
          <span className="text-[var(--primary)] text-xs" aria-hidden="true">★</span>
          <span className="font-mono text-xs font-bold text-[var(--primary)]">{avgRating}</span>
        </div>
      </div>

      {/* ─── RATING BARS ─────────────────────────────────────────────────── */}
      {/* Triple metric — PRD Section 5.2 */}
      <div className="flex flex-col gap-2 mb-4 p-3 bg-[var(--surface-low)] rounded-lg">
        <RatingBar label="Work-Life" value={workLifeRating} />
        <RatingBar label="Salary" value={salaryRating} />
        <RatingBar label="Management" value={managementRating} />
      </div>

      {/* ─── REVIEW TEXT ─────────────────────────────────────────────────── */}
      <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed mb-4">
        {reviewText}
      </p>

      {/* ─── VOTE BUTTONS ────────────────────────────────────────────────── */}
      {/* Upvote/downvote — PRD Section 5.2 community voting */}
      <div className="flex items-center gap-3 pt-3 border-t border-[var(--outline-variant)]">
        <span className="text-xs text-[var(--on-surface-variant)]">Helpful?</span>

        {/* Upvote */}
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
          <span aria-hidden="true">↑</span>
          <span>Yes</span>
        </button>

        {/* Downvote */}
        <button
          onClick={() => handleVote("DOWNVOTE")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            userVote === "DOWNVOTE"
              ? "bg-red-500 text-white"
              : "bg-[var(--surface-container)] text-[var(--on-surface-variant)] hover:bg-red-50 hover:text-red-600"
          }`}
          aria-label="Downvote this review"
          aria-pressed={userVote === "DOWNVOTE"}
          id={`downvote-review-${id}`}
        >
          <span aria-hidden="true">↓</span>
          <span>No</span>
        </button>

        {/* Vote score */}
        <span className="font-mono text-xs text-[var(--on-surface-variant)] ml-auto">
          {voteScore > 0 ? `+${voteScore}` : voteScore} votes
        </span>
      </div>
    </article>
  );
}
