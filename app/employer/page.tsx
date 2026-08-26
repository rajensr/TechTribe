// app/employer/page.tsx
// Employer Portal & Company Management — directly loads linked company (e.g. Brain Station 23)
// Allows posting salary-transparent jobs and managing the official workplace listing

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  BuildingIcon,
  BriefcaseIcon,
  ShieldIcon,
  CheckIcon,
  StarIcon,
  ArrowRightIcon,
} from "@/components/Icons";

export const metadata = {
  title: "Employer Solutions — TechTribe",
  description: "Manage your company profile, respond to reviews, and post salary-transparent job listings.",
};

export default async function EmployerPage() {
  const session = await getServerSession(authOptions);

  let linkedCompany: any = null;
  let activeJobs: any[] = [];

  try {
    // 1. If signed in, check if user has a claimed company
    if (session?.user) {
      const email = session.user.email;
      const user = await prisma.user.findFirst({
        where: { personalEmail: email || "" },
        include: {
          claimedCompany: {
            include: {
              reviews: true,
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

    // 2. Fallback: default to Brain Station 23 for employer demo view
    if (!linkedCompany) {
      linkedCompany = await prisma.company.findFirst({
        where: {
          OR: [
            { companyName: { contains: "Brain Station" } },
            { websiteDomain: { contains: "brainstation" } },
          ],
        },
        include: {
          reviews: true,
          jobs: { orderBy: { createdAt: "desc" } },
        },
      });
      if (linkedCompany) {
        activeJobs = linkedCompany.jobs || [];
      }
    }
  } catch (err) {
    console.warn("DB employer fetch error:", err);
  }

  const reviewCount = linkedCompany?.reviews?.length || 0;

  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container max-w-5xl">
        {/* HEADER */}
        <div className="page-header-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
              <BuildingIcon className="w-3.5 h-3.5" />
              <span>Employer Management Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {linkedCompany ? linkedCompany.companyName : "Employer Solutions"}
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Official verified workplace management &amp; hiring portal
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/employer/post-job"
              className="btn-primary text-xs h-11 px-5 font-bold rounded-xl active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <BriefcaseIcon className="w-4 h-4" />
              <span>+ Post a Job</span>
            </Link>
          </div>
        </div>

        {/* LINKED COMPANY SUMMARY CARD */}
        {linkedCompany && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold font-mono text-xl shadow-xs">
                  {linkedCompany.companyName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-slate-900">{linkedCompany.companyName}</h2>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                      <CheckIcon className="w-2.5 h-2.5" /> Verified Claim
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {linkedCompany.location} • {linkedCompany.websiteDomain}
                  </p>
                </div>
              </div>

              <Link
                href={`/companies/${linkedCompany.id}`}
                className="btn-ghost text-xs font-bold text-blue-600 hover:underline"
              >
                View Public Profile →
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xl font-extrabold text-blue-600 font-mono block mb-0.5">{reviewCount}</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Employee Reviews</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xl font-extrabold text-emerald-600 font-mono block mb-0.5">{activeJobs.length}</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Openings</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xl font-extrabold text-purple-600 font-mono block mb-0.5">100%</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Profile Health</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xl font-extrabold text-amber-600 font-mono block mb-0.5">Active</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Claim Status</span>
              </div>
            </div>
          </div>
        )}

        {/* 2 ACTION TILES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <BriefcaseIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Publish a Job Opening</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Reach thousands of verified software engineers in Bangladesh with mandatory salary transparency.
              </p>
            </div>
            <Link
              href="/employer/post-job"
              className="btn-primary w-full justify-center text-xs h-11 font-bold rounded-xl active:scale-95 transition-transform"
            >
              Post Job Listing
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <ShieldIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Public Workplace Page</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Review work-life balance scores, culture feedback, and employee sentiment on your company card.
              </p>
            </div>
            <Link
              href={linkedCompany ? `/companies/${linkedCompany.id}` : "/companies"}
              className="btn-secondary w-full justify-center text-xs h-11 font-bold rounded-xl active:scale-95 transition-transform"
            >
              Explore Public Profile
            </Link>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
          <h3 className="text-base font-extrabold text-slate-900 mb-4">
            TechTribe Verified Employer Benefits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Reach 100% verified Bangladeshi software engineers",
              "Transparent salary listings receive 3x higher applicant responses",
              "Official verified employer badge on company card & profile",
              "Highlight specialized tech stacks (React, Node.js, Python, Flutter, Go)",
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckIcon className="w-3 h-3" />
                </span>
                <span className="text-sm text-slate-700 font-medium leading-normal">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
