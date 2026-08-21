export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white overflow-x-hidden">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-pink-500/5 blur-[90px]" />
        <div className="absolute top-1/2 -right-32 w-72 h-72 rounded-full bg-purple-500/5 blur-[90px]" />
      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="relative z-20 border-b border-white/[0.06]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <span className="text-base">♥</span>
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">
                Flirta
              </h1>

              <p className="text-[8px] text-zinc-500 tracking-[0.2em] uppercase mt-1">
                Meet. Connect.
              </p>
            </div>
          </a>

          {/* Right */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

              <span className="text-[11px] text-zinc-400">
                People are online
              </span>
            </div>

            <button className="px-3.5 py-2 rounded-full border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium transition">
              Explore
            </button>
          </div>
        </nav>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* =====================================================
            COMPACT HERO
        ====================================================== */}
        <section className="pt-4 sm:pt-5">
          <div className="relative overflow-hidden rounded-[24px] border border-white/[0.09]">
            {/* Hero image */}
            <div className="relative h-[270px] sm:h-[285px] md:h-[305px]">
              <img
                src="/hero.png"
                alt="Flirta - Connect with people worldwide"
                width="1600"
                height="700"
                fetchPriority="high"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

              {/* =================================================
                  HERO CONTENT
              ================================================== */}
              <div className="relative h-full flex items-center">
                <div className="px-5 sm:px-8 md:px-10 max-w-2xl">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/35 border border-white/10 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                    <span className="text-[10px] sm:text-xs text-white/80">
                      Connect with people worldwide
                    </span>
                  </div>

                  {/* Heading */}
                  <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-extrabold tracking-[-0.04em] leading-[0.95]">
                    Meet someone.
                    <br />
                    <span className="bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent">
                      Start something.
                    </span>
                  </h2>

                  {/* Description */}
                  <p className="mt-2 max-w-lg text-[11px] sm:text-xs md:text-sm text-white/65 leading-relaxed">
                    Random video chats, meaningful relationships and real
                    connections — all in one place.
                  </p>

                  {/* =================================================
                      COMPACT STATS
                  ================================================== */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="px-3 py-1.5 rounded-lg bg-black/35 border border-white/10">
                      <span className="text-sm font-bold">1K+</span>
                      <span className="ml-1 text-[9px] text-white/45">
                        users
                      </span>
                    </div>

                    <div className="px-3 py-1.5 rounded-lg bg-black/35 border border-white/10">
                      <span className="text-sm font-bold">24/7</span>
                      <span className="ml-1 text-[9px] text-white/45">
                        live
                      </span>
                    </div>

                    <div className="px-3 py-1.5 rounded-lg bg-black/35 border border-white/10">
                      <span className="text-sm font-bold">150+</span>
                      <span className="ml-1 text-[9px] text-white/45">
                        countries
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small visual label on right */}
              <div className="absolute right-5 top-5 hidden md:block">
                <div className="px-3 py-1.5 rounded-full bg-black/30 border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] text-white/70">
                    🌎 Live connections
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            MODE SELECTOR
        ====================================================== */}
        <section className="pt-6">
          {/* Section heading */}
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-pink-400 font-semibold">
                Choose your experience
              </p>

              <h3 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight">
                How do you want to connect?
              </h3>
            </div>

            <p className="hidden sm:block text-[10px] text-zinc-600">
              Pick a mode
            </p>
          </div>

          {/* =================================================
              MODE CARDS
          ================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* =================================================
                FUN MODE
            ================================================== */}
            <div className="relative overflow-hidden rounded-2xl border border-orange-400/15 bg-orange-500/[0.06] p-4 sm:p-5">
              <div className="relative">
                {/* Top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-400/10 border border-orange-300/10 flex items-center justify-center">
                      <span className="text-lg">🎉</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold">Fun Mode</h4>

                      <p className="text-[9px] text-orange-300/70">
                        Instant • Random
                      </p>
                    </div>
                  </div>

                  <span className="text-[8px] uppercase tracking-wider font-bold text-orange-300 bg-orange-400/10 border border-orange-300/10 px-2 py-1 rounded-full">
                    No Signup
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-[11px] text-zinc-400 leading-relaxed">
                  Meet someone new and start a random video conversation
                  instantly.
                </p>

                {/* Mini features */}
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                  <span className="text-[9px] text-zinc-400">
                    ✓ Random video
                  </span>

                  <span className="text-[9px] text-zinc-400">✓ No signup</span>

                  <span className="text-[9px] text-zinc-400">✓ Instant</span>
                </div>

                {/* CTA */}
                <a
                  href="/video"
                  className="mt-4 w-full h-9 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold hover:opacity-90 transition"
                >
                  Start Fun Mode
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* =================================================
                SERIOUS MODE
            ================================================== */}
            <div className="relative overflow-hidden rounded-2xl border border-pink-400/20 bg-pink-500/[0.07] p-4 sm:p-5">
              <div className="relative">
                {/* Top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-pink-400/10 border border-pink-300/10 flex items-center justify-center">
                      <span className="text-lg">❤️</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold">Serious Mode</h4>

                      <p className="text-[9px] text-pink-300/70">
                        Dating • Relationships
                      </p>
                    </div>
                  </div>

                  <span className="text-[8px] uppercase tracking-wider font-bold text-pink-300 bg-pink-400/10 border border-pink-300/10 px-2 py-1 rounded-full">
                    Verified
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-[11px] text-zinc-400 leading-relaxed">
                  Looking for something real? Discover meaningful relationships
                  and genuine connections.
                </p>

                {/* Mini features */}
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                  <span className="text-[9px] text-zinc-400">
                    ♥ Verified profiles
                  </span>

                  <span className="text-[9px] text-zinc-400">♥ Dating</span>

                  <span className="text-[9px] text-zinc-400">♥ Friendship</span>
                </div>

                {/* CTA */}
                <a
                  href="/serious/register"
                  className="mt-4 w-full h-9 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold hover:opacity-90 transition"
                >
                  Find a Connection
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* =================================================
                CORPORATE MODE
            ================================================== */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-400/15 bg-blue-500/[0.05] p-4 sm:p-5">
              <div className="relative">
                {/* Top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-400/10 border border-blue-300/10 flex items-center justify-center">
                      <span className="text-lg">💼</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold">Corporate Mode</h4>

                      <p className="text-[9px] text-blue-300/70">
                        Network • Business
                      </p>
                    </div>
                  </div>

                  <span className="text-[8px] uppercase tracking-wider font-bold text-blue-300 bg-blue-400/10 border border-blue-300/10 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-[11px] text-zinc-400 leading-relaxed">
                  Build professional connections, discover opportunities and
                  grow your business network.
                </p>

                {/* Mini features */}
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                  <span className="text-[9px] text-zinc-400">◆ Networking</span>

                  <span className="text-[9px] text-zinc-400">◆ Business</span>

                  <span className="text-[9px] text-zinc-400">
                    ◆ Opportunities
                  </span>
                </div>

                {/* Disabled CTA */}
                <button
                  type="button"
                  disabled
                  className="mt-4 w-full h-9 inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-zinc-600 text-xs font-bold cursor-not-allowed"
                >
                  Coming Soon
                  <span>🔒</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            TRUST STRIP
        ====================================================== */}
        <section className="mt-4">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-pink-400 text-sm">🛡</span>

                <div>
                  <p className="text-[10px] font-semibold">Safe</p>

                  <p className="text-[8px] text-zinc-600">
                    Better conversations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-purple-400 text-sm">🔒</span>

                <div>
                  <p className="text-[10px] font-semibold">Private</p>

                  <p className="text-[8px] text-zinc-600">
                    Your privacy matters
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-blue-400 text-sm">👥</span>

                <div>
                  <p className="text-[10px] font-semibold">Real People</p>

                  <p className="text-[8px] text-zinc-600">
                    Genuine connections
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-orange-400 text-sm">🎁</span>

                <div>
                  <p className="text-[10px] font-semibold">Fun</p>

                  <p className="text-[8px] text-zinc-600">More to discover</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="relative z-10 border-t border-white/[0.05] py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-xs font-semibold text-zinc-400">Flirta</div>

          <div className="text-[9px] text-zinc-600">
            © 2026 Flirta — Meet. Connect. Repeat.
          </div>
        </div>
      </footer>
    </div>
  );
}
