"use client";

// app/support/page.tsx
export default function SupportPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-[var(--background)]">
      <div className="container max-w-2xl">
        <h1 className="text-3xl font-bold text-[var(--on-background)] mb-2">
          Contact &amp; Support
        </h1>
        <p className="text-[var(--on-surface-variant)] text-sm mb-6">
          Have a question, feedback, or need assistance with your company profile? Reach out to our support team.
        </p>

        <div className="card space-y-4">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--on-surface-variant)] mb-1">
                Your Email
              </label>
              <input type="email" placeholder="you@company.com" className="input" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--on-surface-variant)] mb-1">
                Subject
              </label>
              <input type="text" placeholder="Profile verification / Bug report" className="input" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--on-surface-variant)] mb-1">
                Message
              </label>
              <textarea rows={4} placeholder="How can we help you?" className="input py-2" />
            </div>
            <button type="submit" className="btn-primary w-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
