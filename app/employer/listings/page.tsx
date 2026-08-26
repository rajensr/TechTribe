// app/employer/listings/page.tsx
// Employer Active Job Listings page — displays all published/active jobs for the employer's company

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import {
  BuildingIcon,
  BriefcaseIcon,
  ShieldIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@/components/Icons";

export const metadata = {
  title: "Employer Job Listings — TechTribe",
  description: "View and manage active job listings for your company.",
};

export default async function EmployerListingsPage() {
  const session = await getServerSession(authOptions);

  let linkedCompany: any = null;
  let activeJobs: any[] = [];

  try {
    if (session?.user) {
      const email = session.user.email;
      const user = await prisma.user.findFirst({
        where: { personalEmail: email || "" },
        include: {
          claimedCompany: {
            include: {
              jobs: { orderBy: { createdAt: "desc" } },
            },
          },
        },
      });

      if (user?.claimedCompany) {
        linkedCompany = user.claimedCompany;
        activeJobs = user.claimedCompany.jobs || [];
      }
    }

    // Fallback to Brain Station 23
    if (!linkedCompany) {
      linkedCompany = await prisma.company.findFirst({
        where: {
          OR: [
            { companyName: { contains: "Brain Station" } },
            { websiteDomain: { contains: "brainstation" } },
          ],
        },
        include: {
          jobs: { orderBy: { createdAt: "desc" } },
        },
      });
      if (linkedCompany) {
        activeJobs = linkedCompany.jobs || [];
      }
    }
  } catch (err) {
    console.warn("DB error in listings:", err);
  }

  const formattedJobs = activeJobs.map((job) => ({
    id: job.id,
    companyId: job.companyId,
    companyName: linkedCompany?.companyName || "Brain Station 23",
    location: linkedCompany?.location || "Dhaka",
    jobTitle: job.jobTitle,
    jobDescription: job.jobDescription,
    salaryRangeMin: job.salaryRangeMin,
    salaryRangeMax: job.salaryRangeMax,
    techStack: linkedCompany?.techStack || "React, Node.js",
    status: job.status,
    postedAt: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
  }));

  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container max-w-5xl">
        {/* HEADER */}
        <div className="page-header-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
              <BriefcaseIcon className="w-3.5 h-3.5" />
              <span>Job Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Active Job Listings
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              {linkedCompany ? `Openings posted under ${linkedCompany.companyName}` : "Your active company listings"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/employer"
              className="btn-ghost text-xs h-10 px-4 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              ← Portal Overview
            </Link>
            <Link
              href="/employer/post-job"
              className="btn-primary text-xs h-10 px-4 font-bold rounded-xl active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              <span>+ Create Job</span>
            </Link>
          </div>
        </div>

        {/* LISTINGS SECTION */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Published Openings ({formattedJobs.length})
            </h2>
            <Link href="/jobs" className="text-xs font-bold text-blue-600 hover:underline">
              View on Public Job Board →
            </Link>
          </div>

          {formattedJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {formattedJobs.map((job) => (
                <JobCard key={job.id} {...job} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-10 sm:p-14 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
                <BriefcaseIcon className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-1">
                No job postings yet
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                Publish salary-transparent job opportunities to attract top Bangladeshi software engineers.
              </p>
              <Link
                href="/employer/post-job"
                className="btn-primary text-xs h-11 px-6 font-bold rounded-xl inline-flex items-center gap-2"
              >
                <span>Publish Your First Job</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
