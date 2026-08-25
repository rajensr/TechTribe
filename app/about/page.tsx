// app/about/page.tsx
import Link from "next/link";

export const metadata = {
  title: "About Us | TechTribe",
  description: "Learn about TechTribe - Bangladesh's workplace directory and IT ecosystem platform.",
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-[var(--background)]">
      <div className="container max-w-4xl">
        <div className="inline-flex items-center gap-1.5 bg-[var(--primary-fixed)] text-[var(--primary)] font-mono text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
          About TechTribe
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--on-background)] mb-6">
          Empowering Bangladesh&apos;s IT Ecosystem Through Transparency
        </h1>

        <div className="card space-y-6 text-[var(--on-surface-variant)] leading-relaxed">
          <p>
            TechTribe is Bangladesh&apos;s premier IT workplace directory and review platform. Our mission is to foster transparency, trust, and growth across software engineering, tech leadership, and digital innovation hubs in Bangladesh.
          </p>
          <p>
            Through anonymous, OTP-verified employee reviews, salary benchmarks, and tech stack tracking, we enable software developers, designers, and tech professionals to make informed career decisions while assisting companies in building strong employer brands.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-[var(--surface-low)] rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--primary)] mb-1">100% Anonymous</div>
              <div className="text-xs">OTP Verified Insights</div>
            </div>
            <div className="p-4 bg-[var(--surface-low)] rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--primary)] mb-1">Privacy Shield</div>
              <div className="text-xs">Protected Early Submissions</div>
            </div>
            <div className="p-4 bg-[var(--surface-low)] rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--primary)] mb-1">Verified Data</div>
              <div className="text-xs">Market-Calibrated Salaries</div>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--outline-variant)] flex flex-wrap gap-4">
            <Link href="/companies" className="btn-primary">
              Explore Companies
            </Link>
            <Link href="/auth/register" className="btn-secondary">
              Write a Review
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
