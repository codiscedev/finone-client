"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Coins,
  Paintbrush,
  Bell,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  TrendingUp,
  ShieldAlert
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { dbUser, completeOnboarding } = useAuth();
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();

  // Wizard Step State
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [country, setCountry] = React.useState("India");
  const [currency, setCurrency] = React.useState("INR");
  const [inflationRate, setInflationRate] = React.useState(6.0);
  const [selectedTheme, setSelectedTheme] = React.useState<"light" | "dark" | "system">("light");
  const [selectedAccent, setSelectedAccent] = React.useState<"blue" | "emerald" | "purple" | "indigo" | "gold" | "rose">("blue");
  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [pushNotifs, setPushNotifs] = React.useState(true);
  const [smsNotifs, setSmsNotifs] = React.useState(false);

  // Sync theme configurations live
  React.useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  React.useEffect(() => {
    setSelectedAccent(accentColor);
  }, [accentColor]);

  // Handle live theme and accent changes
  const handleThemeChange = (t: "light" | "dark" | "system") => {
    setSelectedTheme(t);
    setTheme(t);
  };

  const handleAccentChange = (a: any) => {
    setSelectedAccent(a);
    setAccentColor(a);
  };

  // Auto-populate helper
  const handleCountryChange = (c: string) => {
    setCountry(c);
    switch (c) {
      case "India":
        setCurrency("INR");
        setInflationRate(6.0);
        break;
      case "United States":
        setCurrency("USD");
        setInflationRate(3.1);
        break;
      case "United Kingdom":
        setCurrency("GBP");
        setInflationRate(4.1);
        break;
      case "Germany":
        setCurrency("EUR");
        setInflationRate(2.2);
        break;
      case "UAE":
        setCurrency("AED");
        setInflationRate(2.5);
        break;
      case "Singapore":
        setCurrency("SGD");
        setInflationRate(3.5);
        break;
      case "Canada":
        setCurrency("CAD");
        setInflationRate(3.0);
        break;
      case "Australia":
        setCurrency("AUD");
        setInflationRate(3.2);
        break;
    }
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!dbUser?.userId) return;
    setLoading(true);
    setError(null);

    const payload = {
      name: dbUser.name,
      currency: currency,
      country: country,
      inflationRate: inflationRate,
      theme: selectedTheme,
      notificationEmail: emailNotifs,
      notificationPush: pushNotifs,
      notificationSms: smsNotifs,
    };

    try {
      // 1. Save preferences to the profile API
      const response = await apiClient.put(`/v1/profile/${dbUser.userId}`, payload);

      if (response.data?.success) {
        // 2. Mark onboarding complete in auth context frontend (resolves redirections)
        completeOnboarding({
          ...dbUser,
          currency: currency,
          newUser: false,
        });
        router.push("/dashboard");
      } else {
        throw new Error("Failed to save onboarding settings");
      }
    } catch (err: any) {
      console.error("Onboarding Submit Error:", err);
      setError("Failed to save your preferences. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 sm:px-6 transition-colors duration-350">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-xl relative z-10 transition-colors">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md mb-3">
            <TrendingUp className="h-5.5 w-5.5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome to FinOne
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
            Let's configure your profile options to customize your dashboards, currency tracking, and alerts.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8 max-w-xs mx-auto text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
          <div className={`flex flex-col items-center gap-1.5 ${step >= 1 ? "text-blue-600 dark:text-blue-400" : ""}`}>
            <span className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
              step >= 1 ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/40 font-extrabold" : "border-zinc-200 dark:border-zinc-800"
            }`}>1</span>
            <span>Profile</span>
          </div>
          <span className={`h-[2px] flex-1 bg-zinc-200 dark:bg-zinc-800 mx-3 -mt-4 transition-colors ${step >= 2 ? "bg-blue-600/50 dark:bg-blue-400/50" : ""}`} />
          <div className={`flex flex-col items-center gap-1.5 ${step >= 2 ? "text-blue-600 dark:text-blue-400" : ""}`}>
            <span className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
              step >= 2 ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/40 font-extrabold" : "border-zinc-200 dark:border-zinc-800"
            }`}>2</span>
            <span>Appearance</span>
          </div>
          <span className={`h-[2px] flex-1 bg-zinc-200 dark:bg-zinc-800 mx-3 -mt-4 transition-colors ${step >= 3 ? "bg-blue-600/50 dark:bg-blue-400/50" : ""}`} />
          <div className={`flex flex-col items-center gap-1.5 ${step >= 3 ? "text-blue-600 dark:text-blue-400" : ""}`}>
            <span className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
              step >= 3 ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/40 font-extrabold" : "border-zinc-200 dark:border-zinc-800"
            }`}>3</span>
            <span>Notifications</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-500 flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP CONTENT */}
        <div className="min-h-[220px] text-xs">
          {/* STEP 1: Financial profile */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <Coins className="h-4 w-4 text-blue-600" />
                <h2 className="font-bold text-zinc-950 dark:text-white">Regional Financial Profile</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-500">Country / Region</label>
                  <Select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                  >
                    <option value="India">India 🇮🇳</option>
                    <option value="United States">United States 🇺🇸</option>
                    <option value="United Kingdom">United Kingdom 🇬🇧</option>
                    <option value="Germany">Germany 🇩🇪</option>
                    <option value="UAE">UAE 🇦🇪</option>
                    <option value="Singapore">Singapore 🇸🇬</option>
                    <option value="Canada">Canada 🇨🇦</option>
                    <option value="Australia">Australia 🇦🇺</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-500">Preferred Currency</label>
                  <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED (د.إ)</option>
                    <option value="SGD">SGD ($)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-zinc-500">Inflation Rate Assumption</label>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{inflationRate}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 leading-normal mt-1.5">
                  Used globally to evaluate future compounding goals and real portfolio yields.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Appearance settings */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <Paintbrush className="h-4 w-4 text-blue-600" />
                <h2 className="font-bold text-zinc-950 dark:text-white">Appearance & Accents</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-zinc-500 block mb-2">Theme Mode</label>
                  <div className="grid grid-cols-3 gap-2 text-center font-bold">
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`rounded-xl border p-3 flex flex-col items-center gap-1.5 transition-all outline-none cursor-pointer text-[10px] ${
                        selectedTheme === "light" ? "border-blue-600 bg-blue-50/20 text-blue-600" : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full bg-zinc-100 border border-zinc-300" />
                      <span>Light</span>
                    </button>

                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`rounded-xl border p-3 flex flex-col items-center gap-1.5 transition-all outline-none cursor-pointer text-[10px] ${
                        selectedTheme === "dark" ? "border-blue-600 bg-blue-50/20 text-blue-600" : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full bg-zinc-950 border border-zinc-800" />
                      <span>Dark</span>
                    </button>

                    <button
                      onClick={() => handleThemeChange("system")}
                      className={`rounded-xl border p-3 flex flex-col items-center gap-1.5 transition-all outline-none cursor-pointer text-[10px] ${
                        selectedTheme === "system" ? "border-blue-600 bg-blue-50/20 text-blue-600" : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full bg-gradient-to-r from-zinc-100 to-zinc-950 border border-zinc-300" />
                      <span>System</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-zinc-500 block mb-2">Primary Accent Color</label>
                  <div className="flex flex-wrap gap-2.5">
                    {["blue", "emerald", "purple", "indigo", "gold", "rose"].map((color) => {
                      const colorBg =
                        color === "blue" ? "bg-blue-600" :
                        color === "emerald" ? "bg-emerald-500" :
                        color === "purple" ? "bg-purple-600" :
                        color === "indigo" ? "bg-indigo-600" :
                        color === "gold" ? "bg-amber-500" : "bg-rose-500";
                      return (
                        <button
                          key={color}
                          onClick={() => handleAccentChange(color)}
                          className={`h-7 w-7 rounded-full flex items-center justify-center text-white transition-all scale-[0.98] outline-none cursor-pointer ${colorBg} ${
                            selectedAccent === color ? "ring-4 ring-zinc-200 dark:ring-zinc-700" : "opacity-80 hover:opacity-100"
                          }`}
                          title={`${color.charAt(0).toUpperCase() + color.slice(1)} Accent`}
                        >
                          {selectedAccent === color && <Check className="h-3.5 w-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Notifications settings */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <Bell className="h-4 w-4 text-blue-600" />
                <h2 className="font-bold text-zinc-950 dark:text-white">Alerts & Notifications</h2>
              </div>

              <div className="space-y-3 pt-1">
                {/* Email notification */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">Email Digest Alerts</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Receive tax summaries and milestone logs</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailNotifs(!emailNotifs)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      emailNotifs ? "bg-blue-600" : "bg-zinc-200 dark:bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        emailNotifs ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Push notification */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">Web Push Toggles</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Receive browser flags for budget checks and anomalies</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushNotifs(!pushNotifs)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      pushNotifs ? "bg-blue-600" : "bg-zinc-200 dark:bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        pushNotifs ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* SMS Alerts */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">Mobile SMS Alerts</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Receive text messages for critical advisory invites</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSmsNotifs(!smsNotifs)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      smsNotifs ? "bg-blue-600" : "bg-zinc-200 dark:bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        smsNotifs ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAVIGATION ACTIONS */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Button
            onClick={handleBack}
            disabled={step === 1 || loading}
            className={`border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-850 px-4 h-9 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer font-bold ${
              step === 1 ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>

          {step < 3 ? (
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1 font-bold"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-9 shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5 font-bold disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  Get Started <Sparkles className="h-4 w-4 fill-white text-white" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
