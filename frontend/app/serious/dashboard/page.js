"use client";

import { useRouter } from "next/navigation";

export default function SeriousDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-6">
        Welcome to <span className="text-pink-500">Serious Mode ❤️</span>
      </h1>

      <p className="text-gray-400 text-center max-w-xl mb-10">
        Find meaningful connections, build relationships, and view your past
        conversations.
      </p>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* LEFT → MATCH */}
        <div
          onClick={() => router.push("/serious/match")}
          className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-white/10 hover:scale-105 transition cursor-pointer"
        >
          <div className="text-4xl mb-4">💖</div>
          <h3 className="text-xl font-semibold mb-2">Start Matching</h3>
          <p className="text-gray-400 text-sm">
            Meet new people and start meaningful conversations.
          </p>
        </div>

        {/* RIGHT → HISTORY (NEW) */}
        <div
          onClick={() => router.push("/serious/history")}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-white/10 hover:scale-105 transition cursor-pointer"
        >
          <div className="text-4xl mb-4">📜</div>
          <h3 className="text-xl font-semibold mb-2">History</h3>
          <p className="text-gray-400 text-sm">
            View your past connections and chat duration.
          </p>
        </div>
      </div>

      <button
        onClick={() => router.push("/")}
        className="mt-10 text-sm text-gray-500 hover:text-white"
      >
        ← Back to Home
      </button>
    </div>
  );
}
