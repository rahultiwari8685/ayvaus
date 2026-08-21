export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 left-[35%] w-[450px] h-[450px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="relative z-20">
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <span className="text-lg">♥</span>
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">Flirta</h1>
              <p className="text-[10px] text-zinc-500 tracking-[0.18em] uppercase">
                Meet. Connect.
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

              <span className="text-xs text-zinc-400">People are online</span>
            </div>

            <button className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-sm font-medium transition">
              Explore
            </button>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pb-12">
        {/* Hero */}
        <section className="pt-6 md:pt-10">
          <div className="relative overflow-hidden rounded-[30px] md:rounded-[38px] border border-white/[0.1] bg-white/[0.03] shadow-2xl">
            {/* Hero Image */}
            <div className="relative h-[390px] sm:h-[420px] md:h-[440px]">
              <img
                src="/hero.png"
                alt="Flirta - Meet new people"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Image overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />

              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

              {/* Floating online badge */}
              <div className="absolute top-5 left-5 sm:top-7 sm:left-7">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/35 border border-white/10 backdrop-blur-xl">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                  <span className="text-xs sm:text-sm text-white/90">
                    Thousands are connecting now
                  </span>
                </div>
              </div>

              {/* Hero Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-14">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl mb-5">
                    <span className="text-xs font-medium text-white/80">
                      🌎 Connect worldwide
                    </span>
                  </div>

                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.05em] leading-[0.92]">
                    {" "}
                    Meet someone.
                    <br />
                    <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 bg-clip-text text-transparent">
                      Start something.
                    </span>
                  </h2>

                  <p className="mt-3 max-w-xl text-xs sm:text-sm md:text-base text-white/65 leading-relaxed">
                    {" "}
                    Discover new people, start conversations and build
                    connections — from casual chats to meaningful relationships.
                  </p>

                  {/* Stats */}
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <div className="px-4 py-3 rounded-2xl bg-black/35 border border-white/10 backdrop-blur-xl">
                      <div className="text-xl font-bold">1K+</div>
                      <div className="text-[11px] text-white/45 mt-0.5">
                        Active users
                      </div>
                    </div>

                    <div className="px-4 py-3 rounded-2xl bg-black/35 border border-white/10 backdrop-blur-xl">
                      <div className="text-xl font-bold">24/7</div>
                      <div className="text-[11px] text-white/45 mt-0.5">
                        Live conversations
                      </div>
                    </div>

                    <div className="px-4 py-3 rounded-2xl bg-black/35 border border-white/10 backdrop-blur-xl">
                      <div className="text-xl font-bold">150+</div>
                      <div className="text-[11px] text-white/45 mt-0.5">
                        Countries
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mode Selector */}
        <section className="pt-7 md:pt-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-400 mb-2">
                Your experience
              </p>

              <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                Choose your mode
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Connect with people your way.
              </p>
            </div>

            <div className="hidden sm:block text-xs text-zinc-600">
              Pick what feels right for you
            </div>
          </div>

          {/* Mode Cards */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* FUN MODE */}
            <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-orange-500/[0.12] via-yellow-500/[0.04] to-transparent p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/20">
              {/* Glow */}
              <div className="absolute -top-20 -right-20 w-44 h-44 bg-orange-500/20 rounded-full blur-[70px]" />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-orange-400/10 border border-orange-300/10 flex items-center justify-center text-2xl">
                    🎉
                  </div>

                  <span className="px-3 py-1.5 rounded-full bg-orange-400/10 border border-orange-300/10 text-[10px] uppercase tracking-wider font-bold text-orange-300">
                    Instant
                  </span>
                </div>

                <div className="mt-7">
                  <h4 className="text-2xl font-bold">Fun Mode</h4>

                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    Meet someone new, start a random conversation and just have
                    fun.
                  </p>
                </div>

                {/* Features */}
                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <span className="text-emerald-400">✓</span>
                    No signup required
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <span className="text-emerald-400">✓</span>
                    Random video conversations
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <span className="text-emerald-400">✓</span>
                    Start instantly
                  </div>
                </div>

                {/* Button */}
                <a
                  href="/video"
                  className="mt-7 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  Start Fun Mode
                  <span className="text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </div>

            {/* SERIOUS MODE */}
            <div className="group relative overflow-hidden rounded-[28px] border border-pink-400/[0.15] bg-gradient-to-br from-pink-500/[0.14] via-rose-500/[0.05] to-transparent p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/30">
              {/* Glow */}
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-pink-500/20 rounded-full blur-[75px]" />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-pink-400/10 border border-pink-300/10 flex items-center justify-center text-2xl">
                    ❤️
                  </div>

                  <span className="px-3 py-1.5 rounded-full bg-pink-400/10 border border-pink-300/10 text-[10px] uppercase tracking-wider font-bold text-pink-300">
                    Meaningful
                  </span>
                </div>

                <div className="mt-7">
                  <h4 className="text-2xl font-bold">Serious Mode</h4>

                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    Looking for something real? Connect with people who are open
                    to meaningful relationships.
                  </p>
                </div>

                {/* Features */}
                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <span className="text-pink-400">♥</span>
                    Verified profiles
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <span className="text-pink-400">♥</span>
                    Real dating experiences
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <span className="text-pink-400">♥</span>
                    Relationships & friendship
                  </div>
                </div>

                {/* Button */}
                <a
                  href="/serious/register"
                  className="mt-7 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-500/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  Find a Connection
                  <span className="text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </div>

            {/* CORPORATE MODE */}
            <div className="group relative overflow-hidden rounded-[28px] border border-blue-400/[0.12] bg-gradient-to-br from-blue-500/[0.10] via-indigo-500/[0.04] to-transparent p-6 sm:p-7">
              {/* Glow */}
              <div className="absolute top-1/2 -right-20 w-48 h-48 bg-blue-500/15 rounded-full blur-[80px]" />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-400/10 border border-blue-300/10 flex items-center justify-center text-2xl">
                    💼
                  </div>

                  <span className="px-3 py-1.5 rounded-full bg-blue-400/10 border border-blue-300/10 text-[10px] uppercase tracking-wider font-bold text-blue-300">
                    Coming Soon
                  </span>
                </div>

                <div className="mt-7">
                  <h4 className="text-2xl font-bold">Corporate Mode</h4>

                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    Build professional connections, discover opportunities and
                    grow your network.
                  </p>
                </div>

                {/* Features */}
                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-400">
                    <span className="text-blue-400">◆</span>
                    Professional networking
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-zinc-400">
                    <span className="text-blue-400">◆</span>
                    Business connections
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-zinc-400">
                    <span className="text-blue-400">◆</span>
                    Opportunities & collaboration
                  </div>
                </div>

                {/* Disabled Button */}
                <button
                  disabled
                  className="mt-7 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-zinc-500 font-bold text-sm cursor-not-allowed"
                >
                  Coming Soon
                  <span className="text-base">🔒</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / Bottom Section */}
        <section className="mt-10 rounded-[26px] border border-white/[0.07] bg-white/[0.025] px-5 py-5 sm:px-7">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-pink-400 border-2 border-[#070709]" />
                <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-[#070709]" />
                <div className="w-8 h-8 rounded-full bg-orange-400 border-2 border-[#070709]" />
                <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-[#070709]" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  People are joining right now
                </p>

                <p className="text-xs text-zinc-500">
                  Your next conversation could be one swipe away.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="text-emerald-400">●</span>
              Safe conversations
              <span className="text-zinc-700">•</span>
              Real connections
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-7 px-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm font-semibold text-zinc-300">Flirta</div>

          <div className="text-xs text-zinc-600">
            © 2026 Flirta — Meet. Connect. Repeat.
          </div>
        </div>
      </footer>
    </div>
  );
}
