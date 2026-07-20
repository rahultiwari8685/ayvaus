"use client";

export default function StatsCards({ history, wallet, totalChatTime }) {
  const totalConnections = history.length;

  const totalMinutes = Math.floor(totalChatTime / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const chatTime =
    totalHours > 0
      ? `${totalHours}h ${totalMinutes % 60}m`
      : `${totalMinutes}m`;

  const stats = [
    {
      title: "Connections",
      value: totalConnections,
      icon: "❤️",
      color: "from-pink-500/20 to-rose-500/20 border-pink-500/20",
    },
    {
      title: "Chat Time",
      value: chatTime,
      icon: "⏱",
      color: "from-blue-500/20 to-cyan-500/20 border-cyan-500/20",
    },
    {
      title: "Coins",
      value: wallet?.coins ?? 0,
      icon: "🪙",
      color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/20",
    },
    {
      title: "XP",
      value: wallet?.xp ?? 0,
      icon: "⭐",
      color: "from-green-500/20 to-emerald-500/20 border-green-500/20",
    },
    {
      title: "Level",
      value: wallet?.level ?? 1,
      icon: "🏆",
      color: "from-purple-500/20 to-violet-500/20 border-purple-500/20",
    },
    {
      title: "Streak",
      value: `${wallet?.streakDays ?? 0} Days`,
      icon: "🔥",
      color: "from-red-500/20 to-orange-500/20 border-red-500/20",
    },
  ];

  return (
    <section className="mt-8">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`group rounded-3xl border bg-gradient-to-br ${item.color} p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/10`}
          >
            <div className="flex items-center justify-between">
              <div className="text-4xl">{item.icon}</div>

              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                →
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm uppercase tracking-widest text-gray-400">
                {item.title}
              </p>

              <h2 className="mt-2 text-3xl font-black">{item.value}</h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
