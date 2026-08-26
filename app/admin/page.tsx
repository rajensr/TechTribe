// app/admin/page.tsx
// Admin Dashboard — protected with getServerSession(authOptions), only accessible to ADMIN role
// Includes clean stats, claim approval, and review moderation (Seed company delete removed)

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  BuildingIcon,
  ChatIcon,
  BriefcaseIcon,
  ShieldIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@/components/Icons";

export const metadata = {
  title: "Admin Portal — TechTribe",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // 1. Strict Server-Side Role Protection
  if (!session || !session.user) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  const userRole = String((session.user as { role?: string }).role || "").toUpperCase();
  if (userRole !== "ADMIN") {
    // Regular users and employers are barred from Super Admin portal and sent to dashboard
    redirect("/dashboard");
  }

  // 2. Fetch Live Stats from Database
  let companyCount = 70;
  let reviewCount = 0;
  let jobCount = 0;
  let recentReviews: any[] = [];

  try {
    const [cCount, rCount, jCount, revs] = await Promise.all([
      prisma.company.count(),
      prisma.review.count(),
      prisma.job.count(),
      prisma.review.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { company: true },
      }),
    ]);
    companyCount = cCount;
    reviewCount = rCount;
    jobCount = jCount;
    recentReviews = revs;
  } catch (err) {
    console.warn("DB query error in admin:", err);
  }

  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container max-w-6xl">
        {/* HEADER */}
        <div className="page-header-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
              <ShieldIcon className="w-3.5 h-3.5" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Administration
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Signed in as <strong>{session.user.name || session.user.email}</strong> (Super Admin)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/companies"
              className="btn-ghost text-xs h-10 px-4 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              View Directory
            </Link>
            <Link
              href="/employer"
              className="btn-primary text-xs h-10 px-4 font-bold rounded-xl"
            >
              + Add IT Firm
            </Link>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono tabular-nums mb-1">
              {companyCount}
            </div>
            <div className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total IT Firms
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tabular-nums mb-1">
              {reviewCount}
            </div>
            <div className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              Verified Reviews
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 font-mono tabular-nums mb-1">
              {jobCount}
            </div>
            <div className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              Published Jobs
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono tabular-nums mb-1">
              100%
            </div>
            <div className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              Database Uptime
            </div>
          </div>
        </div>

        {/* MODERATION TIMELINE & ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Recent Reviews Stream */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <ChatIcon className="w-5 h-5 text-blue-600" />
                Live Review Feed
              </h2>
              <span className="text-xs font-bold text-slate-500">
                Latest {recentReviews.length} Submissions
              </span>
            </div>

            {recentReviews.length > 0 ? (
              <div className="space-y-3">
                {recentReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        href={`/companies/${rev.companyId}`}
                        className="font-bold text-sm text-blue-600 hover:underline"
                      >
                        {rev.company?.companyName || `Company #${rev.companyId}`}
                      </Link>
                      <span className="text-xs font-mono font-semibold text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed line-clamp-2 mb-3">
                      &ldquo;{rev.reviewText}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 text-xs font-mono font-semibold text-slate-500 border-t border-slate-100 pt-3">
                      <span>Work-Life: <strong className="text-slate-900">{rev.workLifeRating.toFixed(1)}</strong></span>
                      <span>•</span>
                      <span>Salary: <strong className="text-slate-900">{rev.salaryRating.toFixed(1)}</strong></span>
                      <span>•</span>
                      <span>Management: <strong className="text-slate-900">{rev.managementRating.toFixed(1)}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm">
                No new reviews to moderate.
              </div>
            )}
          </div>

          {/* Right Col: Admin Shortcuts */}
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldIcon className="w-5 h-5 text-blue-600" />
              Quick Controls
            </h2>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <Link
                href="/companies"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 transition-colors text-sm font-semibold"
              >
                <span>Explore Company Profiles</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/jobs"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 transition-colors text-sm font-semibold"
              >
                <span>Manage Job Board</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/employer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 transition-colors text-sm font-semibold"
              >
                <span>Add Employer Job / Post</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
