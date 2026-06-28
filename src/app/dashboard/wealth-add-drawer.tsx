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
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WealthAddDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WealthAddDrawer({ isOpen, onClose }: WealthAddDrawerProps) {
  // Steps: 1 = Choose Record Type, 2 = Select Category (for Assets), 3 = Input Form
  const [step, setStep] = React.useState(1);
  const [recordType, setRecordType] = React.useState<"Asset" | "Debt" | "Investment" | "Goal" | null>(null);
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
    onClose();
  };

  const handleRecordTypeSelect = (type: "Asset" | "Debt" | "Investment" | "Goal") => {
    setRecordType(type);
    if (type === "Asset") {
      setStep(2);
    } else {
      // Direct placeholders for non-assets
      setStep(3);
    }
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
    { code: "PROPERTY", label: "🏠 Property", desc: "Residential, commercial or plot properties" },
    { code: "GOLD", label: "🟡 Gold", desc: "Physical gold bars, coins or jewelry" },
    { code: "SILVER", label: "⚪ Silver", desc: "Physical silver bars or commodities" },
    { code: "VEHICLE", label: "🚗 Vehicle", desc: "Cars, bikes or commercial transport assets" },
    { code: "BANK_ACCOUNT", label: "🏦 Bank Account", desc: "Savings or checking cash balances" },
    { code: "FIXED_DEPOSIT", label: "🔒 Fixed Deposit", desc: "Term deposits inside bank locks" },
    { code: "RD", label: "⏳ Recurring Deposit", desc: "Monthly compounding deposits" },
    { code: "STOCK", label: "📈 Stock Investment", desc: "Publicly listed company equities" },
    { code: "MUTUAL_FUND", label: "📊 Mutual Fund", desc: "Equity index or debt mutual funds" },
    { code: "EPF", label: "💼 Employee Prov Fund", desc: "Retirement EPF account indexes" },
    { code: "PPF", label: "🔑 Public Prov Fund", desc: "Post Office or bank PPF reserves" },
    { code: "NPS", label: "🍂 National Pension", desc: "NPS pension fund manager portfolios" },
    { code: "CRYPTO", label: "🪙 Cryptocurrency", desc: "DeFi coin wallets and tokens" },
    { code: "CASH", label: "💵 Liquid Cash", desc: "Physical currency cash reserves" },
    { code: "OTHER", label: "📦 Other Asset", desc: "Collectible art, variables, or items" }
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
                  <h4 className="text-xs font-black text-zinc-900 mt-2.5">🏠 Asset</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Physical properties, cash balances, or items that appreciate/depreciate in value.
                  </p>
                </button>

                <button
                  onClick={() => handleRecordTypeSelect("Debt")}
                  className="rounded-xl border border-zinc-200 p-4 text-left hover:border-blue-600 hover:bg-blue-50/5 transition-all outline-none group"
                >
                  <CreditCard className="h-6 w-6 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                  <h4 className="text-xs font-black text-zinc-900 mt-2.5">💳 Debt / Liability</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Active mortgages, credit card outstandings, or personal family loans.
                  </p>
                </button>

                <button
                  onClick={() => handleRecordTypeSelect("Investment")}
                  className="rounded-xl border border-zinc-200 p-4 text-left hover:border-blue-600 hover:bg-blue-50/5 transition-all outline-none group"
                >
                  <TrendingUp className="h-6 w-6 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                  <h4 className="text-xs font-black text-zinc-900 mt-2.5">📈 Investment</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Public equity indices, target mutual funds, or gold commodity SIP bonds.
                  </p>
                </button>

                <button
                  onClick={() => handleRecordTypeSelect("Goal")}
                  className="rounded-xl border border-zinc-200 p-4 text-left hover:border-blue-600 hover:bg-blue-50/5 transition-all outline-none group"
                >
                  <Target className="h-6 w-6 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                  <h4 className="text-xs font-black text-zinc-900 mt-2.5">🎯 Financial Goal</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Shared family travel targets, emergency buffer goals, or retirement planning.
                  </p>
                </button>

              </div>
            </div>
          )}

          {/* ==========================================
              Step 2: Select Asset Category
              ========================================== */}
          {step === 2 && recordType === "Asset" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-650 flex items-center outline-none"
                >
                  <ChevronLeft className="h-4 w-4 mr-0.5" /> Back
                </button>
              </div>
              
              <span className="text-[10px] uppercase font-black text-zinc-400 tracking-wider block">Choose Asset Category</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assetCategories.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleAssetCategorySelect(c.code)}
                    className="rounded-xl border border-zinc-200 p-3.5 text-left hover:border-blue-600 hover:bg-blue-50/5 transition-all outline-none"
                  >
                    <span className="text-xs font-bold text-zinc-900">{c.label}</span>
                    <p className="text-[9px] text-zinc-500 mt-1">{c.desc}</p>
                  </button>
                ))}
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
                    if (recordType === "Asset") {
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
                            Total Value <Info className="h-3 w-3 text-zinc-400" title="Quantity × Price" />
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
              ) : (
                // Debt / Investment / Goal Placeholder Form (Future extensible layout)
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
