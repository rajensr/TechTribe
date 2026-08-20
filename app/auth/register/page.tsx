// app/auth/register/page.tsx
// Register page — new user account creation

export const metadata = {
  title: "Create Account — TechTribe",
  description: "Join TechTribe to write anonymous verified reviews and access exclusive salary data.",
};

import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center bg-[var(--surface-low)]">
      <div className="container">
        <div className="max-w-md mx-auto">
          <div className="card bg-white p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold font-mono">TT</span>
              </div>
              <h1 className="text-2xl font-bold text-[var(--on-surface)] mb-1">
                Join TechTribe
              </h1>
              <p className="text-sm text-[var(--on-surface-variant)]">
                Create your free account to write reviews and explore salary data.
              </p>
            </div>

            {/* Register form — client component */}
            <RegisterForm />

            {/* Already have account */}
            <div className="flex items-center gap-3 mt-6 mb-4">
              <div className="flex-1 h-px bg-[var(--outline-variant)]" />
              <span className="font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-widest">
                Already a member?
              </span>
              <div className="flex-1 h-px bg-[var(--outline-variant)]" />
            </div>

            <Link
              href="/auth/signin"
              className="btn-ghost w-full justify-center text-sm"
              id="goto-signin-link"
            >
              Sign In Instead
            </Link>
          </div>

          {/* Privacy assurance */}
          <p className="text-center font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-wider mt-4">
            We never share your personal data
          </p>
        </div>
      </div>
    </div>
  );
}
