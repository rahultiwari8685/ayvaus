"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    looking_for: "",
    intent: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    setError("");

    // ✅ Basic validation
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.age ||
      !form.gender ||
      !form.looking_for ||
      !form.intent
    ) {
      return setError("Please fill all required fields");
    }

    setLoading(true);

    try {
      const res = await fetch("https://api.flirtaus.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
        }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);

        // ✅ Direct dashboard (no separate profile page needed now)
        router.push("/serious/dashboard");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Serious Profile ❤️
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-3 rounded-lg bg-black/40 border border-white/10"
          onChange={(e) => handleChange("name", e.target.value)}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-lg bg-black/40 border border-white/10"
          onChange={(e) => handleChange("email", e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-3 rounded-lg bg-black/40 border border-white/10"
          onChange={(e) => handleChange("password", e.target.value)}
        />

        {/* AGE */}
        <input
          type="number"
          placeholder="Age"
          className="w-full p-3 mb-3 rounded-lg bg-black/40 border border-white/10"
          onChange={(e) => handleChange("age", e.target.value)}
        />

        {/* GENDER */}
        <select
          className="w-full p-3 mb-3 rounded-lg bg-black/40 border border-white/10"
          onChange={(e) => handleChange("gender", e.target.value)}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        {/* LOOKING FOR */}
        <select
          className="w-full p-3 mb-3 rounded-lg bg-black/40 border border-white/10"
          onChange={(e) => handleChange("looking_for", e.target.value)}
        >
          <option value="">Looking For</option>
          <option>Male</option>
          <option>Female</option>
          <option>Everyone</option>
        </select>

        {/* INTENT */}
        <select
          className="w-full p-3 mb-3 rounded-lg bg-black/40 border border-white/10"
          onChange={(e) => handleChange("intent", e.target.value)}
        >
          <option value="">Intent</option>
          <option>Friendship</option>
          <option>Dating</option>
          <option>Serious Relationship</option>
        </select>

        {/* BIO */}
        <textarea
          placeholder="Write something about yourself..."
          className="w-full p-3 mb-4 rounded-lg bg-black/40 border border-white/10"
          rows={3}
          onChange={(e) => handleChange("bio", e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={handleRegister}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105 transition"
        >
          {loading ? "Creating..." : "Create Profile"}
        </button>
      </div>
    </div>
  );
}
