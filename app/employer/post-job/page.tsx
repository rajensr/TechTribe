// app/employer/post-job/page.tsx
// Spacious, modern, uncluttered Job Creation Page with Split-Screen Sticky Live Preview

import Link from "next/link";
import JobPostForm from "@/components/employer/JobPostForm";
import { BriefcaseIcon, ShieldIcon, CheckIcon } from "@/components/Icons";

export const metadata = {
  title: "Post a Job — TechTribe Employer",
  description: "Post transparent IT job listings with verified salary ranges to reach top Bangladeshi tech talent.",
};

export default function PostJobPage() {
  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container max-w-6xl">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/employer" className="hover:text-blue-600 transition-colors">
            Employer Portal
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Post New Job</span>
        </nav>

        {/* PAGE HEADER */}
        <div className="page-header-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
              <BriefcaseIcon className="w-3.5 h-3.5" />
              <span>Verified Hiring</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Salary-Transparent Job Opening
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Reach thousands of active software engineers in Bangladesh with mandatory compensation transparency.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/employer/listings"
              className="btn-secondary text-xs h-10 px-5 font-bold rounded-xl"
            >
              View Active Listings
            </Link>
          </div>
        </div>

        {/* MAIN FORM COMPONENT */}
        <JobPostForm />
      </div>
    </div>
  );
}
