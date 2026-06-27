"use client";

import * as React from "react";
import {
  TrendingDown,
  Sliders,
  Eye,
  CreditCard,
  CalendarClock,
  TrendingUp,
  Plus,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  PieChart,
  Activity,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MoneyFlowView() {
  // Budget Limit Simulator
  const [budgetLimit, setBudgetLimit] = React.useState(6000); // Slider for budget limit
  const currentTotalSpending = 4850;
  const budgetUtilization = Math.round((currentTotalSpending / budgetLimit) * 100);

  // Income Simulator state for next month prediction
  const [extraFreelanceIncome, setExtraFreelanceIncome] = React.useState(1800);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950">Money Flow</h2>
          <p className="text-sm text-zinc-500 mt-1">Monitor your cash flow, optimize spending, and improve financial discipline.</p>
        </div>
        <Button className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-semibold transition-all active:scale-[0.98]">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Transaction
        </Button>
      </div>

      {/* Main 12-Column Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ==========================================
            1. Spending Card (6 Columns)
            ========================================== */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button className="text-xs text-zinc-400 font-semibold hover:text-zinc-600 transition-colors">+ Add Expense</button>
              <span className="text-zinc-200">|</span>
              <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center">
                Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-zinc-900">Spending</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Track and categorize historical cash outflows</p>
          </div>

          <div className="my-5">
            <p className="text-3xl font-extrabold tracking-tight text-zinc-900">{formatCurrency(currentTotalSpending)}</p>
            <p className="text-xs mt-1 text-zinc-500">Total spent this calendar month</p>
          </div>

          {/* Allocation Details */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-2">Outflow Distribution</p>
              
              <div className="h-3.5 w-full bg-zinc-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-red-500" style={{ width: "31%" }} title="Rent/Mortgage (31%)" />
                <div className="h-full bg-orange-400" style={{ width: "25%" }} title="Food & Groceries (25%)" />
                <div className="h-full bg-yellow-500" style={{ width: "18%" }} title="Shopping (18%)" />
                <div className="h-full bg-blue-500" style={{ width: "12%" }} title="Travel (12%)" />
                <div className="h-full bg-zinc-400" style={{ width: "14%" }} title="Entertainment & Utilities (14%)" />
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-[9px] text-zinc-400 font-bold mt-2">
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Rent</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-orange-400" /> Food</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> Shop</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-50" /> Travel</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-zinc-400" /> Misc</span>
              </div>
            </div>

            {/* Merchant info & Anomaly Detection */}
            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Top Merchants</p>
                <div className="space-y-1 mt-1 font-semibold text-zinc-800">
                  <div className="flex justify-between">
                    <span>Amazon</span>
                    <span>$850</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Whole Foods</span>
                    <span>$420</span>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl bg-red-50/50 p-3 border border-red-100/50">
                <div className="flex items-center gap-1 text-red-600 mb-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold">Anomaly Alert</span>
                </div>
                <p className="text-[10px] text-zinc-600 leading-tight">
                  Grocery spending ($420) is 20% higher than your trailing 3-month average.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            2. Budgets Card (6 Columns)
            ========================================== */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Sliders className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button className="text-xs text-zinc-400 font-semibold hover:text-zinc-600 transition-colors">+ Add Budget</button>
              <span className="text-zinc-200">|</span>
              <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center">
                Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-zinc-900">Budgets</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Control spending using active category allocations</p>
          </div>

          {/* Interactive Budget Limit Slider */}
          <div className="my-5 bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-700">
              <span>Monthly Budget Cap Limit:</span>
              <span className="text-blue-600 font-bold">{formatCurrency(budgetLimit)}</span>
            </div>
            <input
              type="range"
              min="4000"
              max="8000"
              step="250"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-1 font-semibold">
              <span>Utilization rate: {budgetUtilization}%</span>
              <span>Remaining: {formatCurrency(Math.max(budgetLimit - currentTotalSpending, 0))}</span>
            </div>
          </div>

          {/* Budget Progress bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-800 mb-1">
                <span>Food & Groceries ($1,275 / $1,500)</span>
                <span className="text-amber-600 font-bold">85% Utilized</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: "85%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-800 mb-1">
                <span>Entertainment & Dinout ($520 / $500)</span>
                <span className="text-red-600 font-bold">104% Exceeded!</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: "100%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-800 mb-1">
                <span>Transport & Travel ($360 / $600)</span>
                <span className="text-emerald-600 font-bold">60% Utilized</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            3. Insights Card (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center">
                View Insights <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-zinc-900">AI Insights</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Financial behavioral indices & forecast analysis</p>
          </div>

          {/* Core Insights Metrics */}
          <div className="my-5 grid grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Savings Rate</span>
              <p className="text-xl font-bold text-zinc-900 mt-0.5">62%</p>
              <span className="text-[10px] text-emerald-600 font-semibold">High stability</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Behavior Score</span>
              <p className="text-xl font-bold text-zinc-900 mt-0.5">85/100</p>
              <span className="text-[10px] text-blue-600 font-semibold">Excellent index</span>
            </div>
          </div>

          {/* Text based recommendations & forecasts */}
          <div className="space-y-4 pt-4 border-t border-zinc-100 text-xs">
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Personalized Opportunities</p>
              <div className="flex items-start gap-2 text-zinc-700">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Cancel unused SaaS subscriptions to save $84/mo.</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-700">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Consolidate credit balances to reduce interest costs.</span>
              </div>
            </div>

            <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-100">
              <span className="text-[10px] font-bold text-zinc-400">Next Month Projection</span>
              <p className="font-bold text-zinc-800 mt-0.5">Forecasted outflow: $4,750</p>
            </div>
          </div>
        </div>

        {/* ==========================================
            4. Credit Card Management Card (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button className="text-xs text-zinc-400 font-semibold hover:text-zinc-600 transition-colors">+ Add Card</button>
              <span className="text-zinc-200">|</span>
              <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center">
                Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-zinc-900">Credit Cards</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Outstanding limits and due dates summary</p>
          </div>

          {/* Aggregated Credit metrics */}
          <div className="my-5 flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold tracking-tight text-zinc-900">$3,570</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Total Outstanding Balance</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-zinc-700">35% Utilization</p>
              <div className="h-1.5 w-20 bg-zinc-100 rounded-full overflow-hidden mt-1 inline-block">
                <div className="h-full bg-blue-600" style={{ width: "35%" }} />
              </div>
            </div>
          </div>

          {/* Credit card list */}
          <div className="space-y-3 pt-4 border-t border-zinc-100 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
              <div>
                <p className="font-bold text-zinc-900">Amex Gold</p>
                <p className="text-[9px] text-zinc-400 mt-0.5">Due Jul 14 • Min $40</p>
              </div>
              <span className="font-bold text-zinc-800">$2,450</span>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
              <div>
                <p className="font-bold text-zinc-900">Chase Sapphire</p>
                <p className="text-[9px] text-zinc-400 mt-0.5">Due Jul 10 • Min $35</p>
              </div>
              <span className="font-bold text-zinc-800">$1,120</span>
            </div>

            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-semibold pt-1">
              <span>Total Rewards Points:</span>
              <span className="text-blue-600 font-bold">127,000 pts ($1,270 value)</span>
            </div>
          </div>
        </div>

        {/* ==========================================
            5. Recurring Bills & Subscriptions (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button className="text-xs text-zinc-400 font-semibold hover:text-zinc-600 transition-colors">+ Add Bill</button>
              <span className="text-zinc-200">|</span>
              <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center">
                Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-zinc-900">Recurring Bills</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Active subscriptions and renewal timelines</p>
          </div>

          <div className="my-5">
            <p className="text-2xl font-bold tracking-tight text-zinc-900">$340 / mo</p>
            <p className="text-xs mt-1 text-zinc-500">Across 6 active recurring subscriptions</p>
          </div>

          {/* Subscriptions list and warnings */}
          <div className="space-y-3.5 pt-4 border-t border-zinc-100 text-xs">
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Upcoming Renewals</p>
              <div className="flex justify-between">
                <span className="text-zinc-500">Netflix:</span>
                <span className="font-semibold text-zinc-900">Jul 05 • $20.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Spotify Family:</span>
                <span className="font-semibold text-zinc-900">Jul 12 • $17.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Notion Pro:</span>
                <span className="font-semibold text-zinc-900">Jul 18 • $10.00</span>
              </div>
            </div>

            {/* Unused detection alert */}
            <div className="rounded-xl bg-blue-50/50 p-3 border border-blue-100/50 flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-600 leading-tight font-medium">
                We detected zero logins to Acrobat Pro ($20/mo) in the last 60 days. Cancel to optimize cash reserves.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            6. Income Card (12 Columns)
            ========================================== */}
        <div className="lg:col-span-12 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button className="text-xs text-zinc-400 font-semibold hover:text-zinc-600 transition-colors">+ Add Income</button>
              <span className="text-zinc-200">|</span>
              <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center">
                Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-zinc-900">Income</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Salary streams, dividends, and passive revenue cash flows</p>
          </div>

          {/* Dynamic salary summary */}
          <div className="my-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-zinc-900">
                {formatCurrency(9500 + extraFreelanceIncome + 1000 + 500)}
              </p>
              <p className="text-xs mt-1 text-zinc-500">Simulated monthly intake across all active categories</p>
            </div>
            
            {/* Interactive slide contribution simulator */}
            <div className="w-full md:w-80 bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-700">
                <span>Freelance / Secondary Outflow Income:</span>
                <span className="text-blue-600 font-bold">{formatCurrency(extraFreelanceIncome)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="200"
                value={extraFreelanceIncome}
                onChange={(e) => setExtraFreelanceIncome(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Multi stream breakdowns and SVG trend chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-zinc-100">
            {/* Diversification lists */}
            <div className="lg:col-span-5 space-y-3 text-xs">
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Diversification Analysis</p>
              
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                <span className="font-semibold text-zinc-800">Primary Salary:</span>
                <span className="font-bold text-zinc-900">$9,500</span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                <span className="font-semibold text-zinc-800">Freelance Portfolio Client:</span>
                <span className="font-bold text-zinc-900">{formatCurrency(extraFreelanceIncome)}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                <span className="font-semibold text-zinc-800">Dividends & Capital yields:</span>
                <span className="font-bold text-zinc-900">$1,000</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                <span className="font-semibold text-zinc-800">Rental Passive Yield:</span>
                <span className="font-bold text-zinc-900">$500</span>
              </div>
            </div>

            {/* Income Stability mini SVG chart */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-2">Payout stability index</p>
                <div className="h-32 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <path
                      d="M 0 80 Q 50 60, 100 70 T 200 40 T 300 30 L 300 100 L 0 100 Z"
                      fill="#e0f2fe"
                      opacity="0.5"
                    />
                    <path
                      d="M 0 80 Q 50 60, 100 70 T 200 40 T 300 30"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2"
                    />
                    <circle cx="300" cy="30" r="3" fill="#0284c7" />
                  </svg>
                </div>
              </div>
              
              <div className="rounded-xl bg-blue-50/50 p-3 border border-blue-100/50 text-xs">
                <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-bold">AI Cash Flow Tip</span>
                </div>
                <p className="text-[11px] text-zinc-600">
                  Investing 20% of freelance earnings into high-yield dividend funds can increase passive inflow by $80/mo over 12 months.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
