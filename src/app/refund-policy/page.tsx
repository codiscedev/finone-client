import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Footer } from "@/components/footer";
import { ArrowLeft, RefreshCw, Mail } from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy | FinDisce",
  description: "Refund and cancellation guidelines for FinDisce subscriptions.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <BrandLogo className="text-lg" />
          <Link href="/login" className="text-xs font-bold text-blue-600 hover:underline">
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Legal Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Customer Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Refund & Cancellation Policy</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Last updated: August 15, 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-zinc-700 dark:text-zinc-300">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">1. Subscription Cancellation</h2>
            <p>
              You can cancel your FinDisce paid subscription (e.g. Pro monthly tier) at any time. To cancel your active subscription:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Log in to your account and navigate to <strong>Dashboard &gt; Settings &gt; Billing</strong>.</li>
              <li>Click on <strong>Cancel Subscription</strong>, or contact our support team at <a href="mailto:codisce.dev@gmail.com" className="text-blue-600 underline">codisce.dev@gmail.com</a>.</li>
            </ul>
            <p className="text-xs">
              Upon cancellation, your subscription will remain active until the end of your current paid billing period, after which your account will revert to the Free tier without further charge.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">2. 7-Day Money-Back Guarantee</h2>
            <p>
              We want you to be completely satisfied with FinDisce. We offer a <strong>7-day money-back guarantee</strong> for new Pro monthly and Lifetime access purchases.
            </p>
            <p className="text-xs">
              If you are dissatisfied with our software for any reason within 7 calendar days of your initial payment, you are eligible for a full refund of the amount paid.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">3. How to Request a Refund</h2>
            <p>
              To initiate a refund request under our 7-day guarantee, please send an email to <a href="mailto:codisce.dev@gmail.com" className="text-blue-600 underline">codisce.dev@gmail.com</a> with the following details:
            </p>
            <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl font-mono text-xs space-y-1">
              <p>• Subject: Refund Request - [Your Registered Email]</p>
              <p>• Registered Email Address</p>
              <p>• Order ID or Payment ID (from Razorpay invoice receipt)</p>
              <p>• Reason for refund request (optional, helps us improve)</p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">4. Processing Time & Refund Method</h2>
            <p>
              Once your refund request is received and verified by our billing team:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Refund requests are reviewed and approved within <strong>24 to 48 hours</strong>.</li>
              <li>Approved refunds are processed via our payment gateway (Razorpay) back to the <strong>original payment method</strong> (UPI, Credit/Debit Card, Net Banking).</li>
              <li>The refunded amount will reflect in your account within <strong>5 to 7 business days</strong>, depending on your card issuer or bank processing times.</li>
            </ul>
          </section>

          <section className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">5. Support Contact</h2>
            <p>
              If you have any questions or require immediate help with refunds or billing:
            </p>
            <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl font-mono text-xs space-y-1">
              <p><strong>Entity:</strong> FinDisce (Operated by Codisce)</p>
              <p><strong>Billing Support:</strong> <a href="mailto:codisce.dev@gmail.com" className="text-blue-600 underline">codisce.dev@gmail.com</a></p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
