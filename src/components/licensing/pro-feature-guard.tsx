"use client";

import * as React from "react";
import Link from "next/link";
import { Lock, Sparkles, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLicense } from "@/hooks/use-license";

interface ProFeatureGuardProps {
  moduleName: string;
  description?: string;
  features?: string[];
  onUpgradeClick?: () => void;
  pricingHref?: string;
  children: React.ReactNode;
}

export function ProFeatureGuard({
  moduleName,
  description = "This feature is part of FinOne Pro. Upgrade your plan to unlock full access.",
  features = [
    "AI Financial Assistant & Real-time Insights",
    "Automated Tax Planner & Deduction Spotter",
    "Asset & Investment Portfolio Management",
    "Bank Statement & SMS Parser Auto-Import",
    "Priority Support & Multi-User Collaboration"
  ],
  onUpgradeClick,
  pricingHref = "/pricing",
  children
}: ProFeatureGuardProps) {
  const { isPro, isLoading } = useLicense();

  if (isLoading) {
    return (
      <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/50 animate-pulse flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 rounded-full bg-slate-800 mb-4" />
        <div className="w-48 h-6 bg-slate-800 rounded mb-2" />
        <div className="w-64 h-4 bg-slate-800/60 rounded" />
      </div>
    );
  }

  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden min-h-[550px]">
      {/* Blurred background preview of the feature UI */}
      <div className="pointer-events-none select-none filter blur-[7px] opacity-35 brightness-75 transition-all">
        {children}
      </div>

      {/* Floating Glassmorphism Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 md:p-8 bg-slate-950/45 backdrop-blur-md">
        <div className="relative max-w-xl w-full rounded-2xl border border-amber-500/40 bg-slate-900/80 p-6 md:p-8 shadow-2xl backdrop-blur-xl text-center overflow-hidden">
          {/* Ambient Decorative Glows */}
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Lock Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-4">
              <Lock className="w-3.5 h-3.5" />
              <span>Pro Feature Locked</span>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
              Unlock {moduleName}
            </h3>
            <p className="text-slate-300 text-xs md:text-sm mb-6 max-w-md leading-relaxed">
              {description}
            </p>

            {/* Feature List */}
            <div className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 mb-6 text-left">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Included in FinOne Pro</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade Button */}
            {onUpgradeClick ? (
              <Button
                onClick={onUpgradeClick}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-8 py-5 rounded-xl shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4 mr-2 fill-slate-950" />
                Upgrade to Pro Plan to Unlock
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Link href={pricingHref} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-8 py-5 rounded-xl shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02]"
                >
                  <Zap className="w-4 h-4 mr-2 fill-slate-950" />
                  Upgrade to Pro Plan to Unlock
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}

            <p className="text-[11px] text-slate-400 mt-4 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>7-Day Money-Back Guarantee • Instant Pro Access</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProFeatureGuard;
