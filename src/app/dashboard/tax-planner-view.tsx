"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Percent,
  Sparkles,
  ShieldCheck,
  Download,
  AlertCircle,
  HelpCircle,
  FolderLock,
  ChevronDown,
  ThumbsUp,
  Check,
  X,
  Globe,
  Users,
  Heart,
  Edit3,
  Cake,
  MapPin,
  Coins,
  Layers,
  Home,
  ShieldPlus,
  PiggyBank,
  GraduationCap,
  Briefcase,
  DollarSign,
  TrendingDown,
  Info,
  ArrowRight,
  ArrowLeft,
  ListFilter,
  Receipt,
  FileCheck,
  Target,
  Clock,
  ShieldAlert,
  Sliders,
  ExternalLink,
  ChevronUp,
  CheckSquare,
  Square,
  Building,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";
import {
  GLOBAL_TAX_COUNTRIES,
  getCountryTaxConfig,
  formatCountryCurrency
} from "@/lib/tax/global-tax-rules";

export default function TaxPlannerView() {
  const { dbUser } = useAuth();

  // Wizard Step (1 to 7)
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showExplainModal, setShowExplainModal] = React.useState(false);
  const [showCalcDetailsModal, setShowCalcDetailsModal] = React.useState(false);

  // FORM 1: ABOUT YOU
  const [residenceCountry, setResidenceCountry] = React.useState("India");
  const [customResidenceCountry, setCustomResidenceCountry] = React.useState("");
  const [taxCountryType, setTaxCountryType] = React.useState("Same as where I live");
  const [taxCountry, setTaxCountry] = React.useState("India");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [maritalStatus, setMaritalStatus] = React.useState("Single");
  const [supportDependents, setSupportDependents] = React.useState("No");

  // FORM 2: YOUR INCOME
  const [incomeSources, setIncomeSources] = React.useState<string[]>(["Salary"]);
  const [annualIncome, setAnnualIncome] = React.useState(1200000);
  const [hasMultipleIncomeSources, setHasMultipleIncomeSources] = React.useState(false);
  const [hasForeignIncome, setHasForeignIncome] = React.useState(false);
  const [hasSoldAssets, setHasSoldAssets] = React.useState(false);

  // FORM 3: YOUR EXPENSES & SAVINGS
  const [paysRent, setPaysRent] = React.useState(false);
  const [rentAmount, setRentAmount] = React.useState(0);
  const [hasHomeLoan, setHasHomeLoan] = React.useState(false);
  const [homeLoanInterest, setHomeLoanInterest] = React.useState(0);
  const [paysHealthInsurance, setPaysHealthInsurance] = React.useState(false);
  const [healthInsurancePremium, setHealthInsurancePremium] = React.useState(0);
  const [investsOrSaves, setInvestsOrSaves] = React.useState(false);
  const [savingsAmount, setSavingsAmount] = React.useState(0);
  const [paysEducationLoan, setPaysEducationLoan] = React.useState(false);
  const [eduLoanInterest, setEduLoanInterest] = React.useState(0);

  // Connected Portfolio Data from Server (Debts, Investments, Assets)
  const [detectedDebts, setDetectedDebts] = React.useState<any[]>([]);
  const [detectedInvestments, setDetectedInvestments] = React.useState<any[]>([]);
  const [detectedAssets, setDetectedAssets] = React.useState<any[]>([]);

  // FORM 4: YOUR INVESTMENTS & ASSETS
  const [hasInvestments, setHasInvestments] = React.useState(true);
  const [selectedInvestmentTypes, setSelectedInvestmentTypes] = React.useState<string[]>([
    "Stocks",
    "Mutual Funds"
  ]);
  const [selectedPortfolioInvestments, setSelectedPortfolioInvestments] = React.useState<string[]>([]);
  const [ownsProperty, setOwnsProperty] = React.useState(false);
  const [hasRetirementPlan, setHasRetirementPlan] = React.useState(true);
  const [hasForeignAssets, setHasForeignAssets] = React.useState(false);

  // FORM 5: YOUR TAX DETAILS
  const [paidTaxThisYear, setPaidTaxThisYear] = React.useState("No");
  const [taxDeductedAtSource, setTaxDeductedAtSource] = React.useState("Yes");
  const [receivedRefundLastYear, setReceivedRefundLastYear] = React.useState("No");
  const [filedReturnLastYear, setFiledReturnLastYear] = React.useState("Yes");
  const [hasUnpaidTax, setHasUnpaidTax] = React.useState("No");

  // FORM 6: YOUR GOALS
  const [primaryGoal, setPrimaryGoal] = React.useState("Pay less tax");
  const [taxPlanningBudget, setTaxPlanningBudget] = React.useState(150000);
  const [planningTimeframe, setPlanningTimeframe] = React.useState("This year");
  const [riskComfort, setRiskComfort] = React.useState("Medium");
  const [optimizationPreference, setOptimizationPreference] = React.useState("Maximum tax savings");

  // Calculated Results from Server / Engine
  const [calculationResult, setCalculationResult] = React.useState<any>(null);

  // Action Plan Checklist State
  const [actionChecklist, setActionChecklist] = React.useState<{ id: string; title: string; desc: string; benefit: number; done: boolean }[]>([
    { id: "1", title: "Maximize Section 80C / Retirement limit", desc: "Contribute up to the annual cap in ELSS, PPF, or 401(k) to lower taxable bracket.", benefit: 30000, done: false },
    { id: "2", title: "Review Health Insurance Premium receipts", desc: "Ensure health cover receipts are organized for deduction claim.", benefit: 7500, done: false },
    { id: "3", title: "Claim Home Loan interest exemption (Sec 24b / Mortgage)", desc: "Submit annual interest certificate from lender to lower gross income.", benefit: 40000, done: false },
    { id: "4", title: "Harvest unrealized capital losses before year end", desc: "Offset capital gains against eligible asset losses.", benefit: 12000, done: false }
  ]);

  // Active Country Rule
  const activeCountry = residenceCountry === "Other" && customResidenceCountry ? customResidenceCountry : residenceCountry;
  const countryConfig = getCountryTaxConfig(activeCountry);

  // Fetch initial profile and portfolio data (Debts, Investments, Assets)
  React.useEffect(() => {
    if (!dbUser?.userId) return;

    const loadProfile = async () => {
      try {
        const res = await apiClient.get("/v1/tax/profile");
        if (res.data?.success && res.data?.data) {
          const p = res.data.data;
          if (p.residence_country) setResidenceCountry(p.residence_country);
          if (p.tax_country_type) setTaxCountryType(p.tax_country_type);
          if (p.tax_country) setTaxCountry(p.tax_country);
          if (p.date_of_birth) setDateOfBirth(p.date_of_birth);
          if (p.marital_status) setMaritalStatus(p.marital_status);
          if (p.support_dependents) setSupportDependents(p.support_dependents);

          if (p.income_sources) setIncomeSources(p.income_sources.split(",").filter(Boolean));
          if (p.annual_income) setAnnualIncome(Number(p.annual_income));
          if (p.has_multiple_income_sources !== undefined) setHasMultipleIncomeSources(p.has_multiple_income_sources);
          if (p.has_foreign_income !== undefined) setHasForeignIncome(p.has_foreign_income);
          if (p.has_sold_assets !== undefined) setHasSoldAssets(p.has_sold_assets);

          if (p.pays_rent !== undefined) setPaysRent(p.pays_rent);
          if (p.has_home_loan !== undefined) setHasHomeLoan(p.has_home_loan);
          if (p.pays_health_insurance !== undefined) setPaysHealthInsurance(p.pays_health_insurance);
          if (p.invests_or_saves !== undefined) setInvestsOrSaves(p.invests_or_saves);
          if (p.pays_education_loan !== undefined) setPaysEducationLoan(p.pays_education_loan);

          if (p.has_investments !== undefined) setHasInvestments(p.has_investments);
          if (p.investment_types) setSelectedInvestmentTypes(p.investment_types.split(",").filter(Boolean));
          if (p.owns_property !== undefined) setOwnsProperty(p.owns_property);
          if (p.has_retirement_plan !== undefined) setHasRetirementPlan(p.has_retirement_plan);
          if (p.has_foreign_assets !== undefined) setHasForeignAssets(p.has_foreign_assets);

          if (p.paid_tax_this_year) setPaidTaxThisYear(p.paid_tax_this_year);
          if (p.tax_deducted_at_source) setTaxDeductedAtSource(p.tax_deducted_at_source);
          if (p.received_refund_last_year) setReceivedRefundLastYear(p.received_refund_last_year);
          if (p.filed_return_last_year) setFiledReturnLastYear(p.filed_return_last_year);
          if (p.has_unpaid_tax) setHasUnpaidTax(p.has_unpaid_tax);

          if (p.primary_goal) setPrimaryGoal(p.primary_goal);
          if (p.tax_planning_budget) setTaxPlanningBudget(Number(p.tax_planning_budget));
          if (p.planning_timeframe) setPlanningTimeframe(p.planning_timeframe);
          if (p.risk_comfort) setRiskComfort(p.risk_comfort);
          if (p.optimization_preference) setOptimizationPreference(p.optimization_preference);

          if (p.calculations) {
            setCalculationResult(p.calculations);
          }

          if (p.tax_onboarding_completed) {
            setCurrentStep(7);
          }
        }
      } catch (err) {
        console.error("Error loading tax profile:", err);
      }
    };

    const loadPortfolioData = async () => {
      // 1. Load Debts
      try {
        const debtRes = await apiClient.get(`/v1/debt/users/${dbUser.userId}`);
        if (debtRes.data?.success) {
          const debts = debtRes.data.data || [];
          setDetectedDebts(debts);
          const hasHome = debts.some((d: any) => {
            const cat = `${d.category_name || ""} ${d.name || ""}`.toLowerCase();
            return cat.includes("home") || cat.includes("housing") || cat.includes("mortgage") || cat.includes("property");
          });
          const hasEdu = debts.some((d: any) => {
            const cat = `${d.category_name || ""} ${d.name || ""}`.toLowerCase();
            return cat.includes("edu") || cat.includes("student") || cat.includes("tuition");
          });
          if (hasHome) setHasHomeLoan(true);
          if (hasEdu) setPaysEducationLoan(true);
        }
      } catch (e) {}

      // 2. Load Investments
      try {
        const invRes = await apiClient.get(`/v1/investment/users/${dbUser.userId}`);
        if (invRes.data?.success) {
          const invs = invRes.data.data || [];
          setDetectedInvestments(invs);
          if (invs.length > 0) setHasInvestments(true);
        }
      } catch (e) {}

      // 3. Load Assets
      try {
        const assetRes = await apiClient.get(`/v1/asset/users/${dbUser.userId}`);
        if (assetRes.data?.success) {
          const assets = assetRes.data.data || [];
          setDetectedAssets(assets);
          const hasProp = assets.some((a: any) => {
            const t = `${a.type || ""} ${a.category_name || ""} ${a.name || ""}`.toLowerCase();
            return t.includes("real_estate") || t.includes("property") || t.includes("home") || t.includes("land");
          });
          if (hasProp) setOwnsProperty(true);
        }
      } catch (e) {}
    };

    loadProfile();
    loadPortfolioData();
  }, [dbUser]);

  // Age calculation helper
  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const userAge = calculateAge(dateOfBirth);

  // Save profile state to backend
  const saveProfileData = async (isFinalStep = false) => {
    setIsSaving(true);
    try {
      const payload = {
        residence_country: residenceCountry === "Other" ? customResidenceCountry || "Other" : residenceCountry,
        tax_country_type: taxCountryType,
        tax_country: taxCountryType === "Same as where I live" ? (residenceCountry === "Other" ? customResidenceCountry || "Other" : residenceCountry) : taxCountry,
        date_of_birth: dateOfBirth,
        marital_status: maritalStatus,
        support_dependents: supportDependents,

        income_sources: incomeSources.join(","),
        annual_income: annualIncome,
        has_multiple_income_sources: hasMultipleIncomeSources,
        has_foreign_income: hasForeignIncome,
        has_sold_assets: hasSoldAssets,

        pays_rent: paysRent,
        has_home_loan: hasHomeLoan,
        pays_health_insurance: paysHealthInsurance,
        invests_or_saves: investsOrSaves,
        pays_education_loan: paysEducationLoan,

        has_investments: hasInvestments,
        investment_types: selectedInvestmentTypes.join(","),
        owns_property: ownsProperty,
        has_retirement_plan: hasRetirementPlan,
        has_foreign_assets: hasForeignAssets,

        paid_tax_this_year: paidTaxThisYear,
        tax_deducted_at_source: taxDeductedAtSource,
        received_refund_last_year: receivedRefundLastYear,
        filed_return_last_year: filedReturnLastYear,
        has_unpaid_tax: hasUnpaidTax,

        primary_goal: primaryGoal,
        tax_planning_budget: taxPlanningBudget,
        planning_timeframe: planningTimeframe,
        risk_comfort: riskComfort,
        optimization_preference: optimizationPreference,

        tax_onboarding_completed: isFinalStep || currentStep === 7
      };

      const res = await apiClient.put("/v1/tax/profile", payload);
      if (res.data?.success && res.data?.data) {
        if (res.data.data.calculations) {
          setCalculationResult(res.data.data.calculations);
        }
      }
    } catch (err) {
      console.error("Failed to save tax profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextStep = async () => {
    await saveProfileData(currentStep === 6);
    setCurrentStep((prev) => Math.min(prev + 1, 7));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Toggle helpers
  const toggleIncomeSource = (src: string) => {
    setIncomeSources((prev) =>
      prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]
    );
  };

  const toggleInvestmentType = (type: string) => {
    setSelectedInvestmentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleActionItem = (id: string) => {
    setActionChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  // Step definitions
  const stepTitles = [
    { num: 1, title: "About You", short: "About", desc: "Residency & age" },
    { num: 2, title: "Income", short: "Income", desc: "Earnings & inflow" },
    { num: 3, title: "Expenses", short: "Expenses", desc: "Rent & insurance" },
    { num: 4, title: "Assets", short: "Assets", desc: "Investments" },
    { num: 5, title: "History", short: "History", desc: "Taxes paid" },
    { num: 6, title: "Goals", short: "Goals", desc: "Priorities" },
    { num: 7, title: "Tax Plan", short: "Plan", desc: "Results" }
  ];

  // Derived Estimates for Form 7
  const isOldRecommended = calculationResult?.recommended_regime === "OLD";
  const isEqual = calculationResult?.recommended_regime === "EQUAL";
  const estGross = calculationResult?.gross_total_income ?? calculationResult?.gross_income ?? annualIncome;
  
  // Taxable income of the recommended regime
  const estTaxable = isOldRecommended
    ? (calculationResult?.taxable_income_old ?? calculationResult?.old_taxable_income ?? Math.max(0, estGross - 50000))
    : (calculationResult?.taxable_income_new ?? calculationResult?.new_taxable_income ?? Math.max(0, estGross - countryConfig.standardDeduction));

  // Final tax payable of the recommended regime
  const estTax = isOldRecommended
    ? (calculationResult?.tax_payable_old ?? calculationResult?.old_tax ?? calculationResult?.old_final_tax ?? 0)
    : (calculationResult?.tax_payable_new ?? calculationResult?.new_tax ?? calculationResult?.new_final_tax ?? 0);

  const estSavings = calculationResult?.tax_difference ?? calculationResult?.estimated_savings ?? 0;

  const recommendedRegimeDisplay = calculationResult?.optimal_regime || (
    isOldRecommended
      ? (countryConfig.alternativeRegimeName || "Old Tax Regime")
      : isEqual
      ? "Both Options Equal"
      : countryConfig.defaultRegime
  );

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950/50 p-4 sm:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Top Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Calculator className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Global Tax Planner
            </h1>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
              {countryConfig.taxYear}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Intelligent country-aware tax optimization, deductions & legal saving strategies.
          </p>
        </div>

        {/* Global Country & Currency Pill */}
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 rounded-xl shadow-xs">
          <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase text-zinc-400 leading-none">Applicable Rules</p>
            <p className="text-xs font-black text-zinc-900 dark:text-white">
              {countryConfig.countryName} ({countryConfig.currencySymbol} {countryConfig.currencyCode})
            </p>
          </div>
        </div>
      </div>

      {/* Stepper Progress Bar (Responsive 7-Step Grid, Zero Scroll) */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-4 shadow-xs overflow-hidden">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 items-center">
          {stepTitles.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                type="button"
                className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl transition-all text-center sm:text-left cursor-pointer ${
                  isCurrent
                    ? "bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 shadow-2xs"
                    : isCompleted
                    ? "bg-zinc-50/80 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                    : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50/50"
                }`}
              >
                <div
                  className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black transition-all shrink-0 ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-xs"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "border border-zinc-300 dark:border-zinc-700 text-zinc-400"
                  }`}
                >
                  {isCompleted ? <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : s.num}
                </div>
                <div className="min-w-0 flex-1 truncate">
                  <p className="text-[10px] sm:text-xs font-extrabold leading-tight truncate">
                    <span className="hidden sm:inline">{s.title}</span>
                    <span className="sm:hidden">{s.short}</span>
                  </p>
                  <p className="hidden lg:block text-[9px] text-zinc-400 leading-none truncate mt-0.5">
                    {s.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* ========================================================================= */}
        {/* FORM 1: ABOUT YOU */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Step 1 of 7 • Personal Profile
              </span>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
                Tell us about you
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Your residency, age, and family situation determine which country&apos;s tax laws, allowances, and dependent credits apply.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Question 1: Country of Residence */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-blue-600" /> Which country do you live in?
                </label>
                <select
                  value={residenceCountry}
                  onChange={(e) => setResidenceCountry(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="India">India (INR ₹)</option>
                  <option value="United States">United States (USD $)</option>
                  <option value="United Kingdom">United Kingdom (GBP £)</option>
                  <option value="Singapore">Singapore (SGD S$)</option>
                  <option value="United Arab Emirates">United Arab Emirates (AED د.إ)</option>
                  <option value="Canada">Canada (CAD C$)</option>
                  <option value="Germany">Germany (EUR €)</option>
                  <option value="Other">Other Country</option>
                </select>
                {residenceCountry === "Other" && (
                  <input
                    type="text"
                    placeholder="Enter your country name"
                    value={customResidenceCountry}
                    onChange={(e) => setCustomResidenceCountry(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs mt-2"
                  />
                )}
              </div>

              {/* Question 2: Tax Country */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-indigo-600" /> Which country do you pay taxes in?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Same as where I live", "Another country", "Both"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTaxCountryType(opt)}
                      className={`h-11 px-2 rounded-xl border text-xs font-bold transition-all ${
                        taxCountryType === opt
                          ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-xs"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:border-zinc-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Date of Birth */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Cake className="h-4 w-4 text-purple-600" /> What is your date of birth?
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs font-bold text-zinc-900 dark:text-white"
                  />
                  {userAge !== null && (
                    <span className="shrink-0 text-xs font-black px-3 py-2.5 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                      Age: {userAge}
                    </span>
                  )}
                </div>
              </div>

              {/* Question 4: Marital Status */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-rose-600" /> What is your marital status?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Single", "Married", "Divorced", "Widowed"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setMaritalStatus(status)}
                      className={`h-11 rounded-xl border text-xs font-bold transition-all ${
                        maritalStatus === status
                          ? "border-rose-600 bg-rose-50/60 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 shadow-xs"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:border-zinc-300"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 5: Financial Dependents */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-amber-600" /> Do you financially support anyone?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    "No",
                    "Yes — Children",
                    "Yes — Parents",
                    "Yes — Spouse/Partner",
                    "Yes — Other"
                  ].map((dep) => (
                    <button
                      key={dep}
                      type="button"
                      onClick={() => setSupportDependents(dep)}
                      className={`h-11 px-3 rounded-xl border text-xs font-bold transition-all ${
                        supportDependents === dep
                          ? "border-amber-600 bg-amber-50/60 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 shadow-xs"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:border-zinc-300"
                      }`}
                    >
                      {dep}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORM 2: YOUR INCOME */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Step 2 of 7 • Income Streams
              </span>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
                Tell us about your income
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Identify all revenue streams, gross annual earnings, and foreign inflows.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {/* Question 1: How do you earn money (Multi-select) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-blue-600" /> How do you earn your money? (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Salary",
                    "Business",
                    "Freelance",
                    "Professional work",
                    "Rent",
                    "Investments",
                    "Pension",
                    "Other"
                  ].map((src) => {
                    const isSelected = incomeSources.includes(src);
                    return (
                      <button
                        key={src}
                        type="button"
                        onClick={() => toggleIncomeSource(src)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                        {src}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2: Annual Income Input with Country Currency */}
              <div className="space-y-2 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 p-5 rounded-2xl">
                <label className="text-xs font-extrabold text-blue-950 dark:text-blue-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Coins className="h-4 w-4 text-blue-600" /> How much money do you earn in a year? (Gross Annual Income)
                  </span>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {countryConfig.currencyCode} ({countryConfig.currencySymbol})
                  </span>
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-3 text-base font-bold text-zinc-400">
                    {countryConfig.currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={annualIncome || ""}
                    onChange={(e) => setAnnualIncome(Number(e.target.value) || 0)}
                    placeholder="e.g. 1200000"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-base font-black text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between pt-1">
                  <span>Formatted: <strong>{formatCountryCurrency(annualIncome, activeCountry)}</strong></span>
                  <span>Approx monthly: {formatCountryCurrency(Math.round(annualIncome / 12), activeCountry)}/mo</span>
                </p>
              </div>

              {/* Toggle Questions: 3, 4, 5 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Question 3: More than one income source */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Do you have more than one income source?
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setHasMultipleIncomeSources(true)}
                      className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                        hasMultipleIncomeSources
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasMultipleIncomeSources(false)}
                      className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                        !hasMultipleIncomeSources
                          ? "bg-zinc-800 text-white border-zinc-800"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Question 4: Foreign income */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Do you earn money from another country?
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setHasForeignIncome(true)}
                      className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                        hasForeignIncome
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasForeignIncome(false)}
                      className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                        !hasForeignIncome
                          ? "bg-zinc-800 text-white border-zinc-800"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Question 5: Sold investments/property */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Did you sell any investments or assets this year?
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setHasSoldAssets(true)}
                      className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                        hasSoldAssets
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasSoldAssets(false)}
                      className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                        !hasSoldAssets
                          ? "bg-zinc-800 text-white border-zinc-800"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORM 3: YOUR EXPENSES & SAVINGS (SYNCED WITH DEBT TABLE) */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Step 3 of 7 • Deductions & Expenses
              </span>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
                Tell us about your expenses
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Identify payments qualifying for country-specific deductions, exemptions, and interest relief.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Question 1: Rent */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Home className="h-4 w-4 text-blue-600" /> Do you pay rent?
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    May qualify for HRA exemption (India) or housing deduction.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaysRent(true)}
                    className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all ${
                      paysRent ? "bg-blue-600 text-white border-blue-600" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaysRent(false)}
                    className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all ${
                      !paysRent ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Question 2: Home Loan / Mortgage with DEBT TABLE SYNC */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Building className="h-4 w-4 text-emerald-600" /> Do you have a home loan or mortgage?
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Interest payments deductible up to {countryConfig.currencySymbol}{countryConfig.maxHomeLoanInterestDeduction.toLocaleString()} ({countryConfig.housingProgramName}).
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHasHomeLoan(true)}
                      className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all ${
                        hasHomeLoan ? "bg-blue-600 text-white border-blue-600" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasHomeLoan(false)}
                      className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all ${
                        !hasHomeLoan ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Show Synced Debts from Debt Table */}
                {hasHomeLoan && detectedDebts.length > 0 && (
                  <div className="pt-2 border-t border-zinc-200/70 dark:border-zinc-800 space-y-2">
                    <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> Debts detected from your Debt Table:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {detectedDebts.map((d: any) => (
                        <div
                          key={d.id}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2"
                        >
                          <span className="font-bold text-emerald-900 dark:text-emerald-200">{d.name}</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            Bal: {formatCountryCurrency(d.outstanding, activeCountry)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Question 3: Health Insurance */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <ShieldPlus className="h-4 w-4 text-purple-600" /> Do you pay for health insurance?
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Covers premiums for self, spouse, children & parents ({countryConfig.healthProgramName}).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaysHealthInsurance(true)}
                    className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all ${
                      paysHealthInsurance ? "bg-blue-600 text-white border-blue-600" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaysHealthInsurance(false)}
                    className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all ${
                      !paysHealthInsurance ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Question 4: Invest or Save */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <PiggyBank className="h-4 w-4 text-amber-600" /> Do you invest or save money?
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Qualifies for retirement & savings relief up to {countryConfig.currencySymbol}{countryConfig.maxRetirementDeduction.toLocaleString()} ({countryConfig.retirementProgramName}).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInvestsOrSaves(true)}
                    className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all ${
                      investsOrSaves ? "bg-blue-600 text-white border-blue-600" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvestsOrSaves(false)}
                    className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all ${
                      !investsOrSaves ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Question 5: Education Loan */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-indigo-600" /> Do you pay for education or an education loan?
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Interest on higher education loans is 100% tax-deductible for 8 years.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaysEducationLoan(true)}
                    className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all ${
                      paysEducationLoan ? "bg-blue-600 text-white border-blue-600" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaysEducationLoan(false)}
                    className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all ${
                      !paysEducationLoan ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORM 4: YOUR INVESTMENTS & ASSETS (SYNCED WITH INVESTMENT & ASSET TABLES) */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Step 4 of 7 • Assets & Holdings
              </span>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
                Tell us about what you own
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Identify portfolio holdings, real estate, and pension accounts to optimize asset allocation and tax drag.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {/* Question 1: Do you have investments */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex items-center justify-between">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Do you have active investments?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHasInvestments(true)}
                    className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all ${
                      hasInvestments ? "bg-blue-600 text-white border-blue-600" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasInvestments(false)}
                    className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all ${
                      !hasInvestments ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Question 2: What do you invest in (Multi-select) */}
              {hasInvestments && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-blue-600" /> What do you invest in? (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Stocks",
                      "Mutual Funds",
                      "Bonds",
                      "Retirement/Pension Funds",
                      "Fixed/Term Deposits",
                      "Property",
                      "Other"
                    ].map((type) => {
                      const isSelected = selectedInvestmentTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleInvestmentType(type)}
                          className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                              : "bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                          {type}
                        </button>
                      );
                    })}
                  </div>

                  {/* PORTFOLIO PICK-LIST FROM USER'S INVESTMENT & ASSET TABLES */}
                  {(detectedInvestments.length > 0 || detectedAssets.length > 0) && (
                    <div className="mt-4 p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-blue-600" /> Pick from your synced Wealth Portfolio:
                        </p>
                        <span className="text-[10px] font-bold text-blue-600">Auto-synced</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                        {detectedInvestments.map((inv: any) => {
                          const isPicked = selectedPortfolioInvestments.includes(inv.id);
                          return (
                            <button
                              key={inv.id}
                              type="button"
                              onClick={() =>
                                setSelectedPortfolioInvestments((prev) =>
                                  prev.includes(inv.id) ? prev.filter((id) => id !== inv.id) : [...prev, inv.id]
                                )
                              }
                              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                                isPicked
                                  ? "bg-white dark:bg-zinc-800 border-blue-600 shadow-xs ring-1 ring-blue-600"
                                  : "bg-white/80 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                              }`}
                            >
                              <div>
                                <p className="font-extrabold text-zinc-900 dark:text-white leading-tight">{inv.name}</p>
                                <span className="text-[10px] text-zinc-400 font-semibold">{inv.type}</span>
                              </div>
                              <span className="text-xs font-bold text-emerald-600">
                                {formatCountryCurrency(inv.currentValue || inv.investedAmount, activeCountry)}
                              </span>
                            </button>
                          );
                        })}

                        {detectedAssets.map((ast: any) => (
                          <div
                            key={ast.id}
                            className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 text-xs flex items-center justify-between"
                          >
                            <div>
                              <p className="font-extrabold text-zinc-900 dark:text-white leading-tight">{ast.name}</p>
                              <span className="text-[10px] text-zinc-400 font-semibold">{ast.categoryName || ast.type}</span>
                            </div>
                            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                              {formatCountryCurrency(ast.currentMarketValue || ast.purchaseValue, activeCountry)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Questions 3, 4, 5 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Question 3: Own a home or property */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Do you own a home or other property?
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setOwnsProperty(true)}
                      className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                        ownsProperty ? "bg-blue-600 text-white border-blue-600" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setOwnsProperty(false)}
                      className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                        !ownsProperty ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Question 4: Retirement / Pension plan */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Do you have a retirement or pension plan?
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setHasRetirementPlan(true)}
                      className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                        hasRetirementPlan ? "bg-blue-600 text-white border-blue-600" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasRetirementPlan(false)}
                      className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                        !hasRetirementPlan ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Question 5: Foreign assets */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Do you have investments in another country?
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setHasForeignAssets(true)}
                      className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                        hasForeignAssets ? "bg-blue-600 text-white border-blue-600" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasForeignAssets(false)}
                      className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                        !hasForeignAssets ? "bg-zinc-800 text-white border-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORM 5: YOUR TAX DETAILS */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Step 5 of 7 • Filing History
              </span>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
                Tell us about your tax history
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Understand withholding (TDS), prior year refund status, and existing tax liabilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Question 1: Have you paid any tax this year */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
                <p className="text-xs font-bold text-zinc-900 dark:text-white">
                  1. Have you paid any advance tax this year?
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {["Yes", "No", "Not sure"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPaidTaxThisYear(opt)}
                      className={`h-10 rounded-xl text-xs font-bold border transition-all ${
                        paidTaxThisYear === opt
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Is tax already deducted from your income (TDS / PAYE) */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
                <p className="text-xs font-bold text-zinc-900 dark:text-white">
                  2. Is tax already deducted from your income (TDS / Withholding)?
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {["Yes", "No", "Not sure"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTaxDeductedAtSource(opt)}
                      className={`h-10 rounded-xl text-xs font-bold border transition-all ${
                        taxDeductedAtSource === opt
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Did you receive a tax refund last year */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
                <p className="text-xs font-bold text-zinc-900 dark:text-white">
                  3. Did you receive a tax refund last year?
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {["Yes", "No", "Not sure"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setReceivedRefundLastYear(opt)}
                      className={`h-10 rounded-xl text-xs font-bold border transition-all ${
                        receivedRefundLastYear === opt
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Did you file a tax return last year */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
                <p className="text-xs font-bold text-zinc-900 dark:text-white">
                  4. Did you file a tax return last year?
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {["Yes", "No", "This is my first time"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFiledReturnLastYear(opt)}
                      className={`h-10 rounded-xl text-xs font-bold border transition-all ${
                        filedReturnLastYear === opt
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 5: Do you have any unpaid tax from previous years */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2 md:col-span-2">
                <p className="text-xs font-bold text-zinc-900 dark:text-white">
                  5. Do you have any unpaid tax liability from previous years?
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {["Yes", "No", "Not sure"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setHasUnpaidTax(opt)}
                      className={`h-10 rounded-xl text-xs font-bold border transition-all ${
                        hasUnpaidTax === opt
                          ? "bg-rose-600 text-white border-rose-600"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORM 6: YOUR GOALS */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Step 6 of 7 • Strategy & Priorities
              </span>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
                What do you want to achieve?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Your goals and risk comfort help us rank and personalize the top recommendations for you.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {/* Question 1: What is most important to you */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-blue-600" /> What is most important to you?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "Pay less tax",
                    "Save more money",
                    "Build wealth",
                    "Plan for retirement",
                    "Buy a home",
                    "Support my family"
                  ].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setPrimaryGoal(goal)}
                      className={`h-11 px-3 rounded-xl border text-xs font-bold transition-all ${
                        primaryGoal === goal
                          ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-xs"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:border-zinc-300"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: How much can you set aside for tax planning */}
              <div className="space-y-2 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Coins className="h-4 w-4 text-emerald-600" /> How much money can you set aside for tax planning / savings?
                  </span>
                  <span className="text-[11px] font-bold text-zinc-500">
                    {countryConfig.currencySymbol}
                  </span>
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-3 text-base font-bold text-zinc-400">
                    {countryConfig.currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={taxPlanningBudget || ""}
                    onChange={(e) => setTaxPlanningBudget(Number(e.target.value) || 0)}
                    placeholder="e.g. 150000"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-base font-black text-zinc-900 dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-zinc-400">
                  Target savings allocation: {formatCountryCurrency(taxPlanningBudget, activeCountry)}
                </p>
              </div>

              {/* Questions 3, 4, 5 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Question 3: Timeframe */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-purple-600" /> Planning timeframe?
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {["This year", "1–3 years", "3–5 years", "5+ years"].map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => setPlanningTimeframe(tf)}
                        className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                          planningTimeframe === tf
                            ? "bg-purple-600 text-white border-purple-600"
                            : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 4: Risk comfort */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-amber-600" /> Investment risk comfort?
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {["Low", "Medium", "High"].map((risk) => (
                      <button
                        key={risk}
                        type="button"
                        onClick={() => setRiskComfort(risk)}
                        className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                          riskComfort === risk
                            ? "bg-amber-600 text-white border-amber-600"
                            : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        {risk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 5: Preference */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-indigo-600" /> What do you prefer?
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {[
                      "Maximum tax savings",
                      "Balance tax savings and financial growth",
                      "Focus more on financial growth"
                    ].map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setOptimizationPreference(pref)}
                        className={`w-full p-2 text-left rounded-lg text-[11px] font-bold border transition-all ${
                          optimizationPreference === pref
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORM 7: YOUR TAX PLAN (RESULTS & RECOMMENDATIONS DASHBOARD) */}
        {/* ========================================================================= */}
        {currentStep === 7 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Header & Retake Assessment Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Step 7 of 7 • Personalized Results
                </span>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                  Your Tax Plan ({countryConfig.taxYear})
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Calculated using {countryConfig.countryName} individual tax rules & legal exemption provisions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowExplainModal(true)}
                  variant="outline"
                  className="text-xs font-bold h-9 rounded-xl border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5"
                >
                  <HelpCircle className="h-4 w-4 text-blue-600" /> Why am I seeing this?
                </Button>
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="text-xs font-bold h-9 rounded-xl border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5"
                >
                  <Edit3 className="h-4 w-4" /> Edit Answers
                </Button>
              </div>
            </div>

            {/* Disclaimer Alert */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Estimated Values:</strong> All calculations and tax figures shown are estimates based on provided responses and standard rules for <strong>{countryConfig.countryName}</strong>. They do not constitute formal legal or certified tax filing advice.
              </p>
            </div>

            {/* 4 Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Gross Annual Income */}
              <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                  Estimated Annual Income
                </p>
                <p className="text-xl font-black text-zinc-900 dark:text-white">
                  {formatCountryCurrency(estGross, activeCountry)}
                </p>
                <span className="text-[10px] text-zinc-400 font-semibold">Total gross earnings</span>
              </div>

              {/* Taxable Income */}
              <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                  Estimated Taxable Income
                </p>
                <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                  {formatCountryCurrency(estTaxable, activeCountry)}
                </p>
                <span className="text-[10px] text-zinc-400 font-semibold">After standard deduction</span>
              </div>

              {/* Estimated Tax Liability */}
              <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                  Estimated Tax Liability
                </p>
                <p className="text-xl font-black text-rose-600 dark:text-rose-400">
                  {formatCountryCurrency(estTax, activeCountry)}
                </p>
                <span className="text-[10px] text-zinc-400 font-semibold">Under recommended regime</span>
              </div>

              {/* Potential Tax Savings */}
              <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/30 space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Potential Tax Savings
                </p>
                <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                  {formatCountryCurrency(estSavings, activeCountry)}
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold">Via actionable deductions</span>
              </div>
            </div>

            {/* Recommended Option / Regime Card */}
            <div className={`p-6 rounded-2xl text-white shadow-lg space-y-3 ${
              isOldRecommended
                ? "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700"
                : isEqual
                ? "bg-gradient-to-r from-emerald-600 to-teal-700"
                : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-black bg-white/20 px-2.5 py-0.5 rounded-full">
                    Recommended Tax Option
                  </span>
                  <h3 className="text-xl font-black mt-1">
                    {recommendedRegimeDisplay} ({countryConfig.countryName})
                  </h3>
                </div>
                <Button
                  onClick={() => setShowCalcDetailsModal(true)}
                  className="bg-white hover:bg-zinc-100 text-zinc-900 font-extrabold h-9 px-4 rounded-xl text-xs shadow-xs"
                >
                  View Details & Slabs
                </Button>
              </div>
              <p className="text-xs text-white/90 leading-relaxed max-w-2xl">
                <strong>Why this was recommended:</strong> {calculationResult?.recommendation_reason || (
                  `Based on the information you provided and your deduction profile in ${countryConfig.countryName}, choosing ${recommendedRegimeDisplay} results in a lower estimated tax liability by ${formatCountryCurrency(estSavings, activeCountry)} compared to alternate treatments.`
                )}
              </p>
            </div>

            {/* Top Ranked Recommendations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" /> Top Tax-Saving Opportunities
                </h3>
                <span className="text-xs text-zinc-400">Ranked by overall net benefit</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Retirement */}
                <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                        <PiggyBank className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-black text-emerald-600">
                        Benefit: ~{formatCountryCurrency(30000, activeCountry)}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white pt-1">
                      1. Maximize Retirement Contribution
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Contribute up to {countryConfig.currencySymbol}{countryConfig.maxRetirementDeduction.toLocaleString()} into {countryConfig.retirementProgramName}.
                    </p>
                  </div>
                  <div className="text-[10px] text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <strong>Why:</strong> Lowers highest marginal tax bracket while growing long-term retirement wealth.
                  </div>
                </div>

                {/* 2. Health Insurance */}
                <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
                        <ShieldPlus className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-black text-emerald-600">
                        Benefit: ~{formatCountryCurrency(10000, activeCountry)}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white pt-1">
                      2. Review Health Cover Receipts
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Ensure {countryConfig.healthProgramName} premiums for self and family are accounted for.
                    </p>
                  </div>
                  <div className="text-[10px] text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <strong>Why:</strong> Direct deduction from taxable gross with 100% principal safety.
                  </div>
                </div>

                {/* 3. Housing / Capital Gains */}
                <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                        <TrendingDown className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-black text-emerald-600">
                        Benefit: ~{formatCountryCurrency(15000, activeCountry)}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white pt-1">
                      3. Harvest Tax Losses on Assets
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Offset realized capital gains against short-term or long-term capital losses before fiscal year end.
                    </p>
                  </div>
                  <div className="text-[10px] text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <strong>Why:</strong> Legal reduction of net taxable investment gains without altering asset strategy.
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Action Plan Checklist */}
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                    Action Plan Checklist
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Check off steps as you implement them to track your tax optimization progress.
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600">
                  {actionChecklist.filter((i) => i.done).length} of {actionChecklist.length} Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {actionChecklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleActionItem(item.id)}
                    className={`p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                      item.done
                        ? "bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                        item.done ? "bg-emerald-600 border-emerald-600 text-white" : "border-zinc-300"
                      }`}>
                        {item.done && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <p className={`font-extrabold ${item.done ? "line-through text-zinc-400" : "text-zinc-900 dark:text-white"}`}>
                          {item.title}
                        </p>
                        <p className="text-[11px] text-zinc-400">{item.desc}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-emerald-600 shrink-0 ml-2">
                      +{formatCountryCurrency(item.benefit, activeCountry)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Controls (Back / Continue / Save) */}
        <div className="flex items-center justify-between pt-8 border-t border-zinc-200 dark:border-zinc-800 mt-8">
          {currentStep > 1 ? (
            <Button
              onClick={handlePrevStep}
              variant="outline"
              className="h-10 px-5 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {currentStep < 7 ? (
              <Button
                onClick={handleNextStep}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-xl text-xs shadow-sm flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  "Calculating..."
                ) : (
                  <>
                    Continue <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  saveProfileData(true);
                  alert("Tax Plan saved successfully!");
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-6 rounded-xl text-xs shadow-sm flex items-center gap-2"
              >
                <Check className="h-4 w-4" /> Save Final Plan
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXPLAINABILITY MODAL ("Why am I seeing this?") */}
      {/* ========================================================================= */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900 dark:text-white">
                    Why is {recommendedRegimeDisplay} recommended?
                  </h3>
                  <p className="text-[11px] text-zinc-400">Side-by-side mathematical regime comparison</p>
                </div>
              </div>
              <button
                onClick={() => setShowExplainModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Side-by-Side Comparison Table */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-bold border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="p-3">Calculation Step</th>
                    <th className={`p-3 text-right ${isOldRecommended ? "bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 font-black" : ""}`}>
                      Old Tax Regime {isOldRecommended && "(Better)"}
                    </th>
                    <th className={`p-3 text-right ${!isOldRecommended && !isEqual ? "bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 font-black" : ""}`}>
                      New Tax Regime {!isOldRecommended && !isEqual && "(Better)"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr>
                    <td className="p-3 font-medium">1. Gross Annual Income</td>
                    <td className="p-3 text-right font-bold">{formatCountryCurrency(estGross, activeCountry)}</td>
                    <td className="p-3 text-right font-bold">{formatCountryCurrency(estGross, activeCountry)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">2. Standard Deduction</td>
                    <td className="p-3 text-right font-bold text-emerald-600">
                      -{formatCountryCurrency(calculationResult?.standard_deduction_old ?? 50000, activeCountry)}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-600">
                      -{formatCountryCurrency(calculationResult?.standard_deduction_new ?? countryConfig.standardDeduction, activeCountry)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">3. Total Itemized Deductions (80C, 80D, 24b, HRA)</td>
                    <td className="p-3 text-right font-bold text-emerald-600">
                      -{formatCountryCurrency(Math.max(0, (calculationResult?.total_deductions_old ?? 0) - (calculationResult?.standard_deduction_old ?? 50000)), activeCountry)}
                    </td>
                    <td className="p-3 text-right font-bold text-zinc-400">
                      ₹0 (Not allowed)
                    </td>
                  </tr>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-800/30">
                    <td className="p-3 font-bold">4. Net Taxable Income</td>
                    <td className="p-3 text-right font-bold">
                      {formatCountryCurrency(calculationResult?.taxable_income_old ?? 0, activeCountry)}
                    </td>
                    <td className="p-3 text-right font-bold">
                      {formatCountryCurrency(calculationResult?.taxable_income_new ?? 0, activeCountry)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">5. Base Slabs Tax</td>
                    <td className="p-3 text-right">{formatCountryCurrency(calculationResult?.old_base_tax ?? 0, activeCountry)}</td>
                    <td className="p-3 text-right">{formatCountryCurrency(calculationResult?.new_base_tax ?? 0, activeCountry)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">6. Section 87A Tax Rebate</td>
                    <td className="p-3 text-right text-emerald-600">
                      -{formatCountryCurrency(calculationResult?.old_rebate ?? 0, activeCountry)}
                    </td>
                    <td className="p-3 text-right text-emerald-600">
                      -{formatCountryCurrency(calculationResult?.new_rebate ?? 0, activeCountry)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">7. Surcharge & Marginal Relief</td>
                    <td className="p-3 text-right">+{formatCountryCurrency(calculationResult?.old_surcharge ?? 0, activeCountry)}</td>
                    <td className="p-3 text-right">+{formatCountryCurrency(calculationResult?.new_surcharge ?? 0, activeCountry)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">8. 4% Health & Education Cess</td>
                    <td className="p-3 text-right">+{formatCountryCurrency(calculationResult?.old_cess ?? 0, activeCountry)}</td>
                    <td className="p-3 text-right">+{formatCountryCurrency(calculationResult?.new_cess ?? 0, activeCountry)}</td>
                  </tr>
                  <tr className="bg-zinc-100/70 dark:bg-zinc-800/80 font-black text-sm">
                    <td className="p-3">Final Tax Payable</td>
                    <td className={`p-3 text-right ${isOldRecommended ? "text-emerald-600" : "text-zinc-900 dark:text-white"}`}>
                      {formatCountryCurrency(calculationResult?.old_final_tax ?? calculationResult?.tax_payable_old ?? 0, activeCountry)}
                    </td>
                    <td className={`p-3 text-right ${!isOldRecommended && !isEqual ? "text-emerald-600" : "text-zinc-900 dark:text-white"}`}>
                      {formatCountryCurrency(calculationResult?.new_final_tax ?? calculationResult?.tax_payable_new ?? 0, activeCountry)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-950 dark:text-blue-200 space-y-1">
              <p className="font-extrabold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600" /> Verdict: {recommendedRegimeDisplay} saves {formatCountryCurrency(estSavings, activeCountry)}
              </p>
              <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                {calculationResult?.recommendation_reason || `The recommended regime lowers your estimated tax burden by maximizing available statutory reliefs.`}
              </p>
            </div>

            <Button
              onClick={() => setShowExplainModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-xl text-xs"
            >
              Close Comparison
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CALCULATION DETAILS & SLABS MODAL */}
      {/* ========================================================================= */}
      {showCalcDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-5 animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-black text-zinc-900 dark:text-white">
                  {countryConfig.countryName} Tax Rules & Slabs ({countryConfig.taxYear})
                </h3>
                <p className="text-[11px] text-zinc-400">Official Progressive Slabs Reference</p>
              </div>
              <button
                onClick={() => setShowCalcDetailsModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Slabs Table */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-bold border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="p-3">Income Slab</th>
                    <th className="p-3">Tax Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {countryConfig.brackets.map((b, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50">
                      <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200">
                        {countryConfig.currencySymbol}{b.fromAmount.toLocaleString()} — {b.toAmount ? `${countryConfig.currencySymbol}${b.toAmount.toLocaleString()}` : "Above"}
                      </td>
                      <td className="p-3 font-black text-blue-600 dark:text-blue-400">
                        {b.ratePct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-[11px] text-zinc-500 space-y-1">
              <p><strong>Standard Deduction:</strong> {formatCountryCurrency(countryConfig.standardDeduction, activeCountry)}</p>
              <p><strong>Max Retirement Allowance:</strong> {formatCountryCurrency(countryConfig.maxRetirementDeduction, activeCountry)} ({countryConfig.retirementProgramName})</p>
              <p><strong>Max Health Insurance Relief:</strong> {formatCountryCurrency(countryConfig.maxHealthInsuranceDeduction, activeCountry)} ({countryConfig.healthProgramName})</p>
            </div>

            <Button
              onClick={() => setShowCalcDetailsModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-xl text-xs"
            >
              Got It
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
