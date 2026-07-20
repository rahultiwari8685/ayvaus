"use client";

export default function WalletCard({ wallet }) {
  if (!wallet) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl animate-pulse">
        <div className="h-6 w-40 rounded bg-white/10"></div>

        <div className="mt-6 h-32 rounded-2xl bg-white/10"></div>

        <div className="mt-4 h-12 rounded-xl bg-white/10"></div>
      </div>
    );
  }

  const xp = wallet?.xp || 0;
  const level = wallet?.level || 1;

  // Example:
  // Level 1 -> 100 XP
  // Level 2 -> 200 XP
  // Level 3 -> 300 XP

  const xpRequired = level * 100;

  const progress = Math.min((xp / xpRequired) * 100, 100);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-pink-500/10 p-6 backdrop-blur-xl">
      {/* Background Glow */}

      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-yellow-500/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">💰 Wallet</h2>

          <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-300">
            Level {level}
          </span>
        </div>

        {/* Coins */}

        <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-black/20 p-5">
          <p className="text-sm text-gray-400">Available Coins</p>

          <h3 className="mt-2 text-4xl font-black text-yellow-300">
            🪙 {wallet?.coins || 0}
          </h3>
        </div>

        {/* Stats */}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs text-gray-400">⭐ XP</p>

            <h4 className="mt-2 text-2xl font-bold">{xp}</h4>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs text-gray-400">💎 Fragments</p>

            <h4 className="mt-2 text-2xl font-bold">
              {wallet?.fragments || 0}
            </h4>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs text-gray-400">🔥 Streak</p>

            <h4 className="mt-2 text-2xl font-bold">
              {wallet?.streakDays || 0} Days
            </h4>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs text-gray-400">🏆 Level</p>

            <h4 className="mt-2 text-2xl font-bold">{level}</h4>
          </div>
        </div>

        {/* XP Progress */}

        <div className="mt-8">
          <div className="mb-2 flex justify-between text-sm">
            <span>XP Progress</span>

            <span>
              {xp}/{xpRequired}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Rewards Button */}

        <button className="mt-8 w-full rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 py-3 font-bold text-black transition-all duration-300 hover:scale-105">
          🎁 Redeem Rewards
        </button>
      </div>
    </div>
  );
}
