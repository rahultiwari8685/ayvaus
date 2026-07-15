"use client";

import { useEffect, useState } from "react";

export default function RewardHistory() {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    fetchRewards();
  }, []);

  async function fetchRewards() {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://api.flirtaus.com/api/serious/reward-history",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    if (data.success) {
      setRewards(data.rewards);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">🎁 Reward History</h1>

      <div className="space-y-4">
        {rewards.map((reward) => (
          <div
            key={reward._id}
            className="rounded-xl bg-white/5 border border-white/10 p-5"
          >
            <h2 className="font-bold text-lg">{reward.title}</h2>

            <p className="text-gray-400 text-sm">{reward.description}</p>

            <div className="flex gap-6 mt-4">
              <span>⭐ {reward.xp} XP</span>
              <span>🪙 {reward.coins}</span>
              <span>💸 {reward.fragments}</span>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              {new Date(reward.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
