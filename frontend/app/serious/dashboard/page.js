"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SeriousDashboard() {
  const router = useRouter();
  const [history, setHistory] = useState([]);

  const totalUsers = history.length;

  const totalTime = history.reduce((sum, item) => {
    return sum + (item.duration || 0);
  }, 0);

  // format total time
  function formatTotalTime(seconds) {
    const mins = Math.floor(seconds / 60);
    return mins === 0 ? `${seconds}s` : `${mins} min`;
  }

  // ✅ duration formatter
  function formatDuration(seconds) {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;

    return `${mins}m ${secs}s`;
  }

  function getBadge(duration) {
    if (duration >= 60) return "🟢 Good Match";
    if (duration <= 10) return "🔴 Skipped Fast";
    return "🟡 Normal";
  }

  const handleReconnect = (user) => {
    // later you can pass userId for direct match
    router.push("/serious/match");
  };

  // ✅ fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem("userId");

        const res = await fetch(
          `https://api.flirtaus.com/api/user/yesterday-history?userId=${userId}`,
        );

        const data = await res.json();
        setHistory(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-10">
      {/* HEADER */}
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-6">
        Welcome to <span className="text-pink-500">Serious Mode ❤️</span>
      </h1>

      <p className="text-gray-400 text-center max-w-xl mx-auto mb-10">
        Find meaningful connections and review your past chats.
      </p>

      <div className="max-w-3xl mx-auto mb-8 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
        <h2 className="text-lg font-semibold">
          You talked with <span className="text-pink-500">{totalUsers}</span>{" "}
          users yesterday
        </h2>
        <p className="text-gray-400 text-sm">
          Total time: {formatTotalTime(totalTime)}
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
        {/* MATCH */}
        <div
          onClick={() => router.push("/serious/match")}
          className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-white/10 hover:scale-105 transition cursor-pointer"
        >
          <div className="text-4xl mb-4">💖</div>
          <h3 className="text-xl font-semibold mb-2">Start Matching</h3>
          <p className="text-gray-400 text-sm">
            Meet new people and build connections.
          </p>
        </div>

        {/* HISTORY CARD (STATIC INFO) */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-white/10">
          <div className="text-4xl mb-4">📜</div>
          <h3 className="text-xl font-semibold mb-2">History</h3>
          <p className="text-gray-400 text-sm">
            See who you connected with recently.
          </p>
        </div>
      </div>

      {/* HISTORY LIST */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">📜 Yesterday History</h2>

        {history.length === 0 ? (
          <p className="text-gray-500">No history found</p>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>

                  <p className="text-xs text-gray-400">
                    {item.age} • {item.gender}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">{item.startedAt}</p>

                  {/* BADGE */}
                  <p className="text-xs mt-1">{getBadge(item.duration)}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm">⏱ {formatDuration(item.duration)}</p>

                  <button
                    onClick={() => handleReconnect(item)}
                    className="mt-2 text-xs px-3 py-1 rounded bg-pink-500 hover:bg-pink-600"
                  >
                    Chat Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BACK */}
      <div className="text-center mt-10">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-500 hover:text-white"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
