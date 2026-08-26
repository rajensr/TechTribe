// app/employer/page.tsx
import Link from "next/link";
import { BuildingIcon, BriefcaseIcon, ShieldIcon, CheckIcon } from "@/components/Icons";

export const metadata = {
  title: "Employer Solutions — TechTribe",
  description: "Claim your company profile, respond to reviews, and post salary-transparent job listings.",
};

export default function EmployerPage() {
  return (
    <div className="py-16 md:py-24 flex-1 bg-[var(--background)]">
      <div className="container max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-[var(--primary-fixed)] text-[var(--primary)] font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4">
          <BuildingIcon className="w-4 h-4 text-[var(--primary)]" />
          <span>Employer Portal</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--on-background)] mb-3">
          Employer Solutions
        </h1>
        
        <p className="text-[var(--on-surface-variant)] text-base sm:text-lg mb-10 md:mb-12 max-w-2xl leading-relaxed">
          Claim your official company profile to verify your company badge, manage official tech stack info, and attract top Bangladeshi engineering talent.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Claim Profile Card */}
          <div className="card border-[var(--outline-variant)] hover:border-[var(--primary)] transition-all p-7 sm:p-8">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary-fixed)] text-[var(--primary)] flex items-center justify-center mb-4">
              <ShieldIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[var(--on-surface)] mb-2">
              Claim Company Profile
            </h2>
            <p className="text-sm text-[var(--on-surface-variant)] mb-6 leading-relaxed">
              Verify ownership of your firm to display a verified employer checkmark, respond to reviews, and update tech stacks.
            </p>
            <Link
              href="/auth/register?role=EMPLOYER"
              className="btn-primary w-full justify-center text-sm font-semibold h-11 active:scale-95 transition-transform"
            >
              Get Verified Profile
            </Link>
          </div>

          {/* Post Job Card */}
          <div className="card border-[var(--outline-variant)] hover:border-[var(--primary)] transition-all p-7 sm:p-8">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary-fixed)] text-[var(--primary)] flex items-center justify-center mb-4">
              <BriefcaseIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[var(--on-surface)] mb-2">
              Post a Job Opening
            </h2>
            <p className="text-sm text-[var(--on-surface-variant)] mb-6 leading-relaxed">
              Reach thousands of active software engineers. Mandatory salary transparency builds high candidate trust.
            </p>
            <Link
              href="/employer/post-job"
              className="btn-secondary w-full justify-center text-sm font-semibold h-11 active:scale-95 transition-transform"
            >
              Post Job Listing
            </Link>
          </div>
        </div>

        {/* Benefits list */}
        <div className="card bg-white p-8 sm:p-10">
          <h3 className="text-lg font-bold text-[var(--on-surface)] mb-4">
            Why Partner with TechTribe?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Reach 100% verified Bangladeshi software engineers",
              "Transparent salary listings receive 3x higher applicant responses",
              "Official employer response rights on company reviews",
              "Highlight tech stacks (React, Node.js, Python, Flutter, Go)",
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--primary-fixed)] text-[var(--primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckIcon className="w-3.5 h-3.5" />
                </span>
                <span className="text-sm text-[var(--on-surface)] font-medium leading-normal">
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
