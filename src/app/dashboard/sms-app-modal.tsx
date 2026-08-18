"use client";

import * as React from "react";
import {
  Smartphone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SmsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmsAppModal({ isOpen, onClose }: SmsAppModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white border border-zinc-200/90 w-full max-w-lg rounded-3xl shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header decoration */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 px-6 pt-7 pb-6 text-white overflow-hidden">
          {/* Subtle background circles */}
          <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-indigo-400/20 blur-lg pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-inner">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white/90">
                  Mobile Exclusive
                </span>
                <span className="flex items-center text-[10px] font-semibold text-emerald-300 gap-1">
                  <Sparkles className="h-3 w-3" /> Auto-Sync
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Download App for SMS Parsing
              </h3>
              <p className="text-xs text-indigo-100/90 leading-relaxed max-w-sm">
                Real-time automated transaction parsing from bank alerts & UPI messages is powered by the FinOne mobile app.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* App Store Download Badges */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google Play */}
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100/80 hover:border-zinc-300 transition-all cursor-pointer"
            >
              <div className="h-9 w-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-emerald-600 shadow-xs group-hover:scale-105 transition-transform">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.38 2.38 0 0 1-.223-.974V2.788c0-.36.08-.7.222-.974zm11.242 11.244l2.585 2.585-11.75 6.78 9.165-9.365zm2.585-2.586l-2.585 2.586-9.165-9.366 11.75 6.78zm1.05 1.05l2.457 1.418a1.237 1.237 0 0 1 0 2.146l-2.457 1.419-2.316-2.491 2.316-2.492z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[9px] uppercase font-bold text-zinc-400 leading-none">Get it on</p>
                <p className="text-xs font-black text-zinc-800">Google Play</p>
                <span className="text-[9px] font-semibold text-emerald-600">For Android</span>
              </div>
            </a>

            {/* Apple App Store */}
            <a
              href="https://apple.com/app-store"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100/80 hover:border-zinc-300 transition-all cursor-pointer"
            >
              <div className="h-9 w-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-xs group-hover:scale-105 transition-transform">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.09 1.73-.95 2.76 1.01.08 2.05-.51 2.68-1.26z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[9px] uppercase font-bold text-zinc-400 leading-none">Download on</p>
                <p className="text-xs font-black text-zinc-800">App Store</p>
                <span className="text-[9px] font-semibold text-blue-600">For iOS</span>
              </div>
            </a>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
              Quick Setup Steps
            </h4>

            <div className="space-y-2.5">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-black text-xs">
                  1
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-zinc-800">Download Mobile App</p>
                  <p className="text-zinc-500 leading-relaxed">
                    Search for <strong>FinOne</strong> on <strong>Google Play Store</strong> (Android) or <strong>App Store</strong> (iOS).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-black text-xs">
                  2
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-zinc-800">Install & Log In</p>
                  <p className="text-zinc-500 leading-relaxed">
                    Install the application and log in using your registered FinOne account.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-black text-xs">
                  3
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-zinc-800">Go to Money Flow Tab</p>
                  <p className="text-zinc-500 leading-relaxed">
                    Navigate to the <strong>Money Flow</strong> tab from the bottom navigation bar.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-black text-xs">
                  4
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-zinc-800">Grant SMS Permission & Auto-Parse</p>
                  <p className="text-zinc-500 leading-relaxed">
                    Allow SMS permissions when prompted. Your bank transaction alerts & UPI debits will be instantly parsed and reflected here!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed">
            <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>100% Privacy Preserved:</strong> The app only reads financial messages from verified bank sender IDs (e.g., HDFC, ICICI, SBI, AXIS, AMEX). Personal chats and non-financial messages are never accessed.
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
}
