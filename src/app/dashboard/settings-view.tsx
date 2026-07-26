"use client";

import * as React from "react";
import {
  User,
  Lock,
  Bell,
  Paintbrush,
  FileText,
  LogOut,
  Globe,
  Percent,
  Check,
  Eye,
  EyeOff,
  Smartphone,
  Info,
  Sparkles,
  Folders,
  Trash2,
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "../../components/ui/select";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useCustomAlert } from "@/components/ui/custom-alert-dialog";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";
import { useTheme } from "@/lib/theme-context";

export default function SettingsView() {
  const { showSuccess, showDelete } = useCustomAlert();
  // Profile settings state
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  // Category Manager states
  const { dbUser, firebaseUser } = useAuth();
  const [categoryType, setCategoryType] = React.useState<"asset" | "debt" | "investment" | "goal" | "essential">("asset");
  const [assetCategories, setAssetCategories] = React.useState<any[]>([]);
  const [debtCategoriesList, setDebtCategoriesList] = React.useState<any[]>([]);
  const [investmentCategories, setInvestmentCategories] = React.useState<any[]>([]);
  const [goalCategoriesList, setGoalCategoriesList] = React.useState<any[]>([]);
  const [essentialCategoriesList, setEssentialCategoriesList] = React.useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<any | null>(null);

  // Form fields
  const [catName, setCatName] = React.useState("");
  const [catIsAppreciation, setCatIsAppreciation] = React.useState(true);
  const [catRate, setCatRate] = React.useState("");

  const resetForm = () => {
    setCatName("");
    setCatIsAppreciation(true);
    setCatRate("");
  };

  const fetchCategories = async () => {
    if (!dbUser?.userId) return;
    setLoadingCategories(true);
    try {
      if (categoryType === "asset") {
        const res = await apiClient.get(`/v1/assetcategory/${dbUser.userId}`);
        if (res.data?.success) {
          setAssetCategories(res.data.data);
        }
      } else if (categoryType === "debt") {
        const res = await apiClient.get(`/v1/debtcategory/${dbUser.userId}`);
        if (res.data?.success) {
          setDebtCategoriesList(res.data.data);
        }
      } else if (categoryType === "investment") {
        const res = await apiClient.get(`/v1/investmentcategory/${dbUser.userId}`);
        if (res.data?.success) {
          setInvestmentCategories(res.data.data);
        }
      } else if (categoryType === "goal") {
        const res = await apiClient.get(`/v1/goalcategory/users/${dbUser.userId}`);
        if (res.data?.success) {
          setGoalCategoriesList(res.data.data);
        }
      } else if (categoryType === "essential") {
        const res = await apiClient.get(`/v1/essentialcategory/users/${dbUser.userId}`);
        if (res.data?.success) {
          setEssentialCategoriesList(res.data.data);
        }
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, [dbUser, categoryType]);

  const startEdit = (cat: any) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    if (categoryType === "asset" || categoryType === "investment" || categoryType === "essential") {
      setCatIsAppreciation(cat.isAppreciation ?? cat.is_appreciation ?? true);
      setCatRate(cat.rate != null ? cat.rate.toString() : "");
    }
  };

  const saveCategory = async () => {
    if (!catName.trim() || !dbUser?.userId) return;
    try {
      if (editingCategory) {
        // Update
        if (categoryType === "asset") {
          await apiClient.put(`/v1/assetcategory/${editingCategory.id}`, {
            name: catName,
            isAppreciation: catIsAppreciation,
            rate: Number(catRate) || 0
          });
        } else if (categoryType === "debt") {
          await apiClient.put(`/v1/debtcategory/${editingCategory.id}`, {
            name: catName
          });
        } else if (categoryType === "investment") {
          await apiClient.put(`/v1/investmentcategory/${editingCategory.id}`, {
            name: catName,
            isAppreciation: catIsAppreciation,
            rate: Number(catRate) || 0
          });
        } else if (categoryType === "goal") {
          await apiClient.put(`/v1/goalcategory/${editingCategory.id}`, {
            name: catName
          });
        } else if (categoryType === "essential") {
          await apiClient.put(`/v1/essentialcategory/${editingCategory.id}`, {
            name: catName,
            isAppreciation: catIsAppreciation,
            rate: Number(catRate) || 0
          });
        }
        showSuccess("Success", "Category updated successfully!");
      } else {
        // Create
        if (categoryType === "asset") {
          await apiClient.post("/v1/assetcategory", {
            userId: dbUser.userId,
            name: catName,
            isAppreciation: catIsAppreciation,
            rate: Number(catRate) || 0
          });
        } else if (categoryType === "debt") {
          await apiClient.post("/v1/debtcategory", {
            userId: dbUser.userId,
            name: catName
          });
        } else if (categoryType === "investment") {
          await apiClient.post("/v1/investmentcategory", {
            userId: dbUser.userId,
            name: catName,
            isAppreciation: catIsAppreciation,
            rate: Number(catRate) || 0
          });
        } else if (categoryType === "goal") {
          await apiClient.post("/v1/goalcategory", {
            userId: dbUser.userId,
            name: catName
          });
        } else if (categoryType === "essential") {
          await apiClient.post("/v1/essentialcategory", {
            userId: dbUser.userId,
            name: catName,
            isAppreciation: catIsAppreciation,
            rate: Number(catRate) || 0
          });
        }
        showSuccess("Success", "Category created successfully!");
      }
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const confirmDelete = (catId: string) => {
    showDelete(
      "Delete Custom Category",
      "Are you sure you want to delete this custom category? All related items will remain intact.",
      async () => {
        try {
          if (categoryType === "asset") {
            await apiClient.delete(`/v1/assetcategory/${catId}`);
          } else if (categoryType === "debt") {
            await apiClient.delete(`/v1/debtcategory/${catId}`);
          } else if (categoryType === "investment") {
            await apiClient.delete(`/v1/investmentcategory/${catId}`);
          } else if (categoryType === "goal") {
            await apiClient.delete(`/v1/goalcategory/${catId}`);
          } else if (categoryType === "essential") {
            await apiClient.delete(`/v1/essentialcategory/${catId}`);
          }
          showSuccess("Success", "Category deleted successfully!");
          fetchCategories();
        } catch (err) {
          console.error("Error deleting category:", err);
        }
      }
    );
  };

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!dbUser?.userId) return;
      try {
        const res = await apiClient.get(`/v1/profile/${dbUser.userId}`);
        if (res.data?.success && res.data?.data) {
          const profile = res.data.data;
          setName(profile.name || "");
          setEmail(profile.email || "");
          
          let uiCountry = "India";
          if (profile.country === "US") uiCountry = "United States";
          else if (profile.country === "DE") uiCountry = "Germany";
          else if (profile.country === "GB") uiCountry = "United Kingdom";
          setCountry(uiCountry);

          let uiCurrency = "INR (₹)";
          if (profile.currency === "USD") uiCurrency = "USD ($)";
          else if (profile.currency === "EUR") uiCurrency = "EUR (€)";
          else if (profile.currency === "GBP") uiCurrency = "GBP (£)";
          setCurrency(uiCurrency);

          setInflationRate(profile.inflationRate || 5.8);
          
          switch (uiCountry) {
            case "India":
              setTimezone("GMT +5:30");
              setFinancialYear("April - March");
              break;
            case "United States":
              setTimezone("GMT -5:00");
              setFinancialYear("January - December");
              break;
            case "Germany":
              setTimezone("GMT +1:00");
              setFinancialYear("January - December");
              break;
            case "United Kingdom":
              setTimezone("GMT +0:00");
              setFinancialYear("April - March");
              break;
          }

          setNotifs(prev => ({
            ...prev,
            email: profile.notificationEmail ?? true,
            push: profile.notificationPush ?? true,
            sms: profile.notificationSms ?? false,
          }));
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchProfile();
  }, [dbUser]);

  const handleSaveProfile = async () => {
    if (!dbUser?.userId) return;
    try {
      let isoCountry = "IN";
      if (country === "United States") isoCountry = "US";
      else if (country === "Germany") isoCountry = "DE";
      else if (country === "United Kingdom") isoCountry = "GB";

      let currencyCode = "INR";
      if (currency === "USD ($)") currencyCode = "USD";
      else if (currency === "EUR (€)") currencyCode = "EUR";
      else if (currency === "GBP (£)") currencyCode = "GBP";

      const res = await apiClient.put(`/v1/profile/${dbUser.userId}`, {
        name,
        currency: currencyCode,
        inflationRate: Number(inflationRate) || 0,
        country: isoCountry,
        notificationEmail: notifs.email,
        notificationPush: notifs.push,
        notificationSms: notifs.sms,
        theme: theme
      });

      if (res.data?.success) {
        showSuccess("Success", "Profile updates saved successfully!");
      }
    } catch (err) {
      console.error("Error saving profile settings:", err);
    }
  };

  const handleSaveNotifications = async () => {
    if (!dbUser?.userId) return;
    try {
      let isoCountry = "IN";
      if (country === "United States") isoCountry = "US";
      else if (country === "Germany") isoCountry = "DE";
      else if (country === "United Kingdom") isoCountry = "GB";

      let currencyCode = "INR";
      if (currency === "USD ($)") currencyCode = "USD";
      else if (currency === "EUR (€)") currencyCode = "EUR";
      else if (currency === "GBP (£)") currencyCode = "GBP";

      const res = await apiClient.put(`/v1/profile/${dbUser.userId}`, {
        name,
        currency: currencyCode,
        inflationRate: Number(inflationRate) || 0,
        country: isoCountry,
        notificationEmail: notifs.email,
        notificationPush: notifs.push,
        notificationSms: notifs.sms,
        theme: theme
      });

      if (res.data?.success) {
        showSuccess("Success", "Notification rules saved successfully!");
      }
    } catch (err) {
      console.error("Error saving notification preferences:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const [mobile, setMobile] = React.useState("+91 98765 43210");
  const [country, setCountry] = React.useState("India");
  const [currency, setCurrency] = React.useState("INR (₹)");
  const [inflationRate, setInflationRate] = React.useState(5.8);
  const [language, setLanguage] = React.useState("English (US)");
  const [timezone, setTimezone] = React.useState("GMT +5:30");
  const [financialYear, setFinancialYear] = React.useState("April - March");

  // Country change side-effects
  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry);
    switch (selectedCountry) {
      case "India":
        setCurrency("INR (₹)");
        setInflationRate(5.8);
        setTimezone("GMT +5:30");
        setFinancialYear("April - March");
        break;
      case "United States":
        setCurrency("USD ($)");
        setInflationRate(3.2);
        setTimezone("GMT -5:00");
        setFinancialYear("January - December");
        break;
      case "Germany":
        setCurrency("EUR (€)");
        setInflationRate(2.4);
        setTimezone("GMT +1:00");
        setFinancialYear("January - December");
        break;
      case "United Kingdom":
        setCurrency("GBP (£)");
        setInflationRate(4.1);
        setTimezone("GMT +0:00");
        setFinancialYear("April - March");
        break;
    }
  };



  // Password state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  // Password strength checker
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /[0-9]/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordStrengthCount = [hasMinLength, hasNumber, hasUppercase, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (newPassword.length === 0) return { text: "", color: "bg-zinc-200" };
    switch (passwordStrengthCount) {
      case 1: return { text: "Weak", color: "bg-red-500" };
      case 2: return { text: "Fair", color: "bg-orange-500" };
      case 3: return { text: "Good", color: "bg-yellow-500" };
      case 4: return { text: "Strong", color: "bg-emerald-500" };
      default: return { text: "Weak", color: "bg-red-500" };
    }
  };
  const strength = getStrengthLabel();

  // Notification Toggles state
  const [notifs, setNotifs] = React.useState({
    goals: true,
    bills: true,
    credit: true,
    insurance: true,
    investments: false,
    budgets: true,
    ai: true,
    email: true,
    push: true,
    sms: false
  });

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs({ ...notifs, [key]: !notifs[key] });
  };

  // Theme personalization state
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  const [themeMode, setThemeMode] = React.useState<"light" | "dark" | "system">("light");
  const [selectedAccent, setSelectedAccent] = React.useState<"blue" | "emerald" | "purple" | "indigo" | "gold" | "rose">("blue");

  React.useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  React.useEffect(() => {
    setSelectedAccent(accentColor);
  }, [accentColor]);

  // Sign out confirmation modal dialog trigger
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950">Settings</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage your account, financial preferences, regional profiles, and settings.</p>
      </div>

      {/* Main Grid (2-Column Desktop Grid for Large Rounded Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ==========================================
            1. Profile Card
            ========================================== */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Profile & Preferences</h3>
              <p className="text-xs text-zinc-500">Manage regional financial preferences and personal records</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Personal Details */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-500">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-500">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-500">Mobile Number</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* Regional Country Selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-500 flex items-center gap-1">
                Country <Globe className="h-3 w-3 text-zinc-400" />
              </label>
              <Select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white cursor-pointer font-medium"
              >
                <option value="India">India 🇮🇳</option>
                <option value="United States">United States 🇺🇸</option>
                <option value="Germany">Germany 🇩🇪</option>
                <option value="United Kingdom">United Kingdom 🇬🇧</option>
              </Select>
            </div>

            {/* Auto currency */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-500">Preferred Currency</label>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 px-2 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white cursor-pointer font-medium"
              >
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </Select>
            </div>

            {/* Country Inflation rate */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-500 flex items-center gap-1">
                Inflation Rate Assumptions <Percent className="h-3 w-3 text-zinc-400" />
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white font-bold"
                />
                <span className="absolute right-3 text-zinc-400 font-semibold">%</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-500">Timezone</label>
              <input
                type="text"
                disabled
                value={timezone}
                className="w-full h-9 rounded-lg border border-zinc-250 bg-zinc-100/70 px-3 text-zinc-500 outline-none"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-500">Financial Cycle Year</label>
              <input
                type="text"
                disabled
                value={financialYear}
                className="w-full h-9 rounded-lg border border-zinc-250 bg-zinc-100/70 px-3 text-zinc-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-100 text-xs">
            <span className="text-zinc-400 font-medium">Auto-populated based on selected country settings</span>
            <Button
              onClick={handleSaveProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 h-8 shadow-sm transition-all active:scale-[0.98] font-bold"
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* ==========================================
            3. Notification Preferences Card
            ========================================== */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Configure Notifications</h3>
              <p className="text-xs text-zinc-500">Pick which channels and summaries send you alerts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            {/* Event categories */}
            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Trigger Alerts</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-800">Goal Reminders</p>
                  <p className="text-[10px] text-zinc-500">Weekly targets and retirement projection shifts</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotif("goals")}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifs.goals ? "bg-blue-600" : "bg-zinc-200"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.goals ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-800">Bill & Subscription Renewals</p>
                  <p className="text-[10px] text-zinc-500">Notice 3 days before renewal transactions occur</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotif("bills")}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifs.bills ? "bg-blue-600" : "bg-zinc-200"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.bills ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-800">Credit Card Due Dates</p>
                  <p className="text-[10px] text-zinc-500">Reminders before statement deadlines</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotif("credit")}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifs.credit ? "bg-blue-600" : "bg-zinc-200"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.credit ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-800">Insurance Renewals</p>
                  <p className="text-[10px] text-zinc-500">Health or home asset policy updates</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotif("insurance")}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifs.insurance ? "bg-blue-600" : "bg-zinc-200"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.insurance ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-800">Budget Limit Notifications</p>
                  <p className="text-[10px] text-zinc-500">Triggers immediately when budget reaches 85% cap</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotif("budgets")}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifs.budgets ? "bg-blue-600" : "bg-zinc-200"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.budgets ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            {/* Channels & AI recommendations */}
            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Delivery Channels</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-800">Email Notifications</p>
                  <p className="text-[10px] text-zinc-500">Receive comprehensive weekly summaries</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotif("email")}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifs.email ? "bg-blue-600" : "bg-zinc-200"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.email ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-800">Push App Alerts</p>
                  <p className="text-[10px] text-zinc-500">Live indicators inside your desktop dashboard client</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotif("push")}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifs.push ? "bg-blue-600" : "bg-zinc-200"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.push ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-800">SMS Text Messages</p>
                  <p className="text-[10px] text-zinc-500">Urgent payment reminders via text carrier</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotif("sms")}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifs.sms ? "bg-blue-600" : "bg-zinc-200"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.sms ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="rounded-xl bg-blue-50/50 p-3.5 border border-blue-100/50 flex items-start gap-2.5">
                <Sparkles className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-zinc-600 leading-normal">
                  Our AI Asset suggestions are configured to run automatically. Keep **AI Recommendations** active to receive continuous wealth rebalancing suggestions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-100">
            <Button
              onClick={handleSaveNotifications}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 h-8 shadow-sm transition-all active:scale-[0.98] font-bold text-xs"
            >
              Save Notification Preferences
            </Button>
          </div>
        </div>

        {/* ==========================================
            Category Manager Card
            ========================================== */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Folders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Category Manager</h3>
              <p className="text-xs text-zinc-500">View, create, and customize your custom Asset and Debt Category definitions</p>
            </div>
          </div>

          <div className="flex border-b border-zinc-150 text-xs font-bold text-zinc-500 gap-4 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => { setCategoryType("asset"); setEditingCategory(null); resetForm(); }}
              className={`pb-3 relative transition-colors outline-none ${categoryType === "asset" ? "text-blue-600 border-b-2 border-blue-600 font-bold" : "hover:text-zinc-800"}`}
            >
              Asset Categories
            </button>
            <button
              onClick={() => { setCategoryType("debt"); setEditingCategory(null); resetForm(); }}
              className={`pb-3 relative transition-colors outline-none ${categoryType === "debt" ? "text-blue-600 border-b-2 border-blue-600 font-bold" : "hover:text-zinc-800"}`}
            >
              Debt Categories
            </button>
            <button
              onClick={() => { setCategoryType("investment"); setEditingCategory(null); resetForm(); }}
              className={`pb-3 relative transition-colors outline-none ${categoryType === "investment" ? "text-blue-600 border-b-2 border-blue-600 font-bold" : "hover:text-zinc-800"}`}
            >
              Investment Categories
            </button>
            <button
              onClick={() => { setCategoryType("goal"); setEditingCategory(null); resetForm(); }}
              className={`pb-3 relative transition-colors outline-none ${categoryType === "goal" ? "text-blue-600 border-b-2 border-blue-600 font-bold" : "hover:text-zinc-800"}`}
            >
              Goal Categories
            </button>
            <button
              onClick={() => { setCategoryType("essential"); setEditingCategory(null); resetForm(); }}
              className={`pb-3 relative transition-colors outline-none ${categoryType === "essential" ? "text-blue-600 border-b-2 border-blue-600 font-bold" : "hover:text-zinc-800"}`}
            >
              Essential Categories
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-xs">
            {/* Left Panel: Category List */}
            <div className="md:col-span-3 space-y-3">
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Existing Categories</p>
              {loadingCategories ? (
                <div className="py-8 flex justify-center items-center text-zinc-400">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-650 mr-2" />
                  Loading Categories...
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 max-h-96 overflow-y-auto border border-zinc-150 rounded-xl bg-zinc-50/20 pr-1">
                  {(
                    categoryType === "asset" ? assetCategories :
                    categoryType === "debt" ? debtCategoriesList :
                    categoryType === "investment" ? investmentCategories :
                    categoryType === "goal" ? goalCategoriesList :
                    essentialCategoriesList
                  ).map((cat) => {
                    const isSystem = cat.userId === null;
                    return (
                      <div key={cat.id} className="p-3 flex justify-between items-center hover:bg-zinc-50/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-800">{cat.name}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                              isSystem ? "bg-zinc-100 text-zinc-500 border border-zinc-200" : "bg-blue-50 text-blue-600 border border-blue-100"
                            }`}>
                              {isSystem ? "System" : "Custom"}
                            </span>
                          </div>
                          {(categoryType === "asset" || categoryType === "investment" || categoryType === "essential") && (
                            <p className="text-[10px] text-zinc-400">
                              {cat.isAppreciation || cat.is_appreciation || cat.appreciation ? "Appreciation" : "Depreciation"} • Rate: {cat.rate}%
                            </p>
                          )}
                        </div>
                        
                        {!isSystem && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(cat)}
                              className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Category"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => confirmDelete(cat.id)}
                              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {(
                    categoryType === "asset" ? assetCategories :
                    categoryType === "debt" ? debtCategoriesList :
                    categoryType === "investment" ? investmentCategories :
                    categoryType === "goal" ? goalCategoriesList :
                    essentialCategoriesList
                  ).length === 0 && (
                    <p className="p-6 text-center text-zinc-400 italic">No categories found.</p>
                  )}
                </div>
              )}
            </div>

            {/* Right Panel: Create/Edit Form */}
            <div className="md:col-span-2 space-y-4 rounded-xl border border-zinc-150 p-4 bg-zinc-50/30">
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </p>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-500">Category Name *</label>
                <input
                  type="text"
                  placeholder="E.g. Commercial Building, Soft Debt"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-white outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                />
              </div>

              {(categoryType === "asset" || categoryType === "investment" || categoryType === "essential") && (
                <>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-500">
                      {categoryType === "asset" ? "Asset Type *" : categoryType === "investment" ? "Investment Type *" : "Essential Type *"}
                    </label>
                    <Select
                      value={catIsAppreciation ? "true" : "false"}
                      onChange={(e) => setCatIsAppreciation(e.target.value === "true")}
                      className="w-full"
                    >
                      <option value="true">APPRECIATION</option>
                      <option value="false">DEPRECIATION</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-500">Default Rate (%) *</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="E.g. 8.00"
                      value={catRate}
                      onChange={(e) => setCatRate(e.target.value)}
                      className="w-full h-9 rounded-lg border border-zinc-200 px-3 bg-white outline-none text-zinc-900 focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                {editingCategory && (
                  <button
                    onClick={() => { setEditingCategory(null); resetForm(); }}
                    className="flex-1 h-8 rounded-lg border border-zinc-200 bg-white text-zinc-650 font-bold hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <Button
                  onClick={saveCategory}
                  disabled={!catName.trim() || ((categoryType === "asset" || categoryType === "investment" || categoryType === "essential") && !catRate)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-8 shadow-sm transition-all active:scale-[0.98] font-bold text-xs"
                >
                  {editingCategory ? "Save Changes" : "Create Category"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            4. Theme Personalization Card
            ========================================== */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Paintbrush className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Personalize Appearance</h3>
              <p className="text-xs text-zinc-500">Pick desktop theme colors</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Visual card theme selectors */}
            <div>
              <label className="font-semibold text-zinc-500 block mb-2">Appearance Theme Mode</label>
              <div className="grid grid-cols-3 gap-2 text-center font-bold">
                <button
                  onClick={() => setThemeMode("light")}
                  className={`rounded-xl border p-3 flex flex-col items-center gap-1.5 transition-all outline-none ${
                    themeMode === "light" ? "border-blue-600 bg-blue-50/20 text-blue-600" : "border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                  }`}
                >
                  <span className="h-3 w-3 rounded-full bg-zinc-100 border border-zinc-300" />
                  <span>Light</span>
                </button>

                <button
                  onClick={() => setThemeMode("dark")}
                  className={`rounded-xl border p-3 flex flex-col items-center gap-1.5 transition-all outline-none ${
                    themeMode === "dark" ? "border-blue-600 bg-blue-50/20 text-blue-600" : "border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                  }`}
                >
                  <span className="h-3 w-3 rounded-full bg-zinc-950 border border-zinc-800" />
                  <span>Dark</span>
                </button>

                <button
                  onClick={() => setThemeMode("system")}
                  className={`rounded-xl border p-3 flex flex-col items-center gap-1.5 transition-all outline-none ${
                    themeMode === "system" ? "border-blue-600 bg-blue-50/20 text-blue-600" : "border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                  }`}
                >
                  <span className="h-3 w-3 rounded-full bg-gradient-to-r from-zinc-100 to-zinc-950 border border-zinc-300" />
                  <span>System</span>
                </button>
              </div>
            </div>

            {/* Accent Color picker */}
            <div>
              <label className="font-semibold text-zinc-500 block mb-2">Primary Accent Color</label>
              <div className="flex flex-wrap gap-3">
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
                      onClick={() => setSelectedAccent(color as any)}
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-white transition-all scale-[0.98] outline-none ${colorBg} ${
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

          <div className="flex justify-end pt-4 border-t border-zinc-100">
            <Button
              onClick={() => {
                setTheme(themeMode);
                setAccentColor(selectedAccent);
                showSuccess("Success", `Applied ${themeMode} theme with ${selectedAccent} accent!`);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 h-8 shadow-sm transition-all active:scale-[0.98] font-bold text-xs"
            >
              Apply Theme
            </Button>
          </div>
        </div>


        {/* ==========================================
            7. Sign Out Card
            ========================================== */}
        <div className="rounded-2xl border border-red-200 bg-red-50/20 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6 lg:col-span-2 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 shadow-sm">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-red-950">Security Sign Out</h3>
              <p className="text-xs text-red-750">Securely invalidate current session auth tokens or reset active devices</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-xs font-bold text-red-600 shadow-sm hover:bg-red-50 transition-colors"
            >
              Sign Out from Device
            </button>
            <button
              onClick={() => {
                showDelete(
                  "Delete",
                  "Sign out from all devices? You will be redirected back to the login page.",
                  handleSignOut
                );
              }}
              className="inline-flex h-9 items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 px-4 text-xs font-bold text-white shadow-sm transition-colors"
            >
              Sign Out All Devices
            </button>
          </div>

          {/* Modal confirmation overlay */}
          {showLogoutModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl space-y-4">
                <h4 className="text-sm font-bold text-zinc-900">Are you sure you want to sign out?</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Signing out will close your current session on this device. You will need to re-enter your credentials to access FinOne Client.
                </p>
                <div className="flex justify-end gap-2 pt-2 text-xs">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowLogoutModal(false);
                      handleSignOut();
                    }}
                    className="rounded-lg bg-red-600 hover:bg-red-700 px-3.5 py-1.5 font-bold text-white transition-colors"
                  >
                    Confirm Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
