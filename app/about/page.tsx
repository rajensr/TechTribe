// app/about/page.tsx
import Link from "next/link";
import { ShieldIcon, CheckIcon, MoneyIcon, ArrowRightIcon } from "@/components/Icons";

export const metadata = {
  title: "About Us — TechTribe",
  description: "Learn about TechTribe - Bangladesh's IT workplace directory and review platform.",
};

export default function AboutPage() {
  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container max-w-4xl">
        {/* ─── HEADER CARD ─────────────────────────────────────────────── */}
        <div className="page-header-card">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4">
            <ShieldIcon className="w-4 h-4 text-blue-700" />
            <span>About TechTribe</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Empowering Bangladesh&apos;s IT Ecosystem Through Transparency
          </h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl space-y-6 text-slate-700 text-base leading-relaxed p-6 sm:p-12 shadow-xs">
          <p>
            TechTribe is Bangladesh&apos;s premier IT workplace directory and review platform. Our mission is to foster transparency, trust, and growth across software engineering, tech leadership, and digital innovation hubs in Bangladesh.
          </p>
          <p>
            Through anonymous, OTP-verified employee reviews, salary benchmarks, and tech stack tracking, we enable software developers, designers, and tech professionals to make informed career decisions while assisting companies in building strong employer brands.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-5 bg-[var(--surface-low)] rounded-xl border border-[var(--outline-variant)] text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-fixed)] text-[var(--primary)] flex items-center justify-center mb-2">
                <ShieldIcon className="w-5 h-5" />
              </div>
              <div className="text-lg font-extrabold text-[var(--primary)] mb-1">100% Anonymous</div>
              <div className="text-xs text-[var(--on-surface-variant)] font-medium">OTP Verified Insights</div>
            </div>
            <div className="p-5 bg-[var(--surface-low)] rounded-xl border border-[var(--outline-variant)] text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-fixed)] text-[var(--primary)] flex items-center justify-center mb-2">
                <CheckIcon className="w-5 h-5" />
              </div>
              <div className="text-lg font-extrabold text-[var(--primary)] mb-1">Privacy Shield</div>
              <div className="text-xs text-[var(--on-surface-variant)] font-medium">Protected Early Submissions</div>
            </div>
            <div className="p-5 bg-[var(--surface-low)] rounded-xl border border-[var(--outline-variant)] text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-fixed)] text-[var(--primary)] flex items-center justify-center mb-2">
                <MoneyIcon className="w-5 h-5" />
              </div>
              <div className="text-lg font-extrabold text-[var(--primary)] mb-1">Verified Data</div>
              <div className="text-xs text-[var(--on-surface-variant)] font-medium">Market-Calibrated Salaries</div>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--outline-variant)] flex flex-wrap gap-4">
            <Link href="/companies" className="btn-primary text-sm font-semibold h-11 px-6 inline-flex items-center gap-2 active:scale-95 transition-transform">
              <span>Explore Companies</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link href="/auth/register" className="btn-secondary text-sm font-semibold h-11 px-6 inline-flex items-center gap-2 active:scale-95 transition-transform">
              <span>Write a Review</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
