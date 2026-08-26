// app/companies/[id]/page.tsx
// Modern, lively, eye-friendly Company Profile Page with spacious cards, vivid accents, verified metrics, and interactive review feed

import { MOCK_COMPANIES, MOCK_REVIEWS, MOCK_JOBS } from "@/lib/mock-data";
import ReviewCard from "@/components/ReviewCard";
import JobCard from "@/components/JobCard";
import PrivacyShieldOverlay from "@/components/PrivacyShieldOverlay";
import { CheckIcon, StarIcon, LocationIcon, ShieldIcon, BriefcaseIcon, ArrowRightIcon } from "@/components/Icons";
import WriteReviewModalTrigger from "@/components/WriteReviewModalTrigger";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ "write-review"?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  let companyName = "Company";

  try {
    const numericId = parseInt(resolvedParams.id, 10);
    if (!isNaN(numericId)) {
      const dbComp = await prisma.company.findUnique({ where: { id: numericId } });
      if (dbComp) companyName = dbComp.companyName;
    }
  } catch (err) {
    console.warn("DB metadata lookup error:", err);
  }

  return {
    title: `${companyName} Reviews & Salaries — TechTribe`,
    description: `Read verified employee reviews, salary data, and job listings for ${companyName} in Bangladesh.`,
  };
}

export default async function CompanyProfilePage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isWritingReview = resolvedSearchParams["write-review"] === "true";
  const numericId = parseInt(resolvedParams.id, 10);

  // 1. Fetch Company from DB
  let company: any = null;
  let reviews: any[] = [];
  let jobs: any[] = [];

  try {
    if (!isNaN(numericId)) {
      company = await prisma.company.findUnique({
        where: { id: numericId },
        include: {
          reviews: {
            include: { user: true },
            orderBy: { createdAt: "desc" },
          },
          jobs: {
            where: { status: "PUBLISHED" },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (company) {
        reviews = company.reviews.map((r: any) => ({
          id: r.id,
          companyId: r.companyId,
          isAnonymous: r.isAnonymous,
          authorName: r.isAnonymous ? "Anonymous Engineer" : (r.user?.fullName || "Verified Employee"),
          workLifeRating: r.workLifeRating,
          salaryRating: r.salaryRating,
          managementRating: r.managementRating,
          reviewText: r.reviewText,
          voteScore: r.voteScore,
          createdAt: r.createdAt.toISOString(),
        }));

        jobs = company.jobs.map((j: any) => ({
          id: j.id,
          companyId: j.companyId,
          companyName: company.companyName,
          location: company.location,
          jobTitle: j.jobTitle,
          jobDescription: j.jobDescription,
          salaryRangeMin: j.salaryRangeMin,
          salaryRangeMax: j.salaryRangeMax,
          techStack: company.techStack,
          status: j.status,
          postedAt: j.createdAt.toISOString(),
        }));
      }
    }
  } catch (err) {
    console.warn("DB fetch failed, checking mock fallback:", err);
  }

  // 2. Fallback if not found in DB
  if (!company) {
    const mock = MOCK_COMPANIES.find(
      (c) =>
        (!isNaN(numericId) && c.id === numericId) ||
        c.id.toString() === resolvedParams.id ||
        c.companyName.toLowerCase().replace(/[^a-z0-9]/g, "-") === resolvedParams.id.toLowerCase()
    );

    if (mock) {
      company = {
        ...mock,
        reviewCount: mock.reviewCount || 0,
      };
      reviews = MOCK_REVIEWS.filter((r) => r.companyId === mock.id);
      jobs = MOCK_JOBS.filter((j) => j.companyId === mock.id);
    }
  }

  if (!company) notFound();

  // Ratings calculation
  const totalReviews = reviews.length;
  const avgWorkLife = totalReviews
    ? reviews.reduce((sum, r) => sum + (r.workLifeRating || 0), 0) / totalReviews
    : (company.workLifeRating || 4.2);
  const avgSalary = totalReviews
    ? reviews.reduce((sum, r) => sum + (r.salaryRating || 0), 0) / totalReviews
    : (company.salaryRating || 4.0);
  const avgManagement = totalReviews
    ? reviews.reduce((sum, r) => sum + (r.managementRating || 0), 0) / totalReviews
    : (company.managementRating || 4.4);

  const overallAvg = totalReviews
    ? (avgWorkLife + avgSalary + avgManagement) / 3
    : (company.overallRating || 4.5);

  const stackTags = company.techStack
    ? company.techStack.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  const privacyShieldActive = totalReviews < 3 && totalReviews > 0;

  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container max-w-5xl space-y-8 sm:space-y-10">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500" aria-label="Breadcrumb">
          <Link href="/companies" className="hover:text-blue-600 transition-colors">
            IT Directory
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate">{company.companyName}</span>
        </nav>

        {/* ─── HERO CARD: AIRY, LIVELY, VIBRANT ─────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
          {/* Subtle lively background accent gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/80 via-purple-50/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            
            {/* Left: Logo & Company Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              {/* Logo / Monogram */}
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md font-mono font-bold text-3xl overflow-hidden ring-4 ring-blue-50">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={`${company.companyName} logo`} className="w-full h-full object-contain p-2 bg-white" />
                ) : (
                  company.companyName.charAt(0).toUpperCase()
                )}
              </div>

              {/* Names & Meta */}
              <div>
                <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {company.companyName}
                  </h1>
                  {company.isVerified && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                      <CheckIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Verified Workplace</span>
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-xs sm:text-sm font-medium flex items-center gap-2 mb-3">
                  <LocationIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{company.location || company.city}</span>
                  <span>•</span>
                  <span>{company.employeeCount || "50+ Employees"}</span>
                  {company.websiteDomain && (
                    <>
                      <span>•</span>
                      <a
                        href={`https://${company.websiteDomain.replace(/^https?:\/\//, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-mono text-xs"
                      >
                        {company.websiteDomain} ↗
                      </a>
                    </>
                  )}
                </p>

                {/* Tech Stack Pills */}
                {stackTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {stackTags.map((tag: string) => (
                      <span key={tag} className="px-2.5 py-1 bg-slate-100/90 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Lively Score Display & Post Review CTA */}
            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 font-mono font-extrabold text-2xl shadow-2xs">
                  {overallAvg.toFixed(1)}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    {"★★★★★".slice(0, Math.round(overallAvg))}
                    <span className="text-slate-300">{"★★★★★".slice(Math.round(overallAvg))}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-bold">
                    {totalReviews} verified review{totalReviews !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <WriteReviewModalTrigger
                companyId={company.id}
                companyName={company.companyName}
                initialOpen={isWritingReview}
                className="btn-primary text-xs sm:text-sm h-11 px-6 font-bold rounded-xl active:scale-95 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* ─── 3 PILLARS METRIC CARDS ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Work-Life */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Work-Life Balance
              </span>
              <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
                🌿
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {avgWorkLife.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(avgWorkLife / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Salary & Benefits */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Salary &amp; Compensation
              </span>
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                💳
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {avgSalary.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(avgSalary / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Management */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Leadership &amp; Mentorship
              </span>
              <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold">
                🎯
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {avgManagement.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${(avgManagement / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* ─── ACTIVE JOB OPENINGS SECTION ─────────────────────────────────── */}
        {jobs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BriefcaseIcon className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Open Roles at {company.companyName} ({jobs.length})
                </h2>
              </div>
              <Link href="/jobs" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
                <span>View All Jobs</span>
                <ArrowRightIcon className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job: any) => (
                <JobCard key={job.id} {...job} />
              ))}
            </div>
          </div>
        )}

        {/* ─── REVIEWS FEED SECTION ────────────────────────────────────────── */}
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Verified Employee Reviews ({totalReviews})
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Evaluated by software engineers with OTP authentication and privacy shielding.
              </p>
            </div>

            <WriteReviewModalTrigger
              companyId={company.id}
              companyName={company.companyName}
              buttonText="Write a Review"
              className="text-xs font-bold text-blue-600 hover:underline"
            />
          </div>

          {reviews.length > 0 ? (
            <div className="relative space-y-5">
              {reviews.map((rev: any) => (
                <ReviewCard key={rev.id} {...rev} />
              ))}
              {privacyShieldActive && (
                <PrivacyShieldOverlay
                  reviewCount={totalReviews}
                  threshold={3}
                  companyId={company.id}
                />
              )}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-10 sm:p-14 text-center shadow-xs">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 text-xl font-mono font-bold">
                ✍️
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-1">
                No reviews yet for {company.companyName}
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                Work or worked here? Be the first to share your salary, management, and work-life balance feedback 100% anonymously.
              </p>
              <WriteReviewModalTrigger
                companyId={company.id}
                companyName={company.companyName}
                buttonText="Share Anonymous Review"
                className="btn-primary text-xs h-11 px-7 font-bold rounded-xl inline-flex items-center"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
