"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendOtp = async () => {
    setError("");
    setMessage("");

    if (!form.email) {
      return setError("Please enter your email.");
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://api.flirtaus.com/api/serious/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setMessage("OTP has been sent to your email.");
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Network Error");
    }

    setLoading(false);
  };

  const resetPassword = async () => {
    setError("");
    setMessage("");

    if (!form.otp) {
      return setError("Please enter OTP");
    }

    if (!form.password) {
      return setError("Please enter new password");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://api.flirtaus.com/api/serious/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            otp: form.otp,
            password: form.password,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setMessage("Password updated successfully.");

        setTimeout(() => {
          router.push("/serious/login");
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Network Error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center">Forgot Password 🔒</h1>

        <p className="text-center text-gray-400 mt-2 mb-8">
          Reset your Flirtaus account password
        </p>

        {error && (
          <div className="mb-5 rounded-xl bg-red-500/20 p-3 text-center text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl bg-green-500/20 p-3 text-center text-green-300">
            {message}
          </div>
        )}

        {/* STEP 1 */}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your Email"
              className="w-full rounded-xl border border-white/10 bg-black/30 p-3 outline-none mb-6"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <button
              disabled={loading}
              onClick={sendOtp}
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-red-500 py-3 font-semibold transition hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full rounded-xl border border-white/10 bg-black/30 p-3 outline-none mb-4"
              value={form.otp}
              onChange={(e) =>
                setForm({
                  ...form,
                  otp: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full rounded-xl border border-white/10 bg-black/30 p-3 outline-none mb-4"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-xl border border-white/10 bg-black/30 p-3 outline-none mb-6"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
            />

            <button
              disabled={loading}
              onClick={resetPassword}
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-red-500 py-3 font-semibold transition hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

        <button
          onClick={() => router.push("/serious/login")}
          className="mt-6 w-full text-center text-pink-400 hover:underline"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
