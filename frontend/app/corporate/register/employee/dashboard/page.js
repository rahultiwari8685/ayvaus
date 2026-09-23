"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.flirtaus.com";

export default function EmployeeDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("corporate_token");
    const storedUser = localStorage.getItem("corporate_user");

    if (!token) {
      router.replace("/corporate/login");
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("corporate_user");
      }
    }

    fetchProfile(token);
  }, [router]);

  const fetchProfile = async (token) => {
    try {
      const response = await fetch(
        `${API_URL}/api/corporate/register/employee/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (data.success) {
        setEmployee(data.employee);
      }
    } catch (error) {
      console.error("Employee profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("corporate_token");
    localStorage.removeItem("corporate_user");

    router.replace("/corporate/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b16] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />

          <p className="mt-4 text-sm text-zinc-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const completion = employee?.profileCompleted || 0;

  const verificationStatus = employee?.verificationStatus || "pending";

  const getVerification = () => {
    switch (verificationStatus) {
      case "verified":
        return {
          label: "Verified",
          text: "Your professional profile is verified.",
          className: "text-emerald-300 bg-emerald-500/10 border-emerald-400/20",
          dot: "bg-emerald-400",
        };

      case "under_review":
        return {
          label: "Under Review",
          text: "Your profile is currently being reviewed.",
          className: "text-amber-300 bg-amber-500/10 border-amber-400/20",
          dot: "bg-amber-400",
        };

      case "rejected":
        return {
          label: "Action Required",
          text:
            employee?.verificationNote || "Your verification needs attention.",
          className: "text-red-300 bg-red-500/10 border-red-400/20",
          dot: "bg-red-400",
        };

      default:
        return {
          label: "Not Submitted",
          text: "Complete your profile and submit it for verification.",
          className: "text-zinc-300 bg-white/5 border-white/10",
          dot: "bg-zinc-500",
        };
    }
  };

  const verification = getVerification();

  return (
    <div className="min-h-screen bg-[#050b16] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 h-[72px] border-b border-white/[0.07] bg-[#050b16]/90 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto h-full px-5 lg:px-8 flex items-center justify-between">
          <Link
            href="/corporate/employee/dashboard"
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black">
              F
            </div>

            <div>
              <div className="font-bold tracking-tight">Flirta</div>

              <div className="text-[8px] uppercase tracking-[0.2em] text-blue-300">
                Corporate
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold">
                {user?.name || "Employee"}
              </p>

              <p className="text-xs text-zinc-500">Employee</p>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg border border-white/10 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-5 lg:px-8 py-8">
        {/* Welcome */}
        <section>
          <p className="text-xs uppercase tracking-[0.18em] text-blue-400 font-semibold">
            Employee Dashboard
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">
            Welcome back,{" "}
            <span className="text-blue-400">{user?.name || "there"}</span>
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Manage your professional profile and discover career opportunities.
          </p>
        </section>

        {/* Profile Completion */}
        <section className="mt-8 rounded-3xl border border-blue-400/10 bg-gradient-to-br from-blue-500/[0.08] to-indigo-500/[0.04] p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold">Profile Completion</h2>

                <span className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold">
                  {completion}%
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-500">
                A complete profile helps companies understand your professional
                background.
              </p>
            </div>

            {completion < 100 && (
              <Link
                href="/corporate/register/employee/profile"
                className="shrink-0 px-5 h-11 inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition"
              >
                Complete Profile →
              </Link>
            )}

            {completion === 100 && (
              <Link
                href="/corporate/register/employee/profile"
                className="shrink-0 px-5 h-11 inline-flex items-center justify-center rounded-xl border border-white/10 hover:bg-white/5 text-sm font-semibold transition"
              >
                View Profile
              </Link>
            )}
          </div>

          <div className="mt-6 h-2 rounded-full bg-black/30 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
              style={{
                width: `${completion}%`,
              }}
            />
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Profile"
            value={`${completion}%`}
            description="Completed"
          />

          <StatCard label="Applications" value="0" description="Coming next" />

          <StatCard label="Interviews" value="0" description="Coming next" />

          <StatCard label="Offers" value="0" description="Coming next" />
        </section>

        {/* Main Grid */}
        <section className="mt-6 grid lg:grid-cols-3 gap-6">
          {/* Verification */}
          <div className="lg:col-span-2 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Verification</h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Your corporate profile verification status.
                </p>
              </div>

              <div
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 ${verification.className}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${verification.dot}`}
                />

                {verification.label}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/[0.06] bg-black/10 p-5">
              <div className="flex gap-4">
                <div
                  className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center border ${verification.className}`}
                >
                  {verificationStatus === "verified"
                    ? "✓"
                    : verificationStatus === "under_review"
                      ? "⏳"
                      : "!"}
                </div>

                <div>
                  <h3 className="font-semibold">{verification.label}</h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    {verification.text}
                  </p>
                </div>
              </div>

              {completion === 100 && verificationStatus === "pending" && (
                <Link
                  href="/corporate/employee/verification"
                  className="mt-5 inline-flex h-10 px-5 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition"
                >
                  Submit for Verification
                </Link>
              )}

              {verificationStatus === "rejected" && (
                <Link
                  href="/corporate/register/employee/profile"
                  className="mt-5 inline-flex h-10 px-5 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition"
                >
                  Update Profile
                </Link>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6">
            <h2 className="text-lg font-bold">Quick Actions</h2>

            <div className="mt-5 space-y-3">
              <QuickAction
                href="/corporate/register/employee/profile"
                title="My Profile"
                description="Manage your professional profile"
                icon="👤"
              />

              <QuickAction
                href="/corporate/employee/verification"
                title="Verification"
                description="View verification status"
                icon="✓"
              />

              <QuickAction
                href="/corporate/employee/jobs"
                title="Find Jobs"
                description="Discover opportunities"
                icon="💼"
                disabled
              />
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="mt-6 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
              Coming Next
            </span>

            <h2 className="text-lg font-bold">Career Opportunities</h2>
          </div>

          <p className="mt-3 max-w-2xl text-sm text-zinc-500 leading-relaxed">
            Once your profile is verified, you'll be able to discover relevant
            jobs, apply to opportunities, manage interviews and track offers
            from one place.
          </p>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, description }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
      <p className="text-xs text-zinc-500">{label}</p>

      <p className="mt-2 text-2xl font-black">{value}</p>

      <p className="mt-1 text-xs text-zinc-600">{description}</p>
    </div>
  );
}

function QuickAction({ href, title, description, icon, disabled = false }) {
  if (disabled) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] opacity-40 cursor-not-allowed">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold">{title}</p>

          <p className="text-xs text-zinc-600">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] hover:border-blue-400/20 hover:bg-blue-500/[0.04] transition"
    >
      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-400/10 flex items-center justify-center">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>

        <p className="text-xs text-zinc-600">{description}</p>
      </div>

      <span className="text-zinc-600">→</span>
    </Link>
  );
}
