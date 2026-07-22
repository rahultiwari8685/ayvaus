"use client";

export default function RedeemPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-xl mx-auto rounded-3xl bg-white/5 p-8">
        <h1 className="text-3xl font-bold mb-6">🎁 Redeem Rewards</h1>

        <input
          placeholder="Enter UPI ID"
          className="w-full rounded-xl border border-gray-700 bg-black p-3 mb-4"
        />

        <input
          placeholder="Coins"
          className="w-full rounded-xl border border-gray-700 bg-black p-3 mb-6"
        />

        <button className="w-full rounded-xl bg-yellow-500 p-3 text-black font-bold">
          Submit Redeem Request
        </button>
      </div>
    </div>
  );
}
