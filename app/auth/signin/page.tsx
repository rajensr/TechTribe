// app/auth/signin/page.tsx
// Sign In page — NextAuth credentials provider use korbe
// Clean form UI — DESIGN.md input style

export const metadata = {
  title: "Sign In — TechTribe",
  description: "Sign in to your TechTribe account to write reviews and access job listings.",
};

import SignInForm from "@/components/auth/SignInForm";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 md:py-16 bg-[var(--surface-low)] min-h-[calc(100vh-14rem)]">
      <div className="container flex justify-center">
        <div className="w-full max-w-md mx-auto">
          {/* Card */}
          <div className="card bg-white p-8 shadow-md rounded-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              {/* TechTribe logo mark */}
              <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold font-mono">TT</span>
              </div>
              <h1 className="text-2xl font-bold text-[var(--on-surface)] mb-1">
                Welcome back
              </h1>
              <p className="text-sm text-[var(--on-surface-variant)]">
                Sign in to your TechTribe account
              </p>
            </div>

            {/* Form — client component */}
            <SignInForm />

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[var(--outline-variant)]" />
              <span className="font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-widest">
                New to TechTribe?
              </span>
              <div className="flex-1 h-px bg-[var(--outline-variant)]" />
            </div>

            {/* Register link */}
            <Link
              href="/auth/register"
              className="btn-secondary w-full justify-center text-sm"
              id="goto-register-link"
            >
              Create an Account
            </Link>
          </div>

          {/* Privacy note */}
          <p className="text-center font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-wider mt-4">
            Your data is never shared or tracked
          </p>
        </div>
      </div>
    </div>
  );
}
