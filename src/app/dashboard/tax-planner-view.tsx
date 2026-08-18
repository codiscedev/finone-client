"use client";

import * as React from "react";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Calculator,
  Plus,
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
  Trash2,
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
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";

export default function TaxPlannerView() {
  const { dbUser } = useAuth();
  // Onboarding states
  const [taxOnboardingCompleted, setTaxOnboardingCompleted] = React.useState<boolean | null>(null);
  const [onboardingStep, setOnboardingStep] = React.useState(1);

  // Form 1 - Personal & Tax Residency Profile states
  const [residenceCountry, setResidenceCountry] = React.useState("India");
  const [customResidenceCountry, setCustomResidenceCountry] = React.useState("");
  const [taxCountryType, setTaxCountryType] = React.useState("Same as where I live");
  const [taxCountry, setTaxCountry] = React.useState("India");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [maritalStatus, setMaritalStatus] = React.useState("Single");
  const [supportDependents, setSupportDependents] = React.useState("No");

  // Form 2 - Income Sources & Earnings states
  const [incomeSources, setIncomeSources] = React.useState<string[]>(["Salary"]);
  const [annualIncome, setAnnualIncome] = React.useState(0);
  const [hasMultipleIncomeSources, setHasMultipleIncomeSources] = React.useState(false);
  const [hasForeignIncome, setHasForeignIncome] = React.useState(false);
  const [hasSoldAssets, setHasSoldAssets] = React.useState(false);

  // Form 3 - Deductions & Commitments states
  const [paysRent, setPaysRent] = React.useState(false);
  const [hasHomeLoan, setHasHomeLoan] = React.useState(false);
  const [paysHealthInsurance, setPaysHealthInsurance] = React.useState(false);
  const [investsOrSaves, setInvestsOrSaves] = React.useState(false);
  const [paysEducationLoan, setPaysEducationLoan] = React.useState(false);
  const [detectedHomeLoans, setDetectedHomeLoans] = React.useState<any[]>([]);
  const [detectedEduLoans, setDetectedEduLoans] = React.useState<any[]>([]);

  // 1. Tax Regime Comparison states
  const [selectedRegime, setSelectedRegime] = React.useState<"Old" | "New">("New");
  
  // 2. Income Summary states (Indian Rupees)
  const [salary, setSalary] = React.useState(0);
  const [freelance, setFreelance] = React.useState(0);
  const [rental, setRental] = React.useState(0);
  const [capitalGains, setCapitalGains] = React.useState(0);
  const [otherIncome, setOtherIncome] = React.useState(0);

  // 3. Deductions states
  const [ded80C, setDed80C] = React.useState(0);
  const [ded80D, setDed80D] = React.useState(0);
  const [ded80CCD, setDed80CCD] = React.useState(0);
  const [ded24b, setDed24b] = React.useState(0);
  const [ded80G, setDed80G] = React.useState(0);

  // HRA Calculator inputs
  const [hraBasic, setHraBasic] = React.useState(0);
  const [hraReceived, setHraReceived] = React.useState(0);
  const [hraRentPaid, setHraRentPaid] = React.useState(0);
  const [hraIsMetro, setHraIsMetro] = React.useState(false);

  // Auto Tax Detection state
  const [autoDetections, setAutoDetections] = React.useState<any[]>([]);

  // Document Vault files
  const [uploadedFiles, setUploadedFiles] = React.useState<any[]>([]);

  const [newFileName, setNewFileName] = React.useState("");

  const calculateAge = (dobString: string) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  const fetchTaxProfile = React.useCallback(async () => {
    try {
      const res = await apiClient.get("/v1/tax/profile");
      if (res.data?.success) {
        const p = res.data.data;
        if (p.residenceCountry) {
          if (["India", "United States", "United Kingdom", "Canada", "Australia", "United Arab Emirates", "Singapore", "Germany"].includes(p.residenceCountry)) {
            setResidenceCountry(p.residenceCountry);
          } else {
            setResidenceCountry("Other");
            setCustomResidenceCountry(p.residenceCountry);
          }
        }
        if (p.taxCountryType) setTaxCountryType(p.taxCountryType);
        if (p.taxCountry) setTaxCountry(p.taxCountry);
        if (p.dateOfBirth) setDateOfBirth(p.dateOfBirth);
        if (p.maritalStatus) setMaritalStatus(p.maritalStatus);
        if (p.supportDependents) setSupportDependents(p.supportDependents);
        if (p.incomeSources) {
          const parsed = p.incomeSources.split(",").map((s: string) => s.trim()).filter(Boolean);
          if (parsed.length > 0) setIncomeSources(parsed);
        }
        if (p.annualIncome !== undefined && p.annualIncome !== null && p.annualIncome > 0) {
          setAnnualIncome(p.annualIncome);
        } else if (p.salaryIncome) {
          setAnnualIncome(p.salaryIncome);
        }
        if (p.hasMultipleIncomeSources !== undefined) setHasMultipleIncomeSources(p.hasMultipleIncomeSources);
        if (p.hasForeignIncome !== undefined) setHasForeignIncome(p.hasForeignIncome);
        if (p.hasSoldAssets !== undefined) setHasSoldAssets(p.hasSoldAssets);
        if (p.paysRent !== undefined) setPaysRent(p.paysRent);
        if (p.hasHomeLoan !== undefined) setHasHomeLoan(p.hasHomeLoan);
        if (p.paysHealthInsurance !== undefined) setPaysHealthInsurance(p.paysHealthInsurance);
        if (p.investsOrSaves !== undefined) setInvestsOrSaves(p.investsOrSaves);
        if (p.paysEducationLoan !== undefined) setPaysEducationLoan(p.paysEducationLoan);
        setSalary(p.salaryIncome ?? 0);
        setFreelance(p.freelanceIncome ?? 0);
        setRental(p.rentalIncome ?? 0);
        setCapitalGains(p.capitalGains ?? 0);
        setOtherIncome(p.otherIncome ?? 0);
        setDed80C(p.deduction80c ?? 0);
        setDed80D(p.deduction80d ?? 0);
        setDed80CCD(p.deduction80ccd ?? 0);
        setDed24b(p.deduction24b ?? 0);
        setDed80G(p.deduction80g ?? 0);
        setHraBasic(p.hraBasic ?? 0);
        setHraReceived(p.hraReceived ?? 0);
        setHraRentPaid(p.hraRentPaid ?? 0);
        setHraIsMetro(p.hraIsMetro ?? false);
        setSelectedRegime(p.selectedRegime === "OLD" ? "Old" : "New");
        setTaxOnboardingCompleted(p.taxOnboardingCompleted);
      }
    } catch (err) {
      console.error("Failed to fetch tax profile", err);
    }
  }, []);

  const fetchUserDebts = React.useCallback(async () => {
    if (!dbUser?.userId) return;
    try {
      const res = await apiClient.get(`/v1/debt/users/${dbUser.userId}`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        const debtsList = res.data.data;
        const homeLoans = debtsList.filter((d: any) => {
          const text = ((d.categoryName || "") + " " + (d.name || "")).toLowerCase();
          return text.includes("home") || text.includes("housing") || text.includes("mortgage") || text.includes("property");
        });
        const eduLoans = debtsList.filter((d: any) => {
          const text = ((d.categoryName || "") + " " + (d.name || "")).toLowerCase();
          return text.includes("education") || text.includes("edu") || text.includes("student") || text.includes("college") || text.includes("tuition");
        });
        setDetectedHomeLoans(homeLoans);
        setDetectedEduLoans(eduLoans);
        if (homeLoans.length > 0) {
          setHasHomeLoan(true);
        }
        if (eduLoans.length > 0) {
          setPaysEducationLoan(true);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user debts for tax planning", err);
    }
  }, [dbUser?.userId]);

  const saveTaxProfile = async (updates: any) => {
    try {
      const activeResidenceCountry = updates.residenceCountry !== undefined
        ? updates.residenceCountry
        : (residenceCountry === "Other" && customResidenceCountry ? customResidenceCountry : residenceCountry);

      const activeIncomeSources = updates.incomeSources !== undefined
        ? updates.incomeSources
        : incomeSources;

      const activeAnnualIncome = updates.annualIncome !== undefined
        ? updates.annualIncome
        : (annualIncome || updates.salary || salary);

      const payload = {
        residenceCountry: activeResidenceCountry,
        taxCountryType: updates.taxCountryType ?? taxCountryType,
        taxCountry: updates.taxCountry ?? (taxCountryType === "Same as where I live" ? activeResidenceCountry : taxCountry),
        dateOfBirth: updates.dateOfBirth !== undefined ? updates.dateOfBirth : dateOfBirth,
        maritalStatus: updates.maritalStatus ?? maritalStatus,
        supportDependents: updates.supportDependents ?? supportDependents,
        incomeSources: Array.isArray(activeIncomeSources) ? activeIncomeSources.join(", ") : activeIncomeSources,
        annualIncome: activeAnnualIncome,
        hasMultipleIncomeSources: updates.hasMultipleIncomeSources !== undefined ? updates.hasMultipleIncomeSources : hasMultipleIncomeSources,
        hasForeignIncome: updates.hasForeignIncome !== undefined ? updates.hasForeignIncome : hasForeignIncome,
        hasSoldAssets: updates.hasSoldAssets !== undefined ? updates.hasSoldAssets : hasSoldAssets,
        paysRent: updates.paysRent !== undefined ? updates.paysRent : paysRent,
        hasHomeLoan: updates.hasHomeLoan !== undefined ? updates.hasHomeLoan : hasHomeLoan,
        paysHealthInsurance: updates.paysHealthInsurance !== undefined ? updates.paysHealthInsurance : paysHealthInsurance,
        investsOrSaves: updates.investsOrSaves !== undefined ? updates.investsOrSaves : investsOrSaves,
        paysEducationLoan: updates.paysEducationLoan !== undefined ? updates.paysEducationLoan : paysEducationLoan,
        salaryIncome: updates.salary ?? (salary || activeAnnualIncome),
        freelanceIncome: updates.freelance ?? freelance,
        rentalIncome: updates.rental ?? rental,
        capitalGains: updates.capitalGains ?? capitalGains,
        otherIncome: updates.otherIncome ?? otherIncome,
        deduction80c: updates.ded80C ?? ded80C,
        deduction80d: updates.ded80D ?? ded80D,
        deduction80ccd: updates.ded80CCD ?? ded80CCD,
        deduction24b: updates.ded24b ?? ded24b,
        deduction80g: updates.ded80G ?? ded80G,
        hraBasic: updates.hraBasic ?? hraBasic,
        hraReceived: updates.hraReceived ?? hraReceived,
        hraRentPaid: updates.hraRentPaid ?? hraRentPaid,
        hraIsMetro: updates.hraIsMetro !== undefined ? updates.hraIsMetro : hraIsMetro,
        selectedRegime: (updates.selectedRegime ?? selectedRegime) === "Old" ? "OLD" : "NEW",
        taxOnboardingCompleted: updates.taxOnboardingCompleted !== undefined ? updates.taxOnboardingCompleted : taxOnboardingCompleted,
        financialYear: "2026-2027"
      };
      await apiClient.put("/v1/tax/profile", payload);
    } catch (err) {
      console.error("Failed to save tax profile", err);
    }
  };

  const fetchAutoDetections = React.useCallback(async () => {
    try {
      const res = await apiClient.get("/v1/tax/auto-detect");
      if (res.data?.success) {
        setAutoDetections(res.data.data.map((d: any) => ({
          id: d.transactionId,
          desc: d.description,
          amount: d.amount,
          category: d.category,
          confidence: d.confidence,
          status: "pending"
        })));
      }
    } catch (err) {
      console.error("Failed to fetch auto-detect suggestions", err);
    }
  }, []);

  const fetchDocuments = React.useCallback(async () => {
    try {
      const res = await apiClient.get("/v1/tax/documents");
      if (res.data?.success) {
        setUploadedFiles(res.data.data.map((doc: any) => ({
          id: doc.id,
          name: doc.fileName,
          size: doc.fileSize,
          type: doc.fileType,
          date: new Date(doc.uploadedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })
        })));
      }
    } catch (err) {
      console.error("Failed to fetch tax documents", err);
    }
  }, []);

  React.useEffect(() => {
    fetchTaxProfile();
    fetchAutoDetections();
    fetchDocuments();
    fetchUserDebts();
  }, [fetchTaxProfile, fetchAutoDetections, fetchDocuments, fetchUserDebts]);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const finalName = newFileName.endsWith(".pdf") ? newFileName : `${newFileName}.pdf`;
    try {
      const res = await apiClient.post("/v1/tax/documents", {
        fileName: finalName,
        fileType: "Investment Proof"
      });
      if (res.data?.success) {
        setNewFileName("");
        fetchDocuments();
      }
    } catch (err) {
      console.error("Failed to upload document", err);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await apiClient.get("/v1/tax/report/download", {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Tax_Planner_Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download tax report", err);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      const res = await apiClient.delete(`/v1/tax/documents/${docId}`);
      if (res.data?.success) {
        fetchDocuments();
      }
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  // Calculations
  const grossIncome = salary + freelance + rental + capitalGains + otherIncome;
  const standardDeduction = 75000; // New standard deduction limit in India

  // HRA Exemption Math:
  // Exemption is minimum of:
  // 1. HRA Received
  // 2. Rent Paid - 10% of Basic
  // 3. 50% of Basic (Metro) or 40% of Basic (Non-Metro)
  const calculateHraExemption = () => {
    const tenPercentBasic = hraBasic * 0.1;
    const rentMinusBasic = Math.max(hraRentPaid - tenPercentBasic, 0);
    const limitPercentage = hraIsMetro ? 0.5 : 0.4;
    const maxLimit = hraBasic * limitPercentage;
    return Math.min(hraReceived, rentMinusBasic, maxLimit);
  };

  const hraExemption = calculateHraExemption();

  // Deductions calculations under Old Regime
  const total80C = Math.min(ded80C, 150000);
  const total80D = Math.min(ded80D, 75000); // Assuming self + senior parent limits
  const total80CCD = Math.min(ded80CCD, 50000);
  const total24b = Math.min(ded24b, 200000);
  const total80G = ded80G; // Simplified 100% deduction

  const oldTotalDeductions = total80C + total80D + total80CCD + total24b + total80G + hraExemption + standardDeduction;
  const newTotalDeductions = standardDeduction; // New regime only has standard deduction

  const oldTaxableIncome = Math.max(grossIncome - oldTotalDeductions, 0);
  const newTaxableIncome = Math.max(grossIncome - newTotalDeductions, 0);

  // Indian Tax Slab Calculations (FY 2025-26 / FY 2026-27 assumptions)
  // New Regime slabs:
  // Up to 3L: Nil
  // 3L - 7L: 5% (above 3L)
  // 7L - 10L: 10% (above 7L) + 20k
  // 10L - 12L: 15% (above 10L) + 50k
  // 12L - 15L: 20% (above 12L) + 80k
  // Above 15L: 30% (above 15L) + 1.4L
  // (Tax rebate up to 7L taxable income under Section 87A)
  const calculateNewRegimeTax = (taxable: number) => {
    if (taxable <= 700000) return 0; // Tax rebate active
    let tax = 0;
    if (taxable > 1500000) {
      tax += (taxable - 1500000) * 0.3 + 140000;
    } else if (taxable > 1200000) {
      tax += (taxable - 1200000) * 0.2 + 80000;
    } else if (taxable > 1000000) {
      tax += (taxable - 1000000) * 0.15 + 50000;
    } else if (taxable > 700000) {
      tax += (taxable - 700000) * 0.1 + 20000;
    } else if (taxable > 300000) {
      tax += (taxable - 300000) * 0.05;
    }
    return Math.round(tax * 1.04); // including 4% cess
  };

  // Old Regime slabs:
  // Up to 2.5L: Nil
  // 2.5L - 5L: 5%
  // 5L - 10L: 20%
  // Above 10L: 30%
  const calculateOldRegimeTax = (taxable: number) => {
    let tax = 0;
    if (taxable > 1000000) {
      tax += (taxable - 1000000) * 0.3 + 112500;
    } else if (taxable > 500000) {
      tax += (taxable - 500000) * 0.2 + 12500;
    } else if (taxable > 250000) {
      tax += (taxable - 250000) * 0.05;
    }
    return Math.round(tax * 1.04);
  };

  const oldTax = calculateOldRegimeTax(oldTaxableIncome);
  const newTax = calculateNewRegimeTax(newTaxableIncome);
  const taxDifference = Math.abs(oldTax - newTax);
  const optimalRegime = newTax <= oldTax ? "New" : "Old";
  const estimatedSavings = taxDifference;

  const currentTaxLiability = selectedRegime === "New" ? newTax : oldTax;
  const currentTaxableIncome = selectedRegime === "New" ? newTaxableIncome : oldTaxableIncome;
  const currentTotalDeductions = selectedRegime === "New" ? newTotalDeductions : oldTotalDeductions;
  const effectiveTaxRate = Math.round((currentTaxLiability / grossIncome) * 1000) / 10;

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleAcceptDetection = (id: any, amount: number, category: string) => {
    setAutoDetections(autoDetections.map(d => d.id === id ? { ...d, status: "accepted" } : d));
    
    let updatedDed80C = ded80C;
    let updatedDed80D = ded80D;
    let updatedDed80CCD = ded80CCD;
    let updatedDed24b = ded24b;
    let updatedDed80G = ded80G;

    if (category === "80C") {
      updatedDed80C = Math.min(ded80C + amount, 150000);
      setDed80C(updatedDed80C);
    }
    if (category === "80D") {
      updatedDed80D = ded80D + amount;
      setDed80D(updatedDed80D);
    }
    if (category === "80CCD(1B)" || category === "80CCD") {
      updatedDed80CCD = Math.min(ded80CCD + amount, 50000);
      setDed80CCD(updatedDed80CCD);
    }
    if (category === "24(b)" || category === "24b") {
      updatedDed24b = Math.min(ded24b + amount, 200000);
      setDed24b(updatedDed24b);
    }
    if (category === "80G") {
      updatedDed80G = ded80G + amount;
      setDed80G(updatedDed80G);
    }

    saveTaxProfile({
      ded80C: updatedDed80C,
      ded80D: updatedDed80D,
      ded80CCD: updatedDed80CCD,
      ded24b: updatedDed24b,
      ded80G: updatedDed80G
    });
  };

  const handleRejectDetection = (id: any) => {
    setAutoDetections(autoDetections.map(d => d.id === id ? { ...d, status: "rejected" } : d));
  };

  if (taxOnboardingCompleted === false) {
    const age = calculateAge(dateOfBirth);

    return (
      <div className="relative flex min-h-[600px] items-center justify-center bg-zinc-50 dark:bg-zinc-950/20 px-4 sm:px-6 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-all">
        {/* Decorative Gradients */}
        <div className="absolute top-[-10%] right-[-10%] h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[300px] w-[300px] rounded-full bg-emerald-500/5 blur-[80px]" />

        <div className="w-full max-w-2xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-xl relative z-10 text-zinc-900 dark:text-zinc-150 my-8">
          
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-600 dark:text-blue-400">TAX PLANNER SETUP</span>
                {onboardingStep === 1 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Form 1: Personal Profile
                  </span>
                )}
              </div>
              <span>Step {onboardingStep} of 4</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${(onboardingStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* ==========================================
              Step 1: Form 1 - Tax Residency & Personal Profile
              ========================================== */}
          {onboardingStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Step 1: Tax Residency & Personal Profile (Form 1)
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Answer these essential questions to personalize tax rules, residency regulations, age benefits, and family deductions.
                </p>
              </div>

              <div className="space-y-4">
                {/* 1. Which country do you live in? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-blue-600" />
                      1. Which country do you live in?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Local tax rules
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={residenceCountry}
                      onChange={(e) => setResidenceCountry(e.target.value)}
                      className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-xs font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Germany">Germany</option>
                      <option value="Other">Other (Custom)</option>
                    </select>
                    {residenceCountry === "Other" && (
                      <input
                        type="text"
                        placeholder="Enter country name"
                        value={customResidenceCountry}
                        onChange={(e) => setCustomResidenceCountry(e.target.value)}
                        className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-xs text-zinc-900 dark:text-zinc-100"
                      />
                    )}
                  </div>
                </div>

                {/* 2. Which country do you pay taxes in? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                      2. Which country do you pay taxes in?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Tax residency / cross-border rules
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { val: "Same as where I live", label: "Same as where I live" },
                      { val: "Another country", label: "Another country" },
                      { val: "Both", label: "Both" }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setTaxCountryType(opt.val)}
                        className={`h-9 rounded-xl text-xs font-semibold px-3 transition-all border text-center ${
                          taxCountryType === opt.val
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {(taxCountryType === "Another country" || taxCountryType === "Both") && (
                    <div className="pt-1">
                      <input
                        type="text"
                        placeholder="Specify secondary or alternate tax country"
                        value={taxCountry}
                        onChange={(e) => setTaxCountry(e.target.value)}
                        className="w-full h-9 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-xs text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  )}
                </div>

                {/* 3. What is your date of birth? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <Cake className="h-3.5 w-3.5 text-purple-600" />
                      3. What is your date of birth?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Age-based tax benefits and rules
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-xs text-zinc-900 dark:text-zinc-100"
                    />
                    {dateOfBirth && age !== null && (
                      <div className="p-2.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span className="truncate">
                          Age: <strong>{age} yrs</strong> • {age >= 80 ? "Super Senior (80+)" : age >= 60 ? "Senior Citizen (60+)" : "Standard Individual"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. What is your marital status? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-rose-500" />
                      4. What is your marital status?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Family-related tax rules
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Single", "Married", "Divorced", "Widowed"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setMaritalStatus(status)}
                        className={`h-9 rounded-xl text-xs font-semibold px-2 transition-all border text-center ${
                          maritalStatus === status
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Do you financially support anyone? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-amber-600" />
                      5. Do you financially support anyone?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Dependents & deductions
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      "No",
                      "Yes — Children",
                      "Yes — Parents",
                      "Yes — Spouse",
                      "Yes — Other"
                    ].map((dep) => (
                      <button
                        key={dep}
                        type="button"
                        onClick={() => setSupportDependents(dep)}
                        className={`h-9 rounded-xl text-xs font-semibold px-2 transition-all border text-center ${
                          supportDependents === dep
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
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

          {/* ==========================================
              Step 2: Form 2 - Income Sources & Earnings
              ========================================== */}
          {onboardingStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Step 2: Income Sources & Earnings (Form 2)
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    Form 2 / Incomes
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Answer these questions regarding how you generate revenue, multiple streams, cross-border receipts, and asset disposals.
                </p>
              </div>

              <div className="space-y-4">
                {/* 1. How do you earn your money? (Multi-select) */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <Coins className="h-3.5 w-3.5 text-emerald-600" />
                      1. How do you earn your money? (Select all that apply)
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Determines which tax rules apply
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Salary", "Business", "Freelance", "Rent", "Investments", "Pension", "Other"].map((src) => {
                      const isSelected = incomeSources.includes(src);
                      return (
                        <button
                          key={src}
                          type="button"
                          onClick={() => {
                            let updated: string[];
                            if (isSelected) {
                              updated = incomeSources.filter((s) => s !== src);
                              if (updated.length === 0) updated = ["Salary"];
                            } else {
                              updated = [...incomeSources, src];
                            }
                            setIncomeSources(updated);
                            if (updated.length > 1) {
                              setHasMultipleIncomeSources(true);
                            }
                          }}
                          className={`h-9 rounded-xl text-xs font-semibold px-3.5 transition-all border flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                          {src}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. How much money do you earn in a year? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <Calculator className="h-3.5 w-3.5 text-blue-600" />
                      2. How much money do you earn in a year?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Main basis for tax calculation
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-zinc-400">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 1500000"
                      value={annualIncome || ""}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAnnualIncome(val);
                        setSalary(val);
                      }}
                      className="w-full h-10 pl-7 pr-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-sm font-bold text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  {annualIncome > 0 && (
                    <div className="text-[11px] text-zinc-500 font-medium">
                      Estimated Monthly Inflow: <strong className="text-zinc-800 dark:text-zinc-200">{formatRupee(Math.round(annualIncome / 12))}</strong> / month
                    </div>
                  )}
                </div>

                {/* 3. Do you have more than one income source? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-indigo-600" />
                      3. Do you have more than one income source?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Combines all income for tax calculation
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Yes, I have multiple sources", val: true },
                      { label: "No, single primary source", val: false }
                    ].map((opt) => (
                      <button
                        key={String(opt.val)}
                        type="button"
                        onClick={() => setHasMultipleIncomeSources(opt.val)}
                        className={`h-9 rounded-xl text-xs font-semibold px-3 transition-all border text-center ${
                          hasMultipleIncomeSources === opt.val
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Do you earn money from another country? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-teal-600" />
                      4. Do you earn money from another country?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Foreign income & DTAA tax rules
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Yes (Foreign Inflow / DTAA)", val: true },
                      { label: "No (Domestic only)", val: false }
                    ].map((opt) => (
                      <button
                        key={String(opt.val)}
                        type="button"
                        onClick={() => setHasForeignIncome(opt.val)}
                        className={`h-9 rounded-xl text-xs font-semibold px-3 transition-all border text-center ${
                          hasForeignIncome === opt.val
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Did you sell any investments, property, or other assets this year? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-rose-500" />
                      5. Did you sell any investments, property, or other assets this year?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Capital gains / loss offsets
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Yes (Stocks, Real Estate, Crypto)", val: true },
                      { label: "No asset sales", val: false }
                    ].map((opt) => (
                      <button
                        key={String(opt.val)}
                        type="button"
                        onClick={() => {
                          setHasSoldAssets(opt.val);
                          if (!opt.val) setCapitalGains(0);
                        }}
                        className={`h-9 rounded-xl text-xs font-semibold px-3 transition-all border text-center ${
                          hasSoldAssets === opt.val
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {hasSoldAssets && (
                    <div className="pt-1">
                      <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Estimated net Capital Gains (optional):</label>
                      <input
                        type="number"
                        placeholder="e.g. 100000"
                        value={capitalGains || ""}
                        onChange={(e) => setCapitalGains(Number(e.target.value))}
                        className="w-full h-9 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-xs text-zinc-900 dark:text-zinc-100 font-semibold"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              Step 3: Form 3 - Deductions & Financial Commitments
              ========================================== */}
          {onboardingStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-purple-600" />
                    Step 3: Deductions & Commitments (Form 3)
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    Form 3 / Deductions
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Identify your rent, active debts, insurance, and investments to maximize your tax deductions and exemptions.
                </p>
              </div>

              <div className="space-y-4">
                {/* 1. Do you pay rent? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <Home className="h-3.5 w-3.5 text-blue-600" />
                      1. Do you pay rent?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Possible housing/rent tax benefits
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Yes, I pay rent", val: true },
                      { label: "No, own house / no rent", val: false }
                    ].map((opt) => (
                      <button
                        key={String(opt.val)}
                        type="button"
                        onClick={() => {
                          setPaysRent(opt.val);
                          if (!opt.val) setHraRentPaid(0);
                        }}
                        className={`h-9 rounded-xl text-xs font-semibold px-3 transition-all border text-center ${
                          paysRent === opt.val
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {paysRent && (
                    <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Annual Rent Paid:</label>
                        <input
                          type="number"
                          placeholder="e.g. 180000"
                          value={hraRentPaid || ""}
                          onChange={(e) => setHraRentPaid(Number(e.target.value))}
                          className="w-full h-9 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-xs font-semibold text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div className="flex items-end pb-1 text-[11px] text-zinc-500">
                        Monthly: <strong className="ml-1 text-zinc-800 dark:text-zinc-200">{formatRupee(Math.round((hraRentPaid || 0) / 12))}/mo</strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Do you have a home loan? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <Home className="h-3.5 w-3.5 text-indigo-600" />
                      2. Do you have a home loan?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Possible home-loan tax benefits
                    </span>
                  </div>

                  {detectedHomeLoans.length > 0 && (
                    <div className="p-2.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Auto-detected from Debts:</strong> {detectedHomeLoans[0].name} ({formatRupee(detectedHomeLoans[0].outstanding || detectedHomeLoans[0].principal)})
                        </span>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                        Debt Table Synced
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Yes, I have an active home loan", val: true },
                      { label: "No home loan", val: false }
                    ].map((opt) => (
                      <button
                        key={String(opt.val)}
                        type="button"
                        onClick={() => {
                          setHasHomeLoan(opt.val);
                          if (!opt.val) setDed24b(0);
                        }}
                        className={`h-9 rounded-xl text-xs font-semibold px-3 transition-all border text-center ${
                          hasHomeLoan === opt.val
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {hasHomeLoan && (
                    <div className="pt-1">
                      <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Annual Interest deduction under Sec 24(b) (Max ₹2,00,000):</label>
                      <input
                        type="number"
                        placeholder="e.g. 150000"
                        value={ded24b || ""}
                        onChange={(e) => setDed24b(Number(e.target.value))}
                        className="w-full h-9 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-xs font-semibold text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Do you pay for health insurance? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <ShieldPlus className="h-3.5 w-3.5 text-rose-500" />
                      3. Do you pay for health insurance?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Possible health-related tax benefits (Section 80D)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Yes, I pay health insurance premiums", val: true },
                      { label: "No health insurance", val: false }
                    ].map((opt) => (
                      <button
                        key={String(opt.val)}
                        type="button"
                        onClick={() => {
                          setPaysHealthInsurance(opt.val);
                          if (!opt.val) setDed80D(0);
                        }}
                        className={`h-9 rounded-xl text-xs font-semibold px-3 transition-all border text-center ${
                          paysHealthInsurance === opt.val
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {paysHealthInsurance && (
                    <div className="pt-1">
                      <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Annual Health Insurance Premiums under Sec 80D (Self & Parents):</label>
                      <input
                        type="number"
                        placeholder="e.g. 25000"
                        value={ded80D || ""}
                        onChange={(e) => setDed80D(Number(e.target.value))}
                        className="w-full h-9 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-xs font-semibold text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  )}
                </div>

                {/* 4. Do you invest or save money? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <PiggyBank className="h-3.5 w-3.5 text-emerald-600" />
                      4. Do you invest or save money?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Finds tax-saving opportunities (Section 80C & NPS)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Yes (PPF, EPF, ELSS, NPS, Life Insurance)", val: true },
                      { label: "No savings / investments", val: false }
                    ].map((opt) => (
                      <button
                        key={String(opt.val)}
                        type="button"
                        onClick={() => {
                          setInvestsOrSaves(opt.val);
                          if (!opt.val) {
                            setDed80C(0);
                            setDed80CCD(0);
                          }
                        }}
                        className={`h-9 rounded-xl text-xs font-semibold px-3 transition-all border text-center ${
                          investsOrSaves === opt.val
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {investsOrSaves && (
                    <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Section 80C (PPF, ELSS, EPF, LIC - Max ₹1.5L):</label>
                        <input
                          type="number"
                          placeholder="e.g. 150000"
                          value={ded80C || ""}
                          onChange={(e) => setDed80C(Number(e.target.value))}
                          className="w-full h-9 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-xs font-semibold text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-zinc-500 mb-1 block">Section 80CCD(1B) (NPS - Max ₹50,000):</label>
                        <input
                          type="number"
                          placeholder="e.g. 50000"
                          value={ded80CCD || ""}
                          onChange={(e) => setDed80CCD(Number(e.target.value))}
                          className="w-full h-9 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-xs font-semibold text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Do you pay for education or an education loan? */}
                <div className="bg-zinc-50/70 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-amber-600" />
                      5. Do you pay for education or an education loan?
                    </label>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
                      Why it matters: Possible education-related benefits (Sec 80E interest deduction)
                    </span>
                  </div>

                  {detectedEduLoans.length > 0 && (
                    <div className="p-2.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Auto-detected from Debts:</strong> {detectedEduLoans[0].name} ({formatRupee(detectedEduLoans[0].outstanding || detectedEduLoans[0].principal)})
                        </span>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                        Debt Table Synced
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Yes, active education loan / tuition fees", val: true },
                      { label: "No education loan", val: false }
                    ].map((opt) => (
                      <button
                        key={String(opt.val)}
                        type="button"
                        onClick={() => setPaysEducationLoan(opt.val)}
                        className={`h-9 rounded-xl text-xs font-semibold px-3 transition-all border text-center ${
                          paysEducationLoan === opt.val
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              Step 4: HRA & Regime Preference
              ========================================== */}
          {onboardingStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Step 4: HRA & Preferred Regime</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Configure your rent details for HRA exemption and select your preferred tax regime.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">HRA Basic Salary (Per Annum)</label>
                  <input
                    type="number"
                    value={hraBasic}
                    onChange={(e) => setHraBasic(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-sm text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">HRA Allowance Received</label>
                  <input
                    type="number"
                    value={hraReceived}
                    onChange={(e) => setHraReceived(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-sm text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Actual Rent Paid (Per Annum)</label>
                  <input
                    type="number"
                    value={hraRentPaid}
                    onChange={(e) => setHraRentPaid(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-sm text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="flex flex-col justify-center space-y-1.5">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Rented Location Type</span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setHraIsMetro(true)}
                      className={`flex-1 h-10 rounded-xl text-xs font-bold transition-all border bg-white dark:bg-zinc-900 ${
                        hraIsMetro 
                          ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      Metro City
                    </button>
                    <button
                      type="button"
                      onClick={() => setHraIsMetro(false)}
                      className={`flex-1 h-10 rounded-xl text-xs font-bold transition-all border bg-white dark:bg-zinc-900 ${
                        !hraIsMetro 
                          ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      Non-Metro City
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1 block">Preferred Regime Choice</span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedRegime("Old")}
                      className={`flex-1 h-11 rounded-xl text-xs font-black tracking-wide transition-all border bg-white dark:bg-zinc-900 ${
                        selectedRegime === "Old"
                          ? "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/10"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      Old Tax Regime
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRegime("New")}
                      className={`flex-1 h-11 rounded-xl text-xs font-black tracking-wide transition-all border bg-white dark:bg-zinc-900 ${
                        selectedRegime === "New"
                          ? "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/10"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      New Tax Regime
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center border-t border-zinc-150 dark:border-zinc-800 mt-8 pt-6">
            <Button
              type="button"
              disabled={onboardingStep === 1}
              onClick={() => setOnboardingStep((prev) => prev - 1)}
              variant="outline"
              className="h-10 px-5 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all font-bold disabled:opacity-40 bg-white dark:bg-zinc-900"
            >
              Back
            </Button>

            {onboardingStep < 4 ? (
              <Button
                type="button"
                onClick={async () => {
                  await saveTaxProfile({});
                  setOnboardingStep((prev) => prev + 1);
                }}
                className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={async () => {
                  await saveTaxProfile({ taxOnboardingCompleted: true });
                  setTaxOnboardingCompleted(true);
                }}
                className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-lg shadow-blue-500/10 active:scale-[0.99] flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4.5 w-4.5" />
                Save & Finish
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentAge = calculateAge(dateOfBirth);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950">Tax Planner & Filing</h2>
          <p className="text-sm text-zinc-500 mt-1">Optimize your taxable yield assumptions, verify auto tax sections, and file Indian ITR returns.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setOnboardingStep(1);
              setTaxOnboardingCompleted(false);
            }}
            className="h-10 px-3.5 border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:bg-zinc-50 rounded-xl font-semibold transition-all flex items-center gap-1.5"
          >
            <Edit3 className="h-4 w-4 text-blue-600" />
            Edit Profile (Form 1)
          </Button>
          <Button onClick={handleDownloadReport} className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm font-semibold transition-all active:scale-[0.98]">
            <Download className="h-4 w-4 mr-1.5" />
            Download Tax Report PDF
          </Button>
        </div>
      </div>

      {/* ==========================================
          0. Form 1, Form 2 & Form 3 Summary Banners
          ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form 1 Card */}
        <div className="rounded-2xl border border-blue-150/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900">Personal & Residency</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Form 1</span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">Residency & age bracket</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setOnboardingStep(1);
                setTaxOnboardingCompleted(false);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 h-7 px-2 rounded-lg"
            >
              Edit →
            </Button>
          </div>

          <div className="space-y-1.5 mt-4 pt-3 border-t border-blue-100/70 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Country:</span>
              <span className="font-bold text-zinc-900 truncate max-w-[140px]">{residenceCountry === "Other" && customResidenceCountry ? customResidenceCountry : residenceCountry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Tax Jurisdiction:</span>
              <span className="font-bold text-zinc-900 truncate max-w-[140px]">{taxCountryType === "Same as where I live" ? residenceCountry : `${taxCountryType} (${taxCountry})`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Age & Status:</span>
              <span className="font-bold text-zinc-900">{currentAge !== null ? `${currentAge}y` : "N/A"} • {maritalStatus}</span>
            </div>
          </div>
        </div>

        {/* Form 2 Card */}
        <div className="rounded-2xl border border-emerald-150/80 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900">Income Sources</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Form 2</span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">Earnings & multiple streams</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setOnboardingStep(2);
                setTaxOnboardingCompleted(false);
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/80 h-7 px-2 rounded-lg"
            >
              Edit →
            </Button>
          </div>

          <div className="space-y-1.5 mt-4 pt-3 border-t border-emerald-100/70 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Sources:</span>
              <span className="font-bold text-zinc-900 truncate max-w-[140px]">{incomeSources.join(", ") || "Salary"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Annual Total:</span>
              <span className="font-bold text-zinc-900">{formatRupee(annualIncome || grossIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Foreign / Assets:</span>
              <span className="font-bold text-zinc-900">
                {hasForeignIncome ? "Foreign" : "Domestic"} • {hasSoldAssets ? "Asset Sales" : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Form 3 Card */}
        <div className="rounded-2xl border border-purple-150/80 bg-gradient-to-r from-purple-50/70 via-fuchsia-50/40 to-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900">Deductions & Loans</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">Form 3</span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">Rent, debts, and savings</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setOnboardingStep(3);
                setTaxOnboardingCompleted(false);
              }}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 hover:bg-purple-50/80 h-7 px-2 rounded-lg"
            >
              Edit →
            </Button>
          </div>

          <div className="space-y-1.5 mt-4 pt-3 border-t border-purple-100/70 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Rent Paid:</span>
              <span className="font-bold text-zinc-900">{paysRent ? formatRupee(hraRentPaid) : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Active Loans:</span>
              <span className="font-bold text-zinc-900">
                {hasHomeLoan ? "Home Loan" : ""}{hasHomeLoan && paysEducationLoan ? " & " : ""}{paysEducationLoan ? "Edu Loan" : ""}{!hasHomeLoan && !paysEducationLoan ? "None" : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Insurance & 80C:</span>
              <span className="font-bold text-zinc-900">
                {paysHealthInsurance ? "Health Ins." : "No Ins."} • {investsOrSaves ? "Investments" : "No 80C"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Rounded Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ==========================================
            1. Tax Regime Comparison (Hero Card - 12 Columns)
            ========================================== */}
        <div className="lg:col-span-12 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">Tax Regime Comparison</h3>
                <p className="text-xs text-zinc-500">Compare tax payable under Old vs New taxation rules</p>
              </div>
            </div>
            {/* Toggle controls */}
            <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl">
              <button
                onClick={() => { setSelectedRegime("Old"); saveTaxProfile({ selectedRegime: "Old" }); }}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  selectedRegime === "Old" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Old Regime
              </button>
              <button
                onClick={() => { setSelectedRegime("New"); saveTaxProfile({ selectedRegime: "New" }); }}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  selectedRegime === "New" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                New Regime (Default)
              </button>
            </div>
          </div>

          {/* AI Banner recommendation */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50/70 to-teal-50/50 p-4 border border-emerald-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-emerald-950">AI Smart Regime Recommendation</h4>
                <p className="text-xs text-emerald-850 mt-0.5 leading-relaxed">
                  Based on your taxable gross income of {formatRupee(grossIncome)} and total deductions of {formatRupee(oldTotalDeductions)}, the <span className="font-bold underline">{optimalRegime} Tax Regime</span> is optimal for you, saving you <span className="font-bold">{formatRupee(estimatedSavings)}</span> annually.
                </p>
              </div>
            </div>
            <div className="text-left md:text-right shrink-0">
              <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider block">Estimated Tax Savings</span>
              <span className="text-xl font-black text-emerald-700 block mt-0.5">{formatRupee(estimatedSavings)}</span>
            </div>
          </div>

          {/* Side by side comparison visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Old Regime Card */}
            <div className={`rounded-xl border p-5 relative overflow-hidden transition-all ${
              optimalRegime === "Old" ? "border-emerald-500 bg-emerald-500/[0.02]" : "border-zinc-200 bg-zinc-50/20"
            }`}>
              {optimalRegime === "Old" && (
                <div className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider">Recommended</div>
              )}
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Old Regime Tax Details</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">Allows 80C, 80D, HRA & home interest deductions</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <span className="text-zinc-500">Gross Income:</span>
                  <p className="font-bold text-zinc-900 mt-0.5">{formatRupee(grossIncome)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Deductions Applied:</span>
                  <p className="font-bold text-blue-600 mt-0.5">-{formatRupee(oldTotalDeductions)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Taxable Base:</span>
                  <p className="font-bold text-zinc-900 mt-0.5">{formatRupee(oldTaxableIncome)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Net Tax Payable:</span>
                  <p className="font-bold text-zinc-900 mt-0.5">{formatRupee(oldTax)}</p>
                </div>
              </div>
            </div>

            {/* New Regime Card */}
            <div className={`rounded-xl border p-5 relative overflow-hidden transition-all ${
              optimalRegime === "New" ? "border-emerald-500 bg-emerald-500/[0.02]" : "border-zinc-200 bg-zinc-50/20"
            }`}>
              {optimalRegime === "New" && (
                <div className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider">Recommended</div>
              )}
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">New Regime Tax Details</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">Flat tax slabs with standard rebate of ₹7.5L</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <span className="text-zinc-500">Gross Income:</span>
                  <p className="font-bold text-zinc-900 mt-0.5">{formatRupee(grossIncome)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Standard Deduction:</span>
                  <p className="font-bold text-blue-600 mt-0.5">-{formatRupee(newTotalDeductions)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Taxable Base:</span>
                  <p className="font-bold text-zinc-900 mt-0.5">{formatRupee(newTaxableIncome)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Net Tax Payable:</span>
                  <p className="font-bold text-zinc-900 mt-0.5">{formatRupee(newTax)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            2. Income Summary Card (6 Columns)
            ========================================== */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-5">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="flex gap-2">
              <button className="text-xs text-zinc-400 font-semibold hover:text-zinc-600 transition-colors">+ Add Income</button>
              <span className="text-zinc-200">|</span>
              <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center">
                Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-900">Income Summary</h3>
            <p className="text-xs text-zinc-500">Track and compile all taxable income streams</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-100 font-semibold text-zinc-800">
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">Gross Income</span>
              <span className="text-lg font-bold text-zinc-900 mt-0.5">{formatRupee(grossIncome)}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">Net Taxable Income</span>
              <span className="text-lg font-bold text-zinc-900 mt-0.5">{formatRupee(currentTaxableIncome)}</span>
            </div>
          </div>

          {/* Details list inputs */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-semibold">Salary Income:</span>
              <input
                type="number"
                value={salary}
                step="50000"
                onChange={(e) => setSalary(Number(e.target.value))}
                onBlur={() => saveTaxProfile({ salary })}
                className="w-32 h-7 text-right rounded border border-zinc-200 bg-transparent px-2 font-bold text-zinc-900"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-semibold">Freelance Income:</span>
              <input
                type="number"
                value={freelance}
                step="10000"
                onChange={(e) => setFreelance(Number(e.target.value))}
                onBlur={() => saveTaxProfile({ freelance })}
                className="w-32 h-7 text-right rounded border border-zinc-200 bg-transparent px-2 font-bold text-zinc-900"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-semibold">Rental Yield:</span>
              <input
                type="number"
                value={rental}
                step="5000"
                onChange={(e) => setRental(Number(e.target.value))}
                onBlur={() => saveTaxProfile({ rental })}
                className="w-32 h-7 text-right rounded border border-zinc-200 bg-transparent px-2 font-bold text-zinc-900"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-semibold">Capital Gains:</span>
              <input
                type="number"
                value={capitalGains}
                step="5000"
                onChange={(e) => setCapitalGains(Number(e.target.value))}
                onBlur={() => saveTaxProfile({ capitalGains })}
                className="w-32 h-7 text-right rounded border border-zinc-200 bg-transparent px-2 font-bold text-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* ==========================================
            3. Tax Deductions Tracker Card (6 Columns)
            ========================================== */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-5">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Percent className="h-5 w-5" />
            </div>
            <span className="text-xs text-blue-600 font-bold">Old Regime Deductions Tracker</span>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-900">Deductions Tracker</h3>
            <p className="text-xs text-zinc-500 font-medium">Verify your investments limits and exemption allocations</p>
          </div>

          {/* Section details */}
          <div className="space-y-4 text-xs overflow-y-auto max-h-80 pr-1">
            {/* Section 80C */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span>Section 80C (PPF, ELSS, Insurance)</span>
                <span className="text-zinc-500">{formatRupee(total80C)} / {formatRupee(150000)} Limit</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${(total80C / 150000) * 100}%` }} />
              </div>
            </div>

            {/* Section 80D */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span>Section 80D (Health Insurance Premium)</span>
                <span className="text-zinc-500">{formatRupee(total80D)} / {formatRupee(75000)} Limit</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${(total80D / 75000) * 100}%` }} />
              </div>
            </div>

            {/* Section 80CCD */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span>Section 80CCD(1B) (NPS Extra)</span>
                <span className="text-zinc-500">{formatRupee(total80CCD)} / {formatRupee(50000)} Limit</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${(total80CCD / 50000) * 100}%` }} />
              </div>
            </div>

            {/* Section 24b */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span>Section 24(b) (Home Mortgage Interest)</span>
                <span className="text-zinc-500">{formatRupee(total24b)} / {formatRupee(200000)} Limit</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${(total24b / 200000) * 100}%` }} />
              </div>
            </div>

            {/* HRA Exemption Calculator */}
            <div className="rounded-xl border border-zinc-150 bg-zinc-50 p-4.5 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200/65">
                <span className="font-bold text-zinc-800">HRA Exemption Calculator</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Exempt: {formatRupee(hraExemption)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-zinc-600">
                <div className="space-y-1">
                  <span>Basic Salary:</span>
                  <input
                    type="number"
                    value={hraBasic}
                    onChange={(e) => setHraBasic(Number(e.target.value))}
                    onBlur={() => saveTaxProfile({ hraBasic })}
                    className="w-full h-7 rounded border border-zinc-200 bg-white px-2 text-zinc-900"
                  />
                </div>
                <div className="space-y-1">
                  <span>HRA Component:</span>
                  <input
                    type="number"
                    value={hraReceived}
                    onChange={(e) => setHraReceived(Number(e.target.value))}
                    onBlur={() => saveTaxProfile({ hraReceived })}
                    className="w-full h-7 rounded border border-zinc-200 bg-white px-2 text-zinc-900"
                  />
                </div>
                <div className="space-y-1">
                  <span>Annual Rent Paid:</span>
                  <input
                    type="number"
                    value={hraRentPaid}
                    onChange={(e) => setHraRentPaid(Number(e.target.value))}
                    onBlur={() => saveTaxProfile({ hraRentPaid })}
                    className="w-full h-7 rounded border border-zinc-200 bg-white px-2 text-zinc-900"
                  />
                </div>
                <div className="space-y-1 flex flex-col justify-end">
                  <label className="flex items-center gap-1.5 cursor-pointer pb-1">
                    <input
                      type="checkbox"
                      checked={hraIsMetro}
                      onChange={(e) => { setHraIsMetro(e.target.checked); saveTaxProfile({ hraIsMetro: e.target.checked }); }}
                      className="rounded border-zinc-200 text-blue-600 h-3.5 w-3.5"
                    />
                    <span>Lives in Metro City</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            4. AI Tax Optimizer Card (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-sm">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">AI Tax Optimizer</h3>
              <p className="text-xs text-zinc-500">Personalized optimization checks</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-blue-50/50 border border-blue-100/50 rounded-xl relative">
              <span className="absolute top-2 right-2 bg-blue-600 text-white rounded-full px-1.5 py-0.5 text-[8px] font-bold">Priority: High</span>
              <p className="font-bold text-blue-950">Maximize Section 80C</p>
              <p className="text-[11px] text-zinc-600 mt-1 leading-normal">
                Invest ₹30,000 more in ELSS funds to fully utilize the ₹1.5L Section 80C threshold. Savings: <span className="font-bold text-emerald-600">₹9,000</span>.
              </p>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl relative">
              <span className="absolute top-2 right-2 bg-zinc-500 text-white rounded-full px-1.5 py-0.5 text-[8px] font-bold">Priority: Med</span>
              <p className="font-bold text-zinc-900">Optimize Section 80CCD</p>
              <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
                Contribute ₹20,000 more to National Pension System (NPS) to exhaust the ₹50,000 deduction. Savings: <span className="font-bold text-emerald-600">₹6,200</span>.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            5. Auto Tax Detection Card (8 Columns)
            ========================================== */}
        <div className="lg:col-span-8 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">Auto Tax Detection</h3>
                <p className="text-xs text-zinc-500">Classify transaction statements into eligible sections</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase bg-zinc-50 px-2 py-0.5 rounded">Statement Sync: Active</span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="px-4 py-2.5">Transaction Detail</th>
                  <th className="px-4 py-2.5">Amount</th>
                  <th className="px-4 py-2.5">Suggested Section</th>
                  <th className="px-4 py-2.5">Confidence</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {autoDetections.map((d) => (
                  <tr key={d.id} className="hover:bg-zinc-50/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-zinc-900">{d.desc}</td>
                    <td className="px-4 py-3 font-semibold text-zinc-800">{formatRupee(d.amount)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">{d.category}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{d.confidence}%</td>
                    <td className="px-4 py-3 text-right">
                      {d.status === "pending" ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleAcceptDetection(d.id, d.amount, d.category)}
                            className="h-6 w-6 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors"
                            title="Accept Category"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleRejectDetection(d.id)}
                            className="h-6 w-6 rounded bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                            title="Reject Category"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-bold ${d.status === 'accepted' ? 'text-emerald-600' : 'text-red-500'}`}>
                          {d.status === 'accepted' ? 'Accepted' : 'Rejected'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==========================================
            6. Tax Calendar (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Tax Calendar</h3>
              <p className="text-xs text-zinc-500">Upcoming deadlines and proof limits</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex flex-col items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                <span>15</span>
                <span>SEP</span>
              </div>
              <div>
                <h4 className="font-bold text-zinc-800">Advance Tax Installment Q2</h4>
                <p className="text-[10px] text-zinc-500">Pay 30% of estimated annual taxes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex flex-col items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                <span>31</span>
                <span>DEC</span>
              </div>
              <div>
                <h4 className="font-bold text-zinc-800">Investment Proof Submission</h4>
                <p className="text-[10px] text-zinc-500 font-medium">Upload ELSS/PPF slips to company HR portal</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex flex-col items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                <span>31</span>
                <span>MAR</span>
              </div>
              <div>
                <h4 className="font-bold text-zinc-800">Tax Saving Deadline</h4>
                <p className="text-[10px] text-zinc-500">Last day to invest for FY25-26 deductions</p>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            7. Tax Filing Readiness Card (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Filing Readiness</h3>
              <p className="text-xs text-zinc-500">Verify ITR filing preparation checkpoints</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-800 mb-1.5">
                <span>Pre-filing Checklist Progress</span>
                <span className="text-emerald-600 font-bold">85% Ready</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "85%" }} />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-zinc-700">PAN & Aadhaar linked verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-zinc-700">AIS & Form 26AS matching logs verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-zinc-700">Bank account validation active</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-zinc-500">Form 16 upload pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            8. Documents Vault Card (4 Columns)
            ========================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FolderLock className="h-5 w-5" />
            </div>
            <button onClick={handleDownloadReport} className="text-xs text-blue-600 font-bold hover:underline">Download Report</button>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-900">Documents Vault</h3>
            <p className="text-xs text-zinc-500">Securely store investments receipts & tax certificates</p>
          </div>

          {/* Simple file uploader input */}
          <form onSubmit={handleFileUpload} className="flex gap-2">
            <input
              type="text"
              placeholder="Upload file name..."
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="flex-1 h-8 rounded border border-zinc-200 bg-zinc-50/50 px-2 text-xs outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="h-8 bg-blue-600 hover:bg-blue-700 text-white rounded px-3 text-xs font-semibold transition-colors"
            >
              Upload
            </button>
          </form>

          {/* Files List */}
          <div className="space-y-2 text-xs">
            {uploadedFiles.map((file, idx) => (
              <div key={file.id || idx} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                <div className="min-w-0">
                  <p className="font-bold text-zinc-900 truncate">{file.name}</p>
                  <span className="text-[9px] text-zinc-400">{file.type} • {file.size}</span>
                </div>
                <button onClick={() => handleDeleteDocument(file.id)} className="text-zinc-400 hover:text-red-500 transition-colors" title="Delete file">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            9. Tax Summary Dashboard Card (12 Columns)
            ========================================== */}
        <div className="lg:col-span-12 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-zinc-900 mb-6">Tax Summary Dashboard</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Table metrics */}
            <div className="lg:col-span-2 space-y-4 text-xs font-semibold text-zinc-800">
              <div className="flex justify-between p-2.5 rounded-lg bg-zinc-50">
                <span className="text-zinc-500">Gross Income:</span>
                <span>{formatRupee(grossIncome)}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-zinc-50">
                <span className="text-zinc-500">Applied Regime Deductions:</span>
                <span className="text-blue-600">-{formatRupee(currentTotalDeductions)}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-zinc-50">
                <span className="text-zinc-500">Net Taxable base:</span>
                <span>{formatRupee(currentTaxableIncome)}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-emerald-50 text-emerald-950">
                <span className="text-emerald-700">Estimated Annual Tax Liability:</span>
                <span className="font-black text-emerald-800">{formatRupee(currentTaxLiability)}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-zinc-50">
                <span className="text-zinc-500">Effective Tax Rate:</span>
                <span>{effectiveTaxRate}%</span>
              </div>
            </div>

            {/* SVG mini summary donut chart representation */}
            <div className="flex flex-col items-center justify-center space-y-4 bg-zinc-50 rounded-xl p-4 border border-zinc-100">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Effective Tax Breakdowns</span>
              <div className="relative h-28 w-28 flex items-center justify-center">
                {/* SVG circular slice */}
                <svg className="h-full w-full transform -rotate-90">
                  <circle cx="56" cy="56" r="46" className="stroke-emerald-500" strokeWidth="12" fill="transparent" strokeDasharray="289" strokeDashoffset="120" />
                  <circle cx="56" cy="56" r="46" className="stroke-blue-600" strokeWidth="12" fill="transparent" strokeDasharray="289" strokeDashoffset="169" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xs text-zinc-400 font-semibold">Regime</span>
                  <span className="text-sm font-black text-zinc-800">{selectedRegime}</span>
                </div>
              </div>
              <div className="flex gap-4 text-[9px] font-bold text-zinc-400">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-600" /> Tax Paid</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Net Savings</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
