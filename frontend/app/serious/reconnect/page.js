"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReconnectPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchReconnectUsers();
  }, []);

  const fetchReconnectUsers = async () => {
    try {
      const res = await fetch("/api/reconnect");
      const data = await res.json();

      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const handleReconnect = (userId) => {
  //   router.push(`/serious/chat?userId=${userId}`);
  // };

  const handleReconnect = (userId) => {
    console.log("🔄 Reconnecting with user:", userId);

    localStorage.setItem("reconnect_partner_id", userId);

    router.push("/serious/match");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">🔁 Reconnect</h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500">
          No previous connections found.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {users.map((user) => (
            <div
              key={user._id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:scale-105 transition"
            >
              <h3 className="text-lg font-semibold">
                {user.name}, {user.age}
              </h3>

              <p className="text-sm text-gray-400 mt-1">{user.intent}</p>

              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {user.bio || "No bio available"}
              </p>

              <button
                onClick={() => handleReconnect(user._id)}
                className="mt-4 w-full py-2 rounded-lg bg-pink-600 hover:bg-pink-700"
              >
                Reconnect
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Back */}
      <div className="text-center mt-10">
        <button
          onClick={() => router.push("/serious/dashboard")}
          className="text-gray-400 hover:text-white"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
