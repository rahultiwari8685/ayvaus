"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
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

  const handleIntentSelect = (value) => {
    setForm({ ...form, intent: value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.age || !form.gender || !form.intent) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // 🔥 OPTIONAL: if you have login system
      const token = localStorage.getItem("token");

      const res = await fetch("https://api.flirtaus.com/api/serious/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }), // 🔥 important
        },
        body: JSON.stringify({
          ...form,
          age: Number(form.age), // 🔥 fix type
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile created successfully ❤️");
        router.push("/serious/dashboard");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Serious Profile ❤️
        </h2>

        {/* Name */}
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-3 bg-black/40 border border-white/10 rounded-lg"
        />

        {/* Age */}
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="w-full mb-4 p-3 bg-black/40 border border-white/10 rounded-lg"
        />

        {/* Gender */}
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full mb-4 p-3 bg-black/40 border border-white/10 rounded-lg"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* Looking For */}
        <select
          name="looking_for"
          value={form.looking_for}
          onChange={handleChange}
          className="w-full mb-4 p-3 bg-black/40 border border-white/10 rounded-lg"
        >
          <option value="">Looking For</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="any">Any</option>
        </select>

        {/* Intent Buttons */}
        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-400">Intent</p>

          <div className="grid grid-cols-2 gap-2">
            {["marriage", "relationship", "live_in", "friendship"].map((i) => (
              <button
                type="button" // 🔥 IMPORTANT (prevents form submit)
                key={i}
                onClick={() => handleIntentSelect(i)}
                className={`p-2 rounded-lg border transition ${
                  form.intent === i
                    ? "bg-pink-600 border-pink-600"
                    : "border-white/20 hover:border-white/40"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <textarea
          name="bio"
          placeholder="About you..."
          value={form.bio}
          onChange={handleChange}
          className="w-full mb-4 p-3 bg-black/40 border border-white/10 rounded-lg"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {loading ? "Saving..." : "Create Profile"}
        </button>
      </div>
    </div>
  );
}
