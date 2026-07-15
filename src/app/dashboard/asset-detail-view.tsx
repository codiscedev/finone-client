"use client";

import * as React from "react";
import {
  ChevronLeft,
  Calendar,
  Download,
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  TrendingDown,
  Building2,
  FileText,
  ShieldCheck,
  Target,
  Users,
  Eye,
  Trash,
  Upload,
  Info,
  Sparkles,
  Percent,
  Coins,
  History,
  MoreVertical,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomAlert } from "@/components/ui/custom-alert-dialog";

interface AssetDetailViewProps {
  assetName: string;
  onBack: () => void;
}

export default function AssetDetailView({ assetName, onBack }: AssetDetailViewProps) {
  const { showSuccess, showWarning, showDelete } = useCustomAlert();
  // Check which mock asset is selected to customize values
  const isProperty = assetName.toLowerCase().includes("apartment") || assetName.toLowerCase().includes("flat") || assetName.toLowerCase().includes("property");
  
  // Custom mock data based on selection
  const [currentVal, setCurrentVal] = React.useState(isProperty ? 45000000 : 1248000);
  const purchasePrice = isProperty ? 32000000 : 800000;
  const purchaseDate = isProperty ? "2022-06-15" : "2023-11-10";
  const categoryLabel = isProperty ? "Property" : "Stock Investment";
  
  // Update Modal State
  const [showValUpdateModal, setShowValUpdateModal] = React.useState(false);
  const [newValueInput, setNewValueInput] = React.useState("");

  // Timeline Filter State
  const [timeFilter, setTimeFilter] = React.useState<"1M" | "6M" | "1Y" | "3Y" | "5Y" | "ALL">("1Y");

  // Document Vault State
  const [documents, setDocuments] = React.useState([
    { name: isProperty ? "Purchase_Deed_Registry.pdf" : "Brokerage_Statement_Nov2023.pdf", size: "4.2 MB", date: "2023-11-12" },
    { name: isProperty ? "Property_Tax_Receipt_2025.pdf" : "Capital_Gains_Summary_2024.pdf", size: "1.8 MB", date: "2025-01-20" },
    { name: isProperty ? "Home_Insurance_Certificate.pdf" : "Form_16A_Tax_Withheld.pdf", size: "2.1 MB", date: "2024-06-18" }
  ]);

  // Handle mock file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newDoc = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        date: new Date().toISOString().split('T')[0]
      };
      setDocuments([newDoc, ...documents]);
      showSuccess("Success", `File "${file.name}" uploaded securely to Vault!`);
    }
  };

  // Calculations
  const absoluteGain = currentVal - purchasePrice;
  const gainPercent = Math.round((absoluteGain / purchasePrice) * 100);
  
  // Holding Period calculation in years
  const start = new Date(purchaseDate);
  const end = new Date();
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const holdingYears = Number((diffTime / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1));
  
  // CAGR Calculation
  const cagr = holdingYears > 0 
    ? Math.round((Math.pow((currentVal / purchasePrice), 1 / holdingYears) - 1) * 100)
    : 0;

  // Formatting utilities
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Dynamic Chart Datasets based on time filter
  const chartPoints = {
    "1M": [98, 99, 99, 100],
    "6M": [92, 94, 96, 98, 99, 100],
    "1Y": [85, 88, 91, 93, 97, 100],
    "3Y": [70, 78, 83, 89, 94, 100],
    "5Y": [55, 68, 79, 86, 92, 100],
    "ALL": [ purchasePrice / currentVal * 100, 65, 75, 88, 94, 100 ]
  };
  const activePoints = chartPoints[timeFilter];

  // Map values dynamically
  const svgWidth = 500;
  const svgHeight = 120;
  const chartCoordinates = activePoints.map((pct, idx) => {
    const x = (idx / (activePoints.length - 1)) * svgWidth;
    const y = svgHeight - (pct / 100) * (svgHeight - 10);
    return `${x},${y}`;
  }).join(" ");

  const handleValUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(newValueInput);
    if (!val || val <= 0) {
      showWarning("Warning", "Please enter a valid valuation amount.");
      return;
    }
    setCurrentVal(val);
    setShowValUpdateModal(false);
    setNewValueInput("");
    showSuccess("Success", "Valuation updated successfully!");
  };

  // Transactions ledger data
  const transactions = [
    { date: "2025-05-10", type: "Income", amount: isProperty ? 45000 : 8500, desc: isProperty ? "Monthly rental yield credit" : "Dividend payment payout", source: "HDFC Bank" },
    { date: "2025-04-18", type: "Expense", amount: isProperty ? 12000 : 0, desc: isProperty ? "Society maintenance surcharge" : "-", source: "ICICI Bank" },
    { date: "2025-03-05", type: "Investment", amount: isProperty ? 0 : 45000, desc: isProperty ? "-" : "SIP batch purchases", source: "SBI Account" },
    { date: "2024-12-15", type: "Income", amount: isProperty ? 45000 : 6200, desc: isProperty ? "Monthly rental yield credit" : "Quarterly Dividend distribution", source: "HDFC Bank" }
  ];

  // Linked items
  const linkedDebt = isProperty ? "SBI MaxGain Home Loan (Outstanding: ₹21,48,000)" : "No Loan linked";
  const linkedInsurance = isProperty ? "HDFC Ergo Home Shield Plan (Expiry: 2026-06)" : "No active insurance";
  const linkedWorkspace = isProperty ? "Couple Savings Plan Workspace" : "Personal Investment Hub";

  // AI recommendations data
  const aiInsights = [
    {
      text: isProperty 
        ? `${assetName} represents 32% of your overall Net Worth, creating real estate portfolio concentration risks.` 
        : `This equity portfolio CAGR (${cagr}%) exceeds typical benchmark yields. Maintain automated SIP buyings.`,
      impact: isProperty ? "Risk Reduction Alert" : "SIP Goal target aligned",
      confidence: "92% Confidence",
      priority: isProperty ? "High" : "Medium",
      action: isProperty ? "Diversify assets" : "Keep compounding"
    },
    {
      text: isProperty
        ? "Property value appreciation qualifies for Section 54 exemptions if reinvested in bonds or next properties."
        : "Holding period is > 12 months, classifying gains as LTCG (taxed at lower rates). Consideration for partial harvest.",
      impact: "Saves ₹85,000 in capital gains",
      confidence: "88% Confidence",
      priority: "Medium",
      action: "Tax Optimization"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
        <button onClick={onBack} className="hover:text-zinc-650 flex items-center outline-none cursor-pointer">
          <ChevronLeft className="h-4 w-4 mr-0.5" /> Wealth
        </button>
        <span>/</span>
        <span>Assets</span>
        <span>/</span>
        <span className="text-zinc-700">{assetName}</span>
      </div>

      {/* Header Actions row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
            {isProperty ? <Building2 className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-zinc-950">{assetName}</h2>
              <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase border border-blue-100/50">
                APPRECIATION
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-semibold mt-1">
              Category: {categoryLabel} • Status: <span className="text-emerald-600">Active</span> • Last Updated: Today
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowValUpdateModal(true)}
            className="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors shadow-sm outline-none"
          >
            Update Current Value
          </Button>
          <Button
            className="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors shadow-sm outline-none"
          >
            <Edit className="h-3.5 w-3.5 mr-1" /> Edit details
          </Button>
          <Button
            onClick={() => {
              showDelete(
                "Delete",
                "Are you sure you want to delete this asset from your portfolio registry?",
                onBack
              );
            }}
            className="h-9 px-3 rounded-xl border border-red-100 bg-red-50/20 hover:bg-red-50 text-xs font-bold text-red-600 transition-colors outline-none shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Hero Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KPI metrics details */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/80 p-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-zinc-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400">Current Valuation</span>
              <h3 className="text-xl font-black text-zinc-950 mt-1">{formatCurrency(currentVal)}</h3>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400">Invested Capital</span>
              <h3 className="text-xl font-black text-zinc-650 mt-1">{formatCurrency(purchasePrice)}</h3>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400">Absolute Yield</span>
              <h3 className={`text-xl font-black mt-1 flex items-center gap-1 ${absoluteGain >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {absoluteGain >= 0 ? "+" : ""}{formatCurrency(absoluteGain)}
              </h3>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400">Holding Period</span>
              <h3 className="text-xl font-black text-zinc-950 mt-1">{holdingYears} Years</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 text-xs text-zinc-500 font-medium">
            <div>
              Gain Percentage: <span className="font-bold text-zinc-900">+{gainPercent}%</span>
            </div>
            <div>
              Purchase Date: <span className="font-bold text-zinc-900">{purchaseDate}</span>
            </div>
            <div>
              Annual CAGR Yield: <span className="font-bold text-blue-600">~{cagr}% p.a.</span>
            </div>
          </div>
        </div>

        {/* Mini Performance Graph */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Performance Trend</span>
            <div className="flex items-center gap-1">
              {(["1M", "6M", "1Y", "3Y", "ALL"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold outline-none transition-colors ${
                    timeFilter === t ? "bg-blue-600 text-white" : "text-zinc-500 hover:bg-zinc-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Simple Sparkline Area Chart */}
          <div className="my-4 h-24 w-full relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid line */}
              <line x1="0" y1={svgHeight - 1} x2={svgWidth} y2={svgHeight - 1} stroke="#f4f4f5" strokeWidth="1.5" />
              {/* Trend path */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                points={chartCoordinates}
              />
              {/* Fill Gradient */}
              <polygon
                fill="url(#detailGrad)"
                points={`0,${svgHeight} ${chartCoordinates} ${svgWidth},${svgHeight}`}
              />
              {/* Highlight Point */}
              <circle
                cx={svgWidth}
                cy={svgHeight - (activePoints[activePoints.length - 1] / 100) * (svgHeight - 10)}
                r="4.5"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[9px] text-zinc-400 font-bold uppercase">
            <span>Growth trend ({timeFilter})</span>
            <span className="text-blue-600">Compounded</span>
          </div>
        </div>

      </div>

      {/* Main details body layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column info sections */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* General Asset Information */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5">
                <Coins className="h-4.5 w-4.5 text-zinc-400" /> Asset Overview
              </h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Asset Name</span>
                <span className="font-semibold text-zinc-900">{assetName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Category</span>
                <span className="font-semibold text-zinc-900">{categoryLabel}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Asset Type</span>
                <span className="font-semibold text-zinc-900">APPRECIATION</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Purchase Date</span>
                <span className="font-semibold text-zinc-900">{purchaseDate}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Purchase Price</span>
                <span className="font-bold text-zinc-900">{formatCurrency(purchasePrice)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Current Value</span>
                <span className="font-bold text-blue-600">{formatCurrency(currentVal)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Ownership Stake</span>
                <span className="font-semibold text-zinc-900">100% (Sarah & Anandha)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Co-applicant</span>
                <span className="font-semibold text-zinc-900">Sarah Member</span>
              </div>
              <div className="sm:col-span-2 pt-2 text-zinc-500 leading-relaxed font-semibold">
                <span className="text-zinc-400 block mb-1 uppercase text-[10px] font-black tracking-wide">Internal Notes</span>
                Registered joint co-managed portfolio asset. Valuations are benchmarked annually against bank locks or market indexes.
              </div>
            </div>
          </div>

          {/* Tax Information & Capital gains */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
              <Scale className="h-4.5 w-4.5 text-zinc-400" /> Capital Gains Tax Worksheet
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-150/40 text-left">
                <span className="text-[9px] text-zinc-400 font-bold uppercase block mb-1">Holding Period Range</span>
                <p className="text-xs font-bold text-zinc-900">{holdingYears} Years</p>
                <span className="inline-block mt-1.5 text-[9px] font-bold uppercase text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-100/50">
                  LTCG TAX RULES
                </span>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-150/40 text-left">
                <span className="text-[9px] text-zinc-400 font-bold uppercase block mb-1">Estimated gains</span>
                <p className="text-xs font-bold text-zinc-900">{formatCurrency(absoluteGain)}</p>
                <span className="text-[9px] text-zinc-400 font-medium block mt-1">Sale price delta index</span>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-150/40 text-left">
                <span className="text-[9px] text-zinc-400 font-bold uppercase block mb-1">Tax Liability Estimate</span>
                <p className="text-xs font-bold text-zinc-900">{formatCurrency(absoluteGain * 0.125)}</p>
                <span className="inline-block mt-1.5 text-[9px] font-bold text-zinc-500">
                  ~12.5% LTCG Rate
                </span>
              </div>
            </div>

            <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50 flex items-start gap-2 text-xs leading-normal">
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-zinc-650 font-medium">
                {isProperty 
                  ? "Property reinvestments qualify for Section 54 tax exemptions if capital gains are reinvested in a new house or Section 54EC capital gains bonds within 2 years." 
                  : "Equity gains are exempt up to ₹1.25 Lakhs per financial year under Section 112A. Consider harvesting gains annually to maximize tax savings."}
              </p>
            </div>
          </div>

          {/* Related Transactions ledger */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100">
              <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide">Related Transactions Ledger</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100 font-bold text-zinc-500">
                    <th className="p-3">Date</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 font-medium">
                  {transactions.map((t, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50">
                      <td className="p-3 text-zinc-500">{t.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.type === "Income" ? "bg-emerald-50 text-emerald-600" : t.type === "Expense" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-500">{t.source}</td>
                      <td className="p-3 text-zinc-800">{t.desc}</td>
                      <td className={`p-3 text-right font-bold ${t.type === "Income" ? "text-emerald-600" : "text-zinc-950"}`}>
                        {t.type === "Income" ? "+" : "-"}{formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right column info panels */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Insights & Optimization Recommendations */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
              <Sparkles className="h-4.5 w-4.5 text-indigo-600" /> AI Valuation Recommendations
            </h3>

            <div className="space-y-4">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-zinc-200/60 bg-zinc-50/30 space-y-2">
                  <p className="text-[11px] font-medium leading-relaxed text-zinc-700">{insight.text}</p>
                  <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400 uppercase pt-1">
                    <span className="text-indigo-600">{insight.impact}</span>
                    <span className="bg-zinc-100 text-zinc-650 px-1.5 py-0.5 rounded">{insight.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Document Vault */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-zinc-400" /> Secure Vault
              </h3>
              
              {/* Document upload trigger */}
              <label className="text-[10px] font-bold text-blue-600 hover:underline flex items-center cursor-pointer">
                <Upload className="h-3 w-3 mr-1" /> Upload
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200/60 hover:bg-zinc-50 transition-colors">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[11px] font-bold text-zinc-950 truncate" title={doc.name}>
                      {doc.name}
                    </p>
                    <span className="text-[9px] text-zinc-400 font-semibold mt-0.5 block">
                      {doc.size} • {doc.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="p-1 text-zinc-400 hover:text-zinc-600 rounded" title="Download">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => {
                        showDelete(
                          "Delete",
                          `Delete "${doc.name}" permanently from vault?`,
                          () => {
                            setDocuments(documents.filter((_, i) => i !== idx));
                          }
                        );
                      }}
                      className="p-1 text-zinc-400 hover:text-red-600 rounded" 
                      title="Delete"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linked relationships */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide border-b border-zinc-100 pb-3">
              Linked Portfolios
            </h3>

            <div className="space-y-3.5 text-xs font-medium">
              <div className="flex items-start gap-2.5">
                <Users className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold leading-none mb-1">Linked Workspace</p>
                  <p className="text-zinc-900 font-bold">{linkedWorkspace}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-zinc-50">
                <ShieldCheck className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold leading-none mb-1">Insurance Linked</p>
                  <p className="text-zinc-900 font-bold">{linkedInsurance}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-zinc-50">
                <TrendingDown className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold leading-none mb-1">Linked Loan / Liability</p>
                  <p className="text-zinc-900 font-bold">{linkedDebt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chronological Event Timeline */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
              <History className="h-4.5 w-4.5 text-zinc-400" /> Timeline events
            </h3>

            <div className="relative pl-4 border-l border-zinc-100 space-y-5 ml-1">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                <p className="text-[11px] font-bold text-zinc-900 leading-none">Valuation Updated</p>
                <span className="text-[9px] text-zinc-400 font-bold mt-1 block">Jan 10, 2025</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-zinc-300 ring-4 ring-white" />
                <p className="text-[11px] font-bold text-zinc-700 leading-none">Insurance Certificate Uploaded</p>
                <span className="text-[9px] text-zinc-400 font-bold mt-1 block">June 18, 2024</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-zinc-300 ring-4 ring-white" />
                <p className="text-[11px] font-bold text-zinc-700 leading-none">Valuation Updated (+12%)</p>
                <span className="text-[9px] text-zinc-400 font-bold mt-1 block">Jan 15, 2024</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-zinc-300 ring-4 ring-white" />
                <p className="text-[11px] font-bold text-zinc-700 leading-none"> SBI Home Loan Linked</p>
                <span className="text-[9px] text-zinc-400 font-bold mt-1 block">June 20, 2023</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                <p className="text-[11px] font-bold text-zinc-900 leading-none">Asset Initial Purchase</p>
                <span className="text-[9px] text-zinc-400 font-bold mt-1 block">June 15, 2022</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Valuation update Modal */}
      {showValUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div onClick={() => setShowValUpdateModal(false)} className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity" />
          <form onSubmit={handleValUpdate} className="relative bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xl w-full max-w-sm z-10 space-y-4 animate-in zoom-in-95 duration-200">
            <div>
              <h4 className="text-sm font-black text-zinc-950 leading-none">Update Market Valuation</h4>
              <p className="text-[10px] text-zinc-400 mt-1 font-semibold">Input current registered valuation for this asset.</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Valuation (INR)</label>
              <input
                type="number"
                placeholder={currentVal.toString()}
                value={newValueInput}
                onChange={(e) => setNewValueInput(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-xs font-semibold text-zinc-900 focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowValUpdateModal(false)}
                className="px-3.5 h-8 rounded-lg border border-zinc-200 text-[11px] font-bold text-zinc-650 hover:bg-zinc-50 outline-none"
              >
                Cancel
              </button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 h-8 text-[11px] font-bold shadow-sm outline-none"
              >
                Save valuation
              </Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
