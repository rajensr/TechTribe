"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/Icons";

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container max-w-2xl">
        {/* ─── HEADER CARD ─────────────────────────────────────────────── */}
        <div className="page-header-card">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Contact &amp; Support
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Have a question, feedback, or need assistance with your company profile verification? Reach out to our team.
          </p>
        </div>

        {submitted && (
          <div className="mb-6 bg-emerald-700 text-white p-4 rounded-xl shadow-md flex items-center gap-3 animate-fade-in">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <CheckIcon className="w-4 h-4 text-white" />
            </span>
            <div className="text-sm">
              <p className="font-bold">Message Sent!</p>
              <p className="text-xs text-emerald-100">Our support team will get back to you within 24 hours.</p>
            </div>
          </div>
        )}

        <div className="bg-white border-1.5 border-slate-300 rounded-2xl p-8 sm:p-12 shadow-xs space-y-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-1.5">
                Your Email
              </label>
              <input type="email" required placeholder="you@company.com" className="input h-11 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-1.5">
                Subject
              </label>
              <input type="text" required placeholder="Profile verification / Bug report" className="input h-11 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-1.5">
                Message
              </label>
              <textarea rows={4} required placeholder="How can we help you?" className="input p-3 text-sm" />
            </div>
            <button type="submit" className="btn-primary w-full h-11 text-sm font-semibold active:scale-95 transition-transform">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
