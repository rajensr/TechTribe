// app/companies/[id]/page.tsx
// Spacious, breathable, and clean Company Profile Page with calm visual hierarchy and zero emojis

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
    <div className="page-wrapper bg-slate-50/50">
      <div className="container max-w-5xl space-y-12 sm:space-y-16">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500" aria-label="Breadcrumb">
          <Link href="/companies" className="hover:text-blue-600 transition-colors">
            IT Directory
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate">{company.companyName}</span>
        </nav>

        {/* ─── HERO HEADER: AIRY & UNCONGESTED ───────────────────────────────── */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-mono font-bold text-3xl overflow-hidden shadow-xs">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={`${company.companyName} logo`} className="w-full h-full object-contain p-2 bg-white" />
                ) : (
                  company.companyName.charAt(0).toUpperCase()
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {company.companyName}
                  </h1>
                  {company.isVerified && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full text-xs font-bold flex items-center gap-1.5">
                      <CheckIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Verified Workplace</span>
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-sm font-medium flex items-center gap-2 flex-wrap">
                  <span className="text-slate-700 font-semibold">{company.location || company.city}</span>
                  <span>•</span>
                  <span>{company.employeeCount || "50+ Employees"}</span>
                  {company.websiteDomain && (
                    <>
                      <span>•</span>
                      <a
                        href={`https://${company.websiteDomain.replace(/^https?:\/\//, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-mono text-xs font-semibold"
                      >
                        {company.websiteDomain} ↗
                      </a>
                    </>
                  )}
                </p>

                {/* Tech Stack Pills */}
                {stackTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {stackTags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Score & Action */}
            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-5 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 font-mono font-extrabold text-2xl">
                  {overallAvg.toFixed(1)}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500 text-sm">
                    {"★★★★★".slice(0, Math.round(overallAvg))}
                    <span className="text-slate-200">{"★★★★★".slice(Math.round(overallAvg))}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-bold block mt-0.5">
                    {totalReviews} verified review{totalReviews !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <WriteReviewModalTrigger
                companyId={company.id}
                companyName={company.companyName}
                initialOpen={isWritingReview}
                className="btn-primary text-sm h-12 px-7 font-bold rounded-xl active:scale-95 transition-all shadow-xs"
              />
            </div>
          </div>
        </section>

        {/* ─── 3 PILLARS METRIC CARDS ──────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Work-Life */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-xs space-y-4">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
                Work-Life Balance
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-slate-900 font-mono">
                  {avgWorkLife.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Work hours, overtime culture, and flexible leave flexibility.
              </p>
            </div>

            {/* Salary */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-xs space-y-4">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
                Salary &amp; Compensation
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-slate-900 font-mono">
                  {avgSalary.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                On-time payment, yearly increments, and festival bonuses.
              </p>
            </div>

            {/* Management */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-xs space-y-4">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
                Leadership Culture
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-slate-900 font-mono">
                  {avgManagement.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Management transparency, technical mentorship, and growth.
              </p>
            </div>
          </div>
        </section>

        {/* ─── ACTIVE JOB OPENINGS SECTION ─────────────────────────────────── */}
        {jobs.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Open Positions ({jobs.length})
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Salary-transparent job openings at {company.companyName}
                </p>
              </div>
              <Link href="/jobs" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
                <span>All Openings</span>
                <ArrowRightIcon className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {jobs.map((job: any) => (
                <JobCard key={job.id} {...job} />
              ))}
            </div>
          </section>
        )}

        {/* ─── REVIEWS FEED SECTION ────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Verified Employee Reviews ({totalReviews})
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Anonymous feedback from verified engineers with OTP security.
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
            <div className="relative space-y-6">
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
            <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 sm:p-16 text-center shadow-xs">
              <h3 className="font-extrabold text-lg text-slate-900 mb-2">
                No reviews yet for {company.companyName}
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Work or worked here? Share your salary, management, and work-life balance feedback 100% anonymously.
              </p>
              <WriteReviewModalTrigger
                companyId={company.id}
                companyName={company.companyName}
                buttonText="Share Anonymous Review"
                className="btn-primary text-sm h-12 px-8 font-bold rounded-xl inline-flex items-center"
              />
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
