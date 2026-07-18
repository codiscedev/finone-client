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

  React.useEffect(() => {
    if (dbUser) {
      fetchAssets();
      fetchDebts();
    }
  }, [dbUser]);

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

  // Retirement Goal Calculator state (Goals Card)
  const [targetRetireAge, setTargetRetireAge] = React.useState(60);
  const [currentAge, setCurrentAge] = React.useState(30);
  const [currentSavings, setCurrentSavings] = React.useState(150000);

  // Dynamic Net Worth Projection calculations
  const calculateProjection = (years: number) => {
    const r = returnRate / 100;
    const n = 12; // monthly compounded
    const principal = 1248390; // Current Net Worth
    const PMT = monthlySavings;
    
    // Future value of current principal
    const fvPrincipal = principal * Math.pow(1 + r/n, n * years);
    // Future value of monthly annuity
    const fvAnnuity = PMT * ((Math.pow(1 + r/n, n * years) - 1) / (r/n)) * (1 + r/n);
    
    return Math.round(fvPrincipal + fvAnnuity);
  };

  // Dynamic Retirement Corpus Calculator calculations
  const yearsToRetire = targetRetireAge - currentAge;
  const retirementRequiredCorpus = 2500000; // Target retirement corpus: $2.5M
  
  const calculateRetirementProgress = () => {
    const r = 0.07; // Assuming conservative 7% growth for retirement calculations
    const n = 12;
    const principal = currentSavings;
    const PMT = 1500; // current monthly retirement SIP
    
    if (yearsToRetire <= 0) return principal;
    const fvPrincipal = principal * Math.pow(1 + r/n, n * yearsToRetire);
    const fvAnnuity = PMT * ((Math.pow(1 + r/n, n * yearsToRetire) - 1) / (r/n)) * (1 + r/n);
    
    return Math.round(fvPrincipal + fvAnnuity);
  };

  const projectedRetirementCorpus = calculateRetirementProgress();
  const corpusPercentage = Math.min(Math.round((projectedRetirementCorpus / retirementRequiredCorpus) * 100), 100);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
    return <InvestmentDetailView onBack={() => setShowInvestmentDetails(false)} onAddClick={onAddClick} onUpgradeClick={onUpgradeClick} />;
  }

  if (showGoalDetails) {
    return <GoalsDetailView onBack={() => setShowGoalDetails(false)} onAddClick={onAddClick} onUpgradeClick={onUpgradeClick} />;
  }

  if (showEmergencyDetails) {
    return <EmergencyDetailView onBack={() => setShowEmergencyDetails(false)} onAddClick={onAddClick} onUpgradeClick={onUpgradeClick} />;
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
            1. Financial Health Card (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
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
        </div>

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
            3. Debts Card (4 Columns)
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
            {debts.length > 0 ? (
              <div className="rounded-xl bg-orange-50/50 p-3.5 border border-orange-100/50">
                <div className="flex items-center gap-1.5 text-orange-600 mb-1">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs font-bold">AI Debt-Avalanche Strategy</span>
                </div>
                <p className="text-[11px] text-zinc-650 leading-normal">
                  Prioritize extra prepayments on your highest-rate loan. Your average rate is <span className="font-bold text-red-650">{averageInterestRate}% APR</span> across {debts.length} active liabilities.
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-emerald-50/50 p-3.5 border border-emerald-100/50">
                <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-bold">AI Debt health Strategy</span>
                </div>
                <p className="text-[11px] text-zinc-650 leading-normal">
                  You are completely debt free! Keep maintaining a robust savings rate and invest in appreciating assets.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
            4. Net Worth Prediction Card (6 Columns)
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
            <p className="text-3xl font-extrabold tracking-tight text-zinc-900">$1,248,390</p>
            <p className="text-xs mt-1 text-zinc-500">Assets ($1,480,000) minus Liabilities ($231,610)</p>
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
              <p className="text-3xl font-extrabold tracking-tight text-zinc-900">$458,000</p>
              <p className="text-xs mt-1 text-zinc-500">Portfolio allocations index</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">+$82,400 Total Profit</p>
              <p className="text-[10px] text-zinc-400 mt-1">Overall CAGR: 10.4%</p>
            </div>
          </div>

          {/* Allocation Details */}
          <div className="space-y-4 pt-4 border-t border-zinc-100 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Equity Breakdown</p>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">US Equities:</span>
                  <span className="font-semibold text-zinc-900">45% ($206,100)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Tech Stocks:</span>
                  <span className="font-semibold text-zinc-900">30% ($137,400)</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Fixed Income</p>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">T-Bills & Bonds:</span>
                  <span className="font-semibold text-zinc-900">20% ($91,600)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Cash Reserves:</span>
                  <span className="font-semibold text-zinc-900">5% ($22,900)</span>
                </div>
              </div>
            </div>

            {/* SIP & Goal alignment details */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="font-semibold text-zinc-900">Active Monthly SIP: $1,500/mo</p>
                  <p className="text-[10px] text-zinc-500">Aligned with retirement goal targets</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-zinc-400">92% Match</span>
            </div>
          </div>
        </div>

        {/* ==========================================
            6. Goals Card (6 Columns)
            ========================================== */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
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
            <p className="text-xs text-zinc-500 mt-0.5">Retirement calculator and savings target progress</p>
          </div>

          {/* Calculator Controls */}
          <div className="space-y-4 my-5 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-700">
              <span>Simulated Target Retirement Age:</span>
              <span className="text-blue-600 font-bold">{targetRetireAge} Years</span>
            </div>
            <input
              type="range"
              min="50"
              max="70"
              step="1"
              value={targetRetireAge}
              onChange={(e) => setTargetRetireAge(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-zinc-200/50">
              <div>
                <span className="text-zinc-500">Current Savings:</span>
                <p className="font-bold text-zinc-900 mt-0.5">{formatCurrency(currentSavings)}</p>
              </div>
              <div>
                <span className="text-zinc-500">Required monthly SIP:</span>
                <p className="font-bold text-zinc-900 mt-0.5">$1,500 / mo</p>
              </div>
            </div>
          </div>

          {/* Progress metric */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-800 mb-1.5">
                <span>Retirement Corpus Progress (Target $2.5M)</span>
                <span>{corpusPercentage}% Probability</span>
              </div>
              <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${corpusPercentage}%` }} />
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">Projected corpus: {formatCurrency(projectedRetirementCorpus)} by age {targetRetireAge}</p>
            </div>

            {/* Other targets summary */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-zinc-100">
              <div>
                <span className="text-[10px] text-zinc-400 font-semibold block">Child Education</span>
                <p className="font-bold text-zinc-900 mt-0.5">$120k</p>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded inline-block mt-1">94% probability</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-semibold block">House Purchase</span>
                <p className="font-bold text-zinc-900 mt-0.5">$650k</p>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded inline-block mt-1">82% probability</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-semibold block">Vacation</span>
                <p className="font-bold text-zinc-900 mt-0.5">$15k</p>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded inline-block mt-1">99% probability</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            7. Emergency Fund & Essentials (6 Columns)
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
            <h3 className="text-lg font-bold text-zinc-900">Emergency & Essentials</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Insurance policies and safety capital protection</p>
          </div>

          {/* Emergency Fund coverage progress */}
          <div className="my-5">
            <div className="flex justify-between items-end text-xs mb-1.5">
              <div>
                <span className="text-zinc-400 font-semibold">Safety Reserve Capital</span>
                <p className="text-xl font-bold text-zinc-900 mt-0.5">$36,000 / $30,000 target</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">120% Funded</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: "100%" }} />
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">Provides <span className="font-bold text-zinc-800">7.2 Months</span> of basic household expense coverage.</p>
          </div>

          {/* Insurance and nominee checklist */}
          <div className="space-y-4 pt-4 border-t border-zinc-100 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Policies Status</p>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Health Insurance:</span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Life Insurance:</span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Home Protection:</span>
                  <span className="font-bold text-red-600">Missing!</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Estate Audits</p>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Will Documented:</span>
                  <span className="font-bold text-red-600">Missing!</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Nominees Assigned:</span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>
              </div>
            </div>

            {/* AI Warning reminder */}
            <div className="rounded-xl bg-blue-50/50 p-3.5 border border-blue-100/50 flex items-start gap-2.5">
              <Sparkles className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5 animate-pulse" />
              <p className="text-[11px] text-zinc-600 leading-normal">
                AI recommends getting home protection quotes. Also consider utilizing our simple estate builder tool to generate your personal digital Will.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
