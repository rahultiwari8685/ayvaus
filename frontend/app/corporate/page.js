import Link from "next/link";

export default function CorporatePage() {
  return (
    <div className="min-h-screen bg-[#050b16] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.07]">
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black">
              F
            </div>

            <div>
              <h1 className="font-bold tracking-tight">Flirta</h1>

              <p className="text-[8px] text-blue-300 tracking-[0.2em] uppercase">
                Corporate
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/corporate/login"
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-zinc-300 hover:bg-white/[0.07] transition"
            >
              Login
            </Link>

            <Link
              href="/corporate/register"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-400/20 bg-blue-500/10 text-blue-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Corporate Mode
            </div>

            <h2 className="mt-7 text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.05em] leading-[0.95]">
              Connect Talent.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                Build Careers.
              </span>
            </h2>

            <p className="mt-7 max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed">
              A professional space where employees discover opportunities and
              companies find verified talent.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/corporate/register/employee"
                className="h-12 px-7 inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition"
              >
                I'm Looking for a Job
              </Link>

              <Link
                href="/corporate/register/company"
                className="h-12 px-7 inline-flex items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/5 hover:bg-blue-500/10 text-blue-200 font-bold transition"
              >
                I'm Hiring
              </Link>
            </div>
          </div>
        </section>

        {/* Two User Types */}
        <section className="pb-20">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Employee */}
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 hover:border-blue-400/20 transition">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-2xl">
                👨‍💼
              </div>

              <h3 className="mt-6 text-2xl font-bold">For Employees</h3>

              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Create a professional profile, verify your identity and discover
                relevant career opportunities.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Create professional profile",
                  "Add skills and experience",
                  "Upload resume",
                  "Get verified",
                  "Discover relevant jobs",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-zinc-300"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs">
                      ✓
                    </span>

                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/corporate/register/employee"
                className="mt-7 w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center font-semibold text-sm transition"
              >
                Create Employee Account
              </Link>
            </div>

            {/* Company */}
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 hover:border-indigo-400/20 transition">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-2xl">
                🏢
              </div>

              <h3 className="mt-6 text-2xl font-bold">For Companies</h3>

              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Build your company profile, get verified and discover candidates
                based on your hiring requirements.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Create company profile",
                  "Verify your company",
                  "Post job opportunities",
                  "Discover relevant candidates",
                  "Manage hiring process",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-zinc-300"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs">
                      ✓
                    </span>

                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/corporate/register/company"
                className="mt-7 w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center font-semibold text-sm transition"
              >
                Create Company Account
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
