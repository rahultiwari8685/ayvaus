"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.flirtaus.com";

export default function CompanyDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("corporate_token")
      : null;

  useEffect(() => {
    if (!token) {
      router.push("/corporate/login");
      return;
    }

    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/corporate/company/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load company profile");
      }

      setCompany(data.company || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("corporate_token");
    localStorage.removeItem("corporate_user");

    router.push("/corporate/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading company dashboard...</p>
        </div>
      </div>
    );
  }

  const companyName = company?.companyName || "Your Company";

  const profileCompleted = company?.profileCompleted || 0;

  const verificationStatus = company?.verificationStatus || "pending";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* SIDEBAR + CONTENT */}

      <div className="flex min-h-screen">
        {/* SIDEBAR */}

        <aside className="hidden lg:flex w-64 shrink-0 border-r border-slate-800 bg-slate-950 flex-col">
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold">
              Flirta <span className="text-blue-500">Corporate</span>
            </h1>

            <p className="text-xs text-slate-500 mt-1">Company Workspace</p>
          </div>

          <nav className="p-4 space-y-1 flex-1">
            <NavItem
              label="Dashboard"
              active
              icon="▦"
              onClick={() => router.push("/corporate/company/dashboard")}
            />

            <NavItem
              label="Company Profile"
              icon="◉"
              onClick={() => router.push("/corporate/company/profile")}
            />

            <NavItem
              label="Verification"
              icon="✓"
              onClick={() => router.push("/corporate/company/verification")}
            />

            <NavItem label="Jobs" icon="▤" disabled />

            <NavItem label="Applicants" icon="♙" disabled />
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-900"
            >
              ← Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN */}

        <main className="flex-1 min-w-0">
          {/* TOP BAR */}

          <header className="border-b border-slate-800 bg-slate-950/90">
            <div className="px-6 lg:px-8 py-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Company Dashboard
                </p>

                <h2 className="text-xl font-semibold mt-1">
                  Welcome back, {companyName}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/corporate/company/profile")}
                  className="hidden sm:block px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-sm"
                >
                  Edit Profile
                </button>

                <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-semibold">
                  {companyName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 lg:p-8 max-w-7xl">
            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
                {error}
              </div>
            )}

            {/* PROFILE COMPLETION */}

            <section className="rounded-2xl border border-slate-800 bg-gradient-to-r from-blue-950/40 to-slate-900/40 p-6 lg:p-7 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-blue-400 font-medium">
                        COMPANY PROFILE
                      </p>

                      <h3 className="text-xl font-semibold mt-1">
                        Complete your company profile
                      </h3>
                    </div>

                    <span className="text-2xl font-bold text-blue-400">
                      {profileCompleted}%
                    </span>
                  </div>

                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{
                        width: `${Math.min(profileCompleted, 100)}%`,
                      }}
                    />
                  </div>

                  <p className="text-sm text-slate-400 mt-3">
                    A complete company profile helps attract relevant
                    professional talent.
                  </p>
                </div>

                <button
                  onClick={() => router.push("/corporate/company/profile")}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold whitespace-nowrap"
                >
                  Complete Profile →
                </button>
              </div>
            </section>

            {/* VERIFICATION */}

            <section
              className={`rounded-2xl border p-6 mb-6 ${
                verificationStatus === "verified"
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : verificationStatus === "rejected"
                    ? "border-red-500/30 bg-red-500/5"
                    : verificationStatus === "under_review"
                      ? "border-blue-500/30 bg-blue-500/5"
                      : "border-amber-500/30 bg-amber-500/5"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
                      verificationStatus === "verified"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : verificationStatus === "rejected"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {verificationStatus === "verified"
                      ? "✓"
                      : verificationStatus === "under_review"
                        ? "◷"
                        : "!"}
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">
                      Company Verification
                    </p>

                    <h3 className="text-lg font-semibold capitalize mt-1">
                      {verificationStatus.replace("_", " ")}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {getVerificationMessage(verificationStatus)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/corporate/company/verification")}
                  className="px-5 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-sm"
                >
                  {verificationStatus === "verified"
                    ? "View Verification"
                    : "Manage Verification"}
                </button>
              </div>
            </section>

            {/* STATS */}

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
              <StatCard
                title="Active Jobs"
                value="0"
                description="Currently published"
                icon="▤"
              />

              <StatCard
                title="Applicants"
                value="0"
                description="Applications received"
                icon="♙"
              />

              <StatCard
                title="Shortlisted"
                value="0"
                description="Candidates shortlisted"
                icon="★"
              />

              <StatCard
                title="Interviews"
                value="0"
                description="Upcoming interviews"
                icon="◷"
              />
            </div>

            {/* QUICK ACTIONS */}

            <section className="mb-7">
              <div className="mb-5">
                <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                  Workspace
                </p>

                <h3 className="text-2xl font-bold mt-1">Quick Actions</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <ActionCard
                  title="Company Profile"
                  description="Update your company information, industry and business details."
                  icon="◉"
                  onClick={() => router.push("/corporate/company/profile")}
                />

                <ActionCard
                  title="Create a Job"
                  description="Publish opportunities and start finding relevant candidates."
                  icon="+"
                  disabled
                />

                <ActionCard
                  title="Manage Applicants"
                  description="Review applicants, shortlist candidates and manage hiring."
                  icon="♙"
                  disabled
                />
              </div>
            </section>

            {/* GETTING STARTED */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                    Getting Started
                  </p>

                  <h3 className="text-xl font-semibold mt-1">
                    Build your hiring workspace
                  </h3>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <GettingStarted
                  number="01"
                  title="Complete Company Profile"
                  text="Add your company details and establish your business identity."
                  done={profileCompleted >= 100}
                />

                <GettingStarted
                  number="02"
                  title="Verify Company"
                  text="Submit company information for verification."
                  done={verificationStatus === "verified"}
                />

                <GettingStarted
                  number="03"
                  title="Post Your First Job"
                  text="Create a job opportunity and start receiving applications."
                  done={false}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function NavItem({ label, icon, active, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
        active
          ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
          : disabled
            ? "text-slate-700 cursor-not-allowed"
            : "text-slate-400 hover:text-white hover:bg-slate-900"
      }`}
    >
      <span className="w-5 text-center">{icon}</span>

      {label}

      {disabled && (
        <span className="ml-auto text-[10px] text-slate-700">Soon</span>
      )}
    </button>
  );
}

function StatCard({ title, value, description, icon }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 hover:border-slate-700 transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4">{description}</p>
    </div>
  );
}

function ActionCard({ title, description, icon, onClick, disabled }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`text-left rounded-2xl border p-6 transition ${
        disabled
          ? "border-slate-800 bg-slate-900/20 opacity-50 cursor-not-allowed"
          : "border-slate-800 bg-slate-900/40 hover:border-blue-500/40 hover:bg-slate-900"
      }`}
    >
      <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl mb-5">
        {icon}
      </div>

      <h4 className="font-semibold">{title}</h4>

      <p className="text-sm text-slate-400 mt-2 leading-6">{description}</p>

      {disabled ? (
        <p className="text-xs text-slate-600 mt-4">Coming soon</p>
      ) : (
        <p className="text-sm text-blue-400 mt-4">Open →</p>
      )}
    </button>
  );
}

function GettingStarted({ number, title, text, done }) {
  return (
    <div className="flex gap-4">
      <div
        className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold ${
          done
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            : "bg-slate-800 text-slate-400 border border-slate-700"
        }`}
      >
        {done ? "✓" : number}
      </div>

      <div>
        <h4 className="font-medium">{title}</h4>

        <p className="text-sm text-slate-500 mt-1 leading-6">{text}</p>
      </div>
    </div>
  );
}

function getVerificationMessage(status) {
  switch (status) {
    case "verified":
      return "Your company is verified and ready for corporate hiring.";

    case "under_review":
      return "Your verification request is currently being reviewed.";

    case "rejected":
      return "Your verification requires attention before it can be approved.";

    default:
      return "Complete your profile and submit your company for verification.";
  }
}
