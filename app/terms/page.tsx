// app/terms/page.tsx
export const metadata = {
  title: "Terms of Service | TechTribe",
  description: "Terms of Service for using TechTribe IT directory.",
};

export default function TermsPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-[var(--background)]">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold text-[var(--on-background)] mb-6">
          Terms of Service
        </h1>
        <div className="card space-y-4 text-sm text-[var(--on-surface-variant)] leading-relaxed">
          <h2 className="text-lg font-semibold text-[var(--on-surface)]">1. Acceptable Use</h2>
          <p>
            TechTribe provides workplace transparency for Bangladesh&apos;s IT sector. Users must submit authentic, truthful feedback based on actual employment experience.
          </p>
          <h2 className="text-lg font-semibold text-[var(--on-surface)]">2. Content Guidelines</h2>
          <p>
            Submissions containing hate speech, confidential corporate code snippets, or personal harassment will be moderated and removed immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
