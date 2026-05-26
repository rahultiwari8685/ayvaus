"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!form.email || !form.password) {
      return setError("Please enter email and password");
    }

    setLoading(true);

    try {
      const res = await fetch("https://api.flirtaus.com/api/serious/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success === true) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id);

        // 🔥 DAILY REWARD API
        try {
          await fetch("https://api.flirtaus.com/api/serious/daily-reward", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },
          });
        } catch (err) {
          console.log("Reward error:", err);
        }

        // 🚀 REDIRECT
        if (data.profileComplete) {
          window.location.href = "/serious/dashboard";
        } else {
          router.push("/serious/profile");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back ❤️</h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Continue your serious journey
        </p>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-black/40 border border-white/10 focus:outline-none"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-black/40 border border-white/10 focus:outline-none"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don’t have an account?{" "}
          <Link
            href="/serious/register"
            className="text-pink-500 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
