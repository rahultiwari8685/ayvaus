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
            <div className="relative h-[300px] sm:h-[320px] md:h-[345px]">
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/15" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

              {/* =================================================
                  HERO CONTENT
              ================================================== */}
              <div className="relative h-full flex items-center">
                <div className="px-5 sm:px-8 md:px-10 max-w-xl">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/35 border border-white/10 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                    <span className="text-[10px] sm:text-xs text-white/80">
                      Connect with people worldwide
                    </span>
                  </div>

                  {/* Heading */}
                  <h2 className="text-[34px] sm:text-[44px] md:text-[52px] font-extrabold tracking-[-0.04em] leading-[0.95]">
                    Meet people.
                    <br />
                    <span className="bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent">
                      Your way.
                    </span>
                  </h2>

                  {/* Description */}
                  <p className="mt-2 max-w-lg text-[11px] sm:text-xs md:text-sm text-white/65 leading-relaxed">
                    Chat, date or connect with people from around the world.
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
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_330px] gap-3">
            {/* LEFT: FUN + SERIOUS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* FUN MODE */}
              <div className="relative overflow-hidden rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/[0.09] to-transparent p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-orange-400/10 border border-orange-400/30 flex items-center justify-center text-2xl">
                    🙂
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xl font-bold">Fun Mode</h4>
                    <p className="mt-0.5 text-[10px] font-medium text-orange-300">
                      Instant • Random • No Signup
                    </p>

                    <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                      Jump into random video chats and make new friends
                      instantly.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.07] grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-orange-400 text-lg">▣</div>
                    <p className="mt-1 text-[9px] text-zinc-300">Random</p>
                    <p className="text-[9px] text-zinc-500">Video Chat</p>
                  </div>

                  <div className="text-center border-x border-white/[0.07]">
                    <div className="text-orange-400 text-lg">♙</div>
                    <p className="mt-1 text-[9px] text-zinc-300">No Signup</p>
                    <p className="text-[9px] text-zinc-500">Required</p>
                  </div>

                  <div className="text-center">
                    <div className="text-orange-400 text-lg">ϟ</div>
                    <p className="mt-1 text-[9px] text-zinc-300">Start</p>
                    <p className="text-[9px] text-zinc-500">Instantly</p>
                  </div>
                </div>

                <a
                  href="/video"
                  className="mt-5 w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold hover:opacity-90 transition"
                >
                  Start Fun Mode
                  <span className="text-lg">→</span>
                </a>
              </div>

              {/* SERIOUS MODE */}
              <div className="relative overflow-hidden rounded-2xl border border-pink-400/20 bg-gradient-to-br from-pink-500/[0.10] to-transparent p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-pink-400/10 border border-pink-400/30 flex items-center justify-center text-2xl">
                    ♥
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xl font-bold">Serious Mode</h4>
                    <p className="mt-0.5 text-[10px] font-medium text-pink-300">
                      Verified • Dating • Relationships
                    </p>

                    <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                      Meet genuine people looking for meaningful connections.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.07] grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-pink-400 text-lg">♢</div>
                    <p className="mt-1 text-[9px] text-zinc-300">Verified</p>
                    <p className="text-[9px] text-zinc-500">Profiles</p>
                  </div>

                  <div className="text-center border-x border-white/[0.07]">
                    <div className="text-pink-400 text-lg">♡</div>
                    <p className="mt-1 text-[9px] text-zinc-300">Meaningful</p>
                    <p className="text-[9px] text-zinc-500">Matches</p>
                  </div>

                  <div className="text-center">
                    <div className="text-pink-400 text-lg">♧</div>
                    <p className="mt-1 text-[9px] text-zinc-300">Dating &</p>
                    <p className="text-[9px] text-zinc-500">Friendship</p>
                  </div>
                </div>

                <a
                  href="/serious/register"
                  className="mt-5 w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold hover:opacity-90 transition"
                >
                  Find a Connection
                  <span className="text-lg">→</span>
                </a>
              </div>
            </div>

            {/* RIGHT: SINGLE CORPORATE SIDEBAR */}
            <aside className="relative overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-b from-blue-500/[0.10] via-blue-500/[0.04] to-transparent p-5 xl:min-h-[100%]">
              <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-blue-500/15 blur-[80px]" />

              <div className="relative h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1.5 rounded-full bg-blue-400/10 border border-blue-300/20 text-[9px] uppercase tracking-wider font-bold text-blue-300">
                    Coming Soon
                  </span>

                  <span className="text-2xl">💼</span>
                </div>

                <h4 className="mt-4 text-2xl font-bold tracking-tight">
                  <span className="text-blue-400">Corporate</span> Mode
                </h4>

                <p className="mt-1 text-sm text-zinc-400">
                  Professional • Network • Grow
                </p>

                <div className="mt-5 rounded-xl border border-blue-400/10 bg-black/20 p-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-xs">
                      ♙
                    </span>
                    <span className="text-blue-400">↔</span>
                    <span className="w-11 h-11 rounded-full bg-blue-400/15 border border-blue-400/25 flex items-center justify-center text-lg">
                      💼
                    </span>
                    <span className="text-blue-400">↔</span>
                    <span className="w-8 h-8 rounded-full bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-xs">
                      ♙
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-blue-500/10 border border-blue-400/15 flex items-center justify-center text-sm">
                      👥
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        Professional Networking
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-500 leading-relaxed">
                        Connect with professionals from various industries.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-blue-500/10 border border-blue-400/15 flex items-center justify-center text-sm">
                      ☆
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        Business Opportunities
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-500 leading-relaxed">
                        Discover new opportunities and collaborations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-blue-500/10 border border-blue-400/15 flex items-center justify-center text-sm">
                      ★
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Grow Together</p>
                      <p className="mt-1 text-[10px] text-zinc-500 leading-relaxed">
                        Build partnerships and achieve more together.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <button
                    type="button"
                    disabled
                    className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600/60 border border-blue-400/20 text-white text-sm font-bold cursor-not-allowed"
                  >
                    Explore Corporate Mode
                    <span>→</span>
                  </button>

                  <p className="mt-4 text-center text-[10px] text-zinc-600 leading-relaxed">
                    We're working hard to bring you the best professional
                    networking experience.
                  </p>
                </div>
              </div>
            </aside>
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
