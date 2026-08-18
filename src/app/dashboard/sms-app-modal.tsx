"use client";

import * as React from "react";
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Download,
  Info,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SmsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmsAppModal({ isOpen, onClose }: SmsAppModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Modal Card */}
      <div className="relative flex flex-col w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
        
        {/* Header Bar - Matching Import Modal style */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-zinc-900 dark:text-white leading-none">
                  Download App for SMS Parsing
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                  Mobile Exclusive
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Real-time automated transaction parsing from bank alerts & UPI messages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper / Subheader Progress Bar - Matching Import Modal */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-zinc-100/60 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold">Automated SMS Engine</span>
          </div>
          <span className="text-[11px] text-zinc-400 font-medium">Available on Android & iOS</span>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* App Store Download Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Google Play */}
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3.5 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 hover:border-blue-500 dark:hover:border-blue-500/60 transition-all cursor-pointer"
            >
              <div className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-emerald-600 shadow-xs group-hover:scale-105 transition-transform">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.38 2.38 0 0 1-.223-.974V2.788c0-.36.08-.7.222-.974zm11.242 11.244l2.585 2.585-11.75 6.78 9.165-9.365zm2.585-2.586l-2.585 2.586-9.165-9.366 11.75 6.78zm1.05 1.05l2.457 1.418a1.237 1.237 0 0 1 0 2.146l-2.457 1.419-2.316-2.491 2.316-2.492z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-zinc-400 leading-none">Get it on</p>
                <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">Google Play</p>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">For Android</span>
              </div>
            </a>

            {/* Apple App Store */}
            <a
              href="https://apple.com/app-store"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3.5 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 hover:border-blue-500 dark:hover:border-blue-500/60 transition-all cursor-pointer"
            >
              <div className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white shadow-xs group-hover:scale-105 transition-transform">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.09 1.73-.95 2.76 1.01.08 2.05-.51 2.68-1.26z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-zinc-400 leading-none">Download on</p>
                <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">App Store</p>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">For iOS</span>
              </div>
            </a>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Quick Setup Steps
            </h4>

            <div className="space-y-2">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs">
                  1
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">Go to Play Store or App Store</p>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Search for <strong>FinOne</strong> on <strong>Google Play Store</strong> (Android) or <strong>App Store</strong> (iOS).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                  2
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">Install & Log In</p>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Install the application and log in using your registered FinOne account.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs">
                  3
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">Go to Money Flow Tab</p>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Navigate to the <strong>Money Flow</strong> tab from the bottom navigation bar.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  4
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">Grant SMS Permission & Auto-Parse</p>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Allow SMS permissions when prompted. Your bank transaction alerts & UPI debits will be instantly parsed and reflected here!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
            <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px]">
              <strong>100% Privacy Preserved:</strong> The app only reads financial messages from verified bank sender IDs (e.g., HDFC, ICICI, SBI, AXIS, AMEX). Personal chats and non-financial messages are never accessed.
            </p>
          </div>
        </div>

        {/* Footer Bar - Matching Import Modal footer style */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Bank-grade AES-256 encryption
          </span>
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-6 rounded-xl shadow-sm text-xs transition-all active:scale-[0.99]"
          >
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
}
