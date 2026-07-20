"use client";

export default function StartMatchingCard({ router }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-purple-600/20 p-7 backdrop-blur-xl">
      {/* Glow Effects */}

      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-pink-500/30 blur-3xl animate-pulse" />

      <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />

      {/* Floating Hearts */}

      <div className="absolute top-5 right-6 text-2xl animate-bounce">❤️</div>

      <div className="absolute bottom-8 right-12 text-lg opacity-60">💕</div>

      <div className="relative z-10">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-5xl shadow-2xl mx-auto">
          💖
        </div>

        <h2 className="mt-6 text-center text-3xl font-black">Start Matching</h2>

        <p className="mt-4 text-center text-gray-300 leading-7">
          Meet genuine people, build meaningful relationships, reconnect with
          your favorite matches and earn exclusive rewards.
        </p>

        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
            <span className="text-xl">❤️</span>

            <span>Smart AI Matching</span>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
            <span className="text-xl">🔄</span>

            <span>Unlimited Reconnect</span>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
            <span className="text-xl">🎁</span>

            <span>Earn XP & Coins</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/serious/match")}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 py-4 text-lg font-bold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-pink-500/30"
        >
          ❤️ Start Matching
        </button>
      </div>
    </div>
  );
}
