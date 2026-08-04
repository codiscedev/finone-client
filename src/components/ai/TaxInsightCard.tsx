"use client";

import { useEffect, useState } from "react";
import { Receipt, Search, Sparkles, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api";

interface TaxSummary {
  financialYear: string;
  bySection: Record<string, number>;
  totalEstimatedBenefit: number;
  insightCount: number;
}

export default function TaxInsightCard() {
  const [summary, setSummary] = useState<TaxSummary | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await apiClient.get("/v1/ai/tax/summary");
      if (res.data?.success && res.data?.data) {
        setSummary(res.data.data);
      }
    } catch (err) {
      console.warn("Failed to fetch tax summary:", err);
    }
  };

  const triggerScan = async () => {
    setScanning(true);
    setScanMessage(null);
    try {
      const res = await apiClient.post("/v1/ai/tax/scan");
      if (res.data?.success && res.data?.data) {
        setScanMessage(res.data.data.message);
      }
      await fetchSummary();
    } catch (err) {
      console.error("Tax scan failed:", err);
    } finally {
      setScanning(false);
    }
  };

  const sectionInfo: Record<string, string> = {
    "80C": "LIC / PPF / ELSS / Tuition / Home Loan Principal",
    "80D": "Health Insurance Premium",
    "80G": "Charitable Donations",
    "80E": "Education Loan Interest",
    "HRA": "House Rent Allowance",
    "24B": "Home Loan Interest",
    "OTHER": "Other Deductions",
  };

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-0" />

      <div className="relative z-10 space-y-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                Tax Deduction Spotter
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  AI Powered
                </span>
              </h3>
              <p className="text-xs text-blue-200/70 mt-0.5">
                FY {summary?.financialYear ?? "2024-25"} • {summary?.insightCount ?? 0} opportunities flagged
              </p>
            </div>
          </div>

          <button
            id="tax-scan-btn"
            onClick={triggerScan}
            disabled={scanning}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 font-bold text-xs text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            {scanning ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" /> Scanning...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" /> Scan Now
              </>
            )}
          </button>
        </div>

        {scanMessage && (
          <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400/30 text-xs text-blue-200 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
            {scanMessage}
          </div>
        )}

        {summary && summary.totalEstimatedBenefit > 0 ? (
          <>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/20 text-center">
              <span className="text-[10px] text-blue-200/70 uppercase tracking-wider font-bold block">
                Estimated Total Tax Savings
              </span>
              <span className="text-3xl font-extrabold text-blue-400 block mt-1">
                ₹{summary.totalEstimatedBenefit.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>

            <div className="space-y-2">
              {Object.entries(summary.bySection).map(([section, amount]) => (
                <div
                  key={section}
                  className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">
                      Section {section}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {sectionInfo[section] ?? "Tax deduction"}
                    </span>
                  </div>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    ₹{amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center p-6 border border-dashed border-blue-400/20 rounded-xl text-xs text-blue-200/60">
            Click "Scan Now" to analyze your transactions for Indian Income Tax Act deductions.
          </div>
        )}
      </div>
    </div>
  );
}
