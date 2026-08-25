// app/privacy/page.tsx
export const metadata = {
  title: "Privacy Policy | TechTribe",
  description: "Privacy Policy and Anonymous Review Protection Guidelines on TechTribe.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-[var(--background)]">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold text-[var(--on-background)] mb-6">
          Privacy Policy &amp; Anonymity Protection
        </h1>
        <div className="card space-y-4 text-sm text-[var(--on-surface-variant)] leading-relaxed">
          <h2 className="text-lg font-semibold text-[var(--on-surface)]">1. Anonymous Submissions</h2>
          <p>
            Your identity is protected at all times. OTP verification is used exclusively to prevent spam and verify authenticity; personal contact details are never attached to published reviews.
          </p>
          <h2 className="text-lg font-semibold text-[var(--on-surface)]">2. Small Team Privacy Shield</h2>
          <p>
            For workplaces with fewer than 3 reviews, detailed comments and breakdown scores remain aggregated and shielded to prevent individual identification.
          </p>
          <h2 className="text-lg font-semibold text-[var(--on-surface)]">3. Data Usage</h2>
          <p>
            Salary statistics and ratings are aggregated across Bangladesh&apos;s IT sector to provide fair market benchmarks for software professionals.
          </p>
        </div>
      </div>
    </div>
  );
}
