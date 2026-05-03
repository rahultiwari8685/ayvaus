"use client";

import { useSocket } from "@/context/SocketContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SeriousDashboard() {
  const { socket } = useSocket();
  const router = useRouter();

  const [history, setHistory] = useState([]);
  const [onlineMap, setOnlineMap] = useState({});

  const totalUsers = history.length;

  const totalTime = history.reduce((sum, item) => {
    return sum + (item.duration || 0);
  }, 0);

  function formatTotalTime(seconds) {
    const mins = Math.floor(seconds / 60);

    if (mins === 0) return `${seconds}s`;

    return `${mins} min`;
  }

  function formatDuration(seconds) {
    if (!seconds) return "0s";

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;

    return `${mins}m ${secs}s`;
  }

  function getBadge(duration) {
    if (duration >= 60) return "🟢 Great Match";
    if (duration <= 10) return "🔴 Skipped Fast";

    return "🟡 Casual Match";
  }

  function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

    return "Yesterday";
  }

  const handleReconnect = (user) => {
    localStorage.setItem("reconnect_partner_id", user.userId);

    socket.emit("send-reconnect-request", {
      partnerId: user.userId,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");

        const res = await fetch(
          `https://api.flirtaus.com/api/user/yesterday-history?userId=${userId}`,
        );

        const historyData = await res.json();

        setHistory(historyData || []);

        const userIds = historyData.map((item) => item.userId);

        const onlineRes = await fetch(
          "https://api.flirtaus.com/api/user/online-status",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userIds }),
          },
        );

        const onlineData = await onlineRes.json();

        setOnlineMap(onlineData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("reconnect-accepted", () => {
      router.push("/serious/match");
    });

    return () => {
      socket.off("reconnect-accepted");
    };
  }, [socket]);

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-120px] left-[-100px] w-[420px] h-[420px] bg-pink-500/20 blur-3xl rounded-full animate-pulse" />

        <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-6 border-b border-white/10 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Flirta</h1>

          <p className="text-xs text-pink-400 tracking-[0.25em] uppercase mt-1">
            Serious Mode
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="group relative overflow-hidden px-5 py-2.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm font-medium">
              🏠 Home
            </span>

            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition" />
          </button>

          <button
            onClick={() => router.push("/video")}
            className="group relative overflow-hidden px-5 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm">
              🎉 Fun Mode
            </span>

            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition" />
          </button>
        </div>

        {/* <button
          onClick={() => router.push("/")}
          className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
        >
          Home
        </button>
        <button
          onClick={() => router.push("/video")}
          className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
        >
          Switch to Fun Mode
        </button> */}
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-3 md:px-4 py-4 max-w-7xl mx-auto">
        <div className="text-center mb-2">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

            <span className="text-sm text-zinc-300">
              Building meaningful connections
            </span>
          </div> */}

          <h1 className="text-4xl md:text-4xl font-black leading-tight tracking-tight">
            Your
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-purple-400 bg-clip-text text-transparent">
              Relationship Hub ❤️
            </span>
          </h1>

          <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Reconnect with people you enjoyed talking to and continue your
            meaningful conversations.
          </p>
        </div>

        {/* Stats */}
        {/* <div className="grid md:grid-cols-3 gap-5 mb-12">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <p className="text-zinc-400 text-sm">Connections</p>

            <h2 className="text-4xl font-bold text-pink-400 mt-2">
              {totalUsers}
            </h2>

            <p className="text-zinc-500 text-sm mt-2">Last 24 hours</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <p className="text-zinc-400 text-sm">Conversation Time</p>

            <h2 className="text-4xl font-bold text-cyan-400 mt-2">
              {formatTotalTime(totalTime)}
            </h2>

            <p className="text-zinc-500 text-sm mt-2">Total engagement</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <p className="text-zinc-400 text-sm">Meaningful Matches</p>

            <h2 className="text-4xl font-bold text-green-400 mt-2">
              {history.filter((h) => h.duration >= 60).length}
            </h2>

            <p className="text-zinc-500 text-sm mt-2">Great conversations</p>
          </div>
        </div> */}

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-2">
          {/* Start Matching */}
          <div
            onClick={() => router.push("/serious/match")}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-pink-500/20 to-rose-500/10 p-8 cursor-pointer hover:scale-[1.02] transition-all duration-300 backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/20 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="text-6xl mb-6">💖</div>

              <h2 className="text-3xl font-bold leading-tight">
                Start
                <br />
                Matching
              </h2>

              <p className="mt-4 text-zinc-300 leading-relaxed">
                Meet someone new and begin another meaningful conversation.
              </p>

              <button className="mt-8 px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:scale-105 transition">
                Start Now
              </button>
            </div>
          </div>

          {/* History */}
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Connection History</h2>

                <p className="text-zinc-500 text-sm mt-1">
                  Recent people you connected with
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center text-xl">
                ❤️
              </div>
            </div>

            <div className="p-5 space-y-4 max-h-[650px] overflow-y-auto">
              {history.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">💔</div>

                  <h3 className="text-xl font-semibold">No Connections Yet</h3>

                  <p className="text-zinc-500 mt-2">
                    Start matching to build meaningful connections.
                  </p>
                </div>
              ) : (
                history.map((item, index) => {
                  const isOnline = onlineMap[item.userId] || false;

                  return (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-5 rounded-3xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-2xl font-bold shadow-xl">
                            {item.name?.charAt(0)}
                          </div>

                          <div
                            className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-black ${
                              isOnline ? "bg-green-400" : "bg-gray-500"
                            }`}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold">
                              {item.name}
                            </h3>

                            <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                              {item.age}
                            </span>

                            <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 capitalize">
                              {item.gender}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <p className="text-sm text-zinc-400">
                              ⏱ {formatDuration(item.duration)}
                            </p>

                            <p className="text-sm text-zinc-500">
                              {timeAgo(item.startedAt)}
                            </p>
                          </div>

                          <p className="mt-2 text-sm text-zinc-300">
                            {getBadge(item.duration)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span
                          className={`text-xs px-3 py-1 rounded-full border ${
                            item.status === "ended"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          }`}
                        >
                          {item.status}
                        </span>

                        <button
                          onClick={() => handleReconnect(item)}
                          className="mt-4 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium shadow-xl hover:scale-105 transition"
                        >
                          Reconnect
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
