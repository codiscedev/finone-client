"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
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
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssetsOverviewViewProps {
  onBack: () => void;
  onAssetClick: (assetName: string) => void;
  onAddClick: () => void;
}

export default function AssetsOverviewView({ onBack, onAssetClick, onAddClick }: AssetsOverviewViewProps) {
  // Overall statistics
  const totalValuation = 112000000; // ₹11.2 Crores
  const totalPurchasePrice = 84000000; // ₹8.4 Crores
  const absoluteGain = totalValuation - totalPurchasePrice;
  const gainPercent = Math.round((absoluteGain / totalPurchasePrice) * 100);

  // Formatting utilities
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Categories with assets list
  const categoryGroups = [
    {
      name: "Property",
      code: "PROPERTY",
      icon: <Building2 className="h-4.5 w-4.5 text-blue-600" />,
      total: 62000000,
      share: 55,
      color: "bg-blue-600",
      assets: [
        { name: "Urban Apartment (2BHK Flat)", val: 45000000, purchase: 32000000, date: "2022-06-15", gain: "+40%" },
        { name: "Commercial Plot (Gurugram)", val: 17000000, purchase: 14000000, date: "2023-02-10", gain: "+21%" }
      ]
    },
    {
      name: "Securities & Equities",
      code: "SECURITIES",
      icon: <FileText className="h-4.5 w-4.5 text-emerald-600" />,
      total: 33600000,
      share: 30,
      color: "bg-emerald-500",
      assets: [
        { name: "Growth Equities Portfolio", val: 21600000, purchase: 18000000, date: "2023-11-10", gain: "+20%" },
        { name: "Global Index Mutual Funds", val: 12000000, purchase: 10000000, date: "2024-04-18", gain: "+20%" }
      ]
    },
    {
      name: "Gold & Commodities",
      code: "GOLD",
      icon: <Coins className="h-4.5 w-4.5 text-amber-500" />,
      total: 11200000,
      share: 10,
      color: "bg-amber-500",
      assets: [
        { name: "Physical Gold Reserve (Sovereign)", val: 11200000, purchase: 8000000, date: "2021-08-20", gain: "+40%" }
      ]
    },
    {
      name: "Vehicles",
      code: "VEHICLE",
      icon: <Layers className="h-4.5 w-4.5 text-zinc-500" />,
      total: 5200000,
      share: 5,
      color: "bg-zinc-400",
      assets: [
        { name: "BMW X5 SUV", val: 5200000, purchase: 6500000, date: "2024-01-12", gain: "-20%" }
      ]
    }
  ];

  // Recently bought assets (added within last 12 months)
  const recentlyBought = [
    { name: "Global Index Mutual Funds", category: "Securities", date: "2024-04-18", purchase: 10000000, current: 12000000 },
    { name: "BMW X5 SUV", category: "Vehicle", date: "2024-01-12", purchase: 6500000, current: 5200000 },
    { name: "Growth Equities Portfolio", category: "Securities", date: "2023-11-10", purchase: 18000000, current: 21600000 }
  ];

  // Portfolio AI insights
  const aiPortfolioInsights = [
    {
      text: "Real estate properties represent 55% of your overall assets, indicating heavy asset concentration. Consider diversifying next savings into liquid equities.",
      impact: "Diversification Risk Alert",
      priority: "High",
      action: "Rebalance Portfolio"
    },
    {
      text: "Your Physical Gold reserves appreciated by 40% absolute since acquisition. Gold serves as a strong hedging buffer matching current inflation cycles.",
      impact: "Hedging Buffer Intact",
      priority: "Medium",
      action: "Maintain Holding"
    },
    {
      text: "Securities holdings are eligible for LTCG harvest tax exemptions. Selling shares up to ₹1.25 Lakhs in gains this fiscal year saves on tax.",
      impact: "Saves up to ₹15,625 in tax",
      priority: "Low",
      action: "LTCG Harvesting"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
        <button onClick={onBack} className="hover:text-zinc-650 flex items-center outline-none cursor-pointer">
          <ChevronLeft className="h-4 w-4 mr-0.5" /> Wealth
        </button>
        <span>/</span>
        <span className="text-zinc-700">Assets Portfolio Overview</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-xl font-black text-zinc-950">Assets Overview & Analytics</h2>
          <p className="text-[11px] text-zinc-400 font-semibold mt-1">
            Aggregated dashboard of physical properties, commodities, liquid cash, and securities.
          </p>
        </div>
        <Button
          onClick={onAddClick}
          className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-semibold transition-all active:scale-[0.98] outline-none flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Asset
        </Button>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Summary & Categories */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hero Valuation summary card */}
          <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Total Assets Valuation</span>
              <h3 className="text-2xl font-black text-zinc-950">{formatCurrency(totalValuation)}</h3>
              <p className="text-[10px] text-zinc-500 font-medium">Net current market value</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Invested Principal</span>
              <h3 className="text-2xl font-black text-zinc-650">{formatCurrency(totalPurchasePrice)}</h3>
              <p className="text-[10px] text-zinc-500 font-medium">Purchase cost basis</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Net Appreciation</span>
              <h3 className="text-2xl font-black text-emerald-600">
                +{formatCurrency(absoluteGain)}
              </h3>
              <p className="text-[10px] text-emerald-600 font-bold">+{gainPercent}% Return Basis</p>
            </div>
          </div>

          {/* Category-based Asset Accordions/Lists */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide">Assets Category Breakdown</h3>
            
            {categoryGroups.map((group) => (
              <div 
                key={group.code} 
                className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden"
              >
                {/* Accordion/Category Header */}
                <div className="px-5 py-4 border-b border-zinc-150/40 bg-zinc-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-white border border-zinc-200/50 flex items-center justify-center shadow-xs shrink-0">
                      {group.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">{group.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                        {group.assets.length} Assets • {group.share}% Portfolio weight
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-zinc-950">{formatCurrency(group.total)}</p>
                  </div>
                </div>

                {/* Categories Holdings List */}
                <div className="divide-y divide-zinc-100">
                  {group.assets.map((asset, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => onAssetClick(asset.name)}
                      className="p-4 flex items-center justify-between text-xs hover:bg-zinc-50/75 transition-colors cursor-pointer group"
                    >
                      <div className="min-w-0 pr-4">
                        <p className="font-bold text-zinc-800 group-hover:text-blue-600 transition-colors truncate">
                          {asset.name}
                        </p>
                        <span className="text-[10px] text-zinc-400 font-medium mt-0.5 block">
                          Purchased: {asset.date} • Cost: {formatCurrency(asset.purchase)}
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-3 shrink-0">
                        <div>
                          <p className="font-bold text-zinc-900">{formatCurrency(asset.val)}</p>
                          <span className={`text-[9px] font-black block mt-0.5 ${
                            asset.gain.startsWith("+") ? "text-emerald-600" : "text-zinc-400"
                          }`}>
                            {asset.gain} yield
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Recently Bought Assets List */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-150/40">
              <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide">Recently Bought Assets (12M)</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100 font-bold text-zinc-500">
                    <th className="p-3">Asset</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Purchase Date</th>
                    <th className="p-3 text-right">Invested Value</th>
                    <th className="p-3 text-right">Current Valuation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 font-medium">
                  {recentlyBought.map((asset, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => onAssetClick(asset.name)}
                      className="hover:bg-zinc-50/50 cursor-pointer group"
                    >
                      <td className="p-3 text-zinc-900 font-bold group-hover:text-blue-600 transition-colors">
                        {asset.name}
                      </td>
                      <td className="p-3 text-zinc-500">{asset.category}</td>
                      <td className="p-3 text-zinc-400">{asset.date}</td>
                      <td className="p-3 text-right text-zinc-650">{formatCurrency(asset.purchase)}</td>
                      <td className="p-3 text-right text-blue-600 font-bold">{formatCurrency(asset.current)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Allocation Donut & AI insights */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Asset Allocation Chart */}
          <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block">
              Asset Allocation Graph
            </span>
            
            {/* Custom SVG Donut Chart */}
            <div className="flex justify-center items-center py-4 relative">
              <svg className="w-36 h-36 transform -rotate-90">
                {/* RE (55%) */}
                <circle cx="72" cy="72" r="54" className="stroke-blue-600" strokeWidth="18" fill="transparent" strokeDasharray="339.3" strokeDashoffset="0" />
                {/* Stocks (30%) */}
                <circle cx="72" cy="72" r="54" className="stroke-emerald-500" strokeWidth="18" fill="transparent" strokeDasharray="339.3" strokeDashoffset={339.3 - (339.3 * 45) / 100} />
                {/* Gold (10%) */}
                <circle cx="72" cy="72" r="54" className="stroke-amber-500" strokeWidth="18" fill="transparent" strokeDasharray="339.3" strokeDashoffset={339.3 - (339.3 * 15) / 100} />
                {/* Vehicle (5%) */}
                <circle cx="72" cy="72" r="54" className="stroke-zinc-400" strokeWidth="18" fill="transparent" strokeDasharray="339.3" strokeDashoffset={339.3 - (339.3 * 5) / 100} />
              </svg>
              
              <div className="absolute flex flex-col items-center">
                <span className="text-xs font-bold text-zinc-400 uppercase">Portfolio</span>
                <span className="text-sm font-black text-zinc-900 mt-0.5">₹11.2 Cr</span>
              </div>
            </div>

            {/* Custom legend with percentages */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-zinc-500 border-t border-zinc-100 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-blue-600 shrink-0" />
                <span>Real Estate: 55%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-emerald-500 shrink-0" />
                <span>Stocks/Sec: 30%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-amber-500 shrink-0" />
                <span>Gold: 10%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-zinc-400 shrink-0" />
                <span>Vehicles: 5%</span>
              </div>
            </div>
          </div>

          {/* AI Portfolio Concentration Insights */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide flex items-center gap-1.5 border-b border-zinc-100 pb-3">
              <Sparkles className="h-4.5 w-4.5 text-indigo-600" /> AI Portfolio Insights
            </h3>

            <div className="space-y-4">
              {aiPortfolioInsights.map((insight, idx) => (
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

        </div>

      </div>

    </div>
  );
}
