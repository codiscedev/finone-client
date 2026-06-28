"use client";

import * as React from "react";
import { Check, X, Star, CreditCard, ChevronDown, ChevronUp, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingView() {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("yearly");
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "Can I use Finance-One for free?",
      a: "Yes. The Free plan includes all the essentials for tracking your personal finances, such as income, expenses, assets, liabilities, and goals."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. All our paid plans are contract-free. You can upgrade, downgrade, or cancel your subscription at any time directly from your account settings."
    },
    {
      q: "Is my financial data secure?",
      a: "Absolutely. Security is our top priority. We use bank-grade 256-bit SSL encryption for data in transit and AES-256 encryption at rest. We never sell or share your financial data with third parties."
    },
    {
      q: "Can I share my account with my spouse or family?",
      a: "Yes! The Family plan is designed specifically for couples and families, supporting up to 6 members with collaborative shared wealth dashboards, shared goals, trip budget splits, and group notifications."
    }
  ];

  const featuresList = [
    { name: "Expense Tracking", free: "✅", pro: "✅", family: "✅" },
    { name: "Income Tracking", free: "✅", pro: "✅", family: "✅" },
    { name: "Assets", free: "✅", pro: "✅", family: "✅" },
    { name: "Debts", free: "✅", pro: "✅", family: "✅" },
    { name: "Net Worth", free: "✅", pro: "✅", family: "✅" },
    { name: "Goals", free: "✅", pro: "✅", family: "✅" },
    { name: "Investments", free: "❌", pro: "✅", family: "✅" },
    { name: "Insurance", free: "❌", pro: "✅", family: "✅" },
    { name: "Subscription Tracking", free: "❌", pro: "✅", family: "✅" },
    { name: "AI Assistant", free: "❌", pro: "✅", family: "✅" },
    { name: "Smart Insights", free: "❌", pro: "✅", family: "✅" },
    { name: "Loan Planner", free: "❌", pro: "✅", family: "✅" },
    { name: "Notifications", free: "Basic", pro: "Smart", family: "Smart" },
    { name: "Collaboration", free: "❌", pro: "1 Partner", family: "Up to 6 Members" },
    { name: "Shared Goals", free: "❌", pro: "❌", family: "✅" },
    { name: "Shared Wealth", free: "❌", pro: "❌", family: "✅" },
    { name: "Priority Support", free: "❌", pro: "✅", family: "✅" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4">
      
      {/* Title Header */}
      <div className="text-center space-y-4 pt-4">
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block bg-blue-50/50 px-3 py-1 rounded-full w-fit mx-auto border border-blue-100/30">
          Transparent Plans
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950">
          Simple, Transparent Pricing
        </h2>
        <p className="text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed">
          Start free. Upgrade when you need advanced insights, collaboration, and AI-powered financial planning.
        </p>

        {/* Billing cycle Switch Toggle */}
        <div className="flex justify-center pt-2">
          <div className="bg-zinc-100 p-1 rounded-xl flex items-center border border-zinc-200/50">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all outline-none cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all outline-none cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Yearly <span className="bg-blue-500 text-[9px] font-black text-white px-1.5 py-0.5 rounded uppercase">Save 20%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        
        {/* FREE PLAN */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow relative">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block">Starter</span>
              <h3 className="text-xl font-black text-zinc-900 mt-1">FREE</h3>
            </div>
            
            <div className="py-2">
              <span className="text-3xl font-extrabold text-zinc-950">₹0</span>
              <span className="text-zinc-400 text-xs font-semibold"> / month</span>
            </div>

            <p className="text-[11px] text-zinc-500 leading-normal">
              Get started with core personal finance tracking and essential balance ledgers.
            </p>

            <div className="border-t border-zinc-100 pt-4 space-y-2.5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Features Included</span>
              <div className="space-y-2">
                {["Dashboard", "Expense Tracking", "Income Tracking", "Budget Management", "Assets", "Debts", "Net Worth", "Goals", "Basic Reports"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                    <span className="h-4 w-4 bg-zinc-100 text-zinc-650 flex items-center justify-center rounded-full text-[9px] shrink-0">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button className="w-full h-10 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold cursor-pointer outline-none shadow-sm active:scale-[0.98]">
              Get Started
            </Button>
          </div>
        </div>

        {/* PRO PLAN - MOST POPULAR */}
        <div className="bg-white border-2 border-blue-600 rounded-3xl p-6 shadow-[0_4px_20px_rgba(59,130,246,0.12)] flex flex-col justify-between hover:shadow-lg transition-shadow relative">
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Star className="h-3 w-3 fill-current text-white" /> Most Popular
          </span>

          <div className="space-y-4">
            <div className="mt-2">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-wide block">Premium Single</span>
              <h3 className="text-xl font-black text-zinc-900 mt-1">PRO</h3>
            </div>
            
            <div className="py-2">
              <span className="text-3xl font-extrabold text-zinc-950">
                {billingCycle === "monthly" ? "₹299" : "₹250"}
              </span>
              <span className="text-zinc-450 text-xs font-semibold"> / month</span>
              {billingCycle === "yearly" && (
                <p className="text-[10px] text-emerald-600 font-bold mt-1">₹2,999 / year (Save ₹589)</p>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 leading-normal">
              Unlock AI assistance, portfolio CAGR calculators, automated trackers, and custom loan/premium planners.
            </p>

            <div className="border-t border-zinc-100 pt-4 space-y-2.5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Everything in Free, plus:</span>
              <div className="space-y-2">
                {[
                  "Unlimited Accounts & Assets",
                  "Investment Portfolio Tracker",
                  "Insurance & Policy Vault",
                  "Loan Closure Planner",
                  "Financial Health Score Analysis",
                  "AI Financial Mentor chat",
                  "EMI & Premium Reminders",
                  "Priority Email Support"
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                    <span className="h-4 w-4 bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center rounded-full text-[9px] shrink-0 font-bold">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer outline-none shadow-md active:scale-[0.98]">
              Upgrade to Pro
            </Button>
          </div>
        </div>

        {/* FAMILY PLAN */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow relative">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block">Co-Managed Workspace</span>
              <h3 className="text-xl font-black text-zinc-900 mt-1">FAMILY</h3>
            </div>
            
            <div className="py-2">
              <span className="text-3xl font-extrabold text-zinc-950">
                {billingCycle === "monthly" ? "₹499" : "₹417"}
              </span>
              <span className="text-zinc-450 text-xs font-semibold"> / month</span>
              {billingCycle === "yearly" && (
                <p className="text-[10px] text-emerald-600 font-bold mt-1">₹4,999 / year (Save ₹989)</p>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 leading-normal">
              Designed for couples and families to collaborate on wealth tracking, shared loans, travel trips, and investments.
            </p>

            <div className="border-t border-zinc-100 pt-4 space-y-2.5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Everything in Pro, plus:</span>
              <div className="space-y-2">
                {[
                  "Up to 6 Member Accounts",
                  "Shared Joint Wealth Dashboard",
                  "Shared Goals & Milestones",
                  "Trip & House planning splits",
                  "Shared Loan Management",
                  "AI Family Financial Advisor",
                  "Shared Notifications & Alerts"
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                    <span className="h-4 w-4 bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center rounded-full text-[9px] shrink-0 font-bold">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button className="w-full h-10 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold cursor-pointer outline-none shadow-sm active:scale-[0.98]">
              Start Family Plan
            </Button>
          </div>
        </div>

      </div>

      {/* Feature Comparison Matrix */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
        <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide block border-b border-zinc-100 pb-3">
          Detailed Feature Comparison matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50/20">
                <th className="p-4 pl-5">Feature</th>
                <th className="p-4 text-center">Free</th>
                <th className="p-4 text-center">Pro</th>
                <th className="p-4 text-center">Family</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 font-medium text-zinc-700">
              {featuresList.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="p-4 pl-5 font-bold text-zinc-800">{row.name}</td>
                  <td className="p-4 text-center text-zinc-650">{row.free}</td>
                  <td className="p-4 text-center text-zinc-950 font-bold">{row.pro}</td>
                  <td className="p-4 text-center text-zinc-950 font-bold">{row.family}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive FAQ Panels */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-black text-zinc-950 uppercase tracking-wide">Frequently Asked Questions</h3>
          <p className="text-[11px] text-zinc-500 font-semibold">Everything you need to know about Finance-One plans</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex justify-between items-center outline-none cursor-pointer hover:bg-zinc-50/40"
                >
                  <span className="text-xs font-black text-zinc-900">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-zinc-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-zinc-550 leading-relaxed border-t border-zinc-50 pt-3 bg-zinc-50/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
