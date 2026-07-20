"use client";

import * as React from "react";
import {
  HeartPulse,
  Coins,
  ShieldAlert,
  TrendingUp,
  Percent,
  Briefcase,
  Target,
  ShieldCheck,
  Sparkles,
  Plus,
  ArrowUpRight,
  ChevronRight,
  AlertCircle,
  Clock,
  ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";
import FinancialHealthView from "./financial-health-view";
import AssetDetailView from "./asset-detail-view";
import AssetsOverviewView from "./assets-overview-view";
import NetWorthDetailView from "./net-worth-detail-view";
import DebtDetailView from "./debt-detail-view";
import InvestmentDetailView from "./investment-detail-view";
import GoalsDetailView from "./goals-detail-view";
import EmergencyDetailView from "./emergency-detail-view";

interface WealthViewProps {
  onAddClick: () => void;
  onUpgradeClick?: () => void;
}

export default function WealthView({ onAddClick, onUpgradeClick }: WealthViewProps) {
  const { dbUser } = useAuth();
  const [assets, setAssets] = React.useState<any[]>([]);
  const [loadingAssets, setLoadingAssets] = React.useState(false);
  const [debts, setDebts] = React.useState<any[]>([]);
  const [loadingDebts, setLoadingDebts] = React.useState(false);
  const [goals, setGoals] = React.useState<any[]>([]);
  const [essentials, setEssentials] = React.useState<any[]>([]);

  const fetchAssets = async () => {
    if (!dbUser?.userId) return;
    setLoadingAssets(true);
    try {
      const res = await apiClient.get(`/v1/asset/users/${dbUser.userId}`);
      if (res.data?.success) {
        setAssets(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching assets in dashboard:", err);
    } finally {
      setLoadingAssets(false);
    }
  };

  const fetchDebts = async () => {
    if (!dbUser?.userId) return;
    setLoadingDebts(true);
    try {
      const res = await apiClient.get(`/v1/debt/users/${dbUser.userId}`);
      if (res.data?.success) {
        setDebts(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching debts in dashboard:", err);
    } finally {
      setLoadingDebts(false);
    }
  };

  const fetchGoals = async () => {
    if (!dbUser?.userId) return;
    try {
      const res = await apiClient.get(`/v1/goal/users/${dbUser.userId}`);
      if (res.data?.success) {
        setGoals(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching goals in dashboard:", err);
    }
  };

  const fetchEssentials = async () => {
    if (!dbUser?.userId) return;
    try {
      const res = await apiClient.get(`/v1/essential/users/${dbUser.userId}`);
      if (res.data?.success) {
        setEssentials(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching essentials in dashboard:", err);
    }
  };

  const [investments, setInvestments] = React.useState<any[]>([]);

  const fetchInvestments = async () => {
    if (!dbUser?.userId) return;
    try {
      const res = await apiClient.get(`/v1/investment/users/${dbUser.userId}`);
      if (res.data?.success) {
        setInvestments(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching investments in dashboard:", err);
    }
  };

  React.useEffect(() => {
    if (dbUser) {
      fetchAssets();
      fetchDebts();
      fetchGoals();
      fetchEssentials();
      fetchInvestments();
    }
  }, [dbUser]);

  // Investments Card derived variables
  const {
    investmentsInvested,
    investmentsCurrentValue,
    investmentsProfit,
    investmentsProfitPercent,
    overallCagr,
    monthlySipTotal,
    categorySplits
  } = React.useMemo(() => {
    const invested = investments.reduce((sum, item) => sum + (Number(item.investedAmount) || 0), 0);
    const currentValue = investments.reduce((sum, item) => sum + (Number(item.currentValue) || Number(item.investedAmount) || 0), 0);
    const profit = currentValue - invested;
    const profitPercent = invested > 0 ? Number(((profit / invested) * 100).toFixed(1)) : 0;

    let overallCagr = 0;
    if (currentValue > 0) {
      const weightedSum = investments.reduce((sum, item) => {
        const val = Number(item.currentValue) || Number(item.investedAmount) || 0;
        const rate = Number(item.expectedReturnPct) || 0;
        return sum + val * rate;
      }, 0);
      overallCagr = Number((weightedSum / currentValue).toFixed(1));
    }

    const sipsTotal = investments.filter(item => item.isSip).reduce((sum, item) => sum + (Number(item.sipAmount) || 0), 0);

    // Grouping investments dynamically by their actual category name
    const groups: { [key: string]: number } = {};
    investments.forEach((item) => {
      const name = item.categoryName || "Other";
      groups[name] = (groups[name] || 0) + (Number(item.currentValue) || Number(item.investedAmount) || 0);
    });

    const totalVal = currentValue || 1;
    const splits = Object.keys(groups).map((name) => {
      const val = groups[name];
      const pct = currentValue > 0 ? Math.round((val / totalVal) * 100) : 0;
      return {
        name,
        pct,
        val
      };
    }).sort((a, b) => b.val - a.val);

    return {
      investmentsInvested: invested,
      investmentsCurrentValue: currentValue,
      investmentsProfit: profit,
      investmentsProfitPercent: profitPercent,
      overallCagr,
      monthlySipTotal: sipsTotal,
      categorySplits: splits
    };
  }, [investments]);

  const formatCompact = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };


  // Asset Card derived variables
  const { totalValuation, appreciatingTotal, depreciatingTotal, gainPercent, assetAllocationShares } = React.useMemo(() => {
    let totalVal = 0;
    let purchaseValSum = 0;
    let appreciatingSum = 0;
    let depreciatingSum = 0;
    
    const categoryTotals: Record<string, number> = {};

    assets.forEach((a) => {
      const currentVal = Number(a.current_market_value) || Number(a.purchase_value) || 0;
      const purchaseVal = Number(a.purchase_value) || 0;
      totalVal += currentVal;
      purchaseValSum += purchaseVal;
      
      if (a.is_appreciation || a.isAppreciation) {
        appreciatingSum += currentVal;
      } else {
        depreciatingSum += currentVal;
      }
      
      const categoryName = a.categoryName || (a.category ? a.category.name : "Others");
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + currentVal;
    });

    const gainPercentVal = purchaseValSum > 0 ? Math.round(((totalVal - purchaseValSum) / purchaseValSum) * 100) : 0;
    
    const colors: Record<string, string> = {
      "Property": "bg-blue-600",
      "Gold": "bg-amber-500",
      "Silver": "bg-zinc-400",
      "Vehicle": "bg-indigo-500",
      "Liquid Cash": "bg-cyan-500",
      "Savings Bank Account": "bg-teal-500",
      "Others": "bg-zinc-300"
    };

    const defaultColors = ["bg-blue-600", "bg-amber-500", "bg-zinc-400", "bg-indigo-500", "bg-cyan-500", "bg-teal-500", "bg-zinc-300", "bg-purple-500", "bg-rose-500"];

    let idx = 0;
    const allocationShares = Object.entries(categoryTotals).map(([name, val]) => {
      const pct = totalVal > 0 ? Math.round((val / totalVal) * 100) : 0;
      const color = colors[name] || defaultColors[idx++ % defaultColors.length];
      return {
        name,
        pct,
        color
      };
    });

    return {
      totalValuation: totalVal,
      appreciatingTotal: appreciatingSum,
      depreciatingTotal: depreciatingSum,
      gainPercent: gainPercentVal,
      assetAllocationShares: allocationShares
    };
  }, [assets]);

  // Debt Card derived variables
  const { totalDebtOutstanding, activeLiabilitiesCount, averageInterestRate, totalMonthlyEmi, dtiRatio, liabilitiesSummary } = React.useMemo(() => {
    let totalOutstanding = 0;
    let totalEmi = 0;
    let rateSum = 0;
    let rateCount = 0;
    
    const categoryCounts: Record<string, number> = {};
    
    debts.forEach((d) => {
      const outstanding = Number(d.outstandingPrincipal) || Number(d.outstanding_principal) || Number(d.sanctionedAmount) || Number(d.principal) || 0;
      totalOutstanding += outstanding;
      
      const emi = Number(d.emiAmountInput) || Number(d.emiAmount) || Number(d.emi_amount) || 0;
      totalEmi += emi;
      
      const rate = Number(d.loanInterestRate) || Number(d.interestRate) || Number(d.interest_rate) || 0;
      if (rate > 0) {
        rateSum += rate;
        rateCount++;
      }
      
      const categoryName = d.categoryName || (d.category ? d.category.name : "Other Loan");
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });

    const avgRate = rateCount > 0 ? (rateSum / rateCount).toFixed(1) : "0.0";
    
    const monthlyIncome = 8000; // standard default monthly income base
    const calculatedDti = monthlyIncome > 0 ? Math.round((totalEmi / monthlyIncome) * 100) : 0;
    
    const liabilityStrings = Object.entries(categoryCounts).map(([cat, count]) => {
      return `${count} ${cat}${count > 1 ? "s" : ""}`;
    });
    const summaryText = liabilityStrings.length > 0 ? liabilityStrings.join(", ") : "No active liabilities";

    return {
      totalDebtOutstanding: totalOutstanding,
      activeLiabilitiesCount: debts.length,
      averageInterestRate: avgRate,
      totalMonthlyEmi: totalEmi,
      dtiRatio: calculatedDti,
      liabilitiesSummary: summaryText
    };
  }, [debts]);

  // Helper to identify insurance categories
  const isInsuranceCategory = (categoryName: string) => {
    if (!categoryName) return false;
    const name = categoryName.toLowerCase();
    return name.includes("insurance") || name.includes("cover") || name.includes("policy") || name.includes("life") || name.includes("accident");
  };

  // Goal totals
  const { totalGoalTarget, totalGoalSaved, goalFundingPercentage, activeGoalsCount } = React.useMemo(() => {
    let totalTarget = 0;
    let totalSaved = 0;
    let activeCount = 0;
    goals.forEach((g) => {
      totalTarget += Number(g.targetAmount) || 0;
      totalSaved += Number(g.savedAmount) || 0;
      if (g.status?.toLowerCase() === "active") {
        activeCount++;
      }
    });
    const pct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
    return {
      totalGoalTarget: totalTarget,
      totalGoalSaved: totalSaved,
      goalFundingPercentage: pct,
      activeGoalsCount: activeCount
    };
  }, [goals]);

  // Essentials totals
  const { totalSafetyReserve, totalInsurancePremium, totalInsuranceCover, monthsCoverage, lifeCoverAmount, healthCoverAmount, essentialSplits } = React.useMemo(() => {
    let reserves = 0;
    let premium = 0;
    let cover = 0;
    let life = 0;
    let health = 0;
    const groups: { [key: string]: number } = {};

    essentials.forEach((e) => {
      const catName = e.category?.name || e.categoryName || "";
      const isPolicy = isInsuranceCategory(catName) || e.premium > 0;
      
      const sum = Number(e.sumAssured) || 0;
      if (isPolicy) {
        premium += Number(e.premium) || 0;
        cover += sum;
        if (catName.toLowerCase().includes("life") || catName.toLowerCase().includes("term")) {
          life += sum;
        } else if (catName.toLowerCase().includes("health") || catName.toLowerCase().includes("medical")) {
          health += sum;
        }
      } else {
        reserves += sum;
      }

      const name = catName || "Other";
      groups[name] = (groups[name] || 0) + sum;
    });

    const monthlyExpense = 50000; // standard default monthly expense base (INR)
    const months = monthlyExpense > 0 ? (reserves / monthlyExpense).toFixed(1) : "0.0";

    const splits = Object.entries(groups).map(([name, val]) => ({
      name,
      val
    })).sort((a, b) => b.val - a.val);

    return {
      totalSafetyReserve: reserves,
      totalInsurancePremium: premium,
      totalInsuranceCover: cover,
      monthsCoverage: months,
      lifeCoverAmount: life,
      healthCoverAmount: health,
      essentialSplits: splits
    };
  }, [essentials]);

  // Scenario Simulator state (Net Worth Card)
  const [showHealthDetails, setShowHealthDetails] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState<string | null>(null);
  const [showNetWorthDetails, setShowNetWorthDetails] = React.useState(false);
  const [showDebtDetails, setShowDebtDetails] = React.useState(false);
  const [showInvestmentDetails, setShowInvestmentDetails] = React.useState(false);
  const [showGoalDetails, setShowGoalDetails] = React.useState(false);
  const [showEmergencyDetails, setShowEmergencyDetails] = React.useState(false);
  const [monthlySavings, setMonthlySavings] = React.useState(2500); // Slider for monthly savings
  const [returnRate, setReturnRate] = React.useState(8); // Slider for return rate in %

  // Dynamic Net Worth Projection calculations
  const calculateProjection = (years: number) => {
    const r = returnRate / 100;
    const n = 12; // monthly compounded
    const principal = Math.max(0, totalValuation - totalDebtOutstanding);
    const PMT = monthlySavings;
    
    // Future value of current principal
    const fvPrincipal = principal * Math.pow(1 + r/n, n * years);
    // Future value of monthly annuity
    const fvAnnuity = PMT * ((Math.pow(1 + r/n, n * years) - 1) / (r/n)) * (1 + r/n);
    
    return Math.round(fvPrincipal + fvAnnuity);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  if (showHealthDetails) {
    return <FinancialHealthView onBack={() => setShowHealthDetails(false)} />;
  }

  if (showNetWorthDetails) {
    return <NetWorthDetailView onBack={() => setShowNetWorthDetails(false)} />;
  }

  if (showDebtDetails) {
    return <DebtDetailView onBack={() => setShowDebtDetails(false)} onAddClick={onAddClick} />;
  }

  if (showInvestmentDetails) {
    return (
      <InvestmentDetailView
        onBack={() => {
          fetchInvestments();
          setShowInvestmentDetails(false);
        }}
        onAddClick={onAddClick}
        onUpgradeClick={onUpgradeClick}
      />
    );
  }

  if (showGoalDetails) {
    return <GoalsDetailView onBack={() => { setShowGoalDetails(false); fetchGoals(); }} onAddClick={onAddClick} onUpgradeClick={onUpgradeClick} />;
  }

  if (showEmergencyDetails) {
    return <EmergencyDetailView onBack={() => { setShowEmergencyDetails(false); fetchEssentials(); }} onAddClick={onAddClick} onUpgradeClick={onUpgradeClick} />;
  }

  if (selectedAsset === "overview") {
    return (
      <AssetsOverviewView 
        onBack={() => { setSelectedAsset(null); fetchAssets(); }} 
        onAssetClick={(id) => setSelectedAsset(id)} 
        onAddClick={onAddClick}
        assets={assets}
        loading={loadingAssets}
      />
    );
  }

  if (selectedAsset) {
    return <AssetDetailView assetId={selectedAsset} onBack={() => { setSelectedAsset(null); fetchAssets(); }} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950">Wealth</h2>
          <p className="text-sm text-zinc-500 mt-1">Track, grow, and optimize your financial future with dynamic projections.</p>
        </div>
        <Button
          onClick={onAddClick}
          className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-semibold transition-all active:scale-[0.98] outline-none cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add
        </Button>
      </div>

      {/* Main 12-Column Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ==========================================
            1. Assets Card (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Coins className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button onClick={onAddClick} className="text-xs text-zinc-400 font-semibold hover:text-zinc-650 transition-colors cursor-pointer">+ Add Asset</button>
              <span className="text-zinc-200">|</span>
              <button
                onClick={() => setSelectedAsset("overview")}
                className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center outline-none cursor-pointer"
              >
                Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-zinc-900">Assets</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Asset allocations and appreciation summary</p>
          </div>

          <div className="my-5">
            <p className="text-2xl font-bold tracking-tight text-zinc-900">{formatCurrency(totalValuation)}</p>
            <p className="text-xs mt-1 text-zinc-500 flex items-center gap-1">
              <span className={`font-bold px-1 rounded ${gainPercent >= 0 ? "text-emerald-600 bg-emerald-50" : "text-red-650 bg-red-50"}`}>
                {gainPercent >= 0 ? "+" : ""}{gainPercent}% Yield
              </span>
              <span>across {assets.length} connected assets</span>
            </p>
          </div>

          {/* Asset Type Stack */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Appreciating</p>
                <p className="text-sm font-bold text-zinc-900 mt-0.5">{formatCurrency(appreciatingTotal)}</p>
                <span className="text-[10px] text-emerald-650 font-semibold">Real estate & Stocks</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Depreciating</p>
                <p className="text-sm font-bold text-zinc-900 mt-0.5">{formatCurrency(depreciatingTotal)}</p>
                <span className="text-[10px] text-zinc-400 font-semibold">Automobile assets</span>
              </div>
            </div>

            {/* Asset Distribution Bar chart */}
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">Asset Allocation</p>
              {totalValuation > 0 ? (
                <>
                  <div className="h-3.5 w-full bg-zinc-100 rounded-full overflow-hidden flex">
                    {assetAllocationShares.map((share, idx) => (
                      share.pct > 0 && (
                        <div
                          key={idx}
                          className={`h-full ${share.color}`}
                          style={{ width: `${share.pct}%` }}
                          title={`${share.name} (${share.pct}%)`}
                        />
                      )
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 items-center text-[9px] text-zinc-400 font-bold mt-2">
                    {assetAllocationShares.map((share, idx) => (
                      share.pct > 0 && (
                        <span key={idx} className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${share.color}`} />
                          {share.name} ({share.pct}%)
                        </span>
                      )
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-zinc-400 text-[10px] font-bold py-2 bg-zinc-50 rounded-lg text-center border border-dashed border-zinc-200">
                  No assets added yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==========================================
            2. Debts Card (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button onClick={onAddClick} className="text-xs text-zinc-400 font-semibold hover:text-zinc-650 transition-colors cursor-pointer">+ Add Loan</button>
              <span className="text-zinc-200">|</span>
              <button 
                onClick={() => setShowDebtDetails(true)}
                className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center cursor-pointer outline-none"
              >
                Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-zinc-900">Debts</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Outstanding liabilities and interest structures</p>
          </div>

          <div className="my-5">
            <p className="text-2xl font-bold tracking-tight text-zinc-900">{formatCurrency(totalDebtOutstanding)}</p>
            <p className="text-xs mt-1 text-zinc-500 flex items-center gap-2">
              <span className={`font-bold px-1 rounded ${dtiRatio > 35 ? "text-red-600 bg-red-50" : dtiRatio > 15 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50"}`}>
                {dtiRatio}% DTI
              </span>
              <span>Debt-to-Income ratio</span>
            </p>
          </div>

          {/* Debt metrics details */}
          <div className="space-y-4 pt-4 border-t border-zinc-100 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500 font-semibold">Active Liabilities:</span>
              <span className="font-bold text-zinc-900">{liabilitiesSummary}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 font-semibold">Average Interest Rate:</span>
              <span className="font-bold text-zinc-900">{averageInterestRate}% APR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 font-semibold">Total Monthly EMI:</span>
              <span className="font-bold text-zinc-900">{formatCurrency(totalMonthlyEmi)} / mo</span>
            </div>

            {/* AI avalanche suggestion */}
            {debts.length > 0 && (
              <div className="rounded-xl bg-orange-50/50 p-3.5 border border-orange-100/50">
                <div className="flex items-center gap-1.5 text-orange-600 mb-1">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs font-bold">AI Debt-Avalanche Strategy</span>
                </div>
                <p className="text-[11px] text-zinc-650 leading-normal">
                  Prioritize extra prepayments on your highest-rate loan. Your average rate is <span className="font-bold text-red-650">{averageInterestRate}% APR</span> across {debts.length} active liabilities.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
            3. Goals Card (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Target className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button onClick={onAddClick} className="text-xs text-zinc-400 font-semibold hover:text-zinc-650 transition-colors cursor-pointer">+ Add Goal</button>
              <span className="text-zinc-200">|</span>
              <button 
                onClick={() => setShowGoalDetails(true)}
                className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center cursor-pointer outline-none"
              >
                Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-zinc-900">Goals Planner</h3>
            <p className="text-xs text-zinc-500 mt-0.5">{goals.length} Goals Tracked | {activeGoalsCount} Active</p>
          </div>

          {/* Dynamic Goals progress */}
          <div className="my-5 bg-zinc-50/50 p-4 rounded-xl border border-zinc-150 space-y-2">
            <div className="flex justify-between items-end text-xs mb-1.5 font-semibold text-zinc-800">
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Overall Goals Progress</span>
                <p className="text-lg font-black text-zinc-900 mt-0.5">{formatCurrency(totalGoalSaved)} / {formatCurrency(totalGoalTarget)}</p>
              </div>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${
                goalFundingPercentage >= 100 ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-blue-600 bg-blue-50 border-blue-100"
              }`}>
                {goalFundingPercentage}% Funded
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" style={{ width: `${Math.min(goalFundingPercentage, 100)}%` }} />
            </div>
          </div>

          {/* Individual Goals List (filling white space) */}
          <div className="mt-4 pt-4 border-t border-zinc-100 space-y-3">
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Goals Breakdown</p>
            {goals.length > 0 ? (
              <div className="space-y-3">
                {goals.slice(0, 3).map((goal, idx) => {
                  const target = Number(goal.targetAmount) || 0;
                  const saved = Number(goal.savedAmount) || 0;
                  const pct = target > 0 ? Math.min(Math.round((saved / target) * 100), 100) : 0;
                  return (
                    <div key={goal.id || idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-zinc-700">
                        <span className="truncate max-w-[60%]">{goal.name}</span>
                        <span className="text-zinc-500 font-bold">{pct}% ({formatCurrency(saved)} / {formatCurrency(target)})</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {goals.length > 3 && (
                  <p className="text-[9px] text-zinc-450 text-center font-bold">
                    + {goals.length - 3} more goals tracked
                  </p>
                )}
              </div>
            ) : (
              <div className="text-zinc-450 text-[10px] font-bold py-4 bg-zinc-50 rounded-xl text-center border border-dashed border-zinc-200">
                No active goals added yet
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
            4. Emergency Fund & Essentials (6 Columns)
            ========================================== */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button onClick={onAddClick} className="text-xs text-zinc-400 font-semibold hover:text-zinc-650 transition-colors cursor-pointer">+ Add Essential</button>
              <span className="text-zinc-200">|</span>
              <button
                onClick={() => setShowEmergencyDetails(true)}
                className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center cursor-pointer outline-none"
              >
                Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-zinc-900">Essentials</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Insurance policies and safety capital protection</p>
          </div>

          {/* Emergency Fund coverage progress */}
          <div className="my-5">
            <div className="flex justify-between items-end text-xs mb-1.5">
              <div>
                <span className="text-zinc-400 font-semibold">Safety Reserve Capital</span>
                <p className="text-xl font-bold text-zinc-900 mt-0.5">
                  {formatCurrency(totalSafetyReserve)} / {formatCurrency(300000)} target
                </p>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                totalSafetyReserve >= 300000 ? "text-emerald-600 bg-emerald-55 border border-emerald-100/30" : "text-amber-600 bg-amber-55 border border-amber-100/30"
              }`}>
                {totalSafetyReserve > 0 ? Math.round((totalSafetyReserve / 300000) * 100) : 0}% Funded
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${Math.min(totalSafetyReserve > 0 ? Math.round((totalSafetyReserve / 300000) * 100) : 0, 100)}%` }} />
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">Provides <span className="font-bold text-zinc-800">{monthsCoverage} Months</span> of basic household expense coverage.</p>
          </div>          {/* Insurance and nominee checklist */}
          {essentialSplits.length > 0 ? (
            <div className="space-y-4 pt-4 border-t border-zinc-100 text-xs">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Protective Assets & Coverages</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {essentialSplits.map((split, idx) => (
                    <div key={idx} className="flex items-center justify-between py-0.5">
                      <span className="text-zinc-555 truncate mr-2">{split.name}:</span>
                      <span className="font-semibold text-zinc-900 shrink-0">
                        {formatCurrency(split.val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Warning reminder */}
              <div className="rounded-xl bg-blue-50/50 p-3.5 border border-blue-100/50 flex items-start gap-2.5 mt-2">
                <Sparkles className="h-4.5 w-4.5 text-blue-655 shrink-0 mt-0.5 animate-pulse" />
                <p className="text-[11px] text-zinc-600 leading-normal">
                  {healthCoverAmount === 0 || lifeCoverAmount === 0 ? (
                    <span className="text-amber-700 font-bold">AI recommends adding health/life coverage limits to correctly construct protective cushions.</span>
                  ) : (
                    "AI confirms coverage levels are healthy. Keep tracking premium renewal timelines."
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-zinc-100 text-xs text-center text-zinc-450 italic font-bold">
              No essentials recorded. Add a policy or safety reserve to see details.
            </div>
          )}
        </div>

        {/* ==========================================
            5. Investments Card (6 Columns)
            ========================================== */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button onClick={onAddClick} className="text-xs text-zinc-400 font-semibold hover:text-zinc-650 transition-colors cursor-pointer">+ Add Investment</button>
              <span className="text-zinc-200">|</span>
              <button
                onClick={() => setShowInvestmentDetails(true)}
                className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center outline-none cursor-pointer"
              >
                Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-lg font-bold text-zinc-900">Investments</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Asset securities and equity CAGR metrics</p>
          </div>

          <div className="my-5 flex justify-between items-end">
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-zinc-900">{formatINR(investmentsCurrentValue)}</p>
              <p className="text-xs mt-1 text-zinc-500">Portfolio allocations index</p>
            </div>
            <div className="text-right">
              <p className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-block ${investmentsProfit >= 0 ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
                {investmentsProfit >= 0 ? "+" : ""}{formatINR(investmentsProfit)} Profit
              </p>
              <p className="text-[10px] text-zinc-400 mt-1">Overall Expected Return: {overallCagr}%</p>
            </div>
          </div>

          {/* Allocation Details */}
          {categorySplits.length > 0 ? (
            <div className="space-y-4 pt-4 border-t border-zinc-100 text-xs">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Asset Allocation Breakdown</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {categorySplits.map((split, idx) => (
                    <div key={idx} className="flex items-center justify-between py-0.5">
                      <span className="text-zinc-555 truncate mr-2">{split.name}:</span>
                      <span className="font-semibold text-zinc-900 shrink-0">
                        {split.pct}% ({formatCompact(split.val)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SIP & Goal alignment details */}
              {monthlySipTotal > 0 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100 mt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-semibold text-zinc-900">Active Monthly SIP: {formatINR(monthlySipTotal)}/mo</p>
                      <p className="text-[10px] text-zinc-500">Aligned with retirement goal targets</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400">92% Match</span>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-4 border-t border-zinc-100 text-xs text-center text-zinc-450 italic font-bold">
              No allocations recorded. Add an investment to see breakdown.
            </div>
          )}
        </div>

        {/* ==========================================
            6. Financial Health Card (6 Columns)
            ========================================== */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button onClick={onAddClick} className="text-xs text-zinc-400 font-semibold hover:text-zinc-650 transition-colors cursor-pointer">+ Add Data</button>
              <span className="text-zinc-200">|</span>
              <button
                onClick={() => setShowHealthDetails(true)}
                className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center outline-none cursor-pointer"
              >
                Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-zinc-900">Financial Health</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Comprehensive audit of overall financial wellness</p>
          </div>

          {/* Health Score Circular Meter */}
          <div className="flex items-center gap-6 my-6">
            <div className="relative h-20 w-20 flex items-center justify-center">
              <svg className="h-full w-full transform -rotate-90">
                <circle cx="40" cy="40" r="34" className="stroke-zinc-100" strokeWidth="6" fill="transparent" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-blue-600 transition-all duration-500"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="213.6"
                  strokeDashoffset={213.6 - (213.6 * 78) / 100}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold text-zinc-900 leading-none">78</span>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">Score</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Excellent Health
              </span>
              <p className="text-xs font-semibold text-zinc-800">3 of 5 Goals Active</p>
              <p className="text-[10px] text-zinc-400">Target score is 85+ by end of Q4</p>
            </div>
          </div>

          {/* Checklist and AI Insights */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-2">Checklist & Suggestions</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 text-zinc-700">
                  <input type="checkbox" defaultChecked disabled className="rounded border-zinc-200 text-blue-600 h-3.5 w-3.5" />
                  <span>Emergency Fund</span>
                </label>
                <label className="flex items-center gap-2 text-zinc-700">
                  <input type="checkbox" defaultChecked disabled className="rounded border-zinc-200 text-blue-600 h-3.5 w-3.5" />
                  <span>Health Insurance</span>
                </label>
                <label className="flex items-center gap-2 text-zinc-700">
                  <input type="checkbox" disabled className="rounded border-zinc-200 text-blue-600 h-3.5 w-3.5" />
                  <span className="text-zinc-500">Will & Estate Plan</span>
                </label>
                <label className="flex items-center gap-2 text-zinc-700">
                  <input type="checkbox" disabled className="rounded border-zinc-200 text-blue-600 h-3.5 w-3.5" />
                  <span className="text-zinc-500">Tax Optimization</span>
                </label>
              </div>
            </div>

            <div className="rounded-xl bg-blue-50/50 p-3.5 border border-blue-100/50">
              <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold">AI Health Insight</span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-normal">
                Score is throttled by missing a registered Will and estate nominee assignment. Resolve this to gain 10 score points.
              </p>
            </div>
          </div>
        </div>        {/* ==========================================
            7. Net Worth Prediction Card (6 Columns)
            ========================================== */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button onClick={onAddClick} className="text-xs text-zinc-400 font-semibold hover:text-zinc-650 transition-colors cursor-pointer">+ Add Data</button>
              <span className="text-zinc-200">|</span>
              <button 
                onClick={() => setShowNetWorthDetails(true)}
                className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center outline-none cursor-pointer"
              >
                Simulation details <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-zinc-900">Net Worth</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Asset-liability surplus and forecasting simulator</p>
          </div>

          {/* Core Balance */}
          <div className="my-5">
            <p className="text-3xl font-extrabold tracking-tight text-zinc-900">
              {formatCurrency(totalValuation - totalDebtOutstanding)}
            </p>
            <p className="text-xs mt-1 text-zinc-500">
              Assets ({formatCurrency(totalValuation)}) minus Liabilities ({formatCurrency(totalDebtOutstanding)})
            </p>
          </div>

          {/* Simulator Sliders */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">AI-Powered Net Worth Projection Simulator</p>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-700">
                  <span>Monthly Contribution / Savings:</span>
                  <span className="text-blue-600 font-bold">{formatCurrency(monthlySavings)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={monthlySavings}
                  onChange={(e) => setMonthlySavings(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-700">
                  <span>Simulated Investment Growth Rate:</span>
                  <span className="text-blue-600 font-bold">{returnRate}% CAGR</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="0.5"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Dynamic Forecast Grid */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-zinc-100 text-center">
              <div className="bg-zinc-50 rounded-xl p-2.5">
                <span className="text-[10px] text-zinc-500 font-semibold">1 Year</span>
                <p className="text-xs font-bold text-zinc-900 mt-1">{formatCurrency(calculateProjection(1))}</p>
              </div>
              <div className="bg-zinc-50 rounded-xl p-2.5">
                <span className="text-[10px] text-zinc-500 font-semibold">5 Years</span>
                <p className="text-xs font-bold text-zinc-900 mt-1">{formatCurrency(calculateProjection(5))}</p>
              </div>
              <div className="bg-zinc-50 rounded-xl p-2.5">
                <span className="text-[10px] text-zinc-500 font-semibold">10 Years</span>
                <p className="text-xs font-bold text-zinc-900 mt-1">{formatCurrency(calculateProjection(10))}</p>
              </div>
              <div className="bg-zinc-50 rounded-xl p-2.5">
                <span className="text-[10px] text-zinc-500 font-semibold">20 Years</span>
                <p className="text-xs font-bold text-zinc-900 mt-1">{formatCurrency(calculateProjection(20))}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
