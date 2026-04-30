"use client";

import { io } from "socket.io-client";

// const socket = io("https://api.flirtaus.com", {
//   transports: ["websocket"],
// });

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const socket = io("https://api.flirtaus.com", {
  transports: ["websocket"],
  auth: {
    token,
    mode: "serious",
  },
});

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SeriousDashboard() {
  const router = useRouter();
  const [history, setHistory] = useState([]);

  const [onlineMap, setOnlineMap] = useState({});

  const totalUsers = history.length;

  const totalTime = history.reduce((sum, item) => {
    return sum + (item.duration || 0);
  }, 0);

  function formatTotalTime(seconds) {
    const mins = Math.floor(seconds / 60);
    return mins === 0 ? `${seconds}s` : `${mins} min`;
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
    if (duration >= 60) return "🟢 Good Match";
    if (duration <= 10) return "🔴 Skipped Fast";
    return "🟡 Normal";
  }

  // const handleReconnect = (user) => {
  //   const token = localStorage.getItem("token");
  //   console.log(token);

  //   console.log("🔥 RECONNECT CLICKED:", user.userId);

  //   socket.emit("reconnect-user", {
  //     token,
  //     partnerId: user.userId,
  //   });
  // };

  const handleReconnect = (user) => {
    // localStorage.setItem("reconnect_partner_id", user.userId);

    // router.push("/serious/match?room=reconnect");

    socket.emit("send-reconnect-request", {
      partnerId: user.userId,
    });

    alert("Reconnect request sent");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");

        // 1️⃣ Fetch history
        const res = await fetch(
          `https://api.flirtaus.com/api/user/yesterday-history?userId=${userId}`,
        );

        const historyData = await res.json();
        setHistory(historyData || []);

        // 2️⃣ Extract userIds
        const userIds = historyData.map((item) => item.userId);

        // 3️⃣ Fetch online status
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
        console.error("Dashboard error:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    socket.connect();

    // socket.on("matched", () => {
    //   console.log("🔥 RECONNECTED (matched event)");

    //   router.push(`/serious/match?room=reconnect`);
    // });

    socket.on("reconnect-failed", (msg) => {
      console.log("❌ RECONNECT FAILED:", msg);
      alert(msg);
    });

    // return () => {
    //   socket.off("reconnect-success");
    //   socket.off("reconnect-failed");
    // };

    return () => {
      socket.off("matched");
      socket.off("reconnect-failed");
    };
  }, []);

  function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

    return "Yesterday";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-10">
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

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div
          onClick={() => router.push("/serious/match")}
          className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-white/10 hover:scale-105 transition cursor-pointer flex flex-col justify-center"
        >
          <div className="text-4xl mb-4">💖</div>
          <h3 className="text-xl font-semibold mb-2">Start Matching</h3>
          <p className="text-gray-400 text-sm">
            Meet new people and build connections.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">📜 Connection History</h3>

          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">No history found</p>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {history.slice(0, 6).map((item, index) => {
                const isOnline = onlineMap[item.userId] || false;
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-white/5 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOnline ? "bg-green-400" : "bg-gray-500"
                          }`}
                        ></span>

                        <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold">
                          {item.name?.charAt(0)}
                        </div>

                        <span className="font-medium">{item.name}</span>
                      </div>

                      <p className="text-xs text-gray-400">
                        {isOnline ? "Online" : "Offline"} • {item.age} •{" "}
                        {item.gender}
                      </p>

                      <p className="text-xs text-gray-500">
                        ⏱ {formatDuration(item.duration)}
                      </p>

                      <p className="text-xs mt-1">{getBadge(item.duration)}</p>
                      <p className="text-xs text-gray-500">
                        {timeAgo(item.startedAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs ${
                          item.status === "skipped"
                            ? "text-yellow-400"
                            : item.status === "ended"
                              ? "text-green-400"
                              : "text-gray-400"
                        }`}
                      >
                        {item.status}
                      </span>

                      <button
                        onClick={() => handleReconnect(item)}
                        className="mt-2 text-xs px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 hover:bg-pink-500 hover:text-white transition"
                      >
                        Reconnect
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

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
