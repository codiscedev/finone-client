"use client";

import * as React from "react";
import {
  TrendingDown,
  TrendingUp,
  Plus,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  PieChart,
  CreditCard,
  CalendarClock,
  Sliders,
  Activity,
  Search,
  Trash2,
  Filter,
  SlidersHorizontal,
  FolderSync,
  MessageSquare,
  Tag,
  X,
  ChevronDown,
  ArrowUpDown,
  BarChart3,
  Info,
  Calendar,
  Edit2,
  Check,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import TransactionOnboardingDrawer from "./transaction-onboarding-drawer";
import TransactionImportWizard from "./transaction-import-wizard";
import CreditCardAddDrawer from "./credit-card-add-drawer";
import BudgetAddDrawer from "./budget-add-drawer";
import RecurringBillAddDrawer from "./recurring-bill-add-drawer";
import IncomeAddDrawer from "./income-add-drawer";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/use-currency";
import { apiClient } from "@/lib/api";
import ReviewQueueDrawer from "./review-queue-drawer";
import SmsAppModal from "./sms-app-modal";
import { ProFeatureGuard } from "@/components/licensing/pro-feature-guard";

// ============================================================
// TYPES
// ============================================================
interface Transaction {
  id: string;
  date: string;
  amount: number;
  merchant: string;
  category: string;
  subcategory?: string;
  description: string;
  type: "expense" | "income" | "transfer";
  paymentMethod: string;
  tags?: string[];
  referenceId?: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: { name: string; priority: "High" | "Medium" | "Low" }[];
  maxCap: number;
  description: string;
  color: string;
}

interface RecurringBill {
  id: string;
  name: string;
  dateOfDebit: string;
  amount: number;
  frequency: "Daily" | "Monthly" | "Yearly";
  category: string;
  subcategory: string;
  paymentMethod: string;
}

interface BudgetItem {
  id: string;
  name: string;
  budgetAmount: number;
  category: string;
}

interface IncomeItem {
  id: string;
  source: string;
  amount: number;
  fetchType: "Manual" | "Auto" | string;
  dateOfCredit: string;
  isFixed: boolean;
  isDuplicate?: boolean;
  duplicateReason?: string;
}

interface CreditCardItem {
  id: string;
  cardName: string;
  lastFour: string;
  creditLimit: number;
  outstanding: number;
  minDue: number;
  dueDate: string;
}

// ============================================================
// SEED DATA
// ============================================================
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "init_1", date: "2026-07-10", amount: 8500, merchant: "Amazon India", category: "Shopping", subcategory: "Electronics", description: "Office items and supplies", type: "expense", paymentMethod: "Credit Card", referenceId: "AMZ-9820", tags: ["office"] },
  { id: "init_2", date: "2026-07-10", amount: 4200, merchant: "Big Bazaar", category: "Groceries", subcategory: "Food", description: "Bi-weekly grocery restock", type: "expense", paymentMethod: "Debit Card", tags: ["grocery"] },
  { id: "init_3", date: "2026-07-09", amount: 199, merchant: "Netflix India", category: "Entertainment", subcategory: "Streaming", description: "Monthly standard subscription", type: "expense", paymentMethod: "Credit Card", referenceId: "NF-00291", tags: ["subscription"] },
  { id: "init_4", date: "2026-07-08", amount: 95000, merchant: "Infosys Payroll", category: "Salary", subcategory: "Primary", description: "Primary direct deposit salary credit", type: "income", paymentMethod: "Net Banking", tags: ["salary"] },
  { id: "init_5", date: "2026-07-08", amount: 10000, merchant: "Zerodha Dividends", category: "Dividend", subcategory: "Equity", description: "Quarterly stock yields payout", type: "income", paymentMethod: "Net Banking", tags: ["dividends"] },
  { id: "init_6", date: "2026-07-07", amount: 15000, merchant: "Prestige Properties", category: "Rent", subcategory: "Housing", description: "Monthly apartment rental lease payment", type: "expense", paymentMethod: "Net Banking", tags: ["rent"] },
  { id: "init_7", date: "2026-07-06", amount: 5000, merchant: "Sublet Rental Yield", category: "Rental Income", subcategory: "Passive", description: "Apartment room sub-rental payout", type: "income", paymentMethod: "UPI", tags: ["rental", "passive"] },
  { id: "init_8", date: "2026-07-05", amount: 5800, merchant: "IndiGo Airlines", category: "Travel", subcategory: "Flights", description: "Weekend flight booking trip", type: "expense", paymentMethod: "Credit Card", tags: ["travel"] },
  { id: "init_9", date: "2026-07-04", amount: 18000, merchant: "Fiverr Freelance", category: "Freelance", subcategory: "UI Design", description: "React UI Dashboard consultant project", type: "income", paymentMethod: "Net Banking", tags: ["freelance"] },
  { id: "init_10", date: "2026-07-03", amount: 350, merchant: "Ola Cabs", category: "Transportation", subcategory: "Taxi", description: "Travel to corporate meeting", type: "expense", paymentMethod: "UPI", tags: ["travel", "taxi"] },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: "cat_1", name: "Shopping", subcategories: [{ name: "Electronics", priority: "Low" }, { name: "Clothing", priority: "Medium" }], maxCap: 10000, description: "General shopping", color: "#f59e0b" },
  { id: "cat_2", name: "Groceries", subcategories: [{ name: "Food", priority: "High" }, { name: "Vegetables", priority: "High" }], maxCap: 8000, description: "Essential groceries", color: "#10b981" },
  { id: "cat_3", name: "Entertainment", subcategories: [{ name: "Streaming", priority: "Low" }, { name: "Movies", priority: "Low" }], maxCap: 2000, description: "Entertainment & fun", color: "#8b5cf6" },
  { id: "cat_4", name: "Travel", subcategories: [{ name: "Flights", priority: "Medium" }, { name: "Hotels", priority: "Medium" }], maxCap: 15000, description: "Travel & commute", color: "#3b82f6" },
  { id: "cat_5", name: "Rent", subcategories: [{ name: "Housing", priority: "High" }], maxCap: 20000, description: "Housing rent", color: "#ef4444" },
  { id: "cat_6", name: "Transportation", subcategories: [{ name: "Taxi", priority: "Medium" }, { name: "Fuel", priority: "High" }], maxCap: 5000, description: "Daily commute", color: "#06b6d4" },
];

const INITIAL_RECURRING: RecurringBill[] = [
  { id: "rec_1", name: "Netflix", dateOfDebit: "05", amount: 199, frequency: "Monthly", category: "Entertainment", subcategory: "Streaming", paymentMethod: "Credit Card" },
  { id: "rec_2", name: "Spotify Family", dateOfDebit: "12", amount: 179, frequency: "Monthly", category: "Entertainment", subcategory: "Music", paymentMethod: "Credit Card" },
  { id: "rec_3", name: "Prestige Properties Rent", dateOfDebit: "01", amount: 15000, frequency: "Monthly", category: "Rent", subcategory: "Housing", paymentMethod: "Net Banking" },
  { id: "rec_4", name: "Jio Fiber", dateOfDebit: "15", amount: 999, frequency: "Monthly", category: "Utilities", subcategory: "Internet", paymentMethod: "UPI" },
  { id: "rec_5", name: "LIC Premium", dateOfDebit: "20", amount: 8400, frequency: "Yearly", category: "Insurance", subcategory: "Life", paymentMethod: "Net Banking" },
];

const INITIAL_BUDGETS: BudgetItem[] = [
  { id: "bud_1", name: "Monthly Groceries", budgetAmount: 8000, category: "Groceries" },
  { id: "bud_2", name: "Entertainment Cap", budgetAmount: 2000, category: "Entertainment" },
  { id: "bud_3", name: "Travel Budget", budgetAmount: 15000, category: "Travel" },
  { id: "bud_4", name: "Shopping Limit", budgetAmount: 10000, category: "Shopping" },
];

const INITIAL_INCOME: IncomeItem[] = [
  { id: "inc_1", source: "Infosys Salary", amount: 95000, fetchType: "Manual", dateOfCredit: "2026-07-08", isFixed: true },
  { id: "inc_2", source: "Zerodha Dividends", amount: 10000, fetchType: "Manual", dateOfCredit: "2026-07-08", isFixed: false },
  { id: "inc_3", source: "Subletting Income", amount: 5000, fetchType: "Manual", dateOfCredit: "2026-07-06", isFixed: true },
  { id: "inc_4", source: "Fiverr Freelance", amount: 18000, fetchType: "Manual", dateOfCredit: "2026-07-04", isFixed: false },
];

const INITIAL_CREDIT_CARDS: CreditCardItem[] = [
  { id: "cc_1", cardName: "HDFC Regalia", lastFour: "4829", creditLimit: 300000, outstanding: 24500, minDue: 1225, dueDate: "2026-07-20" },
  { id: "cc_2", cardName: "SBI SimplyCLICK", lastFour: "9930", outstanding: 11200, creditLimit: 100000, minDue: 560, dueDate: "2026-07-10" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Shopping: "#f59e0b",
  Groceries: "#10b981",
  Entertainment: "#8b5cf6",
  Travel: "#3b82f6",
  Rent: "#ef4444",
  Transportation: "#06b6d4",
  EMI: "#ec4899",
  Utilities: "#f97316",
  Healthcare: "#14b8a6",
  Insurance: "#6366f1",
  Other: "#94a3b8",
};

const PAYMENT_METHODS = ["UPI", "Net Banking", "Credit Card", "Debit Card", "Cash", "Cheque"];
const FREQUENCIES = ["Daily", "Monthly", "Yearly"] as const;

// ============================================================
// DONUT CHART (Pure SVG)
// ============================================================
function DonutChart({ data, currency }: { data: { label: string; value: number; color: string }[]; currency: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return (
    <div className="flex flex-col items-center justify-center h-48 text-zinc-400 text-xs">
      <PieChart className="h-10 w-10 mb-2 opacity-30" />
      No expense data
    </div>
  );

  const radius = 60;
  const cx = 80;
  const cy = 80;
  let cumAngle = -Math.PI / 2;

  const slices = data.filter(d => d.value > 0).map(d => {
    const frac = d.value / total;
    const angle = frac * 2 * Math.PI;
    const x1 = cx + radius * Math.cos(cumAngle);
    const y1 = cy + radius * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + radius * Math.cos(cumAngle);
    const y2 = cy + radius * Math.sin(cumAngle);
    const largeArc = frac > 0.5 ? 1 : 0;
    return {
      ...d,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      pct: Math.round(frac * 100),
    };
  });

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <div className="relative shrink-0">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={s.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
          ))}
          {/* Hole */}
          <circle cx={cx} cy={cy} r={38} fill="white" />
          <text x={cx} y={cy - 4} textAnchor="middle" className="text-[9px] font-bold" fill="#52525b" fontSize="9">Total</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="#18181b" fontSize="11" fontWeight="800">
            {formatCurrency(total, currency).replace(/[^0-9.,₹$£€]/g, "").substring(0, 8)}
          </text>
        </svg>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 min-w-[120px]">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            <div>
              <p className="text-[11px] font-bold text-zinc-800">{s.label}</p>
              <p className="text-[10px] text-zinc-500">{formatCurrency(s.value, currency)} · {s.pct}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SMALL MODAL WRAPPER
// ============================================================
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 z-10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-extrabold text-zinc-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// FORM HELPERS
// ============================================================
function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-zinc-500">{label}{required && " *"}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full h-9 rounded-lg border border-zinc-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";
const selectCls = "w-full h-9 rounded-lg border border-zinc-200 px-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

// ============================================================
// MAIN COMPONENT
// ============================================================
interface MoneyFlowViewProps {
  onUpgradeClick?: () => void;
}

export default function MoneyFlowView({ onUpgradeClick }: MoneyFlowViewProps = {}) {
  const { dbUser } = useAuth();
  const currency = dbUser?.currency || "INR";
  const fmt = (v: number) => formatCurrency(v, currency);

  // ---- Sub-tab navigation ----
  type SubTab = "spending" | "recurring" | "budget" | "income" | "creditcard" | "insights";
  const [activeTab, setActiveTab] = React.useState<SubTab>("spending");

  // ---- Drawer ----
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [drawerMode, setDrawerMode] = React.useState<"manual" | "import" | null>(null);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = React.useState(false);

  // ---- Review Queue ----
  const [reviewCount, setReviewCount] = React.useState(0);
  const [isReviewOpen, setIsReviewOpen] = React.useState(false);

  const fetchReviewCount = React.useCallback(async () => {
    try {
      const res = await apiClient.get("/v1/imports/review");
      if (res.data && res.data.success) {
        setReviewCount(res.data.data.length);
      }
    } catch (e) {
      console.log("Failed to load review queue count", e);
    }
  }, []);

  React.useEffect(() => {
    fetchReviewCount();
  }, [fetchReviewCount]);

  // ---- Transactions ----
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  // ---- Categories ----
  const [categories, setCategories] = React.useState<Category[]>([]);

  // ---- Recurring ----
  const [recurringBills, setRecurringBills] = React.useState<RecurringBill[]>([]);

  // ---- Budget ----
  const [budgets, setBudgets] = React.useState<BudgetItem[]>([]);

  // ---- Income ----
  const [incomeItems, setIncomeItems] = React.useState<IncomeItem[]>([]);

  // ---- Credit Cards ----
  const [creditCards, setCreditCards] = React.useState<CreditCardItem[]>([]);

  const fetchData = React.useCallback(async () => {
    if (!dbUser) return;
    try {
      const [txRes, catRes, billRes, budgetRes, incRes, cardRes] = await Promise.all([
        apiClient.get(`/v1/transaction/users/${dbUser.userId}`),
        apiClient.get(`/v1/transactioncategory/users/${dbUser.userId}`),
        apiClient.get(`/v1/bill/users/${dbUser.userId}`),
        apiClient.get(`/v1/budget/users/${dbUser.userId}`),
        apiClient.get(`/v1/income/users/${dbUser.userId}`),
        apiClient.get(`/v1/creditcard/users/${dbUser.userId}`),
      ]);

      if (txRes.data?.success) {
        setTransactions(txRes.data.data.map((tx: any) => ({
          id: tx.id,
          date: tx.transactionDate,
          amount: tx.amount,
          merchant: tx.merchant || "Unknown",
          category: tx.categoryName || "Other",
          description: tx.note || "",
          type: tx.type.toLowerCase(),
          paymentMethod: tx.accountLast4 ? `Card ending in *${tx.accountLast4}` : "Other",
          tags: tx.tags ? tx.tags.split(",") : [],
        })));
      }

      if (catRes.data?.success) {
        setCategories(catRes.data.data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          subcategories: [],
          maxCap: 0,
          description: "",
          color: cat.color || "#94a3b8",
        })));
      }

      if (billRes.data?.success) {
        setRecurringBills(billRes.data.data.map((bill: any) => ({
          id: bill.id,
          name: bill.name,
          dateOfDebit: bill.dateOfDebit ? bill.dateOfDebit.toString() : "",
          amount: bill.amount,
          frequency: bill.frequency,
          category: bill.category || "",
          subcategory: bill.subcategory || "",
          paymentMethod: bill.paymentMethod || "",
        })));
      }

      if (budgetRes.data?.success) {
        setBudgets(budgetRes.data.data.map((b: any) => ({
          id: b.id,
          name: b.budgetName,
          budgetAmount: b.budgetAmount,
          category: b.categoryName || "",
        })));
      }

      if (incRes.data?.success) {
        setIncomeItems(incRes.data.data.map((inc: any) => ({
          id: inc.id,
          source: inc.incomeSource,
          amount: inc.amount,
          fetchType: inc.fetchType,
          dateOfCredit: inc.dateOfCredit,
          isFixed: inc.incomeType === "Fixed",
          isDuplicate: inc.isDuplicate || inc.duplicate || false,
          duplicateReason: inc.duplicateReason || "",
        })));
      }

      if (cardRes.data?.success) {
        setCreditCards(cardRes.data.data.map((c: any) => ({
          id: c.id,
          cardName: c.cardName,
          lastFour: c.lastFour,
          creditLimit: c.creditLimit,
          outstanding: 0,
          minDue: 0,
          dueDate: c.dueDate ? `${c.dueDate}th` : "",
        })));
      }
    } catch (e) {
      console.error("Failed to load Money Flow data", e);
    }
  }, [dbUser]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---- Derived Totals ----
  const expenseList = React.useMemo(() => transactions.filter(t => t.type === "expense"), [transactions]);
  const incomeList = React.useMemo(() => transactions.filter(t => t.type === "income"), [transactions]);
  const totalSpending = React.useMemo(() => expenseList.reduce((s, t) => s + t.amount, 0), [expenseList]);
  const totalIncome = React.useMemo(() => incomeList.reduce((s, t) => s + t.amount, 0), [incomeList]);

  // ---- Handle import from drawer ----
  const handleImport = (items: any[]) => {
    fetchData();
  };

  const SUB_TABS: { key: SubTab; label: string; icon: React.ElementType }[] = [
    { key: "spending", label: "Spending", icon: TrendingDown },
    { key: "recurring", label: "Recurring Bills", icon: Repeat },
    { key: "budget", label: "Budget", icon: Sliders },
    { key: "income", label: "Income", icon: TrendingUp },
    { key: "creditcard", label: "Credit Cards", icon: CreditCard },
    { key: "insights", label: "Cash Flow", icon: Activity },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">

      {/* ── Review Warning Banner ── */}
      {reviewCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">Imports Pending Review</p>
              <p className="text-xs text-amber-600 font-semibold mt-0.5">
                You have {reviewCount} transaction{reviewCount > 1 ? "s" : ""} pending review with low confidence levels. Please verify categorizations.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsReviewOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg h-9 px-4 font-bold text-xs shadow-xs"
          >
            Review Queue
          </Button>
        </div>
      )}

      {/* ── Sub-tab Navigation ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-200 pb-3">
        <div className="flex flex-wrap gap-1">
          {SUB_TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 h-9 px-3.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10"
                    : "text-zinc-500 hover:text-blue-600 hover:bg-blue-50/30"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1.5 shrink-0">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          AI Classification Active
        </div>
      </div>

      {/* ════════════════════════════════════════
          TAB 1 — SPENDING
          ════════════════════════════════════════ */}
      {activeTab === "spending" && (
        <SpendingTab
          transactions={transactions}
          setTransactions={setTransactions}
          expenseList={expenseList}
          totalSpending={totalSpending}
          categories={categories}
          setCategories={setCategories}
          budgets={budgets}
          fmt={fmt}
          currency={currency}
          onOpenDrawer={(mode) => {
            if (mode === "import") {
              setIsWizardOpen(true);
            } else {
              setDrawerMode(mode);
              setIsDrawerOpen(true);
            }
          }}
          onOpenSmsModal={() => setIsSmsModalOpen(true)}
        />
      )}

      {/* ════════════════════════════════════════
          TAB 2 — RECURRING BILLS
          ════════════════════════════════════════ */}
      {activeTab === "recurring" && (
        <ProFeatureGuard
          moduleName="Recurring Bills & Subscriptions"
          description="Track recurring subscriptions, auto-debit calendars, and upcoming bill reminders."
          onUpgradeClick={onUpgradeClick}
        >
          <RecurringBillsTab
            bills={recurringBills}
            setBills={setRecurringBills}
            categories={categories}
            fmt={fmt}
          />
        </ProFeatureGuard>
      )}

      {/* ════════════════════════════════════════
          TAB 3 — BUDGET
          ════════════════════════════════════════ */}
      {activeTab === "budget" && (
        <ProFeatureGuard
          moduleName="Budgeting & Spending Caps"
          description="Set custom category budgets, monthly spending caps, and real-time overspend alerts."
          onUpgradeClick={onUpgradeClick}
        >
          <BudgetTab
            budgets={budgets}
            setBudgets={setBudgets}
            categories={categories}
            expenseList={expenseList}
            fmt={fmt}
          />
        </ProFeatureGuard>
      )}

      {/* ════════════════════════════════════════
          TAB 4 — INCOME
          ════════════════════════════════════════ */}
      {activeTab === "income" && (
        <ProFeatureGuard
          moduleName="Income Streams & Payroll Management"
          description="Track multiple salary credits, freelance invoices, and automated income detection."
          onUpgradeClick={onUpgradeClick}
        >
          <IncomeTab
            incomeItems={incomeItems}
            setIncomeItems={setIncomeItems}
            fmt={fmt}
          />
        </ProFeatureGuard>
      )}

      {/* ════════════════════════════════════════
          TAB 5 — CREDIT CARDS
          ════════════════════════════════════════ */}
      {activeTab === "creditcard" && (
        <ProFeatureGuard
          moduleName="Credit Card Management"
          description="Monitor credit limits, statement billing cycles, and outstanding balance payoff plans."
          onUpgradeClick={onUpgradeClick}
        >
          <CreditCardTab
            cards={creditCards}
            setCards={setCreditCards}
            fmt={fmt}
            currency={currency}
          />
        </ProFeatureGuard>
      )}

      {/* ════════════════════════════════════════
          TAB 6 — CASH FLOW INSIGHTS
          ════════════════════════════════════════ */}
      {activeTab === "insights" && (
        <ProFeatureGuard
          moduleName="Money Flow AI Analytics"
          description="Unlock deep cashflow analytics, category trend breakdown, and spending anomaly warnings."
          onUpgradeClick={onUpgradeClick}
        >
          <InsightsTab
            expenseList={expenseList}
            incomeList={incomeList}
            totalSpending={totalSpending}
            totalIncome={totalIncome}
            categories={categories}
            budgets={budgets}
            fmt={fmt}
          />
        </ProFeatureGuard>
      )}

      {/* Transaction Drawer */}
      <TransactionOnboardingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onImport={handleImport}
        initialMode={drawerMode}
        onOpenWizard={() => setIsWizardOpen(true)}
      />

      {/* 4-Step Import Wizard */}
      <TransactionImportWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={fetchData}
      />

      {/* Review Queue Drawer */}
      <ReviewQueueDrawer
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        categories={categories}
        onRefresh={fetchReviewCount}
        onApprove={(tx) => {
          // Append newly approved transaction directly into the state
          const newTx = {
            id: tx.id,
            date: tx.transactionDate,
            amount: tx.amount,
            category: tx.category?.name || "Uncategorized",
            merchant: tx.merchant,
            description: tx.note || "Imported",
            type: tx.type?.toLowerCase() || "expense",
            account: tx.accountLast4 ? `Card ending in *${tx.accountLast4}` : "Imported Account",
            paymentMethod: tx.paymentMethod || "Other",
            tags: tx.tags ? tx.tags.split(",") : []
          };
          setTransactions(prev => [newTx, ...prev]);
        }}
      />

      {/* SMS Mobile App Download Modal */}
      <SmsAppModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
      />
    </div>
  );
}

// ============================================================
// SPENDING TAB
// ============================================================
function SpendingTab({
  transactions, setTransactions, expenseList, totalSpending,
  categories, setCategories, budgets, fmt, currency, onOpenDrawer, onOpenSmsModal
}: {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  expenseList: Transaction[];
  totalSpending: number;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  budgets: BudgetItem[];
  fmt: (v: number) => string;
  currency: string;
  onOpenDrawer: (mode: "manual" | "import") => void;
  onOpenSmsModal?: () => void;
}) {
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [paymentFilter, setPaymentFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showSubcategory, setShowSubcategory] = React.useState(true);
  const [showRefId, setShowRefId] = React.useState(false);
  const [showColMenu, setShowColMenu] = React.useState(false);
  const [showAddCategory, setShowAddCategory] = React.useState(false);
  const itemsPerPage = 10;

  // Spending by category for donut
  const donutData = React.useMemo(() => {
    const map: Record<string, number> = {};
    expenseList.forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([label, value]) => ({
      label,
      value,
      color: CATEGORY_COLORS[label] || CATEGORY_COLORS.Other,
    })).sort((a, b) => b.value - a.value);
  }, [expenseList]);

  // Filtered list
  const filtered = React.useMemo(() => {
    return transactions.filter(t => {
      if (t.type !== "expense") return false;
      const q = search.toLowerCase();
      const matchSearch = !q || t.merchant.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      const matchCat = categoryFilter === "all" || t.category === categoryFilter;
      const matchPay = paymentFilter === "all" || t.paymentMethod === paymentFilter;
      return matchSearch && matchCat && matchPay;
    });
  }, [transactions, search, categoryFilter, paymentFilter]);

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const uniqueCategories = [...new Set(expenseList.map(t => t.category))];
  const uniquePayments = [...new Set(transactions.map(t => t.paymentMethod))];

  // Check over-limit for a transaction
  const getWarning = (t: Transaction) => {
    const budget = budgets.find(b => b.category === t.category);
    if (budget) {
      const catTotal = expenseList.filter(e => e.category === t.category).reduce((s, e) => s + e.amount, 0);
      if (catTotal > budget.budgetAmount) return "Category over budget limit";
    }
    // Duplicate detection: same merchant + same amount within 3 days
    const dupls = transactions.filter(other =>
      other.id !== t.id &&
      other.merchant === t.merchant &&
      other.amount === t.amount &&
      Math.abs(new Date(t.date).getTime() - new Date(other.date).getTime()) < 3 * 24 * 60 * 60 * 1000
    );
    if (dupls.length > 0) return "Possible duplicate entry";
    return null;
  };

  // Add Category state
  const [newCat, setNewCat] = React.useState({
    name: "", subcatName: "", subcatPriority: "Medium" as "High" | "Medium" | "Low",
    maxCap: "", description: "", color: "#6366f1",
  });

  const handleAddCategory = async () => {
    if (!newCat.name.trim()) return;
    try {
      const res = await apiClient.post("/v1/transactioncategory", {
        name: newCat.name,
        color: newCat.color,
        type: "EXPENSE"
      });
      if (res.data?.success) {
        const cat = res.data.data;
        setCategories(prev => [...prev, {
          id: cat.id,
          name: cat.name,
          subcategories: [],
          maxCap: 0,
          description: "",
          color: cat.color || "#94a3b8",
        }]);
      }
    } catch (err) {
      console.log("Failed to add category", err);
    }
    setNewCat({ name: "", subcatName: "", subcatPriority: "Medium", maxCap: "", description: "", color: "#6366f1" });
    setShowAddCategory(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950">Spending</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Track, categorize and analyze all your cash outflows.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => onOpenDrawer("import")}
            variant="outline"
            className="h-9 px-3 rounded-xl border-zinc-200 font-semibold text-xs transition-all active:scale-[0.98]"
          >
            <FolderSync className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
            Import
          </Button>
          <Button
            onClick={() => onOpenDrawer("manual")}
            className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-all active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Manually
          </Button>

          <button
            onClick={() => onOpenSmsModal ? onOpenSmsModal() : onOpenDrawer("import")}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer"
            title="Import via SMS"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            SMS
          </button>
        </div>
      </div>

      {/* Donut Chart + Summary row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-4">Spending by Category</p>
          <DonutChart data={donutData} currency={currency} />
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm space-y-5">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Total Outflow</p>
            <p className="text-3xl font-extrabold tracking-tight text-red-600 mt-1">{fmt(totalSpending)}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">This month's total expenses</p>
          </div>
          <div className="space-y-2 pt-3 border-t border-zinc-100">
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Top Categories</p>
            {donutData.slice(0, 4).map(d => (
              <div key={d.label} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="flex-1 text-xs font-medium text-zinc-700 truncate">{d.label}</span>
                <span className="text-xs font-bold text-zinc-900">{fmt(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters + Column Toggle */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full h-8.5 rounded-lg border border-zinc-200 px-3 pl-8 bg-white text-xs font-medium focus:border-blue-500 focus:outline-none"
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="h-8.5 text-xs font-semibold w-40"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select
            value={paymentFilter}
            onChange={e => { setPaymentFilter(e.target.value); setCurrentPage(1); }}
            className="h-8.5 text-xs font-semibold w-40"
          >
            <option value="all">All Payment Methods</option>
            {uniquePayments.map(p => <option key={p} value={p}>{p}</option>)}
          </Select>

          {/* Column toggle dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowColMenu(v => !v)}
              className="flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
              Columns
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>
            {showColMenu && (
              <div className="absolute right-0 top-10 z-20 bg-white border border-zinc-200 rounded-xl shadow-lg p-3 space-y-2 min-w-[160px]">
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
                  <input type="checkbox" checked={showSubcategory} onChange={e => setShowSubcategory(e.target.checked)} className="rounded" />
                  Sub-category
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
                  <input type="checkbox" checked={showRefId} onChange={e => setShowRefId(e.target.checked)} className="rounded" />
                  Reference ID
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-150 bg-zinc-50 font-bold text-zinc-400 select-none text-[10px] tracking-wider uppercase">
                <th className="p-3.5 w-28">Date</th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Category</th>
                {showSubcategory && <th className="p-3.5">Sub-category</th>}
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Comments</th>
                {showRefId && <th className="p-3.5">Reference ID</th>}
                <th className="p-3.5 w-16 text-center">Status</th>
                <th className="p-3.5 w-12 text-center">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-800">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-zinc-400 text-xs">
                    No spending transactions found.
                  </td>
                </tr>
              ) : (
                paginated.map(t => {
                  const warning = getWarning(t);
                  return (
                    <tr key={t.id} className="hover:bg-zinc-50/40 transition-colors group">
                      <td className="p-3.5 whitespace-nowrap text-zinc-500 font-mono text-[11px]">{t.date}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-zinc-900 text-[12px]">{t.merchant}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-800 font-semibold">
                          <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Other }} />
                          {t.category}
                        </span>
                      </td>
                      {showSubcategory && (
                        <td className="p-3.5 text-[11px] text-zinc-500">{t.subcategory || "—"}</td>
                      )}
                      <td className="p-3.5 text-right whitespace-nowrap font-bold text-zinc-900 text-[12px]">
                        -{fmt(t.amount)}
                      </td>
                      <td className="p-3.5 text-[11px] text-zinc-600 whitespace-nowrap">{t.paymentMethod}</td>
                      <td className="p-3.5 text-[11px] text-zinc-400 max-w-[140px] truncate" title={t.description}>{t.description || "—"}</td>
                      {showRefId && (
                        <td className="p-3.5 text-[11px] text-zinc-400 font-mono">{t.referenceId || "—"}</td>
                      )}
                      <td className="p-3.5 text-center">
                        {warning ? (
                          <div className="relative group/warn flex justify-center">
                            <AlertTriangle className="h-4 w-4 text-amber-500 cursor-help" />
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-zinc-950 text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg opacity-0 group-hover/warn:opacity-100 transition-opacity pointer-events-none">
                              {warning}
                            </div>
                          </div>
                        ) : (
                          <CheckCircle className="h-4 w-4 text-zinc-200" />
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={async () => {
                            try {
                              await apiClient.delete(`/v1/transaction/${t.id}`);
                              setTransactions(prev => prev.filter(x => x.id !== t.id));
                            } catch (err) {
                              console.error("Failed to delete transaction", err);
                            }
                          }}
                          className="p-1 rounded-lg text-zinc-300 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-zinc-100 bg-zinc-50/50 text-xs font-bold text-zinc-500">
            <span>Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}</span>
            <div className="flex gap-2">
              <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} variant="outline" className="h-8 text-xs rounded-lg">Prev</Button>
              <Button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} variant="outline" className="h-8 text-xs rounded-lg">Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <Modal title="Add Category" onClose={() => setShowAddCategory(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Category Name" required>
                <input className={inputCls} value={newCat.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Food & Dining" />
              </FormField>
              <FormField label="Color">
                <div className="flex items-center gap-2">
                  <input type="color" value={newCat.color} onChange={e => setNewCat(p => ({ ...p, color: e.target.value }))}
                    className="h-9 w-14 rounded-lg border border-zinc-200 cursor-pointer p-1" />
                  <span className="text-xs font-mono text-zinc-500">{newCat.color}</span>
                </div>
              </FormField>
              <FormField label="Sub-category Name">
                <input className={inputCls} value={newCat.subcatName} onChange={e => setNewCat(p => ({ ...p, subcatName: e.target.value }))} placeholder="e.g. Restaurants" />
              </FormField>
              <FormField label="Sub-category Priority">
                <Select value={newCat.subcatPriority} onChange={e => setNewCat(p => ({ ...p, subcatPriority: e.target.value as any }))}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Select>
              </FormField>
              <FormField label="Max Cap (Monthly)">
                <input className={inputCls} type="number" min="0" value={newCat.maxCap} onChange={e => setNewCat(p => ({ ...p, maxCap: e.target.value }))} placeholder="e.g. 5000" />
              </FormField>
            </div>
            <FormField label="Description">
              <textarea className={`${inputCls} h-16 resize-none`} value={newCat.description} onChange={e => setNewCat(p => ({ ...p, description: e.target.value }))} placeholder="Brief category description..." />
            </FormField>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleAddCategory} className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">Save Category</Button>
              <Button onClick={() => setShowAddCategory(false)} variant="outline" className="h-9 px-4 rounded-xl text-xs font-bold">Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// RECURRING BILLS TAB
// ============================================================
function RecurringBillsTab({
  bills, setBills, categories, fmt
}: {
  bills: RecurringBill[];
  setBills: React.Dispatch<React.SetStateAction<RecurringBill[]>>;
  categories: Category[];
  fmt: (v: number) => string;
}) {
  const [showAdd, setShowAdd] = React.useState(false);

  const totalMonthly = React.useMemo(() => {
    return bills.reduce((sum, b) => {
      if (b.frequency === "Monthly") return sum + b.amount;
      if (b.frequency === "Yearly") return sum + b.amount / 12;
      return sum + b.amount * 30;
    }, 0);
  }, [bills]);

  const handleAddBill = async (newBill: {
    name: string;
    dateOfDebit: string;
    amount: number;
    frequency: "Daily" | "Monthly" | "Yearly";
    category: string;
    subcategory: string;
    paymentMethod: string;
  }) => {
    try {
      const res = await apiClient.post("/v1/bill", {
        billName: newBill.name,
        dayOfDebit: parseInt(newBill.dateOfDebit, 10),
        amount: newBill.amount,
        frequency: newBill.frequency,
        category: newBill.category,
        subcategory: newBill.subcategory,
        paymentMethod: newBill.paymentMethod,
      });
      if (res.data?.success) {
        const b = res.data.data;
        setBills(prev => [...prev, {
          id: b.id,
          name: b.name,
          dateOfDebit: b.dateOfDebit ? b.dateOfDebit.toString() : "",
          amount: b.amount,
          frequency: b.frequency,
          category: b.category || "",
          subcategory: b.subcategory || "",
          paymentMethod: b.paymentMethod || "",
        }]);
      }
    } catch (err) {
      console.error("Failed to add bill", err);
    }
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950">Recurring Bills</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Active subscriptions and recurring payments.</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs active:scale-[0.98]">
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Add New Bill
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Est. Monthly Total</p>
          <p className="text-2xl font-extrabold text-red-600 mt-1">{fmt(Math.round(totalMonthly))}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Active Bills</p>
          <p className="text-2xl font-extrabold text-zinc-900 mt-1">{bills.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Yearly Commitment</p>
          <p className="text-2xl font-extrabold text-zinc-900 mt-1">{fmt(Math.round(totalMonthly * 12))}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Debit Day</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5">Frequency</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Sub-category</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {bills.map(b => (
                <tr key={b.id} className="hover:bg-zinc-50/40 transition-colors group">
                  <td className="p-3.5 font-bold text-zinc-900">{b.name}</td>
                  <td className="p-3.5 text-zinc-600 font-mono">{b.dateOfDebit ? `${b.dateOfDebit}th` : "—"}</td>
                  <td className="p-3.5 text-right font-bold text-zinc-900">{fmt(b.amount)}</td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      b.frequency === "Monthly" ? "bg-blue-50 text-blue-700" :
                      b.frequency === "Yearly" ? "bg-purple-50 text-purple-700" :
                      "bg-amber-50 text-amber-700"
                    }`}>{b.frequency}</span>
                  </td>
                  <td className="p-3.5 text-zinc-600">{b.category || "—"}</td>
                  <td className="p-3.5 text-zinc-500">{b.subcategory || "—"}</td>
                  <td className="p-3.5 text-zinc-500">{b.paymentMethod}</td>
                  <td className="p-3.5 text-center">
                    <button onClick={async () => {
                      try {
                        await apiClient.delete(`/v1/bill/${b.id}`);
                        setBills(prev => prev.filter(x => x.id !== b.id));
                      } catch (err) {
                        console.error("Failed to delete bill", err);
                      }
                    }}
                      className="p-1 rounded-lg text-zinc-300 hover:text-red-650 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="border-t-2 border-zinc-200 bg-zinc-50">
                <td className="p-3.5 font-extrabold text-zinc-900" colSpan={2}>Monthly Total</td>
                <td className="p-3.5 text-right font-extrabold text-red-600">{fmt(Math.round(totalMonthly))}</td>
                <td colSpan={5} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <RecurringBillAddDrawer
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAddBill}
      />
    </div>
  );
}

// ============================================================
// BUDGET TAB
// ============================================================
function BudgetTab({
  budgets, setBudgets, categories, expenseList, fmt
}: {
  budgets: BudgetItem[];
  setBudgets: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
  categories: Category[];
  expenseList: Transaction[];
  fmt: (v: number) => string;
}) {
  const [showAdd, setShowAdd] = React.useState(false);

  const totalBudget = budgets.reduce((s, b) => s + b.budgetAmount, 0);

  const getSpent = (cat: string) => expenseList.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0);

  const handleAddBudget = async (newBudget: {
    name: string;
    budgetAmount: number;
    categoryId: string;
  }) => {
    try {
      const res = await apiClient.post("/v1/budget", {
        budgetName: newBudget.name,
        budgetAmount: newBudget.budgetAmount,
        categoryId: newBudget.categoryId,
      });
      if (res.data?.success) {
        const b = res.data.data;
        setBudgets(prev => [...prev, {
          id: b.id,
          name: b.budgetName,
          budgetAmount: b.budgetAmount,
          category: b.categoryName || "",
        }]);
      }
    } catch (err) {
      console.error("Failed to add budget", err);
    }
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950">Budget</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Set spending limits by category and track utilization.</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs active:scale-[0.98]">
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Budget
        </Button>
      </div>

      {/* Summary card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Total Budget</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{fmt(totalBudget)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Total Spent</p>
          <p className="text-2xl font-extrabold text-red-650 mt-1">
            {fmt(budgets.reduce((s, b) => s + getSpent(b.category), 0))}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Budgets Set</p>
          <p className="text-2xl font-extrabold text-zinc-900 mt-1">{budgets.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Over Limit</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            {budgets.filter(b => getSpent(b.category) > b.budgetAmount).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-right">Budget</th>
                <th className="p-3.5 text-right">Spent</th>
                <th className="p-3.5 text-right">Remaining</th>
                <th className="p-3.5 w-40">Utilization</th>
                <th className="p-3.5 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {budgets.map(b => {
                const spent = getSpent(b.category);
                const pct = Math.round((spent / b.budgetAmount) * 100);
                const over = spent > b.budgetAmount;
                return (
                  <tr key={b.id} className="hover:bg-zinc-50/40 transition-colors group">
                    <td className="p-3.5 font-bold text-zinc-900">{b.name}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-700 font-semibold">
                        <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_COLORS[b.category] || "#94a3b8" }} />
                        {b.category || "—"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-bold text-zinc-900">{fmt(b.budgetAmount)}</td>
                    <td className={`p-3.5 text-right font-bold ${over ? "text-red-650" : "text-zinc-700"}`}>{fmt(spent)}</td>
                    <td className={`p-3.5 text-right font-semibold ${over ? "text-red-500" : "text-emerald-650"}`}>
                      {over ? `-${fmt(spent - b.budgetAmount)}` : fmt(b.budgetAmount - spent)}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${over ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold w-8 ${over ? "text-red-650" : pct > 80 ? "text-amber-600" : "text-emerald-600"}`}>{pct}%</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <button onClick={async () => {
                        try {
                          await apiClient.delete(`/v1/budget/${b.id}`);
                          setBudgets(prev => prev.filter(x => x.id !== b.id));
                        } catch (err) {
                          console.error("Failed to delete budget", err);
                        }
                      }}
                        className="p-1 rounded-lg text-zinc-300 hover:text-red-650 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-zinc-200 bg-zinc-50">
                <td className="p-3.5 font-extrabold text-zinc-900" colSpan={2}>Total Budget</td>
                <td className="p-3.5 text-right font-extrabold text-blue-600">{fmt(totalBudget)}</td>
                <td colSpan={4} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <BudgetAddDrawer
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        categories={categories}
        onAdd={handleAddBudget}
      />
    </div>
  );
}

// ============================================================
// INCOME TAB
// ============================================================
function IncomeTab({
  incomeItems, setIncomeItems, fmt
}: {
  incomeItems: IncomeItem[];
  setIncomeItems: React.Dispatch<React.SetStateAction<IncomeItem[]>>;
  fmt: (v: number) => string;
}) {
  const [viewMode, setViewMode] = React.useState<"monthly" | "yearly">("monthly");
  const [showAdd, setShowAdd] = React.useState(false);

  const calcAmount = (item: IncomeItem) => {
    if (viewMode === "yearly") return item.isFixed ? item.amount * 12 : item.amount;
    return item.amount;
  };

  const total = incomeItems.reduce((s, i) => s + calcAmount(i), 0);

  const handleAddIncome = async (newIncome: {
    source: string;
    amount: number;
    dateOfCredit: string;
    isFixed: boolean;
    fetchType: "Manual" | "Auto";
  }) => {
    try {
      const res = await apiClient.post("/v1/income", {
        incomeSource: newIncome.source,
        amount: newIncome.amount,
        dateOfCredit: newIncome.dateOfCredit,
        incomeType: newIncome.isFixed ? "Fixed" : "One-time",
        fetchType: newIncome.fetchType,
      });
      if (res.data?.success) {
        const inc = res.data.data;
        setIncomeItems(prev => [...prev, {
          id: inc.id,
          source: inc.incomeSource,
          amount: inc.amount,
          fetchType: inc.fetchType,
          dateOfCredit: inc.dateOfCredit,
          isFixed: inc.incomeType === "Fixed",
        }]);
      }
    } catch (err) {
      console.error("Failed to add income", err);
    }
    setShowAdd(false);
  };

  // Detect duplicate income items (either marked by backend or matching date+amount in frontend)
  const isItemDup = (item: IncomeItem) => {
    if (item.isDuplicate) return true;
    const same = incomeItems.filter(
      (other) => other.dateOfCredit === item.dateOfCredit && Math.abs(other.amount - item.amount) < 0.01
    );
    return same.length > 1;
  };

  const hasDuplicates = incomeItems.some(isItemDup);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950">Income</h2>
          <p className="text-sm text-zinc-500 mt-0.5">All income streams — salary, dividends, rental, freelance.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Monthly / Yearly Toggle */}
          <div className="flex items-center bg-zinc-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode("monthly")}
              className={`h-7 px-3 rounded-lg text-xs font-bold transition-all ${viewMode === "monthly" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
            >Monthly</button>
            <button
              onClick={() => setViewMode("yearly")}
              className={`h-7 px-3 rounded-lg text-xs font-bold transition-all ${viewMode === "yearly" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
            >Yearly</button>
          </div>
          <Button onClick={() => setShowAdd(true)} className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs active:scale-[0.98]">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Income
          </Button>
        </div>
      </div>

      {/* Duplicate Warning Banner */}
      {hasDuplicates && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">Duplicate Income Entries Detected</p>
              <p className="text-xs text-amber-700 font-semibold mt-0.5">
                Some income streams share identical credit dates and amounts. Please verify the highlighted rows below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Total card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
            Total {viewMode === "monthly" ? "Monthly" : "Yearly"} Income
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">{fmt(total)}</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Across {incomeItems.length} active streams</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Fixed Income</p>
          <p className="text-2xl font-extrabold text-zinc-900 mt-1">
            {fmt(incomeItems.filter(i => i.isFixed).reduce((s, i) => s + calcAmount(i), 0))}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Variable Income</p>
          <p className="text-2xl font-extrabold text-zinc-900 mt-1">
            {fmt(incomeItems.filter(i => !i.isFixed).reduce((s, i) => s + calcAmount(i), 0))}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="p-3.5">Income Source</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Fetch Type</th>
                <th className="p-3.5">Date of Credit</th>
                <th className="p-3.5 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {incomeItems.map(item => {
                const dup = isItemDup(item);
                return (
                  <tr key={item.id} className={`transition-colors group ${dup ? "bg-amber-500/10 border-l-4 border-l-amber-500 hover:bg-amber-500/20" : "hover:bg-zinc-50/40"}`}>
                    <td className="p-3.5 font-bold text-zinc-900 flex items-center gap-2">
                      <span>{item.source}</span>
                      {dup && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center gap-1 shrink-0" title="Possible duplicate income entry">
                          <AlertTriangle className="h-3 w-3 text-amber-600" /> Duplicate
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-bold text-zinc-900">{fmt(item.amount)}</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.isFixed ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-700"
                      }`}>
                        {item.isFixed ? "Fixed" : "One-time"}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        item.fetchType === "Auto" ? "text-emerald-600" : "text-zinc-500"
                      }`}>
                        {item.fetchType === "Auto" ? <Sparkles className="h-3 w-3" /> : <Edit2 className="h-3 w-3" />}
                        {item.fetchType}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-zinc-500">{item.dateOfCredit}</td>
                    <td className="p-3.5 text-center">
                      <button onClick={async () => {
                        try {
                          await apiClient.delete(`/v1/income/${item.id}`);
                          setIncomeItems(prev => prev.filter(x => x.id !== item.id));
                        } catch (err) {
                          console.error("Failed to delete income", err);
                        }
                      }}
                        className="p-1 rounded-lg text-zinc-300 hover:text-red-650 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-zinc-200 bg-zinc-50">
                <td className="p-3.5 font-extrabold text-zinc-900">
                  Total {viewMode === "monthly" ? "Monthly" : "Yearly"} Income
                </td>
                <td className="p-3.5 text-right font-extrabold text-emerald-600">{fmt(total)}</td>
                <td colSpan={4} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <IncomeAddDrawer
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAddIncome}
      />
    </div>
  );
}

// ============================================================
// CREDIT CARD TAB
// ============================================================
function CreditCardTab({
  cards, setCards, fmt, currency
}: {
  cards: CreditCardItem[];
  setCards: React.Dispatch<React.SetStateAction<CreditCardItem[]>>;
  fmt: (v: number) => string;
  currency: string;
}) {
  const [showAdd, setShowAdd] = React.useState(false);

  const totalOutstanding = cards.reduce((s, c) => s + c.outstanding, 0);
  const totalLimit = cards.reduce((s, c) => s + c.creditLimit, 0);
  const overallUtilization = totalLimit > 0 ? Math.round((totalOutstanding / totalLimit) * 100) : 0;

  const handleAddCard = async (newCard: {
    cardName: string;
    lastFour: string;
    creditLimit: number;
    outstanding: number;
    minDue: number;
    dueDate: number;
  }) => {
    try {
      const res = await apiClient.post("/v1/creditcard", {
        cardName: newCard.cardName,
        lastFour: newCard.lastFour,
        creditLimit: newCard.creditLimit,
        dueDate: newCard.dueDate,
      });
      if (res.data?.success) {
        const card = res.data.data;
        setCards(prev => [...prev, {
          id: card.id,
          cardName: card.cardName,
          lastFour: card.lastFour,
          creditLimit: card.creditLimit,
          outstanding: 0,
          minDue: 0,
          dueDate: card.dueDate ? `${card.dueDate}th` : "",
        }]);
      }
    } catch (err) {
      console.error("Failed to add credit card", err);
    }
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950">Credit Cards</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Outstanding balances, limits, and due dates.</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs active:scale-[0.98]">
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Card
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Total Outstanding</p>
          <p className="text-2xl font-extrabold text-red-600 mt-1">{fmt(totalOutstanding)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Total Limit</p>
          <p className="text-2xl font-extrabold text-zinc-900 mt-1">{fmt(totalLimit)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Overall Utilization</p>
          <p className={`text-2xl font-extrabold mt-1 ${overallUtilization > 60 ? "text-red-600" : overallUtilization > 30 ? "text-amber-600" : "text-emerald-600"}`}>
            {overallUtilization}%
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Cards Active</p>
          <p className="text-2xl font-extrabold text-zinc-900 mt-1">{cards.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="p-3.5">Card Name</th>
                <th className="p-3.5">Last 4</th>
                <th className="p-3.5 text-right">Credit Limit</th>
                <th className="p-3.5 text-right">Outstanding</th>
                <th className="p-3.5 text-right">Min Due</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5 w-40">Utilization</th>
                <th className="p-3.5 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {cards.map(c => {
                const util = c.creditLimit > 0 ? Math.round((c.outstanding / c.creditLimit) * 100) : 0;
                const isOverdue = c.dueDate && new Date(c.dueDate) < new Date();
                return (
                  <tr key={c.id} className="hover:bg-zinc-50/40 transition-colors group">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center">
                          <CreditCard className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="font-bold text-zinc-900">{c.cardName}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-zinc-600">••{c.lastFour}</td>
                    <td className="p-3.5 text-right font-bold text-zinc-900">{fmt(c.creditLimit)}</td>
                    <td className="p-3.5 text-right font-bold text-red-600">{fmt(c.outstanding)}</td>
                    <td className="p-3.5 text-right font-semibold text-zinc-700">{fmt(c.minDue)}</td>
                    <td className="p-3.5">
                      <span className={`font-mono text-xs ${isOverdue ? "text-red-600 font-bold" : "text-zinc-500"}`}>
                        {c.dueDate || "—"}
                        {isOverdue && <span className="ml-1 text-[10px]">⚠ Overdue</span>}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${util > 60 ? "bg-red-500" : util > 30 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min(util, 100)}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold w-8 ${util > 60 ? "text-red-600" : util > 30 ? "text-amber-600" : "text-emerald-600"}`}>{util}%</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <button onClick={async () => {
                        try {
                          await apiClient.delete(`/v1/creditcard/${c.id}`);
                          setCards(prev => prev.filter(x => x.id !== c.id));
                        } catch (err) {
                          console.error("Failed to delete credit card", err);
                        }
                      }}
                        className="p-1 rounded-lg text-zinc-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-zinc-200 bg-zinc-50">
                <td className="p-3.5 font-extrabold text-zinc-900" colSpan={3}>Total Outstanding</td>
                <td className="p-3.5 text-right font-extrabold text-red-600">{fmt(totalOutstanding)}</td>
                <td colSpan={4} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <CreditCardAddDrawer
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAddCard}
      />
    </div>
  );
}

// ============================================================
// CASH FLOW INSIGHTS TAB
// ============================================================
function InsightsTab({
  expenseList, incomeList, totalSpending, totalIncome, categories, budgets, fmt
}: {
  expenseList: Transaction[];
  incomeList: Transaction[];
  totalSpending: number;
  totalIncome: number;
  categories: Category[];
  budgets: BudgetItem[];
  fmt: (v: number) => string;
}) {
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalSpending) / totalIncome) * 100) : 0;
  const netFlow = totalIncome - totalSpending;

  // Spending nature score (0-100): based on savings rate, over-budget categories
  const overBudgetCount = budgets.filter(b => {
    const spent = expenseList.filter(t => t.category === b.category).reduce((s, t) => s + t.amount, 0);
    return spent > b.budgetAmount;
  }).length;
  const spendingScore = Math.max(0, Math.min(100, savingsRate + 50 - overBudgetCount * 10));
  const confidence = Math.min(95, 60 + expenseList.length * 3);

  // Category cut suggestions (High-priority subcats with most spending)
  const cutSuggestions = React.useMemo(() => {
    return categories
      .flatMap(cat =>
        cat.subcategories
          .filter(s => s.priority === "Low" || s.priority === "Medium")
          .map(s => ({
            category: cat.name,
            subcategory: s.name,
            priority: s.priority,
            spent: expenseList.filter(t => t.category === cat.name && t.subcategory === s.name).reduce((sum, t) => sum + t.amount, 0),
            maxCap: cat.maxCap,
          }))
      )
      .filter(s => s.spent > 0)
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 4);
  }, [categories, expenseList]);

  // Mock month-over-month bars
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const mockExpenses = [28000, 32000, 27500, 35000, 31000, totalSpending];
  const mockIncome = [95000, 95000, 113000, 95000, 100000, totalIncome];
  const maxVal = Math.max(...mockExpenses, ...mockIncome);

  const scoreColor = spendingScore >= 70 ? "text-emerald-600" : spendingScore >= 40 ? "text-amber-600" : "text-red-600";
  const scoreBg = spendingScore >= 70 ? "bg-emerald-50 border-emerald-100" : spendingScore >= 40 ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950">Cash Flow & Insights</h2>
        <p className="text-sm text-zinc-500 mt-0.5">AI-powered analysis of your spending behavior and financial forecast.</p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`rounded-2xl border p-5 shadow-sm ${scoreBg}`}>
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Spending Nature Score</p>
          <p className={`text-3xl font-extrabold mt-1 ${scoreColor}`}>{spendingScore}<span className="text-base">/100</span></p>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {spendingScore >= 70 ? "Disciplined spender" : spendingScore >= 40 ? "Moderate spender" : "High spender"}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Confidence Level</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">{confidence}%</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Based on {expenseList.length} transactions</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Savings Rate</p>
          <p className={`text-3xl font-extrabold mt-1 ${savingsRate >= 20 ? "text-emerald-600" : "text-amber-600"}`}>{savingsRate}%</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Net: {fmt(netFlow)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Over-Budget Categories</p>
          <p className={`text-3xl font-extrabold mt-1 ${overBudgetCount > 0 ? "text-red-600" : "text-emerald-600"}`}>{overBudgetCount}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">{overBudgetCount === 0 ? "All within limits" : "Needs attention"}</p>
        </div>
      </div>

      {/* Bar Chart + Cut Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Month-over-month bar chart */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="h-4 w-4 text-zinc-400" />
            <p className="text-sm font-bold text-zinc-900">Income vs. Expenses (6 Month)</p>
          </div>
          <div className="flex items-end gap-3 h-36">
            {months.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-0.5">
                  <div
                    className="w-full rounded-t bg-emerald-400/70 transition-all"
                    style={{ height: `${(mockIncome[i] / maxVal) * 120}px` }}
                    title={`Income: ${fmt(mockIncome[i])}`}
                  />
                  <div
                    className="w-full rounded-t bg-red-400/70"
                    style={{ height: `${(mockExpenses[i] / maxVal) * 120}px` }}
                    title={`Expenses: ${fmt(mockExpenses[i])}`}
                  />
                </div>
                <span className="text-[9px] font-bold text-zinc-400">{m}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Income</span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500"><span className="h-2 w-2 rounded-full bg-red-400" /> Expenses</span>
          </div>
        </div>

        {/* Cut Suggestions */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
            <p className="text-sm font-bold text-zinc-900">AI Cut Suggestions</p>
          </div>
          {cutSuggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-zinc-400 text-xs text-center">
              <CheckCircle className="h-8 w-8 mb-2 text-emerald-400" />
              No low-priority spending detected — great discipline!
            </div>
          ) : (
            <div className="space-y-3">
              {cutSuggestions.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div>
                    <p className="text-xs font-bold text-zinc-900">{s.category} › {s.subcategory}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        s.priority === "Low" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                      }`}>{s.priority} Priority</span>
                      <span className="text-[10px] text-zinc-400">Consider reducing</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-red-600">{fmt(s.spent)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Next Month Forecast */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-blue-600" />
          <p className="text-sm font-bold text-blue-900">Next Month Forecast</p>
          <span className="text-[10px] font-bold text-blue-400 ml-auto">Based on trailing 3-month average</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Forecasted Outflow</p>
            <p className="text-2xl font-extrabold text-zinc-900 mt-1">{fmt(Math.round(totalSpending * 1.05))}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">±5% confidence band</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Forecasted Income</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{fmt(Math.round(totalIncome * 0.98))}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Based on fixed streams</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Projected Net</p>
            <p className={`text-2xl font-extrabold mt-1 ${netFlow >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {fmt(Math.round((totalIncome * 0.98) - (totalSpending * 1.05)))}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Estimated monthly savings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
