"use client";
// components/auth/SignInForm.tsx
// Sign in form — client component, NextAuth signIn() call kore
// Email + password, error state, loading state

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();

  // Form field state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form submit — NextAuth credentials provider e POST pathabe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // NextAuth signIn — credentials provider use korbe
    // callbackUrl: sign in er pore kothay redirect hobe
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // manual redirect korbo
    });

    setLoading(false);

    // Error handle — wrong credentials ba server error
    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    // Success — dashboard e redirect
    router.push("/dashboard");
    router.refresh(); // session update er jonno
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Error message */}
      {error && (
        <div
          className="mb-4 p-3 bg-[var(--error-container)] border border-[var(--error)] rounded-lg flex items-center gap-2"
          role="alert"
        >
          <span className="text-[var(--error)] text-sm" aria-hidden="true">⚠</span>
          <p className="text-sm text-[var(--on-error-container)]">{error}</p>
        </div>
      )}

      {/* Email field */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5"
        >
          Personal Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@gmail.com"
          className="input"
          disabled={loading}
        />
      </div>

      {/* Password field */}
      <div className="mb-6">
        <label
          htmlFor="password"
          className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="input"
          disabled={loading}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || !email || !password}
        className="btn-primary w-full justify-center"
        id="signin-submit-btn"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            {/* Loading spinner */}
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
