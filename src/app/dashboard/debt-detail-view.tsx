"use client";

import * as React from "react";
import {
  ChevronLeft,
  TrendingDown,
  Building2,
  TrendingUp,
  Coins,
  History,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  Plus,
  ChevronRight,
  Sparkles,
  Home,
  Car,
  CreditCard,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DebtDetailViewProps {
  onBack: () => void;
  onAddClick: () => void;
}

export default function DebtDetailView({ onBack, onAddClick }: DebtDetailViewProps) {
  // Value states
  const totalOutstanding = 1260000; // ₹12,60,000
  const monthlyEMI = 18500; // ₹18,500
  const activeLoansCount = 3;
  const debtToAssetRatio = 19; // 19%

  // Formatting utilities
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Trend dataset (Jan - Dec values in Lakhs, representing paying off outstanding principal over time)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const trendValues = [15.0, 14.8, 14.5, 14.2, 14.0, 13.8, 13.5, 13.2, 13.0, 12.8, 12.7, 12.6]; // in Lakhs

  const svgWidth = 500;
  const svgHeight = 160;
  const maxVal = 16.0;
  const minVal = 10.0;
  
  const chartCoordinates = trendValues.map((val, idx) => {
    const x = (idx / (trendValues.length - 1)) * svgWidth;
    const y = svgHeight - ((val - minVal) / (maxVal - minVal)) * (svgHeight - 20) - 10;
    return `${x},${y}`;
  }).join(" ");

  // Debt distributions
  const debtSplits = [
    { name: "Home Loan", pct: 67, val: 850000, color: "bg-blue-600", stroke: "stroke-blue-600" },
    { name: "Car Loan", pct: 20, val: 250000, color: "bg-purple-500", stroke: "stroke-purple-500" },
    { name: "Personal Loan", pct: 13, val: 160000, color: "bg-red-500", stroke: "stroke-red-500" }
  ];

  // Active Loan Rows
  const loanRows = [
    {
      category: "Home Loan",
      icon: <Home className="h-4 w-4 text-blue-600 shrink-0" />,
      bank: "SBI",
      outstanding: 850000,
      emi: 12000,
      rate: "8.40%",
      remaining: "18 Years",
      nextEMI: "05 Jul"
    },
    {
      category: "Car Loan",
      icon: <Car className="h-4 w-4 text-purple-600 shrink-0" />,
      bank: "HDFC",
      outstanding: 250000,
      emi: 4500,
      rate: "9.20%",
      remaining: "3 Years",
      nextEMI: "10 Jul"
    },
    {
      category: "Personal Loan",
      icon: <CreditCard className="h-4 w-4 text-red-550 shrink-0" />,
      bank: "ICICI",
      outstanding: 160000,
      emi: 2000,
      rate: "13.50%",
      remaining: "1 Year",
      nextEMI: "15 Jul"
    }
  ];

  // Upcoming Schedule list
  const upcomingSchedule = [
    { name: "SBI Home Loan", date: "05 Jul", val: 12000 },
    { name: "HDFC Car Loan", date: "10 Jul", val: 4500 },
    { name: "ICICI Personal Loan", date: "15 Jul", val: 2000 }
  ];

  // Loan Closure highlights
  const closureStats = [
    { label: "Extra Payment", val: "₹5,000 / month", highlightColor: "text-zinc-950" },
    { label: "Interest Saved", val: "₹2,80,000", highlightColor: "text-emerald-600" },
    { label: "Loan Closed", val: "3 Years Earlier", highlightColor: "text-blue-600 font-bold" }
  ];

  // AI Insights checklines
  const aiInsights = [
    { text: "Debt-to-Asset Ratio is within a healthy range.", type: "check" },
    { text: "Home loan interest rate is competitive.", type: "check" },
    { text: "Personal loan has the highest interest rate—consider paying it off first.", type: "warning" },
    { text: "Paying ₹5,000 extra monthly could save approximately ₹2.8L in interest.", type: "check" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
        <button onClick={onBack} className="hover:text-zinc-650 flex items-center outline-none cursor-pointer">
          <ChevronLeft className="h-4 w-4 mr-0.5" /> Wealth
        </button>
        <span>/</span>
        <span className="text-zinc-700">Debt Management</span>
      </div>

      {/* Main Debt Management Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">DEBT MANAGEMENT</span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-2xl font-black text-zinc-950">{formatCurrency(totalOutstanding)}</h2>
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded-lg border border-zinc-100">
              Monthly EMI: {formatCurrency(monthlyEMI)} | {activeLoansCount} Active Loans
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
            Add Loan
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Total Debt</span>
          <h3 className="text-xl font-black text-red-600">{formatCurrency(totalOutstanding)}</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Sum of all outstanding principals</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Monthly EMI</span>
          <h3 className="text-xl font-black text-zinc-950">{formatCurrency(monthlyEMI)}</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Aggregated monthly installments</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Debt-to-Asset Ratio</span>
          <h3 className="text-xl font-black text-emerald-600">{debtToAssetRatio}%</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Healthy (Below 30% baseline)</p>
        </div>
      </div>

      {/* Analytics Graph Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Debt Trend line chart */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block mb-1">
              Debt Repayment Trend
            </span>
            <p className="text-[11px] text-zinc-500 font-medium">Principal amortization curve from Jan to Dec</p>
          </div>

          <div className="my-6 h-40 w-full relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1={svgHeight - 1} x2={svgWidth} y2={svgHeight - 1} stroke="#f4f4f5" strokeWidth="1.5" />
              <line x1="0" y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="#f4f4f5" strokeWidth="1.5" strokeDasharray="3,3" />
              
              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                points={chartCoordinates}
              />
              
              {/* Fill Area */}
              <polygon
                fill="url(#debtGrad)"
                points={`0,${svgHeight} ${chartCoordinates} ${svgWidth},${svgHeight}`}
              />

              {/* Data points */}
              {trendValues.map((val, idx) => {
                const x = (idx / (trendValues.length - 1)) * svgWidth;
                const y = svgHeight - ((val - minVal) / (maxVal - minVal)) * (svgHeight - 20) - 10;
                return (
                  <g key={idx} className="group/dot cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill={idx === trendValues.length - 1 ? "#ef4444" : "white"}
                      stroke="#ef4444"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="transparent"
                      className="hover:fill-red-500/10"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-[9px] text-zinc-400 font-bold uppercase border-t border-zinc-100 pt-3">
            {months.map((m, idx) => (
              <span key={idx}>{m}</span>
            ))}
          </div>
        </div>

        {/* Debt splits donut chart */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block mb-1">
              Debt Distribution Split
            </span>
            <p className="text-[11px] text-zinc-500 font-medium">Liability allocations by weight</p>
          </div>

          <div className="flex justify-center items-center py-4 relative my-3">
            <svg className="w-32 h-32 transform -rotate-90">
              {/* Home Loan 67% */}
              <circle cx="64" cy="64" r="48" className="stroke-blue-600" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset="0" />
              {/* Car Loan 20% */}
              <circle cx="64" cy="64" r="48" className="stroke-purple-500" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * 33) / 100} />
              {/* Personal Loan 13% */}
              <circle cx="64" cy="64" r="48" className="stroke-red-500" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * 13) / 100} />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Debts</span>
              <span className="text-xs font-black text-zinc-950 mt-0.5">₹12.6L</span>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-zinc-100 pt-3 text-[10px] font-bold text-zinc-500">
            {debtSplits.map((split, idx) => (
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

      {/* Active Loans Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-150/40 bg-zinc-50/50 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide block">
            ACTIVE LOANS REGISTRY
          </h3>
          <span className="text-xs font-semibold text-zinc-550">{activeLoansCount} Active Liabilities</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50/20">
                <th className="p-4 pl-5">Loan Type</th>
                <th className="p-4">Bank</th>
                <th className="p-4">Outstanding</th>
                <th className="p-4">EMI</th>
                <th className="p-4">Interest</th>
                <th className="p-4">Remaining</th>
                <th className="p-4">Next EMI</th>
                <th className="p-4 text-center pr-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 font-medium">
              {loanRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="p-4 pl-5 flex items-center gap-2.5 text-zinc-800 font-bold">
                    {row.icon}
                    <span>{row.category}</span>
                  </td>
                  <td className="p-4 text-zinc-600 font-semibold">{row.bank}</td>
                  <td className="p-4 text-zinc-900 font-bold">{formatCurrency(row.outstanding)}</td>
                  <td className="p-4 text-zinc-700 font-bold">{formatCurrency(row.emi)}</td>
                  <td className="p-4 text-zinc-900 font-bold">{row.rate}</td>
                  <td className="p-4 text-zinc-650">{row.remaining}</td>
                  <td className="p-4 text-zinc-500 font-bold">{row.nextEMI}</td>
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

      {/* Upcoming EMIs & Loan Closure Planner Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming EMI Calendar list */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
          <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
            <Clock className="h-4.5 w-4.5 text-zinc-400" /> Upcoming EMI Schedule
          </h3>

          <div className="space-y-3">
            {upcomingSchedule.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 bg-zinc-50/20 text-xs">
                <div className="flex items-center gap-2 font-bold text-zinc-800">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-zinc-950 block">{formatCurrency(item.val)}</span>
                  <span className="text-[10px] text-zinc-400 font-semibold">{item.date} due</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loan Closure Payoff Planner */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
          <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
            <Sparkles className="h-4.5 w-4.5 text-indigo-650" /> Loan Closure Prepay Planner
          </h3>

          <div className="space-y-3">
            {closureStats.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 bg-zinc-50/20 text-xs">
                <span className="text-zinc-500 font-semibold">{item.label}</span>
                <span className={`font-black ${item.highlightColor}`}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Debt Insights warnings panel */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
        <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
          <Sparkles className="h-4.5 w-4.5 text-indigo-600" /> AI Financial Debt Insights
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

      {/* Bottom add loan action trigger */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onAddClick}
          className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md text-xs font-bold transition-all active:scale-[0.98] outline-none cursor-pointer flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Loan
        </Button>
      </div>

    </div>
  );
}
