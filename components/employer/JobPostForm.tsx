"use client";
// components/employer/JobPostForm.tsx
// Live preview job post form — stitch mockup match
// Salary mandatory — form block hobe without salary

import { useState } from "react";

// BDT format helper
function formatBDT(amount: number) {
  if (!amount) return "৳0";
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function JobPostForm() {
  // Form field state
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [techStack, setTechStack] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Salary validation — dono field fill kora mandatory
  const salaryMinNum = parseInt(salaryMin) || 0;
  const salaryMaxNum = parseInt(salaryMax) || 0;
  const salaryValid = salaryMinNum > 0 && salaryMaxNum > 0 && salaryMaxNum >= salaryMinNum;

  // Form complete kina — publish button enable hobe kobe
  const formComplete = jobTitle.trim() && jobDescription.trim() && salaryValid;

  // Tech stack tags — preview e use
  const stackTags = techStack.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);

  // Publish job — API call
  const handlePublish = async (action: "DRAFT" | "PUBLISHED") => {
    if (!formComplete && action === "PUBLISHED") {
      setError("Please fill all required fields including salary range.");
      return;
    }
    setError(null);
    setLoading(true);

    // POST /api/jobs/create — backend wire-up korar somoy real API call hobe
    try {
      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          jobDescription,
          salaryRangeMin: salaryMinNum,
          salaryRangeMax: salaryMaxNum,
          techStack,
          status: action,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to post job.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card text-center py-12">
        <div className="text-5xl mb-4" aria-hidden="true">✅</div>
        <h2 className="text-xl font-bold text-[var(--on-surface)] mb-2">Job Published!</h2>
        <p className="text-[var(--on-surface-variant)] text-sm mb-6">
          Your listing is now live and visible to thousands of IT professionals.
        </p>
        <a href="/employer/listings" className="btn-primary text-sm">
          View Active Listings →
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="card mb-8">
        {/* ─── JOB TITLE ──────────────────────────────────────────────── */}
        <div className="mb-5">
          <label htmlFor="job-title" className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5">
            Job Title *
          </label>
          <input
            type="text"
            id="job-title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Full-Stack Engineer"
            className="input"
          />
        </div>

        {/* ─── JOB DESCRIPTION ────────────────────────────────────────── */}
        <div className="mb-5">
          <label htmlFor="job-desc" className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5">
            Job Description *
          </label>
          <textarea
            id="job-desc"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Describe the role, responsibilities, and required stack…"
            className="input resize-none h-36"
            rows={5}
          />
        </div>

        {/* ─── TECH STACK ─────────────────────────────────────────────── */}
        <div className="mb-5">
          <label htmlFor="tech-stack" className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5">
            Tech Stack (comma-separated)
          </label>
          <input
            type="text"
            id="tech-stack"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="React, Node.js, PostgreSQL"
            className="input"
          />
        </div>

        {/* ─── SALARY RANGE (mandatory) ───────────────────────────────── */}
        {/* Blue-bordered card — stitch mockup er exact */}
        <div className={`p-4 rounded-lg border-l-4 ${salaryValid ? "border-emerald-500 bg-emerald-50" : "border-[var(--primary)] bg-[var(--primary-fixed)]"}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[var(--primary)]" aria-hidden="true">⚙</span>
              <h3 className="font-semibold text-[var(--primary)]">Salary Range (BDT) *</h3>
            </div>
            <button type="button" className="text-[var(--on-surface-variant)] hover:text-[var(--primary)]" aria-label="Info">ⓘ</button>
          </div>
          <p className="text-xs text-[var(--on-surface-variant)] mb-4">
            Specify the annual or monthly gross salary range in BDT.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Min salary */}
            <div>
              <label htmlFor="salary-min" className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5">
                Minimum Salary
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] font-mono text-sm" aria-hidden="true">৳</span>
                <input
                  type="number"
                  id="salary-min"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="0.00"
                  className="input pl-8"
                  min="0"
                />
              </div>
            </div>
            {/* Max salary */}
            <div>
              <label htmlFor="salary-max" className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5">
                Maximum Salary
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] font-mono text-sm" aria-hidden="true">৳</span>
                <input
                  type="number"
                  id="salary-max"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="0.00"
                  className="input pl-8"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Salary mandatory error */}
          {salaryMin && salaryMax && !salaryValid && (
            <p className="font-mono text-[10px] text-[var(--error)] mt-2 flex items-center gap-1">
              <span aria-hidden="true">⚠</span>
              Mandatory salary fields must be filled correctly.
            </p>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-[var(--error-container)] border border-[var(--error)] rounded-lg" role="alert">
            <p className="text-sm text-[var(--on-error-container)]">{error}</p>
          </div>
        )}

        {/* ─── ACTION BUTTONS ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--outline-variant)]">
          <p className="font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-wider flex items-center gap-1">
            <span aria-hidden="true">⟳</span>
            Saves automatically
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handlePublish("DRAFT")}
              disabled={loading}
              className="btn-ghost text-sm"
              id="save-draft-btn"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handlePublish("PUBLISHED")}
              disabled={loading || !formComplete}
              className="btn-primary text-sm"
              id="publish-job-btn"
            >
              {loading ? "Publishing..." : "Publish Job"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── LIVE PREVIEW ───────────────────────────────────────────────── */}
      {/* Real-time preview of the job card — stitch mockup */}
      <div>
        <h2 className="font-semibold text-[var(--on-surface)] mb-4">Live Preview</h2>
        <div className="card">
          <div className="flex items-start gap-4">
            {/* Company logo placeholder */}
            <div className="w-10 h-10 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-low)] flex items-center justify-center flex-shrink-0">
              <span className="font-mono text-xs text-[var(--on-surface-variant)]">Co</span>
            </div>

            <div className="flex-1">
              {/* Job title preview */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-[var(--on-surface)]">
                  {jobTitle || "Job Title Preview"}
                </span>
                {formComplete && (
                  <span className="badge text-[10px] px-2 py-0.5">New</span>
                )}
              </div>

              {/* Meta */}
              <p className="font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-wider mb-3">
                TechTribe HQ • Dhaka, BD • Full-time
              </p>

              {/* Stack tags */}
              {stackTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {stackTags.map((tag) => (
                    <span key={tag} className="badge">{tag}</span>
                  ))}
                </div>
              )}

              {/* Salary range preview */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--primary)] text-sm">
                  {salaryMinNum > 0 && salaryMaxNum > 0
                    ? `${formatBDT(salaryMinNum)} – ${formatBDT(salaryMaxNum)}/month`
                    : "৳0 – ৳0 /month"}
                </span>
                <div className="flex items-center gap-1 text-[var(--primary)]">
                  <span className="text-xs" aria-hidden="true">✓</span>
                  <span className="font-mono text-[10px] uppercase tracking-wide">Verified Salary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
