"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold tracking-wide">
          Flirta <span className="text-pink-500">(Ayvaus)</span>
        </h1>

        <Link
          href="/video"
          className="px-5 py-2 rounded-full bg-pink-600 hover:bg-pink-700 transition font-medium"
        >
          Start Chat
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
          Meet <span className="text-pink-500">Strangers</span>.<br />
          Talk <span className="text-pink-500">Freely</span>.<br />
          Connect <span className="text-pink-500">Instantly</span>.
        </h2>

        <p className="mt-6 text-lg text-gray-400 max-w-xl">
          Flirta is a free random video chat platform where you can meet new
          people from around the world instantly. No signup required.
        </p>

        <div className="mt-8 flex gap-4 flex-wrap justify-center">
          <Link
            href="/video"
            className="px-8 py-3 rounded-full bg-pink-600 hover:bg-pink-700 transition text-lg font-semibold shadow-lg"
          >
            Start Video Chat
          </Link>

          <Link
            href="#features"
            className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition text-lg"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-6 bg-black/40 backdrop-blur-lg"
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold mb-2">Instant Video Chat</h3>
            <p className="text-gray-400">
              Connect instantly with random people around the world in
              real-time.
            </p>
          </div>

          <div>
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Private & Secure</h3>
            <p className="text-gray-400">
              No signup required. Your privacy is our priority.
            </p>
          </div>

          <div>
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Global Connections</h3>
            <p className="text-gray-400">
              Meet people from different countries and cultures instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-white/10">
        © {new Date().getFullYear()} Flirta (Ayvaus). All rights reserved.
      </footer>
    </div>
  );
}
