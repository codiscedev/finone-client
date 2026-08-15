import Link from "next/link";
import { Mail, Shield, ExternalLink, Heart } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export function Footer() {
  return (
    <footer className="w-full bg-zinc-900 text-zinc-300 border-t border-zinc-800 pt-12 pb-8 px-6 sm:px-8 mt-auto shrink-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Brand & Description */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <BrandLogo className="text-xl text-white" />
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Your all-in-one personal finance tool for asset tracking, debt management, goal planning, tax optimization, and AI insights.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
            <Shield className="h-3.5 w-3.5" />
            <span>Bank-grade 256-bit Encryption</span>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase text-zinc-200 tracking-wider">Product</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/#features" className="hover:text-white transition-colors">Features & Benefits</Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors flex items-center gap-1">
                Pricing <span className="bg-blue-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">Beta</span>
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-white transition-colors">FAQs</Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">Dashboard Login</Link>
            </li>
          </ul>
        </div>

        {/* Razorpay KYC Legal Policies */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase text-zinc-200 tracking-wider">Legal & Compliance</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-white transition-colors">Refund & Cancellation Policy</Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping & Delivery Policy</Link>
            </li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase text-zinc-200 tracking-wider">Support & Help</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Have questions or need assistance with your subscription? Reach out to our dedicated support team.
          </p>
          <div className="pt-1">
            <a
              href="mailto:codisce.dev@gmail.com"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3.5 py-2 rounded-xl transition-all"
            >
              <Mail className="h-4 w-4" />
              <span>codisce.dev@gmail.com</span>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Sub-bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>&copy; {new Date().getFullYear()} FinDisce. Powered by Codisce. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-zinc-300">Terms</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-zinc-300">Privacy</Link>
          <span>•</span>
          <Link href="/refund-policy" className="hover:text-zinc-300">Refunds</Link>
          <span>•</span>
          <Link href="/shipping-policy" className="hover:text-zinc-300">Shipping</Link>
        </div>
      </div>
    </footer>
  );
}
