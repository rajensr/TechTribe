// app/dashboard/page.tsx
// User Dashboard — review history, verify workplace modal trigger
// Note: Resume Score & Saved Jobs SKIPPED (not in PRD)

export const metadata = {
  title: "Dashboard — TechTribe",
  description: "Your TechTribe professional dashboard.",
};

import Link from "next/link";
import { MOCK_REVIEWS, MOCK_COMPANIES } from "@/lib/mock-data";
import ReviewCard from "@/components/ReviewCard";
import WorkplaceVerifyButton from "@/components/dashboard/WorkplaceVerifyButton";

export default function DashboardPage() {
  // Mock: logged in user er reviews — real hobe session.user.id use kore
  // Backend wire-up korar somoy Prisma query hobe
  const myReviews = MOCK_REVIEWS.slice(0, 2); // mock: 2 ta review dekhabo

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[var(--background)]">
      <div className="flex">
        {/* ─── SIDEBAR ──────────────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-52 fixed left-0 top-16 h-full border-r border-[var(--outline-variant)] bg-white pt-8 px-4">
          <h2 className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest mb-4">
            Professional Dashboard
          </h2>
          <nav className="flex flex-col gap-1">
            {[
              { label: "Overview", href: "/dashboard", icon: "⊞", active: true },
              { label: "My Reviews", href: "/dashboard/reviews", icon: "💬" },
              { label: "Saved Jobs", href: "/dashboard/saved", icon: "💼" },
              { label: "Settings", href: "/dashboard/settings", icon: "⚙" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors ${
                  item.active
                    ? "bg-[var(--primary-fixed)] text-[var(--primary)] font-semibold"
                    : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]"
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* ─── MAIN CONTENT ─────────────────────────────────────────────── */}
        <main className="flex-1 lg:ml-52 px-6 lg:px-12 max-w-5xl">
          {/* Welcome */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--on-surface)] mb-1">
                Welcome back! {/* Real: {session.user.name} */}
              </h1>
              <p className="text-sm text-[var(--on-surface-variant)]">
                Your career overview for Bangladesh&apos;s tech market.
              </p>
            </div>

            {/* Write a review CTA */}
            <WorkplaceVerifyButton />
          </div>

          {/* ─── STATS CARDS ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Reviews Written", value: myReviews.length.toString(), icon: "✍" },
              { label: "Helpful Votes", value: "35", icon: "👍" },
              { label: "Companies Viewed", value: "12", icon: "🏢" },
              { label: "Jobs Saved", value: "0", icon: "💼" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="card text-center">
                <div className="text-2xl mb-1" aria-hidden="true">{icon}</div>
                <div className="text-xl font-bold text-[var(--primary)]">{value}</div>
                <div className="font-mono text-[9px] text-[var(--on-surface-variant)] uppercase tracking-widest">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* ─── MY REVIEWS ───────────────────────────────────────────── */}
          <section aria-labelledby="my-reviews-heading">
            <div className="flex items-center justify-between mb-5">
              <h2 id="my-reviews-heading" className="text-lg font-semibold text-[var(--on-surface)]">
                My Reviews
              </h2>
              <Link href="/companies" className="btn-ghost text-sm">
                Write a New Review →
              </Link>
            </div>

            {myReviews.length > 0 ? (
              <div className="flex flex-col gap-4">
                {myReviews.map((review) => {
                  const company = MOCK_COMPANIES.find((c) => c.id === review.companyId);
                  return (
                    <div key={review.id}>
                      {/* Company name above review */}
                      {company && (
                        <Link
                          href={`/companies/${company.id}`}
                          className="font-mono text-[10px] font-semibold text-[var(--primary)] uppercase tracking-widest mb-2 block hover:underline"
                        >
                          {company.companyName}
                        </Link>
                      )}
                      <ReviewCard
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
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card text-center py-10">
                <div className="text-4xl mb-3" aria-hidden="true">✍</div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">
                  No reviews yet
                </h3>
                <p className="text-sm text-[var(--on-surface-variant)] mb-4">
                  Share your workplace experience anonymously and help fellow engineers.
                </p>
                <Link href="/companies" className="btn-primary text-sm">
                  Browse Companies to Review
                </Link>
              </div>
            )}
          </section>

          {/* ─── QUICK LINKS ──────────────────────────────────────────── */}
          <section className="mt-10" aria-labelledby="quick-links-heading">
            <h2 id="quick-links-heading" className="text-lg font-semibold text-[var(--on-surface)] mb-4">
              Quick Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/jobs" className="card hover:border-[var(--primary)] group">
                <div className="text-2xl mb-2" aria-hidden="true">💼</div>
                <h3 className="font-semibold text-sm text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">
                  Browse Jobs
                </h3>
                <p className="text-xs text-[var(--on-surface-variant)]">
                  Salary-transparent IT jobs across Bangladesh
                </p>
              </Link>
              <Link href="/companies" className="card hover:border-[var(--primary)] group">
                <div className="text-2xl mb-2" aria-hidden="true">🔍</div>
                <h3 className="font-semibold text-sm text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">
                  Explore Companies
                </h3>
                <p className="text-xs text-[var(--on-surface-variant)]">
                  60+ verified Bangladeshi IT firms
                </p>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
