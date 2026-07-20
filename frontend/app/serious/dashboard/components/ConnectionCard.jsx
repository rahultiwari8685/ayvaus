"use client";

export default function ConnectionCard({
  item,
  socket,
  onlineMap,
  loadingId,
  setLoadingId,
}) {
  const handleReconnect = () => {
    if (!socket) return;

    setLoadingId(item.userId);

    socket.emit("request-reconnect", {
      targetUserId: item.userId,
    });

    setTimeout(() => {
      setLoadingId(null);
    }, 3000);
  };

  const formatDuration = (seconds = 0) => {
    if (!seconds) return "0 min";

    const mins = Math.floor(seconds / 60);

    if (mins < 60) {
      return `${mins} min`;
    }

    const hrs = Math.floor(mins / 60);

    return `${hrs}h ${mins % 60}m`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isOnline = onlineMap?.[item.userId];

  return (
    <div className="group rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}

        <div className="flex items-center gap-5">
          {/* <div className="relative">
            <img
              src={item.profileImage || "/default-avatar.png"}
              alt={item.name}
              className="h-24 w-24 rounded-full border-2 border-pink-500 object-cover"
            />

            <span
              className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-black ${
                isOnline ? "bg-green-500" : "bg-gray-500"
              }`}
            />
          </div> */}

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{item.name}</h2>

              {isOnline && (
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300">
                  Online
                </span>
              )}
            </div>

            <p className="mt-2 text-gray-400">
              {item.gender} • {item.age} Years
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs text-pink-300">
                ❤️ Matched
              </span>

              {item.isReconnect && (
                <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300">
                  🔄 Reconnected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right */}

        <div className="flex flex-col items-start gap-5 lg:items-end">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/5 p-4 text-center">
              <p className="text-xs uppercase text-gray-400">Chat Time</p>

              <h3 className="mt-2 text-lg font-bold">
                {formatDuration(item.duration)}
              </h3>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 text-center">
              <p className="text-xs uppercase text-gray-400">Last Match</p>

              <h3 className="mt-2 text-lg font-bold">
                {formatDate(item.startedAt)}
              </h3>
            </div>
          </div>

          <button
            onClick={handleReconnect}
            disabled={loadingId === item.userId}
            className="rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-8 py-3 font-bold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingId === item.userId ? "Connecting..." : "🔄 Reconnect"}
          </button>
        </div>
      </div>
    </div>
  );
}
