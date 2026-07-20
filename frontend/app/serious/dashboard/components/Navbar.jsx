"use client";

export default function Navbar({ router, referral, handleLogout }) {
  const handleShare = async () => {
    if (!referral) return;

    const referralLink = `https://flirtaus.com/serious/register?ref=${referral.referralCode}`;

    const message = `❤️ Join Flirtaus

Find meaningful connections.

🎁 Use my referral link:
${referralLink}

Referral Code:
${referral.referralCode}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Flirtaus",
          text: message,
        });
      } else {
        await navigator.clipboard.writeText(message);
        alert("Referral copied successfully.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Logo */}

        <div className="cursor-pointer" onClick={() => router.push("/")}>
          <h1 className="text-3xl font-black tracking-wide bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 bg-clip-text text-transparent">
            Flirta
          </h1>

          <p className="text-xs tracking-[0.35em] uppercase text-pink-400">
            Serious Mode
          </p>
        </div>

        {/* Desktop Buttons */}

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 transition hover:bg-white/10 hover:scale-105"
          >
            🏠 Home
          </button>

          <button
            onClick={() => router.push("/serious/rewards")}
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-semibold transition hover:scale-105"
          >
            🎁 Rewards
          </button>

          <button
            onClick={() => router.push("/video")}
            className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-5 py-3 font-semibold text-black transition hover:scale-105"
          >
            🎉 Fun Mode
          </button>

          {/* <button
            onClick={handleShare}
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold transition hover:scale-105"
          >
            🚀 Invite Friends
          </button> */}

          <button
            onClick={handleLogout}
            className="rounded-2xl bg-gradient-to-r from-red-500 to-red-700 px-5 py-3 font-semibold transition hover:scale-105"
          >
            🚪 Logout
          </button>
        </div>

        {/* Mobile */}

        <div className="flex lg:hidden gap-2">
          <button
            onClick={() => router.push("/serious/rewards")}
            className="h-11 w-11 rounded-xl bg-purple-600"
          >
            🎁
          </button>

          <button
            onClick={handleShare}
            className="h-11 w-11 rounded-xl bg-blue-600"
          >
            🚀
          </button>

          <button
            onClick={handleLogout}
            className="h-11 w-11 rounded-xl bg-red-600"
          >
            🚪
          </button>
        </div>
      </div>
    </header>
  );
}
