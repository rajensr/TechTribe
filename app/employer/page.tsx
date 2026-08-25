// app/employer/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Employer Solutions & Profile Claiming | TechTribe",
  description: "Claim your company profile, respond to reviews, and post job openings on TechTribe.",
};

export default function EmployerPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-[var(--background)]">
      <div className="container max-w-4xl">
        <div className="inline-flex items-center gap-1.5 bg-[var(--primary-fixed)] text-[var(--primary)] font-mono text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
          🏢 Employer Portal
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--on-background)] mb-4">
          Claim Your Company Profile &amp; Build Trust
        </h1>
        <p className="text-[var(--on-surface-variant)] text-base mb-8 max-w-2xl">
          Empower your brand, recruit top Bangladeshi IT talent, and engage directly with verified employee feedback.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-bold text-[var(--on-surface)] mb-2">Verified Badge</h3>
            <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
              Verify your corporate domain and display an official verification badge to candidates.
            </p>
          </div>

          <div className="card">
            <div className="text-2xl mb-2">💼</div>
            <h3 className="font-bold text-[var(--on-surface)] mb-2">Post Job Listings</h3>
            <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
              Reach software engineers, designers, and tech leaders actively exploring opportunities.
            </p>
          </div>

          <div className="card">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-bold text-[var(--on-surface)] mb-2">Workplace Analytics</h3>
            <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
              Access work-life, management, and salary rating analytics calibrated for Bangladesh.
            </p>
          </div>
        </div>

        <div className="card bg-[var(--primary-fixed)] border-[var(--primary)] flex flex-col md:flex-row items-center justify-between gap-6 p-8">
          <div>
            <h2 className="text-xl font-bold text-[var(--primary)] mb-1">
              Ready to post a position or claim a profile?
            </h2>
            <p className="text-sm text-[var(--on-surface-variant)]">
              Scaffold your employer account and get verified in under 2 minutes.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/employer/post-job" className="btn-primary">
              Post a Job Opening
            </Link>
            <Link href="/support" className="btn-secondary">
              Contact Verification Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
