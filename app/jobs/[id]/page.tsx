// app/jobs/[id]/page.tsx
// Job details page — displays complete job posting, contact info, apply link, requirements, and salary

import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { MOCK_JOBS, MOCK_COMPANIES } from "@/lib/mock-data";
import { MoneyIcon, CheckIcon, LocationIcon, BuildingIcon, ArrowRightIcon } from "@/components/Icons";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const resolvedParams = await params;
  const numericId = parseInt(resolvedParams.id, 10);

  let jobData: {
    id: number | string;
    jobTitle: string;
    jobDescription: string;
    salaryRangeMin: number;
    salaryRangeMax: number;
    applicationUrl?: string | null;
    contactEmail?: string | null;
    status: string;
    createdAt: Date | string;
    company: {
      id: number | string;
      companyName: string;
      location: string;
      city: string;
      techStack: string;
      websiteDomain: string;
      logoUrl?: string | null;
    };
  } | null = null;

  try {
    if (!isNaN(numericId)) {
      const dbJob = await prisma.job.findUnique({
        where: { id: numericId },
        include: { company: true },
      });
      if (dbJob) {
        jobData = {
          ...dbJob,
          company: {
            id: dbJob.company.id,
            companyName: dbJob.company.companyName,
            location: dbJob.company.location,
            city: dbJob.company.city,
            techStack: dbJob.company.techStack,
            websiteDomain: dbJob.company.websiteDomain,
            logoUrl: dbJob.company.logoUrl,
          },
        };
      }
    }
  } catch (err) {
    console.warn("DB job lookup failed, checking fallback:", err);
  }

  // Fallback to mock data if not found in DB
  if (!jobData) {
    const mockJob = MOCK_JOBS.find((j) => j.id.toString() === resolvedParams.id);
    if (mockJob) {
      const mockCompany = MOCK_COMPANIES.find((c) => c.id === mockJob.companyId) || {
        id: mockJob.companyId,
        companyName: mockJob.companyName,
        location: "Mohakhali, Dhaka",
        city: "Dhaka",
        techStack: mockJob.techStack,
        websiteDomain: "brainstation-23.com",
      };

      jobData = {
        id: mockJob.id,
        jobTitle: mockJob.jobTitle,
        jobDescription: mockJob.jobDescription,
        salaryRangeMin: mockJob.salaryRangeMin,
        salaryRangeMax: mockJob.salaryRangeMax,
        applicationUrl: "https://careers.brainstation-23.com",
        contactEmail: "hr@brainstation-23.com",
        status: mockJob.status,
        createdAt: mockJob.createdAt,
        company: mockCompany,
      };
    }
  }

  if (!jobData) {
    notFound();
  }

  const stackTags = jobData.company.techStack
    ? jobData.company.techStack.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container max-w-4xl">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/jobs" className="hover:text-blue-600">
            Jobs
          </Link>
          <span>/</span>
          <Link href={`/companies/${jobData.company.id}`} className="hover:text-blue-600">
            {jobData.company.companyName}
          </Link>
          <span>/</span>
          <span className="text-slate-900 truncate">{jobData.jobTitle}</span>
        </nav>

        {/* Job Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700 mb-3">
                <CheckIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Listing</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                {jobData.jobTitle}
              </h1>
              <p className="text-slate-600 font-semibold text-sm sm:text-base">
                <Link href={`/companies/${jobData.company.id}`} className="hover:text-blue-600 transition-colors">
                  {jobData.company.companyName}
                </Link>
                {" • "}{jobData.company.location}
              </p>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Transparent Salary
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono tabular-nums">
                {formatBDT(jobData.salaryRangeMin)} – {formatBDT(jobData.salaryRangeMax)}
              </div>
              <span className="text-xs text-slate-500 font-medium">per month (Gross BDT)</span>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {stackTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Direct Apply / Contact Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {jobData.applicationUrl ? (
                <a
                  href={jobData.applicationUrl.startsWith("http") ? jobData.applicationUrl : `https://${jobData.applicationUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs h-11 px-6 font-bold rounded-xl active:scale-95 transition-all w-full sm:w-auto inline-flex items-center justify-center gap-2"
                >
                  <span>Apply on Company Portal</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </a>
              ) : jobData.contactEmail ? (
                <a
                  href={`mailto:${jobData.contactEmail}?subject=Application for ${encodeURIComponent(jobData.jobTitle)}`}
                  className="btn-primary text-xs h-11 px-6 font-bold rounded-xl active:scale-95 transition-all w-full sm:w-auto inline-flex items-center justify-center gap-2"
                >
                  <span>Email Resume to HR</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link
                  href={`/companies/${jobData.company.id}`}
                  className="btn-primary text-xs h-11 px-6 font-bold rounded-xl active:scale-95 transition-all w-full sm:w-auto inline-flex items-center justify-center gap-2"
                >
                  <span>Explore Workplace</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Contact / How to Apply Card */}
        {(jobData.applicationUrl || jobData.contactEmail) && (
          <div className="bg-blue-50/80 border border-blue-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
            <h2 className="text-base font-extrabold text-blue-950 mb-3 flex items-center gap-2">
              <span>📬</span> How to Apply &amp; Contact HR
            </h2>
            <div className="space-y-2 text-sm text-slate-700">
              {jobData.contactEmail && (
                <p>
                  <strong>HR Email:</strong>{" "}
                  <a href={`mailto:${jobData.contactEmail}`} className="text-blue-600 hover:underline font-mono">
                    {jobData.contactEmail}
                  </a>
                </p>
              )}
              {jobData.applicationUrl && (
                <p className="truncate">
                  <strong>Application Link:</strong>{" "}
                  <a
                    href={jobData.applicationUrl.startsWith("http") ? jobData.applicationUrl : `https://${jobData.applicationUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {jobData.applicationUrl}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Job Description Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-4">Job Description &amp; Role Details</h2>
          <div className="prose text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {jobData.jobDescription}
          </div>
        </div>

        {/* Company Overview Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-mono font-bold text-xl flex items-center justify-center shadow-xs flex-shrink-0">
              {jobData.company.companyName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">{jobData.company.companyName}</h3>
              <p className="text-xs text-slate-500 font-medium">{jobData.company.location}</p>
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Link
              href={`/companies/${jobData.company.id}`}
              className="btn-secondary text-xs h-10 px-5 font-bold rounded-xl w-full sm:w-auto justify-center"
            >
              Company Profile
            </Link>
            <Link
              href={`/companies/${jobData.company.id}?write-review=true`}
              className="btn-primary text-xs h-10 px-5 font-bold rounded-xl w-full sm:w-auto justify-center"
            >
              Write Review
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
