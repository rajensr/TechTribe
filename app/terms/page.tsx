// app/terms/page.tsx
export const metadata = {
  title: "Terms of Service — TechTribe",
  description: "Terms of Service for using TechTribe IT directory.",
};

export default function TermsPage() {
  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container max-w-4xl">
        <div className="page-header-card">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed p-6 sm:p-10 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-[var(--on-surface)] mb-2">1. Acceptable Use</h2>
            <p>
              TechTribe provides workplace transparency for Bangladesh&apos;s IT sector. Users must submit authentic, truthful feedback based on actual employment experience.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--on-surface)] mb-2">2. Content Guidelines</h2>
            <p>
              Submissions containing hate speech, confidential corporate code snippets, or personal harassment will be moderated and removed immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
