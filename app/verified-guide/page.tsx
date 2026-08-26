// app/verified-guide/page.tsx
import Link from "next/link";
import { CheckIcon, ShieldIcon, BuildingIcon, ArrowRightIcon } from "@/components/Icons";

export const metadata = {
  title: "Verified Status Guide — TechTribe",
  description: "Learn how companies get verified on TechTribe.",
};

export default function VerifiedGuidePage() {
  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container max-w-4xl">
        <div className="page-header-card">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4">
            <CheckIcon className="w-4 h-4 text-blue-700" />
            <span>Verification System</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Verified Status Guide
          </h1>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl space-y-6 text-sm text-slate-700 leading-relaxed p-6 sm:p-10 shadow-xs">
          <p className="text-base text-[var(--on-surface)]">
            The <span className="font-bold text-[var(--primary)] inline-flex items-center gap-1"><CheckIcon className="w-4 h-4 text-[var(--primary)]" /> Verified Badge</span> on TechTribe represents authenticated company profiles and community-validated workplace data.
          </p>
          <div className="space-y-4 border-t border-[var(--outline-variant)] pt-5">
            <h2 className="text-lg font-bold text-[var(--on-surface)]">How Verification Works</h2>
            <ul className="space-y-3">
              {[
                { title: "OTP Domain Verification", desc: "Employee reviews are validated via corporate email OTP or work verification codes." },
                { title: "Claimed Employer Profiles", desc: "Official HR and leadership teams verify company registration details to claim their profile." },
                { title: "Privacy Shield Safeguards", desc: "Early reviews remain shielded until minimum sampling thresholds (3+ reviews) are met." },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[var(--primary-fixed)] text-[var(--primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-sm leading-relaxed">
                    <strong className="text-[var(--on-surface)]">{item.title}:</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link href="/employer" className="btn-primary text-sm font-semibold h-11 px-6 inline-flex items-center gap-2 active:scale-95 transition-transform">
              <BuildingIcon className="w-4 h-4 text-white" />
              <span>Claim Employer Profile</span>
            </Link>
            <Link href="/companies" className="btn-secondary text-sm font-semibold h-11 px-6 inline-flex items-center gap-2 active:scale-95 transition-transform">
              <span>Browse Directory</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
