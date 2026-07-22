"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";
import { Mail, RefreshCw, LogOut, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dbUser, logout, refreshUserStatus } = useAuth();
  
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [isResending, setIsResending] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  // Parse error params redirecting from email confirm endpoint
  React.useEffect(() => {
    const errorParam = searchParams.get("error");
    const msgParam = searchParams.get("message");
    if (errorParam === "true" && msgParam) {
      setFeedback({ type: "error", message: decodeURIComponent(msgParam) });
    }
  }, [searchParams]);

  // Load remaining cooldown on mount if existing
  React.useEffect(() => {
    const savedCooldown = sessionStorage.getItem("finone_resend_cooldown");
    if (savedCooldown) {
      const remaining = Math.round((parseInt(savedCooldown) - Date.now()) / 1000);
      if (remaining > 0) {
        setResendCooldown(remaining);
      }
    }
  }, []);

  // Cooldown countdown timer
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          sessionStorage.removeItem("finone_resend_cooldown");
          clearInterval(timer);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setFeedback(null);

    try {
      const response = await apiClient.post("/v1/invite/resend");
      if (response.data?.success) {
        setFeedback({
          type: "success",
          message: "A fresh verification link has been sent to your email address."
        });
        const endOfCooldown = Date.now() + 120 * 1000; // 2 minutes
        setResendCooldown(120);
        sessionStorage.setItem("finone_resend_cooldown", endOfCooldown.toString());
      } else {
        throw new Error(response.data?.message || "Failed to resend confirmation email.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to resend confirmation email.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckStatus = async () => {
    if (isChecking) return;
    setIsChecking(true);
    setFeedback(null);

    try {
      await refreshUserStatus();
      // If verification succeeded, the context provider's useEffect route guard redirects automatically
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Email verification is still pending. Please verify via the email link."
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 px-4 sm:px-6 overflow-hidden">
      {/* Decorative Radial Gradients */}
      <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl relative z-10 backdrop-blur-md">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md mb-4 animate-pulse">
            <Mail className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Verify your email
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-sm">
            We've sent a verification link to <span className="font-semibold text-zinc-200">{dbUser?.email}</span>. Click the link inside the email to activate your account.
          </p>
        </div>

        {/* Feedback Alert Messages */}
        {feedback && (
          <div
            className={`mb-6 rounded-xl border p-4 text-xs flex items-start gap-2.5 leading-relaxed font-semibold transition-all ${
              feedback.type === "success"
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/5 border-red-500/20 text-red-400"
            }`}
          >
            {feedback.type === "success" ? (
              <ShieldCheck className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            )}
            <div>{feedback.message}</div>
          </div>
        )}

        {/* Action Controls */}
        <div className="space-y-3.5">
          <Button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full h-11 font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/10 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                I've Verified My Email
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <Button
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            variant="outline"
            className="w-full h-11 font-bold border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isResending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : resendCooldown > 0 ? (
              `Resend Email in ${resendCooldown}s`
            ) : (
              "Resend Verification Email"
            )}
          </Button>

          <div className="border-t border-zinc-800/80 my-4 pt-4">
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out / Use another account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
