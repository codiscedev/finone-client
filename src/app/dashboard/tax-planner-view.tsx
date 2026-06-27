"use client";

import * as React from "react";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Calculator,
  Plus,
  ChevronRight,
  TrendingUp,
  Percent,
  Sparkles,
  ShieldCheck,
  Download,
  AlertCircle,
  HelpCircle,
  FolderLock,
  ChevronDown,
  ThumbsUp,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TaxPlannerView() {
  // 1. Tax Regime Comparison states
  const [selectedRegime, setSelectedRegime] = React.useState<"Old" | "New">("New");
  
  // 2. Income Summary states (Indian Rupees)
  const [salary, setSalary] = React.useState(1800000); // 18 Lakhs
  const [freelance, setFreelance] = React.useState(250000);
  const [rental, setRental] = React.useState(120000);
  const [capitalGains, setCapitalGains] = React.useState(80000);
  const [otherIncome, setOtherIncome] = React.useState(30000);

  // 3. Deductions states
  const [ded80C, setDed80C] = React.useState(120000); // Max 1.5L
  const [ded80D, setDed80D] = React.useState(35000); // Health insurance self+parents
  const [ded80CCD, setDed80CCD] = React.useState(30000); // NPS Max 50k
  const [ded24b, setDed24b] = React.useState(150000); // Mortgage Interest Max 2L
  const [ded80G, setDed80G] = React.useState(10000); // Donations

  // HRA Calculator inputs
  const [hraBasic, setHraBasic] = React.useState(720000); // Basic Salary
  const [hraReceived, setHraReceived] = React.useState(360000); // HRA Received
  const [hraRentPaid, setHraRentPaid] = React.useState(240000); // Rent Paid
  const [hraIsMetro, setHraIsMetro] = React.useState(true); // Metro/Non-metro

  // Auto Tax Detection state
  const [autoDetections, setAutoDetections] = React.useState([
    { id: 1, desc: "LIC Premium payment", amount: 25000, category: "80C", confidence: 99, status: "pending" },
    { id: 2, desc: "ELSS Monthly Mutual Fund SIP", amount: 10000, category: "80C", confidence: 98, status: "pending" },
    { id: 3, desc: "Star Health Insurance Premium", amount: 18000, category: "80D", confidence: 95, status: "pending" },
    { id: 4, desc: "Donation to PM Relief Fund", amount: 5000, category: "80G", confidence: 92, status: "pending" },
  ]);

  // Document Vault files
  const [uploadedFiles, setUploadedFiles] = React.useState([
    { name: "Form_16_FY25-26.pdf", size: "2.4 MB", type: "Form 16", date: "Jun 15, 2026" },
    { name: "Rent_Receipts_Q4.zip", size: "4.8 MB", type: "Rent Receipts", date: "May 28, 2026" },
    { name: "PPF_Statement_FY25-26.pdf", size: "1.1 MB", type: "Investment Proof", date: "Apr 12, 2026" },
  ]);

  const [newFileName, setNewFileName] = React.useState("");

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    setUploadedFiles([
      ...uploadedFiles,
      {
        name: newFileName.endsWith(".pdf") ? newFileName : `${newFileName}.pdf`,
        size: "1.2 MB",
        type: "Investment Proof",
        date: "Today"
      }
    ]);
    setNewFileName("");
  };

  // Calculations
  const grossIncome = salary + freelance + rental + capitalGains + otherIncome;
  const standardDeduction = 75000; // New standard deduction limit in India

  // HRA Exemption Math:
  // Exemption is minimum of:
  // 1. HRA Received
  // 2. Rent Paid - 10% of Basic
  // 3. 50% of Basic (Metro) or 40% of Basic (Non-Metro)
  const calculateHraExemption = () => {
    const tenPercentBasic = hraBasic * 0.1;
    const rentMinusBasic = Math.max(hraRentPaid - tenPercentBasic, 0);
    const limitPercentage = hraIsMetro ? 0.5 : 0.4;
    const maxLimit = hraBasic * limitPercentage;
    return Math.min(hraReceived, rentMinusBasic, maxLimit);
  };

  const hraExemption = calculateHraExemption();

  // Deductions calculations under Old Regime
  const total80C = Math.min(ded80C, 150000);
  const total80D = Math.min(ded80D, 75000); // Assuming self + senior parent limits
  const total80CCD = Math.min(ded80CCD, 50000);
  const total24b = Math.min(ded24b, 200000);
  const total80G = ded80G; // Simplified 100% deduction

  const oldTotalDeductions = total80C + total80D + total80CCD + total24b + total80G + hraExemption + standardDeduction;
  const newTotalDeductions = standardDeduction; // New regime only has standard deduction

  const oldTaxableIncome = Math.max(grossIncome - oldTotalDeductions, 0);
  const newTaxableIncome = Math.max(grossIncome - newTotalDeductions, 0);

  // Indian Tax Slab Calculations (FY 2025-26 / FY 2026-27 assumptions)
  // New Regime slabs:
  // Up to 3L: Nil
  // 3L - 7L: 5% (above 3L)
  // 7L - 10L: 10% (above 7L) + 20k
  // 10L - 12L: 15% (above 10L) + 50k
  // 12L - 15L: 20% (above 12L) + 80k
  // Above 15L: 30% (above 15L) + 1.4L
  // (Tax rebate up to 7L taxable income under Section 87A)
  const calculateNewRegimeTax = (taxable: number) => {
    if (taxable <= 700000) return 0; // Tax rebate active
    let tax = 0;
    if (taxable > 1500000) {
      tax += (taxable - 1500000) * 0.3 + 140000;
    } else if (taxable > 1200000) {
      tax += (taxable - 1200000) * 0.2 + 80000;
    } else if (taxable > 1000000) {
      tax += (taxable - 1000000) * 0.15 + 50000;
    } else if (taxable > 700000) {
      tax += (taxable - 700000) * 0.1 + 20000;
    } else if (taxable > 300000) {
      tax += (taxable - 300000) * 0.05;
    }
    return Math.round(tax * 1.04); // including 4% cess
  };

  // Old Regime slabs:
  // Up to 2.5L: Nil
  // 2.5L - 5L: 5%
  // 5L - 10L: 20%
  // Above 10L: 30%
  const calculateOldRegimeTax = (taxable: number) => {
    let tax = 0;
    if (taxable > 1000000) {
      tax += (taxable - 1000000) * 0.3 + 112500;
    } else if (taxable > 500000) {
      tax += (taxable - 500000) * 0.2 + 12500;
    } else if (taxable > 250000) {
      tax += (taxable - 250000) * 0.05;
    }
    return Math.round(tax * 1.04);
  };

  const oldTax = calculateOldRegimeTax(oldTaxableIncome);
  const newTax = calculateNewRegimeTax(newTaxableIncome);
  const taxDifference = Math.abs(oldTax - newTax);
  const optimalRegime = newTax <= oldTax ? "New" : "Old";
  const estimatedSavings = taxDifference;

  const currentTaxLiability = selectedRegime === "New" ? newTax : oldTax;
  const currentTaxableIncome = selectedRegime === "New" ? newTaxableIncome : oldTaxableIncome;
  const currentTotalDeductions = selectedRegime === "New" ? newTotalDeductions : oldTotalDeductions;
  const effectiveTaxRate = Math.round((currentTaxLiability / grossIncome) * 1000) / 10;

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleAcceptDetection = (id: number, amount: number, category: string) => {
    setAutoDetections(autoDetections.map(d => d.id === id ? { ...d, status: "accepted" } : d));
    if (category === "80C") setDed80C(prev => Math.min(prev + amount, 150000));
    if (category === "80D") setDed80D(prev => prev + amount);
    if (category === "80CCD(1B)") setDed80CCD(prev => Math.min(prev + amount, 50000));
    if (category === "24(b)") setDed24b(prev => Math.min(prev + amount, 200000));
    if (category === "80G") setDed80G(prev => prev + amount);
  };

  const handleRejectDetection = (id: number) => {
    setAutoDetections(autoDetections.map(d => d.id === id ? { ...d, status: "rejected" } : d));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950">Tax Planner & Filing</h2>
          <p className="text-sm text-zinc-500 mt-1">Optimize your taxable yield assumptions, verify auto tax sections, and file Indian ITR returns.</p>
        </div>
        <Button className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm font-semibold transition-all active:scale-[0.98]">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Tax Investment
        </Button>
      </div>

      {/* Grid of Rounded Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ==========================================
            1. Tax Regime Comparison (Hero Card - 12 Columns)
            ========================================== */}
        <div className="lg:col-span-12 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">Tax Regime Comparison</h3>
                <p className="text-xs text-zinc-500">Compare tax payable under Old vs New taxation rules</p>
              </div>
            </div>
            {/* Toggle controls */}
            <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl">
              <button
                onClick={() => setSelectedRegime("Old")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  selectedRegime === "Old" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Old Regime
              </button>
              <button
                onClick={() => setSelectedRegime("New")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  selectedRegime === "New" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                New Regime (Default)
              </button>
            </div>
          </div>

          {/* AI Banner recommendation */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50/70 to-teal-50/50 p-4 border border-emerald-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-emerald-950">AI Smart Regime Recommendation</h4>
                <p className="text-xs text-emerald-850 mt-0.5 leading-relaxed">
                  Based on your taxable gross income of {formatRupee(grossIncome)} and total deductions of {formatRupee(oldTotalDeductions)}, the <span className="font-bold underline">{optimalRegime} Tax Regime</span> is optimal for you, saving you <span className="font-bold">{formatRupee(estimatedSavings)}</span> annually.
                </p>
              </div>
            </div>
            <div className="text-left md:text-right shrink-0">
              <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider block">Estimated Tax Savings</span>
              <span className="text-xl font-black text-emerald-700 block mt-0.5">{formatRupee(estimatedSavings)}</span>
            </div>
          </div>

          {/* Side by side comparison visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Old Regime Card */}
            <div className={`rounded-xl border p-5 relative overflow-hidden transition-all ${
              optimalRegime === "Old" ? "border-emerald-500 bg-emerald-500/[0.02]" : "border-zinc-200 bg-zinc-50/20"
            }`}>
              {optimalRegime === "Old" && (
                <div className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider">Recommended</div>
              )}
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Old Regime Tax Details</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">Allows 80C, 80D, HRA & home interest deductions</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <span className="text-zinc-500">Gross Income:</span>
                  <p className="font-bold text-zinc-900 mt-0.5">{formatRupee(grossIncome)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Deductions Applied:</span>
                  <p className="font-bold text-blue-600 mt-0.5">-{formatRupee(oldTotalDeductions)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Taxable Base:</span>
                  <p className="font-bold text-zinc-900 mt-0.5">{formatRupee(oldTaxableIncome)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Net Tax Payable:</span>
                  <p className="font-bold text-zinc-900 mt-0.5">{formatRupee(oldTax)}</p>
                </div>
              </div>
            </div>

            {/* New Regime Card */}
            <div className={`rounded-xl border p-5 relative overflow-hidden transition-all ${
              optimalRegime === "New" ? "border-emerald-500 bg-emerald-500/[0.02]" : "border-zinc-200 bg-zinc-50/20"
            }`}>
              {optimalRegime === "New" && (
                <div className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider">Recommended</div>
              )}
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">New Regime Tax Details</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">Flat tax slabs with standard rebate of ₹7.5L</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <span className="text-zinc-500">Gross Income:</span>
                  <p className="font-bold text-zinc-900 mt-0.5">{formatRupee(grossIncome)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Standard Deduction:</span>
                  <p className="font-bold text-blue-600 mt-0.5">-{formatRupee(newTotalDeductions)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Taxable Base:</span>
                  <p className="font-bold text-zinc-900 mt-0.5">{formatRupee(newTaxableIncome)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Net Tax Payable:</span>
                  <p className="font-bold text-zinc-900 mt-0.5">{formatRupee(newTax)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            2. Income Summary Card (6 Columns)
            ========================================== */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-5">
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

          <div>
            <h3 className="text-base font-bold text-zinc-900">Income Summary</h3>
            <p className="text-xs text-zinc-500">Track and compile all taxable income streams</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-100 font-semibold text-zinc-800">
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">Gross Income</span>
              <span className="text-lg font-bold text-zinc-900 mt-0.5">{formatRupee(grossIncome)}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">Net Taxable Income</span>
              <span className="text-lg font-bold text-zinc-900 mt-0.5">{formatRupee(currentTaxableIncome)}</span>
            </div>
          </div>

          {/* Details list inputs */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-semibold">Salary Income:</span>
              <input
                type="number"
                value={salary}
                step="50000"
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-32 h-7 text-right rounded border border-zinc-200 bg-transparent px-2 font-bold text-zinc-900"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-semibold">Freelance Income:</span>
              <input
                type="number"
                value={freelance}
                step="10000"
                onChange={(e) => setFreelance(Number(e.target.value))}
                className="w-32 h-7 text-right rounded border border-zinc-200 bg-transparent px-2 font-bold text-zinc-900"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-semibold">Rental Yield:</span>
              <input
                type="number"
                value={rental}
                step="5000"
                onChange={(e) => setRental(Number(e.target.value))}
                className="w-32 h-7 text-right rounded border border-zinc-200 bg-transparent px-2 font-bold text-zinc-900"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-semibold">Capital Gains:</span>
              <input
                type="number"
                value={capitalGains}
                step="5000"
                onChange={(e) => setCapitalGains(Number(e.target.value))}
                className="w-32 h-7 text-right rounded border border-zinc-200 bg-transparent px-2 font-bold text-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* ==========================================
            3. Tax Deductions Tracker Card (6 Columns)
            ========================================== */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-5">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Percent className="h-5 w-5" />
            </div>
            <span className="text-xs text-blue-600 font-bold">Old Regime Deductions Tracker</span>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-900">Deductions Tracker</h3>
            <p className="text-xs text-zinc-500 font-medium">Verify your investments limits and exemption allocations</p>
          </div>

          {/* Section details */}
          <div className="space-y-4 text-xs overflow-y-auto max-h-80 pr-1">
            {/* Section 80C */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span>Section 80C (PPF, ELSS, Insurance)</span>
                <span className="text-zinc-500">{formatRupee(total80C)} / {formatRupee(150000)} Limit</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${(total80C / 150000) * 100}%` }} />
              </div>
            </div>

            {/* Section 80D */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span>Section 80D (Health Insurance Premium)</span>
                <span className="text-zinc-500">{formatRupee(total80D)} / {formatRupee(75000)} Limit</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${(total80D / 75000) * 100}%` }} />
              </div>
            </div>

            {/* Section 80CCD */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span>Section 80CCD(1B) (NPS Extra)</span>
                <span className="text-zinc-500">{formatRupee(total80CCD)} / {formatRupee(50000)} Limit</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${(total80CCD / 50000) * 100}%` }} />
              </div>
            </div>

            {/* Section 24b */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span>Section 24(b) (Home Mortgage Interest)</span>
                <span className="text-zinc-500">{formatRupee(total24b)} / {formatRupee(200000)} Limit</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${(total24b / 200000) * 100}%` }} />
              </div>
            </div>

            {/* HRA Exemption Calculator */}
            <div className="rounded-xl border border-zinc-150 bg-zinc-50 p-4.5 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200/65">
                <span className="font-bold text-zinc-800">HRA Exemption Calculator</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Exempt: {formatRupee(hraExemption)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-zinc-600">
                <div className="space-y-1">
                  <span>Basic Salary:</span>
                  <input
                    type="number"
                    value={hraBasic}
                    onChange={(e) => setHraBasic(Number(e.target.value))}
                    className="w-full h-7 rounded border border-zinc-200 bg-white px-2 text-zinc-900"
                  />
                </div>
                <div className="space-y-1">
                  <span>HRA Component:</span>
                  <input
                    type="number"
                    value={hraReceived}
                    onChange={(e) => setHraReceived(Number(e.target.value))}
                    className="w-full h-7 rounded border border-zinc-200 bg-white px-2 text-zinc-900"
                  />
                </div>
                <div className="space-y-1">
                  <span>Annual Rent Paid:</span>
                  <input
                    type="number"
                    value={hraRentPaid}
                    onChange={(e) => setHraRentPaid(Number(e.target.value))}
                    className="w-full h-7 rounded border border-zinc-200 bg-white px-2 text-zinc-900"
                  />
                </div>
                <div className="space-y-1 flex flex-col justify-end">
                  <label className="flex items-center gap-1.5 cursor-pointer pb-1">
                    <input
                      type="checkbox"
                      checked={hraIsMetro}
                      onChange={(e) => setHraIsMetro(e.target.checked)}
                      className="rounded border-zinc-200 text-blue-600 h-3.5 w-3.5"
                    />
                    <span>Lives in Metro City</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            4. AI Tax Optimizer Card (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-sm">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">AI Tax Optimizer</h3>
              <p className="text-xs text-zinc-500">Personalized optimization checks</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-blue-50/50 border border-blue-100/50 rounded-xl relative">
              <span className="absolute top-2 right-2 bg-blue-600 text-white rounded-full px-1.5 py-0.5 text-[8px] font-bold">Priority: High</span>
              <p className="font-bold text-blue-950">Maximize Section 80C</p>
              <p className="text-[11px] text-zinc-600 mt-1 leading-normal">
                Invest ₹30,000 more in ELSS funds to fully utilize the ₹1.5L Section 80C threshold. Savings: <span className="font-bold text-emerald-600">₹9,000</span>.
              </p>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl relative">
              <span className="absolute top-2 right-2 bg-zinc-500 text-white rounded-full px-1.5 py-0.5 text-[8px] font-bold">Priority: Med</span>
              <p className="font-bold text-zinc-900">Optimize Section 80CCD</p>
              <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
                Contribute ₹20,000 more to National Pension System (NPS) to exhaust the ₹50,000 deduction. Savings: <span className="font-bold text-emerald-600">₹6,200</span>.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            5. Auto Tax Detection Card (8 Columns)
            ========================================== */}
        <div className="lg:col-span-8 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">Auto Tax Detection</h3>
                <p className="text-xs text-zinc-500">Classify transaction statements into eligible sections</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase bg-zinc-50 px-2 py-0.5 rounded">Statement Sync: Active</span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="px-4 py-2.5">Transaction Detail</th>
                  <th className="px-4 py-2.5">Amount</th>
                  <th className="px-4 py-2.5">Suggested Section</th>
                  <th className="px-4 py-2.5">Confidence</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {autoDetections.map((d) => (
                  <tr key={d.id} className="hover:bg-zinc-50/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-zinc-900">{d.desc}</td>
                    <td className="px-4 py-3 font-semibold text-zinc-800">{formatRupee(d.amount)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">{d.category}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{d.confidence}%</td>
                    <td className="px-4 py-3 text-right">
                      {d.status === "pending" ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleAcceptDetection(d.id, d.amount, d.category)}
                            className="h-6 w-6 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors"
                            title="Accept Category"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleRejectDetection(d.id)}
                            className="h-6 w-6 rounded bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                            title="Reject Category"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-bold ${d.status === 'accepted' ? 'text-emerald-600' : 'text-red-500'}`}>
                          {d.status === 'accepted' ? 'Accepted' : 'Rejected'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==========================================
            6. Tax Calendar (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Tax Calendar</h3>
              <p className="text-xs text-zinc-500">Upcoming deadlines and proof limits</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex flex-col items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                <span>15</span>
                <span>SEP</span>
              </div>
              <div>
                <h4 className="font-bold text-zinc-800">Advance Tax Installment Q2</h4>
                <p className="text-[10px] text-zinc-500">Pay 30% of estimated annual taxes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex flex-col items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                <span>31</span>
                <span>DEC</span>
              </div>
              <div>
                <h4 className="font-bold text-zinc-800">Investment Proof Submission</h4>
                <p className="text-[10px] text-zinc-500 font-medium">Upload ELSS/PPF slips to company HR portal</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex flex-col items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                <span>31</span>
                <span>MAR</span>
              </div>
              <div>
                <h4 className="font-bold text-zinc-800">Tax Saving Deadline</h4>
                <p className="text-[10px] text-zinc-500">Last day to invest for FY25-26 deductions</p>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            7. Tax Filing Readiness Card (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Filing Readiness</h3>
              <p className="text-xs text-zinc-500">Verify ITR filing preparation checkpoints</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-800 mb-1.5">
                <span>Pre-filing Checklist Progress</span>
                <span className="text-emerald-600 font-bold">85% Ready</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "85%" }} />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-zinc-700">PAN & Aadhaar linked verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-zinc-700">AIS & Form 26AS matching logs verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-zinc-700">Bank account validation active</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-zinc-500">Form 16 upload pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            8. Documents Vault Card (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FolderLock className="h-5 w-5" />
            </div>
            <button className="text-xs text-blue-600 font-bold hover:underline">Share with CA</button>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-900">Documents Vault</h3>
            <p className="text-xs text-zinc-500">Securely store investments receipts & tax certificates</p>
          </div>

          {/* Simple file uploader input */}
          <form onSubmit={handleFileUpload} className="flex gap-2">
            <input
              type="text"
              placeholder="Upload file name..."
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="flex-1 h-8 rounded border border-zinc-200 bg-zinc-50/50 px-2 text-xs outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="h-8 bg-blue-600 hover:bg-blue-700 text-white rounded px-3 text-xs font-semibold transition-colors"
            >
              Upload
            </button>
          </form>

          {/* Files List */}
          <div className="space-y-2 text-xs">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                <div className="min-w-0">
                  <p className="font-bold text-zinc-900 truncate">{file.name}</p>
                  <span className="text-[9px] text-zinc-400">{file.type} • {file.size}</span>
                </div>
                <button className="text-zinc-400 hover:text-zinc-600">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            9. Tax Summary Dashboard Card (12 Columns)
            ========================================== */}
        <div className="lg:col-span-12 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-zinc-900 mb-6">Tax Summary Dashboard</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Table metrics */}
            <div className="lg:col-span-2 space-y-4 text-xs font-semibold text-zinc-800">
              <div className="flex justify-between p-2.5 rounded-lg bg-zinc-50">
                <span className="text-zinc-500">Gross Income:</span>
                <span>{formatRupee(grossIncome)}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-zinc-50">
                <span className="text-zinc-500">Applied Regime Deductions:</span>
                <span className="text-blue-600">-{formatRupee(currentTotalDeductions)}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-zinc-50">
                <span className="text-zinc-500">Net Taxable base:</span>
                <span>{formatRupee(currentTaxableIncome)}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-emerald-50 text-emerald-950">
                <span className="text-emerald-700">Estimated Annual Tax Liability:</span>
                <span className="font-black text-emerald-800">{formatRupee(currentTaxLiability)}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-zinc-50">
                <span className="text-zinc-500">Effective Tax Rate:</span>
                <span>{effectiveTaxRate}%</span>
              </div>
            </div>

            {/* SVG mini summary donut chart representation */}
            <div className="flex flex-col items-center justify-center space-y-4 bg-zinc-50 rounded-xl p-4 border border-zinc-100">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Effective Tax Breakdowns</span>
              <div className="relative h-28 w-28 flex items-center justify-center">
                {/* SVG circular slice */}
                <svg className="h-full w-full transform -rotate-90">
                  <circle cx="56" cy="56" r="46" className="stroke-emerald-500" strokeWidth="12" fill="transparent" strokeDasharray="289" strokeDashoffset="120" />
                  <circle cx="56" cy="56" r="46" className="stroke-blue-600" strokeWidth="12" fill="transparent" strokeDasharray="289" strokeDashoffset="169" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xs text-zinc-400 font-semibold">Regime</span>
                  <span className="text-sm font-black text-zinc-800">{selectedRegime}</span>
                </div>
              </div>
              <div className="flex gap-4 text-[9px] font-bold text-zinc-400">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-600" /> Tax Paid</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Net Savings</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
