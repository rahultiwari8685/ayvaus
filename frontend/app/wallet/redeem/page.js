"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function RedeemPage() {
  const [upiId, setUpiId] = useState("");
  const [coins, setCoins] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const amount = coins ? Number(coins) / 10 : 0;

  const handleRedeem = async () => {
    if (!upiId.trim()) {
      alert("Please enter your UPI ID");
      return;
    }

    if (!coins || Number(coins) < 500) {
      alert("Minimum redeem is 500 Coins");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch("https://api.flirtaus.com/api/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          upiId,
          coins: Number(coins),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(data.message || "Redeem request submitted successfully");

      setUpiId("");
      setCoins("");
    } catch (err) {
      console.error("Redeem Error:", err);
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto max-w-lg rounded-3xl border border-yellow-500/20 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="mb-2 text-3xl font-bold">🎁 Redeem Rewards</h1>

        <p className="mb-8 text-gray-400">
          Convert your earned coins into real cash.
        </p>

        {/* UPI ID */}

        <div className="mb-5">
          <label className="mb-2 block text-sm text-gray-300">UPI ID</label>

          <input
            type="text"
            placeholder="example@paytm"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-black p-3 outline-none focus:border-yellow-500"
          />
        </div>

        {/* Coins */}

        <div className="mb-5">
          <label className="mb-2 block text-sm text-gray-300">Coins</label>

          <input
            type="number"
            placeholder="Minimum 500"
            value={coins}
            onChange={(e) => setCoins(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-black p-3 outline-none focus:border-yellow-500"
          />
        </div>

        {/* Amount */}

        <div className="mb-6 rounded-xl bg-yellow-500/10 p-4">
          <div className="flex justify-between">
            <span>Redeem Coins</span>

            <span>{coins || 0}</span>
          </div>

          <div className="mt-3 flex justify-between text-xl font-bold text-yellow-400">
            <span>You Will Receive</span>

            <span>₹{amount}</span>
          </div>
        </div>

        {/* Note */}

        <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-gray-300">
          <p>• Minimum Redeem : 500 Coins</p>
          <p>• 10 Coins = ₹1</p>
          <p>• Payment will be sent after admin approval.</p>
        </div>

        {/* Button */}

        <button
          onClick={handleRedeem}
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 py-3 font-bold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Redeem Request"}
        </button>

        <button
          onClick={() => router.push("/wallet/history")}
          className="mt-4 w-full rounded-xl border border-yellow-500 py-3 font-bold text-yellow-400 transition hover:bg-yellow-500 hover:text-black"
        >
          View Redeem History
        </button>
      </div>
    </div>
  );
}
