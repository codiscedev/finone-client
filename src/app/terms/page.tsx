import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Footer } from "@/components/footer";
import { ArrowLeft, FileText, Mail } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | FinDisce",
  description: "Terms and conditions for using FinDisce personal finance software.",
};

export default function TermsPage() {
  return (
    <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
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
            <FileText className="h-3.5 w-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms & Conditions</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Last updated: August 15, 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-zinc-700 dark:text-zinc-300">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">1. Introduction</h2>
            <p>
              Welcome to FinDisce ("Software", "Platform", "Service"), operated by Codisce. By accessing or using our software, web applications, mobile applications, or associated services, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with any part of these Terms, you must immediately discontinue use of the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">2. Micro SaaS & Service Description</h2>
            <p>
              FinDisce is a personal finance software designed for personal money management, expense tracking, portfolio valuation, debt reduction planning, tax forecasting, and budget monitoring. The services provided are for informational and management purposes only and do not constitute certified financial, tax, or legal advice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">3. User Registration & Account Responsibilities</h2>
            <p>
              To access full features of FinDisce, you must register for an account using valid authentication credentials (e.g., Firebase Authentication). You are solely responsible for maintaining the confidentiality of your login credentials and for all activities occurring under your account. You agree to notify us immediately at <a href="mailto:codisce.dev@gmail.com" className="text-blue-600 underline">codisce.dev@gmail.com</a> if you suspect unauthorized access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">4. Subscriptions, Payments & Beta Pricing</h2>
            <p>
              FinDisce offers Free and Paid subscription tiers (e.g., Pro monthly or Lifetime access). Paid features are billed through authorized payment processors such as Razorpay. All transactions are charged in Indian Rupees (INR) or supported regional currencies.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Expense Tracking (Free):</strong> Core expense ledger logging is provided free of cost.</li>
              <li><strong>Beta Pricing Plans:</strong> Paid tiers (e.g., ₹59/month, ₹599/year, or ₹2,500 Lifetime) are offered as introductory Beta Pricing. We reserve the right to revise subscription fees with advance notice to existing users.</li>
              <li><strong>Automatic Renewal:</strong> Recurring monthly plans auto-renew until cancelled by the user in account settings prior to the next billing cycle.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">5. Acceptable Use & Intellectual Property</h2>
            <p>
              All software design, text, logos, custom graphics, and code are the exclusive property of Codisce and protected by copyright and intellectual property laws. You agree not to reverse engineer, decompile, resell, or exploit any portion of the service without explicit written permission.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Codisce shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the platform, data inaccuracies, or financial decisions made based on software outputs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">7. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of courts located in India.
            </p>
          </section>

          <section className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">8. Contact Information</h2>
            <p>
              For support, inquiries, or legal concerns regarding these Terms, please contact us at:
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
