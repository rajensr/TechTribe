// components/PrivacyShieldOverlay.tsx
// Privacy Shield — 3 tar kom review thakle detail hide, overlay show hobe
// PRD Section 5.3: "Small Team Privacy Shield"

"use client";

import Link from "next/link";

interface PrivacyShieldOverlayProps {
  companyName: string;
  companyId: number | string;
  reviewCount: number;   // current review count
  minRequired?: number;  // default 3
}

export default function PrivacyShieldOverlay({
  companyName,
  companyId,
  reviewCount,
  minRequired = 3,
}: PrivacyShieldOverlayProps) {
  // Kototuku baki — e.g. "1 more review needed"
  const remaining = minRequired - reviewCount;

  return (
    <div className="relative">
      {/* ─── BLURRED BACKGROUND — fake review cards ────────────────────── */}
      {/* User ke hint dewa je review ache, but blur kora */}
      <div className="blur-sm opacity-40 pointer-events-none select-none" aria-hidden="true">
        {/* Fake placeholder review bars */}
        {[1, 2].map((i) => (
          <div key={i} className="card mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="skeleton w-7 h-7 rounded-full" />
              <div className="flex-1">
                <div className="skeleton h-3 w-32 rounded mb-1" />
                <div className="skeleton h-2 w-20 rounded" />
              </div>
              <div className="skeleton h-6 w-12 rounded-full" />
            </div>
            <div className="skeleton h-2 w-full rounded mb-2" />
            <div className="skeleton h-2 w-4/5 rounded mb-2" />
            <div className="skeleton h-2 w-3/5 rounded" />
          </div>
        ))}
      </div>

      {/* ─── OVERLAY CARD — stitch mockup match ─────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white border border-[var(--outline-variant)] rounded-xl shadow-modal p-8 max-w-sm w-full text-center animate-fade-in">
          {/* Lock icon */}
          <div className="w-16 h-16 bg-[var(--surface-low)] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl" aria-hidden="true">🔒</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg text-[var(--on-surface)] mb-2">
            Hidden for Privacy
          </h3>

          {/* Description — PRD exact wording */}
          <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed mb-6">
            Detailed reviews unlock once{" "}
            <strong>{minRequired} independent employee submissions</strong> are
            registered to protect early contributors.
          </p>

          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between text-xs font-mono text-[var(--on-surface-variant)] mb-2">
              <span className="uppercase tracking-wider">Reviews received</span>
              <span className="font-bold text-[var(--primary)]">
                {reviewCount} / {minRequired}
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                style={{ width: `${(reviewCount / minRequired) * 100}%` }}
              />
            </div>
            <p className="text-[10px] font-mono text-[var(--on-surface-variant)] mt-1.5">
              {remaining} more {remaining === 1 ? "review" : "reviews"} needed
            </p>
          </div>

          {/* CTA button — review likhte protsahit korbe */}
          <Link
            href={`/companies/${companyId}?write-review=true`}
            className="btn-primary w-full justify-center"
            id={`privacy-shield-review-btn-${companyId}`}
          >
            I Work at {companyName}
          </Link>

          {/* Privacy note */}
          <p className="font-mono text-[10px] text-[var(--on-surface-variant)] mt-3 uppercase tracking-wider">
            Your submission is 100% anonymous
          </p>
        </div>
      </div>
    </div>
  );
}
