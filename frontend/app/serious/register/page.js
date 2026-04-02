"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://api.flirtaus.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);

        alert("Registered successfully ✅");

        router.push("/serious/register"); // go to profile form
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-white/5 p-6 rounded-xl">
        <h2 className="text-2xl text-center mb-4">Register</h2>

        <input
          placeholder="Name"
          className="w-full mb-3 p-3 bg-black/40 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full mb-3 p-3 bg-black/40 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-3 bg-black/40 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleRegister}
          className="w-full py-3 bg-pink-600 rounded"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-pink-500 cursor-pointer"
            onClick={() => router.push("/serious/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
