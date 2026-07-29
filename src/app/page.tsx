import Image from "next/image";
import Link from "next/link";
import { TrendingUp, ArrowRight, ShieldCheck, Sparkles, PieChart, Activity } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans overflow-hidden">
      {/* Decorative Blur Backdrops */}
      <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-6 sm:px-8">
        <div className="flex items-center gap-2">
          <BrandLogo className="text-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-1.5 rounded-lg transition-all active:scale-[0.98] shadow-sm"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-6 text-center py-20 sm:py-32">
        <div className="space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 px-3.5 py-1 text-xs text-emerald-600 dark:text-emerald-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>FinDisce Desktop Frontend Client</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15] sm:leading-[1.1]">
            Wealth management,{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
              simplified.
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-xl mx-auto text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Welcome to FinDisce. Track portfolios, analyze cash flows, and secure your financial goals in one premium dashboard client.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0047AB] hover:bg-[#003b8f] px-6 font-semibold text-white transition-all shadow-md shadow-blue-500/10 active:scale-[0.98]"
            >
              Go to Dashboard
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 px-6 font-semibold text-zinc-900 dark:text-white transition-all active:scale-[0.98]"
            >
              Create Free Account
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mt-24 text-left">
          <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 p-5 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <PieChart className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Clean Analytics</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Get visually rich reports and allocation breakdowns on all holdings.</p>
          </div>

          <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 p-5 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <Activity className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Real-time Performance</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Track net assets value updates dynamically as rates fluctuate.</p>
          </div>

          <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 p-5 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Secure Access</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Your sensitive information is secured locally with best security standards.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-xs text-zinc-500 dark:text-zinc-500 border-t border-zinc-200/50 dark:border-zinc-900/50">
        &copy; {new Date().getFullYear()} FinDisce. Powered by Codisce.
      </footer>
    </div>
  );
}
