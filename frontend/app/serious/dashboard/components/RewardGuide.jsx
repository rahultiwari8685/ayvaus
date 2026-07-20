"use client";

export default function RewardGuide() {
  const rewards = [
    {
      icon: "❤️",
      title: "Complete Matches",
      reward: "+20 XP",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: "💬",
      title: "Chat 10 Minutes",
      reward: "+10 Coins",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: "🔥",
      title: "Daily Login",
      reward: "+5 XP",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: "👥",
      title: "Invite Friends",
      reward: "+100 Coins",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: "🏆",
      title: "Level Up",
      reward: "Bonus Reward",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-fuchsia-500/10 to-pink-500/10 p-6 backdrop-blur-xl">
      {/* Background Glow */}
      <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">🎁 Reward Guide</h2>

          <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300">
            Earn More
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          Complete activities, chat regularly, invite friends and maintain your
          streak to unlock more rewards.
        </p>

        <div className="mt-6 space-y-4">
          {rewards.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-xl`}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <h4 className="font-semibold">{item.title}</h4>

                    <p className="text-xs text-gray-400">
                      Complete this activity
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-300">
                  {item.reward}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}

        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
          <h3 className="font-bold text-emerald-300">💡 Pro Tip</h3>

          <p className="mt-2 text-sm leading-6 text-gray-300">
            The longer you stay active, complete chats, and reconnect with
            quality matches, the faster you level up and unlock premium rewards.
          </p>
        </div>
      </div>
    </div>
  );
}
