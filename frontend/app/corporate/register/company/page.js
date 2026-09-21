"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.flirtaus.com";

export default function CompanyRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    companyName: "",
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

    if (!form.name || !form.companyName || !form.email || !form.password) {
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
        `${API_URL}/api/corporate/auth/register/company`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            companyName: form.companyName,
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

      localStorage.setItem("corporate_token", data.token);

      localStorage.setItem("corporate_user", JSON.stringify(data.user));

      router.push("/corporate/company/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b16] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/corporate"
          className="text-sm text-zinc-500 hover:text-white transition"
        >
          ← Back to Corporate
        </Link>

        <div className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-7 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-lg font-black">
              F
            </div>

            <div>
              <h1 className="font-bold">Flirta Corporate</h1>

              <p className="text-xs text-zinc-500">Company registration</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold">Create your company account</h2>

            <p className="mt-2 text-sm text-zinc-500">
              Build your company profile and connect with talent.
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <Input
              label="Your Name"
              name="name"
              placeholder="HR Manager"
              value={form.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Company Name"
              name="companyName"
              placeholder="ABC Technologies"
              value={form.companyName}
              onChange={handleChange}
              required
            />

            <Input
              label="Official Email"
              name="email"
              type="email"
              placeholder="hr@company.com"
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
              className="w-full h-12 mt-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 font-semibold transition"
            >
              {loading ? "Creating company..." : "Create Company Account"}
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
            <p className="text-xs text-zinc-600">Looking for a job?</p>

            <Link
              href="/corporate/register/employee"
              className="mt-1 inline-block text-sm text-blue-400 hover:text-blue-300"
            >
              Register as an employee →
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
