"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-6 text-sm text-gray-400 md:flex-row">
        {/* Left */}
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 bg-clip-text text-transparent">
            Flirtaus
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            © {year} Flirtaus. All rights reserved.
          </p>
        </div>

        {/* Center */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/privacy-policy"
            className="transition hover:text-pink-400"
          >
            Privacy Policy
          </Link>

          <Link href="/terms" className="transition hover:text-pink-400">
            Terms
          </Link>

          <Link href="/support" className="transition hover:text-pink-400">
            Support
          </Link>

          <Link href="/contact" className="transition hover:text-pink-400">
            Contact
          </Link>
        </div>

        {/* Right */}
        <div className="text-center md:text-right">
          <p className="font-semibold text-pink-400">
            ❤️ Build Real Connections
          </p>

          <p className="text-xs text-gray-500">Version 1.0</p>
        </div>
      </div>
    </footer>
  );
}
