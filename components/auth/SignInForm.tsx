"use client";
// components/auth/SignInForm.tsx
// Sign in form with automatic role-based redirection for the 3 user types:
// - ADMIN -> /admin
// - EMPLOYER -> /employer
// - USER -> /dashboard (or requested callbackUrl)

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    // Fetch updated session to check user role
    const session = await getSession();
    const role = String((session?.user as { role?: string })?.role || "").toUpperCase();

    if (callbackUrl) {
      router.push(callbackUrl);
    } else if (role === "ADMIN") {
      router.push("/admin");
    } else if (role === "EMPLOYER") {
      router.push("/employer");
    } else {
      router.push("/dashboard");
    }

    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Error message */}
      {error && (
        <div
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2"
          role="alert"
        >
          <span aria-hidden="true">⚠</span>
          <p>{error}</p>
        </div>
      )}

      {/* Email / Username field */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="font-mono text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5"
        >
          Email or Username
        </label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="admin@gmail.com or user@gmail.com"
          className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
          disabled={loading}
        />
      </div>

      {/* Password field */}
      <div className="mb-6">
        <label
          htmlFor="password"
          className="font-mono text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5"
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
          className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
          disabled={loading}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || !email || !password}
        className="btn-primary w-full h-11 font-bold rounded-xl justify-center text-sm active:scale-95 transition-transform"
        id="signin-submit-btn"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Demo Accounts: <strong>user@gmail.com</strong> / <strong>admin@gmail.com</strong> (Password: <code>password1234</code>)
        </p>
      </div>
    </form>
  );
}
