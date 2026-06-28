"use client";

import * as React from "react";
import {
  ChevronLeft,
  Target,
  Sparkles,
  Plus,
  ChevronRight,
  TrendingUp,
  Compass,
  GraduationCap,
  Building2,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoalsDetailViewProps {
  onBack: () => void;
  onAddClick: () => void;
  onUpgradeClick?: () => void;
}

export default function GoalsDetailView({ onBack, onAddClick, onUpgradeClick }: GoalsDetailViewProps) {
  // Simulator states
  const [targetRetireAge, setTargetRetireAge] = React.useState(60);
  const [monthlySavings, setMonthlySavings] = React.useState(25000); // monthly additions in INR

  // KPI constants
  const targetCorpus = 25000000; // ₹2.5 Cr
  const currentSavings = 7000000; // ₹70L
  const currentAge = 30;

  // Formatting utilities
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // SVG dimensions
  const svgWidth = 500;
  const svgHeight = 160;

  // Generate projection values (from Age 30 to Age 60) based on sliders
  const yearsToRetire = Math.max(5, targetRetireAge - currentAge);
  const yearsArray = Array.from({ length: 6 }, (_, i) => currentAge + Math.round((yearsToRetire * i) / 5));
  
  // Compounding math: F = P*(1+r)^t + PMT * (((1+r)^t - 1)/r)
  const rate = 0.08; // 8% average return
  const projectionValues = yearsArray.map((age) => {
    const t = age - currentAge;
    const compoundPrincipal = currentSavings * Math.pow(1 + rate, t);
    const compoundAnnuity = t > 0 
      ? (monthlySavings * 12) * ((Math.pow(1 + rate, t) - 1) / rate)
      : 0;
    return (compoundPrincipal + compoundAnnuity) / 100000; // in Lakhs
  });

  const maxProjectionVal = Math.max(...projectionValues) * 1.1;
  const minProjectionVal = currentSavings / 100000 * 0.8;

  const chartCoordinates = projectionValues.map((val, idx) => {
    const x = (idx / (projectionValues.length - 1)) * svgWidth;
    const y = svgHeight - ((val - minProjectionVal) / (maxProjectionVal - minProjectionVal)) * (svgHeight - 20) - 10;
    return `${x},${y}`;
  }).join(" ");

  // Asset allocations aligned to goals
  const goalSplits = [
    { name: "Retirement Fund", pct: 60, val: 15000000, color: "bg-blue-600", stroke: "stroke-blue-600" },
    { name: "Kids Education", pct: 20, val: 5000000, color: "bg-emerald-500", stroke: "stroke-emerald-500" },
    { name: "House Downpayment", pct: 12, val: 3000000, color: "bg-amber-500", stroke: "stroke-amber-500" },
    { name: "Luxury Travel", pct: 8, val: 2000000, color: "bg-purple-500", stroke: "stroke-purple-500" }
  ];

  // Goal holdings rows
  const goalRows = [
    {
      name: "Retirement Fund",
      icon: <Target className="h-4 w-4 text-blue-600 shrink-0" />,
      target: 25000000,
      current: 7000000,
      match: "92%",
      progress: 28
    },
    {
      name: "Kids Education",
      icon: <GraduationCap className="h-4 w-4 text-emerald-600 shrink-0" />,
      target: 5000000,
      current: 1500000,
      match: "80%",
      progress: 30
    },
    {
      name: "House Downpayment",
      icon: <Building2 className="h-4 w-4 text-amber-500 shrink-0" />,
      target: 4000000,
      current: 1600000,
      match: "88%",
      progress: 40
    },
    {
      name: "Luxury Travel",
      icon: <Compass className="h-4 w-4 text-purple-600 shrink-0" />,
      target: 1000000,
      current: 400000,
      match: "75%",
      progress: 40
    }
  ];

  // AI Insights checklines
  const aiInsights = [
    { text: "Retirement target matching 92% confidence score.", type: "check" },
    { text: "Recommend increasing equity allocation in Mid-cap funds for Kids Education.", type: "warning" },
    { text: "Emergency fund covers 8 months of goal SIP contributions.", type: "check" },
    { text: "House downpayment goal is 40% complete—on track for 2029 purchase.", type: "check" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
        <button onClick={onBack} className="hover:text-zinc-650 flex items-center outline-none cursor-pointer">
          <ChevronLeft className="h-4 w-4 mr-0.5" /> Wealth
        </button>
        <span>/</span>
        <span className="text-zinc-700">Goals Planner</span>
      </div>

      {/* Pro Upgrade Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/20">
            <Sparkles className="h-5 w-5 text-yellow-300 fill-yellow-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Unlock Advanced Goals Analytics</h4>
            <p className="text-xs text-indigo-100 mt-0.5 leading-relaxed max-w-2xl">
              You are currently viewing a basic sandbox preview. Upgrade to **Pro** to unlock multi-goal inflation matching, custom portfolio allocation models, and auto-pay reminders.
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

      {/* Main Goals Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">Goals Planner</span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-2xl font-black text-zinc-950">₹2.5 Crore Corpus Target</h2>
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded-lg border border-zinc-100">
              Current progress: {Math.round((currentSavings / targetCorpus) * 100)}% complete
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
            Add Goal
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Retirement Target</span>
          <h3 className="text-lg font-black text-zinc-950">{formatCurrency(targetCorpus)}</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Target corpus at age {targetRetireAge}</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Current Progress</span>
          <h3 className="text-lg font-black text-emerald-600">{formatCurrency(currentSavings)}</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Savings aligned to goals ({Math.round((currentSavings / targetCorpus) * 100)}%)</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Target Age</span>
          <h3 className="text-lg font-black text-blue-600">{targetRetireAge} Years</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Retirement age milestone</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Current Age</span>
          <h3 className="text-lg font-black text-zinc-950">{currentAge} Years</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Compounding starting base age</p>
        </div>
      </div>

      {/* Simulator Sliders */}
      <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide">
          REAL-TIME CORPUS GOALS SIMULATOR
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-zinc-700">
              <span>Target Retirement Age:</span>
              <span className="text-blue-600 font-bold">{targetRetireAge} Years</span>
            </div>
            <input
              type="range"
              min="40"
              max="70"
              value={targetRetireAge}
              onChange={(e) => setTargetRetireAge(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[9px] font-bold text-zinc-400">
              <span>40 Yrs</span>
              <span>55 Yrs</span>
              <span>70 Yrs</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-zinc-700">
              <span>Monthly Savings Additions:</span>
              <span className="text-blue-600 font-bold">{formatCurrency(monthlySavings)} / mo</span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="5000"
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[9px] font-bold text-zinc-400">
              <span>₹5k/mo</span>
              <span>₹50k/mo</span>
              <span>₹1L/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Graph Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Corpus Projection line chart */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block mb-1">
              Corpus Projection Path
            </span>
            <p className="text-[11px] text-zinc-500 font-medium">Growth trend of compounding assets towards retirement target age</p>
          </div>

          <div className="my-6 h-40 w-full relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1={svgHeight - 1} x2={svgWidth} y2={svgHeight - 1} stroke="#f4f4f5" strokeWidth="1.5" />
              <line x1="0" y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="#f4f4f5" strokeWidth="1.5" strokeDasharray="3,3" />
              
              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                points={chartCoordinates}
              />
              
              {/* Fill Area */}
              <polygon
                fill="url(#corpusGrad)"
                points={`0,${svgHeight} ${chartCoordinates} ${svgWidth},${svgHeight}`}
              />

              {/* Data points */}
              {projectionValues.map((val, idx) => {
                const x = (idx / (projectionValues.length - 1)) * svgWidth;
                const y = svgHeight - ((val - minProjectionVal) / (maxProjectionVal - minProjectionVal)) * (svgHeight - 20) - 10;
                return (
                  <g key={idx} className="group/dot cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill={idx === projectionValues.length - 1 ? "#3b82f6" : "white"}
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="transparent"
                      className="hover:fill-blue-500/10"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-[9px] text-zinc-400 font-bold uppercase border-t border-zinc-100 pt-3">
            {yearsArray.map((age, idx) => (
              <span key={idx}>Age {age}</span>
            ))}
          </div>
        </div>

        {/* Goal splits donut chart */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block mb-1">
              Goal Weight Allocations
            </span>
            <p className="text-[11px] text-zinc-500 font-medium">Asset weights aligned to target goals</p>
          </div>

          <div className="flex justify-center items-center py-4 relative my-3">
            <svg className="w-32 h-32 transform -rotate-90">
              {/* Retirement Fund 60% */}
              <circle cx="64" cy="64" r="48" className="stroke-blue-600" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset="0" />
              {/* Kids Education 20% */}
              <circle cx="64" cy="64" r="48" className="stroke-emerald-500" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * 40) / 100} />
              {/* House Downpayment 12% */}
              <circle cx="64" cy="64" r="48" className="stroke-amber-500" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * 20) / 100} />
              {/* Luxury Travel 8% */}
              <circle cx="64" cy="64" r="48" className="stroke-purple-500" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * 8) / 100} />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Goals</span>
              <span className="text-xs font-black text-zinc-950 mt-0.5">₹2.5Cr</span>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-zinc-100 pt-3 text-[10px] font-bold text-zinc-500">
            {goalSplits.map((split, idx) => (
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

      {/* Goal Holdings Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-150/40 bg-zinc-50/50 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide block">
            GOALS PLANNED REGISTRY
          </h3>
          <span className="text-xs font-semibold text-zinc-550">{goalRows.length} Active Targets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50/20">
                <th className="p-4 pl-5">Goal Target</th>
                <th className="p-4">Target Amount</th>
                <th className="p-4">Current Balance</th>
                <th className="p-4">SIP Goal Alignment</th>
                <th className="p-4">Completion Progress</th>
                <th className="p-4 text-center pr-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 font-medium">
              {goalRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="p-4 pl-5 flex items-center gap-2.5 text-zinc-800 font-bold">
                    {row.icon}
                    <span>{row.name}</span>
                  </td>
                  <td className="p-4 text-zinc-900 font-bold">{formatCurrency(row.target)}</td>
                  <td className="p-4 text-zinc-900 font-bold">{formatCurrency(row.current)}</td>
                  <td className="p-4 text-blue-600 font-bold">{row.match} Match</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-zinc-100 rounded-full overflow-hidden shrink-0">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                      <span className="font-bold text-zinc-900">{row.progress}%</span>
                    </div>
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

      {/* AI Insights & warnings */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
        <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
          <Sparkles className="h-4.5 w-4.5 text-indigo-600" /> AI Goals & SIP Planner Insights
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
