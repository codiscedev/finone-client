"use client";

import * as React from "react";
import {
  ArrowLeft,
  Sparkles,
  Calculator,
  TrendingUp,
  Percent,
  Coins,
  ShieldAlert,
  Sliders,
  Clock,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinancialHealthViewProps {
  onBack: () => void;
}

export default function FinancialHealthView({ onBack }: FinancialHealthViewProps) {
  // 1. Savings Rate inputs
  const [income, setIncome] = React.useState(100000); // Monthly Income
  const [savings, setSavings] = React.useState(25000); // Monthly Savings

  // 2. DTI inputs
  const [emis, setEmis] = React.useState(20000); // Total Monthly EMIs

  // 3. Emergency Fund inputs
  const [emergencyFund, setEmergencyFund] = React.useState(360000); // Current Emergency Fund
  const [expenses, setExpenses] = React.useState(60000); // Monthly Expenses

  // 4. Spending Control inputs
  const [budget, setBudget] = React.useState(60000); // Budget
  const [spending, setSpending] = React.useState(48000); // Actual Spending

  // 5. Investment Ratio inputs
  const [investments, setInvestments] = React.useState(15000); // Monthly Investments

  // 6. Bill Payment Punctuality inputs
  const [onTimePayments, setOnTimePayments] = React.useState(28); // Total bills on time
  const [totalPayments, setTotalPayments] = React.useState(30); // Total bills

  // State to toggle expandable sections
  const [expandedPillar, setExpandedPillar] = React.useState<string | null>("Savings");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // ----------------------------------------------------
  // Individual Pillar Scores calculation
  // ----------------------------------------------------

  // 1. Savings Rate Score
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
  const getSavingsScore = () => {
    if (savingsRate >= 30) return 100;
    if (savingsRate >= 20) return 75;
    if (savingsRate >= 10) return 50;
    if (savingsRate > 0) return 25;
    return 0;
  };
  const savingsScore = getSavingsScore();

  // 2. DTI Ratio Score
  const dti = income > 0 ? Math.round((emis / income) * 100) : 0;
  const getDtiScore = () => {
    if (dti < 15) return 100;
    if (dti <= 30) return 75;
    if (dti <= 40) return 50;
    if (dti <= 50) return 25;
    return 0;
  };
  const dtiScore = getDtiScore();

  // 3. Emergency Fund Score
  const monthsCovered = expenses > 0 ? Math.round((emergencyFund / expenses) * 10) / 10 : 0;
  const getEmergencyScore = () => {
    if (monthsCovered >= 6) return 100;
    if (monthsCovered >= 3) return 75;
    if (monthsCovered >= 1) return 40;
    return 10;
  };
  const emergencyScore = getEmergencyScore();

  // 4. Spending Control Score
  const budgetUtilization = budget > 0 ? Math.round((spending / budget) * 100) : 0;
  const getSpendingScore = () => {
    if (budgetUtilization <= 80) return 100;
    if (budgetUtilization <= 100) return 75;
    if (budgetUtilization <= 110) return 40;
    return 0;
  };
  const spendingScore = getSpendingScore();

  // 5. Investment Ratio Score
  const investmentRatio = income > 0 ? Math.round((investments / income) * 100) : 0;
  const getInvestmentScore = () => {
    if (investmentRatio >= 20) return 100;
    if (investmentRatio >= 10) return 75;
    if (investmentRatio >= 5) return 50;
    if (investmentRatio >= 1) return 25;
    return 0;
  };
  const investmentScore = getInvestmentScore();

  // 6. Bill Payment Punctuality Score
  const punctuality = totalPayments > 0 ? Math.round((onTimePayments / totalPayments) * 100) : 0;
  const getBillScore = () => {
    if (punctuality === 100) return 100;
    if (punctuality >= 95) return 80;
    if (punctuality >= 90) return 60;
    if (punctuality >= 80) return 40;
    return 0;
  };
  const billScore = getBillScore();

  // ----------------------------------------------------
  // Overall Health Score Compounding Math
  // ----------------------------------------------------
  const overallScore = Math.round(
    savingsScore * 0.25 +
    dtiScore * 0.20 +
    emergencyScore * 0.20 +
    spendingScore * 0.15 +
    investmentScore * 0.10 +
    billScore * 0.10
  );

  // Grade Mapping
  const getGradeAndStatus = (score: number) => {
    if (score >= 90) return { grade: "A+", status: "Excellent", color: "text-emerald-600 bg-emerald-50 border-emerald-100", stroke: "stroke-emerald-500" };
    if (score >= 80) return { grade: "A", status: "Very Good", color: "text-blue-600 bg-blue-50 border-blue-100", stroke: "stroke-blue-500" };
    if (score >= 70) return { grade: "B", status: "Good", color: "text-yellow-600 bg-yellow-50 border-yellow-100", stroke: "stroke-yellow-500" };
    if (score >= 60) return { grade: "C", status: "Fair", color: "text-orange-500 bg-orange-50 border-orange-100", stroke: "stroke-orange-500" };
    if (score >= 40) return { grade: "D", status: "Needs Improvement", color: "text-red-500 bg-red-50 border-red-100", stroke: "stroke-red-400" };
    return { grade: "F", status: "Critical", color: "text-red-700 bg-red-100 border-red-200", stroke: "stroke-red-600" };
  };

  const rating = getGradeAndStatus(overallScore);

  const toggleExpanded = (pillar: string) => {
    setExpandedPillar(expandedPillar === pillar ? null : pillar);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header with Back button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 transition-colors shadow-sm outline-none"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950">Financial Health Audit</h2>
            <p className="text-sm text-zinc-500 mt-1">Audit overall financial wellness weights, simulate metrics, and view score trends.</p>
          </div>
        </div>
      </div>

      {/* ==========================================
          1. Hero Card (Top section)
          ========================================== */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left score donut */}
          <div className="lg:col-span-4 flex items-center justify-center border-r border-zinc-100 pr-0 lg:pr-8">
            <div className="relative h-44 w-44 flex items-center justify-center">
              <svg className="h-full w-full transform -rotate-90">
                <circle cx="88" cy="88" r="76" className="stroke-zinc-100" strokeWidth="10" fill="transparent" />
                <circle
                  cx="88"
                  cy="88"
                  r="76"
                  className={`${rating.stroke} transition-all duration-500`}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="477.5"
                  strokeDashoffset={477.5 - (477.5 * overallScore) / 100}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-zinc-900 leading-none">{overallScore}</span>
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1.5">Score</span>
              </div>
            </div>
          </div>

          {/* Right audit status details */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${rating.color} border`}>
                Grade {rating.grade} • {rating.status}
              </span>
              <span className="text-xs text-zinc-400 font-semibold">Last Updated: Today</span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">▲ +5 this month</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-zinc-900">Your Wealth Wellness Snapshot</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Your calculated financial score is <span className="font-bold text-zinc-900">{overallScore}/100</span>.
                {overallScore >= 80 ? (
                  " You are maintaining healthy savings and investments. Improving your emergency fund or capping non-essential overspending could further strengthen your financial index."
                ) : (
                  " Your wealth score indicates opportunities for refinement. Prioritize paying off high-interest EMIs and build up emergency funds to safeguard your financial profile."
                )}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main 12-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Expandable Pillar Cards (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-2">Weighted Financial Pillars</h3>

          {/* Pillar 1: Savings Rate */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleExpanded("Savings")}
              className="flex w-full items-center justify-between p-5 text-left outline-none hover:bg-zinc-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">25%</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Savings Rate</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Current Rate: {savingsRate}% • Score: {savingsScore}/100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-emerald-600">Stable</span>
                {expandedPillar === "Savings" ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
              </div>
            </button>
            
            {expandedPillar === "Savings" && (
              <div className="px-5 pb-5 border-t border-zinc-100 bg-zinc-50/30 p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Sliders */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-zinc-700">
                        <span>Monthly Income:</span>
                        <span className="font-bold text-zinc-900">{formatCurrency(income)}</span>
                      </div>
                      <input
                        type="range"
                        min="50000"
                        max="250000"
                        step="5000"
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-zinc-700">
                        <span>Monthly Savings:</span>
                        <span className="font-bold text-zinc-900">{formatCurrency(savings)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={income}
                        step="2000"
                        value={savings}
                        onChange={(e) => setSavings(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* Calculations Details */}
                  <div className="p-3.5 rounded-xl border border-zinc-150 bg-white space-y-2">
                    <p className="font-bold text-zinc-800">Scoring Criteria Matrix</p>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>Rate &ge; 30%</span>
                      <span className="font-bold text-emerald-600">100 Pts</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>20% - 30%</span>
                      <span className="font-bold text-blue-600">75 Pts</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>10% - 20%</span>
                      <span className="font-bold text-yellow-600">50 Pts</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-start p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-600 leading-normal">
                    AI recommendation: Increase monthly savings by {formatCurrency(Math.max((income * 0.3) - savings, 0))} to cross the 30% threshold and reach 100 points.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pillar 2: Debt-to-Income Ratio */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleExpanded("DTI")}
              className="flex w-full items-center justify-between p-5 text-left outline-none hover:bg-zinc-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">20%</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Debt-to-Income Ratio (DTI)</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Current DTI: {dti}% • Score: {dtiScore}/100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-emerald-600">Healthy</span>
                {expandedPillar === "DTI" ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
              </div>
            </button>
            
            {expandedPillar === "DTI" && (
              <div className="px-5 pb-5 border-t border-zinc-100 bg-zinc-50/30 p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-zinc-700">
                        <span>Total Monthly EMIs:</span>
                        <span className="font-bold text-zinc-900">{formatCurrency(emis)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="80000"
                        step="1000"
                        value={emis}
                        onChange={(e) => setEmis(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-150 bg-white space-y-2">
                    <p className="font-bold text-zinc-800">DTI Matrix Limits</p>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>DTI &lt; 15%</span>
                      <span className="font-bold text-emerald-600">100 Pts</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>15% - 30%</span>
                      <span className="font-bold text-blue-600">75 Pts</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>30% - 40%</span>
                      <span className="font-bold text-yellow-600">50 Pts</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-start p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-600 leading-normal">
                    AI recommendation: Keep credit utilization below 30%. Consider prepaying high-interest personal loans to reduce DTI down below 15%.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pillar 3: Emergency Fund */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleExpanded("Emergency")}
              className="flex w-full items-center justify-between p-5 text-left outline-none hover:bg-zinc-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">20%</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Emergency Fund Coverage</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Coverage: {monthsCovered} Months • Score: {emergencyScore}/100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-emerald-600">Ideal</span>
                {expandedPillar === "Emergency" ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
              </div>
            </button>
            
            {expandedPillar === "Emergency" && (
              <div className="px-5 pb-5 border-t border-zinc-100 bg-zinc-50/30 p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-zinc-700">
                        <span>Current Emergency Reserves:</span>
                        <span className="font-bold text-zinc-900">{formatCurrency(emergencyFund)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="10000"
                        value={emergencyFund}
                        onChange={(e) => setEmergencyFund(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-zinc-700">
                        <span>Assumed Monthly Expenses:</span>
                        <span className="font-bold text-zinc-900">{formatCurrency(expenses)}</span>
                      </div>
                      <input
                        type="range"
                        min="20000"
                        max="100000"
                        step="5000"
                        value={expenses}
                        onChange={(e) => setExpenses(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-150 bg-white space-y-2">
                    <p className="font-bold text-zinc-800">Coverage Matrix</p>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>&ge; 6 Months</span>
                      <span className="font-bold text-emerald-600">100 Pts</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>3 - 6 Months</span>
                      <span className="font-bold text-blue-600">75 Pts</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>1 - 3 Months</span>
                      <span className="font-bold text-yellow-600">40 Pts</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-start p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-600 leading-normal">
                    AI recommendation: Save {formatCurrency(Math.max((expenses * 6) - emergencyFund, 0))} more to reach your ideal six-month emergency fund buffer.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pillar 4: Spending Control */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleExpanded("Spending")}
              className="flex w-full items-center justify-between p-5 text-left outline-none hover:bg-zinc-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">15%</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Spending Control</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Budget Utilized: {budgetUtilization}% • Score: {spendingScore}/100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-emerald-600"> disciplined</span>
                {expandedPillar === "Spending" ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
              </div>
            </button>
            
            {expandedPillar === "Spending" && (
              <div className="px-5 pb-5 border-t border-zinc-100 bg-zinc-50/30 p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-zinc-700">
                        <span>Actual Monthly Expenses:</span>
                        <span className="font-bold text-zinc-900">{formatCurrency(spending)}</span>
                      </div>
                      <input
                        type="range"
                        min="20000"
                        max="100000"
                        step="2000"
                        value={spending}
                        onChange={(e) => setSpending(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-150 bg-white space-y-2">
                    <p className="font-bold text-zinc-800">Budget Variance Matrix</p>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>Utilized &le; 80%</span>
                      <span className="font-bold text-emerald-600">100 Pts</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>80% - 100%</span>
                      <span className="font-bold text-blue-600">75 Pts</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>100% - 110%</span>
                      <span className="font-bold text-yellow-600">40 Pts</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-start p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-600 leading-normal">
                    AI recommendation: Restrict dining out and entertainment bills during the final week of the month to keep total spending below {formatCurrency(budget * 0.8)}.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pillar 5: Investment Ratio */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleExpanded("Investment")}
              className="flex w-full items-center justify-between p-5 text-left outline-none hover:bg-zinc-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">10%</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Investment Ratio</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Ratio: {investmentRatio}% • Score: {investmentScore}/100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-emerald-600">Target Match</span>
                {expandedPillar === "Investment" ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
              </div>
            </button>
            
            {expandedPillar === "Investment" && (
              <div className="px-5 pb-5 border-t border-zinc-100 bg-zinc-50/30 p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-zinc-700">
                        <span>Monthly Investments:</span>
                        <span className="font-bold text-zinc-900">{formatCurrency(investments)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="2000"
                        value={investments}
                        onChange={(e) => setInvestments(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-150 bg-white space-y-2">
                    <p className="font-bold text-zinc-800">Ratio Matrix</p>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>Ratio &ge; 20%</span>
                      <span className="font-bold text-emerald-600">100 Pts</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>10% - 20%</span>
                      <span className="font-bold text-blue-600">75 Pts</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>5% - 10%</span>
                      <span className="font-bold text-yellow-600">50 Pts</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-start p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-600 leading-normal">
                    AI recommendation: Automate high-yield index mutual funds or SIP allocations to achieve a robust 20%+ investment yield ratio.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pillar 6: Bill Punctuality */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleExpanded("Bills")}
              className="flex w-full items-center justify-between p-5 text-left outline-none hover:bg-zinc-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">10%</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Bill Payment Punctuality</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">On-Time: {punctuality}% • Score: {billScore}/100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-emerald-600">Punctual</span>
                {expandedPillar === "Bills" ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
              </div>
            </button>
            
            {expandedPillar === "Bills" && (
              <div className="px-5 pb-5 border-t border-zinc-100 bg-zinc-50/30 p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-zinc-700">
                        <span>On-time paid bill items:</span>
                        <span className="font-bold text-zinc-900">{onTimePayments} / {totalPayments}</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max={totalPayments}
                        step="1"
                        value={onTimePayments}
                        onChange={(e) => setOnTimePayments(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-150 bg-white space-y-2">
                    <p className="font-bold text-zinc-800">Reliability Matrix</p>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>100% On-time</span>
                      <span className="font-bold text-emerald-600">100 Pts</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>95% - 99%</span>
                      <span className="font-bold text-blue-600">80 Pts</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>90% - 94%</span>
                      <span className="font-bold text-yellow-600">60 Pts</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-start p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-600 leading-normal">
                    AI recommendation: Enable Auto-Pay settings or auto-sms reminders to secure a flawless 100% score under punctuality checks.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* AI Recommendations Panel (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 text-zinc-800">
              <Sparkles className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
              <h3 className="text-sm font-bold">AI Action recommendations</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 border border-zinc-100 bg-zinc-50/30 rounded-xl relative">
                <span className="absolute top-2 right-2 text-[10px] font-black text-emerald-600">+8 Pts potential</span>
                <p className="font-bold text-zinc-900">Build Safety Capital</p>
                <p className="text-[11px] text-zinc-600 mt-1 leading-normal">
                  Increase emergency fund by {formatCurrency(120000)} to fully cover 6 months expenses.
                </p>
              </div>

              <div className="p-3 border border-zinc-100 bg-zinc-50/30 rounded-xl relative">
                <span className="absolute top-2 right-2 text-[10px] font-black text-emerald-600">+5 Pts potential</span>
                <p className="font-bold text-zinc-900">Adjust Savings rate</p>
                <p className="text-[11px] text-zinc-600 mt-1 leading-normal">
                  Increase savings allocations from {savingsRate}% to 30%.
                </p>
              </div>

              <div className="p-3 border border-zinc-100 bg-zinc-50/30 rounded-xl relative">
                <span className="absolute top-2 right-2 text-[10px] font-black text-emerald-600">+4 Pts potential</span>
                <p className="font-bold text-zinc-900">Prepay Personal Loans</p>
                <p className="text-[11px] text-zinc-600 mt-1 leading-normal">
                  Reduce outstanding balance under high-interest loans to drop DTI below 15%.
                </p>
              </div>
            </div>
          </div>

          {/* Formula Guide */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1">
              <Info className="h-4 w-4 text-zinc-400" /> Score Formula Guide
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Overall score is compiled transparently by weighing individual pillars:
            </p>
            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 text-[10px] font-bold text-zinc-700 leading-relaxed font-mono">
              Score = Savings*0.25 + DTI*0.20 + Emergency*0.20 + Spending*0.15 + Investment*0.10 + Punctuality*0.10
            </div>
          </div>
        </div>

      </div>

      {/* 5. Historical Trend Analytics */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Historical Health Progress</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Overall financial wellness score progress trends</p>
          </div>
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
            <button className="text-[10px] font-semibold px-2.5 py-1 rounded bg-white text-zinc-900 shadow-sm">6M</button>
            <button className="text-[10px] font-semibold px-2.5 py-1 rounded text-zinc-500 hover:text-zinc-900">1Y</button>
          </div>
        </div>
        <div className="relative h-44 w-full">
          <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <path d="M 0 80 Q 80 60, 160 65 T 320 40 T 400 30 L 400 100 L 0 100 Z" fill="#eff6ff" opacity="0.6" />
            <path d="M 0 80 Q 80 60, 160 65 T 320 40 T 400 30" fill="none" stroke="#2563eb" strokeWidth="2" />
            <circle cx="160" cy="65" r="3.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="400" cy="30" r="3.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold mt-4">
          <span>Dec</span>
          <span>Jan</span>
          <span>Feb (Score: 73)</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May (Score: 78)</span>
        </div>
      </div>

    </div>
  );
}
