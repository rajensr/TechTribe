"use client";
// app/dashboard/page.tsx
// Unified Dashboard with role-aware tabs, collapsible sidebar, and instant job posting shortcuts for Employers

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
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "jobs" | "saved" | "settings">("overview");

  const userRole = String((session?.user as { role?: string })?.role || "").toUpperCase();
  const isEmployer = userRole === "EMPLOYER" || session?.user?.email?.toLowerCase().includes("employer");

  return (
    <div className="page-wrapper bg-[var(--background)]">
      <div className="container max-w-6xl">
        {/* TOP HEADER CARD */}
        <div className="page-header-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
              <ShieldIcon className="w-3.5 h-3.5" />
              <span>{isEmployer ? "Employer & Workplace Portal" : "General Member Dashboard"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {session?.user?.name || (isEmployer ? "Brain Station HR" : "Professional")}!
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Signed in as <strong>{session?.user?.email || "employer@gmail.com"}</strong> {isEmployer && "• Verified Employer"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isEmployer ? (
              <Link
                href="/employer/post-job"
                className="btn-primary text-xs h-11 px-5 font-bold rounded-xl active:scale-95 transition-all inline-flex items-center gap-2 shadow-xs"
              >
                <BriefcaseIcon className="w-4 h-4" />
                <span>Post a Job</span>
              </Link>
            ) : (
              <Link
                href="/companies"
                className="btn-primary text-xs h-11 px-5 font-bold rounded-xl active:scale-95 transition-all inline-flex items-center gap-2 shadow-xs"
              >
                <PenIcon className="w-4 h-4" />
                <span>Write a Review</span>
              </Link>
            )}
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
                  {isEmployer ? "Employer Menu" : "Menu"}
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
                ...(isEmployer ? [{ id: "jobs", label: "Job Postings", icon: BriefcaseIcon }] : []),
                { id: "reviews", label: isEmployer ? "Company Reviews" : "My Reviews", icon: ChatIcon },
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
                {/* Employer Banner Card if Employer */}
                {isEmployer && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-extrabold text-lg text-slate-900">
                            Brain Station 23 Workplace
                          </h3>
                          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">
                            Verified Claim
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm">
                          Publish transparent salary job postings to hire top Bangladeshi software talent.
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Link
                          href="/employer/post-job"
                          className="btn-primary text-xs h-10 px-5 font-bold rounded-xl inline-flex items-center gap-1.5"
                        >
                          <BriefcaseIcon className="w-3.5 h-3.5" />
                          <span>+ Post New Job</span>
                        </Link>
                        <Link
                          href="/employer/listings"
                          className="btn-secondary text-xs h-10 px-4 font-bold rounded-xl"
                        >
                          View Listings
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs text-center">
                    <div className="text-2xl font-extrabold text-blue-600 font-mono tabular-nums mb-1">
                      {isEmployer ? "2" : "0"}
                    </div>
                    <div className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {isEmployer ? "Active Jobs" : "My Reviews"}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs text-center">
                    <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums mb-1">
                      100%
                    </div>
                    <div className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {isEmployer ? "Profile Health" : "Anonymity"}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs text-center">
                    <div className="text-2xl font-extrabold text-purple-600 font-mono tabular-nums mb-1">
                      70+
                    </div>
                    <div className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      IT Firms
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs text-center">
                    <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums mb-1">
                      {isEmployer ? "Verified" : "Active"}
                    </div>
                    <div className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Status
                    </div>
                  </div>
                </div>

                {/* Quick Discovery Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    href={isEmployer ? "/employer/post-job" : "/jobs"}
                    className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 shadow-2xs transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <BriefcaseIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                          {isEmployer ? "Create Job Posting" : "IT Job Board"}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isEmployer ? "Post salary-transparent opportunity" : "Explore salary-transparent listings"}
                        </p>
                      </div>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>

                  <Link
                    href="/employer/listings"
                    className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 shadow-2xs transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <BuildingIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {isEmployer ? "Manage Company Jobs" : "Salary Benchmarks"}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isEmployer ? "Review live applicants & listings" : "Verified market compensation data"}
                        </p>
                      </div>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </>
            )}

            {/* TAB: JOBS (For Employer) */}
            {activeTab === "jobs" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">Job Management</h3>
                    <p className="text-xs text-slate-500">Publish and manage verified openings for Brain Station 23</p>
                  </div>
                  <Link
                    href="/employer/post-job"
                    className="btn-primary text-xs h-10 px-5 font-bold rounded-xl inline-flex items-center gap-1.5"
                  >
                    <BriefcaseIcon className="w-3.5 h-3.5" />
                    <span>Post New Job</span>
                  </Link>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Active Listings Published</h4>
                    <p className="text-xs text-slate-500 mt-0.5">2 jobs live on the public job board</p>
                  </div>
                  <Link href="/employer/listings" className="btn-secondary text-xs h-9 px-4 font-bold rounded-lg">
                    Manage Active Listings →
                  </Link>
                </div>
              </div>
            )}

            {/* TAB: REVIEWS */}
            {activeTab === "reviews" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <ChatIcon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1">
                  {isEmployer ? "Company Employee Reviews" : "No Reviews Submitted Yet"}
                </h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                  {isEmployer
                    ? "View verified employee sentiment, work-life feedback, and salary ratings for your company."
                    : "Your submitted employee reviews will appear here with encrypted anonymous identifiers."}
                </p>
                <Link href={isEmployer ? "/companies" : "/companies"} className="btn-primary text-xs h-10 px-6 font-bold rounded-xl inline-flex items-center gap-2">
                  <span>{isEmployer ? "View Company Reviews" : "Write Your First Review"}</span>
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
                      value={session?.user?.email || "employer@gmail.com"}
                      className="w-full h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Member Role
                    </label>
                    <input
                      type="text"
                      disabled
                      value={isEmployer ? "Employer / Workplace Manager" : "General Member"}
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
