"use client";

import * as React from "react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  X,
  Plus,
  FileText,
  MessageSquare,
  Mail,
  ChevronLeft,
  Calendar,
  Sparkles,
  Upload,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Shield,
  Trash2,
  HelpCircle,
  FileDown,
  RefreshCw,
  Wallet,
  Tag,
  MapPin,
  RefreshCcw,
  Check,
  Split,
  Eye,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

interface TransactionOnboardingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newTransactions: any[]) => void;
  initialMode: "manual" | "import" | null;
}

// Transaction Category Lists
const EXPENSE_CATEGORIES = [
  "Food & Dining", "Groceries", "Shopping", "Fuel", "Transportation",
  "Utilities", "Rent", "EMI", "Healthcare", "Insurance",
  "Education", "Entertainment", "Travel", "Investments",
  "Taxes", "Donations", "Miscellaneous"
];

const INCOME_CATEGORIES = [
  "Salary", "Bonus", "Business", "Freelance", "Rental Income",
  "Dividend", "Interest", "Capital Gains", "Pension",
  "Gift", "Refund", "Cashback", "Other Income"
];

const MOCK_ACCOUNTS = [
  "Chase checking (*4829)", "Amex Gold (*1002)", "Chase Sapphire (*9930)",
  "Capital One Wallet", "Cash / Petty Cash"
];

const PAYMENT_METHODS = [
  "Credit Card", "Debit Card", "UPI / Instant Pay", "Net Banking", "Cash"
];

// Helper to generate mock transaction items for parsing simulations
const getMockSMSAlerts = () => [
  { id: "sms_1", date: "2026-07-10", amount: 45.80, merchant: "Starbucks Coffee", category: "Food & Dining", raw: "Txn on debit card *9182 for USD 45.80 at STARBUCKS. Avl Bal: USD 3,420.50.", type: "expense", account: "Chase checking (*4829)", method: "Debit Card" },
  { id: "sms_2", date: "2026-07-09", amount: 120.00, merchant: "Chevron Gas", category: "Fuel", raw: "Alert: USD 120.00 spent on Card *1002 at CHEVRON. Limit available: USD 8,500.", type: "expense", account: "Amex Gold (*1002)", method: "Credit Card" },
  { id: "sms_3", date: "2026-07-08", amount: 2500.00, merchant: "FinOne Payroll", category: "Salary", raw: "Your A/C *4829 has been credited with USD 2,500.00 towards SALARY on 08-Jul-26.", type: "income", account: "Chase checking (*4829)", method: "Net Banking" },
  { id: "sms_4", date: "2026-07-08", amount: 15.00, merchant: "Spotify Premium", category: "Entertainment", raw: "VPA Auto Debit: Spotify Premium USD 15.00 from A/C *4829.", type: "expense", account: "Chase checking (*4829)", method: "UPI / Instant Pay", isDuplicate: true }, // will trigger duplicate warning
];

const getMockGmailAlerts = () => [
  { id: "gmail_1", date: "2026-07-10", amount: 89.90, merchant: "Amazon Inc", category: "Shopping", subject: "Your Amazon order confirmation - #114-82901", type: "expense", account: "Chase Sapphire (*9930)", method: "Credit Card" },
  { id: "gmail_2", date: "2026-07-08", amount: 24.50, merchant: "Uber Eats", category: "Food & Dining", subject: "Your receipt from Uber Eats order", type: "expense", account: "Chase Sapphire (*9930)", method: "Credit Card" },
  { id: "gmail_3", date: "2026-07-07", amount: 65.00, merchant: "Shell Gas Station", category: "Fuel", subject: "Shell Receipt for pumps transactions", type: "expense", account: "Cash / Petty Cash", method: "Cash" },
  { id: "gmail_4", date: "2026-07-05", amount: 14.99, merchant: "Netflix.com", category: "Entertainment", subject: "Netflix Subscription Renewal Invoice", type: "expense", account: "Amex Gold (*1002)", method: "Credit Card", isDuplicate: true },
];

export default function TransactionOnboardingDrawer({
  isOpen,
  onClose,
  onImport,
  initialMode
}: TransactionOnboardingDrawerProps) {
  const { dbUser } = useAuth();
  const [backendCategories, setBackendCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (isOpen && dbUser) {
      apiClient.get(`/v1/category/users/${dbUser.userId}`)
        .then(res => {
          if (res.data && res.data.success) {
            setBackendCategories(res.data.data);
          }
        })
        .catch(err => console.error("Failed to load categories in drawer", err));
    }
  }, [isOpen, dbUser]);

  const expenseCategories = React.useMemo(() => {
    const list = backendCategories.filter(c => c.type === "EXPENSE").map(c => c.name);
    return list.length > 0 ? list : EXPENSE_CATEGORIES;
  }, [backendCategories]);

  const incomeCategories = React.useMemo(() => {
    const list = backendCategories.filter(c => c.type === "INCOME").map(c => c.name);
    return list.length > 0 ? list : INCOME_CATEGORIES;
  }, [backendCategories]);

  // Steps: 1 = Selector, 2 = Connection / Inputs, 3 = Column Mapping (Files Only), 4 = Preview, 5 = Summary
  const [step, setStep] = React.useState(1);
  const [importMethod, setImportMethod] = React.useState<"manual" | "file" | "sms" | "gmail" | null>(null);

  // Help Article Modals
  const [showSMSHelp, setShowSMSHelp] = React.useState(false);
  const [showGmailHelp, setShowGmailHelp] = React.useState(false);

  // Simulated state for UI actions
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileHeaders, setFileHeaders] = React.useState<string[]>([]);
  const [mappings, setMappings] = React.useState<Record<string, string>>({
    date: "",
    amount: "",
    category: "",
    merchant: "",
    description: ""
  });

  // OCR state
  const [ocrLoading, setOcrLoading] = React.useState(false);
  const [ocrSuccess, setOcrSuccess] = React.useState(false);

  // Connect integration loadings
  const [connectLoading, setConnectLoading] = React.useState(false);

  // Poll / Sync states
  const [syncStatus, setSyncStatus] = React.useState<string>("PROCESSING");
  const [pollInterval, setPollInterval] = React.useState<any>(null);

  React.useEffect(() => {
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [pollInterval]);

  const pollJobStatus = (jobId: string) => {
    setStep(4); // Go to Polling Status step
    setSyncStatus("PROCESSING");
    
    const interval = setInterval(async () => {
      try {
        const res = await apiClient.get(`/v1/imports/jobs/${jobId}/status`);
        if (res.data && res.data.success) {
          const job = res.data.data;
          if (job.status !== "PENDING" && job.status !== "PROCESSING") {
            clearInterval(interval);
            setSyncStatus(job.status);
            setSummaryMetrics({
              imported: job.processedRecords,
              skipped: job.failedRecords,
              duplicates: 0,
              failed: job.failedRecords,
              confidence: 95
            });
            setStep(5); // Transition to summary metrics screen
            onImport([]); // Refresh dashboard transactions
          }
        }
      } catch (e) {
        console.error("Failed to poll import job status", e);
        clearInterval(interval);
      }
    }, 1500);
    setPollInterval(interval);
  };

  // Parsed Transactions state inside preview screen
  const [previewTransactions, setPreviewTransactions] = React.useState<any[]>([]);

  // Summary Metrics State
  const [summaryMetrics, setSummaryMetrics] = React.useState({
    imported: 0,
    skipped: 0,
    duplicates: 0,
    failed: 0,
    confidence: 94
  });

  // Manual Form States
  const [formType, setFormType] = React.useState<"expense" | "income" | "transfer">("expense");
  const [formData, setFormData] = React.useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    category: "",
    subcategory: "",
    account: MOCK_ACCOUNTS[0],
    paymentMethod: PAYMENT_METHODS[0],
    merchant: "",
    description: "",
    tags: "",
    location: "",
    isRecurring: false,
    recurringFrequency: "Monthly",
    isSplit: false,
    splits: [{ name: "", amount: "" }]
  });

  // OCR simulation triggers
  const handleOcrSimulate = () => {
    setOcrLoading(true);
    setOcrSuccess(false);
    setTimeout(() => {
      setOcrLoading(false);
      setOcrSuccess(true);
      setFormData(prev => ({
        ...prev,
        amount: "54.20",
        merchant: "Whole Foods Market",
        category: "Groceries",
        description: "Weekly Grocery run (OCR Scanned)",
        tags: "grocery, fresh",
        location: "Whole Foods, San Francisco"
      }));
    }, 1800);
  };

  // Split transaction helper triggers
  const handleAddSplit = () => {
    setFormData(prev => ({
      ...prev,
      splits: [...prev.splits, { name: "", amount: "" }]
    }));
  };

  const handleRemoveSplit = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      splits: prev.splits.filter((_, i) => i !== idx)
    }));
  };

  const handleSplitChange = (idx: number, field: "name" | "amount", val: string) => {
    const newSplits = [...formData.splits];
    newSplits[idx][field] = val;
    setFormData(prev => ({ ...prev, splits: newSplits }));
  };

  // Keyboard Escape and mode initializer
  React.useEffect(() => {
    if (isOpen) {
      if (initialMode === "manual") {
        setImportMethod("manual");
        setStep(2);
      } else if (initialMode === "import") {
        setImportMethod(null);
        setStep(1);
      } else {
        setImportMethod(null);
        setStep(1);
      }
      // Reset simulator states
      setSelectedFile(null);
      setFileHeaders([]);
      setOcrSuccess(false);
      setOcrLoading(false);
      
      setFormData(prev => ({
        ...prev,
        category: formType === "expense" ? expenseCategories[0] || "" : incomeCategories[0] || ""
      }));
    }
  }, [isOpen, initialMode, formType, expenseCategories, incomeCategories]);

  // Handle Close
  const handleClose = () => {
    if (pollInterval) clearInterval(pollInterval);
    onClose();
  };

  // Drag & drop file handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    // Simulate reading headers
    setFileHeaders(["Txn Date", "Description", "Category", "Debit Amount", "Credit Amount", "Account Reference", "Tags"]);
    // Set default mappings
    setMappings({
      date: "Txn Date",
      amount: "Debit Amount",
      category: "Category",
      merchant: "Description",
      description: "Tags"
    });
    setStep(3); // Go to column mapping step
  };

  // Mock File Upload Parsing to Preview
  const handleMapConfirm = async () => {
    if (!selectedFile) return;
    setConnectLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Construct header-to-column mapper expected by backend
      const mappedJson = {
        [mappings.date]: "transactionDate",
        [mappings.amount]: "amount",
        [mappings.merchant]: "merchant",
        [mappings.category]: "category",
        [mappings.description]: "accountLast4"
      };

      formData.append("mapping", JSON.stringify(mappedJson));

      const res = await apiClient.post("/v1/imports/csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data && res.data.success) {
        const jobId = res.data.data.id;
        pollJobStatus(jobId);
      }
    } catch (e) {
      console.error("CSV import upload failed", e);
    } finally {
      setConnectLoading(false);
    }
  };

  // Connect SMS / Gmail flows
  const handleConnectIntegration = async (method: "sms" | "gmail") => {
    if (method === "sms") {
      setPreviewTransactions(getMockSMSAlerts());
      setStep(4);
      return;
    }

    setConnectLoading(true);
    try {
      await apiClient.post("/v1/imports/gmail/connect", {
        refreshToken: "mock_gmail_oauth_refresh_token"
      });

      const res = await apiClient.post("/v1/imports/gmail/sync");
      if (res.data && res.data.success) {
        const jobId = res.data.data.id;
        pollJobStatus(jobId);
      }
    } catch (e) {
      console.error("Gmail integration sync failed", e);
    } finally {
      setConnectLoading(false);
    }
  };

  // Change Category Inline in Preview Table
  const handlePreviewCategoryChange = (id: string, newCat: string) => {
    setPreviewTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, category: newCat, isUncategorized: false } : t))
    );
  };

  // Delete Row in Preview
  const handlePreviewDelete = (id: string) => {
    setPreviewTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Toggle Duplicate Skip
  const handleToggleDuplicate = (id: string) => {
    setPreviewTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, skip: !t.skip } : t))
    );
  };

  // Save / Confirm Imports
  const handleConfirmImport = () => {
    // Separate into imported and skipped
    const toImport: any[] = [];
    let skippedCount = 0;
    let duplicateCount = 0;

    previewTransactions.forEach(t => {
      if (t.skip || (t.isDuplicate && t.skip !== false)) {
        skippedCount++;
        if (t.isDuplicate) duplicateCount++;
      } else {
        toImport.push({
          id: t.id || "tx_" + Math.random().toString(36).substr(2, 9),
          date: t.date,
          amount: typeof t.amount === "number" ? t.amount : parseFloat(t.amount),
          category: t.category,
          merchant: t.merchant,
          description: t.raw || t.subject || `Imported via ${importMethod}`,
          type: t.type,
          account: t.account || "Chase checking (*4829)",
          paymentMethod: t.method || "Debit Card",
          tags: t.tags || []
        });
      }
    });

    setSummaryMetrics({
      imported: toImport.length,
      skipped: skippedCount,
      duplicates: duplicateCount,
      failed: 0,
      confidence: importMethod === "manual" ? 100 : Math.round(85 + Math.random() * 14)
    });

    // Notify parent
    onImport(toImport);
    setStep(5); // Go to Summary Step
  };

  // Manual Add Form submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.merchant) return;

    const selectedCat = backendCategories.find(c => c.name === formData.category);
    const categoryId = selectedCat ? selectedCat.id : null;

    apiClient.post("/v1/transaction", {
      amount: parseFloat(formData.amount),
      type: formType.toUpperCase(),
      note: formData.description || `Manual ${formType}`,
      merchant: formData.merchant,
      transactionDate: formData.date,
      tags: formData.tags || "",
      isRecurring: formData.isRecurring,
      categoryId: categoryId,
    })
    .then(res => {
      if (res.data && res.data.success) {
        onImport([]);
        setSummaryMetrics({
          imported: 1,
          skipped: 0,
          duplicates: 0,
          failed: 0,
          confidence: 100
        });
        setStep(5);
      }
    })
    .catch(err => {
      console.error("Failed to save transaction", err);
    });
  };

  // Download Sample Template CSV helper
  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Txn Date,Description,Category,Debit Amount,Credit Amount,Account Reference,Tags\n2026-07-10,Whole Foods Market,Groceries,45.50,,Chase checking (*4829),weekly\n2026-07-09,Salary Inward,Salary,,4500.00,Chase checking (*4829),payday\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "finone_transactions_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer panel */}
      <div className="relative flex flex-col h-screen w-full max-w-[540px] bg-white border-l border-zinc-200 shadow-2xl z-10 transition-transform duration-300 transform translate-x-0 animate-in slide-in-from-right overflow-hidden">
        
        {/* Sticky Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-zinc-150/70 bg-zinc-50/50">
          <div className="flex items-center gap-2">
            {step > 1 && step < 5 && (
              <button
                onClick={() => {
                  if (step === 2) {
                    setStep(1);
                    setImportMethod(null);
                  } else if (step === 3) {
                    setStep(2);
                  } else if (step === 4) {
                    setStep(importMethod === "file" ? 3 : 2);
                  }
                }}
                className="p-1 rounded-lg hover:bg-zinc-200/60 text-zinc-500 transition-colors mr-1"
                title="Go back"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <h3 className="text-sm font-black text-zinc-900 leading-none">
                {step === 5 ? "Import Summary" : importMethod === "manual" ? "Add Transaction" : "Import Transactions"}
              </h3>
              <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                {step === 1 && "Choose how you'd like to import your cash flows"}
                {step === 2 && importMethod === "manual" && "Record an income, expense, or asset transfer"}
                {step === 2 && importMethod === "file" && "Select format: CSV, Excel, OFX, or QIF"}
                {step === 2 && importMethod === "sms" && "Extract details from transaction SMS messages"}
                {step === 2 && importMethod === "gmail" && "Sync bank accounts via read-only Gmail tokens"}
                {step === 3 && "Map spreadsheet headers to system columns"}
                {step === 4 && "Review extracted entries before final submission"}
                {step === 5 && "Onboarding completed successfully"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-650 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Wizard Step Progress Bar */}
        {step < 5 && (
          <div className="h-1 w-full bg-zinc-100 flex">
            <div className={`h-full bg-blue-600 transition-all duration-300 ${
              step === 1 ? "w-1/4" : step === 2 ? "w-2/4" : step === 3 ? "w-3/4" : "w-11/12"
            }`} />
          </div>
        )}

        {/* Scrollable Container Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ==========================================
              STEP 1: SELECTOR CARDS
              ========================================== */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <h4 className="text-base font-bold text-zinc-850">Effortless Data Integration</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Consolidate income streams and expense channels using our secure manual forms or automated AI sync adapters.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Manual entry card */}
                <div
                  onClick={() => { setImportMethod("manual"); setStep(2); }}
                  className="group relative flex items-start gap-4 p-4 rounded-xl border border-zinc-200/80 bg-white hover:border-blue-500 hover:shadow-md cursor-pointer transition-all duration-200 active:scale-[0.99]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-zinc-800">Option 1 – Add Manually</span>
                      <span className="text-[10px] text-zinc-400 font-bold">Manual Entry</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Manually record single income, expense, or internal transfer transactions.
                    </p>
                    <button className="text-[10px] font-bold text-blue-600 group-hover:underline flex items-center pt-1.5">
                      Add Transaction <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>

                {/* Import File card */}
                <div
                  onClick={() => { setImportMethod("file"); setStep(2); }}
                  className="group relative flex items-start gap-4 p-4 rounded-xl border border-zinc-200/80 bg-white hover:border-blue-500 hover:shadow-md cursor-pointer transition-all duration-200 active:scale-[0.99]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-zinc-800">Option 2 – Import File</span>
                      <span className="text-[10px] text-zinc-400 font-bold">Statement</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Upload bank exports. Supported formats: CSV, Excel (.xlsx), OFX, and QIF formats.
                    </p>
                    <button className="text-[10px] font-bold text-emerald-600 group-hover:underline flex items-center pt-1.5">
                      Upload File <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>

                {/* SMS card */}
                <div
                  onClick={() => { setImportMethod("sms"); setStep(2); }}
                  className="group relative flex items-start gap-4 p-4 rounded-xl border border-zinc-200/80 bg-white hover:border-blue-500 hover:shadow-md cursor-pointer transition-all duration-200 active:scale-[0.99]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-zinc-800">Option 3 – Import via SMS</span>
                      <span className="text-[10px] text-zinc-400 font-bold">Mobile Sync</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Automatically extract transactions from bank alerts, credit card limits, and UPI alerts.
                    </p>
                    <button className="text-[10px] font-bold text-indigo-600 group-hover:underline flex items-center pt-1.5">
                      Connect SMS <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>

                {/* Gmail card */}
                <div
                  onClick={() => { setImportMethod("gmail"); setStep(2); }}
                  className="group relative flex items-start gap-4 p-4 rounded-xl border border-zinc-200/80 bg-white hover:border-blue-500 hover:shadow-md cursor-pointer transition-all duration-200 active:scale-[0.99]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-200">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-zinc-800">Option 4 – Import via Gmail</span>
                      <span className="text-[10px] text-zinc-400 font-bold">Statement Scan</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Sync transaction notifications, statement e-receipts, and payment emails.
                    </p>
                    <button className="text-[10px] font-bold text-rose-600 group-hover:underline flex items-center pt-1.5">
                      Connect Gmail <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Security info cards */}
              <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3.5 space-y-2 mt-4">
                <div className="flex items-center gap-1.5 text-zinc-700 font-bold text-[10px] uppercase tracking-wider">
                  <Shield className="h-3.5 w-3.5 text-zinc-400" /> Security & Privacy Assurance
                </div>
                <ul className="text-[10px] text-zinc-500 space-y-1 pl-1 list-disc list-inside">
                  <li>Your credentials are never stored. Authentications use read-only security scopes.</li>
                  <li>Data is encrypted both in transit and at rest using AES-256 protocols.</li>
                  <li>You maintain absolute control and can disconnect active integrations at any time.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ==========================================
              STEP 2: DETAILS FORM / INPUT METHODS
              ========================================== */}

          {/* 2A: Manual Transaction Form */}
          {step === 2 && importMethod === "manual" && (
            <form onSubmit={handleManualSubmit} className="space-y-5">
              {/* Transaction Type Radio Buttons */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Transaction Type</label>
                <div className="grid grid-cols-3 gap-2 bg-zinc-100/80 p-1 rounded-xl">
                  {["expense", "income", "transfer"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setFormType(t as any);
                        setFormData(prev => ({
                          ...prev,
                          category: t === "expense" ? expenseCategories[0] || "" : incomeCategories[0] || ""
                        }));
                      }}
                      className={`h-8 rounded-lg text-xs font-bold transition-all ${
                        formType === t
                          ? "bg-white text-zinc-950 shadow-sm"
                          : "text-zinc-500 hover:text-zinc-800"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* OCR Receipt Upload Box */}
              <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/55 p-4 text-center space-y-2.5 relative">
                {ocrLoading ? (
                  <div className="flex flex-col items-center justify-center py-4 space-y-2">
                    <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
                    <p className="text-xs font-semibold text-zinc-650">AI Scanner extracting amount & merchant...</p>
                  </div>
                ) : ocrSuccess ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-left">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-emerald-800">OCR Extracted Successfully!</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Whole Foods Market • $54.20 • Groceries</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOcrSuccess(false)}
                      className="text-[10px] font-bold text-zinc-450 hover:text-zinc-600"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center text-zinc-400">
                      <Sparkles className="h-6 w-6 text-zinc-400 shrink-0" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-700">Attach Receipt & Auto-Fill Form</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Drop an invoice image or select files to scan with AI OCR</p>
                    </div>
                    <div className="flex justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleOcrSimulate}
                        className="text-[10px] h-7 px-3 bg-zinc-950 text-white rounded-lg font-bold shadow-xs hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        Simulate OCR Scan
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Form Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Transaction Date */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">Transaction Date *</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full h-9 rounded-lg border border-zinc-200 px-3 pl-8 text-sm font-medium focus:border-blue-500 focus:outline-none"
                    />
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">Amount (INR) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      value={formData.amount}
                      onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full h-9 rounded-lg border border-zinc-200 px-3 pl-7 text-sm font-bold focus:border-blue-500 focus:outline-none"
                    />
                    <span className="absolute left-3 top-2.5 text-xs text-zinc-400 font-bold">₹</span>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">Category *</label>
                  <Select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {formType === "expense"
                      ? expenseCategories.map(c => <option key={c} value={c}>{c}</option>)
                      : incomeCategories.map(c => <option key={c} value={c}>{c}</option>)
                    }
                  </Select>
                </div>

                {/* Subcategory */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">Subcategory</label>
                  <input
                    type="text"
                    placeholder="e.g. Starbucks, Target, Rent payment"
                    value={formData.subcategory}
                    onChange={e => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full h-9 rounded-lg border border-zinc-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Account / Wallet removed — managed in account settings */}

                {/* Payment Method */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">Payment Method</label>
                  <Select
                    value={formData.paymentMethod}
                    onChange={e => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  >
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </Select>
                </div>

                {/* Merchant / Payee */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-500">Merchant / Payee *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon, Walmart, landlord"
                    value={formData.merchant}
                    onChange={e => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                    className="w-full h-9 rounded-lg border border-zinc-200 px-3 text-sm font-semibold focus:border-blue-500 focus:outline-none"
                  />
                  {/* Quick Merchant suggestions */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Amazon", "Starbucks", "Uber", "Whole Foods", "Netflix", "Landlord"].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, merchant: m }))}
                        className="text-[9px] font-bold text-zinc-500 bg-zinc-100 hover:bg-zinc-200 px-2 py-0.5 rounded-full cursor-pointer"
                      >
                        +{m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-500">Description / Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Provide comments, tags, or statements details"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-200 p-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Optional Section Toggles */}
              <div className="space-y-4 pt-2 border-t border-zinc-100 text-xs">
                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Advanced Options</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location & Tags */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                        <Tag className="h-3.5 w-3.5 text-zinc-400" /> Tags (Comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. food, holiday, office"
                        value={formData.tags}
                        onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full h-9 rounded-lg border border-zinc-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400" /> Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. San Francisco, CA"
                        value={formData.location}
                        onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full h-9 rounded-lg border border-zinc-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Recurrence & Splitting */}
                  <div className="space-y-3.5 bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 font-bold text-zinc-700">
                        <RefreshCcw className="h-3.5 w-3.5 text-zinc-400" /> Recurring Transaction
                      </label>
                      <input
                        type="checkbox"
                        checked={formData.isRecurring}
                        onChange={e => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 rounded border-zinc-305 accent-blue-600 cursor-pointer"
                      />
                    </div>
                    {formData.isRecurring && (
                      <div className="animate-in fade-in duration-200">
                        <Select
                          value={formData.recurringFrequency}
                          onChange={e => setFormData(prev => ({ ...prev, recurringFrequency: e.target.value }))}
                          className="h-8 text-xs font-semibold"
                        >
                          <option value="Weekly">Weekly</option>
                          <option value="Bi-Weekly">Bi-Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Yearly">Yearly</option>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-zinc-200/60 pt-2.5">
                      <label className="flex items-center gap-2 font-bold text-zinc-700">
                        <Split className="h-3.5 w-3.5 text-zinc-400" /> Split Transaction
                      </label>
                      <input
                        type="checkbox"
                        checked={formData.isSplit}
                        onChange={e => setFormData(prev => ({ ...prev, isSplit: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 rounded border-zinc-305 accent-blue-600 cursor-pointer"
                      />
                    </div>
                    {formData.isSplit && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        {/* Split count control */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-600">Number of parts:</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => formData.splits.length > 1 && handleRemoveSplit(formData.splits.length - 1)}
                              className="h-6 w-6 rounded-full border border-zinc-200 text-zinc-500 hover:bg-zinc-100 flex items-center justify-center text-sm font-bold cursor-pointer"
                            >−</button>
                            <span className="text-sm font-extrabold text-zinc-900 min-w-[20px] text-center">{formData.splits.length}</span>
                            <button
                              type="button"
                              onClick={handleAddSplit}
                              className="h-6 w-6 rounded-full border border-zinc-200 text-zinc-500 hover:bg-zinc-100 flex items-center justify-center text-sm font-bold cursor-pointer"
                            >+</button>
                          </div>
                        </div>
                        {/* Percentage breakdown */}
                        <div className="space-y-1.5">
                          {formData.splits.map((s, idx) => {
                            const pct = Math.round((1 / formData.splits.length) * 100);
                            const parsedTotal = parseFloat(formData.amount) || 0;
                            const splitAmt = parsedTotal > 0 ? (parsedTotal / formData.splits.length).toFixed(2) : "—";
                            return (
                              <div key={idx} className="flex items-center justify-between bg-white border border-zinc-100 rounded-lg px-3 py-2">
                                <span className="text-xs font-bold text-zinc-700">Part {idx + 1}</span>
                                <div className="flex items-center gap-3">
                                  <span className="text-[11px] font-semibold text-zinc-500">{splitAmt}</span>
                                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{pct}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[10px] text-zinc-400 font-medium">Amount split equally across {formData.splits.length} parts · Remaining goes back to total</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sticky Actions Footer */}
              <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-150 px-6 py-4 -mx-6 -mb-6 pb-6 flex justify-end gap-3 mt-8 z-10">
                <button
                  type="button"
                  onClick={() => { setStep(1); setImportMethod(null); }}
                  className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98]"
                >
                  Save Transaction
                </Button>
              </div>
            </form>
          )}

          {/* 2B: Import File Screen */}
          {step === 2 && importMethod === "file" && (
            <div className="space-y-6">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`rounded-2xl border-2 border-dashed p-8 text-center space-y-4 transition-all duration-200 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50/30"
                    : "border-zinc-200 hover:border-zinc-400 bg-zinc-50/40"
                }`}
              >
                <div className="flex justify-center text-zinc-400">
                  <Upload className="h-10 w-10 text-zinc-400 shrink-0" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-700">Drag & Drop statements export here</p>
                  <p className="text-xs text-zinc-450 mt-1">Or click to browse from local directories</p>
                </div>
                
                <input
                  type="file"
                  id="statement-upload"
                  accept=".csv,.xlsx,.ofx,.qif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <label
                  htmlFor="statement-upload"
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-zinc-950 px-4 text-xs font-semibold text-white cursor-pointer shadow-sm hover:bg-zinc-800 transition-colors"
                >
                  Browse Files
                </label>

                <div className="text-[10px] text-zinc-400 pt-2 font-medium">
                  Accepted file formats: <span className="font-bold text-zinc-500">CSV, Excel (.xlsx), OFX, QIF</span>
                </div>
              </div>

              {/* Sample file downloader */}
              <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl border border-zinc-150/70">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-zinc-405 shrink-0 animate-pulse" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-zinc-700">Sample Template File</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Use this CSV column configuration to sync exports</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="text-xs font-bold text-blue-600 hover:text-blue-750 flex items-center gap-1.5 cursor-pointer"
                >
                  <FileDown className="h-4.5 w-4.5" /> Download Template
                </button>
              </div>

              {/* Mapping explanation */}
              <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-left space-y-2">
                <h5 className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-zinc-400" /> What happens next?
                </h5>
                <ol className="text-[11px] text-zinc-500 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Map custom statement column headers to system targets (Amount, Payee, Category).</li>
                  <li>Our AI will analyze rows to tag categories, auto-detect recurring bills, and scan duplicates.</li>
                  <li>Review, select, or exclude transactions before confirming.</li>
                </ol>
              </div>
            </div>
          )}

          {/* 2C: SMS Sync Connection */}
          {step === 2 && importMethod === "sms" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-2">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-zinc-800">Connect SMS Alerts Integration</h4>
                <p className="text-xs text-zinc-505 max-w-sm mx-auto">
                  Receive transactions automatically in real-time by linking SMS bank receipt notifications.
                </p>
              </div>

              {/* Connected details */}
              <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-150/70">
                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">SMS Parser Targets</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-zinc-700">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Bank debit alerts
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Credit card swipes
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Bank credit alerts
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" /> UPI transactions
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" /> ATM withdrawals
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Wallet topups
                  </div>
                </div>
              </div>

              {/* Chat bubble simulator preview */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-950 p-4 text-left space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-[10px] text-zinc-400 font-bold">SMS Parsing Simulator</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-2 text-[10px]">
                  <div className="max-w-[85%] bg-zinc-800 text-zinc-100 rounded-2xl rounded-bl-none p-3 space-y-1">
                    <p className="font-mono leading-relaxed">
                      "Alert: USD 45.80 spent on Chase Card *9182 at STARBUCKS. Avl Bal: USD 3,420.50."
                    </p>
                    <span className="text-[8px] text-zinc-400 text-right block pt-1">Chase Bank • Today 11:22 AM</span>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[70%] bg-blue-600 text-white rounded-2xl rounded-br-none p-2.5 flex items-center gap-1.5 font-bold shadow-md">
                      <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-bounce" />
                      <span>Extracted: $45.80, Starbucks</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help articles link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowSMSHelp(true)}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <HelpCircle className="h-4 w-4" /> How to enable SMS import?
                </button>
              </div>

              {/* Sticky Actions Footer */}
              <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-150 px-6 py-4 -mx-6 -mb-6 pb-6 flex justify-end gap-3 mt-8 z-10">
                <button
                  type="button"
                  onClick={() => { setStep(1); setImportMethod(null); }}
                  className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="button"
                  onClick={() => handleConnectIntegration("sms")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                  disabled={connectLoading}
                >
                  {connectLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Connecting...
                    </>
                  ) : (
                    <>Connect SMS Sync</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* 2D: Gmail Sync Connection */}
          {step === 2 && importMethod === "gmail" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-2">
                  <Mail className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-zinc-800">Connect Gmail Statements Sync</h4>
                <p className="text-xs text-zinc-505 max-w-sm mx-auto">
                  Automatically pull transaction notifications, statements, and bills from supported banking emails.
                </p>
              </div>

              {/* Features summary */}
              <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-150/70">
                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Features</p>
                <ul className="text-xs text-zinc-650 space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>OAuth 2.0 Auth:</strong> Directly connect using Google Secure sign-in protocols.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Read-Only Scopes:</strong> Access strictly constrained to search transaction emails.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Auto Bank Detection:</strong> Parses statements for 150+ international banks automatically.</span>
                  </li>
                </ul>
              </div>

              {/* Help articles link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowGmailHelp(true)}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <HelpCircle className="h-4 w-4" /> How to connect Gmail?
                </button>
              </div>

              {/* Sticky Actions Footer */}
              <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-150 px-6 py-4 -mx-6 -mb-6 pb-6 flex justify-end gap-3 mt-8 z-10">
                <button
                  type="button"
                  onClick={() => { setStep(1); setImportMethod(null); }}
                  className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="button"
                  onClick={() => handleConnectIntegration("gmail")}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                  disabled={connectLoading}
                >
                  {connectLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Connecting...
                    </>
                  ) : (
                    <>Connect Secure Gmail</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ==========================================
              STEP 3: FILE COLUMN MAPPING (Files Only)
              ========================================== */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left flex gap-2">
                <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-blue-800">Auto-Detected Headers</h5>
                  <p className="text-[11px] text-blue-700 leading-normal mt-0.5">
                    We scanned <span className="font-bold">{selectedFile?.name}</span> and auto-mapped column headers. Please verify and map any missing requirements.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Column Mapping Inputs */}
                {Object.keys(mappings).map(key => (
                  <div key={key} className="flex justify-between items-center gap-4 border-b border-zinc-105 pb-3">
                    <div>
                      <p className="text-xs font-bold text-zinc-800 capitalize">{key} Field *</p>
                      <p className="text-[10px] text-zinc-400">Map database {key} field</p>
                    </div>
                    <div className="w-52">
                      <Select
                        value={mappings[key]}
                        onChange={e => setMappings(prev => ({ ...prev, [key]: e.target.value }))}
                        className="h-8 text-xs font-semibold"
                      >
                        <option value="">-- Ignore Column --</option>
                        {fileHeaders.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sticky Actions Footer */}
              <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-150 px-6 py-4 -mx-6 -mb-6 pb-6 flex justify-end gap-3 mt-8 z-10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors"
                >
                  Back
                </button>
                <Button
                  type="button"
                  onClick={handleMapConfirm}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98]"
                >
                  Parse and Preview
                </Button>
              </div>
            </div>
          )}

          {/* ==========================================
              STEP 4: IMPORT PREVIEW
              ========================================== */}
          {step === 4 && (
            syncStatus === "PROCESSING" || syncStatus === "PENDING" ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-sm font-bold text-zinc-700">Processing cash flows...</p>
                <p className="text-[10px] text-zinc-400">Parsing and auto-categorizing transaction rows</p>
              </div>
            ) : (
              <div className="space-y-5">
              {/* Preview metrics summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-zinc-50 border border-zinc-100 p-3 rounded-xl">
                <div className="text-center p-1.5 border-r border-zinc-150/70">
                  <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Total</span>
                  <p className="text-base font-extrabold text-zinc-850 mt-0.5">{previewTransactions.length}</p>
                </div>
                <div className="text-center p-1.5 border-r border-zinc-150/70">
                  <span className="text-[9px] uppercase font-bold text-emerald-500 tracking-wider">New</span>
                  <p className="text-base font-extrabold text-emerald-600 mt-0.5">
                    {previewTransactions.filter(t => !t.isDuplicate).length}
                  </p>
                </div>
                <div className="text-center p-1.5 border-r border-zinc-150/70">
                  <span className="text-[9px] uppercase font-bold text-amber-500 tracking-wider">Duplicates</span>
                  <p className="text-base font-extrabold text-amber-600 mt-0.5">
                    {previewTransactions.filter(t => t.isDuplicate).length}
                  </p>
                </div>
                <div className="text-center p-1.5">
                  <span className="text-[9px] uppercase font-bold text-rose-500 tracking-wider">Uncategorized</span>
                  <p className="text-base font-extrabold text-rose-600 mt-0.5">
                    {previewTransactions.filter(t => t.isUncategorized).length}
                  </p>
                </div>
              </div>

              {/* Estimate flow indicators */}
              <div className="flex justify-between items-center bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 text-xs font-semibold text-zinc-700">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-650 shrink-0" />
                  <span>Estimated Volume:</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-red-650 font-bold">
                    Expense: ${previewTransactions
                      .filter(t => t.type === "expense" && !t.skip)
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toFixed(2)}
                  </span>
                  <span className="text-emerald-600 font-bold">
                    Income: ${previewTransactions
                      .filter(t => t.type === "income" && !t.skip)
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Scrollable list of parsed rows */}
              <div className="space-y-3.5">
                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Transactions Details</p>

                {previewTransactions.length === 0 ? (
                  <p className="text-center text-xs text-zinc-400 py-6">All transactions removed or skipped.</p>
                ) : (
                  <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                    {previewTransactions.map((t, idx) => (
                      <div
                        key={t.id || idx}
                        className={`rounded-xl border p-3 text-xs space-y-2 transition-all relative ${
                          t.skip
                            ? "bg-zinc-50 border-zinc-150 opacity-60"
                            : t.isDuplicate
                            ? "border-amber-250 bg-amber-50/10"
                            : t.isUncategorized
                            ? "border-rose-250 bg-rose-50/10"
                            : "border-zinc-200 bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-zinc-400">{t.date}</span>
                            <h6 className="font-extrabold text-zinc-900 mt-0.5">{t.merchant}</h6>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div>
                              <span className={`font-bold ${t.type === "income" ? "text-emerald-600" : "text-zinc-900"}`}>
                                {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                              </span>
                              <p className="text-[9px] text-zinc-400">{t.method || "Debit Card"}</p>
                            </div>
                            
                            {/* Duplicate Skip checkbox */}
                            {t.isDuplicate && (
                              <label className="flex items-center gap-1 bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-full font-bold select-none cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!t.skip}
                                  onChange={() => handleToggleDuplicate(t.id)}
                                  className="h-3 w-3 accent-amber-605 shrink-0"
                                />
                                {t.skip ? "Skip?" : "Keep?"}
                              </label>
                            )}
                            
                            {/* Skip manual select */}
                            {!t.isDuplicate && (
                              <input
                                type="checkbox"
                                checked={!t.skip}
                                onChange={() => {
                                  setPreviewTransactions(prev =>
                                    prev.map(item => item.id === t.id ? { ...item, skip: !item.skip } : item)
                                  );
                                }}
                                className="h-3.5 w-3.5 accent-blue-600 cursor-pointer"
                                title="Import Row Toggle"
                              />
                            )}
                          </div>
                        </div>

                        {/* Category and action editor row */}
                        <div className="flex justify-between items-center gap-4 pt-1.5 border-t border-zinc-100">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-400">Category:</span>
                            <div className="w-40 relative">
                              <Select
                                value={t.category}
                                onChange={e => handlePreviewCategoryChange(t.id, e.target.value)}
                                className={`h-7 text-[11px] font-bold py-0 ${
                                  t.isUncategorized ? "border-rose-400 text-rose-700" : ""
                                }`}
                              >
                                {t.type === "expense"
                                  ? expenseCategories.map(c => <option key={c} value={c}>{c}</option>)
                                  : incomeCategories.map(c => <option key={c} value={c}>{c}</option>)
                                }
                              </Select>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            {t.confidence && (
                              <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                t.confidence >= 90
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}>
                                <Sparkles className="h-2.5 w-2.5" /> {t.confidence}% AI
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handlePreviewDelete(t.id)}
                              className="text-zinc-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                              title="Delete Row"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Raw preview detail for SMS / Subject for Gmail */}
                        {(t.raw || t.subject) && (
                          <div className="bg-zinc-50 border border-zinc-100 p-2 rounded-lg text-[9px] text-zinc-500 leading-normal font-medium">
                            {t.raw ? `SMS Body: "${t.raw}"` : `Email: "${t.subject}"`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sticky Actions Footer */}
              <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-150 px-6 py-4 -mx-6 -mb-6 pb-6 flex justify-end gap-3 mt-8 z-10">
                <button
                  type="button"
                  onClick={() => setStep(importMethod === "file" ? 3 : 2)}
                  className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors"
                >
                  Back
                </button>
                <Button
                  type="button"
                  onClick={handleConfirmImport}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98]"
                  disabled={previewTransactions.filter(t => !t.skip).length === 0}
                >
                  Confirm Import
                </Button>
              </div>
            </div>
          )
        )}

          {/* ==========================================
              STEP 5: IMPORT SUMMARY
              ========================================== */}
          {step === 5 && (
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-105 text-emerald-605 mb-2">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-lg font-black text-zinc-900 tracking-tight">Onboarding Complete!</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Your transaction ledger and budget simulators have been updated with the newly synced items.
                </p>
              </div>

              {/* Summary Stats Table */}
              <div className="bg-zinc-50 border border-zinc-150/70 rounded-xl p-4 max-w-sm mx-auto divide-y divide-zinc-200/60 text-xs">
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500 font-medium">Transactions Imported:</span>
                  <span className="font-extrabold text-emerald-600">+{summaryMetrics.imported} items</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500 font-medium">Duplicate Skip Checks:</span>
                  <span className="font-extrabold text-zinc-850">{summaryMetrics.skipped} items</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500 font-medium">Failed / Corrupted Imports:</span>
                  <span className="font-extrabold text-zinc-800">{summaryMetrics.failed} items</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500 font-medium">AI Classification Confidence:</span>
                  <div className="text-right flex items-center gap-1.5">
                    <span className="font-extrabold text-blue-650">{summaryMetrics.confidence}%</span>
                    <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
                  </div>
                </div>
              </div>

              {/* Progress Confidence bar */}
              {summaryMetrics.imported > 0 && importMethod !== "manual" && (
                <div className="max-w-sm mx-auto space-y-1.5">
                  <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                    <span>AI auto-categorization rate</span>
                    <span>{summaryMetrics.confidence}% Confidence</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${summaryMetrics.confidence}%` }} />
                  </div>
                </div>
              )}

              {/* Return Button */}
              <div className="pt-4 max-w-sm mx-auto">
                <Button
                  onClick={handleClose}
                  className="w-full rounded-xl h-11 bg-zinc-950 text-white font-bold hover:bg-zinc-800"
                >
                  View Imported Transactions
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ==========================================
          MODALS / HELP DIALOGS
          ========================================== */}

      {/* SMS Connect Help Article Dialog */}
      {showSMSHelp && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            onClick={() => setShowSMSHelp(false)}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />
          <div className="relative bg-white border border-zinc-200 w-full max-w-md p-6 rounded-2xl shadow-2xl z-10 space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h4 className="font-extrabold text-zinc-900 text-sm">SMS Import Setup & Guide</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowSMSHelp(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-650 transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <div className="space-y-3.5 text-xs text-zinc-600 leading-relaxed overflow-y-auto max-h-[300px] pr-1">
              <div className="space-y-1">
                <h5 className="font-bold text-zinc-800 text-[11px] uppercase tracking-wider">1. Required Permissions</h5>
                <p>On mobile apps, this integration requires "Read SMS" permission scopes. The app scans messages from verified bank sender codes (e.g. shortcodes like CHASE, AMEX, WELLS).</p>
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-zinc-800 text-[11px] uppercase tracking-wider">2. Supported Banks</h5>
                <p>Supports transaction alerts from Chase, Citibank, Amex, Wells Fargo, Bank of America, Capital One, HSBC, and UPI-linked merchant payment providers.</p>
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-zinc-800 text-[11px] uppercase tracking-wider">3. Privacy Policy</h5>
                <p>We do not scan personal messages. Our parser utilizes regex filters matching only financial keyword tags (e.g. "spent", "credited", "debited", "ATM withdrawal").</p>
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-zinc-800 text-[11px] uppercase tracking-wider">4. Data Security</h5>
                <p>Parsing is performed locally on-device. Extracted raw digits are normalized and transmitted using secure TLS/SSL tunnels directly to your encrypted server vault.</p>
              </div>
            </div>

            <Button
              onClick={() => setShowSMSHelp(false)}
              className="w-full h-9 bg-zinc-950 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 cursor-pointer"
            >
              Understand & Close
            </Button>
          </div>
        </div>
      )}

      {/* Gmail Connect Help Article Dialog */}
      {showGmailHelp && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            onClick={() => setShowGmailHelp(false)}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />
          <div className="relative bg-white border border-zinc-200 w-full max-w-md p-6 rounded-2xl shadow-2xl z-10 space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                  <Mail className="h-5 w-5" />
                </div>
                <h4 className="font-extrabold text-zinc-900 text-sm">Gmail Sync Connection Setup</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowGmailHelp(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-650 transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <div className="space-y-3.5 text-xs text-zinc-650 leading-relaxed overflow-y-auto max-h-[300px] pr-1">
              <div className="space-y-1">
                <h5 className="font-bold text-zinc-800 text-[11px] uppercase tracking-wider">1. Gmail OAuth Connection</h5>
                <p>Authenticating redirects you securely to Google Accounts. You grant permission for FinOne to connect to your Gmail inbox via API tokens.</p>
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-zinc-800 text-[11px] uppercase tracking-wider">2. Scoped Inbox Permissions</h5>
                <p>We request access to search and view messages. We only inspect bank statements, invoice confirmations, and notifications fitting bank domains.</p>
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-zinc-800 text-[11px] uppercase tracking-wider">3. Privacy & Security</h5>
                <p>FinOne never stores Google account credentials. Access tokens are encrypted inside an isolated credential container. You can revoke access at any time from Google's Account settings panel.</p>
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-zinc-800 text-[11px] uppercase tracking-wider">4. Supported Statements</h5>
                <p>Supports automatic bank notification statements, subscription invoices (Netflix, Spotify, AWS), and UPI/wallet receipts.</p>
              </div>
            </div>

            <Button
              onClick={() => setShowGmailHelp(false)}
              className="w-full h-9 bg-zinc-950 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 cursor-pointer"
            >
              Understand & Close
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
