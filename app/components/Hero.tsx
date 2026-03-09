import Link from "next/link";
import { FaShieldAlt, FaBolt, FaLink, FaVoteYea } from "react-icons/fa";

const stats = [
  { label: "On-Chain KYC", value: "Verified" },
  { label: "Exclusive Benefits", value: "VYO Rewards" },
  { label: "Token", value: "VYO" },
  { label: "Zero Fee", value: "Transfers" },
];

const trustBadges = [
  {
    icon: <FaShieldAlt className="w-5 h-5" />,
    text: "AES-256 Encrypted Wallets",
  },
  {
    icon: <FaLink className="w-5 h-5" />,
    text: "Blockchain Secured",
  },
  {
    icon: <FaVoteYea className="w-5 h-5" />,
    text: "Community Loan Voting",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#222a32] text-white">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-150 h-150 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-125 h-125 rounded-full bg-indigo-500/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 sm:py-28 lg:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-600/15 px-4 py-1.5 text-sm font-medium text-indigo-300 mb-6 border border-indigo-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
              </span>
              Blockchain-Powered Digital Banking
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Banking that{" "}
              <span className="text-indigo-400">moves</span> with you
            </h1>

            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              Custodial wallets, decentralized loan approvals, on-chain KYC attestation,
              and VyomaToken rewards — all backed by Ethereum smart contracts.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signIn/register"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3.5 rounded-lg text-base font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                Open an Account
              </Link>
              <Link
                href="/signIn"
                className="group flex items-center gap-2 text-gray-300 hover:text-white px-5 py-3.5 rounded-lg text-base font-medium border border-gray-600 hover:border-gray-400 transition-all"
              >
                Sign In
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-400">
              {trustBadges.map((badge) => (
                <div key={badge.text} className="flex items-center gap-2">
                  <span className="text-indigo-400">{badge.icon}</span>
                  {badge.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right side — Stats grid */}
          <div className="grid grid-cols-2 gap-4 lg:gap-5">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`rounded-2xl p-6 lg:p-8 backdrop-blur-sm border transition-all hover:-translate-y-1 hover:shadow-lg ${
                  i % 2 === 0
                    ? "bg-white/5 border-white/10 hover:bg-white/8"
                    : "bg-indigo-600/10 border-indigo-500/15 hover:bg-indigo-600/15"
                }`}
              >
                <p className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 40C1248 36.7 1344 33.3 1392 31.7L1440 30V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z"
            fill="#edeae7"
          />
        </svg>
      </div>
    </section>
  );
}
