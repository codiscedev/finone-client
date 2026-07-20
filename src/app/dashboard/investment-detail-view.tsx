"use client";

import * as React from "react";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
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
  Briefcase,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  DollarSign,
  Percent,
  LineChart,
  BarChart2,
  Trash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomAlert } from "@/components/ui/custom-alert-dialog";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";

interface InvestmentDetailViewProps {
  onBack: () => void;
  onAddClick: () => void;
  onUpgradeClick?: () => void;
}

export default function InvestmentDetailView({ onBack, onAddClick, onUpgradeClick }: InvestmentDetailViewProps) {
  const { dbUser } = useAuth();
  const { showSuccess, showWarning, showDelete } = useCustomAlert();
  
  const [investments, setInvestments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchInvestments = async () => {
    if (!dbUser?.userId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/v1/investment/users/${dbUser.userId}`);
      if (res.data?.success) {
        setInvestments(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching investments:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInvestments();
  }, [dbUser]);

  const handleDeleteInvestment = (id: string) => {
    showDelete(
      "Delete Investment",
      "Are you sure you want to delete this investment record? This action cannot be undone.",
      async () => {
        try {
          await apiClient.delete(`/v1/investment/${id}`);
          showSuccess("Success", "Investment record deleted successfully!");
          fetchInvestments();
        } catch (err) {
          console.error("Error deleting investment:", err);
          showWarning("Error", "Failed to delete investment record.");
        }
      }
    );
  };

  // Calculations derived from API data
  const invested = React.useMemo(() => {
    return investments.reduce((sum, item) => sum + (Number(item.investedAmount) || 0), 0);
  }, [investments]);

  const currentValue = React.useMemo(() => {
    return investments.reduce((sum, item) => sum + (Number(item.currentValue) || Number(item.investedAmount) || 0), 0);
  }, [investments]);

  const profit = React.useMemo(() => {
    return currentValue - invested;
  }, [currentValue, invested]);

  const profitPercent = React.useMemo(() => {
    return invested > 0 ? Number(((profit / invested) * 100).toFixed(1)) : 0;
  }, [profit, invested]);

  // Formatting utilities
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const getInvestmentIconAndColor = (type: string) => {
    switch (type) {
      case "MUTUAL_FUND":
        return { icon: <BarChart2 className="h-4 w-4 text-blue-600 shrink-0" />, color: "bg-blue-600", stroke: "stroke-blue-600" };
      case "STOCK":
        return { icon: <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />, color: "bg-emerald-500", stroke: "stroke-emerald-500" };
      case "CRYPTO":
        return { icon: <Coins className="h-4 w-4 text-rose-500 shrink-0" />, color: "bg-rose-500", stroke: "stroke-rose-500" };
      case "EPF":
      case "PPF":
      case "NPS":
        return { icon: <Home className="h-4 w-4 text-amber-500 shrink-0" />, color: "bg-amber-500", stroke: "stroke-amber-500" };
      default:
        return { icon: <Briefcase className="h-4 w-4 text-purple-500 shrink-0" />, color: "bg-purple-500", stroke: "stroke-purple-500" };
    }
  };

  // Trend dataset (Jan - Dec values in Lakhs, representing compounding portfolio value)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const trendValues = React.useMemo(() => {
    const valInLakhs = (currentValue || 0) / 100000;
    const investedInLakhs = (invested || 0) / 100000;
    
    const trend: number[] = [];
    for (let i = 0; i < 12; i++) {
      const factor = i / 11;
      const val = investedInLakhs + (valInLakhs - investedInLakhs) * factor;
      trend.push(Number(val.toFixed(2)));
    }
    return trend;
  }, [invested, currentValue]);

  const svgWidth = 500;
  const svgHeight = 160;
  const maxVal = React.useMemo(() => {
    const max = Math.max(...trendValues);
    return max > 0 ? max * 1.1 : 10;
  }, [trendValues]);

  const minVal = React.useMemo(() => {
    const min = Math.min(...trendValues);
    return min > 0 ? min * 0.9 : 0;
  }, [trendValues]);
  
  const chartCoordinates = React.useMemo(() => {
    return trendValues.map((val, idx) => {
      const x = (idx / (trendValues.length - 1)) * svgWidth;
      const y = svgHeight - ((val - minVal) / (maxVal - minVal || 1)) * (svgHeight - 20) - 10;
      return `${x},${y}`;
    }).join(" ");
  }, [trendValues, minVal, maxVal]);

  // Asset allocations grouped by type
  const allocationSplits = React.useMemo(() => {
    const groups: { [key: string]: number } = {};
    investments.forEach((item) => {
      const type = item.type || "OTHER";
      groups[type] = (groups[type] || 0) + (Number(item.currentValue) || Number(item.investedAmount) || 0);
    });

    const totalVal = Object.values(groups).reduce((sum, val) => sum + val, 0);

    const formattedTypes: { [key: string]: string } = {
      MUTUAL_FUND: "Mutual Funds",
      STOCK: "Stocks",
      EPF: "EPF",
      PPF: "PPF",
      NPS: "NPS",
      CRYPTO: "Crypto",
      FD: "FD",
      RD: "RD",
      GOLD_ETF: "Gold ETF",
      OTHER: "Other"
    };

    return Object.keys(groups).map((type) => {
      const val = groups[type];
      const pct = totalVal > 0 ? Math.round((val / totalVal) * 100) : 0;
      const { color, stroke } = getInvestmentIconAndColor(type);
      return {
        name: formattedTypes[type] || type,
        pct,
        val,
        color,
        stroke
      };
    }).sort((a, b) => b.val - a.val);
  }, [investments]);

  // Dynamic Valuation Label for center of donut
  const valuationLabel = React.useMemo(() => {
    if (currentValue >= 10000000) {
      return `₹${(currentValue / 10000000).toFixed(2)}Cr`;
    }
    if (currentValue >= 100000) {
      return `₹${(currentValue / 100000).toFixed(1)}L`;
    }
    return formatCurrency(currentValue);
  }, [currentValue]);

  // Portfolio holdings rows
  const holdingRows = React.useMemo(() => {
    const formattedTypes: { [key: string]: string } = {
      MUTUAL_FUND: "Mutual Fund",
      STOCK: "Stock",
      EPF: "EPF",
      PPF: "PPF",
      NPS: "NPS",
      CRYPTO: "Crypto",
      FD: "FD",
      RD: "RD",
      GOLD_ETF: "Gold ETF",
      OTHER: "Other"
    };

    return investments.map((item) => {
      const { icon } = getInvestmentIconAndColor(item.type);
      const investedAmt = Number(item.investedAmount) || 0;
      const currentVal = Number(item.currentValue) || Number(item.investedAmount) || 0;
      const gain = currentVal - investedAmt;
      const returnsPct = investedAmt > 0 ? (gain / investedAmt) * 100 : 0;
      const returnsStr = `${returnsPct >= 0 ? "+" : ""}${returnsPct.toFixed(1)}%`;

      return {
        id: item.id,
        name: item.name,
        type: formattedTypes[item.type] || item.type,
        icon,
        invested: investedAmt,
        current: currentVal,
        returns: returnsStr,
        returnsPct,
        xirr: item.expectedReturnPct != null ? `${Number(item.expectedReturnPct)}%` : "-"
      };
    });
  }, [investments]);

  // Estimated Passive Income streams
  const passiveStreams = React.useMemo(() => {
    const dividendInvestments = investments.filter(item => item.type === "MUTUAL_FUND" || item.type === "STOCK");
    const dividendVal = dividendInvestments.reduce((sum, item) => {
      const val = Number(item.currentValue) || Number(item.investedAmount) || 0;
      const rate = Number(item.expectedReturnPct) || 0;
      return sum + (val * rate) / 100 / 12;
    }, 0);

    const interestInvestments = investments.filter(item => ["PPF", "EPF", "NPS", "FD", "RD"].includes(item.type));
    const interestVal = interestInvestments.reduce((sum, item) => {
      const val = Number(item.currentValue) || Number(item.investedAmount) || 0;
      const rate = Number(item.expectedReturnPct) || 0;
      return sum + (val * rate) / 100 / 12;
    }, 0);

    return [
      { label: "Dividends (Est.)", val: Math.round(dividendVal) },
      { label: "Interest (Est.)", val: Math.round(interestVal) }
    ];
  }, [investments]);

  const monthlyPassiveIncome = React.useMemo(() => {
    return passiveStreams.reduce((sum, item) => sum + item.val, 0);
  }, [passiveStreams]);

  // Upcoming SIP items
  const upcomingSIPs = React.useMemo(() => {
    const sips = investments.filter(item => item.isSip);
    return sips.map(item => {
      let dateStr = "Monthly";
      if (item.startDate) {
        try {
          const d = new Date(item.startDate);
          dateStr = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
        } catch (e) {
          // ignore
        }
      }
      return {
        name: item.name,
        val: Number(item.sipAmount) || 0,
        date: dateStr
      };
    });
  }, [investments]);

  const monthlySipTotal = React.useMemo(() => {
    return upcomingSIPs.reduce((sum, item) => sum + item.val, 0);
  }, [upcomingSIPs]);

  // AI Insights checks
  const aiInsights = React.useMemo(() => {
    const list = [];
    
    list.push({
      text: `Portfolio generated ${profitPercent >= 0 ? "+" : ""}${profitPercent}% overall returns.`,
      isCheck: true
    });

    const mfSplit = allocationSplits.find(s => s.name === "Mutual Funds");
    if (mfSplit && mfSplit.pct > 0) {
      list.push({
        text: `Mutual Funds contribute ${mfSplit.pct}% of your portfolio.`,
        isCheck: true
      });
    }

    const stockSplit = allocationSplits.find(s => s.name === "Stocks");
    if (stockSplit && stockSplit.pct > 0) {
      list.push({
        text: `Stocks contribute ${stockSplit.pct}% of your portfolio.`,
        isCheck: true
      });
    }

    if (monthlyPassiveIncome > 0) {
      list.push({
        text: `Estimated monthly return averages ${formatCurrency(monthlyPassiveIncome)}/month.`,
        isCheck: true
      });
    }

    list.push({
      text: "Consider increasing international diversification.",
      isCheck: true
    });

    return list;
  }, [profitPercent, allocationSplits, monthlyPassiveIncome]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
        <button onClick={onBack} className="hover:text-zinc-650 flex items-center outline-none cursor-pointer">
          <ChevronLeft className="h-4 w-4 mr-0.5" /> Wealth
        </button>
        <span>/</span>
        <span className="text-zinc-700">Investments</span>
      </div>

      {/* Pro Upgrade Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/20">
            <Sparkles className="h-5 w-5 text-yellow-300 fill-yellow-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Unlock Investment Analytics</h4>
            <p className="text-xs text-indigo-100 mt-0.5 leading-relaxed max-w-2xl">
              You are currently viewing a basic sandbox preview. Upgrade to Pro to unlock real-time mutual fund tracking, custom CAGR calculators, and direct XIRR projection simulation indices.
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

      {/* Main Investments Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">INVESTMENTS</span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-2xl font-black text-zinc-950">{formatCurrency(currentValue)}</h2>
            <span className={`text-xs font-black flex items-center gap-0.5 px-2 py-0.5 rounded-lg border ${profit >= 0 ? "text-emerald-600 bg-emerald-55 border-emerald-100/30" : "text-rose-600 bg-rose-55 border-rose-100/30"}`}>
              {profit >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {profit >= 0 ? "+" : ""}{formatCurrency(profit)} ({profit >= 0 ? "+" : ""}{profitPercent}%)
            </span>
            <span className="text-xs text-zinc-450 font-bold">Invested: {formatCurrency(invested)}</span>
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
            className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-xs font-bold transition-all active:scale-[0.98] outline-none cursor-pointer flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Investment
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Invested Amount</span>
          <h3 className="text-lg font-black text-zinc-950">{formatCurrency(invested)}</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Total principal capital base</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Current Value</span>
          <h3 className="text-lg font-black text-zinc-950">{formatCurrency(currentValue)}</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Valuation at active market rate</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Overall Returns</span>
          <h3 className={`text-lg font-black ${profitPercent >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {profitPercent >= 0 ? "+" : ""}{profitPercent}%
          </h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Absolute portfolio profit margin</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Monthly Income</span>
          <h3 className="text-lg font-black text-zinc-950">{formatCurrency(monthlyPassiveIncome)}</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Dividends & monthly payouts</p>
        </div>
      </div>

      {/* Analytics Graph Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Growth line chart */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block mb-1">
              Portfolio Growth
            </span>
            <p className="text-[11px] text-zinc-500 font-medium">Growth trend of compounding assets from Jan to Dec</p>
          </div>

          <div className="my-6 h-40 w-full relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1={svgHeight - 1} x2={svgWidth} y2={svgHeight - 1} stroke="#f4f4f5" strokeWidth="1.5" />
              <line x1="0" y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="#f4f4f5" strokeWidth="1.5" strokeDasharray="3,3" />
              
              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points={chartCoordinates}
              />
              
              {/* Fill Area */}
              <polygon
                fill="url(#growthGrad)"
                points={`0,${svgHeight} ${chartCoordinates} ${svgWidth},${svgHeight}`}
              />

              {/* Data points */}
              {trendValues.map((val, idx) => {
                const x = (idx / (trendValues.length - 1)) * svgWidth;
                const y = svgHeight - ((val - minVal) / (maxVal - minVal || 1)) * (svgHeight - 20) - 10;
                return (
                  <g key={idx} className="group/dot cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill={idx === trendValues.length - 1 ? "#10b981" : "white"}
                      stroke="#10b981"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="transparent"
                      className="hover:fill-emerald-500/10"
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

        {/* Allocations donut chart */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block mb-1">
              Asset Allocation Split
            </span>
            <p className="text-[11px] text-zinc-500 font-medium">Portfolio distributions by weight</p>
          </div>

          <div className="flex justify-center items-center py-4 relative my-3">
            <svg className="w-32 h-32 transform -rotate-90">
              {allocationSplits.length === 0 ? (
                <circle cx="64" cy="64" r="48" className="stroke-zinc-200" strokeWidth="15" fill="transparent" />
              ) : (
                (() => {
                  let cumulativePct = 0;
                  return allocationSplits.map((split, idx) => {
                    const pct = split.pct;
                    const currentCumulative = cumulativePct;
                    cumulativePct += pct;
                    const strokeDashoffset = -((currentCumulative / 100) * 301.6);
                    const strokeDasharray = `${(pct / 100) * 301.6} 301.6`;
                    return (
                      <circle
                        key={idx}
                        cx="64"
                        cy="64"
                        r="48"
                        className={split.stroke}
                        strokeWidth="15"
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                      />
                    );
                  });
                })()
              )}
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Valuation</span>
              <span className="text-xs font-black text-zinc-950 mt-0.5">{valuationLabel}</span>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-zinc-100 pt-3 text-[10px] font-bold text-zinc-500">
            {allocationSplits.map((split, idx) => (
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

      {/* INVESTMENT PORTFOLIO Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-150/40 bg-zinc-50/50 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide block">
            INVESTMENT PORTFOLIO HOLDINGS
          </h3>
          <span className="text-xs font-semibold text-zinc-550">{holdingRows.length} Active Holdings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50/20">
                <th className="p-4 pl-5">Investment</th>
                <th className="p-4">Type</th>
                <th className="p-4">Invested</th>
                <th className="p-4">Current</th>
                <th className="p-4">Returns</th>
                <th className="p-4">Expected Return</th>
                <th className="p-4 text-center pr-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 font-medium">
              {holdingRows.length > 0 ? (
                holdingRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="p-4 pl-5 flex items-center gap-2.5 text-zinc-800 font-bold">
                      {row.icon}
                      <span>{row.name}</span>
                    </td>
                    <td className="p-4 text-zinc-600 font-semibold">{row.type}</td>
                    <td className="p-4 text-zinc-900 font-bold">{formatCurrency(row.invested)}</td>
                    <td className="p-4 text-zinc-900 font-bold">{formatCurrency(row.current)}</td>
                    <td className={`p-4 font-bold ${row.returnsPct >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {row.returns}
                    </td>
                    <td className="p-4 text-zinc-650">{row.xirr}</td>
                    <td className="p-4 text-center pr-5">
                      <button
                        onClick={() => handleDeleteInvestment(row.id)}
                        className="h-6 w-6 rounded-md hover:bg-red-50 flex items-center justify-center mx-auto text-zinc-455 hover:text-red-600 cursor-pointer transition-colors outline-none"
                        title="Delete Investment"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-450 font-bold italic">
                    No active investments found. Click "+ Add Investment" above to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Passive Income & Upcoming SIP schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Passive Income breakdown */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
          <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
            <Coins className="h-4.5 w-4.5 text-zinc-400" /> Passive Income Stream Audit
          </h3>

          <div className="space-y-2.5">
            {passiveStreams.length > 0 && passiveStreams.some(s => s.val > 0) ? (
              passiveStreams.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-semibold py-1.5">
                  <span className="text-zinc-550">{item.label}</span>
                  <span className="font-bold text-zinc-950">{formatCurrency(item.val)}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-zinc-450 font-bold italic py-4">
                No passive income generated from current assets.
              </div>
            )}
            <div className="flex justify-between items-center text-xs font-black pt-3 border-t border-zinc-100">
              <span className="text-zinc-900 uppercase">Total Monthly</span>
              <span className="text-emerald-600 text-sm">{formatCurrency(monthlyPassiveIncome)}</span>
            </div>
          </div>
        </div>

        {/* Upcoming SIPs schedules */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
          <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
            <Clock className="h-4.5 w-4.5 text-zinc-400" /> Upcoming SIP Calendars
          </h3>

          <div className="space-y-3">
            {upcomingSIPs.length > 0 ? (
              upcomingSIPs.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 bg-zinc-50/20 text-xs">
                  <div className="flex items-center gap-2 font-bold text-zinc-800">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-zinc-950 block">{formatCurrency(item.val)}</span>
                    <span className="text-[10px] text-zinc-450 font-semibold">{item.date} auto-debit</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-zinc-450 font-bold italic py-6">
                No upcoming SIPs scheduled.
              </div>
            )}
            
            <div className="flex justify-between items-center text-xs font-black pt-1">
              <span className="text-zinc-900 uppercase">Monthly SIP Total</span>
              <span className="text-zinc-950 font-black">{formatCurrency(monthlySipTotal)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* AI Investment Insights checks */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
        <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
          <Sparkles className="h-4.5 w-4.5 text-indigo-650" /> AI Financial Portfolio Insights
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-zinc-200/60 bg-zinc-50/20 flex items-center gap-2.5 text-xs font-bold text-zinc-700">
              <span className="h-4.5 w-4.5 bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center rounded-full text-[10px] select-none shrink-0">
                ✓
              </span>
              <span>{insight.text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
