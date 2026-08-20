// app/admin/page.tsx
// Admin Dashboard — claims queue, review moderation, seed companies
// Only accessible to users with role: ADMIN

export const metadata = {
  title: "Admin Dashboard — TechTribe",
};

import Link from "next/link";
import { MOCK_COMPANIES } from "@/lib/mock-data";

// Mock pending claims — real hobe DB query theke
const PENDING_CLAIMS = [
  { id: 1, companyName: "Robotry Bangladesh", requestedBy: "tanvir@robotrybd.com", submittedAt: "2024-08-15" },
  { id: 2, companyName: "Softviora", requestedBy: "riaz@softviora.vercel.app", submittedAt: "2024-08-14" },
  { id: 3, companyName: "Error Sync", requestedBy: "contact@errorsync.com", submittedAt: "2024-08-12" },
];

export default function AdminPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-[var(--background)]">
      <div className="flex">
        {/* ─── SIDEBAR ──────────────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-52 fixed left-0 top-16 h-full border-r border-[var(--outline-variant)] bg-white pt-8 px-4">
          <h2 className="font-mono text-[10px] font-semibold text-red-600 uppercase tracking-widest mb-4">
            Admin Panel
          </h2>
          <nav className="flex flex-col gap-1">
            {[
              { label: "Overview", href: "/admin", icon: "⊞", active: true },
              { label: "Pending Claims", href: "/admin/claims", icon: "🏢" },
              { label: "Review Moderation", href: "/admin/reviews", icon: "💬" },
              { label: "Company Seeder", href: "/admin/seed", icon: "🌱" },
              { label: "All Users", href: "/admin/users", icon: "👥" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2.5 rounded text-sm transition-colors ${
                  item.active
                    ? "bg-red-50 text-red-700 font-semibold"
                    : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]"
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* ─── MAIN ─────────────────────────────────────────────────────── */}
        <main className="flex-1 lg:ml-52 px-6 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--on-surface)]">Admin Dashboard</h1>
              <p className="text-sm text-[var(--on-surface-variant)]">Manage TechTribe platform</p>
            </div>
            {/* Admin indicator */}
            <div className="badge bg-red-50 text-red-700 border border-red-200 px-3 py-1.5">
              ADMIN ACCESS
            </div>
          </div>

          {/* ─── STATS ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Companies", value: MOCK_COMPANIES.length.toString(), color: "text-[var(--primary)]" },
              { label: "Pending Claims", value: PENDING_CLAIMS.length.toString(), color: "text-amber-600" },
              { label: "Total Reviews", value: "156", color: "text-emerald-600" },
              { label: "Active Jobs", value: "6", color: "text-[var(--primary)]" },
            ].map(({ label, value, color }) => (
              <div key={label} className="card text-center">
                <div className={`text-2xl font-bold mb-1 ${color}`}>{value}</div>
                <div className="font-mono text-[9px] text-[var(--on-surface-variant)] uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>

          {/* ─── PENDING CLAIMS ─────────────────────────────────────────── */}
          <section aria-labelledby="claims-heading" className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 id="claims-heading" className="text-lg font-semibold text-[var(--on-surface)]">
                Pending Company Claims ({PENDING_CLAIMS.length})
              </h2>
              <Link href="/admin/claims" className="btn-ghost text-sm">View All →</Link>
            </div>
            <div className="flex flex-col gap-3">
              {PENDING_CLAIMS.map((claim) => (
                <div key={claim.id} className="card flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm text-[var(--on-surface)]">{claim.companyName}</p>
                    <p className="font-mono text-[10px] text-[var(--on-surface-variant)] uppercase tracking-wider">
                      {claim.requestedBy} • {claim.submittedAt}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      className="px-3 py-1.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      id={`approve-claim-${claim.id}`}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="px-3 py-1.5 rounded text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                      id={`reject-claim-${claim.id}`}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── QUICK ACTIONS ──────────────────────────────────────────── */}
          <section aria-labelledby="actions-heading">
            <h2 id="actions-heading" className="text-lg font-semibold text-[var(--on-surface)] mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/admin/seed" className="card hover:border-[var(--primary)] group text-center py-6">
                <div className="text-3xl mb-2" aria-hidden="true">🌱</div>
                <h3 className="font-semibold text-sm text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">
                  Seed Companies
                </h3>
                <p className="text-xs text-[var(--on-surface-variant)] mt-1">Import 60+ BD IT firms</p>
              </Link>
              <Link href="/admin/reviews" className="card hover:border-[var(--primary)] group text-center py-6">
                <div className="text-3xl mb-2" aria-hidden="true">🛡</div>
                <h3 className="font-semibold text-sm text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">
                  Moderate Reviews
                </h3>
                <p className="text-xs text-[var(--on-surface-variant)] mt-1">Remove spam reviews</p>
              </Link>
              <Link href="/admin/claims" className="card hover:border-[var(--primary)] group text-center py-6">
                <div className="text-3xl mb-2" aria-hidden="true">✓</div>
                <h3 className="font-semibold text-sm text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">
                  Approve Claims
                </h3>
                <p className="text-xs text-[var(--on-surface-variant)] mt-1">3 pending claims</p>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
