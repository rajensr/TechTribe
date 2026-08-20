// app/employer/post-job/page.tsx
// Job Post Form — live preview panel, mandatory salary validation
// Stitch mockup: "Create New Job Posting" with live preview card below

export const metadata = {
  title: "Post a Job — TechTribe Employer",
  description: "Post transparent IT job listings with salary ranges to reach top Bangladeshi tech talent.",
};

import JobPostForm from "@/components/employer/JobPostForm";

export default function PostJobPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-[var(--background)]">
      <div className="flex">
        {/* ─── SIDEBAR ──────────────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-56 fixed left-0 top-16 h-full border-r border-[var(--outline-variant)] bg-white pt-8 px-4">
          <h2 className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest mb-4">
            Employer Dashboard
          </h2>
          <nav className="flex flex-col gap-1">
            {[
              { label: "Overview", href: "/employer", icon: "⊞" },
              { label: "Post New Job", href: "/employer/post-job", icon: "⊕", active: true },
              { label: "Active Listings", href: "/employer/listings", icon: "⊟" },
              { label: "Applications", href: "/employer/applications", icon: "👥" },
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

          {/* Job quality tip card */}
          <div className="mt-auto mb-8 p-3 bg-[var(--primary-fixed)] rounded-lg border border-[var(--primary)] border-opacity-30">
            <h3 className="font-semibold text-sm text-[var(--primary)] mb-1">Job Quality Tip</h3>
            <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
              Transparency increases application rates by 30%. High-quality engineers prefer seeing a salary range before applying.
            </p>
          </div>
        </aside>

        {/* ─── MAIN CONTENT ─────────────────────────────────────────────── */}
        <main className="flex-1 lg:ml-56 px-6 lg:px-12 max-w-4xl">
          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--on-surface)] mb-1">
              Create New Job Posting
            </h1>
            <p className="text-sm text-[var(--on-surface-variant)]">
              Reach the top 5% of tech talent in Bangladesh with a transparent listing.
            </p>
          </div>

          {/* Job form — client component */}
          <JobPostForm />
        </main>
      </div>
    </div>
  );
}
