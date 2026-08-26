// app/privacy/page.tsx
export const metadata = {
  title: "Privacy Policy — TechTribe",
  description: "Privacy Policy and Anonymous Review Protection Guidelines on TechTribe.",
};

export default function PrivacyPage() {
  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container max-w-4xl">
        <div className="page-header-card">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy &amp; Anonymity Protection
          </h1>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed p-6 sm:p-10 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-[var(--on-surface)] mb-2">1. Anonymous Submissions</h2>
            <p>
              Your identity is protected at all times. Corporate email OTP verification is used exclusively to prevent spam and verify employment authenticity; personal contact details are never attached to or displayed alongside published reviews.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--on-surface)] mb-2">2. Small Team Privacy Shield</h2>
            <p>
              For workplaces with fewer than 3 reviews, detailed comments and breakdown scores remain aggregated and shielded to prevent individual identification of early contributors.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--on-surface)] mb-2">3. Data Usage &amp; Security</h2>
            <p>
              Salary statistics and workplace ratings are aggregated across Bangladesh&apos;s IT sector to provide fair market benchmarks for software professionals. IP addresses and corporate email plain texts are never logged or stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
