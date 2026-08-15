"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  PieChart,
  Activity,
  Coins,
  Smartphone,
  CalendarCheck,
  BrainCircuit,
  Lock,
  ChevronDown,
  ChevronUp,
  Check,
  Star,
  Mail,
  Zap,
  DollarSign
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Footer } from "@/components/footer";

export default function Home() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "Can I use FinDisce for free?",
      a: "Yes! Expense tracking is completely free forever. You can log expenses, track spending categories, and manage cash flow at zero cost."
    },
    {
      q: "What is Beta Pricing?",
      a: "As part of our initial Micro SaaS launch, we offer our Pro features (Income tracking, Net worth ledgers, Tax Planner, AI Mentor, SMS parser) at a discounted Beta rate of ₹99/month or a ₹2,500 Lifetime pass."
    },
    {
      q: "How does the 7-day refund policy work?",
      a: "We offer a 100% 7-day money-back guarantee on all Pro subscription and Lifetime pass purchases. If you are not satisfied, email us at codisce.dev@gmail.com and we will refund your payment in 5-7 business days."
    },
    {
      q: "How does SMS and mobile parsing work?",
      a: "Our mobile companion app parses bank SMS notifications locally on your device with your explicit consent to automatically log income and expense entries without reading personal text messages."
    },
    {
      q: "Is my financial data secure?",
      a: "Yes. All data is encrypted using 256-bit SSL encryption in transit and AES-256 at rest. We do not sell or share your personal financial data with third parties."
    },
    {
      q: "How do I contact customer support?",
      a: "You can reach our support team anytime by emailing codisce.dev@gmail.com. We respond to inquiries within 24 hours."
    }
  ];

  const features = [
    {
      icon: PieChart,
      color: "emerald",
      title: "Expense & Budget Tracking",
      badge: "Free Tier",
      description: "Log expenses instantly, track category trends, and keep your daily cash flow under total control."
    },
    {
      icon: Coins,
      color: "blue",
      title: "Net Worth & Asset Vault",
      badge: "Pro",
      description: "Consolidate real estate, stocks, mutual funds, gold, and cash reserves into a single live net worth indicator."
    },
    {
      icon: BrainCircuit,
      color: "purple",
      title: "AI Financial Assistant",
      badge: "Pro",
      description: "Get personalized actionable recommendations to optimize portfolio allocation and accelerate debt payoffs."
    },
    {
      icon: Smartphone,
      color: "amber",
      title: "SMS & Bank Parser",
      badge: "Pro Mobile",
      description: "Automatically convert incoming bank SMS messages into organized transaction entries seamlessly."
    },
    {
      icon: CalendarCheck,
      color: "indigo",
      title: "Tax Planner & Forecasts",
      badge: "Pro",
      description: "Estimate annual income tax liabilities, optimize deductions, and plan capital gains offsets effectively."
    },
    {
      icon: ShieldCheck,
      color: "emerald",
      title: "Bank-Grade Security",
      badge: "Security",
      description: "Protected with AES-256 database encryption, OAuth 2.0 authentication, and strict privacy controls."
    }
  ];

  return (
    <div className="relative flex flex-col flex-1 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      
      {/* Decorative Gradient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-1/3 left-0 transform -translate-x-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between py-5 px-6 sm:px-8 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="flex items-center gap-6">
          <BrandLogo className="text-xl" />
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <a href="#features" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center gap-1">
              Pricing <span className="bg-blue-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">Beta</span>
            </a>
            <a href="#faq" className="hover:text-zinc-950 dark:hover:text-white transition-colors">FAQs</a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-blue-500/10"
          >
            Create Free Account
          </Link>
        </div>
      </header>

      {/* 1. Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center max-w-5xl mx-auto px-6 text-center pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="space-y-6 max-w-3xl">
          {/* Beta Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>FinDisce Personal Finance Platform • Beta Launch</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.15] sm:leading-[1.1]">
            Master your money,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
              simplify your wealth.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Track expenses, manage net worth portfolios, automate SMS log parsing, forecast taxes, and receive AI financial guidance — all in one micro SaaS suite.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-7 text-xs font-bold text-white transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              Start Free (Expense Tracking)
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#pricing"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-7 text-xs font-bold text-zinc-900 dark:text-white transition-all active:scale-[0.98]"
            >
              Explore Beta Pricing (₹99/mo)
            </a>
          </div>

          {/* Security & Guarantee Tagline */}
          <div className="flex items-center justify-center gap-6 pt-4 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Bank-grade encryption
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-blue-500" /> Instant digital access
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-500" /> 7-Day Money-Back Guarantee
            </span>
          </div>
        </div>

        {/* 2. Feature / Benefit Grid Section */}
        <section id="features" className="w-full max-w-5xl mt-28 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
              Comprehensive Money Management
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Everything you need to reach financial freedom
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Built from the ground up to give you clarity on where every rupee goes and how your wealth builds over time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 p-6 shadow-sm hover:shadow-md transition-all group backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Beta Pricing Section */}
        <section id="pricing" className="w-full max-w-5xl mt-28 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
              Transparent Micro SaaS Pricing
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Start free, upgrade for full wealth power
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Expense tracking is 100% free. Access all advanced features under our limited-time Beta Pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left items-stretch">
            {/* Free Tier */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block">Starter</span>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">FREE TIER</h3>
                <div className="py-2">
                  <span className="text-3xl font-black text-zinc-950 dark:text-white">₹0</span>
                  <span className="text-xs text-zinc-500 font-semibold"> / forever</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Expense tracking only. Log cash flow and manage daily spending categories.</p>
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>Expense Tracking Only</span>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/signup"
                  className="w-full inline-flex h-10 items-center justify-center rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>

            {/* Pro Monthly (Beta) */}
            <div className="rounded-3xl border-2 border-blue-600 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between shadow-xl relative">
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> Beta Special
              </span>
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider block mt-2">Full Pro Access</span>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">PRO MONTHLY</h3>
                <div className="py-2">
                  <span className="text-3xl font-black text-zinc-950 dark:text-white">₹99</span>
                  <span className="text-xs text-zinc-500 font-semibold"> / month</span>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">Special Beta Rate</p>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">All features including Income, Debts, Assets, Tax Planner, AI Mentor, and SMS Parser.</p>
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2 text-xs">
                  {["All Pro Features Unlocked", "AI Financial Mentor", "SMS & Bank Automatic Parser", "Tax Planner & Offsets", "Priority Support"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 font-medium">
                      <Check className="h-4 w-4 text-blue-600" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/signup?plan=pro_monthly"
                  className="w-full inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md"
                >
                  Get Pro Monthly (₹99/mo)
                </Link>
              </div>
            </div>

            {/* Lifetime Pass */}
            <div className="rounded-3xl border border-emerald-500/50 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between shadow-lg relative">
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Lifetime Value
              </span>
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block mt-2">One-Time Payment</span>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">LIFETIME PASS</h3>
                <div className="py-2">
                  <span className="text-3xl font-black text-zinc-950 dark:text-white">₹2,500</span>
                  <span className="text-xs text-zinc-500 font-semibold"> / lifetime</span>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">Pay once, keep forever</p>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Complete permanent access with no recurring subscriptions ever.</p>
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2 text-xs">
                  {["All Pro Features Forever", "Zero Recurring Payments", "Future Feature Updates", "7-Day Money-Back Guarantee", "Priority Support"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 font-medium">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/signup?plan=pro_lifetime"
                  className="w-full inline-flex h-10 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md"
                >
                  Get Lifetime Pass (₹2,500)
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive FAQ Section */}
        <section id="faq" className="w-full max-w-3xl mt-28 space-y-8 text-left">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
              Got Questions?
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Everything you need to know about FinDisce plans, security, and digital service delivery.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex justify-between items-center outline-none cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                  >
                    <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-zinc-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-3 bg-zinc-50/30 dark:bg-zinc-900/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Pre-Footer Call-To-Action Banner */}
        <section className="w-full max-w-4xl mt-24 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 p-8 sm:p-12 text-white shadow-xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Take full control of your financial future today.
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
            Join thousands of smart personal investors building their net worth with clarity and security.
          </p>
          <div className="pt-2">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 px-8 text-xs font-bold transition-all shadow-md active:scale-[0.98]"
            >
              Get Started Free Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
