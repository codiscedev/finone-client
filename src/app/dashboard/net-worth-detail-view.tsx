"use client";

import * as React from "react";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Building2,
  FileText,
  ShieldCheck,
  Target,
  Sparkles,
  Percent,
  Coins,
  History,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  Plus,
  ChevronRight,
  Bookmark,
  Home,
  Car,
  Wallet,
  CreditCard,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NetWorthDetailViewProps {
  onBack: () => void;
}

export default function NetWorthDetailView({ onBack }: NetWorthDetailViewProps) {
  // Value states
  const netWorth = 5240000; // ₹52,40,000
  const absoluteGain = 420000; // +₹4,20,000
  const gainPercent = 8.7; // 8.7%
  
  const totalAssets = 6500000; // ₹65,00,000
  const totalDebts = 1260000; // ₹12,60,000
  const investmentValue = 1580000; // ₹15,80,000

  // Formatting utilities
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleExportInfographic = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anandha's Net Worth Infographic - FinOne</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #09090b;
      --bg-card: #111113;
      --primary: #3b82f6;
      --emerald: #10b981;
      --amber: #f59e0b;
      --red: #ef4444;
      --text: #f4f4f5;
      --text-muted: #a1a1aa;
      --border: #27272a;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      width: 100%;
      max-width: 680px;
      background-color: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      position: relative;
    }
    .brand-top {
      background: linear-gradient(90deg, #1e3a8a, #3b82f6);
      height: 6px;
      width: 100%;
    }
    .header {
      padding: 45px 30px 30px;
      text-align: center;
      border-bottom: 1px solid var(--border);
      position: relative;
    }
    .header-tag {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--primary);
    }
    .header-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 950;
      font-size: 38px;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 6px;
    }
    .networth-box {
      margin-top: 18px;
      display: inline-block;
      background: rgba(59, 130, 246, 0.08);
      border: 1.5px solid var(--primary);
      border-radius: 16px;
      padding: 12px 28px;
    }
    .networth-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 34px;
      color: #fff;
      letter-spacing: 0.5px;
    }
    .networth-delta {
      font-size: 13px;
      font-weight: 750;
      color: var(--emerald);
      margin-top: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
    }
    .totals-grid {
      display: grid;
      grid-template-cols: repeat(3, 1fr);
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      background: rgba(0, 0, 0, 0.2);
    }
    .total-item {
      padding: 22px 15px;
      text-align: center;
      border-right: 1px solid var(--border);
    }
    .total-item:last-child {
      border-right: none;
    }
    .total-label {
      font-size: 10px;
      font-weight: 750;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--text-muted);
    }
    .total-val {
      font-family: 'Outfit', sans-serif;
      font-size: 19px;
      font-weight: 800;
      color: #fff;
      margin-top: 6px;
    }
    .content-body {
      padding: 30px;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    .section-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #fff;
      border-bottom: 2px solid var(--border);
      padding-bottom: 8px;
      margin-bottom: 15px;
    }
    .split-grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 600px) {
      .split-grid {
        grid-template-cols: 1fr;
      }
    }
    .list-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.015);
      border: 1px solid var(--border);
      border-radius: 12px;
    }
    .item-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
    }
    .item-val {
      font-size: 12px;
      font-weight: 750;
      color: #fff;
    }
    .debt-val {
      color: var(--red);
    }
    .donut-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
    }
    @media (max-width: 500px) {
      .donut-section {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
    .donut-chart-container {
      position: relative;
      width: 100px;
      height: 100px;
    }
    .donut-labels {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }
    .donut-label-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-weight: 600;
    }
    .donut-dot {
      height: 8px;
      width: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
    }
    .recent-box {
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
    }
    .recent-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-weight: 600;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }
    .recent-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .recent-delta {
      font-weight: 750;
    }
    .recent-time {
      color: var(--text-muted);
      font-size: 10px;
    }
    .ai-box {
      background: rgba(16, 185, 129, 0.02);
      border: 1px solid rgba(16, 185, 129, 0.15);
      border-radius: 16px;
      padding: 20px;
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 15px;
    }
    @media (max-width: 500px) {
      .ai-box {
        grid-template-cols: 1fr;
      }
    }
    .ai-check-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text);
    }
    .ai-circle {
      height: 16px;
      width: 16px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid var(--emerald);
      color: var(--emerald);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      flex-shrink: 0;
    }
    .brand-bottom {
      background: #ef4444;
      padding: 12px;
      text-align: center;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #fff;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="brand-top"></div>
    <div class="header">
      <span class="header-tag">FINONE PORTFOLIO REGISTRY</span>
      <h1 class="header-title">ANANDHA MURTHY</h1>
      
      <div class="networth-box">
        <div class="networth-title">₹52,40,000</div>
        <div class="networth-delta">▲ +₹4,20,000 (8.7% YoY)</div>
      </div>
    </div>

    <div class="totals-grid">
      <div class="total-item">
        <span class="total-label">Total Assets</span>
        <div class="total-val">₹65,00,000</div>
      </div>
      <div class="total-item">
        <span class="total-label">Total Debts</span>
        <div class="total-val" style="color: var(--red)">₹12,60,000</div>
      </div>
      <div class="total-item">
        <span class="total-label">Investments</span>
        <div class="total-val" style="color: var(--emerald)">₹15,80,000</div>
      </div>
    </div>

    <div class="content-body">
      
      <div class="split-grid">
        
        <div>
          <h3 class="section-title">Asset Split Weight</h3>
          <div class="donut-section">
            <div class="donut-chart-container">
              <svg viewBox="0 0 100 100" class="donut">
                <!-- Property 60% -->
                <circle cx="50" cy="50" r="38" stroke="var(--primary)" stroke-width="12" fill="transparent" stroke-dasharray="238.7" stroke-dashoffset="0" />
                <!-- Investments 20% -->
                <circle cx="50" cy="50" r="38" stroke="var(--emerald)" stroke-width="12" fill="transparent" stroke-dasharray="238.7" stroke-dashoffset="95.5" />
                <!-- Gold 10% -->
                <circle cx="50" cy="50" r="38" stroke="var(--amber)" stroke-width="12" fill="transparent" stroke-dasharray="238.7" stroke-dashoffset="143.2" />
                <!-- Cash & Vehicles 10% -->
                <circle cx="50" cy="50" r="38" stroke="#a1a1aa" stroke-width="12" fill="transparent" stroke-dasharray="238.7" stroke-dashoffset="191.0" />
              </svg>
            </div>
            
            <div class="donut-labels">
              <div class="donut-label-item">
                <span><span class="donut-dot" style="background: var(--primary)"></span>Property</span>
                <span>60%</span>
              </div>
              <div class="donut-label-item">
                <span><span class="donut-dot" style="background: var(--emerald)"></span>Investments</span>
                <span>20%</span>
              </div>
              <div class="donut-label-item">
                <span><span class="donut-dot" style="background: var(--amber)"></span>Gold</span>
                <span>10%</span>
              </div>
              <div class="donut-label-item">
                <span><span class="donut-dot" style="background: #a1a1aa"></span>Liquids & Cars</span>
                <span>10%</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="section-title">Recent Adjustments</h3>
          <div class="recent-box">
            <div class="recent-item">
              <div>
                <div>Mutual Fund Allocation</div>
                <span class="recent-time">2 days ago</span>
              </div>
              <span class="recent-delta" style="color: var(--emerald)">+₹80,000</span>
            </div>
            <div class="recent-item">
              <div>
                <div>Car Depreciation</div>
                <span class="recent-time">5 days ago</span>
              </div>
              <span class="recent-delta" style="color: var(--red)">-₹30,000</span>
            </div>
            <div class="recent-item">
              <div>
                <div>Property Appreciation</div>
                <span class="recent-time">Last Month</span>
              </div>
              <span class="recent-delta" style="color: var(--emerald)">+₹2,00,000</span>
            </div>
          </div>
        </div>

      </div>

      <div class="split-grid">
        
        <div>
          <h3 class="section-title">Asset Holdings</h3>
          <div class="list-container">
            <div class="list-item">
              <span class="item-label">🏠 Property</span>
              <span class="item-val">₹39,00,000</span>
            </div>
            <div class="list-item">
              <span class="item-label">📈 Investments</span>
              <span class="item-val">₹13,00,000</span>
            </div>
            <div class="list-item">
              <span class="item-label">🥇 Gold Commodity</span>
              <span class="item-val">₹6,50,000</span>
            </div>
            <div class="list-item">
              <span class="item-label">🚗 Vehicles</span>
              <span class="item-val">₹3,25,000</span>
            </div>
            <div class="list-item">
              <span class="item-label">💰 Cash & Bank</span>
              <span class="item-val">₹3,25,000</span>
            </div>
          </div>
        </div>

        <div>
          <h3 class="section-title">Debts & Liabilities</h3>
          <div class="list-container">
            <div class="list-item">
              <span class="item-label">🏠 Home Mortgage</span>
              <span class="item-val debt-val">₹8,50,000</span>
            </div>
            <div class="list-item">
              <span class="item-label">🚗 Vehicle Loan</span>
              <span class="item-val debt-val">₹2,50,000</span>
            </div>
            <div class="list-item">
              <span class="item-label">💳 Personal Loan</span>
              <span class="item-val debt-val">₹1,60,000</span>
            </div>
          </div>
        </div>

      </div>

      <div>
        <h3 class="section-title">AI Portfolio Insights</h3>
        <div class="ai-box">
          <div class="ai-check-item">
            <span class="ai-circle">✓</span>
            <span>Net worth increased 8.7% over last year</span>
          </div>
          <div class="ai-check-item">
            <span class="ai-circle">✓</span>
            <span>Property contributes 60% of your wealth</span>
          </div>
          <div class="ai-check-item">
            <span class="ai-circle">✓</span>
            <span>Debt-to-Asset Ratio: 19% (Healthy)</span>
          </div>
          <div class="ai-check-item">
            <span class="ai-circle">✓</span>
            <span>Emergency fund covers 8 months</span>
          </div>
        </div>
      </div>

    </div>

    <div class="brand-bottom">
      Follow FinOne daily for premium wealth insights
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Anandha_NetWorth_Infographic.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Trend dataset (Jan - Dec values in Lakhs)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const trendValues = [35.0, 36.5, 38.0, 41.2, 43.5, 45.0, 47.8, 49.0, 50.5, 51.8, 52.0, 52.4]; // in Lakhs

  const svgWidth = 500;
  const svgHeight = 160;
  const maxVal = 60.0;
  const minVal = 30.0;
  
  const chartCoordinates = trendValues.map((val, idx) => {
    const x = (idx / (trendValues.length - 1)) * svgWidth;
    const y = svgHeight - ((val - minVal) / (maxVal - minVal)) * (svgHeight - 20) - 10;
    return `${x},${y}`;
  }).join(" ");

  // Asset splits
  const assetSplits = [
    { name: "Property", pct: 60, val: 3900000, color: "bg-blue-600", stroke: "stroke-blue-600" },
    { name: "Investments", pct: 20, val: 1300000, color: "bg-emerald-500", stroke: "stroke-emerald-500" },
    { name: "Gold", pct: 10, val: 650000, color: "bg-amber-500", stroke: "stroke-amber-500" },
    { name: "Vehicles", pct: 5, val: 325000, color: "bg-purple-500", stroke: "stroke-purple-500" },
    { name: "Cash & Bank", pct: 5, val: 325000, color: "bg-zinc-400", stroke: "stroke-zinc-400" }
  ];

  // Asset Items list
  const assetItems = [
    { label: "Property", icon: <Building2 className="h-4 w-4 text-blue-600 shrink-0" />, val: 3900000 },
    { label: "Investments", icon: <Briefcase className="h-4 w-4 text-emerald-600 shrink-0" />, val: 1300000 },
    { label: "Gold", icon: <Coins className="h-4 w-4 text-amber-500 shrink-0" />, val: 650000 },
    { label: "Vehicles", icon: <Car className="h-4 w-4 text-purple-600 shrink-0" />, val: 325000 },
    { label: "Cash & Bank", icon: <Wallet className="h-4 w-4 text-zinc-500 shrink-0" />, val: 325000 }
  ];

  // Debt Items list
  const debtItems = [
    { label: "Home Loan", icon: <Home className="h-4 w-4 text-red-500 shrink-0" />, val: 850000 },
    { label: "Car Loan", icon: <Car className="h-4 w-4 text-red-500 shrink-0" />, val: 250000 },
    { label: "Personal", icon: <CreditCard className="h-4 w-4 text-red-500 shrink-0" />, val: 160000 }
  ];

  // Recent changes log
  const recentChanges = [
    { text: "Mutual Fund", change: "+₹80,000", isGain: true, date: "2 days ago" },
    { text: "Car Depreciation", change: "-₹30,000", isGain: false, date: "5 days ago" },
    { text: "Property Appreciation", change: "+₹2,00,000", isGain: true, date: "Last Month" }
  ];

  // AI insights logs
  const aiInsights = [
    { text: "Net worth increased 8.7% over last year", isCheck: true },
    { text: "Property contributes 60% of your wealth", isCheck: true },
    { text: "Debt-to-Asset Ratio: 19% (Healthy)", isCheck: true },
    { text: "Emergency fund covers 8 months", isCheck: true }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
        <button onClick={onBack} className="hover:text-zinc-650 flex items-center outline-none">
          <ChevronLeft className="h-4 w-4 mr-0.5" /> Wealth
        </button>
        <span>/</span>
        <span className="text-zinc-700">Net Worth Details</span>
      </div>

      {/* Main Net Worth Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">Portfolio Asset Value Net Surplus</span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-2xl font-black text-zinc-950">{formatCurrency(netWorth)}</h2>
            <span className="text-xs font-black text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/30">
              <TrendingUp className="h-3.5 w-3.5" />
              +{formatCurrency(absoluteGain)} ({gainPercent}%)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onBack}
            className="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors shadow-sm outline-none"
          >
            Back to Wealth
          </Button>
          <Button
            onClick={handleExportInfographic}
            className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-xs font-bold transition-all active:scale-[0.98] outline-none"
          >
            Export Infographic
          </Button>
        </div>
      </div>

      {/* Summary KPI row cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Total Assets</span>
          <h3 className="text-xl font-black text-zinc-950">{formatCurrency(totalAssets)}</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Property, Gold & Cash basis</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Total Debts</span>
          <h3 className="text-xl font-black text-red-600">{formatCurrency(totalDebts)}</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">Active Mortgages & Credit card EMIs</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Investment Value</span>
          <h3 className="text-xl font-black text-emerald-600">{formatCurrency(investmentValue)}</h3>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1">SIP portfolios & mutual funds</p>
        </div>
      </div>

      {/* Analytics Graph Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Net Worth Trend line chart */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block mb-1">
              Net Worth Progression Trend
            </span>
            <p className="text-[11px] text-zinc-500 font-medium">Monthly compounding projection from Jan to Dec</p>
          </div>

          <div className="my-6 h-40 w-full relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1={svgHeight - 1} x2={svgWidth} y2={svgHeight - 1} stroke="#f4f4f5" strokeWidth="1.5" />
              <line x1="0" y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="#f4f4f5" strokeWidth="1.5" strokeDasharray="3,3" />
              
              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                points={chartCoordinates}
              />
              
              {/* Fill Area */}
              <polygon
                fill="url(#nwGrad)"
                points={`0,${svgHeight} ${chartCoordinates} ${svgWidth},${svgHeight}`}
              />

              {/* Data points */}
              {trendValues.map((val, idx) => {
                const x = (idx / (trendValues.length - 1)) * svgWidth;
                const y = svgHeight - ((val - minVal) / (maxVal - minVal)) * (svgHeight - 20) - 10;
                return (
                  <g key={idx} className="group/dot cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill={idx === trendValues.length - 1 ? "#3b82f6" : "white"}
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="transparent"
                      className="hover:fill-blue-500/10"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-[9px] text-zinc-400 font-bold uppercase border-t border-zinc-100 pt-3">
            {months.map((m, idx) => (
              <span key={idx}>{m}</span>
            ))}
          </div>
        </div>

        {/* Asset splits donut chart */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block mb-1">
              Asset Split Distribution
            </span>
            <p className="text-[11px] text-zinc-500 font-medium">Asset weights within holdings</p>
          </div>

          <div className="flex justify-center items-center py-4 relative my-3">
            <svg className="w-32 h-32 transform -rotate-90">
              {/* Property 60% */}
              <circle cx="64" cy="64" r="48" className="stroke-blue-600" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset="0" />
              {/* Investments 20% */}
              <circle cx="64" cy="64" r="48" className="stroke-emerald-500" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * 40) / 100} />
              {/* Gold 10% */}
              <circle cx="64" cy="64" r="48" className="stroke-amber-500" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * 20) / 100} />
              {/* Vehicles 5% */}
              <circle cx="64" cy="64" r="48" className="stroke-purple-500" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * 10) / 100} />
              {/* Cash & Bank 5% */}
              <circle cx="64" cy="64" r="48" className="stroke-zinc-400" strokeWidth="15" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * 5) / 100} />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Valuation</span>
              <span className="text-xs font-black text-zinc-950 mt-0.5">₹65.0L</span>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-zinc-100 pt-3 text-[10px] font-bold text-zinc-500">
            {assetSplits.map((split, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`h-2 w-2 rounded ${split.color} shrink-0`} />
                  <span className="truncate">{split.name}</span>
                </div>
                <span>{split.pct}% ({formatCurrency(split.val)})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Assets vs Debts holdings ledger sheets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Assets Ledger list */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-150/40 bg-zinc-50/50 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5">
              <Coins className="h-4.5 w-4.5 text-zinc-400" /> Asset Portfolio Registry
            </h3>
            <span className="text-xs font-black text-zinc-950">{formatCurrency(totalAssets)}</span>
          </div>

          <div className="divide-y divide-zinc-50">
            {assetItems.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className="text-zinc-800 font-bold">{item.label}</span>
                </div>
                <span className="text-zinc-950 font-bold">{formatCurrency(item.val)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Debts Ledger list */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-150/40 bg-zinc-50/50 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5">
              <TrendingDown className="h-4.5 w-4.5 text-zinc-400" /> Debts & Liabilities Ledger
            </h3>
            <span className="text-xs font-black text-red-600">{formatCurrency(totalDebts)}</span>
          </div>

          <div className="divide-y divide-zinc-50">
            {debtItems.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className="text-zinc-800 font-bold">{item.label}</span>
                </div>
                <span className="text-zinc-950 font-bold">{formatCurrency(item.val)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Changes timeline */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
        <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
          <History className="h-4.5 w-4.5 text-zinc-400" /> Recent adjustments timeline
        </h3>

        <div className="relative pl-4 border-l border-zinc-100 space-y-4 ml-1">
          {recentChanges.map((change, idx) => (
            <div key={idx} className="relative">
              <span className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white ${
                change.isGain ? "bg-emerald-600" : "bg-red-500"
              }`} />
              <div className="flex justify-between items-center text-xs font-medium text-zinc-650">
                <p className="text-[11px] font-bold text-zinc-850">
                  {change.isGain ? "▲" : "▼"} {change.text} <span className={`font-black ${
                    change.isGain ? "text-emerald-600" : "text-red-500"
                  }`}>{change.change}</span>
                </p>
                <span className="text-[9px] text-zinc-400 font-bold">{change.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights & Checklists */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
        <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
          <Sparkles className="h-4.5 w-4.5 text-indigo-600" /> AI Financial Net Worth Insights
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-zinc-200/60 bg-zinc-50/20 flex items-center gap-2.5 text-xs font-bold text-zinc-700">
              <span className="h-4 w-4 bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center rounded-full text-[10px] select-none">
                ✓
              </span>
              <span>{insight.text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
