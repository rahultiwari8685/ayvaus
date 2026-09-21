"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.flirtaus.com";

export default function EmployeeRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/corporate/auth/register/employee`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      // Save corporate session
      localStorage.setItem("corporate_token", data.token);

      localStorage.setItem("corporate_user", JSON.stringify(data.user));

      router.push("/corporate/employee/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b16] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Back */}
        <Link
          href="/corporate"
          className="text-sm text-zinc-500 hover:text-white transition"
        >
          ← Back to Corporate
        </Link>

        {/* Card */}
        <div className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-7 sm:p-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-lg">
              F
            </div>

            <div>
              <h1 className="font-bold">Flirta Corporate</h1>

              <p className="text-xs text-zinc-500">Employee registration</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold">
              Create your professional profile
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Start building your career profile on Flirta.
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Phone"
              name="phone"
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 font-semibold transition"
            >
              {loading ? "Creating account..." : "Create Employee Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/corporate/login"
              className="text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>

          <div className="mt-5 pt-5 border-t border-white/[0.06] text-center">
            <p className="text-xs text-zinc-600">Are you hiring?</p>

            <Link
              href="/corporate/register/company"
              className="mt-1 inline-block text-sm text-indigo-400 hover:text-indigo-300"
            >
              Register your company →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-zinc-400">
        {label}
        {required && <span className="text-blue-400 ml-1">*</span>}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full h-11 rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition"
      />
    </div>
  );
}
