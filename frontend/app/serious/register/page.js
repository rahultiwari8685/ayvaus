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

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    await fetch("https://api.flirtaus.com/api/serious/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);

    router.push("/serious/register");
  };

  return (
    <div className="p-10 text-white">
      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}
