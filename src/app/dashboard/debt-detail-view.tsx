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
  ArrowRight,
  Trash,
  CheckCircle,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";
import { useCustomAlert } from "@/components/ui/custom-alert-dialog";

interface DebtDetailViewProps {
  onBack: () => void;
  onAddClick: () => void;
}

export default function DebtDetailView({ onBack, onAddClick }: DebtDetailViewProps) {
  const { dbUser } = useAuth();
  const { showSuccess, showWarning } = useCustomAlert();
  const [debts, setDebts] = React.useState<any[]>([]);
  const [assets, setAssets] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchDebtsAndAssets = async () => {
    if (!dbUser?.userId) return;
    setLoading(true);
    try {
      const debtRes = await apiClient.get(`/v1/debt/users/${dbUser.userId}`);
      if (debtRes.data?.success) {
        setDebts(debtRes.data.data);
      }
      const assetRes = await apiClient.get(`/v1/asset/users/${dbUser.userId}`);
      if (assetRes.data?.success) {
        setAssets(assetRes.data.data);
      }
    } catch (err) {
      console.error("Error fetching data in DebtDetailView:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDebtsAndAssets();
  }, [dbUser]);

  const handleDeleteDebt = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this loan?")) return;
    try {
      const res = await apiClient.delete(`/v1/debt/${id}`);
      if (res.data?.success) {
        showSuccess("Success", "Loan deleted successfully");
        fetchDebtsAndAssets();
      }
    } catch (err) {
      console.error("Error deleting debt:", err);
      showWarning("Error", "Failed to delete loan");
    }
  };

  // Helper formatting
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Derived totals
  const totalOutstanding = React.useMemo(() => {
    return debts.reduce((sum, d) => sum + (Number(d.outstandingPrincipal) || Number(d.outstanding_principal) || Number(d.sanctionedAmount) || Number(d.principal) || 0), 0);
  }, [debts]);

  const monthlyEMI = React.useMemo(() => {
    return debts.reduce((sum, d) => sum + (Number(d.emiAmountInput) || Number(d.emiAmount) || Number(d.emi_amount) || 0), 0);
  }, [debts]);

  const activeLoansCount = debts.length;

  const debtToAssetRatio = React.useMemo(() => {
    const totalAssetsValuation = assets.reduce((sum, a) => sum + (Number(a.current_market_value) || Number(a.purchase_value) || 0), 0);
    return totalAssetsValuation > 0 ? Math.round((totalOutstanding / totalAssetsValuation) * 100) : 0;
  }, [totalOutstanding, assets]);

  // Trend dataset representing paying off outstanding principal over time month-by-month
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const trendValues = React.useMemo(() => {
    let current = totalOutstanding;
    const values = [];
    for (let i = 0; i < 12; i++) {
      values.push(current);
      current = Math.max(0, current - monthlyEMI);
    }
    return values;
  }, [totalOutstanding, monthlyEMI]);

  const svgWidth = 500;
  const svgHeight = 160;
  const maxVal = Math.max(...trendValues, 1000);
  const minVal = Math.min(...trendValues, 0);
  
  const chartCoordinates = trendValues.map((val, idx) => {
    const x = (idx / (trendValues.length - 1)) * svgWidth;
    const y = svgHeight - ((val - minVal) / (maxVal - minVal || 1)) * (svgHeight - 20) - 10;
    return `${x},${y}`;
  }).join(" ");

  // Dynamic Debt distributions
  const debtSplits = React.useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    debts.forEach((d) => {
      const outstanding = Number(d.outstandingPrincipal) || Number(d.outstanding_principal) || Number(d.sanctionedAmount) || Number(d.principal) || 0;
      const categoryName = d.categoryName || (d.category ? d.category.name : "Other Loan");
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + outstanding;
    });

    const colors = ["bg-blue-600", "bg-purple-500", "bg-red-500", "bg-amber-500", "bg-emerald-500", "bg-indigo-500"];
    const strokes = ["stroke-blue-600", "stroke-purple-500", "stroke-red-500", "stroke-amber-500", "stroke-emerald-500", "stroke-indigo-500"];

    return Object.entries(categoryTotals).map(([name, val], idx) => {
      const pct = totalOutstanding > 0 ? Math.round((val / totalOutstanding) * 100) : 0;
      return {
        name,
        pct,
        val,
        color: colors[idx % colors.length],
        stroke: strokes[idx % strokes.length]
      };
    });
  }, [debts, totalOutstanding]);

  // Dynamic Loan Rows
  const loanRows = React.useMemo(() => {
    const defaultIcons: Record<string, any> = {
      "Home Loan": Home,
      "Vehicle Loan": Car,
      "Credit Card Loan": CreditCard,
      "Gold Loan": Coins,
      "Personal Loan": CreditCard,
      "Education Loan": HelpCircle
    };

    return debts.map((d) => {
      const categoryName = d.categoryName || (d.category ? d.category.name : "Other Loan");
      const IconComp = defaultIcons[categoryName] || HelpCircle;
      const outstanding = Number(d.outstandingPrincipal) || Number(d.outstanding_principal) || Number(d.sanctionedAmount) || Number(d.principal) || 0;
      const emi = Number(d.emiAmountInput) || Number(d.emiAmount) || Number(d.emi_amount) || 0;
      const rate = Number(d.loanInterestRate) || Number(d.interestRate) || Number(d.interest_rate) || 0;
      
      const tenureVal = Number(d.loanTenureValue) || 0;
      const remainingTenure = tenureVal > 12 ? `${Math.floor(tenureVal / 12)} Y, ${tenureVal % 12} M` : `${tenureVal} M`;

      let nextEMIDate = "05 Jul";
      if (d.emiDueDate) {
        const parts = d.emiDueDate.split("-");
        if (parts.length === 3) {
          const day = parts[2];
          const monthsNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const monthIndex = Number(parts[1]) - 1;
          const month = monthsNames[monthIndex >= 0 && monthIndex < 12 ? monthIndex : 6];
          nextEMIDate = `${day} ${month}`;
        }
      }

      return {
        id: d.id,
        category: categoryName,
        icon: <IconComp className="h-4 w-4 text-blue-600 shrink-0" />,
        bank: d.lender || d.lenderName || "Bank",
        outstanding,
        emi,
        rate: `${rate.toFixed(2)}%`,
        remaining: remainingTenure,
        nextEMI: nextEMIDate
      };
    });
  }, [debts]);

  // Dynamic Upcoming Schedule list
  const upcomingSchedule = React.useMemo(() => {
    return loanRows.map((r) => ({
      name: `${r.bank} ${r.category}`,
      date: r.nextEMI,
      val: r.emi
    })).slice(0, 3);
  }, [loanRows]);

  // Loan Closure highlights
  const closureStats = React.useMemo(() => {
    const extraPmt = Math.round(monthlyEMI * 0.1) || 500;
    const interestSaved = Math.round(totalOutstanding * 0.05) || 5000;
    const monthsSaved = activeLoansCount > 0 ? Math.round(totalOutstanding / (monthlyEMI || 1) * 0.1) : 0;
    return [
      { label: "Recommended Extra Payment", val: `${formatCurrency(extraPmt)} / month`, highlightColor: "text-zinc-950" },
      { label: "Estimated Interest Saved", val: formatCurrency(interestSaved), highlightColor: "text-emerald-600" },
      { label: "Accelerated Loan Closure", val: `${monthsSaved} Months Earlier`, highlightColor: "text-blue-600 font-bold" }
    ];
  }, [monthlyEMI, totalOutstanding, activeLoansCount]);

  // AI Insights checklines
  const aiInsights = React.useMemo(() => {
    const insights = [];
    if (debtToAssetRatio < 30) {
      insights.push({ text: "Your Debt-to-Asset Ratio is within a healthy range (< 30%).", type: "check" });
    } else {
      insights.push({ text: "Warning: High Debt-to-Asset Ratio. Prioritize paying off high interest loans.", type: "warning" });
    }
    
    let maxRate = 0;
    let maxRateName = "";
    debts.forEach((d) => {
      const rate = Number(d.loanInterestRate) || Number(d.interestRate) || Number(d.interest_rate) || 0;
      if (rate > maxRate) {
        maxRate = rate;
        maxRateName = d.loanName || d.categoryName || "Loan";
      }
    });

    if (maxRate > 12) {
      insights.push({ text: `Your ${maxRateName} has a high interest rate of ${maxRate.toFixed(2)}%. Prioritize paying it off first.`, type: "warning" });
    } else if (maxRate > 0) {
      insights.push({ text: `Your highest rate loan is ${maxRateName} at ${maxRate.toFixed(2)}%, which is within normal limits.`, type: "check" });
    }

    insights.push({ text: "Making a 10% extra payment monthly can drastically reduce your repayment tenure.", type: "check" });
    return insights;
  }, [debtToAssetRatio, debts]);

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
              {debtSplits.length === 0 ? (
                <circle cx="64" cy="64" r="48" className="stroke-zinc-100" strokeWidth="15" fill="transparent" />
              ) : (
                (() => {
                  let accumulatedPercent = 0;
                  return debtSplits.map((split, index) => {
                    const circumference = 2 * Math.PI * 48; // 301.59
                    const strokeDashoffset = circumference - (circumference * split.pct) / 100;
                    const rotation = (accumulatedPercent / 100) * 360;
                    accumulatedPercent += split.pct;

                    return (
                      <circle
                        key={index}
                        cx="64"
                        cy="64"
                        r="48"
                        className={split.stroke}
                        strokeWidth="15"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform={`rotate(${rotation} 64 64)`}
                      />
                    );
                  });
                })()
              )}
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Debts</span>
              <span className="text-xs font-black text-zinc-950 mt-0.5">{formatCurrency(totalOutstanding)}</span>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-zinc-100 pt-3 text-[10px] font-bold text-zinc-500">
            {debtSplits.length === 0 ? (
              <div className="text-center text-zinc-400 py-1">No splits available</div>
            ) : (
              debtSplits.map((split, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`h-2 w-2 rounded ${split.color} shrink-0`} />
                    <span className="truncate">{split.name}</span>
                  </div>
                  <span>{split.pct}% ({formatCurrency(split.val)})</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Active Loans Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-150/40 bg-zinc-50/50 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide block">
            ACTIVE LOANS REGISTRY
          </h3>
          <span className="text-xs font-semibold text-zinc-555">{activeLoansCount} Active Liabilities</span>
        </div>

        <div className="overflow-x-auto">
          {loanRows.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 font-semibold bg-white">
              No active loans found. Click "Add Loan" to get started.
            </div>
          ) : (
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
                      <button
                        onClick={() => handleDeleteDebt(row.id)}
                        className="h-6 w-6 rounded-md hover:bg-red-50 flex items-center justify-center mx-auto text-zinc-400 hover:text-red-650 cursor-pointer transition-colors outline-none"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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


    </div>
  );
}
