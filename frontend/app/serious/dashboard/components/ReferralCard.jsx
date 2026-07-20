"use client";

import { useState } from "react";

export default function ReferralCard({ referral }) {
  const [copied, setCopied] = useState(false);

  if (!referral) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl animate-pulse">
        <div className="h-6 w-40 rounded bg-white/10"></div>
        <div className="mt-5 h-28 rounded-2xl bg-white/10"></div>
      </div>
    );
  }

  const referralCode = referral.referralCode || "-";

  const referralLink = `https://flirtaus.com/serious/register?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const handleShare = async () => {
    const message = `❤️ Join Flirtaus Serious Mode

Use my referral link:

${referralLink}

Referral Code: ${referralCode}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Flirtaus",
          text: message,
        });
      } else {
        await navigator.clipboard.writeText(message);
        alert("Referral link copied successfully.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 p-6 backdrop-blur-xl">
      {/* Glow */}

      <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Refer & Earn</h3>

          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">
            Invite Friends
          </span>
        </div>

        {/* Referral Code */}

        <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-black/20 p-5">
          <p className="text-sm text-gray-400">Your Referral Code</p>

          <h3 className="mt-3 break-all text-3xl font-black tracking-widest text-cyan-300">
            {referralCode}
          </h3>
        </div>

        {/* Referral Stats */}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs text-gray-400">👥 Referrals</p>

            <h4 className="mt-2 text-xl font-bold">
              {referral.totalReferrals ?? 0}
            </h4>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs text-gray-400">🪙 Bonus Earned</p>

            <h4 className="mt-2 text-2xl font-bold">
              {referral.totalBonus ?? 0}
            </h4>
          </div>
        </div>

        {/* Buttons */}

        <div className="mt-6 space-y-3">
          <button
            onClick={handleCopy}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold transition-all duration-300 hover:scale-105"
          >
            {copied ? "✅ Copied" : "📋 Copy Referral Code"}
          </button>

          <button
            onClick={handleShare}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-bold transition-all duration-300 hover:scale-105"
          >
            🚀 Invite Friends
          </button>
        </div>
      </div>
    </div>
  );
}
