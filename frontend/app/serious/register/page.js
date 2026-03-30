"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SeriousRegister() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    looking_for: "",
    intent: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Basic validation
    if (
      !form.name ||
      !form.age ||
      !form.gender ||
      !form.looking_for ||
      !form.intent
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/serious/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/serious/dashboard");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Your <span className="text-pink-500">Serious Profile</span>
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none"
        />

        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-white/10"
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-white/10"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <select
          name="looking_for"
          value={form.looking_for}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-white/10"
        >
          <option value="">Looking For</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="any">Any</option>
        </select>

        <select
          name="intent"
          value={form.intent}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-white/10"
        >
          <option value="">Select Intent</option>
          <option value="marriage">Marriage 💍</option>
          <option value="relationship">Relationship ❤️</option>
          <option value="live_in">Live-in 🏠</option>
          <option value="friendship">Friendship 😊</option>
        </select>

        <textarea
          name="bio"
          placeholder="Tell something about yourself..."
          value={form.bio}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-white/10"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-pink-600 hover:bg-pink-700 transition font-semibold"
        >
          {loading ? "Saving..." : "Create Profile"}
        </button>
      </div>
    </div>
  );
}
