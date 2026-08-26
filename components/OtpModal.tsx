"use client";
// components/OtpModal.tsx
// OTP verification modal with default OTP support (12345) and real review submission

import { useState } from "react";

interface OtpModalProps {
  companyId?: number | string;
  companyName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "EMAIL" | "OTP" | "REVIEW";

export default function OtpModal({
  companyId,
  companyName = "the company",
  onClose,
  onSuccess,
}: OtpModalProps) {
  const [step, setStep] = useState<Step>("EMAIL");

  // Step 1: Corporate email
  const [corporateEmail, setCorporateEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Step 2: OTP
  const [otp, setOtp] = useState("12345");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Step 3: Review
  const [workLifeRating, setWorkLifeRating] = useState(5);
  const [salaryRating, setSalaryRating] = useState(4);
  const [managementRating, setManagementRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Step 1: Send OTP
  const sendOtp = async () => {
    setEmailError(null);
    if (!corporateEmail.includes("@") || !corporateEmail.includes(".")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailLoading(true);

    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ corporateEmail, companyId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailError(data.error ?? "Failed to send OTP.");
        setEmailLoading(false);
        return;
      }
      setStep("OTP");
    } catch {
      setEmailError("Something went wrong. Please try again.");
    }
    setEmailLoading(false);
  };

  // Step 2: Verify OTP
  const verifyOtp = async () => {
    setOtpError(null);
    if (!otp.trim()) {
      setOtpError("Please enter the verification code (Default: 12345).");
      return;
    }
    setOtpLoading(true);

    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otp.trim(), companyId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error ?? "Invalid OTP. Use default: 12345");
        setOtpLoading(false);
        return;
      }
      setStep("REVIEW");
    } catch {
      setOtpError("Something went wrong.");
    }
    setOtpLoading(false);
  };

  // Step 3: Submit review to database
  const submitReview = async () => {
    setReviewError(null);
    if (!workLifeRating || !salaryRating || !managementRating) {
      setReviewError("Please rate all three categories.");
      return;
    }
    if (reviewText.trim().length < 10) {
      setReviewError("Review must be at least 10 characters long.");
      return;
    }
    setReviewLoading(true);

    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          workLifeRating,
          salaryRating,
          managementRating,
          reviewText,
          isAnonymous,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
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

  function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
      <div className="flex gap-1.5" role="group">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-2xl transition-all ${
              star <= value ? "text-amber-400 scale-110" : "text-slate-300 hover:text-amber-300"
            }`}
            aria-label={`Rate ${star} out of 5`}
          >
            ★
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* STEP 1: EMAIL */}
        {step === "EMAIL" && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mb-4">
              ✉️
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
              Verify Employment
            </h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Enter your work email for <strong className="text-slate-900">{companyName}</strong>. We send an OTP to confirm you work here. Your email is <em>never</em> shared or stored.
            </p>

            <div className="mb-5">
              <label htmlFor="corp-email" className="font-mono text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                Work Email Address
              </label>
              <input
                type="email"
                id="corp-email"
                value={corporateEmail}
                onChange={(e) => setCorporateEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-sm font-medium"
              />
            </div>

            {emailError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                {emailError}
              </div>
            )}

            <button
              type="button"
              onClick={sendOtp}
              disabled={emailLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center"
            >
              {emailLoading ? "Sending OTP..." : "Send Verification Code"}
            </button>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === "OTP" && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mb-4">
              🔑
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
              Enter Verification Code
            </h2>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Enter the OTP sent to <strong className="text-slate-900">{corporateEmail}</strong>.
            </p>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs font-semibold mb-6 flex items-center justify-between">
              <span>Default Dev OTP: <strong>12345</strong></span>
              <button
                type="button"
                onClick={() => setOtp("12345")}
                className="underline hover:text-blue-900"
              >
                Auto-fill
              </button>
            </div>

            <div className="mb-5">
              <label htmlFor="otp-input" className="font-mono text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="12345"
                maxLength={6}
                className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-300 rounded-xl text-slate-900 text-center font-mono font-bold text-lg tracking-widest focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

            {otpError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                {otpError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("EMAIL")}
                className="w-1/3 h-12 border-2 border-slate-300 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={verifyOtp}
                disabled={otpLoading}
                className="w-2/3 h-12 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center"
              >
                {otpLoading ? "Verifying..." : "Verify & Continue"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW FORM */}
        {step === "REVIEW" && (
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
              Write Anonymous Review
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Verified for <strong className="text-slate-800">{companyName}</strong>
            </p>

            <div className="space-y-4 mb-5">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800">Work-Life Balance</span>
                <StarRating value={workLifeRating} onChange={setWorkLifeRating} />
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800">Salary & Benefits</span>
                <StarRating value={salaryRating} onChange={setSalaryRating} />
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800">Management Culture</span>
                <StarRating value={managementRating} onChange={setManagementRating} />
              </div>

              <div>
                <label htmlFor="review-desc" className="font-mono text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Detailed Review
                </label>
                <textarea
                  id="review-desc"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your genuine experience regarding culture, management, and compensation..."
                  rows={4}
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all resize-none"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-md border-slate-300"
                />
                <span className="text-xs text-slate-700 font-medium">Post anonymously (recommended)</span>
              </label>
            </div>

            {reviewError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                {reviewError}
              </div>
            )}

            <button
              type="button"
              onClick={submitReview}
              disabled={reviewLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center"
            >
              {reviewLoading ? "Submitting Review..." : "Submit Verified Review"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
