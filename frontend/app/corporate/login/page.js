"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.flirtaus.com";

export default function CorporateLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/corporate/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("corporate_token", data.token);

      localStorage.setItem("corporate_user", JSON.stringify(data.user));

      const accountType = data.user?.accountType;

      if (accountType === "employee") {
        router.push("/corporate/employee/dashboard");
        return;
      }

      if (accountType === "company") {
        router.push("/corporate/company/dashboard");
        return;
      }

      if (accountType === "admin") {
        router.push("/corporate/admin/dashboard");
        return;
      }

      setError("This account is not a corporate account.");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b16] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href="/corporate"
          className="text-sm text-zinc-500 hover:text-white"
        >
          ← Back to Corporate
        </Link>

        <div className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 sm:p-8">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-xl">
              F
            </div>

            <h1 className="mt-5 text-2xl font-bold">Welcome back</h1>

            <p className="mt-2 text-sm text-zinc-500">
              Sign in to Flirta Corporate
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="block mb-2 text-xs font-medium text-zinc-400">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-12 rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm outline-none focus:border-blue-500/50"
              />
            </div>

            <div>
              <label className="block mb-2 text-xs font-medium text-zinc-400">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-12 rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm outline-none focus:border-blue-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 font-semibold transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-sm text-zinc-500">
              Don't have a corporate account?
            </p>

            <div className="mt-3 flex justify-center gap-5 text-sm">
              <Link
                href="/corporate/register/employee"
                className="text-blue-400 hover:text-blue-300"
              >
                Employee
              </Link>

              <Link
                href="/corporate/register/company"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Company
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
