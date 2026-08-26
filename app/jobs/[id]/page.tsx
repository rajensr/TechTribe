// app/jobs/[id]/page.tsx
// Job details page — displays complete job posting, requirements, and salary details

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

  // 1. Try DB fetch first
  let jobData: {
    id: number | string;
    jobTitle: string;
    jobDescription: string;
    salaryRangeMin: number;
    salaryRangeMax: number;
    status: string;
    createdAt: Date | string;
    company: {
      id: number | string;
      companyName: string;
      location: string;
      city: string;
      techStack: string;
      websiteDomain: string;
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
          },
        };
      }
    }
  } catch (err) {
    console.warn("DB job lookup failed, checking fallback:", err);
  }

  // 2. Fallback to mock data if not found in DB
  if (!jobData) {
    const mockJob = MOCK_JOBS.find((j) => j.id.toString() === resolvedParams.id);
    if (mockJob) {
      const mockCompany = MOCK_COMPANIES.find((c) => c.id === mockJob.companyId) || {
        id: mockJob.companyId,
        companyName: mockJob.companyName,
        location: "Chattogram, Bangladesh",
        city: "Chattogram",
        techStack: mockJob.techStack,
        websiteDomain: "techtribe.xyz",
      };

      jobData = {
        id: mockJob.id,
        jobTitle: mockJob.jobTitle,
        jobDescription: mockJob.jobDescription,
        salaryRangeMin: mockJob.salaryRangeMin,
        salaryRangeMax: mockJob.salaryRangeMax,
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
    <div className="py-12 md:py-20 flex-1 bg-[var(--background)]">
      <div className="container max-w-4xl">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8" aria-label="Breadcrumb">
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
        <div className="bg-white border-2 border-slate-300 rounded-3xl p-8 sm:p-10 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700 mb-3">
                <CheckIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Listing</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                {jobData.jobTitle}
              </h1>
              <p className="text-slate-600 font-semibold text-base">
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

          <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {stackTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              href={`/companies/${jobData.company.id}`}
              className="btn-primary text-sm h-11 px-6 font-bold rounded-xl active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span>View Company & Reviews</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Job Description Card */}
        <div className="bg-white border-2 border-slate-300 rounded-3xl p-8 sm:p-10 shadow-xs mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Job Description & Role Details</h2>
          <div className="prose text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {jobData.jobDescription}
          </div>
        </div>

        {/* Company Quick Card */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-mono font-bold text-xl flex items-center justify-center shadow-md flex-shrink-0">
              {jobData.company.companyName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{jobData.company.companyName}</h3>
              <p className="text-xs text-slate-600">{jobData.company.location}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/companies/${jobData.company.id}`}
              className="px-5 py-2.5 bg-white border border-slate-300 text-slate-800 font-bold rounded-xl text-xs hover:bg-slate-100 transition-colors"
            >
              Company Profile
            </Link>
            <Link
              href={`/companies/${jobData.company.id}?write-review=true`}
              className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-colors"
            >
              Write a Review
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
