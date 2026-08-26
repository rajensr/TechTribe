"use client";
// components/employer/JobPostForm.tsx
// Modern split-screen job posting form with real-time sticky candidate preview,
// job tags, local draft auto-saving, and mandatory contact verification (URL or HR Email).

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckIcon, BriefcaseIcon, MoneyIcon, ArrowRightIcon } from "@/components/Icons";

function formatBDT(amount: number) {
  if (!amount) return "৳0";
  return `৳${amount.toLocaleString("en-BD")}`;
}

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const WORKPLACE_TYPES = ["On-site", "Hybrid", "Remote (BD)", "Global Remote"];
const EXPERIENCE_LEVELS = ["Entry / Junior (1-2 yrs)", "Mid-level (3-5 yrs)", "Senior (5+ yrs)", "Lead / Architect"];

export default function JobPostForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [techStack, setTechStack] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [workplaceType, setWorkplaceType] = useState("Hybrid");
  const [experienceLevel, setExperienceLevel] = useState("Mid-level (3-5 yrs)");
  const [locationCity, setLocationCity] = useState("Mohakhali, Dhaka");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-restore draft from LocalStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("techtribe_job_post_draft");
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.jobTitle) setJobTitle(parsed.jobTitle);
        if (parsed.jobDescription) setJobDescription(parsed.jobDescription);
        if (parsed.salaryMin) setSalaryMin(parsed.salaryMin);
        if (parsed.salaryMax) setSalaryMax(parsed.salaryMax);
        if (parsed.techStack) setTechStack(parsed.techStack);
        if (parsed.employmentType) setEmploymentType(parsed.employmentType);
        if (parsed.workplaceType) setWorkplaceType(parsed.workplaceType);
        if (parsed.experienceLevel) setExperienceLevel(parsed.experienceLevel);
        if (parsed.locationCity) setLocationCity(parsed.locationCity);
        if (parsed.applicationUrl) setApplicationUrl(parsed.applicationUrl);
        if (parsed.contactEmail) setContactEmail(parsed.contactEmail);
      }
    } catch {}
  }, []);

  // Auto-save draft on changes
  useEffect(() => {
    try {
      const draft = {
        jobTitle,
        jobDescription,
        salaryMin,
        salaryMax,
        techStack,
        employmentType,
        workplaceType,
        experienceLevel,
        locationCity,
        applicationUrl,
        contactEmail,
      };
      localStorage.setItem("techtribe_job_post_draft", JSON.stringify(draft));
    } catch {}
  }, [jobTitle, jobDescription, salaryMin, salaryMax, techStack, employmentType, workplaceType, experienceLevel, locationCity, applicationUrl, contactEmail]);

  // Validations
  const salaryMinNum = parseInt(salaryMin, 10) || 0;
  const salaryMaxNum = parseInt(salaryMax, 10) || 0;
  const salaryValid = salaryMinNum > 0 && salaryMaxNum > 0 && salaryMaxNum >= salaryMinNum;
  
  // Mandatory: At least one contact method (URL or HR Email) must be provided
  const hasContactMethod = Boolean(applicationUrl.trim() || contactEmail.trim());

  const formComplete = Boolean(
    jobTitle.trim() &&
    jobDescription.trim() &&
    salaryValid &&
    hasContactMethod
  );

  const stackTags = techStack.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);

  const handlePublish = async (action: "DRAFT" | "PUBLISHED") => {
    if (action === "PUBLISHED") {
      if (!jobTitle.trim() || !jobDescription.trim()) {
        setError("Please enter the job title and detailed role description.");
        return;
      }
      if (!salaryValid) {
        setError("Please provide a valid gross monthly salary range (Min and Max in BDT).");
        return;
      }
      if (!hasContactMethod) {
        setError("Mandatory: You must provide either an Application URL or an HR Contact Email (or both).");
        return;
      }
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: `${jobTitle.trim()} (${experienceLevel})`,
          jobDescription: `${jobDescription.trim()}\n\n• Employment Type: ${employmentType}\n• Workplace: ${workplaceType}\n• Location: ${locationCity}`,
          salaryRangeMin: salaryMinNum,
          salaryRangeMax: salaryMaxNum,
          techStack,
          applicationUrl: applicationUrl.trim() || null,
          contactEmail: contactEmail.trim() || null,
          status: action,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to post job.");
        setLoading(false);
        return;
      }

      // Clear draft on successful publish
      localStorage.removeItem("techtribe_job_post_draft");
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please check your network and try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl text-center p-10 sm:p-16 shadow-xs max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ✓
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Job Opening Published!</h2>
        <p className="text-slate-600 text-sm mb-8 leading-relaxed">
          Your transparent salary job listing is now live on the public job board and indexed under your company profile.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/employer/listings" className="btn-primary text-xs h-11 px-6 font-bold rounded-xl w-full sm:w-auto">
            View in Employer Listings →
          </Link>
          <Link href="/jobs" className="btn-secondary text-xs h-11 px-6 font-bold rounded-xl w-full sm:w-auto">
            View Public Board
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* ─── LEFT COLUMN: FORM INPUTS (7 Cols) ─────────────────────────────── */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        
        {/* Job Title */}
        <div>
          <label htmlFor="job-title" className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
            Job Title *
          </label>
          <input
            type="text"
            id="job-title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Full-Stack Engineer"
            className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        {/* 3 Job Dimension Dropdowns / Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-mono text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
              Employment
            </label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
            >
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
              Workplace Mode
            </label>
            <select
              value={workplaceType}
              onChange={(e) => setWorkplaceType(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
            >
              {WORKPLACE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
            >
              {EXPERIENCE_LEVELS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location / City */}
        <div>
          <label htmlFor="location-city" className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
            Location / Office Area
          </label>
          <input
            type="text"
            id="location-city"
            value={locationCity}
            onChange={(e) => setLocationCity(e.target.value)}
            placeholder="e.g. Mohakhali, Dhaka (or Remote)"
            className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label htmlFor="tech-stack" className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
            Tech Stack Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tech-stack"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="React, Node.js, TypeScript, PostgreSQL, AWS"
            className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Job Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="job-desc" className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Job Description &amp; Requirements *
            </label>
            <span className="text-[11px] text-slate-400 font-mono">Supports multi-line formatting</span>
          </div>
          <textarea
            id="job-desc"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="About the Role:&#10;• We are hiring a Full-Stack Engineer...&#10;&#10;Key Responsibilities:&#10;• Build scalable REST APIs and responsive UI...&#10;&#10;Requirements:&#10;• 3+ years experience with React and Node.js..."
            className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 h-44 resize-y leading-relaxed font-sans"
            rows={7}
          />
        </div>

        {/* ─── MANDATORY SALARY RANGE BOX ─────────────────────────────────── */}
        <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
              <span>Mandatory Gross Monthly Salary Range (BDT) *</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              Transparency Standard
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
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
              Maximum salary must be greater than or equal to minimum salary.
            </p>
          )}
        </div>

        {/* ─── MANDATORY CONTACT / SUBMISSION SECTION ──────────────────────── */}
        <div className={`p-6 rounded-2xl border transition-colors ${
          hasContactMethod ? "bg-slate-50 border-slate-200" : "bg-amber-50/70 border-amber-300"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-slate-900">
              Candidate Application Channel *
            </h3>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
              hasContactMethod ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}>
              {hasContactMethod ? "Contact Method Provided" : "At least 1 Required"}
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Provide at least one method (or both) for software engineers to apply or send their resume.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="app-url" className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Application URL / Form Link
              </label>
              <input
                type="url"
                id="app-url"
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                placeholder="https://careers.brainstation-23.com/apply"
                className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                HR Contact Email
              </label>
              <input
                type="email"
                id="contact-email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="careers@brainstation-23.com"
                className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium">
            Draft is automatically cached in your browser.
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
              className="btn-primary text-xs h-11 px-7 font-bold rounded-xl w-full sm:w-auto active:scale-95 transition-all shadow-xs"
            >
              {loading ? "Publishing..." : "Publish Job Listing"}
            </button>
          </div>
        </div>

      </div>

      {/* ─── RIGHT COLUMN: STICKY LIVE PREVIEW (5 Cols) ────────────────────── */}
      <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              Live Candidate Card Preview
            </span>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Real-time
            </span>
          </div>

          <article className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  {jobTitle || "Senior Software Engineer"}
                </h4>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Brain Station 23 • {locationCity} • {employmentType} ({workplaceType})
                </p>
              </div>
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold flex-shrink-0">
                New
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-md text-[11px] font-semibold">
                {experienceLevel}
              </span>
              {stackTags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-md text-[11px] font-semibold">
                  {tag}
                </span>
              ))}
            </div>

            {/* Salary */}
            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Gross Monthly
                </span>
                <span className="font-mono font-bold text-blue-600 text-sm sm:text-base tabular-nums">
                  {salaryMinNum > 0 && salaryMaxNum > 0
                    ? `${formatBDT(salaryMinNum)} – ${formatBDT(salaryMaxNum)}`
                    : "৳0 – ৳0"}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-full text-[11px] font-bold">
                <CheckIcon className="w-3 h-3 text-blue-600" />
                <span>Verified Salary</span>
              </div>
            </div>

            {/* Application Method Indicator in Preview */}
            <div className="pt-2 text-xs text-slate-500 space-y-1">
              {applicationUrl && (
                <p className="truncate text-blue-600 font-medium">
                  🔗 Apply URL: <span className="underline">{applicationUrl}</span>
                </p>
              )}
              {contactEmail && (
                <p className="text-slate-600 font-medium">
                  ✉ HR Email: <strong>{contactEmail}</strong>
                </p>
              )}
            </div>
          </article>
        </div>

        {/* Quality tip card */}
        <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-5 text-xs text-slate-600 space-y-1.5">
          <span className="font-bold text-blue-900 block font-mono text-[11px] uppercase tracking-wider">
            Hiring Best Practice
          </span>
          <p className="leading-relaxed">
            Tech jobs with transparent salary ranges in Bangladesh experience 3x higher qualified applicant conversion compared to hidden salary listings.
          </p>
        </div>
      </div>

    </div>
  );
}
