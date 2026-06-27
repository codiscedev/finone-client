"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Sparkles, TrendingUp, ShieldCheck, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Real-time password strength criteria
  const passwordCriteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { label: "At least one number", met: /[0-9]/.test(password) },
    { label: "At least one special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const strengthCount = passwordCriteria.filter(c => c.met).length;

  const getStrengthLabelAndColor = () => {
    switch (strengthCount) {
      case 0:
        return { label: "Very Weak", color: "bg-zinc-700", text: "text-zinc-500" };
      case 1:
        return { label: "Weak", color: "bg-red-500", text: "text-red-500" };
      case 2:
        return { label: "Fair", color: "bg-orange-500", text: "text-orange-500" };
      case 3:
        return { label: "Good", color: "bg-yellow-500", text: "text-yellow-500" };
      case 4:
        return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-500" };
      default:
        return { label: "Very Weak", color: "bg-zinc-750", text: "text-zinc-500" };
    }
  };

  const strength = getStrengthLabelAndColor();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validations
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email) {
      setError("Email address is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (strengthCount < 3) {
      setError("Please choose a stronger password matching the criteria.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      alert(`Account successfully created for: ${name} (${email})`);
    }, 1500);
  };

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
              <span>Join over 250,000+ Investors worldwide</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
              Start building your financial{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                freedom today.
              </span>
            </h1>
            <p className="text-lg text-zinc-400 font-normal leading-relaxed">
              Create a free account in less than two minutes and get immediate access to clean portfolio tracking and smart analytics tools.
            </p>
          </div>

          {/* Interactive features display list */}
          <div className="mt-10 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                <Check className="h-3.5 w-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Full Platform Client Access</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Connect external wallets, bank accounts, and exchanges seamlessly.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                <Check className="h-3.5 w-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Bank-Grade Encryption</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Your financial data stays fully private with state of the art custom encryption.</p>
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
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-background overflow-y-auto">
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
              Create an account
            </h2>
            <p className="text-sm text-muted-foreground text-center lg:text-left">
              Join FinOne and start monitoring your portfolios in real time.
            </p>
          </div>

          {/* Social Sign-In buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
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
                Or fill details manually
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative flex items-center">
                <User className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="pl-10 h-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
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

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 h-5 w-5 text-muted-foreground hover:text-foreground outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password strength indicators */}
              {password && (
                <div className="mt-2 space-y-2 rounded-lg border border-border bg-muted/30 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-semibold">Password Strength:</span>
                    <span className={`text-xs font-bold ${strength.text}`}>{strength.label}</span>
                  </div>
                  {/* Strength Bar */}
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index <= strengthCount ? strength.color : "bg-zinc-200 dark:bg-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                  {/* Requirements checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 pt-1 border-t border-border mt-1">
                    {passwordCriteria.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        {c.met ? (
                          <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                        )}
                        <span className={`text-[10px] font-medium leading-none ${c.met ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {c.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 h-5 w-5 text-muted-foreground hover:text-foreground outline-none"
                >
                  {showConfirmPassword ? (
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
              className="w-full h-10 mt-2 font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all shadow-md shadow-emerald-500/10 active:scale-[0.99] flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline hover:text-primary/95"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
