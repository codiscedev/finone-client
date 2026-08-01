"use client";

import * as React from "react";
import {
  X,
  Home,
  CreditCard,
  TrendingUp,
  Target,
  ChevronLeft,
  Search,
  Sparkles,
  Calendar,
  Building2,
  Coins,
  Percent,
  BookmarkCheck,
  CheckCircle2,
  Info,
  ShieldCheck,
  ShieldAlert,
  Car,
  Landmark,
  PieChart,
  Banknote,
  HelpCircle,
  HeartHandshake,
  User,
  GraduationCap,
  LineChart,
  BarChart2,
  Briefcase,
  Lock,
  RefreshCw,
  HeartPulse,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Select } from "../../components/ui/select";
import { apiClient } from "@/lib/api";
import { useCustomAlert } from "@/components/ui/custom-alert-dialog";

interface WealthAddDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WealthAddDrawer({ isOpen, onClose }: WealthAddDrawerProps) {
  const { showSuccess, showWarning } = useCustomAlert();
  const { dbUser } = useAuth();
  const [assetCategoriesList, setAssetCategoriesList] = React.useState<any[]>([]);
  const [debtCategoriesList, setDebtCategoriesList] = React.useState<any[]>([]);
  const [investmentCategoriesList, setInvestmentCategoriesList] = React.useState<any[]>([]);
  const [goalCategoriesList, setGoalCategoriesList] = React.useState<any[]>([]);
  const [essentialCategoriesList, setEssentialCategoriesList] = React.useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(false);

  const fetchCategories = async () => {
    if (!dbUser?.userId) return;
    setLoadingCategories(true);
    try {
      const assetRes = await apiClient.get(`/v1/assetcategory/${dbUser.userId}`);
      if (assetRes.data?.success) {
        setAssetCategoriesList(assetRes.data.data);
      }
      const debtRes = await apiClient.get(`/v1/debtcategory/${dbUser.userId}`);
      if (debtRes.data?.success) {
        setDebtCategoriesList(debtRes.data.data);
      }
      const investRes = await apiClient.get(`/v1/investmentcategory/${dbUser.userId}`);
      if (investRes.data?.success) {
        setInvestmentCategoriesList(investRes.data.data);
      }
      const goalRes = await apiClient.get(`/v1/goalcategory/users/${dbUser.userId}`);
      if (goalRes.data?.success) {
        setGoalCategoriesList(goalRes.data.data);
      }
      const essentialRes = await apiClient.get(`/v1/essentialcategory/users/${dbUser.userId}`);
      if (essentialRes.data?.success) {
        setEssentialCategoriesList(essentialRes.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories in drawer:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, dbUser]);

  const assetCategories = React.useMemo(() => {
    const defaultMeta: Record<string, { desc: string; icon: any; color: string }> = {
      PROPERTY: { desc: "Residential, commercial or plot properties", icon: Home, color: "text-emerald-600 bg-emerald-50" },
      GOLD: { desc: "Physical gold bars, coins or jewelry", icon: Coins, color: "text-amber-500 bg-amber-50" },
      SILVER: { desc: "Physical silver bars or commodities", icon: Sparkles, color: "text-slate-400 bg-slate-50" },
      VEHICLE: { desc: "Cars, bikes or commercial transport assets", icon: Car, color: "text-blue-600 bg-blue-50" },
      LIQUID_CASH: { desc: "Physical currency cash reserves", icon: Banknote, color: "text-lime-600 bg-lime-50" },
      SAVINGS_BANK_ACCOUNT: { desc: "Savings or checking cash balances", icon: Landmark, color: "text-indigo-650 bg-indigo-50" },
      OTHERS: { desc: "Other custom assets, variables, or items", icon: HelpCircle, color: "text-zinc-500 bg-zinc-50" }
    };
    
    return assetCategoriesList.map((cat: any) => {
      const code = cat.name.toUpperCase().replace(/\s+/g, "_");
      const meta = defaultMeta[code] || defaultMeta[cat.name.toUpperCase()] || defaultMeta["OTHERS"];
      return {
        id: cat.id,
        code: code,
        label: cat.name,
        desc: meta.desc,
        icon: meta.icon,
        color: meta.color,
        defaultRate: cat.rate != null ? cat.rate.toString() : "5",
        isAppreciation: cat.isAppreciation ?? cat.is_appreciation ?? true
      };
    });
  }, [assetCategoriesList]);

  const debtCategories = React.useMemo(() => {
    const defaultMeta: Record<string, { desc: string; icon: any; color: string }> = {
      HOME_LOAN: { desc: "Mortgages or home construction financing", icon: Home, color: "text-emerald-600 bg-emerald-50" },
      GOLD_LOAN: { desc: "Borrowings backed by gold assets", icon: Coins, color: "text-amber-500 bg-amber-50" },
      VEHICLE_LOAN: { desc: "Loans for cars, bikes or transport", icon: Car, color: "text-blue-600 bg-blue-50" },
      SOFT_LOAN: { desc: "Zero or low interest borrowings", icon: HeartHandshake, color: "text-rose-500 bg-rose-50" },
      MF_LOAN: { desc: "Loans taken against mutual fund securities", icon: PieChart, color: "text-fuchsia-600 bg-fuchsia-50" },
      PERSONAL_LOAN: { desc: "Unsecured personal credits or lines", icon: User, color: "text-indigo-650 bg-indigo-50" },
      EDUCATION_LOAN: { desc: "Student loans for higher studies", icon: GraduationCap, color: "text-cyan-600 bg-cyan-50" },
      CREDIT_CARD_LOAN: { desc: "Credit card EMI conversion or loans", icon: CreditCard, color: "text-violet-600 bg-violet-50" },
      OTHER: { desc: "Other custom debts or borrowings", icon: HelpCircle, color: "text-zinc-500 bg-zinc-50" }
    };

    return debtCategoriesList.map((cat: any) => {
      const code = cat.name.toUpperCase().replace(/\s+/g, "_");
      const meta = defaultMeta[code] || defaultMeta[cat.name.toUpperCase()] || defaultMeta["OTHER"];
      return {
        id: cat.id,
        code: code,
        label: cat.name,
        desc: meta.desc,
        icon: meta.icon,
        color: meta.color
      };
    });
  }, [debtCategoriesList]);

  const investmentCategories = React.useMemo(() => {
    const defaultMeta: Record<string, { desc: string; icon: any; color: string }> = {
      STOCK: { desc: "Equity shares of publicly listed companies", icon: LineChart, color: "text-emerald-600 bg-emerald-50" },
      MUTUAL_FUND: { desc: "Diversified mutual funds or index funds", icon: BarChart2, color: "text-blue-600 bg-blue-50" },
      CRYPTO: { desc: "Digital currencies or crypto assets", icon: Coins, color: "text-rose-500 bg-rose-50" },
      EPF: { desc: "Government EPF savings contributions", icon: Briefcase, color: "text-amber-500 bg-amber-50" },
      PPF: { desc: "Government PPF tax-saving scheme", icon: Home, color: "text-indigo-650 bg-indigo-50" },
      NPS: { desc: "National Pension System retirement contributions", icon: Landmark, color: "text-purple-500 bg-purple-50" },
      FD: { desc: "Guaranteed return bank fixed deposit accounts", icon: Lock, color: "text-teal-600 bg-teal-50" },
      RD: { desc: "Monthly savings recurring deposit accounts", icon: RefreshCw, color: "text-cyan-600 bg-cyan-50" },
      OTHER: { desc: "Other custom or variable investment options", icon: HelpCircle, color: "text-zinc-500 bg-zinc-50" }
    };

    return investmentCategoriesList.map((cat: any) => {
      const code = cat.name.toUpperCase().replace(/\s+/g, "_");
      const meta = defaultMeta[code] || defaultMeta[cat.name.toUpperCase()] || defaultMeta["OTHER"];
      return {
        id: cat.id,
        code: code,
        label: cat.name,
        desc: meta.desc,
        icon: meta.icon,
        color: meta.color,
        defaultRate: cat.rate != null ? cat.rate.toString() : "10"
      };
    });
  }, [investmentCategoriesList]);

  const goalCategories = React.useMemo(() => {
    const defaultMeta: Record<string, { desc: string; icon: any; color: string }> = {
      CAREER: { desc: "Career goals or professional development", icon: Briefcase, color: "text-emerald-600 bg-emerald-50" },
      HEALTH: { desc: "Health insurance, gym or fitness targets", icon: HeartPulse, color: "text-rose-500 bg-rose-50" },
      FINANCE: { desc: "Savings reserves, investment allocations", icon: Coins, color: "text-amber-500 bg-amber-50" },
      LEARNING: { desc: "Higher education or training skillsets", icon: GraduationCap, color: "text-blue-600 bg-blue-50" },
      PERSONAL: { desc: "Personal lifestyle or miscellaneous goals", icon: User, color: "text-indigo-650 bg-indigo-50" },
      RELATIONSHIPS: { desc: "Family travels, marriages or partnerships", icon: Users, color: "text-purple-500 bg-purple-50" },
      RETIREMENT: { desc: "Pension funding or long term retirement matching", icon: Landmark, color: "text-teal-600 bg-teal-50" },
      OTHER: { desc: "Other custom targets or milestones", icon: HelpCircle, color: "text-zinc-500 bg-zinc-50" }
    };

    const acceptedCodes = ["CAREER", "HEALTH", "FINANCE", "LEARNING", "PERSONAL", "RELATIONSHIPS"];
    return goalCategoriesList
      .map((cat: any) => {
        const code = cat.name.toUpperCase().replace(/\s+/g, "_");
        const meta = defaultMeta[code] || defaultMeta[cat.name.toUpperCase()] || defaultMeta["OTHER"];
        return {
          id: cat.id,
          code: code,
          label: cat.name,
          desc: meta.desc,
          icon: meta.icon,
          color: meta.color
        };
      })
      .filter((c) => acceptedCodes.includes(c.code));
  }, [goalCategoriesList]);

  const essentialCategories = React.useMemo(() => {
    const defaultMeta: Record<string, { desc: string; icon: any; color: string }> = {
      FD: { desc: "Fixed Deposit accounts", icon: Lock, color: "text-emerald-600 bg-emerald-50" },
      LIQUID_CASH: { desc: "Physical currency cash reserves", icon: Coins, color: "text-lime-600 bg-lime-50" },
      SAVINGS_BANK_ACCOUNT: { desc: "Savings or checking cash balances", icon: Landmark, color: "text-indigo-650 bg-indigo-50" },
      EMERGENCY_FUND: { desc: "Emergency savings reserve balances", icon: ShieldCheck, color: "text-blue-600 bg-blue-50" },
      HEALTH_INSURANCE: { desc: "Medical and health policy coverage", icon: HeartPulse, color: "text-rose-500 bg-rose-50" },
      LIFE_INSURANCE: { desc: "Life insurance premium index", icon: ShieldAlert, color: "text-purple-500 bg-purple-50" },
      VEHICLE_INSURANCE: { desc: "Vehicle safety insurance plan", icon: Car, color: "text-cyan-600 bg-cyan-50" },
      HOME_INSURANCE: { desc: "Property protection plans", icon: Home, color: "text-amber-500 bg-amber-50" },
      TERM_INSURANCE: { desc: "Term life policy protection", icon: ShieldCheck, color: "text-violet-600 bg-violet-50" },
      PERSONAL_ACCIDENT_COVER: { desc: "Accident protection benefits", icon: ShieldAlert, color: "text-red-500 bg-red-50" },
      OTHER: { desc: "Other custom essential category", icon: HelpCircle, color: "text-zinc-500 bg-zinc-50" }
    };

    return essentialCategoriesList.map((cat: any) => {
      const code = cat.name.toUpperCase().replace(/\s+/g, "_");
      const meta = defaultMeta[code] || defaultMeta[cat.name.toUpperCase()] || defaultMeta["OTHER"];
      return {
        id: cat.id,
        code: code,
        label: cat.name,
        desc: meta.desc,
        icon: meta.icon,
        color: meta.color
      };
    });
  }, [essentialCategoriesList]);

  // Steps: 1 = Choose Record Type, 2 = Select Category (for Assets), 3 = Input Form
  const [step, setStep] = React.useState(1);
  const [recordType, setRecordType] = React.useState<"Asset" | "Debt" | "Investment" | "Goal" | "Emergency" | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [assetCategory, setAssetCategory] = React.useState<string>("");
  const [assetType, setAssetType] = React.useState<"APPRECIATION" | "DEPRECIATION">("APPRECIATION");

  // Auto-save draft state indicator
  const [showDraftBadge, setShowDraftBadge] = React.useState(false);

  // Keyboard Escape hook to close drawer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent trackpad/mouse scroll wheel from changing number input values when focused
  React.useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && activeEl.tagName === "INPUT" && (activeEl as HTMLInputElement).type === "number") {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Trigger temporary draft auto-save indicators
  const triggerDraftSave = () => {
    setShowDraftBadge(true);
    const timer = setTimeout(() => setShowDraftBadge(false), 1200);
    return () => clearTimeout(timer);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Form states mapping
  // Generic / Property
  const [propertyName, setPropertyName] = React.useState("");
  const [propertyType, setPropertyType] = React.useState("Apartment");

  // Gold Form States
  const [goldType, setGoldType] = React.useState("Physical");
  const [goldCarat, setGoldCarat] = React.useState("");
  const [goldCurrentPrice, setGoldCurrentPrice] = React.useState("");
  const [goldWeight, setGoldWeight] = React.useState("");

  const handlePurchaseValueChange = (val: string) => {
    setPurchaseValue(val);
    if (goldCurrentPrice && Number(goldCurrentPrice) > 0) {
      const w = Number(val) / Number(goldCurrentPrice);
      setGoldWeight(w.toFixed(2));
      setCurrentMarketValue((w * Number(goldCurrentPrice)).toFixed(2));
    }
  };

  const handleCurrentPriceChange = (val: string) => {
    setGoldCurrentPrice(val);
    if (val && Number(val) > 0) {
      if (purchaseValue && Number(purchaseValue) > 0) {
        const w = Number(purchaseValue) / Number(val);
        setGoldWeight(w.toFixed(2));
        setCurrentMarketValue((w * Number(val)).toFixed(2));
      } else if (goldWeight && Number(goldWeight) > 0) {
        setCurrentMarketValue((Number(goldWeight) * Number(val)).toFixed(2));
      }
    }
  };

  const handleWeightChange = (val: string) => {
    setGoldWeight(val);
    if (goldCurrentPrice && Number(goldCurrentPrice) > 0) {
      setCurrentMarketValue((Number(val) * Number(goldCurrentPrice)).toFixed(2));
    }
  };

  // Silver Form States
  const [silverType, setSilverType] = React.useState("Physical");
  const [silverCurrentPrice, setSilverCurrentPrice] = React.useState("");
  const [silverWeight, setSilverWeight] = React.useState("");

  const handleSilverPurchaseValueChange = (val: string) => {
    setPurchaseValue(val);
    if (silverCurrentPrice && Number(silverCurrentPrice) > 0) {
      const w = Number(val) / Number(silverCurrentPrice);
      setSilverWeight(w.toFixed(2));
      setCurrentMarketValue((w * Number(silverCurrentPrice)).toFixed(2));
    }
  };

  const handleSilverCurrentPriceChange = (val: string) => {
    setSilverCurrentPrice(val);
    if (val && Number(val) > 0) {
      if (purchaseValue && Number(purchaseValue) > 0) {
        const w = Number(purchaseValue) / Number(val);
        setSilverWeight(w.toFixed(2));
        setCurrentMarketValue((w * Number(val)).toFixed(2));
      } else if (silverWeight && Number(silverWeight) > 0) {
        setCurrentMarketValue((Number(silverWeight) * Number(val)).toFixed(2));
      }
    }
  };

  const handleSilverWeightChange = (val: string) => {
    setSilverWeight(val);
    if (silverCurrentPrice && Number(silverCurrentPrice) > 0) {
      setCurrentMarketValue((Number(val) * Number(silverCurrentPrice)).toFixed(2));
    }
  };
  // Vehicle Form States
  const [vehicleName, setVehicleName] = React.useState("");

  const [purchaseValue, setPurchaseValue] = React.useState("");
  const [purchaseDate, setPurchaseDate] = React.useState("");
  const [currentMarketValue, setCurrentMarketValue] = React.useState("");
  const [assetNotes, setAssetNotes] = React.useState("");
  const [assetRate, setAssetRate] = React.useState("");
  const [ownershipPercent, setOwnershipPercent] = React.useState("100");
  const [rentalIncome, setRentalIncome] = React.useState("");

  // Debt Form States
  // Investment Form States
  const [investmentCategory, setInvestmentCategory] = React.useState<string>("");
  const [investmentName, setInvestmentName] = React.useState("");
  const [investmentNotes, setInvestmentNotes] = React.useState("");
  const [investmentSymbol, setInvestmentSymbol] = React.useState("");
  const [investmentUnits, setInvestmentUnits] = React.useState("");
  const [investmentBuyPrice, setInvestmentBuyPrice] = React.useState("");
  const [investmentCurrentPrice, setInvestmentCurrentPrice] = React.useState("");
  const [investmentInvestedAmount, setInvestmentInvestedAmount] = React.useState("");
  const [investmentCurrentValue, setInvestmentCurrentValue] = React.useState("");
  const [investmentExpectedReturn, setInvestmentExpectedReturn] = React.useState("");
  const [investmentStartDate, setInvestmentStartDate] = React.useState("");
  const [investmentIsSip, setInvestmentIsSip] = React.useState<"Yes" | "No">("No");
  const [investmentSipAmount, setInvestmentSipAmount] = React.useState("");
  const [investmentSipFrequency, setInvestmentSipFrequency] = React.useState("Monthly");
  const [investmentMaturityDate, setInvestmentMaturityDate] = React.useState("");

  const [debtCategory, setDebtCategory] = React.useState<string>("");
  const [loanName, setLoanName] = React.useState("");
  const [lendingBank, setLendingBank] = React.useState("");
  const [loanAccountNumber, setLoanAccountNumber] = React.useState("");
  const [loanStatus, setLoanStatus] = React.useState<"Active" | "Closed">("Active");

  const [sanctionedAmount, setSanctionedAmount] = React.useState("");
  const [outstandingPrincipal, setOutstandingPrincipal] = React.useState("");
  const [loanInterestRate, setLoanInterestRate] = React.useState("");
  const [loanTenureValue, setLoanTenureValue] = React.useState("");
  const [loanTenureUnit, setLoanTenureUnit] = React.useState<"Years" | "Months">("Months");
  const [loanStartDate, setLoanStartDate] = React.useState("");
  const [loanEndDate, setLoanEndDate] = React.useState("");
  const [emiAmountInput, setEmiAmountInput] = React.useState("");
  const [emiDueDate, setEmiDueDate] = React.useState("");

  const [prepaymentAllowed, setPrepaymentAllowed] = React.useState<"Yes" | "No">("Yes");
  const [interestRateType, setInterestRateType] = React.useState<"Floating" | "Fixed">("Floating");
  const [coBorrower, setCoBorrower] = React.useState("");
  const [linkedAsset, setLinkedAsset] = React.useState<"Property" | "Vehicle" | "Gold" | "Other" | "Unsecure">("Unsecure");
  const [loanNotes, setLoanNotes] = React.useState("");

  // EMI & Loan calculations
  const calculateEMI = () => {
    const P = Number(sanctionedAmount) || 0;
    const annualRate = Number(loanInterestRate) || 0;
    const tenureValue = Number(loanTenureValue) || 0;
    const n = loanTenureUnit === "Years" ? tenureValue * 12 : tenureValue;

    if (P <= 0 || n <= 0) return { emi: 0, totalRepayment: 0, totalInterest: 0 };
    if (annualRate <= 0) {
      return { emi: Math.round(P / n), totalRepayment: P, totalInterest: 0 };
    }

    const r = (annualRate / 100) / 12;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalRepayment = emi * n;
    const totalInterest = totalRepayment - P;

    return {
      emi: Math.round(emi),
      totalRepayment: Math.round(totalRepayment),
      totalInterest: Math.round(totalInterest)
    };
  };

  const emiCalc = calculateEMI();

  const sanctionedNum = Number(sanctionedAmount) || 0;
  const outstandingNum = Number(outstandingPrincipal) || 0;
  const completionPercent = sanctionedNum > 0 ? Math.max(0, Math.min(100, Math.round(((sanctionedNum - outstandingNum) / sanctionedNum) * 100))) : 0;

  const totalMonths = loanTenureUnit === "Years" ? (Number(loanTenureValue) || 0) * 12 : (Number(loanTenureValue) || 0);
  const remainingMonths = sanctionedNum > 0 ? Math.max(0, Math.round(totalMonths * (outstandingNum / sanctionedNum))) : 0;
  const remainingInterest = Math.round(emiCalc.totalInterest * (sanctionedNum > 0 ? (outstandingNum / sanctionedNum) : 0));

  const getAIInsights = () => {
    const rate = Number(loanInterestRate) || 0;
    const insights: Array<{ text: string; savings: string; priority: "High" | "Medium" | "Low"; action: string }> = [];

    if (outstandingNum <= 0) return insights;

    // Insight 1: Prepayment
    const prepayVal = outstandingNum > 500000 ? 200000 : Math.round(outstandingNum * 0.1);
    const savingsVal = Math.round(prepayVal * (rate / 100) * (remainingMonths / 12) * 0.75); // approx discount factor
    if (savingsVal > 1000) {
      insights.push({
        text: `Prepay ${formatCurrency(prepayVal)} to save approximately ${formatCurrency(savingsVal)} in future interest payments.`,
        savings: `Est. Savings: ${formatCurrency(savingsVal)}`,
        priority: rate > 9 ? "High" : "Medium",
        action: "One-time Prepayment"
      });
    }

    // Insight 2: Increase EMI
    const emiInc = Math.round(Math.max(1000, emiCalc.emi * 0.1));
    const monthsSaved = Math.round(remainingMonths * 0.12);
    if (monthsSaved > 3 && emiCalc.emi > 0) {
      insights.push({
        text: `Increase monthly EMI by ${formatCurrency(emiInc)} to close the loan ${monthsSaved} months earlier.`,
        savings: `Months Saved: ${monthsSaved} mo`,
        priority: "Medium",
        action: "Step-up EMI plan"
      });
    }

    // Insight 3: High interest rate warning
    if (rate > 9.5) {
      insights.push({
        text: `This loan interest rate (${rate}%) is higher than current market averages. Prioritize repayment or refinance.`,
        savings: "Reduce Debt Burden",
        priority: "High",
        action: "Balance Transfer / Refinance"
      });
    } else if (rate > 7.5 && rate <= 9.5) {
      insights.push({
        text: `Interest rate is stable. Maintain standard payments or set up auto-pay.`,
        savings: "Punctuality credit",
        priority: "Low",
        action: "Set Auto-Pay"
      });
    }

    return insights;
  };

  const aiInsights = getAIInsights();

  // Gold / Silver
  const [metalName, setMetalName] = React.useState("24K Gold Bar");
  const [metalQty, setMetalQty] = React.useState("");
  const [metalStorage, setMetalStorage] = React.useState("Bank Locker");

  // Vehicle
  const [vehicleType, setVehicleType] = React.useState("Car");
  const [vehicleBrand, setVehicleBrand] = React.useState("");
  const [vehicleModel, setVehicleModel] = React.useState("");
  const [vehicleRegNo, setVehicleRegNo] = React.useState("");
  const [vehicleInsurance, setVehicleInsurance] = React.useState("");

  // Bank Account
  const [bankName, setBankName] = React.useState("");
  const [bankAccType, setBankAccType] = React.useState("Savings");
  const [bankBalance, setBankBalance] = React.useState("");
  const [bankInterest, setBankInterest] = React.useState("");

  // Fixed Deposit / RD
  const [fdBank, setFdBank] = React.useState("");
  const [fdAmount, setFdAmount] = React.useState("");
  const [fdInterest, setFdInterest] = React.useState("");
  const [fdMaturityAmount, setFdMaturityAmount] = React.useState("");
  const [fdMaturityDate, setFdMaturityDate] = React.useState("");

  // EPF / PPF / NPS
  const [epfEmployer, setEpfEmployer] = React.useState("");
  const [epfUan, setEpfUan] = React.useState("");
  const [epfBalance, setEpfBalance] = React.useState("");
  const [npsPran, setNpsPran] = React.useState("");
  const [npsManager, setNpsManager] = React.useState("SBI Pension Funds");

  // Crypto
  const [cryptoCoin, setCryptoCoin] = React.useState("Bitcoin");
  const [cryptoSymbol, setCryptoSymbol] = React.useState("BTC");
  const [cryptoQty, setCryptoQty] = React.useState("");
  const [cryptoPrice, setCryptoPrice] = React.useState("");
  const [cryptoExchange, setCryptoExchange] = React.useState("Binance");

  // Stock Specific States
  const [stockQuery, setStockQuery] = React.useState("");
  const [selectedStock, setSelectedStock] = React.useState("");
  const [stockRegion, setStockRegion] = React.useState("India (NSE/BSE)");
  const [stockQty, setStockQty] = React.useState("");
  const [stockAvgPrice, setStockAvgPrice] = React.useState("");
  const [stockInvestedAmount, setStockInvestedAmount] = React.useState("");
  const [stockDate, setStockDate] = React.useState("");
  const [showStockDropdown, setShowStockDropdown] = React.useState(false);

  // Mock Stock Search autocomplete data
  const mockStocks = [
    { name: "Reliance Industries", symbol: "RELIANCE", region: "India (NSE/BSE)", price: 2450 },
    { name: "Tata Motors", symbol: "TATAMOTORS", region: "India (NSE/BSE)", price: 920 },
    { name: "Infosys", symbol: "INFY", region: "India (NSE/BSE)", price: 1480 },
    { name: "Apple Inc.", symbol: "AAPL", region: "US (NYSE/NASDAQ)", price: 185 },
    { name: "Microsoft Corp.", symbol: "MSFT", region: "US (NYSE/NASDAQ)", price: 420 },
    { name: "Vercel Inc.", symbol: "VERCEL", region: "US (NYSE/NASDAQ)", price: 75 }
  ];

  const filteredStocks = mockStocks.filter(
    (s) =>
      s.name.toLowerCase().includes(stockQuery.toLowerCase()) ||
      s.symbol.toLowerCase().includes(stockQuery.toLowerCase())
  );

  const handleStockSelect = (stock: typeof mockStocks[0]) => {
    setSelectedStock(stock.name);
    setStockQuery(stock.name);
    setStockRegion(stock.region);
    setStockAvgPrice(stock.price.toString());
    setShowStockDropdown(false);
    triggerDraftSave();
  };

  // Stock calculations
  const stockQuantityNum = Number(stockQty) || 0;
  const stockPriceNum = Number(stockAvgPrice) || 0;
  const stockTotalValue = stockQuantityNum * stockPriceNum;

  // Goal Form States
  const [goalName, setGoalName] = React.useState("");
  const [goalCategory, setGoalCategory] = React.useState("");
  const [goalTargetAmount, setGoalTargetAmount] = React.useState("");
  const [goalSavedAmount, setGoalSavedAmount] = React.useState("");
  const [goalTargetDate, setGoalTargetDate] = React.useState("");
  const [goalStatus, setGoalStatus] = React.useState("Active");
  const [goalNotes, setGoalNotes] = React.useState("");

  const clearGoalFields = () => {
    setGoalName("");
    setGoalCategory("");
    setGoalTargetAmount("");
    setGoalSavedAmount("");
    setGoalTargetDate("");
    setGoalStatus("Active");
    setGoalNotes("");
  };

  // Essential / Emergency Form States
  const [essentialCategory, setEssentialCategory] = React.useState("");
  const [essentialCategoryId, setEssentialCategoryId] = React.useState("");
  const [essentialNote, setEssentialNote] = React.useState("");
  const [essentialInsurer, setEssentialInsurer] = React.useState("");
  const [essentialSumAssured, setEssentialSumAssured] = React.useState("");
  const [essentialPremium, setEssentialPremium] = React.useState("");
  const [essentialFrequency, setEssentialFrequency] = React.useState("YEARLY");
  const [essentialStartDate, setEssentialStartDate] = React.useState("");
  const [essentialRenewalDate, setEssentialRenewalDate] = React.useState("");
  const [essentialIsActive, setEssentialIsActive] = React.useState(true);

  const clearEssentialFields = () => {
    setEssentialCategory("");
    setEssentialCategoryId("");
    setEssentialNote("");
    setEssentialInsurer("");
    setEssentialSumAssured("");
    setEssentialPremium("");
    setEssentialFrequency("YEARLY");
    setEssentialStartDate("");
    setEssentialRenewalDate("");
    setEssentialIsActive(true);
  };

  const handleEssentialCategorySelect = (category: string, id: string) => {
    setEssentialCategory(category);
    setEssentialCategoryId(id);
    setStep(3);
    triggerDraftSave();
  };

  const isInsuranceCategory = (categoryName: string) => {
    if (!categoryName) return false;
    const name = categoryName.toLowerCase();
    return name.includes("insurance") || name.includes("cover") || name.includes("policy") || name.includes("life") || name.includes("accident");
  };

  // Generic asset error validation states
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const compileAssetPayload = () => {
    const selectedCategory = assetCategories.find((c) => c.code === assetCategory);

    const base: Record<string, any> = {
      categoryId: selectedCategory?.id || null,
      category_id: selectedCategory?.id || null,
      type: assetCategory,
      assetType,
      asset_type: assetType,
      appreciationRate: Number(assetRate) || 0,
      appreciation_rate: Number(assetRate) || 0,
      notes: assetNotes,
      note: assetNotes,
    };

    if (assetCategory === "PROPERTY") {
      base.name = propertyName;
      base.propertyType = propertyType;
      base.property_type = propertyType;
      base.purchaseValue = purchaseValue ? Number(purchaseValue) : null;
      base.purchase_value = purchaseValue ? Number(purchaseValue) : null;
      base.purchaseDate = purchaseDate || null;
      base.purchase_date = purchaseDate || null;
      base.currentMarketValue = currentMarketValue ? Number(currentMarketValue) : (purchaseValue ? Number(purchaseValue) : null);
      base.currentValue = currentMarketValue ? Number(currentMarketValue) : (purchaseValue ? Number(purchaseValue) : null);
      base.current_value = currentMarketValue ? Number(currentMarketValue) : (purchaseValue ? Number(purchaseValue) : null);
      base.ownershipPercent = Number(ownershipPercent) || 100;
      base.ownership_percent = Number(ownershipPercent) || 100;
      base.rentalIncome = Number(rentalIncome) || 0;
      base.rental_income = Number(rentalIncome) || 0;
    } else if (assetCategory === "GOLD") {
      base.name = `${goldType} Gold`;
      base.goldType = goldType;
      base.gold_type = goldType;
      base.carat = goldCarat ? Number(goldCarat.replace("k", "")) : null;
      base.weightInGrams = goldWeight ? Number(goldWeight) : null;
      base.weight_in_grams = goldWeight ? Number(goldWeight) : null;
      base.purchaseValue = purchaseValue ? Number(purchaseValue) : null;
      base.purchase_value = purchaseValue ? Number(purchaseValue) : null;
      base.purchaseDate = purchaseDate || null;
      base.purchase_date = purchaseDate || null;
      base.currentMarketValue = currentMarketValue ? Number(currentMarketValue) : (purchaseValue ? Number(purchaseValue) : null);
      base.currentValue = currentMarketValue ? Number(currentMarketValue) : (purchaseValue ? Number(purchaseValue) : null);
      base.current_value = currentMarketValue ? Number(currentMarketValue) : (purchaseValue ? Number(purchaseValue) : null);
    } else if (assetCategory === "STOCK") {
      base.name = stockQuery;
      base.stockQty = Number(stockQty) || 0;
      base.stockAvgPrice = Number(stockAvgPrice) || 0;
      base.purchaseValue = Number(stockInvestedAmount) || (Number(stockQty) * Number(stockAvgPrice)) || 0;
      base.purchase_value = Number(stockInvestedAmount) || (Number(stockQty) * Number(stockAvgPrice)) || 0;
      base.purchaseDate = stockDate;
      base.purchase_date = stockDate;
      base.currentMarketValue = stockTotalValue;
      base.currentValue = stockTotalValue;
      base.current_value = stockTotalValue;
      base.stockRegion = stockRegion;
    } else if (assetCategory === "SILVER") {
      base.name = `${silverType} Silver`;
      base.silverType = silverType;
      base.silver_type = silverType;
      base.weightInGrams = silverWeight ? Number(silverWeight) : null;
      base.weight_in_grams = silverWeight ? Number(silverWeight) : null;
      base.purchaseValue = purchaseValue ? Number(purchaseValue) : null;
      base.purchase_value = purchaseValue ? Number(purchaseValue) : null;
      base.purchaseDate = purchaseDate || null;
      base.purchase_date = purchaseDate || null;
      base.currentMarketValue = currentMarketValue ? Number(currentMarketValue) : (purchaseValue ? Number(purchaseValue) : null);
      base.currentValue = currentMarketValue ? Number(currentMarketValue) : (purchaseValue ? Number(purchaseValue) : null);
      base.current_value = currentMarketValue ? Number(currentMarketValue) : (purchaseValue ? Number(purchaseValue) : null);
    } else if (assetCategory === "VEHICLE") {
      base.name = vehicleName;
      base.vehicleName = vehicleName;
      base.vehicle_name = vehicleName;
      base.vehicleType = vehicleType;
      base.vehicle_type = vehicleType;
      base.vehicleBrand = vehicleBrand || null;
      base.vehicle_brand = vehicleBrand || null;
      base.vehicleModelName = vehicleModel || null;
      base.vehicle_model_name = vehicleModel || null;
      base.purchaseValue = purchaseValue ? Number(purchaseValue) : null;
      base.purchase_value = purchaseValue ? Number(purchaseValue) : null;
      base.purchaseDate = purchaseDate || null;
      base.purchase_date = purchaseDate || null;
      base.currentMarketValue = currentMarketValue ? Number(currentMarketValue) : (purchaseValue ? Number(purchaseValue) : null);
      base.currentValue = currentMarketValue ? Number(currentMarketValue) : (purchaseValue ? Number(purchaseValue) : null);
      base.current_value = currentMarketValue ? Number(currentMarketValue) : (purchaseValue ? Number(purchaseValue) : null);
    } else if (assetCategory === "LIQUID_CASH") {
      base.name = "Liquid Cash";
      base.purchaseValue = currentMarketValue ? Number(currentMarketValue) : null;
      base.purchase_value = currentMarketValue ? Number(currentMarketValue) : null;
      base.currentMarketValue = currentMarketValue ? Number(currentMarketValue) : null;
      base.currentValue = currentMarketValue ? Number(currentMarketValue) : null;
      base.current_value = currentMarketValue ? Number(currentMarketValue) : null;
      base.purchaseDate = purchaseDate || null;
      base.purchase_date = purchaseDate || null;
    } else if (assetCategory === "OTHERS") {
      base.name = metalName;
      base.purchaseValue = currentMarketValue ? Number(currentMarketValue) : null;
      base.purchase_value = currentMarketValue ? Number(currentMarketValue) : null;
      base.currentMarketValue = currentMarketValue ? Number(currentMarketValue) : null;
      base.currentValue = currentMarketValue ? Number(currentMarketValue) : null;
      base.current_value = currentMarketValue ? Number(currentMarketValue) : null;
      base.purchaseDate = purchaseDate || null;
      base.purchase_date = purchaseDate || null;
    } else if (assetCategory === "SAVINGS_BANK_ACCOUNT") {
      base.name = bankName;
      base.bankName = bankName;
      base.bank_name = bankName;
      base.bankAccType = bankAccType;
      base.bankAccountType = bankAccType;
      base.bank_account_type = bankAccType;
      base.bankBalance = currentMarketValue ? Number(currentMarketValue) : null;
      base.bankInterest = assetRate ? Number(assetRate) : null;
      base.bankInterestRate = assetRate ? Number(assetRate) : null;
      base.bank_interest_rate = assetRate ? Number(assetRate) : null;
      base.currentMarketValue = currentMarketValue ? Number(currentMarketValue) : null;
      base.currentValue = currentMarketValue ? Number(currentMarketValue) : null;
      base.current_value = currentMarketValue ? Number(currentMarketValue) : null;
    } else if (assetCategory === "FIXED_DEPOSIT" || assetCategory === "RD") {
      base.name = `${assetCategory === "FIXED_DEPOSIT" ? "FD" : "RD"} - ${fdBank}`;
      base.fdBank = fdBank;
      base.fdAmount = Number(fdAmount) || 0;
      base.fdInterest = Number(fdInterest) || 0;
      base.fdMaturityAmount = Number(fdMaturityAmount) || 0;
      base.fdMaturityDate = fdMaturityDate;
      base.currentMarketValue = Number(fdAmount) || 0;
      base.currentValue = Number(fdAmount) || 0;
      base.current_value = Number(fdAmount) || 0;
    } else if (assetCategory === "EPF" || assetCategory === "PPF") {
      base.name = `${assetCategory} Account`;
      base.epfEmployer = epfEmployer;
      base.epfUan = epfUan;
      base.epfBalance = Number(epfBalance) || 0;
      base.currentMarketValue = Number(epfBalance) || 0;
      base.currentValue = Number(epfBalance) || 0;
      base.current_value = Number(epfBalance) || 0;
    } else if (assetCategory === "NPS") {
      base.name = "NPS Pension Fund";
      base.npsPran = npsPran;
      base.npsManager = npsManager;
      base.currentMarketValue = Number(purchaseValue) || 0;
      base.currentValue = Number(purchaseValue) || 0;
      base.current_value = Number(purchaseValue) || 0;
    } else if (assetCategory === "CRYPTO") {
      base.name = `${cryptoCoin} Wallet`;
      base.cryptoCoin = cryptoCoin;
      base.cryptoSymbol = cryptoSymbol;
      base.cryptoQty = Number(cryptoQty) || 0;
      base.cryptoPrice = Number(cryptoPrice) || 0;
      base.cryptoExchange = cryptoExchange;
      base.currentMarketValue = (Number(cryptoQty) || 0) * (Number(cryptoPrice) || 0);
      base.currentValue = (Number(cryptoQty) || 0) * (Number(cryptoPrice) || 0);
      base.current_value = (Number(cryptoQty) || 0) * (Number(cryptoPrice) || 0);
    } else {
      base.name = metalName || "Generic Asset";
      base.purchaseValue = Number(purchaseValue) || 0;
      base.purchase_value = Number(purchaseValue) || 0;
      base.purchaseDate = purchaseDate;
      base.purchase_date = purchaseDate;
      base.currentMarketValue = Number(currentMarketValue) || (Number(purchaseValue) || 0);
      base.currentValue = Number(currentMarketValue) || (Number(purchaseValue) || 0);
      base.current_value = Number(currentMarketValue) || (Number(purchaseValue) || 0);
      base.ownershipPercent = Number(ownershipPercent) || 100;
      base.ownership_percent = Number(ownershipPercent) || 100;
    }
    return base;
  };

  const compileDebtPayload = () => {
    const selectedCategory = debtCategories.find((c) => c.code === debtCategory);
    return {
      categoryId: selectedCategory?.id || null,
      category_id: selectedCategory?.id || null,
      debtCategory,
      loanName,
      lendingBank,
      loanAccountNumber,
      loanStatus,
      sanctionedAmount: Number(sanctionedAmount) || 0,
      outstandingPrincipal: Number(outstandingPrincipal) || 0,
      loanInterestRate: Number(loanInterestRate) || 0,
      loanTenureValue: Number(loanTenureValue) || 0,
      loanTenureUnit: "Months",
      loanStartDate,
      loanEndDate,
      emiAmountInput: Number(emiAmountInput) || 0,
      emiDueDate,
      prepaymentAllowed: prepaymentAllowed === "Yes",
      interestRateType,
      coBorrower,
      linkedAsset,
      notes: loanNotes,
    };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple inline validation checks
    const valErrors: Record<string, string> = {};
    if (recordType === "Asset") {
      if (!assetCategory) {
        valErrors.category = "Please select an asset category.";
      }

      if (assetCategory === "PROPERTY") {
        if (!propertyName.trim()) valErrors.propertyName = "Property name is required.";
        if (!assetRate) {
          valErrors.assetRate = `${assetType === "APPRECIATION" ? "Appreciation" : "Depreciation"} rate is required.`;
        }
        if (!propertyType) {
          valErrors.propertyType = "Property type is required.";
        }
      } else if (assetCategory === "GOLD") {
        if (!assetRate) {
          valErrors.assetRate = `${assetType === "APPRECIATION" ? "Appreciation" : "Depreciation"} rate is required.`;
        }
      } else if (assetCategory === "SILVER") {
        if (!assetRate) {
          valErrors.assetRate = `${assetType === "APPRECIATION" ? "Appreciation" : "Depreciation"} rate is required.`;
        }
        if (!silverWeight) {
          valErrors.silverWeight = "Weight is required.";
        }
      } else if (assetCategory === "VEHICLE") {
        if (!assetRate) {
          valErrors.assetRate = `${assetType === "APPRECIATION" ? "Appreciation" : "Depreciation"} rate is required.`;
        }
        if (!vehicleType) {
          valErrors.vehicleType = "Vehicle type is required.";
        }
        if (!vehicleName.trim()) {
          valErrors.vehicleName = "Vehicle name is required.";
        }
      } else if (assetCategory === "LIQUID_CASH") {
        if (!assetRate) {
          valErrors.assetRate = `${assetType === "APPRECIATION" ? "Appreciation" : "Depreciation"} rate is required.`;
        }
        if (!currentMarketValue) {
          valErrors.currentMarketValue = "Current Market Value is required.";
        }
      } else if (assetCategory === "OTHERS") {
        if (!assetRate) {
          valErrors.assetRate = `${assetType === "APPRECIATION" ? "Appreciation" : "Depreciation"} rate is required.`;
        }
        if (!metalName.trim()) {
          valErrors.assetName = "Asset name is required.";
        }
      } else if (assetCategory === "SAVINGS_BANK_ACCOUNT") {
        if (!assetRate) {
          valErrors.assetRate = `${assetType === "APPRECIATION" ? "Appreciation" : "Depreciation"} rate is required.`;
        }
        if (!bankName.trim()) {
          valErrors.bankName = "Bank name is required.";
        }
        if (!bankAccType) {
          valErrors.bankAccType = "Account type is required.";
        }
        if (!currentMarketValue) {
          valErrors.currentMarketValue = "Current Market Value is required.";
        }
      } else if (assetCategory === "STOCK") {
        if (!stockQuery.trim()) valErrors.stockName = "Stock name is required.";
        if (!stockQty) valErrors.stockQty = "Quantity is required.";
        if (!stockAvgPrice) valErrors.stockPrice = "Average price is required.";
        if (!stockInvestedAmount) valErrors.invested = "Invested amount is required.";
      } else {
        // Generic asset category required check
        if (!metalName.trim()) valErrors.assetName = "Asset name is required.";
      }
    }

    if (recordType === "Debt") {
      if (!loanName.trim()) valErrors.loanName = "Loan name is required.";
      if (!lendingBank.trim()) valErrors.lendingBank = "Lender Name is required.";

      const sancAmt = Number(sanctionedAmount) || 0;
      const outAmt = Number(outstandingPrincipal) || 0;
      const rate = Number(loanInterestRate) || 0;
      const tenure = Number(loanTenureValue) || 0;
      const emiVal = Number(emiAmountInput) || 0;

      if (sancAmt <= 0) valErrors.sanctionedAmount = "Principal is required.";
      if (outAmt <= 0) {
        valErrors.outstandingPrincipal = "Outstanding is required.";
      } else if (outAmt > sancAmt) {
        valErrors.outstandingPrincipal = "Outstanding cannot exceed Principal.";
      }

      if (rate <= 0) valErrors.loanInterestRate = "Interest rate is required.";
      if (tenure <= 0) valErrors.loanTenureValue = "Tenure is required.";
      if (emiVal <= 0) valErrors.emiAmount = "EMI Amount is required.";
      if (!loanStartDate) valErrors.loanStartDate = "Start date is required.";
      if (!loanEndDate) valErrors.loanEndDate = "End date is required.";
    }

    if (recordType === "Investment") {
      if (!investmentCategory) valErrors.investmentCategory = "Category is required.";
      if (!investmentName.trim()) valErrors.investmentName = "Investment name is required.";
      if (!investmentSymbol.trim()) valErrors.investmentSymbol = "Symbol is required.";
      if (!investmentUnits || Number(investmentUnits) <= 0) valErrors.investmentUnits = "Units must be positive.";
      if (!investmentBuyPrice || Number(investmentBuyPrice) <= 0) valErrors.investmentBuyPrice = "Buy Price must be positive.";
      if (!investmentCurrentPrice || Number(investmentCurrentPrice) <= 0) valErrors.investmentCurrentPrice = "Current Price must be positive.";
      if (!investmentInvestedAmount || Number(investmentInvestedAmount) <= 0) valErrors.investmentInvestedAmount = "Invested Amount must be positive.";
      if (!investmentCurrentValue || Number(investmentCurrentValue) <= 0) valErrors.investmentCurrentValue = "Current Value must be positive.";
      if (!investmentExpectedReturn || Number(investmentExpectedReturn) <= 0) valErrors.investmentExpectedReturn = "Expected Return must be positive.";
      if (!investmentStartDate) valErrors.investmentStartDate = "Start date is required.";
      if (!investmentMaturityDate) valErrors.investmentMaturityDate = "Maturity date is required.";

      if (investmentIsSip === "Yes") {
        if (!investmentSipAmount || Number(investmentSipAmount) <= 0) valErrors.investmentSipAmount = "SIP Amount is required.";
        if (!investmentSipFrequency) valErrors.investmentSipFrequency = "SIP Frequency is required.";
      }
    }

    if (recordType === "Goal") {
      if (!goalName.trim()) valErrors.goalName = "Goal Name is required.";
      if (!goalCategory) valErrors.goalCategory = "Goal Category is required.";
      if (!goalTargetAmount || Number(goalTargetAmount) <= 0) {
        valErrors.goalTargetAmount = "Target Amount is required and must be positive.";
      }
      if (goalSavedAmount === "") {
        valErrors.goalSavedAmount = "Saved Amount is required.";
      } else if (Number(goalSavedAmount) < 0) {
        valErrors.goalSavedAmount = "Saved Amount cannot be negative.";
      }
      if (!goalTargetDate) valErrors.goalTargetDate = "Target Date is required.";
    }

    if (recordType === "Emergency") {
      if (!essentialCategoryId) valErrors.essentialCategory = "Essential Category is required.";
      const isPolicy = isInsuranceCategory(essentialCategory);
      if (isPolicy) {
        if (!essentialInsurer.trim()) valErrors.essentialInsurer = "Insurer name is required.";
        if (!essentialSumAssured || Number(essentialSumAssured) <= 0) valErrors.essentialSumAssured = "Sum assured must be positive.";
        if (!essentialPremium || Number(essentialPremium) <= 0) valErrors.essentialPremium = "Premium must be positive.";
      } else {
        if (!essentialSumAssured || Number(essentialSumAssured) <= 0) valErrors.essentialSumAssured = "Amount is required and must be positive.";
      }
    }

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      if (recordType === "Asset") {
        const payload = compileAssetPayload();
        await apiClient.post("/v1/asset", payload);
      } else if (recordType === "Debt") {
        const payload = compileDebtPayload();
        await apiClient.post("/v1/debt", payload);
      } else if (recordType === "Investment") {
        const payload = {
          name: investmentName,
          type: investmentCategory,
          symbol: investmentSymbol,
          units: Number(investmentUnits) || 0,
          buyPrice: Number(investmentBuyPrice) || 0,
          currentPrice: Number(investmentCurrentPrice) || 0,
          investedAmount: Number(investmentInvestedAmount) || 0,
          currentValue: Number(investmentCurrentValue) || 0,
          expectedReturnPct: Number(investmentExpectedReturn) || 0,
          startDate: investmentStartDate,
          isSip: investmentIsSip === "Yes",
          sipAmount: investmentIsSip === "Yes" ? (Number(investmentSipAmount) || 0) : null,
          sipFrequency: investmentIsSip === "Yes" ? investmentSipFrequency : null,
          maturityDate: investmentMaturityDate,
          notes: investmentNotes
        };
        await apiClient.post("/v1/investment", payload);
      } else if (recordType === "Goal") {
        const selectedCat = goalCategories.find((c) => c.code === goalCategory);
        const payload = {
          name: goalName,
          categoryId: selectedCat?.id || null,
          targetAmount: Number(goalTargetAmount) || 0,
          savedAmount: Number(goalSavedAmount) || 0,
          targetDate: goalTargetDate || null,
          status: goalStatus,
          notes: goalNotes
        };
        await apiClient.post("/v1/goal", payload);
      } else if (recordType === "Emergency") {
        const isPolicy = isInsuranceCategory(essentialCategory);
        const payload: any = {
          categoryId: essentialCategoryId,
          categoryName: essentialCategory.replace(/_/g, " "),
          note: essentialNote
        };
        if (isPolicy) {
          payload.insurer = essentialInsurer;
          payload.sumAssured = Number(essentialSumAssured) || 0;
          payload.premium = Number(essentialPremium) || 0;
          payload.frequency = essentialFrequency;
          payload.startDate = essentialStartDate || null;
          payload.renewalDate = essentialRenewalDate || null;
          payload.isActive = essentialIsActive;
        }
        await apiClient.post("/v1/essential", payload);
      } else {
        const typeStr = ((recordType as any) || "").toLowerCase();
        await apiClient.post(`/wealth/${typeStr}`, {
          recordType,
          notes: assetNotes,
        });
      }

      showSuccess("Success", "Record created and added to portfolio registry successfully!");

      // Reset steps and values, close drawer
      setStep(1);
      setRecordType(null);
      setAssetCategory("");
      setDebtCategory("");
      setAssetRate("");
      setAssetNotes("");
      clearDebtFields();
      clearInvestmentFields();
      clearGoalFields();
      clearEssentialFields();
      onClose();
    } catch (err: any) {
      console.error("Error saving record:", err);
      showWarning("Warning", "Failed to save record to backend API: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const clearDebtFields = () => {
    setLoanName("");
    setLendingBank("");
    setLoanAccountNumber("");
    setSanctionedAmount("");
    setOutstandingPrincipal("");
    setLoanInterestRate("");
    setLoanTenureValue("");
    setLoanStartDate("");
    setLoanEndDate("");
    setEmiAmountInput("");
    setEmiDueDate("");
    setCoBorrower("");
    setLoanNotes("");
  };

  const clearInvestmentFields = () => {
    setInvestmentCategory("");
    setInvestmentName("");
    setInvestmentNotes("");
    setInvestmentSymbol("");
    setInvestmentUnits("");
    setInvestmentBuyPrice("");
    setInvestmentCurrentPrice("");
    setInvestmentInvestedAmount("");
    setInvestmentCurrentValue("");
    setInvestmentExpectedReturn("");
    setInvestmentStartDate("");
    setInvestmentIsSip("No");
    setInvestmentSipAmount("");
    setInvestmentSipFrequency("Monthly");
    setInvestmentMaturityDate("");
  };

  const handleSaveAndAddAnother = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors: Record<string, string> = {};
    if (recordType === "Debt") {
      if (!loanName.trim()) valErrors.loanName = "Loan name is required.";
      if (!lendingBank.trim()) valErrors.lendingBank = "Lender Name is required.";

      const sancAmt = Number(sanctionedAmount) || 0;
      const outAmt = Number(outstandingPrincipal) || 0;
      const rate = Number(loanInterestRate) || 0;
      const tenure = Number(loanTenureValue) || 0;
      const emiVal = Number(emiAmountInput) || 0;

      if (sancAmt <= 0) valErrors.sanctionedAmount = "Principal is required.";
      if (outAmt <= 0) {
        valErrors.outstandingPrincipal = "Outstanding is required.";
      } else if (outAmt > sancAmt) {
        valErrors.outstandingPrincipal = "Outstanding cannot exceed Principal.";
      }

      if (rate <= 0) valErrors.loanInterestRate = "Interest rate is required.";
      if (tenure <= 0) valErrors.loanTenureValue = "Tenure is required.";
      if (emiVal <= 0) valErrors.emiAmount = "EMI Amount is required.";
      if (!loanStartDate) valErrors.loanStartDate = "Start date is required.";
      if (!loanEndDate) valErrors.loanEndDate = "End date is required.";
    }

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      if (recordType === "Debt") {
        const payload = compileDebtPayload();
        await apiClient.post("/v1/debt", payload);
      }
      showSuccess("Success", "Record created successfully! Enter details for the next record.");
      clearDebtFields();
      setStep(2);
    } catch (err: any) {
      console.error("Error saving record:", err);
      showWarning("Warning", "Failed to save record to backend API: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordTypeSelect = (type: "Asset" | "Debt" | "Investment" | "Goal" | "Emergency") => {
    setRecordType(type);
    if (type === "Asset" || type === "Debt" || type === "Investment" || type === "Goal" || type === "Emergency") {
      setStep(2);
    } else {
      // Direct placeholders for non-assets
      setStep(3);
    }
  };

  const handleInvestmentCategorySelect = (category: string) => {
    setInvestmentCategory(category);
    const found = investmentCategories.find((c) => c.code === category);
    setInvestmentExpectedReturn(found?.defaultRate || "10");
    setStep(3);
  };

  const handleGoalCategorySelect = (category: string) => {
    setGoalCategory(category);
    setStep(3);
    triggerDraftSave();
  };

  const handleInvestmentUnitsChange = (val: string) => {
    setInvestmentUnits(val);
    calculateInvestedAndCurrentValue(val, investmentBuyPrice, investmentCurrentPrice);
  };

  const handleInvestmentBuyPriceChange = (val: string) => {
    setInvestmentBuyPrice(val);
    calculateInvestedAndCurrentValue(investmentUnits, val, investmentCurrentPrice);
  };

  const handleInvestmentCurrentPriceChange = (val: string) => {
    setInvestmentCurrentPrice(val);
    calculateInvestedAndCurrentValue(investmentUnits, investmentBuyPrice, val);
  };

  const calculateInvestedAndCurrentValue = (u: string, bp: string, cp: string) => {
    const unitsVal = Number(u);
    const buyPriceVal = Number(bp);
    const currentPriceVal = Number(cp);
    if (!isNaN(unitsVal) && unitsVal > 0) {
      if (!isNaN(buyPriceVal) && buyPriceVal > 0) {
        setInvestmentInvestedAmount((unitsVal * buyPriceVal).toFixed(2));
      }
      if (!isNaN(currentPriceVal) && currentPriceVal > 0) {
        setInvestmentCurrentValue((unitsVal * currentPriceVal).toFixed(2));
      }
    }
  };

  const handleDebtCategorySelect = (category: string) => {
    setDebtCategory(category);
    setStep(3);
  };

  const handleAssetCategorySelect = (category: string) => {
    setAssetCategory(category);

    // Auto-set Asset Type: Depreciation for VEHICLE, Appreciation for others
    if (category === "VEHICLE") {
      setAssetType("DEPRECIATION");
    } else {
      setAssetType("APPRECIATION");
    }

    // Prefill default rate
    const found = assetCategories.find((c) => c.code === category);
    setAssetRate(found?.defaultRate || "5");

    setStep(3);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer panel */}
      <div className="relative flex flex-col h-screen w-full max-w-[540px] bg-white border-l border-zinc-200 shadow-2xl z-10 transition-transform duration-300 transform translate-x-0 animate-in slide-in-from-right overflow-hidden">

        {/* Sticky Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-zinc-150/70 bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-sm font-black text-zinc-900 leading-none">Add Financial Record</h3>
              <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                {step === 1 ? "What would you like to add?" : step === 2 ? "Select Category" : "Fill out details"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showDraftBadge && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-zinc-400 bg-zinc-100 rounded-full px-2 py-0.5 animate-pulse">
                <BookmarkCheck className="h-3 w-3" /> Draft Saved
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-650 transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">

          {/* ==========================================
              Step 1: Choose Record Type
              ========================================== */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <button
                  onClick={() => handleRecordTypeSelect("Asset")}
                  className="rounded-xl border border-zinc-200 p-4 text-left hover:border-blue-600 hover:bg-blue-50/5/20 transition-all outline-none group"
                >
                  <Home className="h-6 w-6 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                  <h4 className="text-xs font-black text-zinc-900 mt-2.5">Asset</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Physical properties, cash balances, or items that appreciate/depreciate in value.
                  </p>
                </button>

                <button
                  onClick={() => handleRecordTypeSelect("Debt")}
                  className="rounded-xl border border-zinc-200 p-4 text-left hover:border-blue-600 hover:bg-blue-50/5 transition-all outline-none group"
                >
                  <CreditCard className="h-6 w-6 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                  <h4 className="text-xs font-black text-zinc-900 mt-2.5">Debt / Liability</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Active mortgages, credit card outstandings, or personal family loans.
                  </p>
                </button>

                <button
                  onClick={() => handleRecordTypeSelect("Investment")}
                  className="rounded-xl border border-zinc-200 p-4 text-left hover:border-blue-600 hover:bg-blue-50/5 transition-all outline-none group"
                >
                  <TrendingUp className="h-6 w-6 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                  <h4 className="text-xs font-black text-zinc-900 mt-2.5">Investment</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Public equity indices, target mutual funds, or gold commodity SIP bonds.
                  </p>
                </button>

                <button
                  onClick={() => handleRecordTypeSelect("Goal")}
                  className="rounded-xl border border-zinc-200 p-4 text-left hover:border-blue-600 hover:bg-blue-50/5 transition-all outline-none group cursor-pointer"
                >
                  <Target className="h-6 w-6 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                  <h4 className="text-xs font-black text-zinc-900 mt-2.5">Financial Goal</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Shared family travel targets, emergency buffer goals, or retirement planning.
                  </p>
                </button>

                <button
                  onClick={() => handleRecordTypeSelect("Emergency")}
                  className="rounded-xl border border-zinc-200 p-4 text-left hover:border-blue-600 hover:bg-blue-50/5 transition-all outline-none group cursor-pointer"
                >
                  <ShieldCheck className="h-6 w-6 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                  <h4 className="text-xs font-black text-zinc-900 mt-2.5">Essentials</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Safety reserves buffer, term life insurance policies, or will nomination plans.
                  </p>
                </button>

              </div>
            </div>
          )}

          {step === 2 && (recordType === "Asset" || recordType === "Debt" || recordType === "Investment" || recordType === "Goal" || recordType === "Emergency") && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-650 flex items-center outline-none"
                >
                  <ChevronLeft className="h-4 w-4 mr-0.5" /> Back
                </button>
              </div>

              <span className="text-[10px] font-black text-zinc-400 tracking-wider block">
                Choose {recordType} Category
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recordType === "Asset" ? (
                  assetCategories.map((c) => {
                    return (
                      <button
                        key={c.code}
                        onClick={() => handleAssetCategorySelect(c.code)}
                        className="flex items-center gap-3 rounded-xl border border-zinc-200 p-2.5 bg-white hover:border-blue-600 hover:bg-blue-50/10 hover:shadow-xs transition-all outline-none group cursor-pointer"
                      >
                        <span className="text-xs font-bold text-zinc-900 group-hover:text-blue-900 transition-colors">{c.label}</span>
                      </button>
                    );
                  })
                ) : recordType === "Debt" ? (
                  debtCategories.map((c) => {
                    return (
                      <button
                        key={c.code}
                        onClick={() => handleDebtCategorySelect(c.code)}
                        className="flex items-center gap-3 rounded-xl border border-zinc-200 p-2.5 bg-white hover:border-blue-600 hover:bg-blue-50/10 hover:shadow-xs transition-all outline-none group cursor-pointer"
                      >
                        <span className="text-xs font-bold text-zinc-900 group-hover:text-blue-900 transition-colors">{c.label}</span>
                      </button>
                    );
                  })
                ) : recordType === "Investment" ? (
                  investmentCategories.map((c) => {
                    return (
                      <button
                        key={c.code}
                        onClick={() => handleInvestmentCategorySelect(c.code)}
                        className="flex items-center gap-3 rounded-xl border border-zinc-200 p-2.5 bg-white hover:border-blue-600 hover:bg-blue-50/10 hover:shadow-xs transition-all outline-none group cursor-pointer"
                      >
                        <span className="text-xs font-bold text-zinc-900 group-hover:text-blue-900 transition-colors">{c.label}</span>
                      </button>
                    );
                  })
                ) : recordType === "Goal" ? (
                  goalCategories.map((c) => {
                    return (
                      <button
                        key={c.code}
                        onClick={() => handleGoalCategorySelect(c.code)}
                        className="flex items-center gap-3 rounded-xl border border-zinc-200 p-2.5 bg-white hover:border-blue-600 hover:bg-blue-50/10 hover:shadow-xs transition-all outline-none group cursor-pointer"
                      >
                        <span className="text-xs font-bold text-zinc-900 group-hover:text-blue-900 transition-colors">{c.label}</span>
                      </button>
                    );
                  })
                ) : (
                  essentialCategories.map((c) => {
                    return (
                      <button
                        key={c.code}
                        onClick={() => handleEssentialCategorySelect(c.code, c.id)}
                        className="flex items-center gap-3 rounded-xl border border-zinc-200 p-2.5 bg-white hover:border-blue-600 hover:bg-blue-50/10 hover:shadow-xs transition-all outline-none group cursor-pointer"
                      >
                        <span className="text-xs font-bold text-zinc-900 group-hover:text-blue-900 transition-colors">{c.label}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ==========================================
              Step 3: Dynamic Category-Specific Forms
              ========================================== */}
          {step === 3 && (
            <div className="space-y-6">

              {/* Back controls */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <button
                  onClick={() => {
                    if (recordType === "Asset" || recordType === "Debt" || recordType === "Investment" || recordType === "Goal") {
                      setStep(2);
                    } else {
                      setStep(1);
                    }
                  }}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-650 flex items-center outline-none"
                >
                  <ChevronLeft className="h-4 w-4 mr-0.5" /> Back to Category
                </button>

              </div>

              {/* DYNAMIC FORMS ACCORDING TO SELECTION */}

              {recordType === "Asset" ? (
                <form onSubmit={handleSave} className="space-y-4 text-xs">

                  {/* Selected Category, Type, and Rate row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-zinc-100 pb-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-500">Selected Category *</label>
                      <div className="h-9 w-full rounded-lg border border-zinc-250 bg-zinc-100/60 px-3 flex items-center font-bold text-zinc-650 text-[11px] tracking-wide select-none">
                        {assetCategories.find((c) => c.code === assetCategory)?.label || assetCategory.replace("_", " ")}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-500">Asset Type *</label>
                      <Select
                        value={assetType}
                        onChange={(e) => { 
                          const newType = e.target.value as "APPRECIATION" | "DEPRECIATION";
                          setAssetType(newType); 
                          triggerDraftSave(); 
                        }}
                        className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 font-bold cursor-pointer text-[11px] focus:border-blue-500 focus:bg-white"
                      >
                        <option value="APPRECIATION">APPRECIATION</option>
                        <option value="DEPRECIATION">DEPRECIATION</option>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-500">
                        {assetType === "APPRECIATION" ? "Appreciation Rate (%) *" : "Depreciation Rate (%) *"}
                      </label>
                      <input
                        type="number"
                        placeholder="E.g. 5"
                        value={assetRate}
                        onChange={(e) => { setAssetRate(e.target.value); triggerDraftSave(); }}
                        className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white font-semibold"
                      />
                      {errors.assetRate && <span className="text-[10px] text-red-500">{errors.assetRate}</span>}
                    </div>
                  </div>

                  {/* Category = PROPERTY */}
                  {assetCategory === "PROPERTY" && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Property Name *</label>
                        <input
                          type="text"
                          placeholder="E.g. Sea-face 2BHK flat"
                          value={propertyName}
                          onChange={(e) => { setPropertyName(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.propertyName && <span className="text-[10px] text-red-500">{errors.propertyName}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Property Type *</label>
                        <Select
                          value={propertyType}
                          onChange={(e) => { setPropertyType(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer"
                        >
                          <option value="Apartment">Apartment</option>
                          <option value="Independent House">Independent House</option>
                          <option value="Villa">Villa</option>
                          <option value="Residential Plot">Residential Plot</option>
                          <option value="Commercial Office">Commercial Office</option>
                          <option value="Commercial Shop">Commercial Shop</option>
                          <option value="Warehouse">Warehouse</option>
                          <option value="Industrial Land">Industrial Land</option>
                          <option value="Agricultural Land">Agricultural Land</option>
                          <option value="Other">Other</option>
                        </Select>
                        {errors.propertyType && <span className="text-[10px] text-red-500">{errors.propertyType}</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Purchase Value</label>
                          <input
                            type="number"
                            placeholder="Amount in INR"
                            value={purchaseValue}
                            onChange={(e) => { setPurchaseValue(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Purchase Date</label>
                          <input
                            type="date"
                            value={purchaseDate}
                            onChange={(e) => { setPurchaseDate(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 text-zinc-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Current Market Value</label>
                        <input
                          type="number"
                          placeholder="Current valuation"
                          value={currentMarketValue}
                          onChange={(e) => { setCurrentMarketValue(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* Category = STOCK */}
                  {assetCategory === "STOCK" && (
                    <div className="space-y-4">

                      {/* Search stock query */}
                      <div className="space-y-1 relative">
                        <label className="font-semibold text-zinc-500">Stock Name / Symbol *</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search company (e.g. Reliance, Tata, Apple)..."
                            value={stockQuery}
                            onChange={(e) => {
                              setStockQuery(e.target.value);
                              setShowStockDropdown(true);
                              triggerDraftSave();
                            }}
                            className="w-full h-9 rounded-lg border border-zinc-200 pl-3 pr-8 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                          />
                          <Search className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
                        </div>
                        {errors.stockName && <span className="text-[10px] text-red-500">{errors.stockName}</span>}

                        {/* Autocomplete Dropdown list */}
                        {showStockDropdown && stockQuery && (
                          <div className="absolute left-0 right-0 mt-1 max-h-36 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-1 shadow-lg z-50">
                            {filteredStocks.length > 0 ? (
                              filteredStocks.map((stock) => (
                                <button
                                  type="button"
                                  key={stock.symbol}
                                  onClick={() => handleStockSelect(stock)}
                                  className="w-full px-3 py-2 text-left hover:bg-zinc-50 rounded text-[11px] font-semibold text-zinc-950 flex justify-between"
                                >
                                  <span>{stock.name} ({stock.symbol})</span>
                                  <span className="text-zinc-400">{stock.region}</span>
                                </button>
                              ))
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStock(stockQuery);
                                  setShowStockDropdown(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-zinc-50 rounded text-[11px] font-semibold text-blue-600"
                              >
                                Use manual entry: "{stockQuery}"
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Market Region *</label>
                          <Select
                            value={stockRegion}
                            onChange={(e) => { setStockRegion(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer"
                          >
                            <option value="India (NSE/BSE)">India (NSE/BSE)</option>
                            <option value="US (NYSE/NASDAQ)">US (NYSE/NASDAQ)</option>
                            <option value="Europe">Europe</option>
                            <option value="UK">UK</option>
                            <option value="Other">Other</option>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Quantity *</label>
                          <input
                            type="number"
                            placeholder="Shares count"
                            value={stockQty}
                            onChange={(e) => { setStockQty(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                          {errors.stockQty && <span className="text-[10px] text-red-500">{errors.stockQty}</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Current Average Price *</label>
                          <input
                            type="number"
                            placeholder="Average share price"
                            value={stockAvgPrice}
                            onChange={(e) => { setStockAvgPrice(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                          {errors.stockPrice && <span className="text-[10px] text-red-500">{errors.stockPrice}</span>}
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-550 flex items-center gap-1">
                            Total Value <span title="Quantity × Price" className="cursor-help"><Info className="h-3 w-3 text-zinc-400" /></span>
                          </label>
                          <input
                            type="text"
                            disabled
                            value={formatCurrency(stockTotalValue)}
                            className="w-full h-9 rounded-lg border border-zinc-250 bg-zinc-100/70 px-3 text-zinc-500 outline-none font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Invested Capital *</label>
                          <input
                            type="number"
                            placeholder="Total principal invested"
                            value={stockInvestedAmount}
                            onChange={(e) => { setStockInvestedAmount(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                          {errors.invested && <span className="text-[10px] text-red-500">{errors.invested}</span>}
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Investment Date *</label>
                          <input
                            type="date"
                            value={stockDate}
                            onChange={(e) => { setStockDate(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Category = VEHICLE */}
                  {assetCategory === "VEHICLE" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Vehicle Type *</label>
                          <Select
                            value={vehicleType}
                            onChange={(e) => { setVehicleType(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer"
                          >
                            <option value="Car">Car</option>
                            <option value="Bike">Bike / Two-Wheeler</option>
                            <option value="Commercial">Commercial Vehicle</option>
                          </Select>
                          {errors.vehicleType && <span className="text-[10px] text-red-500">{errors.vehicleType}</span>}
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Vehicle Name *</label>
                          <input
                            type="text"
                            placeholder="E.g. Red SUV"
                            value={vehicleName}
                            onChange={(e) => { setVehicleName(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                          />
                          {errors.vehicleName && <span className="text-[10px] text-red-500">{errors.vehicleName}</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Brand</label>
                          <input
                            type="text"
                            placeholder="E.g. Toyota, Honda"
                            value={vehicleBrand}
                            onChange={(e) => { setVehicleBrand(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Model Name</label>
                          <input
                            type="text"
                            placeholder="E.g. Fortuner, Civic"
                            value={vehicleModel}
                            onChange={(e) => { setVehicleModel(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Purchase Value</label>
                          <input
                            type="number"
                            placeholder="Purchase value"
                            value={purchaseValue}
                            onChange={(e) => { setPurchaseValue(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Purchase Date</label>
                          <input
                            type="date"
                            value={purchaseDate}
                            onChange={(e) => { setPurchaseDate(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 text-zinc-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Current Market Value</label>
                        <input
                          type="number"
                          placeholder="Estimated market price"
                          value={currentMarketValue}
                          onChange={(e) => { setCurrentMarketValue(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* Category = LIQUID_CASH */}
                  {assetCategory === "LIQUID_CASH" && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Current Market Value *</label>
                        <input
                          type="number"
                          placeholder="Current cash value in INR"
                          value={currentMarketValue}
                          onChange={(e) => { setCurrentMarketValue(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                        />
                        {errors.currentMarketValue && <span className="text-[10px] text-red-500">{errors.currentMarketValue}</span>}
                      </div>
                    </div>
                  )}

                  {/* Category = OTHERS */}
                  {assetCategory === "OTHERS" && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Asset Name *</label>
                        <input
                          type="text"
                          placeholder="Asset details description..."
                          value={metalName}
                          onChange={(e) => { setMetalName(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.assetName && <span className="text-[10px] text-red-500">{errors.assetName}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Current Market Value</label>
                        <input
                          type="number"
                          placeholder="Expected valuation"
                          value={currentMarketValue}
                          onChange={(e) => { setCurrentMarketValue(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* Category = SAVINGS_BANK_ACCOUNT */}
                  {assetCategory === "SAVINGS_BANK_ACCOUNT" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Bank Name *</label>
                          <input
                            type="text"
                            placeholder="E.g. HDFC, ICICI"
                            value={bankName}
                            onChange={(e) => { setBankName(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                          {errors.bankName && <span className="text-[10px] text-red-500">{errors.bankName}</span>}
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Account Type *</label>
                          <Select
                            value={bankAccType}
                            onChange={(e) => { setBankAccType(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer"
                          >
                            <option value="Savings">Savings</option>
                            <option value="Checking">Checking / Current</option>
                          </Select>
                          {errors.bankAccType && <span className="text-[10px] text-red-500">{errors.bankAccType}</span>}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Current Market Value *</label>
                        <input
                          type="number"
                          placeholder="Outstanding Balance"
                          value={currentMarketValue}
                          onChange={(e) => { setCurrentMarketValue(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                        />
                        {errors.currentMarketValue && <span className="text-[10px] text-red-500">{errors.currentMarketValue}</span>}
                      </div>
                    </div>
                  )}

                  {/* Category = FIXED_DEPOSIT / RD */}
                  {(assetCategory === "FIXED_DEPOSIT" || assetCategory === "RD") && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Bank Name</label>
                        <input
                          type="text"
                          placeholder="FD issuing bank name"
                          value={fdBank}
                          onChange={(e) => { setFdBank(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Deposit Amount</label>
                          <input
                            type="number"
                            placeholder="Principal amount"
                            value={fdAmount}
                            onChange={(e) => { setFdAmount(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Interest Rate (%)</label>
                          <input
                            type="number"
                            step="0.05"
                            placeholder="Interest Rate"
                            value={fdInterest}
                            onChange={(e) => { setFdInterest(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Maturity Amount</label>
                          <input
                            type="number"
                            placeholder="Value at maturity"
                            value={fdMaturityAmount}
                            onChange={(e) => { setFdMaturityAmount(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Maturity Date</label>
                          <input
                            type="date"
                            value={fdMaturityDate}
                            onChange={(e) => { setFdMaturityDate(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Category = EPF / PPF / NPS */}
                  {(assetCategory === "EPF" || assetCategory === "PPF" || assetCategory === "NPS") && (
                    <div className="space-y-4">
                      {assetCategory === "EPF" && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="font-semibold text-zinc-500">Employer Name</label>
                              <input
                                type="text"
                                placeholder="E.g. TCS, Wipro"
                                value={epfEmployer}
                                onChange={(e) => { setEpfEmployer(e.target.value); triggerDraftSave(); }}
                                className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-semibold text-zinc-500">UAN Number</label>
                              <input
                                type="text"
                                placeholder="Universal Acc Number"
                                value={epfUan}
                                onChange={(e) => { setEpfUan(e.target.value); triggerDraftSave(); }}
                                className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {assetCategory === "NPS" && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="font-semibold text-zinc-500">PRAN Number</label>
                              <input
                                type="text"
                                placeholder="PRAN card index"
                                value={npsPran}
                                onChange={(e) => { setNpsPran(e.target.value); triggerDraftSave(); }}
                                className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-semibold text-zinc-500">Pension Manager</label>
                              <input
                                type="text"
                                value={npsManager}
                                onChange={(e) => { setNpsManager(e.target.value); triggerDraftSave(); }}
                                className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Current Balance / Corpus</label>
                        <input
                          type="number"
                          placeholder="Total accumulated balance"
                          value={epfBalance}
                          onChange={(e) => { setEpfBalance(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {/* Category = CRYPTO */}
                  {assetCategory === "CRYPTO" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Coin Name</label>
                          <input
                            type="text"
                            placeholder="E.g. Bitcoin, Ethereum"
                            value={cryptoCoin}
                            onChange={(e) => { setCryptoCoin(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Symbol</label>
                          <input
                            type="text"
                            placeholder="BTC, ETH"
                            value={cryptoSymbol}
                            onChange={(e) => { setCryptoSymbol(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Quantity</label>
                          <input
                            type="number"
                            step="0.0001"
                            placeholder="Volume held"
                            value={cryptoQty}
                            onChange={(e) => { setCryptoQty(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Purchase Price ($ / ₹)</label>
                          <input
                            type="number"
                            placeholder="Buy value per coin"
                            value={cryptoPrice}
                            onChange={(e) => { setCryptoPrice(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Category = GOLD */}
                  {assetCategory === "GOLD" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Gold Type *</label>
                          <Select
                            value={goldType}
                            onChange={(e) => { setGoldType(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer"
                          >
                            <option value="Physical">Physical</option>
                            <option value="Digital">Digital</option>
                            <option value="ETF">ETF</option>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Carat</label>
                          <Select
                            value={goldCarat}
                            onChange={(e) => { setGoldCarat(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer"
                          >
                            <option value="">Select Carat</option>
                            <option value="24k">24k</option>
                            <option value="22k">22k</option>
                            <option value="18k">18k</option>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Purchase Value</label>
                          <input
                            type="number"
                            placeholder="Amount in INR"
                            value={purchaseValue}
                            onChange={(e) => { handlePurchaseValueChange(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Purchase Date</label>
                          <input
                            type="date"
                            value={purchaseDate}
                            onChange={(e) => { setPurchaseDate(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 text-zinc-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Current Gold Price (per gram)</label>
                          <input
                            type="number"
                            placeholder="E.g. 7000"
                            value={goldCurrentPrice}
                            onChange={(e) => { handleCurrentPriceChange(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Weight (grams)</label>
                          <input
                            type="number"
                            placeholder="Calculated or manual input"
                            value={goldWeight}
                            onChange={(e) => { handleWeightChange(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Current Market Value</label>
                        <input
                          type="number"
                          placeholder="Calculated or manual input"
                          value={currentMarketValue}
                          onChange={(e) => { setCurrentMarketValue(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* Category = SILVER */}
                  {assetCategory === "SILVER" && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Silver Type *</label>
                        <Select
                          value={silverType}
                          onChange={(e) => { setSilverType(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer"
                        >
                          <option value="Physical">Physical</option>
                          <option value="Digital">Digital</option>
                          <option value="ETF">ETF</option>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Purchase Value</label>
                          <input
                            type="number"
                            placeholder="Amount in INR"
                            value={purchaseValue}
                            onChange={(e) => { handleSilverPurchaseValueChange(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Purchase Date</label>
                          <input
                            type="date"
                            value={purchaseDate}
                            onChange={(e) => { setPurchaseDate(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 text-zinc-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Current Silver Price (per gram)</label>
                          <input
                            type="number"
                            placeholder="E.g. 90"
                            value={silverCurrentPrice}
                            onChange={(e) => { handleSilverCurrentPriceChange(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Weight (grams) *</label>
                          <input
                            type="number"
                            placeholder="Calculated or manual input"
                            value={silverWeight}
                            onChange={(e) => { handleSilverWeightChange(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                          {errors.silverWeight && <span className="text-[10px] text-red-500">{errors.silverWeight}</span>}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Current Market Value</label>
                        <input
                          type="number"
                          placeholder="Calculated or manual input"
                          value={currentMarketValue}
                          onChange={(e) => { setCurrentMarketValue(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                        />
                      </div>
                    </div>
                  )}

                   {/* Fallback / SILVER / OTHERS / LIQUID_CASH */}
                  {assetCategory !== "PROPERTY" && assetCategory !== "GOLD" && assetCategory !== "SILVER" && assetCategory !== "STOCK" && assetCategory !== "VEHICLE" && assetCategory !== "SAVINGS_BANK_ACCOUNT" && assetCategory !== "FIXED_DEPOSIT" && assetCategory !== "RD" && assetCategory !== "EPF" && assetCategory !== "PPF" && assetCategory !== "NPS" && assetCategory !== "CRYPTO" && assetCategory !== "OTHERS" && assetCategory !== "LIQUID_CASH" && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Asset Name *</label>
                        <input
                          type="text"
                          placeholder="Asset details description..."
                          value={metalName}
                          onChange={(e) => { setMetalName(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                        />
                        {errors.assetName && <span className="text-[10px] text-red-500">{errors.assetName}</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Purchase Value *</label>
                          <input
                            type="number"
                            placeholder="Value at buy"
                            value={purchaseValue}
                            onChange={(e) => { setPurchaseValue(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Current Valuation</label>
                          <input
                            type="number"
                            placeholder="Expected selling price"
                            value={currentMarketValue}
                            onChange={(e) => { setCurrentMarketValue(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>
                      </div>

                      {/* Gold/Silver specific quantity grams details */}
                      {(assetCategory === "GOLD" || assetCategory === "SILVER") && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-semibold text-zinc-500">Quantity (grams)</label>
                            <input
                              type="number"
                              value={metalQty}
                              onChange={(e) => { setMetalQty(e.target.value); triggerDraftSave(); }}
                              className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-semibold text-zinc-500">Storage Location</label>
                            <input
                              type="text"
                              value={metalStorage}
                              onChange={(e) => { setMetalStorage(e.target.value); triggerDraftSave(); }}
                              className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Note (optional) field for all assets */}
                  <div className="space-y-1 mt-6">
                    <label className="font-semibold text-zinc-500">Note (optional)</label>
                    <textarea
                      placeholder="Add any additional notes about this asset..."
                      value={assetNotes}
                      onChange={(e) => { setAssetNotes(e.target.value); triggerDraftSave(); }}
                      className="w-full rounded-lg border border-zinc-200 p-3 bg-zinc-50/50 outline-none text-zinc-900 h-16 resize-none"
                    />
                  </div>

                  {/* Sticky Actions Footer */}
                  <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-150 p-4 -mx-6 -mb-6 flex justify-end gap-3 mt-8">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => {
                        setStep(recordType === "Asset" ? 2 : 1);
                        setErrors({});
                      }}
                      className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      {submitting ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        "Save Asset Record"
                      )}
                    </Button>
                  </div>

                </form>
              ) : recordType === "Debt" ? (
                <form onSubmit={handleSave} className="space-y-6 text-xs">

                  {/* Basic Information */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-zinc-400 tracking-wider block">Basic Information</span>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Loan Category *</label>
                        <div className="h-9 w-full rounded-lg border border-zinc-250 bg-zinc-100/60 px-3 flex items-center font-bold text-zinc-650 text-[11px] tracking-wide select-none">
                          {debtCategories.find((c) => c.code === debtCategory)?.label || debtCategory.replace("_", " ")}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Loan Status *</label>
                        <Select
                          value={loanStatus}
                          onChange={(e) => { setLoanStatus(e.target.value as "Active" | "Closed"); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer focus:border-blue-500 focus:bg-white"
                        >
                          <option value="Active">Active</option>
                          <option value="Closed">Closed</option>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-500">Loan Name *</label>
                      <input
                        type="text"
                        placeholder="E.g. HDFC Home Loan, SBI Car Loan"
                        value={loanName}
                        onChange={(e) => { setLoanName(e.target.value); triggerDraftSave(); }}
                        className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                      />
                      {errors.loanName && <span className="text-[10px] text-red-500">{errors.loanName}</span>}
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-500">Lender Name *</label>
                      <input
                        type="text"
                        placeholder="E.g. HDFC Bank, SBI"
                        value={lendingBank}
                        onChange={(e) => { setLendingBank(e.target.value); triggerDraftSave(); }}
                        className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                      />
                      {errors.lendingBank && <span className="text-[10px] text-red-500">{errors.lendingBank}</span>}
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div className="space-y-4 pt-4 border-t border-zinc-100">
                    <span className="text-[10px] font-black text-zinc-400 tracking-wider block">Loan & Repayment Details</span>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Principal *</label>
                        <input
                          type="number"
                          placeholder="Amount in INR"
                          value={sanctionedAmount}
                          onChange={(e) => { setSanctionedAmount(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.sanctionedAmount && <span className="text-[10px] text-red-500">{errors.sanctionedAmount}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Outstanding *</label>
                        <input
                          type="number"
                          placeholder="Outstanding Principal"
                          value={outstandingPrincipal}
                          onChange={(e) => { setOutstandingPrincipal(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.outstandingPrincipal && <span className="text-[10px] text-red-500">{errors.outstandingPrincipal}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Interest Rate (%) *</label>
                        <input
                          type="number"
                          step="0.05"
                          placeholder="E.g. 8.5"
                          value={loanInterestRate}
                          onChange={(e) => { setLoanInterestRate(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.loanInterestRate && <span className="text-[10px] text-red-500">{errors.loanInterestRate}</span>}
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="font-semibold text-zinc-500">Tenure (Months) *</label>
                        <input
                          type="number"
                          placeholder="E.g. 240"
                          value={loanTenureValue}
                          onChange={(e) => { setLoanTenureValue(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.loanTenureValue && <span className="text-[10px] text-red-500">{errors.loanTenureValue}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">EMI Amount *</label>
                        <input
                          type="number"
                          placeholder="E.g. 15000"
                          value={emiAmountInput}
                          onChange={(e) => { setEmiAmountInput(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.emiAmount && <span className="text-[10px] text-red-500">{errors.emiAmount}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Start Date *</label>
                        <input
                          type="date"
                          value={loanStartDate}
                          onChange={(e) => { setLoanStartDate(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-500 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.loanStartDate && <span className="text-[10px] text-red-500">{errors.loanStartDate}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">End Date *</label>
                        <input
                          type="date"
                          value={loanEndDate}
                          onChange={(e) => { setLoanEndDate(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-500 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.loanEndDate && <span className="text-[10px] text-red-500">{errors.loanEndDate}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Calculated Repayment metrics */}
                  {sanctionedNum > 0 && Number(loanInterestRate) > 0 && Number(loanTenureValue) > 0 && (
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/60 space-y-3">
                      <div className="flex items-center gap-1.5 text-zinc-900 font-bold text-[11px] tracking-wide">
                        <Percent className="h-4 w-4 text-blue-600" />
                        Loan Amortization Summary
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white p-2 rounded-lg border border-zinc-200/50">
                          <p className="text-[9px] text-zinc-400 font-semibold">Estimated EMI</p>
                          <p className="text-xs font-black text-blue-600 mt-0.5">{formatCurrency(emiCalc.emi)}</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-zinc-200/50">
                          <p className="text-[9px] text-zinc-400 font-semibold">Total Interest</p>
                          <p className="text-xs font-black text-amber-600 mt-0.5">{formatCurrency(emiCalc.totalInterest)}</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-zinc-200/50">
                          <p className="text-[9px] text-zinc-400 font-semibold">Total Repayment</p>
                          <p className="text-xs font-black text-zinc-800 mt-0.5">{formatCurrency(emiCalc.totalRepayment)}</p>
                        </div>
                      </div>

                      {/* Debt Health Summary */}
                      <div className="pt-2 border-t border-zinc-250/30 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-zinc-650">
                          <span>Debt Payoff Progress ({completionPercent}%)</span>
                          <span>{formatCurrency(sanctionedNum - outstandingNum)} Paid</span>
                        </div>
                        <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full transition-all duration-500"
                            style={{ width: `${completionPercent}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-[10px] font-medium text-zinc-500 pt-1">
                          <div>
                            Remaining Tenure: <span className="font-bold text-zinc-900">{remainingMonths} months</span>
                          </div>
                          <div className="text-right">
                            Interest Remaining: <span className="font-bold text-zinc-900">{formatCurrency(remainingInterest)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Insights list */}
                  {aiInsights.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-1.5 text-zinc-900 font-bold text-[10px] tracking-wide">
                        <Sparkles className="h-4 w-4 text-indigo-600" />
                        AI Debt Optimization Insights
                      </div>
                      <div className="space-y-2.5">
                        {aiInsights.map((insight, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${insight.priority === "High"
                                ? "bg-red-50/50 border-red-150/50 text-red-950"
                                : insight.priority === "Medium"
                                  ? "bg-indigo-50/40 border-indigo-150/40 text-indigo-950"
                                  : "bg-emerald-50/40 border-emerald-150/40 text-emerald-950"
                              }`}
                          >
                            <Info className={`h-4 w-4 shrink-0 mt-0.5 ${insight.priority === "High" ? "text-red-500" : "text-indigo-500"
                              }`} />
                            <div className="flex-1 space-y-1">
                              <p className="text-[11px] font-medium leading-normal text-zinc-800">{insight.text}</p>
                              <div className="flex items-center gap-2 text-[9px] font-bold">
                                <span className={`px-1.5 py-0.5 rounded-md capitalize ${insight.priority === "High"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-indigo-100 text-indigo-700"
                                  }`}>
                                  {insight.priority} Priority
                                </span>
                                <span className="text-zinc-500">•</span>
                                <span className="text-zinc-600">{insight.savings}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  <div className="space-y-4 pt-4 border-t border-zinc-100">
                    <span className="text-[10px] font-black text-zinc-400 tracking-wider block">Additional Details</span>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Interest Rate Type</label>
                        <Select
                          value={interestRateType}
                          onChange={(e) => { setInterestRateType(e.target.value as "Floating" | "Fixed"); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer focus:border-blue-500 focus:bg-white"
                        >
                          <option value="Floating">Floating Interest Rate</option>
                          <option value="Fixed">Fixed Interest Rate</option>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Prepayment Allowed</label>
                        <Select
                          value={prepaymentAllowed}
                          onChange={(e) => { setPrepaymentAllowed(e.target.value as "Yes" | "No"); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer focus:border-blue-500 focus:bg-white"
                        >
                          <option value="Yes">Yes, Prepayment Allowed</option>
                          <option value="No">No, Prepayment Blocked</option>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Co-Borrower (Optional)</label>
                        <input
                          type="text"
                          placeholder="Name of co-applicant"
                          value={coBorrower}
                          onChange={(e) => { setCoBorrower(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Linked Asset</label>
                        <Select
                          value={linkedAsset}
                          onChange={(e) => { setLinkedAsset(e.target.value as "Property" | "Vehicle" | "Gold" | "Other" | "Unsecure"); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer focus:border-blue-500 focus:bg-white"
                        >
                          <option value="Unsecure">Unsecure</option>
                          <option value="Property">Property</option>
                          <option value="Vehicle">Vehicle</option>
                          <option value="Gold">Gold</option>
                          <option value="Other">Other</option>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-500">Notes & Repayment Details</label>
                      <textarea
                        placeholder="E.g. purpose of loan, bank relationship manager details..."
                        value={loanNotes}
                        onChange={(e) => { setLoanNotes(e.target.value); triggerDraftSave(); }}
                        className="w-full rounded-lg border border-zinc-200 p-3 bg-zinc-50/50 outline-none text-zinc-900 h-16 resize-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Sticky Actions Footer */}
                  <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-150 p-4 -mx-6 -mb-6 flex justify-end gap-3 mt-8">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => {
                        setStep(2);
                        setErrors({});
                      }}
                      className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      {submitting ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        "Save Debt"
                      )}
                    </Button>
                  </div>

                </form>
              ) : recordType === "Investment" ? (
                <form onSubmit={handleSave} className="space-y-6 text-xs">

                  {/* Basic Information Section */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-zinc-400 tracking-wider block">Basic Information</span>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Investment Category *</label>
                        <div className="h-9 w-full rounded-lg border border-zinc-250 bg-zinc-100/60 px-3 flex items-center font-bold text-zinc-650 text-[11px] tracking-wide select-none">
                          {investmentCategories.find((c) => c.code === investmentCategory)?.label || investmentCategory}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Investment Name *</label>
                        <input
                          type="text"
                          placeholder="E.g. HDFC Mid-Cap Growth Fund, TCS Shares"
                          value={investmentName}
                          onChange={(e) => { setInvestmentName(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.investmentName && <span className="text-[10px] text-red-500">{errors.investmentName}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Symbol / Ticker *</label>
                        <input
                          type="text"
                          placeholder="E.g. TCS, BTC, INFOSYS"
                          value={investmentSymbol}
                          onChange={(e) => { setInvestmentSymbol(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.investmentSymbol && <span className="text-[10px] text-red-500">{errors.investmentSymbol}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Start Date *</label>
                        <input
                          type="date"
                          value={investmentStartDate}
                          onChange={(e) => { setInvestmentStartDate(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.investmentStartDate && <span className="text-[10px] text-red-500">{errors.investmentStartDate}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details Section */}
                  <div className="space-y-4 border-t border-zinc-100 pt-4">
                    <span className="text-[10px] font-black text-zinc-400 tracking-wider block">Transaction & Valuation Details</span>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Units *</label>
                        <input
                          type="number"
                          step="any"
                          placeholder="E.g. 10.50"
                          value={investmentUnits}
                          onChange={(e) => { handleInvestmentUnitsChange(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.investmentUnits && <span className="text-[10px] text-red-500">{errors.investmentUnits}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Buy Price *</label>
                        <input
                          type="number"
                          step="any"
                          placeholder="₹ E.g. 3200"
                          value={investmentBuyPrice}
                          onChange={(e) => { handleInvestmentBuyPriceChange(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.investmentBuyPrice && <span className="text-[10px] text-red-500">{errors.investmentBuyPrice}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Current Price *</label>
                        <input
                          type="number"
                          step="any"
                          placeholder="₹ E.g. 3500"
                          value={investmentCurrentPrice}
                          onChange={(e) => { handleInvestmentCurrentPriceChange(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.investmentCurrentPrice && <span className="text-[10px] text-red-500">{errors.investmentCurrentPrice}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Invested Amount *</label>
                        <input
                          type="number"
                          step="any"
                          placeholder="₹ E.g. 33600"
                          value={investmentInvestedAmount}
                          onChange={(e) => { setInvestmentInvestedAmount(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.investmentInvestedAmount && <span className="text-[10px] text-red-500">{errors.investmentInvestedAmount}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Current Value *</label>
                        <input
                          type="number"
                          step="any"
                          placeholder="₹ E.g. 36750"
                          value={investmentCurrentValue}
                          onChange={(e) => { setInvestmentCurrentValue(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.investmentCurrentValue && <span className="text-[10px] text-red-500">{errors.investmentCurrentValue}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Expected Return (%) *</label>
                        <input
                          type="number"
                          placeholder="E.g. 12"
                          value={investmentExpectedReturn}
                          onChange={(e) => { setInvestmentExpectedReturn(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.investmentExpectedReturn && <span className="text-[10px] text-red-500">{errors.investmentExpectedReturn}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Plan / SIP Section */}
                  <div className="space-y-4 border-t border-zinc-100 pt-4">
                    <span className="text-[10px] font-black text-zinc-400 tracking-wider block">SIP & Maturity Details</span>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Is SIP? *</label>
                        <Select
                          value={investmentIsSip}
                          onChange={(e) => { setInvestmentIsSip(e.target.value as "Yes" | "No"); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer focus:border-blue-500 focus:bg-white"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Maturity Date *</label>
                        <input
                          type="date"
                          value={investmentMaturityDate}
                          onChange={(e) => { setInvestmentMaturityDate(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.investmentMaturityDate && <span className="text-[10px] text-red-500">{errors.investmentMaturityDate}</span>}
                      </div>
                    </div>

                    {investmentIsSip === "Yes" && (
                      <div className="grid grid-cols-2 gap-4 p-3 bg-zinc-50 rounded-xl border border-zinc-150 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">SIP Amount *</label>
                          <input
                            type="number"
                            placeholder="₹ E.g. 5000"
                            value={investmentSipAmount}
                            onChange={(e) => { setInvestmentSipAmount(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-white outline-none text-zinc-900 focus:border-blue-500"
                          />
                          {errors.investmentSipAmount && <span className="text-[10px] text-red-500">{errors.investmentSipAmount}</span>}
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">SIP Frequency *</label>
                          <Select
                            value={investmentSipFrequency}
                            onChange={(e) => { setInvestmentSipFrequency(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-white outline-none text-zinc-900 cursor-pointer focus:border-blue-500"
                          >
                            <option value="Monthly">Monthly</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Halferly">Halferly</option>
                            <option value="Anually">Anually</option>
                          </Select>
                          {errors.investmentSipFrequency && <span className="text-[10px] text-red-500">{errors.investmentSipFrequency}</span>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes Section */}
                  <div className="space-y-1 border-t border-zinc-100 pt-4">
                    <label className="font-semibold text-zinc-500">Notes / Remarks</label>
                    <textarea
                      placeholder="E.g. depository details, nominee..."
                      value={investmentNotes}
                      onChange={(e) => { setInvestmentNotes(e.target.value); triggerDraftSave(); }}
                      className="w-full rounded-lg border border-zinc-200 p-3 bg-zinc-50/50 outline-none text-zinc-900 h-16 resize-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  {/* Sticky Actions Footer */}
                  <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-150 p-4 -mx-6 -mb-6 flex justify-end gap-3 mt-8">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => {
                        setStep(2);
                        setErrors({});
                      }}
                      className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      {submitting ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        "Save Investment"
                      )}
                    </Button>
                  </div>

                </form>
              ) : recordType === "Goal" ? (
                <form onSubmit={handleSave} className="space-y-6 text-xs">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-zinc-400 tracking-wider block">Goal Details</span>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Goal Category *</label>
                        <div className="h-9 w-full rounded-lg border border-zinc-250 bg-zinc-100/60 px-3 flex items-center font-bold text-zinc-650 text-[11px] tracking-wide select-none">
                          {goalCategories.find((c) => c.code === goalCategory)?.label || goalCategory.replace("_", " ")}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Status *</label>
                        <Select
                          value={goalStatus}
                          onChange={(e) => { setGoalStatus(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer focus:border-blue-500 focus:bg-white"
                        >
                          <option value="Active">Active</option>
                          <option value="Achieved">Achieved</option>
                          <option value="Paused">Paused</option>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-500">Goal Name *</label>
                      <input
                        type="text"
                        placeholder="E.g. Buy Retirement Home"
                        value={goalName}
                        onChange={(e) => { setGoalName(e.target.value); triggerDraftSave(); }}
                        className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                      />
                      {errors.goalName && <span className="text-[10px] text-red-500">{errors.goalName}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Target Amount *</label>
                        <input
                          type="number"
                          placeholder="E.g. 5000000"
                          value={goalTargetAmount}
                          onChange={(e) => { setGoalTargetAmount(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                        />
                        {errors.goalTargetAmount && <span className="text-[10px] text-red-500">{errors.goalTargetAmount}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Saved Amount *</label>
                        <input
                          type="number"
                          placeholder="E.g. 100000"
                          value={goalSavedAmount}
                          onChange={(e) => { setGoalSavedAmount(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                        />
                        {errors.goalSavedAmount && <span className="text-[10px] text-red-500">{errors.goalSavedAmount}</span>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-500">Target Date *</label>
                      <input
                        type="date"
                        value={goalTargetDate}
                        onChange={(e) => { setGoalTargetDate(e.target.value); triggerDraftSave(); }}
                        className="w-full h-9 rounded-lg border border-zinc-250 bg-zinc-50/50 outline-none text-zinc-900 text-[11px] cursor-pointer focus:border-blue-500 focus:bg-white"
                      />
                      {errors.goalTargetDate && <span className="text-[10px] text-red-500">{errors.goalTargetDate}</span>}
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-500">Notes</label>
                      <textarea
                        placeholder="Goal details, milestones, priority..."
                        value={goalNotes}
                        onChange={(e) => { setGoalNotes(e.target.value); triggerDraftSave(); }}
                        className="w-full h-16 rounded-lg border border-zinc-200 p-2 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white text-xs resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => {
                        setStep(2);
                        setErrors({});
                      }}
                      className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      {submitting ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        "Save Goal"
                      )}
                    </Button>
                  </div>
                </form>
              ) : recordType === "Emergency" ? (
                <form onSubmit={handleSave} className="space-y-6 text-xs">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-zinc-400 tracking-wider block">Essential Details</span>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Category *</label>
                        <div className="h-9 w-full rounded-lg border border-zinc-250 bg-zinc-100/60 px-3 flex items-center font-bold text-zinc-650 text-[11px] tracking-wide select-none">
                          {essentialCategories.find((c) => c.code === essentialCategory)?.label || essentialCategory.replace(/_/g, " ")}
                        </div>
                        {errors.essentialCategory && <span className="text-[10px] text-red-500">{errors.essentialCategory}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Notes / Details</label>
                        <input
                          type="text"
                          placeholder="E.g. Primary savings, term policy..."
                          value={essentialNote}
                          onChange={(e) => { setEssentialNote(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    {!isInsuranceCategory(essentialCategory) && (
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Amount / Balance (INR) *</label>
                        <input
                          type="number"
                          placeholder="E.g. 50000"
                          value={essentialSumAssured}
                          onChange={(e) => { setEssentialSumAssured(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.essentialSumAssured && <span className="text-[10px] text-red-500">{errors.essentialSumAssured}</span>}
                      </div>
                    )}

                    {isInsuranceCategory(essentialCategory) && (
                      <div className="space-y-4 border-t border-zinc-100 pt-4">
                        <span className="text-[10px] font-black text-zinc-400 tracking-wider block">Policy & Insurance Information</span>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-semibold text-zinc-500">Insurer Name *</label>
                            <input
                              type="text"
                              placeholder="E.g. Star Health"
                              value={essentialInsurer}
                              onChange={(e) => { setEssentialInsurer(e.target.value); triggerDraftSave(); }}
                              className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                            />
                            {errors.essentialInsurer && <span className="text-[10px] text-red-500">{errors.essentialInsurer}</span>}
                          </div>

                          <div className="space-y-1">
                            <label className="font-semibold text-zinc-500">Premium Amount (INR) *</label>
                            <input
                              type="number"
                              placeholder="E.g. 15000"
                              value={essentialPremium}
                              onChange={(e) => { setEssentialPremium(e.target.value); triggerDraftSave(); }}
                              className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                            />
                            {errors.essentialPremium && <span className="text-[10px] text-red-500">{errors.essentialPremium}</span>}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-semibold text-zinc-500">Sum Assured (INR) *</label>
                            <input
                              type="number"
                              placeholder="E.g. 1000000"
                              value={essentialSumAssured}
                              onChange={(e) => { setEssentialSumAssured(e.target.value); triggerDraftSave(); }}
                              className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                            />
                            {errors.essentialSumAssured && <span className="text-[10px] text-red-500">{errors.essentialSumAssured}</span>}
                          </div>

                          <div className="space-y-1">
                            <label className="font-semibold text-zinc-500">Frequency *</label>
                            <Select
                              value={essentialFrequency}
                              onChange={(e) => { setEssentialFrequency(e.target.value); triggerDraftSave(); }}
                              className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer focus:border-blue-500 focus:bg-white"
                            >
                              <option value="YEARLY">Yearly</option>
                              <option value="MONTHLY">Monthly</option>
                              <option value="QUARTERLY">Quarterly</option>
                              <option value="HALF_YEARLY">Half Yearly</option>
                              <option value="ONCE">One-time</option>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-semibold text-zinc-500">Start Date</label>
                            <input
                              type="date"
                              value={essentialStartDate}
                              onChange={(e) => { setEssentialStartDate(e.target.value); triggerDraftSave(); }}
                              className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 text-[11px] cursor-pointer"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-semibold text-zinc-500">Renewal Date</label>
                            <input
                              type="date"
                              value={essentialRenewalDate}
                              onChange={(e) => { setEssentialRenewalDate(e.target.value); triggerDraftSave(); }}
                              className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 text-[11px] cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            id="essentialIsActive"
                            checked={essentialIsActive}
                            onChange={(e) => { setEssentialIsActive(e.target.checked); triggerDraftSave(); }}
                            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <label htmlFor="essentialIsActive" className="font-semibold text-zinc-650 cursor-pointer select-none">
                            Policy is active and in-force
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => {
                        setStep(2);
                        setErrors({});
                      }}
                      className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      {submitting ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        "Save Essential"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                // Backup Placeholder Form (Future extensible layout)
                <div className="space-y-6 text-xs text-center py-10 bg-zinc-50 rounded-2xl border border-zinc-150">
                  <Info className="h-8 w-8 text-zinc-400 mx-auto" />
                  <div className="max-w-xs mx-auto space-y-2">
                    <h4 className="font-bold text-zinc-900">{recordType} Form Integration</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Custom dynamic forms for co-managed **{recordType}** registry calculations are scheduled for the next expansion sprint.
                    </p>
                  </div>
                  <div className="pt-4 flex justify-center">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 h-8 rounded-lg border border-zinc-250 bg-white text-[11px] font-bold text-zinc-650 shadow-sm"
                    >
                      Back to Type Selection
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
