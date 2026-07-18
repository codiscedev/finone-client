"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  FileText,
  Sparkles,
  Coins,
  Plus,
  Layers,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssetsOverviewViewProps {
  onBack: () => void;
  onAssetClick: (assetId: string) => void;
  onAddClick: () => void;
  assets?: any[];
  loading?: boolean;
}

export default function AssetsOverviewView({ 
  onBack, 
  onAssetClick, 
  onAddClick,
  assets = [],
  loading = false
}: AssetsOverviewViewProps) {

  // Formatting utilities
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Dynamically group assets by category
  const categoryGroups = React.useMemo(() => {
    if (!assets || assets.length === 0) return [];
    
    // Group definitions matching drawer types
    const groups: Record<string, {
      name: string;
      code: string;
      icon: React.ReactNode;
      total: number;
      share: number;
      color: string;
      assets: any[];
    }> = {
      PROPERTY: { name: "Property", code: "PROPERTY", icon: <Building2 className="h-4.5 w-4.5 text-blue-600" />, total: 0, share: 0, color: "bg-blue-600", assets: [] },
      STOCK: { name: "Securities & Equities", code: "STOCK", icon: <FileText className="h-4.5 w-4.5 text-emerald-600" />, total: 0, share: 0, color: "bg-emerald-500", assets: [] },
      GOLD: { name: "Gold & Commodities", code: "GOLD", icon: <Coins className="h-4.5 w-4.5 text-amber-500" />, total: 0, share: 0, color: "bg-amber-500", assets: [] },
      SILVER: { name: "Silver & Commodities", code: "SILVER", icon: <Coins className="h-4.5 w-4.5 text-zinc-400" />, total: 0, share: 0, color: "bg-zinc-400", assets: [] },
      VEHICLE: { name: "Vehicles", code: "VEHICLE", icon: <Layers className="h-4.5 w-4.5 text-zinc-500" />, total: 0, share: 0, color: "bg-indigo-500", assets: [] },
      SAVINGS_BANK_ACCOUNT: { name: "Savings Bank Account", code: "SAVINGS_BANK_ACCOUNT", icon: <Layers className="h-4.5 w-4.5 text-teal-600" />, total: 0, share: 0, color: "bg-teal-500", assets: [] },
      LIQUID_CASH: { name: "Liquid Cash", code: "LIQUID_CASH", icon: <Layers className="h-4.5 w-4.5 text-cyan-600" />, total: 0, share: 0, color: "bg-cyan-500", assets: [] },
      OTHERS: { name: "Others", code: "OTHERS", icon: <Layers className="h-4.5 w-4.5 text-zinc-500" />, total: 0, share: 0, color: "bg-zinc-300", assets: [] }
    };
    
    let totalPortfolioVal = 0;
    
    assets.forEach((a) => {
      const catCode = a.type || "OTHERS";
      const groupKey = groups[catCode] ? catCode : "OTHERS";
      const currentVal = Number(a.current_market_value) || Number(a.purchase_value) || 0;
      const purchaseVal = Number(a.purchase_value) || 0;
      
      const gain = purchaseVal > 0 
        ? `${currentVal >= purchaseVal ? "+" : ""}${Math.round(((currentVal - purchaseVal) / purchaseVal) * 100)}%` 
        : "0%";
      
      groups[groupKey].assets.push({
        id: a.id,
        name: a.name,
        val: currentVal,
        purchase: purchaseVal,
        date: a.purchase_date || "N/A",
        gain
      });
      groups[groupKey].total += currentVal;
      totalPortfolioVal += currentVal;
    });
    
    // Filter out groups with no assets, and calculate shares
    return Object.values(groups)
      .filter(g => g.assets.length > 0)
      .map(g => ({
        ...g,
        share: totalPortfolioVal > 0 ? Math.round((g.total / totalPortfolioVal) * 100) : 0
      }));
  }, [assets]);

  // Overall statistics calculated dynamically
  const totalValuation = React.useMemo(() => {
    return assets.reduce((sum, a) => sum + (Number(a.current_market_value) || Number(a.purchase_value) || 0), 0);
  }, [assets]);

  const totalPurchasePrice = React.useMemo(() => {
    return assets.reduce((sum, a) => sum + (Number(a.purchase_value) || 0), 0);
  }, [assets]);

  const absoluteGain = totalValuation - totalPurchasePrice;
  const gainPercent = totalPurchasePrice > 0 ? Math.round((absoluteGain / totalPurchasePrice) * 100) : 0;

  // Recently bought assets (sorted by purchaseDate descending)
  const recentlyBought = React.useMemo(() => {
    return [...assets]
      .filter(a => a.purchase_date)
      .sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime())
      .slice(0, 5)
      .map(a => ({
        id: a.id,
        name: a.name,
        category: a.category_name || a.type || "Other",
        date: a.purchase_date,
        purchase: Number(a.purchase_value) || 0,
        current: Number(a.current_market_value) || Number(a.purchase_value) || 0
      }));
  }, [assets]);

  // SVG Donut calculation
  const donutSegments = React.useMemo(() => {
    let cumulativePercent = 0;
    return categoryGroups.map((g, idx) => {
      const percent = g.share;
      const strokeDashoffset = 339.3 - (339.3 * percent) / 100;
      const rotationOffset = (cumulativePercent / 100) * 360;
      cumulativePercent += percent;
      
      let colorClass = "stroke-zinc-300";
      if (g.code === "PROPERTY") colorClass = "stroke-blue-600";
      else if (g.code === "STOCK") colorClass = "stroke-emerald-500";
      else if (g.code === "GOLD") colorClass = "stroke-amber-500";
      else if (g.code === "SILVER") colorClass = "stroke-zinc-400";
      else if (g.code === "VEHICLE") colorClass = "stroke-indigo-500";
      else if (g.code === "SAVINGS_BANK_ACCOUNT") colorClass = "stroke-teal-500";
      else if (g.code === "LIQUID_CASH") colorClass = "stroke-cyan-500";
      
      return (
        <circle
          key={idx}
          cx="72"
          cy="72"
          r="54"
          className={colorClass}
          strokeWidth="18"
          fill="transparent"
          strokeDasharray="339.3"
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(${rotationOffset} 72 72)`}
        />
      );
    });
  }, [categoryGroups]);

  // Dynamic Portfolio AI insights
  const aiPortfolioInsights = React.useMemo(() => {
    const insights = [];
    if (assets.length === 0) {
      insights.push({
        text: "You haven't registered any assets yet. Link properties, stocks, cash, or gold reserves to receive AI portfolio balancing recommendations.",
        impact: "Initial setup required",
        priority: "Medium",
        action: "Add Asset"
      });
      return insights;
    }

    const propertyShare = categoryGroups.find(g => g.code === "PROPERTY")?.share || 0;
    if (propertyShare > 50) {
      insights.push({
        text: `Real estate properties represent ${propertyShare}% of your overall assets, indicating heavy asset concentration. Consider diversifying next savings into liquid equities.`,
        impact: "Diversification Risk Alert",
        priority: "High",
        action: "Rebalance Portfolio"
      });
    }

    const stockShare = categoryGroups.find(g => g.code === "STOCK")?.share || 0;
    if (stockShare > 0) {
      insights.push({
        text: "Securities holdings are eligible for LTCG harvest tax exemptions. Selling shares up to ₹1.25 Lakhs in gains this fiscal year saves on tax.",
        impact: "Tax Optimization Eligible",
        priority: "Low",
        action: "LTCG Harvesting"
      });
    }

    const goldShare = categoryGroups.find(g => g.code === "GOLD")?.share || 0;
    if (goldShare > 10) {
      insights.push({
        text: `Physical Gold reserves represent ${goldShare}% of your portfolio. Gold serves as a strong hedging buffer matching current inflation cycles.`,
        impact: "Hedging Buffer Intact",
        priority: "Medium",
        action: "Maintain Holding"
      });
    }

    if (insights.length === 0) {
      insights.push({
        text: "Your asset portfolio is well balanced across property, cash, commodities, and securities. Maintain automated recurring investments.",
        impact: "Optimal Balance",
        priority: "Low",
        action: "No Action Needed"
      });
    }

    return insights;
  }, [assets, categoryGroups]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center text-zinc-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-2" />
        <p className="text-xs font-bold">Loading assets overview...</p>
      </div>
    );
  }

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

      {assets.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center space-y-4 max-w-xl mx-auto animate-in fade-in duration-200">
          <Info className="h-10 w-10 text-blue-500 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900">No Asset Records Registered</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            You don't have any asset records saved yet. Creating dynamic asset classes like Real Estate, Physical Gold, Vehicles or Cash Accounts lets you track your net worth and receive tax and diversification insights.
          </p>
          <Button
            onClick={onAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 rounded-xl px-4 text-xs transition-all active:scale-[0.98]"
          >
            Add First Asset
          </Button>
        </div>
      ) : (
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
                <h3 className={`text-2xl font-black ${absoluteGain >= 0 ? "text-emerald-600" : "text-red-650"}`}>
                  {absoluteGain >= 0 ? "+" : ""}{formatCurrency(absoluteGain)}
                </h3>
                <p className={`text-[10px] font-bold ${absoluteGain >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {absoluteGain >= 0 ? "+" : ""}{gainPercent}% Return Basis
                </p>
              </div>
            </div>

            {/* Category-based Asset Accordions/Lists */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide">Assets Category Breakdown</h3>
              
              {categoryGroups.map((group) => (
                <div 
                  key={group.code} 
                  className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden animate-in fade-in duration-200"
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
                        onClick={() => onAssetClick(asset.id)}
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
            {recentlyBought.length > 0 && (
              <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-150/40">
                  <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide">Recently Bought Assets</h3>
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
                          onClick={() => onAssetClick(asset.id)}
                          className="hover:bg-zinc-50/50 cursor-pointer group font-medium"
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
            )}

          </div>

          {/* Right Column: Allocation Donut & AI insights */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Asset Allocation Chart */}
            <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block">
                Asset Allocation Graph
              </span>
              
              {/* Custom SVG Donut Chart */}
              <div className="flex justify-center items-center py-4 relative animate-in fade-in duration-300">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="54" className="stroke-zinc-100" strokeWidth="18" fill="transparent" />
                  {donutSegments}
                </svg>
                
                <div className="absolute flex flex-col items-center">
                  <span className="text-xs font-bold text-zinc-400 uppercase">Portfolio</span>
                  <span className="text-sm font-black text-zinc-900 mt-0.5">
                    {formatCurrency(totalValuation)}
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-zinc-500 border-t border-zinc-100 pt-3">
                {categoryGroups.map((g, idx) => {
                  let badgeColor = "bg-zinc-300";
                  if (g.code === "PROPERTY") badgeColor = "bg-blue-600";
                  else if (g.code === "STOCK") badgeColor = "bg-emerald-500";
                  else if (g.code === "GOLD") badgeColor = "bg-amber-500";
                  else if (g.code === "SILVER") badgeColor = "bg-zinc-400";
                  else if (g.code === "VEHICLE") badgeColor = "bg-indigo-500";
                  else if (g.code === "BANK_ACCOUNT") badgeColor = "bg-teal-500";
                  else if (g.code === "CASH") badgeColor = "bg-cyan-500";
                  
                  return (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded ${badgeColor} shrink-0`} />
                      <span>{g.name}: {g.share}%</span>
                    </div>
                  );
                })}
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
      )}

    </div>
  );
}
