"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [data, setData] = useState([]);

  function formatDuration(seconds) {
    if (!seconds) return "0s";

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;

    return `${mins}m ${secs}s`;
  }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem("userId");

        const res = await fetch(
          `https://api.flirtaus.com/api/user/yesterday-history?userId=${userId}`,
        );

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">📜 Yesterday History</h1>

      {data.length === 0 ? (
        <p className="text-gray-400">No history found</p>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-400">
                {item.age} • {item.gender}
              </p>

              <p className="text-sm mt-2">
                ⏱ Duration: {formatDuration(item.duration)}
              </p>

              <p className="text-xs text-gray-500">🕒 {item.startedAt}</p>

              <p
                className={`text-xs mt-1 ${
                  item.status === "skipped"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {item.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
