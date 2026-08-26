// app/companies/[id]/page.tsx
// Modern, eye-friendly Company Profile Page with mobile-optimized layout, ratings, and reviews

import { MOCK_COMPANIES, MOCK_REVIEWS, MOCK_JOBS } from "@/lib/mock-data";
import ReviewCard from "@/components/ReviewCard";
import JobCard from "@/components/JobCard";
import PrivacyShieldOverlay from "@/components/PrivacyShieldOverlay";
import { CheckIcon, StarIcon, LocationIcon, ShieldIcon, BriefcaseIcon } from "@/components/Icons";
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
      <div className="container max-w-5xl">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/companies" className="hover:text-blue-600">
            Companies
          </Link>
          <span>/</span>
          <span className="text-slate-900 truncate">{company.companyName}</span>
        </nav>

        {/* COMPANY HERO CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm font-mono font-bold text-2xl overflow-hidden">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={`${company.companyName} logo`} className="w-full h-full object-contain p-2 bg-white" />
                ) : (
                  company.companyName.charAt(0).toUpperCase()
                )}
              </div>

              {/* Title, Location & Stack */}
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {company.companyName}
                  </h1>
                  {company.isVerified && (
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckIcon className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                <p className="text-slate-500 text-xs sm:text-sm font-medium flex items-center gap-1.5 mb-3.5">
                  <LocationIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{company.location || company.city}</span>
                  <span>•</span>
                  <span>{company.employeeCount || "50+ Team"}</span>
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {stackTags.map((tag: string) => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Overall Rating & Action Button */}
            <div className="flex sm:flex-row md:flex-col items-center sm:items-start md:items-end justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  {overallAvg.toFixed(1)}
                </span>
                <span className="text-amber-400 text-2xl">★</span>
                <span className="text-xs text-slate-500 font-semibold">
                  ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
                </span>
              </div>

              <WriteReviewModalTrigger
                companyId={company.id}
                companyName={company.companyName}
                initialOpen={isWritingReview}
                className="btn-primary text-xs sm:text-sm h-11 px-5 font-bold rounded-xl active:scale-95 transition-all w-full sm:w-auto"
              />
            </div>
          </div>
        </div>

        {/* 3-METRIC SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-2xs">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Work-Life Balance
            </span>
            <span className="text-2xl font-extrabold text-blue-600 font-mono">
              {avgWorkLife.toFixed(1)} <span className="text-xs text-slate-400">/ 5.0</span>
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-2xs">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Salary & Benefits
            </span>
            <span className="text-2xl font-extrabold text-blue-600 font-mono">
              {avgSalary.toFixed(1)} <span className="text-xs text-slate-400">/ 5.0</span>
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-2xs">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Management Culture
            </span>
            <span className="text-2xl font-extrabold text-blue-600 font-mono">
              {avgManagement.toFixed(1)} <span className="text-xs text-slate-400">/ 5.0</span>
            </span>
          </div>
        </div>

        {/* OPEN ROLES SECTION */}
        {jobs.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                Active Openings at {company.companyName}
              </h2>
              <Link href="/jobs" className="text-xs font-bold text-blue-600 hover:underline">
                All Jobs →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job: any) => (
                <JobCard key={job.id} {...job} />
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS SECTION */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Employee Reviews ({totalReviews})
            </h2>
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
            <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-10 text-center">
              <p className="text-slate-600 text-sm font-medium mb-4">
                No reviews yet for {company.companyName}. Be the first to share your experience anonymously!
              </p>
              <WriteReviewModalTrigger
                companyId={company.id}
                companyName={company.companyName}
                buttonText="Write the First Review"
                className="btn-primary text-xs h-11 px-6 font-bold rounded-xl inline-flex"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
