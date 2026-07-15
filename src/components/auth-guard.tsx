"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard — wraps any page that requires authentication.
 *
 * Behaviour:
 *  - While Firebase resolves the initial auth state: shows a full-screen loader.
 *  - If no user is authenticated: redirects to /login.
 *  - If user is authenticated: renders children normally.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    // Only act once Firebase has resolved (loading === false)
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // ── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          {/* Animated brand logo */}
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-400 to-indigo-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            </div>
            {/* Spinning ring */}
            <span className="absolute inset-0 rounded-2xl border-2 border-emerald-400/30 animate-ping" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-zinc-800">FinOne</p>
            <p className="text-xs text-zinc-400 mt-0.5">Verifying your session…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Not authenticated — render nothing while redirect happens ──
  if (!user) {
    return null;
  }

  // ── Authenticated — render the protected page ──────────────────
  return <>{children}</>;
}
