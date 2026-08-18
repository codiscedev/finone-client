"use client";

import * as React from "react";
import Link from "next/link";
import { Check, X, Star, CreditCard, ChevronDown, ChevronUp, Sparkles, HelpCircle, Loader2, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";

export default function PricingView() {
  const { dbUser, refreshUserStatus } = useAuth();

  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "lifetime">("monthly");
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (planName: "PRO") => {
    setLoadingPlan(planName);
    setErrorMsg(null);
    setSuccessMsg(null);

    const isINR = dbUser?.currency === "INR";

    if (isINR) {
      try {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Failed to load Razorpay SDK");
        }

        const res = await apiClient.post("/v1/billing/razorpay/order", {
          planName,
          billingCycle
        });

        if (res.data?.success && res.data?.data) {
          const order = res.data.data;

          if (order.isMock) {
            await apiClient.post("/v1/billing/razorpay/verify", {
              razorpayOrderId: order.orderId,
              razorpayPaymentId: "pay_mock_" + Math.random().toString(36).substring(7),
              razorpaySignature: "mock_signature",
              planName,
              billingCycle
            });
            await refreshUserStatus();
            setSuccessMsg(`Simulated Sandbox Upgrade: Welcome to FinDisce ${planName} (${billingCycle})!`);
            setLoadingPlan(null);
            return;
          }

          const options = {
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            name: "FinDisce",
            description: `${planName} Subscription (${billingCycle})`,
            order_id: order.orderId,
            handler: async function (response: any) {
              try {
                setLoadingPlan(planName);
                await apiClient.post("/v1/billing/razorpay/verify", {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  planName,
                  billingCycle
                });
                await refreshUserStatus();
                setSuccessMsg(`Payment successful! Welcome to FinDisce ${planName}.`);
              } catch (err: any) {
                setErrorMsg(err.response?.data?.message || "Verification failed");
              } finally {
                setLoadingPlan(null);
              }
            },
            modal: {
              ondismiss: () => {
                setLoadingPlan(null);
              }
            },
            prefill: {
              name: dbUser?.name || "",
              email: dbUser?.email || ""
            },
            theme: {
              color: "#2563EB"
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        }
      } catch (err: any) {
        console.error("Razorpay error", err);
        setErrorMsg(err.message || "Razorpay integration failed");
        setLoadingPlan(null);
      }
    } else {
      try {
        const res = await apiClient.post("/v1/billing/dodo/session", {
          planName,
          billingCycle
        });

        if (res.data?.success && res.data?.data) {
          const session = res.data.data;

          if (session.isMock) {
            await apiClient.post("/v1/billing/dodo/callback", {
              planName,
              billingCycle
            });
            await refreshUserStatus();
            setSuccessMsg(`Simulated Dodo Upgrade: Welcome to FinDisce ${planName}!`);
          } else {
            window.location.href = session.checkoutUrl;
          }
        }
      } catch (err: any) {
        console.error("Dodo payments error", err);
        setErrorMsg(err.message || "Dodo Payments integration failed");
      } finally {
        setLoadingPlan(null);
      }
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "What features are included in the Free tier?",
      a: "The Free tier includes full expense tracking functionality so you can log, categorize, and track spending."
    },
    {
      q: "What is included in the Pro tier (Beta Pricing)?",
      a: "The Pro tier unlocks all advanced features: Income tracking, Net Worth & Asset ledgers, Debt repayment planner, Tax Planning & forecasting, AI Financial Assistant, and automated SMS transaction parsing."
    },
    {
      q: "How does the Lifetime Pass work?",
      a: "The Lifetime pass is a single one-time payment of ₹2,500 that grants permanent, full access to all current and future Pro features with no recurring monthly fees."
    },
    {
      q: "What is your refund policy?",
      a: "We offer a 7-day money-back guarantee. If you are not satisfied, email codisce.dev@gmail.com within 7 days for a full refund processed in 5-7 business days."
    }
  ];

  const featuresList = [
    { name: "Expense Tracking", free: "Included", pro: "Included" },
    { name: "Income Tracking", free: "—", pro: "Included" },
    { name: "Assets & Net Worth Ledger", free: "—", pro: "Included" },
    { name: "Debts & EMI Closure Planner", free: "—", pro: "Included" },
    { name: "Goals & Target Milestones", free: "—", pro: "Included" },
    { name: "Investments Portfolio CAGR", free: "—", pro: "Included" },
    { name: "Tax Planner & Projections", free: "—", pro: "Included" },
    { name: "AI Assistant & Financial Advisor", free: "—", pro: "Included" },
    { name: "SMS & Mobile Transaction Parsing", free: "—", pro: "Included" },
    { name: "Collaboration & Joint Accounts", free: "—", pro: "Included" },
    { name: "Priority Support (codisce.dev@gmail.com)", free: "Basic", pro: "Priority" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4">

      {/* Title Header */}
      <div className="text-center space-y-3 pt-2">
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block bg-blue-50/70 px-3 py-1 rounded-full w-fit mx-auto border border-blue-100/50">
          MICRO SAAS BETA PRICING
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950">
          Simple, Transparent Plans
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed">
          Expense tracking is free for everyone. Upgrade to Pro for complete financial planning, AI insights, and automated transaction parsing.
        </p>

        {/* Billing cycle Switch Toggle */}
        <div className="flex justify-center pt-2">
          <div className="bg-zinc-100 p-1 rounded-xl flex items-center border border-zinc-200/50">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all outline-none cursor-pointer ${billingCycle === "monthly"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
                }`}
            >
              Monthly (₹99/mo)
            </button>
            <button
              onClick={() => setBillingCycle("lifetime")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all outline-none cursor-pointer flex items-center gap-1.5 ${billingCycle === "lifetime"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
                }`}
            >
              Lifetime Pass <span className="bg-emerald-500 text-[9px] font-black text-white px-1.5 py-0.5 rounded uppercase">₹2,500</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="max-w-3xl mx-auto rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/50 p-4 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
          <Check className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="max-w-3xl mx-auto rounded-2xl bg-red-50 text-red-800 border border-red-200/50 p-4 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
          <X className="h-5 w-5 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      {(() => {
        const isProActive = dbUser?.subscriptionTier === "PRO" && dbUser?.subscriptionStatus === "ACTIVE";

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-2 max-w-3xl mx-auto">

            {/* FREE PLAN */}
            <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wide block">Starter</span>
                  <h3 className="text-xl font-black text-zinc-900 mt-1">FREE</h3>
                </div>

                <div className="py-2">
                  <span className="text-3xl font-extrabold text-zinc-950">₹0</span>
                  <span className="text-zinc-500 text-xs font-semibold"> / month</span>
                </div>

                <p className="text-[11px] text-zinc-500 leading-normal">
                  Expense tracking provided free of cost to log daily transactions and monitor category spending.
                </p>

                <div className="border-t border-zinc-100 pt-4 space-y-2.5">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Features Included</span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                      <span className="h-4 w-4 bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center rounded-full text-[9px] shrink-0 font-bold">✓</span>
                      <span>Expense Tracking & Cash Flow</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                      <span>— Other features require Pro tier</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  disabled
                  className="w-full h-10 bg-zinc-100 text-zinc-400 rounded-xl text-xs font-bold cursor-not-allowed outline-none shadow-sm"
                >
                  {dbUser?.subscriptionTier && dbUser?.subscriptionTier !== "FREE" ? "Standard Starter Plan" : "Current Plan"}
                </Button>
              </div>
            </div>

            {/* PRO PLAN - BETA PRICING */}
            <div className="bg-white border-2 border-blue-600 rounded-3xl p-6 shadow-[0_4px_20px_rgba(59,130,246,0.12)] flex flex-col justify-between hover:shadow-lg transition-shadow relative">
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Star className="h-3 w-3 fill-current text-white" /> Beta Pricing
              </span>

              <div className="space-y-4">
                <div className="mt-2">
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wide block">Full Suite Access</span>
                  <h3 className="text-xl font-black text-zinc-900 mt-1">PRO ACCESS</h3>
                </div>

                <div className="py-2">
                  <span className="text-3xl font-extrabold text-zinc-950">
                    {billingCycle === "monthly" ? "₹99" : "₹2,500"}
                  </span>
                  <span className="text-zinc-500 text-xs font-semibold">
                    {billingCycle === "monthly" ? " / month" : " / one-time lifetime"}
                  </span>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">
                    {billingCycle === "monthly" ? "Beta Rate (₹99/mo)" : "Lifetime Pass (₹2,500)"}
                  </p>
                </div>

                <p className="text-[11px] text-zinc-500 leading-normal">
                  Unlock income tracking, net worth ledgers, tax planner, AI advisor, and automated SMS parsing.
                </p>

                <div className="border-t border-zinc-100 pt-4 space-y-2.5">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Everything in Pro:</span>
                  <div className="space-y-2">
                    {[
                      "Income & Debt Management",
                      "Asset Portfolio & Net Worth",
                      "Tax Planner & Projections",
                      "AI Financial Advisor",
                      "SMS & Bank Transaction Parser",
                      "Priority Support (codisce.dev@gmail.com)"
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                        <span className="h-4 w-4 bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center rounded-full text-[9px] shrink-0 font-bold">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  onClick={() => handleUpgrade("PRO")}
                  disabled={loadingPlan !== null || isProActive}
                  className={`w-full h-10 rounded-xl text-xs font-bold cursor-pointer outline-none shadow-md active:scale-[0.98] ${isProActive
                      ? "bg-blue-500/10 border border-blue-500/30 text-blue-600 cursor-default"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {loadingPlan === "PRO" ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto text-white" />
                  ) : isProActive ? (
                    "Active Pro Subscription"
                  ) : (
                    `Upgrade to Pro (${billingCycle === "monthly" ? "₹99/mo" : "₹2,500 Lifetime"})`
                  )}
                </Button>
              </div>
            </div>

          </div>
        );
      })()}

      {/* Feature Comparison Matrix */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm p-5 space-y-4">
        <h3 className="text-xs font-black uppercase text-zinc-900 tracking-wide block border-b border-zinc-100 pb-3">
          Feature Comparison Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50/50">
                <th className="p-3 pl-4">Feature</th>
                <th className="p-3 text-center">Free Plan</th>
                <th className="p-3 text-center">Pro Plan (Beta)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              {featuresList.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="p-3 pl-4 font-bold text-zinc-900">{row.name}</td>
                  <td className="p-3 text-center text-zinc-500">{row.free}</td>
                  <td className="p-3 text-center text-blue-600 font-bold">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4 pt-4">
        <div className="text-center space-y-1">
          <h3 className="text-base font-black text-zinc-950 uppercase tracking-wide">Frequently Asked Questions</h3>
        </div>

        <div className="max-w-3xl mx-auto space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-3.5 text-left flex justify-between items-center outline-none cursor-pointer hover:bg-zinc-50/40"
                >
                  <span className="text-xs font-bold text-zinc-900">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-zinc-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-50 pt-2.5 bg-zinc-50/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dashboard Footer Compliance Links */}
      <div className="border-t border-zinc-200/80 pt-6 text-center text-xs text-zinc-500 space-y-2">
        <div className="flex flex-wrap justify-center gap-4 font-semibold text-zinc-600">
          <Link href="/terms" className="hover:text-zinc-900">Terms & Conditions</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-zinc-900">Privacy Policy</Link>
          <span>•</span>
          <Link href="/refund-policy" className="hover:text-zinc-900">Refund & Cancellation Policy</Link>
          <span>•</span>
          <Link href="/shipping-policy" className="hover:text-zinc-900">Shipping Policy</Link>
        </div>
        <p className="text-[11px] text-zinc-400">
          For support or billing inquiries, contact us at: <a href="mailto:codisce.dev@gmail.com" className="text-blue-600 underline">codisce.dev@gmail.com</a>
        </p>
      </div>

    </div>
  );
}
