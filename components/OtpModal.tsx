"use client";
// components/OtpModal.tsx
// OTP verification modal — 3 steps:
// Step 1: Enter corporate email
// Step 2: Enter 6-digit OTP
// Step 3: Submit review form
// PRD Section 4: "Verify Employment at time of review submission"
// Privacy: corporate email is only used for domain verification, never stored

import { useState } from "react";

interface OtpModalProps {
  companyId?: number | string;
  companyName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

// 3-step flow type
type Step = "EMAIL" | "OTP" | "REVIEW";

export default function OtpModal({
  companyId,
  companyName = "your company",
  onClose,
  onSuccess,
}: OtpModalProps) {
  // Current step
  const [step, setStep] = useState<Step>("EMAIL");

  // Step 1: corporate email
  const [corporateEmail, setCorporateEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Step 2: OTP input — 6 digits
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Step 3: Review fields
  const [workLifeRating, setWorkLifeRating] = useState(0);
  const [salaryRating, setSalaryRating] = useState(0);
  const [managementRating, setManagementRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true); // default anonymous — PRD
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Step 1: Send OTP — corporate email domain validation
  const sendOtp = async () => {
    setEmailError(null);
    if (!corporateEmail.includes("@") || !corporateEmail.includes(".")) {
      setEmailError("Please enter a valid corporate email address.");
      return;
    }
    setEmailLoading(true);

    // POST /api/otp/send — backend wire-up korar somoy real API call hobe
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ corporateEmail, companyId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailError(data.error ?? "Failed to send OTP. Check your email domain.");
        setEmailLoading(false);
        return;
      }
      setStep("OTP");
    } catch {
      setEmailError("Something went wrong. Please try again.");
    }
    setEmailLoading(false);
  };

  // Step 2: Verify OTP — 6-digit match check
  const verifyOtp = async () => {
    setOtpError(null);
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setOtpError("Please enter the 6-digit code from your email.");
      return;
    }
    setOtpLoading(true);

    // POST /api/otp/verify — backend wire-up korar somoy real API call hobe
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, companyId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error ?? "Invalid or expired OTP. Please try again.");
        setOtpLoading(false);
        return;
      }
      setStep("REVIEW");
    } catch {
      setOtpError("Something went wrong.");
    }
    setOtpLoading(false);
  };

  // Step 3: Submit review — privacy-safe, IP stripped at API layer
  const submitReview = async () => {
    setReviewError(null);
    if (!workLifeRating || !salaryRating || !managementRating) {
      setReviewError("Please rate all three categories.");
      return;
    }
    if (reviewText.trim().length < 50) {
      setReviewError("Review must be at least 50 characters.");
      return;
    }
    setReviewLoading(true);

    // POST /api/reviews/submit — backend wire-up korar somoy real API call hobe
    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          otp,
          workLifeRating,
          salaryRating,
          managementRating,
          reviewText,
          isAnonymous, // default true — PRD privacy requirement
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setReviewError(data.error ?? "Failed to submit review.");
        setReviewLoading(false);
        return;
      }
      onSuccess();
    } catch {
      setReviewError("Something went wrong. Please try again.");
    }
    setReviewLoading(false);
  };

  // Star rating component — 1-5 click select
  function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
      <div className="flex gap-1" role="group">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-xl transition-all ${star <= value ? "text-amber-400" : "text-[var(--surface-container)] hover:text-amber-300"}`}
            aria-label={`Rate ${star} out of 5`}
          >
            ★
          </button>
        ))}
      </div>
    );
  }

  return (
    /* Modal backdrop — click outside to close */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Verify your workplace"
    >
      <div className="bg-white rounded-xl shadow-modal w-full max-w-md animate-fade-in">
        {/* ─── MODAL HEADER ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--outline-variant)]">
          <div>
            <h2 className="font-semibold text-lg text-[var(--on-surface)]">
              {step === "EMAIL" && "Verify your workplace"}
              {step === "OTP" && "Enter verification code"}
              {step === "REVIEW" && "Write your review"}
            </h2>
            {/* Step indicator */}
            <div className="flex gap-1.5 mt-1">
              {(["EMAIL", "OTP", "REVIEW"] as Step[]).map((s, i) => (
                <div
                  key={s}
                  className={`h-1 rounded-full transition-all ${
                    step === s ? "w-6 bg-[var(--primary)]" :
                    ["EMAIL", "OTP", "REVIEW"].indexOf(step) > i ? "w-6 bg-[var(--primary)] opacity-40" :
                    "w-3 bg-[var(--surface-container)]"
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface-variant)]"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* ─── STEP 1: EMAIL ────────────────────────────────────────── */}
        {step === "EMAIL" && (
          <div className="p-6">
            <p className="text-sm text-[var(--on-surface-variant)] mb-6 leading-relaxed">
              Verify your current workplace to unlock review privileges and gain exclusive insights into company cultures.
            </p>

            <div className="mb-4">
              <label htmlFor="corporate-email" className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5">
                Corporate Email Address
              </label>
              <input
                type="email"
                id="corporate-email"
                value={corporateEmail}
                onChange={(e) => setCorporateEmail(e.target.value)}
                placeholder="name@company.com"
                className="input"
                disabled={emailLoading}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
              />
              {emailError && (
                <p className="font-mono text-[9px] text-[var(--error)] mt-1">{emailError}</p>
              )}
            </div>

            <button
              onClick={sendOtp}
              disabled={emailLoading || !corporateEmail}
              className="btn-primary w-full justify-center"
              id="send-otp-btn"
            >
              {emailLoading ? "Sending..." : "Send Code"}
            </button>

            {/* Privacy note */}
            <div className="mt-4 pt-4 border-t border-[var(--outline-variant)] flex items-start gap-2">
              <span className="text-[var(--primary)] mt-0.5 flex-shrink-0" aria-hidden="true">🔒</span>
              <p className="font-mono text-[9px] text-[var(--on-surface-variant)] uppercase tracking-wider leading-relaxed">
                Your privacy is our priority. We never share your identity with employers.
              </p>
            </div>
          </div>
        )}

        {/* ─── STEP 2: OTP ──────────────────────────────────────────── */}
        {step === "OTP" && (
          <div className="p-6">
            <p className="text-sm text-[var(--on-surface-variant)] mb-1">
              We sent a 6-digit code to:
            </p>
            <p className="font-mono text-sm font-semibold text-[var(--primary)] mb-6">
              {corporateEmail}
            </p>

            <div className="mb-4">
              <label htmlFor="otp-input" className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5">
                Verification Code
              </label>
              <input
                type="text"
                id="otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="input text-center font-mono text-2xl tracking-[0.5em]"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
              />
              {otpError && (
                <p className="font-mono text-[9px] text-[var(--error)] mt-1">{otpError}</p>
              )}
            </div>

            <button
              onClick={verifyOtp}
              disabled={otpLoading || otp.length !== 6}
              className="btn-primary w-full justify-center mb-3"
              id="verify-otp-btn"
            >
              {otpLoading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              onClick={() => setStep("EMAIL")}
              className="btn-ghost w-full justify-center text-sm"
            >
              ← Back
            </button>
          </div>
        )}

        {/* ─── STEP 3: REVIEW FORM ──────────────────────────────────── */}
        {step === "REVIEW" && (
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <p className="text-xs text-emerald-600 font-mono uppercase tracking-wider mb-4 flex items-center gap-1">
              <span aria-hidden="true">✓</span>
              Workplace verified — your review will be anonymous
            </p>

            {/* Work-Life Balance */}
            <div className="mb-4">
              <label className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-2">
                Work-Life Balance *
              </label>
              <StarRating value={workLifeRating} onChange={setWorkLifeRating} />
            </div>

            {/* Salary & Benefits */}
            <div className="mb-4">
              <label className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-2">
                Salary & Benefits *
              </label>
              <StarRating value={salaryRating} onChange={setSalaryRating} />
            </div>

            {/* Management & Culture */}
            <div className="mb-4">
              <label className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-2">
                Management & Culture *
              </label>
              <StarRating value={managementRating} onChange={setManagementRating} />
            </div>

            {/* Review text */}
            <div className="mb-4">
              <label htmlFor="review-text" className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5">
                Your Review * (min. 50 chars)
              </label>
              <textarea
                id="review-text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your honest experience working here..."
                className="input resize-none h-28"
                rows={4}
              />
              <p className="font-mono text-[9px] text-[var(--on-surface-variant)] mt-1">
                {reviewText.length} / 50 min characters
              </p>
            </div>

            {/* Anonymous toggle */}
            <div className="flex items-center justify-between p-3 bg-[var(--surface-low)] rounded-lg mb-4">
              <div>
                <p className="text-sm font-medium text-[var(--on-surface)]">Post Anonymously</p>
                <p className="font-mono text-[9px] text-[var(--on-surface-variant)] uppercase tracking-wider">
                  Recommended — default on
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isAnonymous}
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${isAnonymous ? "bg-[var(--primary)]" : "bg-[var(--surface-container)]"}`}
                id="anonymous-toggle"
              >
                <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform m-1 ${isAnonymous ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>

            {reviewError && (
              <div className="p-3 bg-[var(--error-container)] border border-[var(--error)] rounded-lg mb-4" role="alert">
                <p className="text-xs text-[var(--on-error-container)]">{reviewError}</p>
              </div>
            )}

            <button
              onClick={submitReview}
              disabled={reviewLoading || !workLifeRating || !salaryRating || !managementRating || reviewText.length < 50}
              className="btn-primary w-full justify-center"
              id="submit-review-btn"
            >
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
