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
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WealthAddDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WealthAddDrawer({ isOpen, onClose }: WealthAddDrawerProps) {
  // Steps: 1 = Choose Record Type, 2 = Select Category (for Assets), 3 = Input Form
  const [step, setStep] = React.useState(1);
  const [recordType, setRecordType] = React.useState<"Asset" | "Debt" | "Investment" | "Goal" | "Emergency" | null>(null);
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
  const [propertyType, setPropertyType] = React.useState("Commercial");
  const [purchaseValue, setPurchaseValue] = React.useState("");
  const [purchaseDate, setPurchaseDate] = React.useState("");
  const [currentMarketValue, setCurrentMarketValue] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [ownershipPercent, setOwnershipPercent] = React.useState("100");
  const [rentalIncome, setRentalIncome] = React.useState("");

  // Debt Form States
  const [debtCategory, setDebtCategory] = React.useState<string>("");
  const [loanName, setLoanName] = React.useState("");
  const [lendingBank, setLendingBank] = React.useState("");
  const [loanAccountNumber, setLoanAccountNumber] = React.useState("");
  const [loanStatus, setLoanStatus] = React.useState<"Active" | "Closed" | "Foreclosed">("Active");
  
  const [sanctionedAmount, setSanctionedAmount] = React.useState("");
  const [outstandingPrincipal, setOutstandingPrincipal] = React.useState("");
  const [loanInterestRate, setLoanInterestRate] = React.useState("");
  const [loanTenureValue, setLoanTenureValue] = React.useState("");
  const [loanTenureUnit, setLoanTenureUnit] = React.useState<"Years" | "Months">("Years");
  const [loanStartDate, setLoanStartDate] = React.useState("");
  const [emiAmountInput, setEmiAmountInput] = React.useState("");
  const [emiDueDate, setEmiDueDate] = React.useState("");
  
  const [prepaymentAllowed, setPrepaymentAllowed] = React.useState<"Yes" | "No">("Yes");
  const [interestRateType, setInterestRateType] = React.useState<"Floating" | "Fixed">("Floating");
  const [coBorrower, setCoBorrower] = React.useState("");
  const [linkedAsset, setLinkedAsset] = React.useState<"Property" | "Vehicle" | "Gold" | "Other" | "None">("None");
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
  const [stockNotes, setStockNotes] = React.useState("");
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

  // Generic asset error validation states
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple inline validation checks
    const valErrors: Record<string, string> = {};
    if (recordType === "Asset") {
      if (!assetCategory) {
        valErrors.category = "Please select an asset category.";
      }
      
      if (assetCategory === "PROPERTY") {
        if (!propertyName.trim()) valErrors.propertyName = "Property name is required.";
        if (!purchaseValue) valErrors.purchaseValue = "Purchase value is required.";
        if (!purchaseDate) valErrors.purchaseDate = "Purchase date is required.";
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
      if (!lendingBank.trim()) valErrors.lendingBank = "Lender/Bank is required.";
      
      const sancAmt = Number(sanctionedAmount) || 0;
      const outAmt = Number(outstandingPrincipal) || 0;
      const rate = Number(loanInterestRate) || 0;
      const tenure = Number(loanTenureValue) || 0;
      
      if (sancAmt <= 0) valErrors.sanctionedAmount = "Sanctioned amount must be greater than 0.";
      if (outAmt <= 0) {
        valErrors.outstandingPrincipal = "Outstanding principal must be greater than 0.";
      } else if (outAmt > sancAmt) {
        valErrors.outstandingPrincipal = "Outstanding principal cannot exceed sanctioned amount.";
      }
      
      if (rate <= 0) valErrors.loanInterestRate = "Interest rate must be greater than 0%.";
      if (tenure <= 0) valErrors.loanTenureValue = "Loan tenure must be greater than 0.";
      if (!loanStartDate) valErrors.loanStartDate = "Loan start date is required.";
    }

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setErrors({});
    alert("Record created and added to portfolio registry successfully!");
    
    // Reset steps and values, close drawer
    setStep(1);
    setRecordType(null);
    setAssetCategory("");
    setDebtCategory("");
    clearDebtFields();
    onClose();
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
    setEmiAmountInput("");
    setEmiDueDate("");
    setCoBorrower("");
    setLoanNotes("");
  };

  const handleSaveAndAddAnother = (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors: Record<string, string> = {};
    if (recordType === "Debt") {
      if (!loanName.trim()) valErrors.loanName = "Loan name is required.";
      if (!lendingBank.trim()) valErrors.lendingBank = "Lender/Bank is required.";
      
      const sancAmt = Number(sanctionedAmount) || 0;
      const outAmt = Number(outstandingPrincipal) || 0;
      const rate = Number(loanInterestRate) || 0;
      const tenure = Number(loanTenureValue) || 0;
      
      if (sancAmt <= 0) valErrors.sanctionedAmount = "Sanctioned amount must be greater than 0.";
      if (outAmt <= 0) {
        valErrors.outstandingPrincipal = "Outstanding principal must be greater than 0.";
      } else if (outAmt > sancAmt) {
        valErrors.outstandingPrincipal = "Outstanding principal cannot exceed sanctioned amount.";
      }
      
      if (rate <= 0) valErrors.loanInterestRate = "Interest rate must be greater than 0%.";
      if (tenure <= 0) valErrors.loanTenureValue = "Loan tenure must be greater than 0.";
      if (!loanStartDate) valErrors.loanStartDate = "Loan start date is required.";
    }
    
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setErrors({});
    alert("Record created successfully! Enter details for the next record.");
    
    // Reset inputs, stay on step 2 for Debt category selection
    clearDebtFields();
    setStep(2);
  };

  const handleRecordTypeSelect = (type: "Asset" | "Debt" | "Investment" | "Goal" | "Emergency") => {
    setRecordType(type);
    if (type === "Asset" || type === "Debt") {
      setStep(2);
    } else {
      // Direct placeholders for non-assets
      setStep(3);
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
    
    setStep(3);
  };

  // Categories list
  const assetCategories = [
    { code: "PROPERTY", label: "Property", desc: "Residential, commercial or plot properties" },
    { code: "GOLD", label: "Gold", desc: "Physical gold bars, coins or jewelry" },
    { code: "SILVER", label: "Silver", desc: "Physical silver bars or commodities" },
    { code: "VEHICLE", label: "Vehicle", desc: "Cars, bikes or commercial transport assets" },
    { code: "BANK_ACCOUNT", label: "Bank Account", desc: "Savings or checking cash balances" },
    { code: "FIXED_DEPOSIT", label: "Fixed Deposit", desc: "Term deposits inside bank locks" },
    { code: "RD", label: "Recurring Deposit", desc: "Monthly compounding deposits" },
    { code: "STOCK", label: "Stock Investment", desc: "Publicly listed company equities" },
    { code: "MUTUAL_FUND", label: "Mutual Fund", desc: "Equity index or debt mutual funds" },
    { code: "EPF", label: "Employee Prov Fund", desc: "Retirement EPF account indexes" },
    { code: "PPF", label: "Public Prov Fund", desc: "Post Office or bank PPF reserves" },
    { code: "NPS", label: "National Pension", desc: "NPS pension fund manager portfolios" },
    { code: "CRYPTO", label: "Cryptocurrency", desc: "DeFi coin wallets and tokens" },
    { code: "CASH", label: "Liquid Cash", desc: "Physical currency cash reserves" },
    { code: "OTHER", label: "Other Asset", desc: "Collectible art, variables, or items" }
  ];

  const debtCategories = [
    { code: "HOME_LOAN", label: "Home Loan", desc: "Mortgages or home construction financing" },
    { code: "GOLD_LOAN", label: "Gold Loan", desc: "Borrowings backed by gold assets" },
    { code: "VEHICLE_LOAN", label: "Vehicle Loan", desc: "Loans for cars, bikes or transport" },
    { code: "SOFT_LOAN", label: "Soft Loan (Family/Friends)", desc: "Zero or low interest borrowings from family" },
    { code: "MF_LOAN", label: "Mutual Fund Loan", desc: "Loans taken against mutual fund securities" },
    { code: "PERSONAL_LOAN", label: "Personal Loan", desc: "Unsecured personal credits or lines" },
    { code: "EDUCATION_LOAN", label: "Education Loan", desc: "Student loans for higher studies" },
    { code: "CREDIT_CARD_LOAN", label: "Credit Card Loan", desc: "Credit card EMI conversion or loans" },
    { code: "OTHERS", label: "Other Loan", desc: "Any other active liability or loan" }
  ];

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
            <Sparkles className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
            <div>
              <h3 className="text-sm font-black text-zinc-900 leading-none">Add Financial Record</h3>
              <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                {step === 1 ? "What would you like to add?" : step === 2 ? "Select category category" : "Fill out details"}
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
                  <h4 className="text-xs font-black text-zinc-900 mt-2.5">Emergency & Policy</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Safety reserves buffer, term life insurance policies, or will nomination plans.
                  </p>
                </button>

              </div>
            </div>
          )}

          {/* ==========================================
              Step 2: Select Category (Asset / Debt)
              ========================================== */}
          {step === 2 && (recordType === "Asset" || recordType === "Debt") && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-650 flex items-center outline-none"
                >
                  <ChevronLeft className="h-4 w-4 mr-0.5" /> Back
                </button>
              </div>
              
              <span className="text-[10px] uppercase font-black text-zinc-400 tracking-wider block">
                Choose {recordType} Category
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recordType === "Asset" ? (
                  assetCategories.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleAssetCategorySelect(c.code)}
                      className="rounded-xl border border-zinc-200 p-3.5 text-left hover:border-blue-600 hover:bg-blue-50/5/20 transition-all outline-none"
                    >
                      <span className="text-xs font-bold text-zinc-900">{c.label}</span>
                      <p className="text-[9px] text-zinc-500 mt-1">{c.desc}</p>
                    </button>
                  ))
                ) : (
                  debtCategories.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleDebtCategorySelect(c.code)}
                      className="rounded-xl border border-zinc-200 p-3.5 text-left hover:border-blue-600 hover:bg-blue-50/5/20 transition-all outline-none"
                    >
                      <span className="text-xs font-bold text-zinc-900">{c.label}</span>
                      <p className="text-[9px] text-zinc-500 mt-1">{c.desc}</p>
                    </button>
                  ))
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
                    if (recordType === "Asset" || recordType === "Debt") {
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
                  
                  {/* Selected Category and Type Selection row */}
                  <div className="grid grid-cols-2 gap-4 border-b border-zinc-100 pb-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-500">Selected Category</label>
                      <div className="h-9 w-full rounded-lg border border-zinc-250 bg-zinc-100/60 px-3 flex items-center font-bold text-zinc-650 text-[11px] uppercase tracking-wide select-none">
                        {assetCategory.replace("_", " ")}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-500">Asset Type *</label>
                      <select
                        value={assetType}
                        onChange={(e) => { setAssetType(e.target.value as "APPRECIATION" | "DEPRECIATION"); triggerDraftSave(); }}
                        className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 font-bold cursor-pointer text-[11px] focus:border-blue-500 focus:bg-white"
                      >
                        <option value="APPRECIATION">APPRECIATION</option>
                        <option value="DEPRECIATION">DEPRECIATION</option>
                      </select>
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

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Property Type</label>
                          <select
                            value={propertyType}
                            onChange={(e) => { setPropertyType(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer"
                          >
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Plot / Land">Plot / Land</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Ownership %</label>
                          <input
                            type="number"
                            value={ownershipPercent}
                            onChange={(e) => { setOwnershipPercent(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Purchase Value *</label>
                          <input
                            type="number"
                            placeholder="Amount in INR"
                            value={purchaseValue}
                            onChange={(e) => { setPurchaseValue(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                          {errors.purchaseValue && <span className="text-[10px] text-red-500">{errors.purchaseValue}</span>}
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Purchase Date *</label>
                          <input
                            type="date"
                            value={purchaseDate}
                            onChange={(e) => { setPurchaseDate(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 text-zinc-500"
                          />
                          {errors.purchaseDate && <span className="text-[10px] text-red-500">{errors.purchaseDate}</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
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

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Monthly Rental Yield</label>
                          <input
                            type="number"
                            placeholder="Optional monthly income"
                            value={rentalIncome}
                            onChange={(e) => { setRentalIncome(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Property Address</label>
                        <textarea
                          placeholder="Complete physical address of property..."
                          value={address}
                          onChange={(e) => { setAddress(e.target.value); triggerDraftSave(); }}
                          className="w-full rounded-lg border border-zinc-200 p-3 bg-zinc-50/50 outline-none text-zinc-900 h-16 resize-none"
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
                          <select
                            value={stockRegion}
                            onChange={(e) => { setStockRegion(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer"
                          >
                            <option value="India (NSE/BSE)">India (NSE/BSE)</option>
                            <option value="US (NYSE/NASDAQ)">US (NYSE/NASDAQ)</option>
                            <option value="Europe">Europe</option>
                            <option value="UK">UK</option>
                            <option value="Other">Other</option>
                          </select>
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

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Notes (Optional)</label>
                        <textarea
                          placeholder="Notes or capital gains reminders..."
                          value={stockNotes}
                          onChange={(e) => { setStockNotes(e.target.value); triggerDraftSave(); }}
                          className="w-full rounded-lg border border-zinc-200 p-3 bg-zinc-50/50 outline-none text-zinc-900 h-16 resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Category = VEHICLE */}
                  {assetCategory === "VEHICLE" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Vehicle Type</label>
                          <select
                            value={vehicleType}
                            onChange={(e) => { setVehicleType(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer"
                          >
                            <option value="Car">Car</option>
                            <option value="Bike">Bike / Two-Wheeler</option>
                            <option value="Commercial">Commercial Vehicle</option>
                          </select>
                        </div>

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
                      </div>

                      <div className="grid grid-cols-2 gap-4">
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

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Registration Number</label>
                          <input
                            type="text"
                            placeholder="MH-12-XX-1234"
                            value={vehicleRegNo}
                            onChange={(e) => { setVehicleRegNo(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Purchase Price</label>
                          <input
                            type="number"
                            placeholder="Purchase value"
                            value={purchaseValue}
                            onChange={(e) => { setPurchaseValue(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Current Valuation</label>
                          <input
                            type="number"
                            placeholder="Estimated market price"
                            value={currentMarketValue}
                            onChange={(e) => { setCurrentMarketValue(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Category = BANK_ACCOUNT */}
                  {assetCategory === "BANK_ACCOUNT" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Bank Name</label>
                          <input
                            type="text"
                            placeholder="E.g. HDFC, ICICI"
                            value={bankName}
                            onChange={(e) => { setBankName(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Account Type</label>
                          <select
                            value={bankAccType}
                            onChange={(e) => { setBankAccType(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer"
                          >
                            <option value="Savings">Savings</option>
                            <option value="Checking">Checking / Current</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Current Balance</label>
                          <input
                            type="number"
                            placeholder="Outstanding Balance"
                            value={bankBalance}
                            onChange={(e) => { setBankBalance(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-zinc-500">Interest Rate (% p.a.)</label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="E.g. 3.5"
                            value={bankInterest}
                            onChange={(e) => { setBankInterest(e.target.value); triggerDraftSave(); }}
                            className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900"
                          />
                        </div>
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

                  {/* Fallback / GOLD / SILVER / OTHER / CASH */}
                  {assetCategory !== "PROPERTY" && assetCategory !== "STOCK" && assetCategory !== "VEHICLE" && assetCategory !== "BANK_ACCOUNT" && assetCategory !== "FIXED_DEPOSIT" && assetCategory !== "RD" && assetCategory !== "EPF" && assetCategory !== "PPF" && assetCategory !== "NPS" && assetCategory !== "CRYPTO" && (
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

                  {/* Sticky Actions Footer */}
                  <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-150 p-4 -mx-6 -mb-6 flex justify-end gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(recordType === "Asset" ? 2 : 1);
                        setErrors({});
                      }}
                      className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98]"
                    >
                      Save Asset Record
                    </Button>
                  </div>

                </form>
              ) : recordType === "Debt" ? (
                <form onSubmit={handleSave} className="space-y-6 text-xs">
                  
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase font-black text-zinc-400 tracking-wider block">Basic Information</span>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Loan Category</label>
                        <div className="h-9 w-full rounded-lg border border-zinc-250 bg-zinc-100/60 px-3 flex items-center font-bold text-zinc-650 text-[11px] uppercase tracking-wide select-none">
                          {debtCategory.replace("_", " ")}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Loan Status</label>
                        <select
                          value={loanStatus}
                          onChange={(e) => { setLoanStatus(e.target.value as "Active" | "Closed" | "Foreclosed"); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer focus:border-blue-500 focus:bg-white"
                        >
                          <option value="Active">Active</option>
                          <option value="Closed">Closed</option>
                          <option value="Foreclosed">Foreclosed</option>
                        </select>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Lending Institution *</label>
                        <input
                          type="text"
                          placeholder="E.g. HDFC Bank, SBI"
                          value={lendingBank}
                          onChange={(e) => { setLendingBank(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.lendingBank && <span className="text-[10px] text-red-500">{errors.lendingBank}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Account Number (Optional)</label>
                        <input
                          type="text"
                          placeholder="Masked or full account index"
                          value={loanAccountNumber}
                          onChange={(e) => { setLoanAccountNumber(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div className="space-y-4 pt-4 border-t border-zinc-100">
                    <span className="text-[10px] uppercase font-black text-zinc-400 tracking-wider block">Loan & Repayment Details</span>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Sanctioned Amount *</label>
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
                        <label className="font-semibold text-zinc-500">Outstanding Principal *</label>
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

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Tenure Value *</label>
                        <input
                          type="number"
                          placeholder="E.g. 20"
                          value={loanTenureValue}
                          onChange={(e) => { setLoanTenureValue(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.loanTenureValue && <span className="text-[10px] text-red-500">{errors.loanTenureValue}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Tenure Unit *</label>
                        <select
                          value={loanTenureUnit}
                          onChange={(e) => { setLoanTenureUnit(e.target.value as "Years" | "Months"); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer focus:border-blue-500 focus:bg-white"
                        >
                          <option value="Years">Years</option>
                          <option value="Months">Months</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">EMI Amount (Calculated: {formatCurrency(emiCalc.emi)})</label>
                        <input
                          type="number"
                          placeholder="Override if different"
                          value={emiAmountInput}
                          onChange={(e) => { setEmiAmountInput(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Loan Start Date *</label>
                        <input
                          type="date"
                          value={loanStartDate}
                          onChange={(e) => { setLoanStartDate(e.target.value); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-500 focus:border-blue-500 focus:bg-white"
                        />
                        {errors.loanStartDate && <span className="text-[10px] text-red-500">{errors.loanStartDate}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Calculated Repayment metrics */}
                  {sanctionedNum > 0 && Number(loanInterestRate) > 0 && Number(loanTenureValue) > 0 && (
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/60 space-y-3">
                      <div className="flex items-center gap-1.5 text-zinc-900 font-bold text-[11px] uppercase tracking-wide">
                        <Percent className="h-4 w-4 text-blue-600" />
                        Loan Amortization Summary
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white p-2 rounded-lg border border-zinc-200/50">
                          <p className="text-[9px] text-zinc-400 uppercase font-semibold">Estimated EMI</p>
                          <p className="text-xs font-black text-blue-600 mt-0.5">{formatCurrency(emiCalc.emi)}</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-zinc-200/50">
                          <p className="text-[9px] text-zinc-400 uppercase font-semibold">Total Interest</p>
                          <p className="text-xs font-black text-amber-600 mt-0.5">{formatCurrency(emiCalc.totalInterest)}</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-zinc-200/50">
                          <p className="text-[9px] text-zinc-400 uppercase font-semibold">Total Repayment</p>
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
                      <div className="flex items-center gap-1.5 text-zinc-900 font-bold text-[10px] uppercase tracking-wide">
                        <Sparkles className="h-4 w-4 text-indigo-600" />
                        AI Debt Optimization Insights
                      </div>
                      <div className="space-y-2.5">
                        {aiInsights.map((insight, idx) => (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                              insight.priority === "High" 
                                ? "bg-red-50/50 border-red-150/50 text-red-950" 
                                : insight.priority === "Medium"
                                ? "bg-indigo-50/40 border-indigo-150/40 text-indigo-950"
                                : "bg-emerald-50/40 border-emerald-150/40 text-emerald-950"
                            }`}
                          >
                            <Info className={`h-4 w-4 shrink-0 mt-0.5 ${
                              insight.priority === "High" ? "text-red-500" : "text-indigo-500"
                            }`} />
                            <div className="flex-1 space-y-1">
                              <p className="text-[11px] font-medium leading-normal text-zinc-800">{insight.text}</p>
                              <div className="flex items-center gap-2 text-[9px] font-bold">
                                <span className={`px-1.5 py-0.5 rounded-md uppercase ${
                                  insight.priority === "High" 
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
                    <span className="text-[10px] uppercase font-black text-zinc-400 tracking-wider block">Additional Details</span>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Interest Rate Type</label>
                        <select
                          value={interestRateType}
                          onChange={(e) => { setInterestRateType(e.target.value as "Floating" | "Fixed"); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer focus:border-blue-500 focus:bg-white"
                        >
                          <option value="Floating">Floating Interest Rate</option>
                          <option value="Fixed">Fixed Interest Rate</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-500">Prepayment Allowed</label>
                        <select
                          value={prepaymentAllowed}
                          onChange={(e) => { setPrepaymentAllowed(e.target.value as "Yes" | "No"); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer focus:border-blue-500 focus:bg-white"
                        >
                          <option value="Yes">Yes, Prepayment Allowed</option>
                          <option value="No">No, Prepayment Blocked</option>
                        </select>
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
                        <select
                          value={linkedAsset}
                          onChange={(e) => { setLinkedAsset(e.target.value as "Property" | "Vehicle" | "Gold" | "Other" | "None"); triggerDraftSave(); }}
                          className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 cursor-pointer focus:border-blue-500 focus:bg-white"
                        >
                          <option value="None">None / Unsecured</option>
                          <option value="Property">Linked Property Asset</option>
                          <option value="Vehicle">Linked Vehicle Asset</option>
                          <option value="Gold">Linked Gold Reserve</option>
                          <option value="Other">Other Linked Asset</option>
                        </select>
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
                      onClick={() => {
                        setStep(2);
                        setErrors({});
                      }}
                      className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleSaveAndAddAnother}
                      className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-all active:scale-[0.98]"
                    >
                      Save & Add Another
                    </button>

                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98]"
                    >
                      Save Debt
                    </Button>
                  </div>

                </form>
              ) : (
                // Investment / Goal Placeholder Form (Future extensible layout)
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
                      className="px-4 h-8 rounded-lg border border-zinc-250 bg-white text-[11px] font-bold text-zinc-600 shadow-sm"
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
