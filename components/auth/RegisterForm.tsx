"use client";
// components/auth/RegisterForm.tsx
// Registration form — full name, email, password, confirm password
// API: POST /api/auth/register

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const router = useRouter();

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form validation — password match check
  const passwordMatch = !confirmPassword || password === confirmPassword;
  const passwordStrong = password.length >= 8;

  // Register submit — API call kore account create korbe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!passwordMatch) {
      setError("Passwords do not match.");
      return;
    }
    if (!passwordStrong) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    // POST /api/auth/register — backend wire-up korar somoy real API call hobe
    // Ekhane mock response dewa hocche — API tayyor hobar age UI test er jonno
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, personalEmail: email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Server theke error message diekhabo
        setError(data.error ?? "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Registration successful — auto sign in
      setSuccess(true);
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Error alert */}
      {error && (
        <div
          className="mb-4 p-3 bg-[var(--error-container)] border border-[var(--error)] rounded-lg flex items-center gap-2"
          role="alert"
        >
          <span className="text-[var(--error)]" aria-hidden="true">⚠</span>
          <p className="text-sm text-[var(--on-error-container)]">{error}</p>
        </div>
      )}

      {/* Full Name */}
      <div className="mb-4">
        <label htmlFor="fullName" className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="Tanvir Ahmed"
          className="input"
          disabled={loading}
          autoComplete="name"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="reg-email" className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5">
          Personal Email
        </label>
        <input
          type="email"
          id="reg-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@gmail.com"
          className="input"
          disabled={loading}
          autoComplete="email"
        />
        <p className="font-mono text-[9px] text-[var(--on-surface-variant)] mt-1 uppercase tracking-wider">
          Use your personal email — not corporate
        </p>
      </div>

      {/* Password */}
      <div className="mb-4">
        <label htmlFor="reg-password" className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5">
          Password
        </label>
        <input
          type="password"
          id="reg-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Min. 8 characters"
          className="input"
          disabled={loading}
          autoComplete="new-password"
          minLength={8}
        />
        {/* Password strength indicator */}
        {password && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1 bg-[var(--surface-container)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  password.length >= 12 ? "bg-emerald-500 w-full" :
                  password.length >= 8 ? "bg-amber-500 w-2/3" :
                  "bg-red-400 w-1/3"
                }`}
              />
            </div>
            <span className={`font-mono text-[9px] ${
              password.length >= 12 ? "text-emerald-600" :
              password.length >= 8 ? "text-amber-600" :
              "text-red-500"
            }`}>
              {password.length >= 12 ? "STRONG" : password.length >= 8 ? "GOOD" : "WEAK"}
            </span>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="mb-6">
        <label htmlFor="confirm-password" className="font-mono text-[10px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-widest block mb-1.5">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Repeat password"
          className={`input ${!passwordMatch ? "border-[var(--error)]" : ""}`}
          disabled={loading}
          autoComplete="new-password"
        />
        {!passwordMatch && (
          <p className="font-mono text-[9px] text-[var(--error)] mt-1">Passwords do not match</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !fullName || !email || !password || !passwordMatch || !passwordStrong}
        className="btn-primary w-full justify-center"
        id="register-submit-btn"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating account...
          </span>
        ) : (
          "Create Free Account"
        )}
      </button>
    </form>
  );
}
