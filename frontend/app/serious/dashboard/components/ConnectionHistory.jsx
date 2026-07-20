"use client";

import { useState } from "react";
import ConnectionCard from "./ConnectionCard";
export default function ConnectionHistory({ history, socket, onlineMap }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleReconnect = (userId) => {
    if (!socket) return;

    setLoadingId(userId);

    socket.emit("request-reconnect", {
      targetUserId: userId,
    });

    setTimeout(() => {
      setLoadingId(null);
    }, 3000);
  };

  const formatDuration = (seconds = 0) => {
    if (!seconds) return "0 min";

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);

    return `${hours}h ${minutes % 60}m`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
      {/* Header */}

      <div className="border-b border-white/10 p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold">❤️ Connection History</h2>

            <p className="mt-1 text-gray-400">
              Reconnect with people you've enjoyed talking to.
            </p>
          </div>

          <span className="rounded-full bg-pink-500/20 px-4 py-2 text-sm text-pink-300">
            {history.length} Connections
          </span>
        </div>
      </div>

      {/* Empty */}

      {history.length === 0 && (
        <div className="p-16 text-center">
          <div className="text-7xl">💕</div>

          <h3 className="mt-6 text-3xl font-bold">No Connections Yet</h3>

          <p className="mt-3 text-gray-400">
            Start matching and your previous conversations will appear here.
          </p>
        </div>
      )}

      {/* List */}

      {history.length > 0 && (
        <div className="space-y-5 p-6">
          {history.map((item) => (
            <ConnectionCard
              key={item.userId}
              item={item}
              socket={socket}
              onlineMap={onlineMap}
              loadingId={loadingId}
              setLoadingId={setLoadingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
