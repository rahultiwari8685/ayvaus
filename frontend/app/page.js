import Footer from "../app/serious/dashboard/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-pink-500/5 blur-[90px]" />
        <div className="absolute top-1/2 -right-32 w-72 h-72 rounded-full bg-purple-500/5 blur-[90px]" />
      </div>

      <header className="relative z-20 border-b border-white/[0.06]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5">


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

      <main className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-7 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5 pt-5">
          <div className="min-w-0">
            <section>
              <div className="relative overflow-hidden rounded-[24px] border border-white/[0.10] bg-[#09090d]">
                <div className="relative h-[300px] sm:h-[300px] lg:h-[300px]">
                  <img
                    src="/hero.png"
                    alt="Flirta - Meet people your way"
                    width="1600"
                    height="800"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Left readability overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#05050a]/95 via-[#05050a]/65 to-transparent" />

                  {/* Bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

                  <div className="relative z-10 h-full flex items-center">
                    <div className="w-full px-5 sm:px-8 lg:px-10 max-w-[560px]">
                      {/* <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/35 border border-white/10 backdrop-blur-md">
                        <span className="text-sm">🌐</span>
                        <span className="text-[10px] sm:text-xs text-white/85">
                          Connect worldwide
                        </span>
                      </div> */}

                      <h2 className="mt-3 text-[32px] sm:text-[48px] lg:text-[58px] font-black tracking-[-0.05em] leading-[0.95]">
                        {" "}
                        Meet people.
                        <br />
                        <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 bg-clip-text text-transparent">
                          Your way.
                        </span>
                      </h2>

                      <p className="mt-4 max-w-[420px] text-sm sm:text-base text-white/70 leading-relaxed">
                        Chat, date or connect with people from around the world.
                      </p>

                      <section className="mt-4">
                        <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] px-4 py-4">
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl text-blue-400">♢</span>
                              <div>
                                <p className="text-xs font-semibold">
                                  Safe & Secure
                                </p>
                                <p className="text-[9px] text-zinc-500">
                                  Your safety is our priority.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-2xl text-purple-400">
                                ♙
                              </span>
                              <div>
                                <p className="text-xs font-semibold">
                                  Private Chats
                                </p>
                                <p className="text-[9px] text-zinc-500">
                                  Your privacy matters.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-2xl text-blue-400">♧</span>
                              <div>
                                <p className="text-xs font-semibold">
                                  Real People
                                </p>
                                <p className="text-[9px] text-zinc-500">
                                  Verified & active users.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-2xl text-orange-400">
                                🎁
                              </span>
                              <div>
                                <p className="text-xs font-semibold">
                                  Fun & Rewards
                                </p>
                                <p className="text-[9px] text-zinc-500">
                                  Earn rewards & unlock more.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Hero stats */}
                      {/* <div className="mt-6 flex flex-wrap gap-2">
                        <div className="min-w-[105px] px-3.5 py-2.5 rounded-xl bg-black/35 border border-white/10 backdrop-blur-md">
                          <div className="text-lg font-bold">1K+</div>
                          <div className="text-[9px] text-white/45">
                            Active users
                          </div>
                        </div>

                        <div className="min-w-[105px] px-3.5 py-2.5 rounded-xl bg-black/35 border border-white/10 backdrop-blur-md">
                          <div className="text-lg font-bold">24/7</div>
                          <div className="text-[9px] text-white/45">
                            Live conversations
                          </div>
                        </div>

                        <div className="min-w-[105px] px-3.5 py-2.5 rounded-xl bg-black/35 border border-white/10 backdrop-blur-md">
                          <div className="text-lg font-bold">150+</div>
                          <div className="text-[9px] text-white/45">
                            Countries
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>

                  <div className="absolute top-5 right-5 hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-black/30 border border-white/10 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-white/75">
                      Live connections
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="pt-5">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="hidden sm:block h-px w-14 bg-gradient-to-r from-transparent to-pink-500/40" />
                <span className="text-pink-400 text-sm">♥</span>

                <h3 className="text-base sm:text-lg font-medium text-zinc-300">
                  Choose how you want to connect
                </h3>

                <span className="text-pink-400 text-sm">♥</span>
                <span className="hidden sm:block h-px w-14 bg-gradient-to-l from-transparent to-pink-500/40" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* FUN MODE */}
                <div className="relative overflow-hidden rounded-[22px] border border-orange-400/25 bg-gradient-to-br from-orange-500/[0.10] to-transparent p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 shrink-0 rounded-full bg-orange-400/10 border border-orange-400/30 flex items-center justify-center text-3xl">
                      🙂
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xl font-bold">Meet & Enjoy</h4>

                      {/* <p className="mt-1 text-[10px] font-semibold text-orange-300">
                        Instant • Random • No Signup
                      </p> */}
                      <p className="mt-1 text-[10px] font-semibold text-orange-300">
                        Meet someone new.
                      </p>

                      <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                        Jump into random video and make new friends instantly.
                      </p>
                    </div>
                  </div>

                  <a
                    href="/video"
                    className="mt-5 w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold hover:opacity-90 transition"
                  >
                    Start from Fun
                    <span className="text-lg">→</span>
                  </a>

                  <div className="mt-5 pt-4 border-t border-white/[0.08] grid grid-cols-3">
                    <div className="text-center">
                      <div className="text-orange-400 text-xl">▣</div>
                      <p className="mt-1 text-[9px] text-zinc-300">Random</p>
                      <p className="text-[9px] text-zinc-500">Video Chat</p>
                    </div>

                    <div className="text-center border-x border-white/[0.08]">
                      <div className="text-orange-400 text-xl">♙</div>
                      <p className="mt-1 text-[9px] text-zinc-300">No Signup</p>
                      <p className="text-[9px] text-zinc-500">Required</p>
                    </div>

                    <div className="text-center">
                      <div className="text-orange-400 text-xl">ϟ</div>
                      <p className="mt-1 text-[9px] text-zinc-300">Start</p>
                      <p className="text-[9px] text-zinc-500">Instantly</p>
                    </div>
                  </div>
                </div>

                {/* SERIOUS MODE */}
                <div className="relative overflow-hidden rounded-[22px] border border-pink-400/25 bg-gradient-to-br from-pink-500/[0.10] to-transparent p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 shrink-0 rounded-full bg-pink-400/10 border border-pink-400/30 flex items-center justify-center">
                      <svg
                        width="38"
                        height="38"
                        viewBox="0 0 64 64"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-pink-400"
                      >
                        {/* Man head */}
                        <circle cx="20" cy="12" r="6" />

                        {/* Woman head */}
                        <circle cx="44" cy="12" r="6" />

                        {/* Man body */}
                        <path
                          d="
      M12 28
      C12 22 15 19 20 19
      C25 19 28 22 28 28
      L28 38
      L25 38
      L25 55
      C25 57 24 58 22 58
      C20 58 19 57 19 55
      L19 39
      L17 39
      L17 55
      C17 57 16 58 14 58
      C12 58 11 57 11 55
      L11 38
      L9 38
      Z
    "
                        />

                        {/* Woman dress/body */}
                        <path
                          d="
      M36 20
      C39 19 41 19 44 19
      C49 19 52 22 52 28
      L55 38
      L49 38
      L49 55
      C49 57 48 58 46 58
      C44 58 43 57 43 55
      L43 40
      L41 40
      L41 55
      C41 57 40 58 38 58
      C36 58 35 57 35 55
      L35 38
      L29 38
      L36 20
      Z
    "
                        />

                        {/* Holding hands */}
                        <path
                          d="M27 30 C31 32 34 32 38 30"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xl font-bold">Connect</h4>

                      <p className="mt-1 text-[10px] font-semibold text-pink-300">
                        ❤️ Relationship • 👫 Friendship • 🤝 Networking • 🌐
                        Community
                      </p>

                      <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                        Meet genuine people looking for meaningful connections.
                      </p>
                    </div>
                  </div>

                  <a
                    href="/serious/register"
                    className="mt-5 w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold hover:opacity-90 transition"
                  >
                    Find a Connection
                    <span className="text-lg">→</span>
                  </a>

                  <div className="mt-5 pt-4 border-t border-white/[0.08] grid grid-cols-3">
                    <div className="text-center">
                      <div className="text-pink-400 text-xl">♢</div>
                      <p className="mt-1 text-[9px] text-zinc-300">Verified</p>
                      <p className="text-[9px] text-zinc-500">Profiles</p>
                    </div>

                    <div className="text-center border-x border-white/[0.08]">
                      <div className="text-pink-400 text-xl">♡</div>
                      <p className="mt-1 text-[9px] text-zinc-300">
                        Meaningful
                      </p>
                      <p className="text-[9px] text-zinc-500">Matches</p>
                    </div>

                    <div className="text-center">
                      <div className="text-pink-400 text-xl">♧</div>
                      <p className="mt-1 text-[9px] text-zinc-300">Dating &</p>
                      <p className="text-[9px] text-zinc-500">Friendship</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="relative overflow-hidden rounded-[24px] border border-blue-500/35 bg-gradient-to-b from-[#06152d] via-[#071224] to-[#050912] p-6 xl:min-h-full">
            <div className="absolute -top-24 -right-20 w-60 h-60 rounded-full bg-blue-500/15 blur-[90px]" />
            <div className="absolute bottom-10 left-0 w-48 h-48 rounded-full bg-blue-700/10 blur-[80px]" />

            <div className="relative h-full min-h-[550px] xl:min-h-0 flex flex-col">
              {/* Badge */}
              <div>
                <span className="inline-flex px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-[9px] uppercase tracking-[0.14em] font-bold text-blue-300">
                  Coming Soon
                </span>
              </div>

              {/* Heading */}
              <div className="mt-5">
                <h3 className="text-[20px] sm:text-[24px] xl:text-[20px] font-bold tracking-tight">
                  <span className="text-blue-300">Opportunity & Corporate</span>
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  Career • Talent • Collaborate • Grow
                </p>
              </div>

              {/* Corporate visual */}
              <div className="relative mt-6 h-[220px] rounded-2xl overflow-hidden border border-blue-400/15 bg-[#061326]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.22),transparent_58%)]" />

                {/* Network lines */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[210px] h-[100px]">
                  <div className="absolute left-1/2 top-1/2 w-px h-full bg-blue-400/20 -translate-x-1/2 -rotate-[65deg]" />
                  <div className="absolute left-1/2 top-1/2 w-px h-full bg-blue-400/20 -translate-x-1/2 rotate-[65deg]" />
                  <div className="absolute left-1/2 top-1/2 w-full h-px bg-blue-400/20 -translate-y-1/2" />

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-blue-500/15 border border-blue-400/40 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(37,99,235,0.25)]">
                    💼
                  </div>

                  <div className="absolute left-2 top-3 w-9 h-9 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-xs">
                    ♙
                  </div>

                  <div className="absolute right-2 top-3 w-9 h-9 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-xs">
                    ♙
                  </div>

                  <div className="absolute left-2 bottom-3 w-9 h-9 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-xs">
                    ♙
                  </div>

                  <div className="absolute right-2 bottom-3 w-9 h-9 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-xs">
                    ♙
                  </div>
                </div>

                {/* City silhouette */}
                <div className="absolute bottom-0 left-0 right-0 h-20 opacity-30">
                  <div className="absolute bottom-0 left-[8%] w-8 h-14 bg-blue-900" />
                  <div className="absolute bottom-0 left-[18%] w-12 h-20 bg-blue-950" />
                  <div className="absolute bottom-0 left-[34%] w-7 h-11 bg-blue-900" />
                  <div className="absolute bottom-0 left-[50%] w-10 h-16 bg-blue-950" />
                  <div className="absolute bottom-0 left-[68%] w-8 h-13 bg-blue-900" />
                  <div className="absolute bottom-0 right-[8%] w-12 h-20 bg-blue-950" />
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-auto pt-7">
                <button
                  type="button"
                  disabled
                  className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 border border-blue-400/20 text-white text-sm font-bold shadow-lg shadow-blue-900/20 cursor-not-allowed"
                >
                  Explore Corporate Mode
                  <span className="text-base">→</span>
                </button>

                {/* <p className="mt-4 text-center text-[10px] leading-relaxed text-zinc-600">
                  We're working hard to bring you the best professional
                  networking experience.
                </p> */}
              </div>

              {/* Features */}
              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-300">
                    ♧
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">
                      Professional Networking
                    </h4>

                    <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">
                      Connect with professionals from various industries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-300">
                    ☆
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">
                      Business Opportunities
                    </h4>

                    <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">
                      Discover new opportunities and collaborations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-300">
                    ★
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">Grow Together</h4>

                    <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">
                      Build partnerships and achieve more together.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
