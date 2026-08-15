import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Footer } from "@/components/footer";
import { ArrowLeft, Check, Sparkles, Star, ShieldCheck, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Pricing & Plans | FinDisce (Beta Pricing)",
  description: "Simple, transparent pricing for FinDisce personal finance software. Expense tracking is free, unlock all features for ₹99/mo or ₹2,500 lifetime.",
};

export default function PublicPricingPage() {
  const featuresList = [
    { name: "Expense Tracking", free: "Included", pro: "Included" },
    { name: "Income Tracking", free: "—", pro: "Included" },
    { name: "Assets & Net Worth Ledger", free: "—", pro: "Included" },
    { name: "Debts & EMI Closure Planner", free: "—", pro: "Included" },
    { name: "Goals & Target Milestones", free: "—", pro: "Included" },
    { name: "Investments Portfolio CAGR", free: "—", pro: "Included" },
    { name: "Tax Planner & Projections", free: "—", pro: "Included" },
    { name: "AI Assistant & Financial Advisor", free: "—", pro: "Included" },
    { name: "SMS & Mobile Transaction Parsing", free: "—", pro: "Included" },
    { name: "Collaboration & Joint Accounts", free: "—", pro: "Included" },
    { name: "Priority Support (codisce.dev@gmail.com)", free: "Basic", pro: "Priority" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <BrandLogo className="text-lg" />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
              Sign In
            </Link>
            <Link href="/signup" className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg transition-all shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Pricing Hero & Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Banner Tag */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>SPECIAL BETA PRICING — LIMITED TIME</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
            Simple, Honest Pricing
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Keep expense tracking free forever. Upgrade to Pro for complete money management, AI advice, tax planning, and automated parsing.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {/* FREE PLAN */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block">Starter Tier</span>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white mt-1">FREE</h3>
              </div>

              <div className="py-2">
                <span className="text-3xl font-extrabold text-zinc-950 dark:text-white">₹0</span>
                <span className="text-zinc-500 text-xs font-semibold"> / forever</span>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                Includes expense tracking essentials to log spending and monitor budgets.
              </p>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Features Included</span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Expense Tracking</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-zinc-400">
                    <span>— Other features locked in Pro</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/signup"
                className="w-full inline-flex h-10 items-center justify-center rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-bold transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                Get Started Free
              </Link>
            </div>
          </div>

          {/* PRO MONTHLY (BETA) */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-blue-600 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Star className="h-3 w-3 fill-current text-white" /> Popular Monthly
            </span>

            <div className="space-y-4">
              <div className="mt-2">
                <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider block">Full Beta Access</span>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white mt-1">PRO MONTHLY</h3>
              </div>

              <div className="py-2">
                <span className="text-3xl font-extrabold text-zinc-950 dark:text-white">₹99</span>
                <span className="text-zinc-500 text-xs font-semibold"> / month</span>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">Beta Intro Rate</p>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                Unlock all features including income, debts, portfolio tracking, tax planning, and AI mentor.
              </p>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Everything in Free, plus:</span>
                <div className="space-y-2 text-xs">
                  {["Income & Debt Management", "Asset Portfolio & Net Worth", "Tax Planner & Projections", "AI Financial Assistant", "SMS & Bank Parser", "Priority Support"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 font-medium">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/signup?plan=pro_monthly"
                className="w-full inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md active:scale-[0.98]"
              >
                Upgrade to Pro (₹99/mo)
              </Link>
            </div>
          </div>

          {/* PRO LIFETIME (BETA) */}
          <div className="bg-white dark:bg-zinc-900 border border-emerald-500/50 rounded-3xl p-6 shadow-lg flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Best Value Lifetime
            </span>

            <div className="space-y-4">
              <div className="mt-2">
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">One-time Payment</span>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white mt-1">LIFETIME PASS</h3>
              </div>

              <div className="py-2">
                <span className="text-3xl font-extrabold text-zinc-950 dark:text-white">₹2,500</span>
                <span className="text-zinc-500 text-xs font-semibold"> / one-time</span>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">Pay once, own forever</p>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                Complete lifetime access to all current and future FinDisce features with zero recurring fees.
              </p>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Lifetime Privileges:</span>
                <div className="space-y-2 text-xs">
                  {["All Pro Features Included", "Zero Monthly Fees Forever", "All Future Updates Included", "7-Day Money Back Guarantee", "Dedicated Priority Support"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 font-medium">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/signup?plan=pro_lifetime"
                className="w-full inline-flex h-10 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md active:scale-[0.98]"
              >
                Get Lifetime Pass (₹2,500)
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Feature Comparison Table */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-3">
            Plan Comparison Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50">
                  <th className="p-3 pl-4">Feature</th>
                  <th className="p-3 text-center">Free Plan</th>
                  <th className="p-3 text-center">Pro Plan (Beta)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium text-zinc-700 dark:text-zinc-300">
                {featuresList.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                    <td className="p-3 pl-4 font-bold text-zinc-900 dark:text-white">{row.name}</td>
                    <td className="p-3 text-center">{row.free}</td>
                    <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
