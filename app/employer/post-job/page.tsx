// app/employer/post-job/page.tsx
export const metadata = {
  title: "Post a Job — TechTribe Employer",
  description: "Post transparent IT job listings with salary ranges to reach top Bangladeshi tech talent.",
};

import Link from "next/link";
import JobPostForm from "@/components/employer/JobPostForm";
import { BuildingIcon, BriefcaseIcon, ShieldIcon, CheckIcon } from "@/components/Icons";

export default function PostJobPage() {
  return (
    <div className="py-10 md:py-16 flex-1 bg-[var(--background)]">
      <div className="container">
        {/* ─── MOBILE NAV BAR ──────────────────────────────────────────── */}
        <div className="lg:hidden bg-white border border-[var(--outline-variant)] rounded-xl p-3 mb-6 overflow-x-auto flex gap-2">
          {[
            { label: "Overview", href: "/employer", icon: BuildingIcon },
            { label: "Post New Job", href: "/employer/post-job", icon: BriefcaseIcon, active: true },
            { label: "Active Listings", href: "/jobs", icon: CheckIcon },
            { label: "Support", href: "/support", icon: ShieldIcon },
          ].map((item) => {
            const IconComp = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 min-h-[44px] sm:min-h-0 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-2 active:scale-95 transition-transform ${
                  item.active
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "bg-[var(--surface-container)] text-[var(--on-surface-variant)]"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── DESKTOP SIDEBAR ────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-[var(--outline-variant)] bg-white pr-6">
            <h2 className="font-mono text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wider mb-4">
              Employer Portal
            </h2>
            <nav className="flex flex-col gap-1.5 mb-8">
              {[
                { label: "Overview", href: "/employer", icon: BuildingIcon },
                { label: "Post New Job", href: "/employer/post-job", icon: BriefcaseIcon, active: true },
                { label: "Active Listings", href: "/jobs", icon: CheckIcon },
                { label: "Support", href: "/support", icon: ShieldIcon },
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 min-h-[44px] rounded-lg text-sm transition-all ${
                      item.active
                        ? "bg-[var(--primary-fixed)] text-[var(--primary)] font-semibold shadow-xs"
                        : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]"
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Job quality tip card */}
            <div className="p-4 bg-[var(--primary-fixed)] rounded-xl border border-[var(--primary)]/30">
              <h3 className="font-bold text-xs text-[var(--primary)] uppercase tracking-wider mb-1.5">
                Job Quality Tip
              </h3>
              <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
                Transparency increases application rates by 3x. High-quality engineers prefer seeing a clear salary range before applying.
              </p>
            </div>
          </aside>

          {/* ─── MAIN CONTENT ─────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0 max-w-4xl">
            {/* Page title */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--on-surface)] mb-1">
                Create New Job Posting
              </h1>
              <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">
                Reach software engineers across Bangladesh with a salary-transparent job listing.
              </p>
            </div>

            {/* Job form — client component */}
            <JobPostForm />
          </main>
        </div>
      </div>
    </div>
  );
}
