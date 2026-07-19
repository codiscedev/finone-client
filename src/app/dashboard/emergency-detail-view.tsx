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
  CheckSquare,
  Activity,
  Car,
  Home,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";
import { useCustomAlert } from "@/components/ui/custom-alert-dialog";

interface EmergencyDetailViewProps {
  onBack: () => void;
  onAddClick: () => void;
  onUpgradeClick?: () => void;
}

export default function EmergencyDetailView({ onBack, onAddClick, onUpgradeClick }: EmergencyDetailViewProps) {
  const { dbUser } = useAuth();
  const { showSuccess, showWarning, showDelete } = useCustomAlert();
  const [essentials, setEssentials] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchEssentials = async () => {
    if (!dbUser?.userId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/v1/essential/users/${dbUser.userId}`);
      if (res.data?.success) {
        setEssentials(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching essentials:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (dbUser) {
      fetchEssentials();
    }
  }, [dbUser]);

  const handleDeleteEssential = (id: string) => {
    showDelete(
      "Delete Essential / Policy",
      "Are you sure you want to delete this essential tracking record? This action cannot be undone.",
      async () => {
        try {
          await apiClient.delete(`/v1/essential/${id}`);
          showSuccess("Success", "Essential record deleted successfully!");
          fetchEssentials();
        } catch (err) {
          console.error("Error deleting essential:", err);
          showWarning("Error", "Failed to delete essential record.");
        }
      }
    );
  };

  // Helper to identify insurance categories
  const isInsuranceCategory = (categoryName: string) => {
    if (!categoryName) return false;
    const name = categoryName.toLowerCase();
    return name.includes("insurance") || name.includes("cover") || name.includes("policy") || name.includes("life") || name.includes("accident");
  };

  const hasData = essentials.length > 0;

  // Safety reserves
  const emergencyReserve = React.useMemo(() => {
    if (!hasData) return 650000; // ₹6,50,000 mock
    return essentials
      .filter((e) => !isInsuranceCategory(e.category?.name || e.categoryName))
      .reduce((sum, e) => sum + (Number(e.sumAssured) || 0), 0);
  }, [essentials, hasData]);

  // Life cover sum
  const lifeCover = React.useMemo(() => {
    if (!hasData) return 20000000; // ₹2.0 Cr mock
    return essentials
      .filter((e) => {
        const name = (e.category?.name || e.categoryName || "").toLowerCase();
        return name.includes("life") || name.includes("term");
      })
      .reduce((sum, e) => sum + (Number(e.sumAssured) || 0), 0);
  }, [essentials, hasData]);

  // Health cover sum
  const healthCover = React.useMemo(() => {
    if (!hasData) return 1000000; // ₹10,00,000 mock
    return essentials
      .filter((e) => {
        const name = (e.category?.name || e.categoryName || "").toLowerCase();
        return name.includes("health") || name.includes("medical");
      })
      .reduce((sum, e) => sum + (Number(e.sumAssured) || 0), 0);
  }, [essentials, hasData]);

  // Yearly premium
  const yearlyPremiumTotal = React.useMemo(() => {
    if (!hasData) return 36500; // ₹36,500 mock
    return essentials.reduce((sum, e) => {
      const prem = Number(e.premium) || 0;
      const freq = (e.frequency || "YEARLY").toUpperCase();
      let multiplier = 1;
      if (freq === "MONTHLY") multiplier = 12;
      else if (freq === "QUARTERLY") multiplier = 4;
      else if (freq === "HALF_YEARLY") multiplier = 2;
      else if (freq === "ONCE") multiplier = 0;
      return sum + prem * multiplier;
    }, 0);
  }, [essentials, hasData]);

  // Coverage months
  const coverageMonths = React.useMemo(() => {
    const monthlyExpense = 50000; // standard default monthly expense
    return Math.round((emergencyReserve / monthlyExpense) * 10) / 10;
  }, [emergencyReserve]);

  // Formatting utilities
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Premium breakdown splits
  const premiumSplits = React.useMemo(() => {
    if (!hasData) {
      return [
        { name: "Term Life Insurance", pct: 49, val: 18000, color: "bg-blue-600", stroke: "stroke-blue-600" },
        { name: "Family Health Insurance", pct: 34, val: 12500, color: "bg-emerald-500", stroke: "stroke-emerald-500" },
        { name: "Critical Illness Cover", pct: 17, val: 6000, color: "bg-amber-500", stroke: "stroke-amber-500" }
      ];
    }

    const categoriesMap: Record<string, number> = {};
    let totalPremium = 0;
    essentials.forEach((e) => {
      const prem = Number(e.premium) || 0;
      const freq = (e.frequency || "YEARLY").toUpperCase();
      let multiplier = 1;
      if (freq === "MONTHLY") multiplier = 12;
      else if (freq === "QUARTERLY") multiplier = 4;
      else if (freq === "HALF_YEARLY") multiplier = 2;
      else if (freq === "ONCE") multiplier = 0;
      const annual = prem * multiplier;
      if (annual > 0) {
        const name = e.category?.name || e.categoryName || "Other Policy";
        categoriesMap[name] = (categoriesMap[name] || 0) + annual;
        totalPremium += annual;
      }
    });

    if (totalPremium === 0) {
      return [{ name: "No Active Premiums", pct: 100, val: 0, color: "bg-zinc-400", stroke: "stroke-zinc-400" }];
    }

    const colors = ["bg-blue-600", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-rose-500", "bg-cyan-500"];
    const strokes = ["stroke-blue-600", "stroke-emerald-500", "stroke-amber-500", "stroke-purple-500", "stroke-rose-500", "stroke-cyan-500"];
    
    return Object.entries(categoriesMap).map(([name, val], idx) => {
      const pct = Math.round((val / totalPremium) * 100);
      return {
        name,
        pct,
        val,
        color: colors[idx % colors.length],
        stroke: strokes[idx % strokes.length]
      };
    });
  }, [essentials, hasData]);

  // Active policy list rows
  const policyRows = React.useMemo(() => {
    if (!hasData) {
      return [
        {
          id: "mock-1",
          type: "Term Life Insurance",
          icon: <ShieldCheck className="h-4.5 w-4.5 text-blue-600 shrink-0" />,
          insurer: "HDFC Life",
          coverage: 20000000,
          premium: 18000,
          nominee: "Spouse (Wife)",
          status: "Active"
        },
        {
          id: "mock-2",
          type: "Family Health Insurance",
          icon: <HeartPulse className="h-4.5 w-4.5 text-emerald-600 shrink-0" />,
          insurer: "Niva Bupa",
          coverage: 1000000,
          premium: 12500,
          nominee: "Spouse & Kid",
          status: "Active"
        },
        {
          id: "mock-3",
          type: "Critical Illness Cover",
          icon: <Activity className="h-4.5 w-4.5 text-amber-500 shrink-0" />,
          insurer: "ICICI Lombard",
          coverage: 1500000,
          premium: 6000,
          nominee: "Mother",
          status: "Active"
        }
      ];
    }

    const defaultIconMeta: Record<string, { icon: any; color: string }> = {
      HEALTH_INSURANCE: { icon: HeartPulse, color: "text-emerald-600" },
      LIFE_INSURANCE: { icon: ShieldCheck, color: "text-blue-600" },
      VEHICLE_INSURANCE: { icon: Car, color: "text-amber-500" },
      HOME_PROTECTION: { icon: Home, color: "text-purple-600" },
      TERM_INSURANCE: { icon: ShieldCheck, color: "text-teal-600" },
      PERSONAL_ACCIDENT_COVER: { icon: ShieldAlert, color: "text-red-500" }
    };

    return essentials.map((e) => {
      const catName = e.category?.name || e.categoryName || "";
      const catCode = (e.category?.code || e.categoryCode || "").toUpperCase().replace(/\s+/g, "_");
      
      const sum = Number(e.sumAssured) || 0;
      const prem = Number(e.premium) || 0;
      const isPolicy = isInsuranceCategory(catName) || prem > 0;
      
      const iconMeta = defaultIconMeta[catCode] || { icon: ShieldCheck, color: "text-blue-600" };
      const IconComp = iconMeta.icon;

      return {
        id: e.id,
        type: catName,
        insurer: e.insurer || (isPolicy ? "Self" : "N/A"),
        coverage: sum,
        premium: prem,
        nominee: isPolicy ? "Family Nominees Assigned" : "N/A",
        status: e.isActive !== false ? "Active" : "Inactive",
        icon: <IconComp className={`h-4.5 w-4.5 ${iconMeta.color} shrink-0`} />
      };
    });
  }, [essentials, hasData]);

  // Will & Nominees updates checklist
  const NomineeChecklist = [
    { label: "Nominees updated for Bank Account (SBI)", isChecked: true },
    { label: "Nominees updated for Mutual Funds accounts", isChecked: true },
    { label: "Nominees updated for Stocks portfolio", isChecked: true },
    { label: "Legal Will drafting completed", isChecked: true }
  ];

  // AI insights checklines
  const aiInsights = [
    { text: "Safety fund covers optimal monthly base expenses.", type: "check" },
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
        <span className="text-zinc-700">Essentials</span>
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
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">ESSENTIALS</span>
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
                strokeDashoffset={238.7 - (238.7 * Math.min(100, emergencyReserve > 0 ? Math.round((emergencyReserve / 300000) * 100) : 0)) / 100}
              />
            </svg>
            <div className="absolute top-[65px] flex flex-col items-center">
              <span className="text-xs font-black text-zinc-950">{formatCurrency(emergencyReserve)} Saved</span>
              <span className="text-[10px] font-bold text-emerald-600 mt-0.5">
                {emergencyReserve > 0 ? Math.round((emergencyReserve / 300000) * 100) : 0}% of 6-Month Buffer
              </span>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-3 text-[10.5px] text-zinc-500 font-semibold flex justify-between items-center">
            <span>Minimum Buffer: ₹3,00,000</span>
            {emergencyReserve >= 300000 ? (
              <span className="text-emerald-600 font-bold">Optimal Safety Index reached</span>
            ) : (
              <span className="text-amber-600 font-bold">Accumulating Safety Capital...</span>
            )}
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
              {premiumSplits.map((split, idx) => {
                const r = 48;
                const circumference = 2 * Math.PI * r;
                const cumulativePct = premiumSplits.slice(0, idx).reduce((sum, item) => sum + item.pct, 0);
                const rotation = (cumulativePct / 100) * 360 - 90;
                return (
                  <circle
                    key={idx}
                    cx="64"
                    cy="64"
                    r={r}
                    className={split.stroke}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * Math.max(1, split.pct)) / 100}
                    transform={`rotate(${rotation} 64 64)`}
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                  />
                );
              })}
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Premium</span>
              <span className="text-xs font-black text-zinc-950 mt-0.5">
                {yearlyPremiumTotal >= 100000 ? `₹${(yearlyPremiumTotal/100000).toFixed(1)}L` : `₹${(yearlyPremiumTotal/1000).toFixed(1)}K`}
              </span>
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
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded-lg border ${
                      row.status === "Active" ? "text-emerald-700 bg-emerald-50 border-emerald-100/30" : "text-zinc-500 bg-zinc-55/10 border-zinc-100/30"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-center pr-5">
                    {!row.id.toString().startsWith("mock-") ? (
                      <button
                        onClick={() => handleDeleteEssential(row.id)}
                        className="h-6 w-6 rounded-md hover:bg-red-50 flex items-center justify-center mx-auto text-zinc-400 hover:text-red-600 cursor-pointer transition-colors outline-none"
                        title="Delete Essential / Policy"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-400 italic">Sandbox</span>
                    )}
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
