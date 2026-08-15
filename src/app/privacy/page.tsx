import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Footer } from "@/components/footer";
import { ArrowLeft, ShieldCheck, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | FinDisce",
  description: "Privacy policy and data protection practices for FinDisce personal finance software.",
};

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Last updated: August 15, 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-zinc-700 dark:text-zinc-300">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">1. Overview & Commitment</h2>
            <p>
              At FinDisce (operated by Codisce), your privacy and data security are our highest priorities. This Privacy Policy outlines how we collect, process, store, and protect your personal and financial information when you interact with our web applications, mobile client, and backend APIs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong>Account Credentials:</strong> Email address, user name, and authentication tokens processed securely via Firebase Authentication.
              </li>
              <li>
                <strong>Financial Data (User-Provided & Automated):</strong> Transaction records, asset values, liability ledgers, goal targets, and category tags configured by you in the app.
              </li>
              <li>
                <strong>SMS & Mobile Parsing Data (Mobile App Only):</strong> In our mobile companion app, SMS parsing features process bank transaction notifications locally on your device with explicit permission to automatically catalog expense entries.
              </li>
              <li>
                <strong>Billing Information:</strong> Payment details (order ID, payment tokens, invoice receipts) processed securely through compliant payment gateways like Razorpay. We do not store full credit card numbers or banking passwords.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">3. How We Use Your Data</h2>
            <p>
              We utilize collected data strictly to operate and enhance the FinDisce platform:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>To provide net worth calculations, budget alerts, and financial reports.</li>
              <li>To process subscription upgrades and generate valid billing invoices.</li>
              <li>To deliver AI assistant recommendations tailored to your financial goals.</li>
              <li>To prevent fraudulent access and maintain system performance.</li>
            </ul>
            <p className="font-semibold text-zinc-900 dark:text-white mt-2">
              We NEVER sell, rent, or trade your personal or financial data to third-party advertisers or data brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">4. Data Storage & Security Standards</h2>
            <p>
              FinDisce enforces industry-standard technical measures:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>In Transit:</strong> All web and mobile communications are encrypted using HTTPS and TLS 1.3 / 256-bit SSL encryption.</li>
              <li><strong>At Rest:</strong> Databases are hosted securely with strict access control lists and AES-256 encrypted storage volumes.</li>
              <li><strong>Authentication:</strong> OAuth 2.0 and Firebase JWT token validation.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">5. Third-Party Service Processors</h2>
            <p>
              We integrate with trusted third-party providers strictly for core functionality:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Firebase (Google LLC):</strong> User authentication & identity management.</li>
              <li><strong>Razorpay Software Pvt. Ltd.:</strong> Payment processing & subscription management in compliance with PCI-DSS standards.</li>
              <li><strong>Oracle Cloud Infrastructure:</strong> Backend application server hosting.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">6. Your Data Rights & Deletion</h2>
            <p>
              You maintain complete control over your personal data. You may request data export or complete account and data deletion at any time by emailing our support team at <a href="mailto:codisce.dev@gmail.com" className="text-blue-600 underline">codisce.dev@gmail.com</a>. Account deletion requests are fulfilled within 14 business days.
            </p>
          </section>

          <section className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">7. Privacy Support Contact</h2>
            <p>
              If you have any questions, privacy concerns, or data requests, please contact our Data Protection Officer:
            </p>
            <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl font-mono text-xs space-y-1">
              <p><strong>Entity:</strong> FinDisce (Operated by Codisce)</p>
              <p><strong>Contact Email:</strong> <a href="mailto:codisce.dev@gmail.com" className="text-blue-600 underline">codisce.dev@gmail.com</a></p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
