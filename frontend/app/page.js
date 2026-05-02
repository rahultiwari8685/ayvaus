export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-black text-white relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-120px] left-[-100px] w-[420px] h-[420px] bg-pink-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-6 border-b border-white/10 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Flirta</h1>

          <p className="text-xs text-pink-400 tracking-[0.25em] uppercase mt-1">
            Formerly Ayvaus
          </p>
        </div>

        <button className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/10 text-sm">
          Explore
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-2 md:px-12 py-6 md:py-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-zinc-300">
                Meet people instantly worldwide
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
              Video Chat
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Reimagined.
              </span>
            </h2>

            <p className="mt-8 text-lg text-zinc-400 max-w-xl leading-relaxed">
              Discover random fun conversations, meaningful relationships, and
              exciting new people through immersive real-time video chat.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/video"
                className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  🎉 Start Fun Mode
                </span>
              </a>

              <a
                href="/serious/dashboard"
                className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  ❤️ Serious Mode
                </span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-14 max-w-xl">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                <h3 className="text-3xl font-bold text-pink-400">1M+</h3>
                <p className="text-sm text-zinc-400 mt-1">Users</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                <h3 className="text-3xl font-bold text-cyan-400">24/7</h3>
                <p className="text-sm text-zinc-400 mt-1">Live Chats</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                <h3 className="text-3xl font-bold text-green-400">150+</h3>
                <p className="text-sm text-zinc-400 mt-1">Countries</p>
              </div>
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="grid gap-6">
            {/* Fun Mode */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-yellow-500/15 to-orange-500/10 p-8 backdrop-blur-xl hover:scale-[1.02] transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 blur-3xl rounded-full" />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="text-5xl mb-5">🎉</div>

                  <h3 className="text-3xl font-bold">Fun Mode</h3>

                  <p className="mt-3 text-zinc-300 leading-relaxed max-w-md">
                    Jump into instant random conversations with people around
                    the globe. No signup required.
                  </p>
                </div>

                <div className="text-yellow-300 text-4xl opacity-60 group-hover:translate-x-1 transition">
                  ↗
                </div>
              </div>
            </div>

            {/* Serious Mode */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-pink-500/15 to-rose-500/10 p-8 backdrop-blur-xl hover:scale-[1.02] transition-all duration-300">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500/20 blur-3xl rounded-full" />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="text-5xl mb-5">❤️</div>

                  <h3 className="text-3xl font-bold">Serious Mode</h3>

                  <p className="mt-3 text-zinc-300 leading-relaxed max-w-md">
                    Build deeper and meaningful connections with verified
                    profiles and smart matching.
                  </p>
                </div>

                <div className="text-pink-300 text-4xl opacity-60 group-hover:translate-x-1 transition">
                  ↗
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-md py-6 text-center text-zinc-500 text-sm">
        © 2026 Flirta — Meet. Connect. Repeat.
      </footer>
    </div>
  );
}
