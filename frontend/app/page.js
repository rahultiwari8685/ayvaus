"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold tracking-wide">
          Flirta <span className="text-pink-500">(Formerly Ayvaus)</span>
        </h1>
      </nav>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
          Choose Your <span className="text-pink-500">Experience</span>
        </h2>

        <p className="mt-6 text-lg text-gray-400 max-w-xl">
          Whether you want fun, meaningful connections, or professional
          networking — Flirta has it all.
        </p>

        {/* MODE SELECTION */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 w-full max-w-6xl">
          <Link href="/video">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-white/10 hover:scale-105 transition cursor-pointer">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold mb-2">Fun Mode</h3>
              <p className="text-gray-400 text-sm">
                Instant random chat. No signup required.
              </p>
            </div>
          </Link>

          <Link href="/serious/register">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-white/10 hover:scale-105 transition cursor-pointer">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">Serious Mode</h3>
              <p className="text-gray-400 text-sm">
                Find meaningful connections. Profile required.
              </p>
            </div>
          </Link>

          <Link href="/corporate">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 hover:scale-105 transition cursor-pointer">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-2">Corporate Mode</h3>
              <p className="text-gray-400 text-sm">
                Connect companies & students.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-black/40 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold mb-2">Live Video Chat</h3>
            <p className="text-gray-400">
              High-quality real-time video connections.
            </p>
          </div>

          <div>
            <div className="text-4xl mb-4">🔁</div>
            <h3 className="text-xl font-semibold mb-2">Reconnect Feature</h3>
            <p className="text-gray-400">
              Reconnect with previous matches (Serious Mode).
            </p>
          </div>

          <div>
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Global Network</h3>
            <p className="text-gray-400">Meet people worldwide instantly.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-white/10">
        © {new Date().getFullYear()} Flirta. All rights reserved.
      </footer>
    </div>
  );
}
