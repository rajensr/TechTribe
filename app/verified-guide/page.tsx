// app/verified-guide/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Verified Status Guide | TechTribe",
  description: "Learn how companies get verified on TechTribe.",
};

export default function VerifiedGuidePage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-[var(--background)]">
      <div className="container max-w-3xl">
        <div className="inline-flex items-center gap-1.5 bg-[var(--primary-fixed)] text-[var(--primary)] font-mono text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
          ✓ Verification System
        </div>
        <h1 className="text-3xl font-bold text-[var(--on-background)] mb-6">
          Verified Status Guide
        </h1>
        <div className="card space-y-6 text-sm text-[var(--on-surface-variant)] leading-relaxed">
          <p>
            The <span className="font-semibold text-[var(--primary)]">✓ Verified Badge</span> on TechTribe represents authenticated company profiles and community-validated workplace data.
          </p>
          <div className="space-y-4 border-t border-[var(--outline-variant)] pt-4">
            <h2 className="text-base font-semibold text-[var(--on-surface)]">How Verification Works</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>OTP Domain Verification:</strong> Employee reviews are validated via corporate email OTP or work verification codes.</li>
              <li><strong>Claimed Employer Profiles:</strong> Official HR and leadership teams verify company registration details to claim their profile.</li>
              <li><strong>Privacy Shield Safeguards:</strong> Early reviews remain shielded until minimum sampling thresholds (3+ reviews) are met.</li>
            </ul>
          </div>
          <div className="pt-4 flex gap-3">
            <Link href="/employer" className="btn-primary text-sm">
              Claim Employer Profile
            </Link>
            <Link href="/companies" className="btn-secondary text-sm">
              Browse Directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
