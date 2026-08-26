"use client";
// components/employer/JobPostForm.tsx
// Job post form with mandatory salary transparency, application URL, and HR contact email fields

import { useState } from "react";
import { CheckIcon } from "@/components/Icons";

function formatBDT(amount: number) {
  if (!amount) return "৳0";
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function JobPostForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [techStack, setTechStack] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const salaryMinNum = parseInt(salaryMin, 10) || 0;
  const salaryMaxNum = parseInt(salaryMax, 10) || 0;
  const salaryValid = salaryMinNum > 0 && salaryMaxNum > 0 && salaryMaxNum >= salaryMinNum;

  const formComplete = jobTitle.trim() && jobDescription.trim() && salaryValid;
  const stackTags = techStack.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);

  const handlePublish = async (action: "DRAFT" | "PUBLISHED") => {
    if (!formComplete && action === "PUBLISHED") {
      setError("Please fill all required fields including salary range.");
      return;
    }
    setError(null);
    setLoading(true);

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
          applicationUrl,
          contactEmail,
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
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl text-center p-10 sm:p-14 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-3xl">
          ✓
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Job Published Successfully!</h2>
        <p className="text-slate-600 text-sm mb-8 max-w-md mx-auto">
          Your job opening is now live on TechTribe and visible in your employer dashboard and public job board.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="/employer/listings" className="btn-primary text-xs h-11 px-6 font-bold rounded-xl">
            View in Employer Listings →
          </a>
          <a href="/jobs" className="btn-secondary text-xs h-11 px-6 font-bold rounded-xl">
            View Public Job Board
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* Job Title */}
        <div className="mb-5">
          <label htmlFor="job-title" className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
            Job Title *
          </label>
          <input
            type="text"
            id="job-title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Full-Stack Engineer (React / Node.js)"
            className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        {/* Job Description */}
        <div className="mb-5">
          <label htmlFor="job-desc" className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
            Job Description &amp; Requirements *
          </label>
          <textarea
            id="job-desc"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Describe the role responsibilities, required qualifications, benefits, and tech stack details…"
            className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 h-40 resize-y"
            rows={6}
          />
        </div>

        {/* Tech Stack */}
        <div className="mb-5">
          <label htmlFor="tech-stack" className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
            Tech Stack Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tech-stack"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="React, Node.js, TypeScript, PostgreSQL"
            className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        {/* Application Link & HR Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="app-url" className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Application URL / Form Link
            </label>
            <input
              type="url"
              id="app-url"
              value={applicationUrl}
              onChange={(e) => setApplicationUrl(e.target.value)}
              placeholder="https://company.com/apply or Google Form"
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
              HR Contact Email
            </label>
            <input
              type="email"
              id="contact-email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="careers@brainstation-23.com"
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* Mandatory Salary Range Box */}
        <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
              <span>💰</span>
              <span>Mandatory Gross Monthly Salary Range (BDT) *</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              Transparency Standard
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            TechTribe requires verifiable salary ranges in BDT to ensure high candidate trust and applicant engagement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="salary-min" className="font-mono text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Minimum Salary (BDT)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">৳</span>
                <input
                  type="number"
                  id="salary-min"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="60000"
                  className="w-full h-11 pl-9 pr-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="salary-max" className="font-mono text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Maximum Salary (BDT)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">৳</span>
                <input
                  type="number"
                  id="salary-max"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="120000"
                  className="w-full h-11 pl-9 pr-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                  min="0"
                />
              </div>
            </div>
          </div>

          {salaryMin && salaryMax && !salaryValid && (
            <p className="font-mono text-xs text-red-600 mt-2 font-semibold">
              ⚠ Maximum salary must be greater than or equal to minimum salary.
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold mb-6">
            {error}
          </div>
        )}

        {/* Form Footer / Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            * Required fields. Posts are published instantly.
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handlePublish("DRAFT")}
              disabled={loading}
              className="btn-ghost text-xs h-11 px-5 font-bold text-slate-700 bg-slate-100 rounded-xl w-full sm:w-auto"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handlePublish("PUBLISHED")}
              disabled={loading || !formComplete}
              className="btn-primary text-xs h-11 px-7 font-bold rounded-xl w-full sm:w-auto active:scale-95 transition-all"
            >
              {loading ? "Publishing..." : "Publish Job Listing"}
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <h3 className="text-sm font-mono font-bold text-slate-500 uppercase tracking-wider mb-4">
          Live Candidate View Preview
        </h3>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h4 className="font-extrabold text-lg text-slate-900">{jobTitle || "Job Title Preview"}</h4>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Brain Station 23 • Mohakhali, Dhaka • Full-time</p>
            </div>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">
              New
            </span>
          </div>

          {stackTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {stackTags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-md text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-200 text-xs">
            <span className="font-mono font-bold text-blue-600 text-base">
              {salaryMinNum > 0 && salaryMaxNum > 0
                ? `${formatBDT(salaryMinNum)} – ${formatBDT(salaryMaxNum)} /month`
                : "৳0 – ৳0 /month"}
            </span>

            <div className="flex items-center gap-3">
              {contactEmail && (
                <span className="text-slate-600 font-medium">HR: <strong>{contactEmail}</strong></span>
              )}
              {applicationUrl && (
                <span className="text-blue-600 font-bold underline">Apply Link Attached</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
