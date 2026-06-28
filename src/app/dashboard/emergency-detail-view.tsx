"use client";

import * as React from "react";
import {
  ChevronLeft,
  ShieldCheck,
  Plus,
  ChevronRight,
  Sparkles,
  HeartPulse,
  Award,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Coins,
  History,
  Info,
  CheckSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmergencyDetailViewProps {
  onBack: () => void;
  onAddClick: () => void;
  onUpgradeClick?: () => void;
}

export default function EmergencyDetailView({ onBack, onAddClick, onUpgradeClick }: EmergencyDetailViewProps) {
  // Value constants
  const emergencyReserve = 650000; // ₹6,50,000
  const lifeCover = 20000000; // ₹2.0 Cr
  const healthCover = 1000000; // ₹10,00,000
  const coverageMonths = 8;
  const yearlyPremiumTotal = 36500; // ₹36,500

  // Formatting utilities
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Premium breakdown splits
  const premiumSplits = [
    { name: "Term Life Insurance", pct: 49, val: 18000, color: "bg-blue-600", stroke: "stroke-blue-600" },
    { name: "Family Health Insurance", pct: 34, val: 12500, color: "bg-emerald-500", stroke: "stroke-emerald-500" },
    { name: "Critical Illness Cover", pct: 17, val: 6000, color: "bg-amber-500", stroke: "stroke-amber-500" }
  ];

  // Active policy list rows
  const policyRows = [
    {
      type: "Term Life Insurance",
      icon: <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />,
      insurer: "HDFC Life",
      coverage: 20000000,
      premium: 18000,
      nominee: "Spouse (Wife)",
      status: "Active"
    },
    {
      type: "Family Health Insurance",
      icon: <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />,
      insurer: "Niva Bupa",
      coverage: 1000000,
      premium: 12500,
      nominee: "Spouse & Kid",
      status: "Active"
    },
    {
      type: "Critical Illness Cover",
      icon: <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />,
      insurer: "ICICI Lombard",
      coverage: 1500000,
      premium: 6000,
      nominee: "Mother",
      status: "Active"
    }
  ];

  // Will & Nominees updates checklist
  const NomineeChecklist = [
    { label: "Nominees updated for Bank Account (SBI)", isChecked: true },
    { label: "Nominees updated for Mutual Funds accounts", isChecked: true },
    { label: "Nominees updated for Stocks portfolio", isChecked: true },
    { label: "Legal Will drafting completed", isChecked: true }
  ];

  // AI insights checklines
  const aiInsights = [
    { text: "Safety fund covers 8 months of base expenses.", type: "check" },
    { text: "Term life coverage is optimal based on outstanding liabilities.", type: "check" },
    { text: "Will and Nominee configuration complete—guarantees assets security.", type: "check" },
    { text: "Recommendation: Consider adding personal accident rider.", type: "warning" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
        <button onClick={onBack} className="hover:text-zinc-650 flex items-center outline-none cursor-pointer">
          <ChevronLeft className="h-4 w-4 mr-0.5" /> Wealth
        </button>
        <span>/</span>
        <span className="text-zinc-700">Emergency Funds & Policies</span>
      </div>

      {/* Pro Upgrade Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/20">
            <Sparkles className="h-5 w-5 text-yellow-300 fill-yellow-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Unlock Insurance & Policy Alerts</h4>
            <p className="text-xs text-indigo-100 mt-0.5 leading-relaxed max-w-2xl">
              You are currently viewing a basic sandbox preview. Upgrade to **Pro** to unlock automatic premium renewal calendars, digital nomination tracking alerts, and legal Will drafting templates.
            </p>
          </div>
        </div>
        <button
          onClick={onUpgradeClick}
          className="h-9 px-4 shrink-0 rounded-xl bg-white text-blue-600 hover:bg-zinc-50 text-xs font-bold transition-all shadow-sm cursor-pointer outline-none"
        >
          Upgrade to Pro
        </button>
      </div>

      {/* Main Emergency Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">EMERGENCY & POLICIES</span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-2xl font-black text-zinc-950">{formatCurrency(emergencyReserve)}</h2>
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded-lg border border-zinc-100">
              Coverage: {coverageMonths} Months base expenses | Will & Nominees 100% configured
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onBack}
            className="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors shadow-sm outline-none cursor-pointer"
          >
            Back to Wealth
          </Button>
          <Button
            onClick={onAddClick}
            className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-xs font-bold transition-all active:scale-[0.98] outline-none cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Policy
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Emergency Reserves</span>
          <h3 className="text-lg font-black text-zinc-950">{formatCurrency(emergencyReserve)}</h3>
          <p className="text-[10px] text-emerald-605 font-bold mt-1">{coverageMonths} Months Base Buffer</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Life Cover (Term)</span>
          <h3 className="text-lg font-black text-blue-600">{formatCurrency(lifeCover)}</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Aggregated payout index</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Health Insurance</span>
          <h3 className="text-lg font-black text-emerald-600">{formatCurrency(healthCover)}</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Cashless family protection cap</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Nominee & Will</span>
          <h3 className="text-lg font-black text-indigo-600">100% Configured</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Succession planner alignment</p>
        </div>
      </div>

      {/* Analytics Graph Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Safety buffer Dial Gauge Meter */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block mb-1">
              Safety Reserve Coverage Gauge
            </span>
            <p className="text-[11px] text-zinc-500 font-medium">Reserve status compared to ideal 6-month base expenses</p>
          </div>

          <div className="my-6 flex justify-center items-center relative">
            <svg className="w-48 h-28 overflow-hidden">
              {/* Dial Arc background (grey) */}
              <path
                d="M 20 100 A 70 70 0 0 1 172 100"
                fill="transparent"
                stroke="#f4f4f5"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Dial progress arc (emerald) */}
              <path
                d="M 20 100 A 70 70 0 0 1 172 100"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray="238.7"
                strokeDashoffset="0" // 100% completion indicator
              />
            </svg>
            <div className="absolute top-[65px] flex flex-col items-center">
              <span className="text-xs font-black text-zinc-950">₹6,50,000 Saved</span>
              <span className="text-[10px] font-bold text-emerald-600 mt-0.5">216% of 6-Month Buffer</span>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-3 text-[10.5px] text-zinc-500 font-semibold flex justify-between items-center">
            <span>Minimum Buffer: ₹3,00,000</span>
            <span className="text-emerald-600 font-bold">Optimal Safety Index reached</span>
          </div>
        </div>

        {/* Premium splits donut chart */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block mb-1">
              Annual Premium Split
            </span>
            <p className="text-[11px] text-zinc-500 font-medium">Premium distributions by policy type</p>
          </div>

          <div className="flex justify-center items-center py-4 relative my-3">
            <svg className="w-32 h-32 transform -rotate-90">
              {/* Term Life 49% */}
              <circle cx="64" cy="64" r="48" className="stroke-blue-600" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset="0" />
              {/* Health Insurance 34% */}
              <circle cx="64" cy="64" r="48" className="stroke-emerald-500" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * 51) / 100} />
              {/* Critical Illness 17% */}
              <circle cx="64" cy="64" r="48" className="stroke-amber-500" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * 17) / 100} />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Premium</span>
              <span className="text-xs font-black text-zinc-950 mt-0.5">₹36.5K</span>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-zinc-100 pt-3 text-[10px] font-bold text-zinc-500">
            {premiumSplits.map((split, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`h-2 w-2 rounded ${split.color} shrink-0`} />
                  <span className="truncate">{split.name}</span>
                </div>
                <span>{split.pct}% ({formatCurrency(split.val)})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Active Policies Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-150/40 bg-zinc-50/50 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide block">
            ACTIVE PROTECTION POLICIES REGISTRY
          </h3>
          <span className="text-xs font-semibold text-zinc-550">{policyRows.length} Active Policies</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50/20">
                <th className="p-4 pl-5">Policy Type</th>
                <th className="p-4">Insurer</th>
                <th className="p-4">Coverage Limit</th>
                <th className="p-4">Yearly Premium</th>
                <th className="p-4">Nominee Details</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center pr-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 font-medium">
              {policyRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="p-4 pl-5 flex items-center gap-2.5 text-zinc-800 font-bold">
                    {row.icon}
                    <span>{row.type}</span>
                  </td>
                  <td className="p-4 text-zinc-650 font-semibold">{row.insurer}</td>
                  <td className="p-4 text-zinc-900 font-bold">{formatCurrency(row.coverage)}</td>
                  <td className="p-4 text-zinc-700 font-bold">{formatCurrency(row.premium)}</td>
                  <td className="p-4 text-zinc-900 font-bold">{row.nominee}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 text-[10px] font-black text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100/30">
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-center pr-5">
                    <button className="h-6 w-6 rounded-md hover:bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400 hover:text-zinc-700 cursor-pointer transition-colors outline-none">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nominees & legal Will check list */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
        <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
          <CheckSquare className="h-4.5 w-4.5 text-zinc-400" /> Succession Nominees & Legal Will Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {NomineeChecklist.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-zinc-100 bg-zinc-50/20 flex items-center gap-2.5 text-xs font-semibold text-zinc-750">
              <span className="h-4 w-4 bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center rounded-full text-[9px] select-none font-black">
                ✓
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Emergency Safety insights */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
        <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
          <Sparkles className="h-4.5 w-4.5 text-indigo-650" /> AI Safety & Protection Insights
        </h3>

        <div className="space-y-3">
          {aiInsights.map((insight, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-bold ${
                insight.type === "warning"
                  ? "border-amber-250 bg-amber-50/10 text-amber-900"
                  : "border-zinc-200/60 bg-zinc-50/20 text-zinc-700"
              }`}
            >
              <span
                className={`h-4.5 w-4.5 flex items-center justify-center rounded-full text-[10px] select-none shrink-0 ${
                  insight.type === "warning"
                    ? "bg-amber-100 border border-amber-200 text-amber-700 font-black"
                    : "bg-emerald-100 border border-emerald-200 text-emerald-700"
                }`}
              >
                {insight.type === "warning" ? "!" : "✓"}
              </span>
              <span>{insight.text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
