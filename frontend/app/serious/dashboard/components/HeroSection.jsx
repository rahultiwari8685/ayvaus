"use client";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-blue-500/20 p-8 md:p-12 backdrop-blur-xl">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-pink-500/20 blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/20 blur-[120px]" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-2 items-center">
        {/* Left Side */}
        <div>
          <span className="inline-flex items-center rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-300">
            ❤️ Welcome to Serious Mode
          </span>

          <h1 className="mt-6 text-5xl font-black leading-tight">
            Find Your
            <span className="block bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 bg-clip-text text-transparent">
              Meaningful Connection
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Reconnect with people you enjoyed talking to, build genuine
            relationships, earn rewards, and continue conversations that truly
            matter.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
              💬 Meaningful Chats
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
              ❤️ Real Connections
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
              🎁 Earn Rewards
            </div>
          </div>
        </div>

        {/* Right Side */}

        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="text-5xl">❤️</div>

            <h3 className="mt-4 text-2xl font-bold">Smart Matching</h3>

            <p className="mt-2 text-gray-400">
              Connect with people who share similar interests.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="text-5xl">🔄</div>

            <h3 className="mt-4 text-2xl font-bold">Reconnect</h3>

            <p className="mt-2 text-gray-400">
              Continue conversations with previous matches.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="text-5xl">🪙</div>

            <h3 className="mt-4 text-2xl font-bold">Earn Coins</h3>

            <p className="mt-2 text-gray-400">
              Complete conversations and unlock rewards.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="text-5xl">⭐</div>

            <h3 className="mt-4 text-2xl font-bold">Level Up</h3>

            <p className="mt-2 text-gray-400">
              Gain XP, increase your level and unlock achievements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
