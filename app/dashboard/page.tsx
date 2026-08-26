"use client";

// app/dashboard/page.tsx
// Professional Member Dashboard with Collapsible Sidebar, Clean Spacing, and Live Session Stats

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  BuildingIcon,
  BriefcaseIcon,
  ChatIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  ArrowRightIcon,
  CheckIcon,
  PenIcon,
} from "@/components/Icons";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "saved" | "settings">("overview");

  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container max-w-6xl">
        {/* TOP HEADER CARD */}
        <div className="page-header-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
              <ShieldIcon className="w-3.5 h-3.5" />
              <span>General Member Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {session?.user?.name || "Professional"}!
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Signed in as <strong>{session?.user?.email || "user@gmail.com"}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/companies"
              className="btn-primary text-xs h-11 px-5 font-bold rounded-xl active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <PenIcon className="w-4 h-4" />
              <span>Write a Review</span>
            </Link>
          </div>
        </div>

        {/* DASHBOARD LAYOUT: COLLAPSIBLE SIDEBAR + MAIN CONTENT */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

          {/* COLLAPSIBLE SIDEBAR */}
          <aside
            className={`bg-white border border-slate-200 rounded-2xl p-4 shadow-xs transition-all duration-300 w-full ${
              sidebarCollapsed ? "md:w-20" : "md:w-64"
            } flex-shrink-0`}
          >
            {/* Sidebar Header & Toggle Button */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              {!sidebarCollapsed && (
                <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Menu
                </span>
              )}
              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors mx-auto md:mx-0"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-label="Toggle sidebar"
              >
                {sidebarCollapsed ? "→" : "←"}
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible">
              {[
                { id: "overview", label: "Overview", icon: BuildingIcon },
                { id: "reviews", label: "My Reviews", icon: ChatIcon },
                { id: "saved", label: "Saved Jobs", icon: BriefcaseIcon },
                { id: "settings", label: "Settings", icon: SettingsIcon },
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all w-full text-left whitespace-nowrap ${
                      isActive
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <IconComp className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* MAIN DASHBOARD CONTENT */}
          <main className="flex-1 min-w-0 w-full space-y-6">

            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <>
                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs text-center">
                    <div className="text-2xl font-extrabold text-blue-600 font-mono tabular-nums mb-1">
                      0
                    </div>
                    <div className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      My Reviews
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs text-center">
                    <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums mb-1">
                      100%
                    </div>
                    <div className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Anonymity
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs text-center">
                    <div className="text-2xl font-extrabold text-purple-600 font-mono tabular-nums mb-1">
                      70+
                    </div>
                    <div className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Companies
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs text-center">
                    <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums mb-1">
                      Active
                    </div>
                    <div className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Member Status
                    </div>
                  </div>
                </div>

                {/* Quick Action Banner */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 mb-1">
                        Contribute to Workplace Transparency
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Write an anonymous review for any software company or digital agency in Bangladesh.
                      </p>
                    </div>
                    <Link
                      href="/companies"
                      className="btn-primary text-xs h-10 px-5 font-bold rounded-xl inline-flex items-center gap-2 flex-shrink-0"
                    >
                      <span>Browse Companies</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Quick Discovery Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    href="/jobs"
                    className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 shadow-2xs transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <BriefcaseIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                          IT Job Board
                        </h4>
                        <p className="text-xs text-slate-500">Explore salary-transparent listings</p>
                      </div>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>

                  <Link
                    href="/salaries"
                    className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 shadow-2xs transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <BuildingIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                          Salary Benchmarks
                        </h4>
                        <p className="text-xs text-slate-500">Verified market compensation data</p>
                      </div>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </>
            )}

            {/* TAB: REVIEWS */}
            {activeTab === "reviews" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <ChatIcon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1">No Reviews Submitted Yet</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                  Your submitted employee reviews will appear here with encrypted anonymous identifiers.
                </p>
                <Link href="/companies" className="btn-primary text-xs h-10 px-6 font-bold rounded-xl inline-flex items-center gap-2">
                  <PenIcon className="w-3.5 h-3.5" />
                  <span>Write Your First Review</span>
                </Link>
              </div>
            )}

            {/* TAB: SAVED */}
            {activeTab === "saved" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
                  <BriefcaseIcon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1">No Saved Jobs</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                  Bookmark exciting tech roles with verified compensation to track them here.
                </p>
                <Link href="/jobs" className="btn-primary text-xs h-10 px-6 font-bold rounded-xl inline-flex items-center">
                  Explore IT Job Board
                </Link>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === "settings" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <h3 className="font-extrabold text-lg text-slate-900">Account Preferences</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Account Email
                    </label>
                    <input
                      type="text"
                      disabled
                      value={session?.user?.email || "user@gmail.com"}
                      className="w-full h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Member Role
                    </label>
                    <input
                      type="text"
                      disabled
                      value="General Member"
                      className="w-full h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-700 font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
