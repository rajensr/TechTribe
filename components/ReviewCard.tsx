"use client";
// components/ReviewCard.tsx
// Clean, breathable, verified employee review card without emojis

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

function MetricPill({ label, value = 0 }: { label: string; value?: number }) {
  const safeValue = typeof value === "number" && !isNaN(value) ? Math.min(Math.max(value, 0), 5) : 0;
  return (
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <div className="flex items-center gap-1 font-mono font-extrabold text-xs">
        <span className="text-slate-900">{safeValue.toFixed(1)}</span>
        <span className="text-slate-400 font-normal">/5.0</span>
      </div>
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
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <article className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 shadow-xs" id={`review-${id}`}>
      {/* Top Row: Author + Date + Score */}
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-mono font-bold text-sm flex items-center justify-center flex-shrink-0">
            {isAnonymous ? "A" : (authorName?.charAt(0) ?? "U")}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-extrabold text-slate-900">
                {isAnonymous ? "Verified Anonymous Engineer" : (authorName ?? "Member")}
              </span>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
                OTP Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{formatDate(createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl flex-shrink-0">
          <span className="text-amber-500 text-xs">★</span>
          <span className="font-mono text-xs font-extrabold tabular-nums text-slate-900">{avgRating}</span>
        </div>
      </div>

      {/* 3 Metric Mini Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <MetricPill label="Work-Life" value={safeWorkLife} />
        <MetricPill label="Salary" value={safeSalary} />
        <MetricPill label="Management" value={safeManagement} />
      </div>

      {/* Review Text */}
      <p className="text-sm text-slate-700 leading-relaxed mb-6 whitespace-pre-line font-normal">
        {reviewText}
      </p>

      {/* Helpful Votes Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
        <span className="text-slate-400 font-medium">Was this review helpful?</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote("UPVOTE")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              userVote === "UPVOTE"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            }`}
            aria-label="Upvote this review"
            id={`upvote-review-${id}`}
          >
            <span>Helpful ({voteScore})</span>
          </button>

          <button
            onClick={() => handleVote("DOWNVOTE")}
            className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold transition-all ${
              userVote === "DOWNVOTE"
                ? "bg-slate-700 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
            aria-label="Downvote this review"
            id={`downvote-review-${id}`}
          >
            <span>—</span>
          </button>
        </div>
      </div>
    </article>
  );
}
