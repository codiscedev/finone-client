"use client";

import * as React from "react";
import Link from "next/link";
import {
  Lock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Zap,
  CheckCircle2,
  TrendingUp,
  Coins,
  CreditCard,
  Calculator,
  Users,
  Bot,
  CalendarClock,
  PieChart,
  ShieldAlert,
  FileSpreadsheet,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLicense } from "@/hooks/use-license";

interface ModulePreset {
  badge: string;
  headline?: string;
  defaultDescription: string;
  features: {
    title: string;
    description: string;
    icon: React.ElementType;
  }[];
}

const MODULE_PRESETS: Record<string, ModulePreset> = {
  wealth: {
    badge: "Wealth & Net Worth Suite",
    defaultDescription: "Track, grow, and optimize your entire net worth across physical assets, equities, and real-time appreciation models.",
    features: [
      { title: "Real-Time Net Worth Engine", description: "Consolidated multi-asset valuation & liability balance", icon: Coins },
      { title: "Asset Appreciation Models", description: "Automated compound growth & depreciation forecasting", icon: TrendingUp },
      { title: "Debt Snowball & Avalanche", description: "Accelerated payoff schedules with interest minimization", icon: ShieldAlert },
      { title: "AI Financial Health Score", description: "Comprehensive audit of your liquidity and savings ratios", icon: Sparkles }
    ]
  },
  recurring: {
    badge: "Recurring Bills & Auto-Debit",
    defaultDescription: "Never miss a due date again. Track subscriptions, renewal calendars, and spot recurring price creeps.",
    features: [
      { title: "Auto-Debit Calendar", description: "Interactive monthly timeline of upcoming charges", icon: CalendarClock },
      { title: "Subscription Waste Detector", description: "Identify duplicate and unused recurring memberships", icon: Sparkles },
      { title: "Due Date Push Reminders", description: "Smart alerts before bills debit your accounts", icon: Zap },
      { title: "Annual vs Monthly Pricing", description: "Switch advice to save on software & service fees", icon: TrendingUp }
    ]
  },
  budget: {
    badge: "Smart Spending Caps",
    defaultDescription: "Set dynamic category budgets, monthly spending thresholds, and receive real-time overspend alerts.",
    features: [
      { title: "Category Spending Caps", description: "Custom limits for food, transit, lifestyle & more", icon: PieChart },
      { title: "Real-Time Overspend Guard", description: "Instant warning notifications as you approach caps", icon: ShieldAlert },
      { title: "AI Budget Allocations", description: "Recommended 50/30/20 breakdown tailored to your income", icon: Sparkles },
      { title: "Rolling Budget Rollover", description: "Carry surplus forward into the next month's savings", icon: TrendingUp }
    ]
  },
  income: {
    badge: "Income Streams & Payroll",
    defaultDescription: "Manage multiple salaries, freelance contracts, dividends, and passive revenue streams in one place.",
    features: [
      { title: "Multiple Income Streams", description: "Track primary salary, side hustles, consulting & perks", icon: Coins },
      { title: "Automated Payroll Detection", description: "Auto-categorize regular employer deposits", icon: Zap },
      { title: "Net Take-Home Estimator", description: "After-tax cash flow modeling based on your pay slips", icon: Calculator },
      { title: "Income Growth Trajectory", description: "Year-over-year compensation benchmarks & goals", icon: TrendingUp }
    ]
  },
  creditcard: {
    badge: "Credit Card Command Center",
    defaultDescription: "Optimize statement billing cycles, credit utilization ratios, and eliminate revolving interest charges.",
    features: [
      { title: "Utilization Ratio Guard", description: "Keep utilization below 30% to maximize credit score", icon: CreditCard },
      { title: "Statement Cycle Tracking", description: "Track billing generation dates vs payment grace windows", icon: CalendarClock },
      { title: "Zero-Interest Payoff Strategy", description: "AI schedules to eliminate credit card balances fast", icon: Sparkles },
      { title: "Card Perks & Limits", description: "Monitor reward multipliers and aggregate available credit", icon: Crown }
    ]
  },
  tax: {
    badge: "Global Tax Engine & Optimizer",
    defaultDescription: "Maximize tax deductions under Old vs New Tax Regimes with automated section calculators and reports.",
    features: [
      { title: "Old vs New Regime Simulator", description: "Exact side-by-side tax liability comparison", icon: Calculator },
      { title: "80C, 80D & HRA Spotter", description: "Automated discovery of unclaimed exemptions", icon: Sparkles },
      { title: "Capital Gains & Advance Tax", description: "Quarterly advance tax schedules & slab estimates", icon: TrendingUp },
      { title: "Audit-Ready Tax Export", description: "One-click filing summaries for your tax accountant", icon: FileSpreadsheet }
    ]
  },
  collaboration: {
    badge: "Multi-User Workspaces",
    defaultDescription: "Share finances with partners, co-tenants, or family members with granular privacy controls.",
    features: [
      { title: "Shared Household Budgets", description: "Co-manage groceries, rent, utilities & living expenses", icon: Users },
      { title: "One-Click Expense Splitting", description: "Split group dinners, trips & shared bills seamlessly", icon: Coins },
      { title: "Shared Savings Goals", description: "Joint trackers for vacations, home downpayments & funds", icon: TrendingUp },
      { title: "Role-Based Privacy", description: "Keep private accounts hidden while sharing common pots", icon: ShieldCheck }
    ]
  },
  ai: {
    badge: "AI Financial Intelligence",
    defaultDescription: "Conversational AI that answers complex financial questions, generates insights, and flags anomalies.",
    features: [
      { title: "Conversational CFO Assistant", description: "Natural language answers regarding your money habits", icon: Bot },
      { title: "Spending Anomaly Radar", description: "Detect uncharacteristic charges and surge pricing", icon: Zap },
      { title: "Custom Action Blueprints", description: "Tailored step-by-step plans to hit savings milestones", icon: Sparkles },
      { title: "Deep Cash Flow Forecasting", description: "30-60-90 day runway and liquidity projections", icon: TrendingUp }
    ]
  },
  parser: {
    badge: "Bank & SMS Parser",
    defaultDescription: "Automatically parse PDF bank statements and SMS transaction alerts into structured records.",
    features: [
      { title: "Direct PDF Statement Import", description: "Extract transactions from HDFC, ICICI, SBI, Axis & more", icon: FileSpreadsheet },
      { title: "SMS Alert Auto-Parser", description: "Instant paste or sync for credit & debit SMS notifications", icon: Zap },
      { title: "Duplicate Deduplication", description: "Smart hash check prevents double-counted transactions", icon: ShieldCheck },
      { title: "Auto Merchant Categorization", description: "Clean standardized merchant names & categories", icon: Sparkles }
    ]
  }
};

function resolveModulePreset(moduleName: string): ModulePreset {
  const lower = moduleName.toLowerCase();
  if (lower.includes("wealth") || lower.includes("net worth") || lower.includes("asset") || lower.includes("debt") || lower.includes("goal") || lower.includes("emergency")) {
    return MODULE_PRESETS.wealth;
  }
  if (lower.includes("recurring") || lower.includes("bill") || lower.includes("subscription")) {
    return MODULE_PRESETS.recurring;
  }
  if (lower.includes("budget") || lower.includes("spending cap")) {
    return MODULE_PRESETS.budget;
  }
  if (lower.includes("income") || lower.includes("payroll") || lower.includes("salary")) {
    return MODULE_PRESETS.income;
  }
  if (lower.includes("credit card") || lower.includes("card")) {
    return MODULE_PRESETS.creditcard;
  }
  if (lower.includes("tax")) {
    return MODULE_PRESETS.tax;
  }
  if (lower.includes("collab") || lower.includes("workspace") || lower.includes("team") || lower.includes("family")) {
    return MODULE_PRESETS.collaboration;
  }
  if (lower.includes("parser") || lower.includes("import") || lower.includes("statement") || lower.includes("sms")) {
    return MODULE_PRESETS.parser;
  }
  return MODULE_PRESETS.ai;
}

interface ProFeatureGuardProps {
  moduleName: string;
  description?: string;
  badge?: string;
  features?: string[];
  onUpgradeClick?: () => void;
  pricingHref?: string;
  children: React.ReactNode;
}

export function ProFeatureGuard({
  moduleName,
  description,
  badge,
  features: customFeatures,
  onUpgradeClick,
  pricingHref = "/pricing",
  children
}: ProFeatureGuardProps) {
  const { isPro, isLoading } = useLicense();
  const preset = React.useMemo(() => resolveModulePreset(moduleName), [moduleName]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[420px] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-8 flex flex-col items-center justify-center animate-pulse">
        <div className="w-14 h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800 mb-5" />
        <div className="w-64 h-7 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-3" />
        <div className="w-96 max-w-full h-4 bg-zinc-200/70 dark:bg-zinc-800/70 rounded-lg mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
          <div className="h-16 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-2xl" />
          <div className="h-16 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isPro) {
    return <>{children}</>;
  }

  const effectiveDescription = description || preset.defaultDescription;
  const effectiveBadge = badge || preset.badge;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden min-h-[620px] isolate">
      {/* Underlying blurred preview of real UI */}
      <div className="pointer-events-none select-none filter blur-[8px] opacity-40 dark:opacity-30 brightness-95 dark:brightness-75 transition-all">
        {children}
      </div>

      {/* Frosted Vignette Ambient Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-zinc-950/20 dark:bg-zinc-950/60 backdrop-blur-[6px] overflow-y-auto">
        <div className="relative max-w-2xl w-full rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-900/95 p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl text-center overflow-hidden transition-all">
          
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/15 dark:bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/15 dark:bg-amber-500/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Crown Pro Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-amber-500/10 border border-amber-500/30 dark:border-amber-400/35 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-5 shadow-sm">
              <Crown className="w-3.5 h-3.5 fill-current text-amber-500 dark:text-amber-400" />
              <span>{effectiveBadge} • Pro Tier</span>
            </div>

            {/* Main Header Title */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white tracking-tight leading-tight mb-3">
              Unlock <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-400 dark:via-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">{moduleName}</span>
            </h3>

            {/* Description */}
            <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm max-w-lg leading-relaxed mb-6 font-medium">
              {effectiveDescription}
            </p>

            {/* Feature Value Grid */}
            <div className="w-full my-1 mb-6 text-left">
              {customFeatures && customFeatures.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {customFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 transition-all hover:bg-zinc-100/80 dark:hover:bg-zinc-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {preset.features.map((feat, idx) => {
                    const IconComp = feat.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-50/90 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all text-left group"
                      >
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {feat.title}
                          </h4>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
                            {feat.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Micro SaaS Pricing Strip */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-amber-50/60 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-amber-950/30 border border-blue-200/70 dark:border-blue-800/50 mb-6 text-left">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
                  ₹59
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                    <span>Introductory Beta Pricing</span>
                    <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Save 15% on Yearly
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Monthly at ₹59 • Yearly at ₹599 (2 Months Free) • Lifetime ₹2,500
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Upgrade CTA Button */}
            <div className="w-full space-y-2.5">
              {onUpgradeClick ? (
                <Button
                  onClick={onUpgradeClick}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white font-extrabold text-sm sm:text-base py-6 rounded-2xl shadow-xl shadow-blue-600/25 dark:shadow-blue-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 border-0 outline-none"
                >
                  <Zap className="w-4 h-4 fill-white shrink-0" />
                  <span>Upgrade to FinOne Pro</span>
                  <ArrowRight className="w-4 h-4 ml-1 shrink-0 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Link href={pricingHref} className="w-full block">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white font-extrabold text-sm sm:text-base py-6 rounded-2xl shadow-xl shadow-blue-600/25 dark:shadow-blue-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 border-0 outline-none"
                  >
                    <Zap className="w-4 h-4 fill-white shrink-0" />
                    <span>Upgrade to FinOne Pro</span>
                    <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
                  </Button>
                </Link>
              )}

              {onUpgradeClick && (
                <button
                  type="button"
                  onClick={onUpgradeClick}
                  className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 cursor-pointer inline-flex items-center gap-1 outline-none"
                >
                  <span>Compare all plan features & FAQs</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Trust Assurance Strip */}
            <div className="w-full pt-6 mt-6 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>7-Day Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Instant Pro Activation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>256-Bit Bank Grade Encryption</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProFeatureGuard;
