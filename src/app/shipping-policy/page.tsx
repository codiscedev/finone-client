import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Footer } from "@/components/footer";
import { ArrowLeft, Truck, Mail } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | FinDisce",
  description: "Digital delivery policy for FinDisce SaaS software.",
};

export default function ShippingPolicyPage() {
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
            <Truck className="h-3.5 w-3.5" />
            <span>Digital Product Delivery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Shipping & Delivery Policy</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Last updated: August 15, 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-zinc-700 dark:text-zinc-300">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">1. SaaS Digital Delivery</h2>
            <p>
              FinDisce (operated by Codisce) is a 100% digital Cloud & Micro SaaS software product. <strong>No physical products, items, hardware, or documentation are shipped or delivered physically to your address.</strong>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">2. Immediate Electronic Provisioning</h2>
            <p>
              Upon successful completion of payment verification via Razorpay (or authorized payment gateways):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Your account subscription status is updated to <strong>ACTIVE</strong> immediately (in real time).</li>
              <li>All unlocked Pro tier features (investments, AI advisor, tax planner, SMS integrations) become accessible instantly on your dashboard.</li>
              <li>A digital order confirmation and receipt will be emailed to your registered email address within minutes of payment.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">3. Shipping Fees & Charges</h2>
            <p>
              Since all services and features are provisioned electronically online, <strong>no shipping charges, delivery fees, or handling fees</strong> apply to any of our plans or transactions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">4. Issues with Digital Access</h2>
            <p>
              In the rare event that your account tier is not automatically upgraded after payment, or if you do not receive your digital confirmation email within 1 hour of payment, please follow these steps:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-xs">
              <li>Log out and log back in to refresh your active session profile.</li>
              <li>Check your spam/junk folder for the confirmation email.</li>
              <li>Contact our technical support team at <a href="mailto:codisce.dev@gmail.com" className="text-blue-600 underline">codisce.dev@gmail.com</a> with your Razorpay payment ID for manual activation within 4 hours.</li>
            </ol>
          </section>

          <section className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">5. Support Contact</h2>
            <p>
              For any questions regarding electronic delivery or digital service access:
            </p>
            <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl font-mono text-xs space-y-1">
              <p><strong>Entity:</strong> FinDisce (Operated by Codisce)</p>
              <p><strong>Support Email:</strong> <a href="mailto:codisce.dev@gmail.com" className="text-blue-600 underline">codisce.dev@gmail.com</a></p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
