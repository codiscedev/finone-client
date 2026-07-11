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
  Check,
  Search,
  ChevronLeft,
  Trash2,
  Filter,
  SlidersHorizontal,
  FolderSync
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import TransactionOnboardingDrawer from "./transaction-onboarding-drawer";

// Initial Mock Transactions
const INITIAL_TRANSACTIONS = [
  { id: "init_1", date: "2026-07-10", amount: 850.00, merchant: "Amazon Inc", category: "Shopping", description: "Office items and supplies", type: "expense", account: "Amex Gold (*1002)", paymentMethod: "Credit Card", tags: ["office", "supplies"] },
  { id: "init_2", date: "2026-07-10", amount: 420.00, merchant: "Whole Foods Market", category: "Groceries", description: "Bi-weekly grocery restock", type: "expense", account: "Chase checking (*4829)", paymentMethod: "Debit Card", tags: ["grocery"] },
  { id: "init_3", date: "2026-07-09", amount: 20.00, merchant: "Netflix.com", category: "Entertainment", description: "Monthly standard subscription renewal", type: "expense", account: "Amex Gold (*1002)", paymentMethod: "Credit Card", tags: ["subscription"] },
  { id: "init_4", date: "2026-07-08", amount: 9500.00, merchant: "Acme Corp Salary", category: "Salary", description: "Primary direct deposit salary credit", type: "income", account: "Chase checking (*4829)", paymentMethod: "Net Banking", tags: ["salary"] },
  { id: "init_5", date: "2026-07-08", amount: 1000.00, merchant: "Robinhood Dividends", category: "Dividend", description: "Quarterly stock yields payout", type: "income", account: "Chase checking (*4829)", paymentMethod: "Net Banking", tags: ["dividends"] },
  { id: "init_6", date: "2026-07-07", amount: 1500.00, merchant: "Metropolitan Landlord", category: "Rent", description: "Monthly apartment rental lease payment", type: "expense", account: "Chase checking (*4829)", paymentMethod: "Net Banking", tags: ["rent"] },
  { id: "init_7", date: "2026-07-06", amount: 500.00, merchant: "Sublet Rental Yield", category: "Rental Income", description: "Apartment room sub-rental payout", type: "income", account: "Capital One Wallet", paymentMethod: "UPI / Instant Pay", tags: ["rental", "passive"] },
  { id: "init_8", date: "2026-07-05", amount: 580.00, merchant: "United Airlines Flight", category: "Travel", description: "Weekend flight booking trip", type: "expense", account: "Chase Sapphire (*9930)", paymentMethod: "Credit Card", tags: ["travel"] },
  { id: "init_9", date: "2026-07-04", amount: 1800.00, merchant: "Fiverr Freelance Inward", category: "Freelance", description: "React UI Dashboard consultant project", type: "income", account: "Chase checking (*4829)", paymentMethod: "Net Banking", tags: ["freelance", "ui"] },
  { id: "init_10", date: "2026-07-03", amount: 35.50, merchant: "Uber Rides", category: "Transportation", description: "Travel to corporate meeting", type: "expense", account: "Chase Sapphire (*9930)", paymentMethod: "Credit Card", tags: ["travel", "taxi"] }
];

export default function MoneyFlowView() {
  // Navigation: Sub tabs
  const [activeSubTab, setActiveSubTab] = React.useState<"transactions" | "analytics">("transactions");

  // Onboarding Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [drawerMode, setDrawerMode] = React.useState<"manual" | "import" | null>(null);

  // Transactions State
  const [transactions, setTransactions] = React.useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("finone_transactions");
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    }
    return INITIAL_TRANSACTIONS;
  });

  // Persist Transactions
  React.useEffect(() => {
    localStorage.setItem("finone_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Budget Limit Simulator (Analytics Tab)
  const [budgetLimit, setBudgetLimit] = React.useState(6000);
  // Income Simulator Freelance state (Analytics Tab)
  const [extraFreelanceIncome, setExtraFreelanceIncome] = React.useState(1800);

  // Filters State
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [accountFilter, setAccountFilter] = React.useState<string>("all");

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  // Derived Values - Expenses & Income
  const expensesList = React.useMemo(() => transactions.filter(t => t.type === "expense"), [transactions]);
  const incomeList = React.useMemo(() => transactions.filter(t => t.type === "income"), [transactions]);

  const totalSpending = React.useMemo(() => {
    return expensesList.reduce((sum, t) => sum + t.amount, 0);
  }, [expensesList]);

  const totalIncomeVal = React.useMemo(() => {
    return incomeList.reduce((sum, t) => sum + t.amount, 0);
  }, [incomeList]);

  // Spending Distributions (dynamic calculation for distribution bar)
  const distribution = React.useMemo(() => {
    if (totalSpending === 0) return { Rent: 0, Food: 0, Shopping: 0, Travel: 0, Misc: 0 };
    
    let rent = 0;
    let food = 0;
    let shopping = 0;
    let travel = 0;
    let misc = 0;

    expensesList.forEach(t => {
      if (t.category === "Rent" || t.category === "EMI") rent += t.amount;
      else if (t.category === "Food & Dining" || t.category === "Groceries") food += t.amount;
      else if (t.category === "Shopping" || t.category === "Entertainment") shopping += t.amount;
      else if (t.category === "Travel" || t.category === "Transportation" || t.category === "Fuel") travel += t.amount;
      else misc += t.amount;
    });

    return {
      Rent: Math.round((rent / totalSpending) * 100),
      Food: Math.round((food / totalSpending) * 100),
      Shopping: Math.round((shopping / totalSpending) * 100),
      Travel: Math.round((travel / totalSpending) * 100),
      Misc: Math.round((misc / totalSpending) * 100)
    };
  }, [expensesList, totalSpending]);

  // Top Merchants Calculation
  const topMerchants = React.useMemo(() => {
    const merchantMap: Record<string, number> = {};
    expensesList.forEach(t => {
      merchantMap[t.merchant] = (merchantMap[t.merchant] || 0) + t.amount;
    });

    return Object.entries(merchantMap)
      .map(([name, val]) => ({ name, value: val }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 2);
  }, [expensesList]);

  // Dynamic budget category totals
  const budgetUtilization = Math.round((totalSpending / budgetLimit) * 100);

  const budgetCategoryTotals = React.useMemo(() => {
    let food = 0;
    let travel = 0;
    let entertainment = 0;

    expensesList.forEach(t => {
      if (t.category === "Food & Dining" || t.category === "Groceries") food += t.amount;
      else if (t.category === "Travel" || t.category === "Transportation" || t.category === "Fuel") travel += t.amount;
      else if (t.category === "Entertainment") entertainment += t.amount;
    });

    return { food, travel, entertainment };
  }, [expensesList]);

  // Handle new items import/add
  const handleImportTransactions = (newItems: any[]) => {
    setTransactions(prev => [...newItems, ...prev]);
  };

  // Delete transaction action
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Get unique categories and accounts for filter selectors
  const uniqueCategories = React.useMemo(() => {
    const set = new Set<string>();
    transactions.forEach(t => set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  const uniqueAccounts = React.useMemo(() => {
    const set = new Set<string>();
    transactions.forEach(t => set.add(t.account));
    return Array.from(set);
  }, [transactions]);

  // Filtered transactions list
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(t => {
      const matchSearch =
        t.merchant.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      
      const matchType = typeFilter === "all" ? true : t.type === typeFilter;
      const matchCategory = categoryFilter === "all" ? true : t.category === categoryFilter;
      const matchAccount = accountFilter === "all" ? true : t.account === accountFilter;

      return matchSearch && matchType && matchCategory && matchAccount;
    });
  }, [transactions, search, typeFilter, categoryFilter, accountFilter]);

  // Paginated Sliced Transactions
  const paginatedTransactions = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Sub Tab Navigation Menu */}
      <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab("transactions")}
            className={`h-9 px-4 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === "transactions"
                ? "bg-zinc-950 text-white shadow-xs"
                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
            }`}
          >
            Transactions Ledger
          </button>
          <button
            onClick={() => setActiveSubTab("analytics")}
            className={`h-9 px-4 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === "analytics"
                ? "bg-zinc-950 text-white shadow-xs"
                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
            }`}
          >
            Cash Flow & Budgets
          </button>
        </div>
        <div className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" /> AI Classification Active
        </div>
      </div>

      {/* ==========================================
          TAB 1: TRANSACTIONS LIST
          ========================================== */}
      {activeSubTab === "transactions" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950">Transactions</h2>
              <p className="text-sm text-zinc-500 mt-1">Manage your income and expenses from multiple sources.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                onClick={() => { setDrawerMode("import"); setIsDrawerOpen(true); }}
                variant="outline"
                className="flex-1 sm:flex-none h-10 px-4 rounded-xl border-zinc-250 font-semibold transition-all active:scale-[0.98] text-xs"
              >
                <FolderSync className="h-4 w-4 mr-1.5 text-zinc-500" />
                Import Transactions
              </Button>
              <Button
                onClick={() => { setDrawerMode("manual"); setIsDrawerOpen(true); }}
                className="flex-1 sm:flex-none h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-semibold transition-all active:scale-[0.98] text-xs"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Total Outflow</span>
              <p className="text-2xl font-extrabold tracking-tight text-red-600 mt-1">{formatCurrency(totalSpending)}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Spent across calendar transactions</p>
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Total Inward</span>
              <p className="text-2xl font-extrabold tracking-tight text-emerald-600 mt-1">{formatCurrency(totalIncomeVal)}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Direct salary & passive payouts</p>
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Net Position</span>
              <p className={`text-2xl font-extrabold tracking-tight mt-1 ${
                (totalIncomeVal - totalSpending) >= 0 ? "text-blue-600" : "text-amber-600"
              }`}>{formatCurrency(totalIncomeVal - totalSpending)}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Current month savings buffer</p>
            </div>
          </div>

          {/* Filters Panel */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-650">
              <Filter className="h-4 w-4 text-zinc-400" /> Filter Ledger Rows
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search merchant, notes..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full h-8.5 rounded-lg border border-zinc-200 px-3 pl-8 bg-white text-xs font-medium focus:border-blue-500 focus:outline-none"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              </div>

              {/* Type selector */}
              <div>
                <Select
                  value={typeFilter}
                  onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                  className="h-8.5 text-xs font-semibold"
                >
                  <option value="all">All Types</option>
                  <option value="expense">Expenses</option>
                  <option value="income">Income Streams</option>
                  <option value="transfer">Transfers</option>
                </Select>
              </div>

              {/* Category selector */}
              <div>
                <Select
                  value={categoryFilter}
                  onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                  className="h-8.5 text-xs font-semibold"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>

              {/* Account selector */}
              <div>
                <Select
                  value={accountFilter}
                  onChange={e => { setAccountFilter(e.target.value); setCurrentPage(1); }}
                  className="h-8.5 text-xs font-semibold"
                >
                  <option value="all">All Accounts</option>
                  {uniqueAccounts.map(a => <option key={a} value={a}>{a}</option>)}
                </Select>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-150 bg-zinc-50/50 font-bold text-zinc-500 select-none text-[10px] tracking-wider uppercase">
                    <th className="p-4 w-28">Date</th>
                    <th className="p-4">Merchant / Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Account / Wallet</th>
                    <th className="p-4 w-24">Type</th>
                    <th className="p-4 w-32 text-right">Amount</th>
                    <th className="p-4 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium text-zinc-800">
                  {paginatedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-zinc-400">
                        No transactions found matching active filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-zinc-50/30 transition-colors">
                        <td className="p-4 whitespace-nowrap text-zinc-500 font-mono">{t.date}</td>
                        <td className="p-4">
                          <div className="font-extrabold text-zinc-900">{t.merchant}</div>
                          <div className="text-[10px] text-zinc-400 truncate max-w-xs font-medium mt-0.5">{t.description}</div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                            {t.category}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-zinc-650">{t.account}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            t.type === "income"
                              ? "bg-emerald-50 text-emerald-700"
                              : t.type === "transfer"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-red-50 text-red-700"
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap font-bold text-zinc-955 text-sm">
                          <span className={t.type === "income" ? "text-emerald-600" : "text-zinc-900"}>
                            {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteTransaction(t.id)}
                            className="p-1 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
                            title="Delete transaction"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-zinc-150 bg-zinc-50/50 text-xs font-bold text-zinc-500">
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="h-8.5 rounded-lg text-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="h-8.5 rounded-lg text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: ANALYTICS & WIDGETS
          ========================================== */}
      {activeSubTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          
          {/* Heading */}
          <div className="lg:col-span-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950">Money Flow</h2>
              <p className="text-sm text-zinc-500 mt-1">Monitor your cash flow, optimize spending, and improve financial discipline.</p>
            </div>
            <Button
              onClick={() => { setDrawerMode("manual"); setIsDrawerOpen(true); }}
              className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-semibold transition-all active:scale-[0.98] text-xs"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Transaction
            </Button>
          </div>

          {/* Spending Card (6 Columns) */}
          <div className="lg:col-span-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-650">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setDrawerMode("manual"); setIsDrawerOpen(true); }}
                  className="text-xs text-zinc-400 font-bold hover:text-zinc-650 transition-colors cursor-pointer"
                >
                  + Add Expense
                </button>
                <span className="text-zinc-250">|</span>
                <button
                  onClick={() => setActiveSubTab("transactions")}
                  className="text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center cursor-pointer"
                >
                  Details <ChevronRight className="h-3 w-3 ml-0.5" />
                </button>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-bold text-zinc-900">Spending</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Track and categorize historical cash outflows</p>
            </div>

            <div className="my-5">
              <p className="text-3xl font-extrabold tracking-tight text-zinc-900">{formatCurrency(totalSpending)}</p>
              <p className="text-xs mt-1 text-zinc-500">Total spent this calendar month</p>
            </div>

            {/* Allocation Details */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-2">Outflow Distribution</p>
                
                <div className="h-3.5 w-full bg-zinc-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-red-500" style={{ width: `${Math.max(distribution.Rent, 5)}%` }} title={`Rent (${distribution.Rent}%)`} />
                  <div className="h-full bg-orange-400" style={{ width: `${Math.max(distribution.Food, 5)}%` }} title={`Food (${distribution.Food}%)`} />
                  <div className="h-full bg-yellow-500" style={{ width: `${Math.max(distribution.Shopping, 5)}%` }} title={`Shopping (${distribution.Shopping}%)`} />
                  <div className="h-full bg-blue-500" style={{ width: `${Math.max(distribution.Travel, 5)}%` }} title={`Travel (${distribution.Travel}%)`} />
                  <div className="h-full bg-zinc-400" style={{ width: `${Math.max(distribution.Misc, 5)}%` }} title={`Misc (${distribution.Misc}%)`} />
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-[9px] text-zinc-400 font-bold mt-2">
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Rent ({distribution.Rent}%)</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-orange-400" /> Food ({distribution.Food}%)</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> Shop ({distribution.Shopping}%)</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Travel ({distribution.Travel}%)</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-zinc-400" /> Misc ({distribution.Misc}%)</span>
                </div>
              </div>

              {/* Merchant info & Anomaly Detection */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Top Merchants</p>
                  <div className="space-y-1.5 mt-1 font-bold text-zinc-800">
                    {topMerchants.length === 0 ? (
                      <span className="text-[10px] text-zinc-400">No merchant logs</span>
                    ) : (
                      topMerchants.map(m => (
                        <div key={m.name} className="flex justify-between">
                          <span>{m.name}</span>
                          <span>{formatCurrency(m.value)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <div className="rounded-xl bg-red-50/50 p-3 border border-red-100/50">
                  <div className="flex items-center gap-1 text-red-655 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                    <span className="text-[10px] font-bold">Anomaly Alert</span>
                  </div>
                  <p className="text-[10px] text-zinc-650 leading-tight">
                    Food and grocery spending ({formatCurrency(budgetCategoryTotals.food)}) is higher than your trailing average.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Budgets Card (6 Columns) */}
          <div className="lg:col-span-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Sliders className="h-5 w-5" />
              </div>
              <div className="flex gap-2">
                <button className="text-xs text-zinc-400 font-bold hover:text-zinc-650 transition-colors">+ Add Budget</button>
                <span className="text-zinc-250">|</span>
                <button
                  onClick={() => setActiveSubTab("transactions")}
                  className="text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center cursor-pointer"
                >
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
                min="3000"
                max="10000"
                step="250"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-650"
              />
              <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-1 font-bold">
                <span>Utilization rate: {budgetUtilization}%</span>
                <span>Remaining: {formatCurrency(Math.max(budgetLimit - totalSpending, 0))}</span>
              </div>
            </div>

            {/* Budget Progress bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-zinc-800 mb-1">
                  <span>Food & Groceries ({formatCurrency(budgetCategoryTotals.food)} / $1,500)</span>
                  <span className={`font-bold text-[10px] ${
                    budgetCategoryTotals.food > 1500 ? "text-red-600" : "text-amber-600"
                  }`}>{Math.round((budgetCategoryTotals.food / 1500) * 100)}% Utilized</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${budgetCategoryTotals.food > 1500 ? "bg-red-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min((budgetCategoryTotals.food / 1500) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-zinc-800 mb-1">
                  <span>Entertainment & Dinout ({formatCurrency(budgetCategoryTotals.entertainment)} / $500)</span>
                  <span className={`font-bold text-[10px] ${
                    budgetCategoryTotals.entertainment > 500 ? "text-red-600" : "text-emerald-600"
                  }`}>{Math.round((budgetCategoryTotals.entertainment / 500) * 100)}% Utilized</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${budgetCategoryTotals.entertainment > 500 ? "bg-red-500" : "bg-emerald-500"}`}
                    style={{ width: `${Math.min((budgetCategoryTotals.entertainment / 500) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-zinc-800 mb-1">
                  <span>Transport & Travel ({formatCurrency(budgetCategoryTotals.travel)} / $600)</span>
                  <span className={`font-bold text-[10px] ${
                    budgetCategoryTotals.travel > 600 ? "text-red-655" : "text-emerald-600"
                  }`}>{Math.round((budgetCategoryTotals.travel / 600) * 100)}% Utilized</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${budgetCategoryTotals.travel > 600 ? "bg-red-500" : "bg-emerald-500"}`}
                    style={{ width: `${Math.min((budgetCategoryTotals.travel / 600) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Insights Card (4 Columns) */}
          <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div className="flex gap-2">
                <button className="text-xs text-blue-650 font-bold hover:text-blue-700 transition-colors flex items-center cursor-pointer">
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
                <p className="text-xl font-bold text-zinc-900 mt-0.5">
                  {totalIncomeVal > 0 ? Math.round(((totalIncomeVal - totalSpending) / totalIncomeVal) * 100) : 0}%
                </p>
                <span className="text-[10px] text-emerald-600 font-bold">Stable margin</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Behavior Score</span>
                <p className="text-xl font-bold text-zinc-900 mt-0.5">88/100</p>
                <span className="text-[10px] text-blue-655 font-bold">Excellent index</span>
              </div>
            </div>

            {/* Text based recommendations & forecasts */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 text-xs">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Personalized Opportunities</p>
                <div className="flex items-start gap-2 text-zinc-650">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Cancel unused SaaS subscriptions to save $84/mo.</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-650">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Consolidate credit balances to reduce interest costs.</span>
                </div>
              </div>

              <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-100">
                <span className="text-[10px] font-bold text-zinc-400">Next Month Projection</span>
                <p className="font-bold text-zinc-800 mt-0.5">Forecasted outflow: $4,200</p>
              </div>
            </div>
          </div>

          {/* Credit Card Management Card (4 Columns) */}
          <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex gap-2">
                <button className="text-xs text-zinc-400 font-bold hover:text-zinc-600 transition-colors">+ Add Card</button>
                <span className="text-zinc-250">|</span>
                <button className="text-xs text-blue-605 font-bold hover:text-blue-700 transition-colors flex items-center cursor-pointer">
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

              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold pt-1">
                <span>Total Rewards Points:</span>
                <span className="text-blue-600 font-bold">127,000 pts ($1,270 value)</span>
              </div>
            </div>
          </div>

          {/* Recurring Bills & Subscriptions (4 Columns) */}
          <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div className="flex gap-2">
                <button className="text-xs text-zinc-400 font-bold hover:text-zinc-600 transition-colors">+ Add Bill</button>
                <span className="text-zinc-250">|</span>
                <button className="text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center cursor-pointer">
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
                <Sparkles className="h-4 w-4 text-blue-605 shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-650 leading-tight font-medium">
                  We detected zero logins to Acrobat Pro ($20/mo) in the last 60 days. Cancel to optimize cash reserves.
                </p>
              </div>
            </div>
          </div>

          {/* Income Card (12 Columns) */}
          <div className="lg:col-span-12 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-650">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setDrawerMode("manual"); setIsDrawerOpen(true); }}
                  className="text-xs text-zinc-400 font-bold hover:text-zinc-600 transition-colors cursor-pointer"
                >
                  + Add Income
                </button>
                <span className="text-zinc-250">|</span>
                <button
                  onClick={() => setActiveSubTab("transactions")}
                  className="text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center cursor-pointer"
                >
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
                  {formatCurrency(totalIncomeVal + extraFreelanceIncome)}
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
                  <span className="font-bold text-zinc-800">Primary Salary:</span>
                  <span className="font-extrabold text-zinc-900">
                    {formatCurrency(incomeList.filter(t => t.category === "Salary").reduce((sum, t) => sum + t.amount, 0))}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="font-bold text-zinc-800">Freelance Portfolio (Simulated):</span>
                  <span className="font-extrabold text-zinc-900">{formatCurrency(extraFreelanceIncome)}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="font-bold text-zinc-800">Dividends & Capital yields:</span>
                  <span className="font-extrabold text-zinc-900">
                    {formatCurrency(incomeList.filter(t => t.category === "Dividend" || t.category === "Interest" || t.category === "Capital Gains").reduce((sum, t) => sum + t.amount, 0))}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="font-bold text-zinc-800">Rental Passive Yield:</span>
                  <span className="font-extrabold text-zinc-900">
                    {formatCurrency(incomeList.filter(t => t.category === "Rental Income").reduce((sum, t) => sum + t.amount, 0))}
                  </span>
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
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="font-bold">AI Cash Flow Tip</span>
                  </div>
                  <p className="text-[11px] text-zinc-650">
                    Investing 20% of freelance earnings into high-yield dividend funds can increase passive inflow by $80/mo over 12 months.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Transaction Onboarding Slider Drawer */}
      <TransactionOnboardingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onImport={handleImportTransactions}
        initialMode={drawerMode}
      />

    </div>
  );
}
