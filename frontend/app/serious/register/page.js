"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
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

  const handleSubmit = async () => {
    setError("");

    // ✅ Validation
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
      const res = await fetch("https://api.flirtaus.com/api/serious/register", {
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

      if (res.ok) {
        // ✅ Save token
        localStorage.setItem("token", data.token);
        console.log("Registered user:", data.token);

        // ✅ Redirect
        router.push("/serious/match");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Your Profile ❤️
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* NAME */}
        <input
          type="text"
          placeholder="Name"
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
          placeholder="Bio"
          rows={3}
          className="w-full p-3 mb-4 rounded-lg bg-black/40 border border-white/10"
          onChange={(e) => handleChange("bio", e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-red-500"
        >
          {loading ? "Creating..." : "Register & Continue"}
        </button>
      </div>
    </div>
  );
}
