// app/companies/[id]/page.tsx
// Company Profile page — review list, privacy shield, jobs tab, quick stats
// PRD Section 5: privacy shield, triple-metric reviews, job board

import { MOCK_COMPANIES, MOCK_REVIEWS, MOCK_JOBS } from "@/lib/mock-data";
import ReviewCard from "@/components/ReviewCard";
import JobCard from "@/components/JobCard";
import PrivacyShieldOverlay from "@/components/PrivacyShieldOverlay";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

// Static metadata — SEO er jonno company name use korbo
export async function generateMetadata({ params }: PageProps) {
  // Backend wire-up korar somoy ekhane DB query hobe
  const company = MOCK_COMPANIES.find((c) => c.id === parseInt(params.id));
  if (!company) return { title: "Company Not Found | TechTribe" };
  return {
    title: `${company.companyName} Reviews & Salaries — TechTribe`,
    description: `Read verified employee reviews, salary data, and job listings for ${company.companyName} in Bangladesh.`,
  };
}

export default function CompanyProfilePage({ params }: PageProps) {
  // Company lookup — Backend e Prisma query hobe
  const company = MOCK_COMPANIES.find((c) => c.id === parseInt(params.id));
  if (!company) notFound();

  // Company related reviews
  const reviews = MOCK_REVIEWS.filter((r) => r.companyId === company.id);

  // Company related jobs
  const jobs = MOCK_JOBS.filter((j) => j.companyId === company.id);

  // Privacy shield active kina check — PRD: 3 er kom hole hide
  const PRIVACY_THRESHOLD = 3;
  const privacyShieldActive = company.reviewCount < PRIVACY_THRESHOLD;

  // Average ratings — review theke calculate
  const avgWorkLife = reviews.length
    ? reviews.reduce((sum, r) => sum + r.workLifeRating, 0) / reviews.length
    : 0;
  const avgSalary = reviews.length
    ? reviews.reduce((sum, r) => sum + r.salaryRating, 0) / reviews.length
    : 0;
  const avgManagement = reviews.length
    ? reviews.reduce((sum, r) => sum + r.managementRating, 0) / reviews.length
    : 0;

  // Stack tags — display er jonno
  const stackTags = company.techStack.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[var(--background)]">
      <div className="container">
        {/* ─── COMPANY HEADER ──────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-10 pb-8 border-b border-[var(--outline-variant)]">
          {/* Logo */}
          <div className="w-20 h-20 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-low)] flex items-center justify-center flex-shrink-0">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={`${company.companyName} logo`} className="w-full h-full object-contain p-2" />
            ) : (
              <span className="font-mono font-bold text-2xl text-[var(--primary)]">
                {company.companyName.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1">
            {/* Name + verified */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--on-background)]">
                {company.companyName}
              </h1>
              {company.isVerified && (
                <span
                  className="text-[var(--primary)] text-lg"
                  title="Verified Company"
                  aria-label="Verified"
                >
                  ✓
                </span>
              )}
            </div>

            {/* Short description placeholder */}
            <p className="text-[var(--on-surface-variant)] text-sm mb-3 max-w-2xl">
              {company.location} — verified employer profile on TechTribe.
            </p>

            {/* Tags — city, employee count */}
            <div className="flex flex-wrap gap-2 mb-3">
              {stackTags.slice(0, 3).map((tag) => (
                <span key={tag} className="badge">{tag}</span>
              ))}
              {company.employeeCount && company.employeeCount !== "UNKNOWN" && (
                <span className="badge bg-[var(--surface-container)] text-[var(--on-surface-variant)]">
                  {company.employeeCount} Employees
                </span>
              )}
            </div>

            {/* Website link */}
            {company.websiteDomain && (
              <a
                href={`https://${company.websiteDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-[var(--primary)] hover:underline uppercase tracking-wider"
              >
                {company.websiteDomain} ↗
              </a>
            )}
          </div>

          {/* Right — review count + write review CTA */}
          <div className="flex flex-col items-end gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="font-mono text-2xl font-bold text-[var(--primary)]">
                {privacyShieldActive ? "— —" : (company.overallRating?.toFixed(1) ?? "—")}
              </div>
              <div className="font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-wider">
                {privacyShieldActive
                  ? `${company.reviewCount} Reviews (Protected)`
                  : `${company.reviewCount} Reviews`}
              </div>
            </div>
            <Link
              href={`/companies/${company.id}?write-review=true`}
              className="btn-primary text-sm"
              id={`write-review-btn-${company.id}`}
            >
              ✍ Write a Review
            </Link>
          </div>
        </div>

        {/* ─── MAIN CONTENT GRID ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── LEFT SIDEBAR: Quick Stats ─────────────────────────────── */}
          <aside className="lg:col-span-1 flex flex-col gap-6">
            {/* Quick Stats card */}
            <div className="card">
              <h2 className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest mb-4">
                Quick Stats
              </h2>
              <dl className="flex flex-col gap-3">
                {company.city && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-[var(--on-surface-variant)]">HQ</dt>
                    <dd className="font-medium text-[var(--on-surface)]">{company.city}, BD</dd>
                  </div>
                )}
                {company.employeeCount && company.employeeCount !== "UNKNOWN" && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-[var(--on-surface-variant)]">Team Size</dt>
                    <dd className="font-medium text-[var(--on-surface)]">{company.employeeCount}</dd>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <dt className="text-[var(--on-surface-variant)]">Claimed</dt>
                  <dd className={`font-medium ${company.isClaimed ? "text-emerald-600" : "text-[var(--on-surface-variant)]"}`}>
                    {company.isClaimed ? "Yes" : "Not yet"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Rating breakdown — if not privacy shielded */}
            {!privacyShieldActive && reviews.length > 0 && (
              <div className="card">
                <h2 className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest mb-4">
                  Rating Breakdown
                </h2>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Work-Life", val: avgWorkLife },
                    { label: "Salary", val: avgSalary },
                    { label: "Management", val: avgManagement },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-[var(--on-surface-variant)] uppercase tracking-wider">{label}</span>
                        <span className="font-bold text-[var(--primary)]">{val.toFixed(1)}</span>
                      </div>
                      <div className="h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--primary)] rounded-full"
                          style={{ width: `${((val - 1) / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jobs CTA sidebar */}
            {jobs.length > 0 && (
              <div className="card bg-[var(--primary-fixed)] border-[var(--primary)]">
                <h2 className="font-semibold text-[var(--primary)] mb-2">
                  Join {company.companyName}
                </h2>
                <p className="text-sm text-[var(--on-surface-variant)] mb-4">
                  Be one of the first to shape the future of this growing team.
                </p>
                <Link
                  href={`#jobs`}
                  className="btn-primary text-sm w-full justify-center"
                  id={`view-jobs-btn-${company.id}`}
                >
                  View {jobs.length} Open {jobs.length === 1 ? "Role" : "Roles"}
                </Link>
              </div>
            )}
          </aside>

          {/* ─── RIGHT: Reviews + Jobs ──────────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* ─── EMPLOYEE REVIEWS ──────────────────────────────────── */}
            <section aria-labelledby="reviews-heading">
              <div className="flex items-center justify-between mb-6">
                <h2
                  id="reviews-heading"
                  className="text-xl font-semibold text-[var(--on-surface)]"
                >
                  Employee Reviews
                </h2>
                {company.isVerified && (
                  <div className="flex items-center gap-1 font-mono text-[10px] text-[var(--primary)] uppercase tracking-wider">
                    <span aria-hidden="true">✓</span>
                    Privacy Shield Active
                  </div>
                )}
              </div>

              {/* Privacy shield OR real reviews */}
              {privacyShieldActive ? (
                <PrivacyShieldOverlay
                  companyName={company.companyName}
                  companyId={company.id}
                  reviewCount={company.reviewCount}
                />
              ) : reviews.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      id={review.id}
                      isAnonymous={review.isAnonymous}
                      authorName={review.authorName}
                      workLifeRating={review.workLifeRating}
                      salaryRating={review.salaryRating}
                      managementRating={review.managementRating}
                      reviewText={review.reviewText}
                      voteScore={review.voteScore}
                      createdAt={review.createdAt}
                    />
                  ))}
                </div>
              ) : (
                // No reviews yet
                <div className="card text-center py-12">
                  <div className="text-4xl mb-3" aria-hidden="true">💬</div>
                  <h3 className="font-semibold text-[var(--on-surface)] mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-sm text-[var(--on-surface-variant)] mb-4">
                    Be the first to share your experience at {company.companyName}.
                  </p>
                  <Link href={`/companies/${company.id}?write-review=true`} className="btn-primary text-sm">
                    Write a Review
                  </Link>
                </div>
              )}
            </section>

            {/* ─── OPEN JOBS ──────────────────────────────────────────── */}
            {jobs.length > 0 && (
              <section className="mt-10" aria-labelledby="jobs-heading" id="jobs">
                <h2
                  id="jobs-heading"
                  className="text-xl font-semibold text-[var(--on-surface)] mb-6"
                >
                  Open Positions
                </h2>
                <div className="flex flex-col gap-4">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      id={job.id}
                      jobTitle={job.jobTitle}
                      companyName={company.companyName}
                      companyId={company.id}
                      location={company.location}
                      salaryRangeMin={job.salaryRangeMin}
                      salaryRangeMax={job.salaryRangeMax}
                      techStack={job.techStack}
                      postedAt={job.createdAt}
                      isNew={Date.now() - new Date(job.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
