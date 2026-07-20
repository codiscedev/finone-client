"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { loading: authLoading, authError, clearAuthError } = useAuth();
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    if (authError) {
      setError(authError);
      clearAuthError();
      setLoading(false);
    }
  }, [authError, clearAuthError]);
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [view, setView] = React.useState<"login" | "forgot-password">("login");
  const [resetEmailSent, setResetEmailSent] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple client-side validation
    if (!email) {
      setError("Email address is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // AuthProvider will automatically capture state change, sync with backend, and redirect to /dashboard
    } catch (err: any) {
      console.error("Firebase Login Error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/invalid-api-key" || err.message?.includes("api-key")) {
        setError("Missing valid Firebase API Key in .env.local. Please configure NEXT_PUBLIC_FIREBASE_API_KEY.");
      } else {
        setError(err.message || "Failed to sign in. Please check your credentials.");
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // AuthProvider will automatically capture state change, sync with backend, and redirect to /dashboard
    } catch (err: any) {
      console.error("Google SignIn Error:", err);
      setError(err.message || "Google sign-in failed.");
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetEmailSent(false);

    if (!email) {
      setError("Email address is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (err: any) {
      console.error("Firebase Password Reset Error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-email") {
        setError("No account found with this email address.");
      } else {
        setError(err.message || "Failed to send password reset email.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, appleProvider);
      // AuthProvider will automatically capture state change, sync with backend, and redirect to /dashboard
    } catch (err: any) {
      console.error("Apple SignIn Error:", err);
      setError(err.message || "Apple sign-in failed.");
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
      {/* Decorative Side Panel */}
      <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between bg-zinc-950 p-12 text-white overflow-hidden border-r border-zinc-800">
        {/* Abstract Glowing Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e1b4b,transparent_60%)] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#09090b,transparent_70%)]" />
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-400 to-indigo-500 p-0.5 shadow-lg shadow-emerald-500/10">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            FinOne
          </span>
        </div>

        {/* Premium Dashboard Visualization */}
        <div className="relative z-10 my-auto max-w-md self-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next Generation Wealth Management</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
              Manage your wealth with{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                absolute precision.
              </span>
            </h1>
            <p className="text-lg text-zinc-400 font-normal leading-relaxed">
              Track investments, analyze cash flow, and achieve your financial milestones with our intelligent, secure dashboard client.
            </p>
          </div>

          {/* Interactive credit card preview */}
          <div className="mt-12 relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-500 opacity-20 blur-md transition duration-1000 group-hover:opacity-30 group-hover:duration-200" />
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Current Portfolio Value</p>
                  <p className="text-2xl font-bold tracking-tight mt-1 text-white">$142,384.50</p>
                </div>
                <div className="h-9 w-12 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">User Account</p>
                  <p className="text-sm font-medium text-zinc-300 mt-1">Premium Member</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Monthly Yield</p>
                  <p className="text-sm font-semibold text-emerald-400 mt-1">+12.4%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} FinOne Technologies. All rights reserved.
        </div>
      </div>

      {/* Main Form Panel */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-background">
        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Header Mobile Brand */}
          <div className="flex flex-col items-center lg:items-start space-y-2">
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-400 to-indigo-500 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                FinOne
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground text-center lg:text-left">
              {view === "login" ? "Welcome back" : "Reset your password"}
            </h2>
            <p className="text-sm text-muted-foreground text-center lg:text-left">
              {view === "login"
                ? "Enter your credentials to access your secure portfolio client."
                : "Enter your email address and we'll send you a recovery link."}
            </p>
          </div>

          {view === "login" && (
            <>
              {/* Social Sign-In buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-sm font-semibold text-foreground transition-all hover:bg-muted active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={handleAppleSignIn}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-sm font-semibold text-foreground transition-all hover:bg-muted active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z" />
                  </svg>
                  Apple
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground font-medium">
                    Or continue with email
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Form */}
          {view === "login" ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    className="pl-10 h-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setView("forgot-password");
                    }}
                    className="text-xs font-semibold text-primary hover:underline outline-none bg-transparent border-none cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 h-5 w-5 text-muted-foreground hover:text-foreground outline-none animate-fade-in"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all shadow-md shadow-emerald-500/10 active:scale-[0.99] flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form className="space-y-6 animate-fade-in" onSubmit={handleForgotPasswordSubmit}>
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium">
                  {error}
                </div>
              )}

              {resetEmailSent ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400 font-medium">
                    Recovery link sent! Please check your email inbox.
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setView("login");
                      setResetEmailSent(false);
                      setError(null);
                    }}
                    className="w-full h-10 font-semibold border border-border bg-background hover:bg-muted text-foreground rounded-lg transition-all active:scale-[0.99]"
                  >
                    Back to sign in
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email address</Label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="reset-email"
                        name="reset-email"
                        type="email"
                        required
                        placeholder="name@example.com"
                        className="pl-10 h-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all shadow-md shadow-emerald-500/10 active:scale-[0.99] flex items-center justify-center gap-1.5"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        Send recovery link
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setView("login");
                      setError(null);
                    }}
                    className="w-full text-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-1 outline-none cursor-pointer"
                  >
                    Back to sign in
                  </button>
                </>
              )}
            </form>
          )}

          {view === "login" && (
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:underline hover:text-primary/95"
              >
                Create a free account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
