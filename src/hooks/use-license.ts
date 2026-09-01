"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth-context";

export interface LicenseStatus {
  isPro: boolean;
  tier: "FREE" | "PRO";
  status: string;
  isLifetime: boolean;
  subscriptionExpiry?: string;
  isLoading: boolean;
}

export function useLicense(): LicenseStatus {
  const { dbUser, loading } = useAuth();

  const isPro = React.useMemo(() => {
    if (process.env.NEXT_PUBLIC_BYPASS_LICENSE === "true") {
      return true;
    }
    if (!dbUser) return false;
    const tier = dbUser.subscriptionTier?.toUpperCase();
    const status = dbUser.subscriptionStatus?.toUpperCase();
    
    // Pro is active if tier is PRO and status is ACTIVE, or if user has lifetime access
    if (tier === "PRO") {
      return status === "ACTIVE" || status === "LIFETIME" || !status;
    }
    return false;
  }, [dbUser]);

  return {
    isPro,
    tier: isPro ? "PRO" : "FREE",
    status: dbUser?.subscriptionStatus || "INACTIVE",
    isLifetime: dbUser?.subscriptionStatus === "LIFETIME",
    subscriptionExpiry: dbUser?.subscriptionExpiry,
    isLoading: loading,
  };
}
