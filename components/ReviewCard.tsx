"use client";
// components/ReviewCard.tsx
// Verified employee review card with lively triple-metric ratings, helpful voting, and safe number rendering

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

function MetricPill({ label, emoji, value = 0, color }: { label: string; emoji: string; value?: number; color: string }) {
  const safeValue = typeof value === "number" && !isNaN(value) ? Math.min(Math.max(value, 0), 5) : 0;
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">{emoji}</span>
        <span className="text-xs font-semibold text-slate-600">{label}</span>
      </div>
      <div className="flex items-center gap-1.5 font-mono font-extrabold text-xs">
        <span className={color}>{safeValue.toFixed(1)}</span>
        <span className="text-slate-300 font-normal">/5</span>
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
    <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-all duration-200" id={`review-${id}`}>
      {/* Top Row: Author + Date + Score */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs flex-shrink-0">
            {isAnonymous ? "🎭" : (authorName?.charAt(0) ?? "U")}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-extrabold text-slate-900">
                {isAnonymous ? "Verified Anonymous Engineer" : (authorName ?? "Member")}
              </span>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-full">
                OTP Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{formatDate(createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-xl flex-shrink-0">
          <span className="text-amber-500 text-xs">★</span>
          <span className="font-mono text-xs font-extrabold tabular-nums text-amber-700">{avgRating}</span>
        </div>
      </div>

      {/* 3 Metric Mini Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
        <MetricPill label="Work-Life" emoji="🌿" value={safeWorkLife} color="text-emerald-600" />
        <MetricPill label="Salary" emoji="💳" value={safeSalary} color="text-blue-600" />
        <MetricPill label="Management" emoji="🎯" value={safeManagement} color="text-purple-600" />
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              userVote === "UPVOTE"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            }`}
            aria-label="Upvote this review"
            id={`upvote-review-${id}`}
          >
            <span>▲</span>
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
            <span>▼</span>
          </button>
        </div>
      </div>
    </article>
  );
}
