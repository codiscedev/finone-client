"use client";

import * as React from "react";
import * as XLSX from "xlsx";
import { format, parse, isValid } from "date-fns";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Trash2,
  RotateCcw,
  ArrowRight,
  ChevronLeft,
  X,
  Sparkles,
  Check,
  Info,
  Layers,
  Settings2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api";
import { formatCurrency } from "@/lib/use-currency";

// ============================================================
// TYPES & CONSTANTS
// ============================================================

export interface TransactionImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface ParsedRow {
  _rawId: string;
  _original: Record<string, any>;
  transactionDate: string; // YYYY-MM-DD format
  rawDate: string;
  valueDate?: string;
  description: string;
  referenceNo?: string;
  debitAmount?: number | null;
  creditAmount?: number | null;
  balance?: number | null;
  category: string;
  subcategory: string;
  isValidDate: boolean;
  isValidAmount: boolean;
  isDuplicate: boolean;
  isDeleted: boolean;
}

export const CATEGORY_MAP: Record<string, string[]> = {
  "Food & Dining": ["Restaurants", "Swiggy / Zomato", "Cafes & Bakery", "Fast Food", "Bars & Pubs"],
  "Groceries": ["Supermarket", "Fruits & Vegetables", "Dairy & Bakery", "Meat & Seafood", "General"],
  "Shopping": ["Electronics", "Clothing & Apparel", "Footwear", "Home & Kitchen", "Online Stores", "General"],
  "Transportation": ["Fuel / Petrol", "Taxi / Uber / Ola", "Public Transit", "Vehicle Maintenance", "Parking"],
  "Utilities": ["Electricity", "Internet & Wifi", "Mobile Recharge", "Water Bill", "Gas Connection"],
  "Rent": ["Apartment Rent", "Office Rent", "Lease Deposit"],
  "Entertainment": ["Streaming (Netflix/Prime)", "Movies & Cinema", "Gaming", "Concerts & Events"],
  "Travel": ["Flights", "Hotels & Stays", "Trains & Buses", "Tours & Packages"],
  "Healthcare": ["Medicines & Pharmacy", "Doctor Consultations", "Lab Tests", "Health Insurance"],
  "Insurance": ["Life Insurance", "Vehicle Insurance", "Health Insurance"],
  "Investments": ["Mutual Funds", "Equity & Stocks", "Dividends", "Fixed Deposit", "Gold & Crypto"],
  "Salary": ["Primary Direct Deposit", "Bonus & Incentive", "Stipend"],
  "Freelance": ["UI/UX Design", "Software Development", "Consulting", "Content Writing"],
  "Rental Income": ["Sublet Room Yield", "Commercial Lease"],
  "Other Income": ["Dividends & Yields", "Cashback & Rewards", "Refunds", "Gifts & Grants"],
  "Miscellaneous": ["General Expense", "Subscriptions", "Other Outflows"],
};

export function autoSuggestCategory(description: string, isIncome: boolean): { category: string; subcategory: string } {
  const d = (description || "").toLowerCase();

  if (isIncome) {
    if (d.includes("salary") || d.includes("payroll") || d.includes("stipend")) {
      return { category: "Salary", subcategory: "Primary Direct Deposit" };
    }
    if (d.includes("dividend") || d.includes("yield") || d.includes("zerodha") || d.includes("groww") || d.includes("payout")) {
      return { category: "Other Income", subcategory: "Dividends & Yields" };
    }
    if (d.includes("freelance") || d.includes("fiverr") || d.includes("upwork") || d.includes("consult")) {
      return { category: "Freelance", subcategory: "UI/UX Design" };
    }
    if (d.includes("rent") || d.includes("sublet")) {
      return { category: "Rental Income", subcategory: "Sublet Room Yield" };
    }
    if (d.includes("refund") || d.includes("cashback") || d.includes("reward")) {
      return { category: "Other Income", subcategory: "Cashback & Rewards" };
    }
    return { category: "Other Income", subcategory: "Dividends & Yields" };
  }

  // Expense matching
  if (d.includes("swiggy") || d.includes("zomato") || d.includes("starbucks") || d.includes("cafe") || d.includes("restaurant") || d.includes("food") || d.includes("dining") || d.includes("dine")) {
    return { category: "Food & Dining", subcategory: "Restaurants" };
  }
  if (d.includes("big bazaar") || d.includes("zepto") || d.includes("blinkit") || d.includes("grofers") || d.includes("grocery") || d.includes("supermarket") || d.includes("mart")) {
    return { category: "Groceries", subcategory: "Supermarket" };
  }
  if (d.includes("uber") || d.includes("ola") || d.includes("cab") || d.includes("taxi")) {
    return { category: "Transportation", subcategory: "Taxi / Uber / Ola" };
  }
  if (d.includes("fuel") || d.includes("petrol") || d.includes("diesel") || d.includes("hpcl") || d.includes("bpcl") || d.includes("iocl") || d.includes("chevron")) {
    return { category: "Transportation", subcategory: "Fuel / Petrol" };
  }
  if (d.includes("amazon") || d.includes("flipkart") || d.includes("myntra") || d.includes("shop") || d.includes("store")) {
    return { category: "Shopping", subcategory: "General" };
  }
  if (d.includes("netflix") || d.includes("spotify") || d.includes("prime") || d.includes("hotstar") || d.includes("movie") || d.includes("cinema")) {
    return { category: "Entertainment", subcategory: "Streaming (Netflix/Prime)" };
  }
  if (d.includes("indigo") || d.includes("flight") || d.includes("airline") || d.includes("hotel") || d.includes("stay") || d.includes("travel")) {
    return { category: "Travel", subcategory: "Flights" };
  }
  if (d.includes("rent") || d.includes("lease") || d.includes("prestige")) {
    return { category: "Rent", subcategory: "Apartment Rent" };
  }
  if (d.includes("jio") || d.includes("airtel") || d.includes("fiber") || d.includes("bescom") || d.includes("electricity") || d.includes("wifi")) {
    return { category: "Utilities", subcategory: "Internet & Wifi" };
  }

  return { category: "Miscellaneous", subcategory: "General Expense" };
}

const COMMON_DATE_FORMATS = [
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD",
  "DD-MM-YYYY",
  "DD-MMM-YYYY",
  "DD MMM YYYY",
  "MM/DD/YY",
  "YYYY/MM/DD",
];

const DB_FIELDS = [
  { key: "transaction_date", label: "Transaction Date *", required: true },
  { key: "description", label: "Description / Narration *", required: true },
  { key: "debit_amount", label: "Debit / Withdrawal Amount", required: false },
  { key: "credit_amount", label: "Credit / Deposit Amount", required: false },
];

export default function TransactionImportWizard({
  isOpen,
  onClose,
  onSuccess,
}: TransactionImportWizardProps) {
  // Wizard Step: 1 = Upload, 2 = Mapping, 3 = Preview, 4 = Result
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);

  // Step 1 State
  const [file, setFile] = React.useState<File | null>(null);
  const [filePassword, setFilePassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [dateFormat, setDateFormat] = React.useState("DD/MM/YYYY");
  const [headerRowIndex, setHeaderRowIndex] = React.useState<number>(1);
  const [parsingLoading, setParsingLoading] = React.useState(false);
  const [stepError, setStepError] = React.useState<string | null>(null);

  // Parsed Workbook / Sheets state
  const [sheets, setSheets] = React.useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = React.useState<string>("");
  const [sheetData, setSheetData] = React.useState<Record<string, any[][]>>({});
  const [fileHeaders, setFileHeaders] = React.useState<string[]>([]);
  const [fileDataRows, setFileDataRows] = React.useState<Record<string, any>[]>([]);

  // Step 2 State (Column Mappings)
  const [mappings, setMappings] = React.useState<Record<string, string>>({
    transaction_date: "",
    description: "",
    debit_amount: "",
    credit_amount: "",
    balance: "",
    reference_no: "",
    value_date: "",
  });

  // Step 3 State (Preview & Editing)
  const [rows, setRows] = React.useState<ParsedRow[]>([]);
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [showAllRows, setShowAllRows] = React.useState(false);
  const [recentlyDeletedRow, setRecentlyDeletedRow] = React.useState<ParsedRow | null>(null);
  const [importingLoading, setImportingLoading] = React.useState(false);

  // Step 4 State (Import Result)
  const [importResult, setImportResult] = React.useState<{
    importedCount: number;
    skippedCount: number;
    failedCount: number;
    totalDebits: number;
    totalCredits: number;
    startDate?: string;
    endDate?: string;
  } | null>(null);

  // Reset states when closed
  React.useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFile(null);
      setFilePassword("");
      setDateFormat("DD/MM/YYYY");
      setHeaderRowIndex(1);
      setStepError(null);
      setSheets([]);
      setSelectedSheet("");
      setSheetData({});
      setFileHeaders([]);
      setFileDataRows([]);
      setMappings({
        transaction_date: "",
        description: "",
        debit_amount: "",
        credit_amount: "",
        balance: "",
        reference_no: "",
        value_date: "",
      });
      setRows([]);
      setImportResult(null);
      setRecentlyDeletedRow(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ============================================================
  // STEP 1: FILE PARSING HANDLERS
  // ============================================================

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStepError(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStepError(null);
    }
  };

  const handleParseFile = async () => {
    if (!file) {
      setStepError("Please select a file to upload.");
      return;
    }

    setParsingLoading(true);
    setStepError(null);

    const ext = file.name.split(".").pop()?.toLowerCase();

    try {
      if (ext === "pdf") {
        // Parse PDF statement via Backend API
        const formData = new FormData();
        formData.append("file", file);
        if (filePassword) {
          formData.append("password", filePassword);
        }

        const res = await apiClient.post("/v1/imports/parse-pdf", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.success && res.data?.data) {
          const pdfResult = res.data.data;
          const headers: string[] = pdfResult.columns || [];
          const rawRows: string[][] = pdfResult.rows || [];

          const parsedRows: Record<string, any>[] = rawRows.map((r) => {
            const obj: Record<string, any> = {};
            headers.forEach((h, idx) => {
              obj[h] = r[idx] || "";
            });
            return obj;
          });

          setFileHeaders(headers);
          setFileDataRows(parsedRows);
          setSheets(["PDF Statement"]);
          setSelectedSheet("PDF Statement");

          // Auto suggest mappings
          autoSuggestMappings(headers);

          setStep(2);
        } else {
          throw new Error(res.data?.message || "Failed to parse PDF file.");
        }
      } else if (ext === "xlsx" || ext === "xls" || ext === "csv") {
        // Try parsing Excel / CSV in Browser via SheetJS
        try {
          const arrayBuffer = await file.arrayBuffer();
          const options: XLSX.ParsingOptions = { type: "array" };
          if (filePassword) {
            options.password = filePassword;
          }

          const workbook = XLSX.read(arrayBuffer, options);
          if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            throw new Error("No worksheets found in this file.");
          }

          const sheetNames = workbook.SheetNames;
          setSheets(sheetNames);
          const defaultSheet = sheetNames[0];
          setSelectedSheet(defaultSheet);

          // Parse default sheet with smart auto header detection
          processExcelSheet(workbook, defaultSheet, headerRowIndex);
          setStep(2);
        } catch (browserErr: any) {
          console.warn("Browser SheetJS parse failed, attempting backend POI parser fallback...", browserErr);

          // Fallback: Send to backend parser API (handles password-protected & complex Excel files via Apache POI)
          const formData = new FormData();
          formData.append("file", file);
          if (filePassword) formData.append("password", filePassword);
          if (headerRowIndex && headerRowIndex > 1) formData.append("headerRowIndex", String(headerRowIndex));

          const res = await apiClient.post("/v1/imports/parse-file", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (res.data?.success && res.data?.data) {
            const result = res.data.data;
            setSheets(result.sheets || ["Sheet 1"]);
            setSelectedSheet(result.selectedSheet || "Sheet 1");
            if (result.headerRowIndex) {
              setHeaderRowIndex(result.headerRowIndex);
            }
            const headers: string[] = result.columns || [];
            const dataRows: Record<string, any>[] = result.rows || [];

            setFileHeaders(headers);
            setFileDataRows(dataRows);
            autoSuggestMappings(headers);
            setStep(2);
          } else {
            throw new Error(res.data?.message || "Incorrect password or file is corrupted.");
          }
        }
      } else {
        throw new Error("Unsupported file format. Please upload .xlsx, .xls, .csv, or .pdf");
      }
    } catch (err: any) {
      console.error("File processing failed:", err);
      setStepError(err.message || "Failed to process file. Please check file and password.");
    } finally {
      setParsingLoading(false);
    }
  };

  const processExcelSheet = (workbook: XLSX.WorkBook, sheetName: string, userHeaderIdx: number) => {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) return;

    const rawMatrix: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

    if (rawMatrix.length === 0) {
      setStepError("Worksheet is empty.");
      return;
    }

    // Auto-detect best header row if user left headerRowIndex at default 1
    let chosenHeaderIdx = Math.max(1, userHeaderIdx) - 1; // 0-indexed default
    if (userHeaderIdx === 1) {
      const keywords = ["date", "txn", "transaction", "value", "details", "particulars", "remarks", "narration", "description", "debit", "credit", "withdrawal", "deposit", "balance", "amount", "ref", "cheque", "utr", "chq", "s no", "s.no"];
      let bestScore = -1;
      let bestRow = 0;

      const scanLimit = Math.min(40, rawMatrix.length);
      for (let r = 0; r < scanLimit; r++) {
        const row = rawMatrix[r];
        if (!row || !Array.isArray(row)) continue;

        let score = 0;
        let nonCols = 0;
        row.forEach((cell) => {
          const val = String(cell || "").toLowerCase().trim();
          if (val) {
            nonCols++;
            keywords.forEach((kw) => {
              if (val.includes(kw)) score += 2;
            });
          }
        });

        if (nonCols >= 2 && score > bestScore) {
          bestScore = score;
          bestRow = r;
        }
      }

      if (bestScore >= 2) {
        chosenHeaderIdx = bestRow;
        setHeaderRowIndex(bestRow + 1); // Update UI state (1-indexed)
      }
    }

    const rawHeaderRow = (rawMatrix[chosenHeaderIdx] || []);
    const headers: string[] = [];
    const validColIndices: number[] = [];

    rawHeaderRow.forEach((h: any, i: number) => {
      const name = String(h || "").trim();
      if (name !== "") {
        headers.push(name);
        validColIndices.push(i);
      }
    });

    const dataRows: Record<string, any>[] = [];
    for (let r = chosenHeaderIdx + 1; r < rawMatrix.length; r++) {
      const rowValues = rawMatrix[r];
      if (!rowValues || !Array.isArray(rowValues) || rowValues.every((cell) => cell === "" || cell == null)) continue;
      const obj: Record<string, any> = {};
      headers.forEach((h, idx) => {
        const colIdx = validColIndices[idx];
        obj[h] = rowValues[colIdx] != null ? String(rowValues[colIdx]).trim() : "";
      });
      dataRows.push(obj);
    }

    setFileHeaders(headers);
    setFileDataRows(dataRows);

    autoSuggestMappings(headers);
  };

  const autoSuggestMappings = (headers: string[]) => {
    const newMappings: Record<string, string> = {
      transaction_date: "",
      description: "",
      debit_amount: "",
      credit_amount: "",
      balance: "",
      reference_no: "",
      value_date: "",
    };

    headers.forEach((header) => {
      const lower = header.toLowerCase();
      if (!newMappings.transaction_date && (lower.includes("date") && !lower.includes("value"))) {
        newMappings.transaction_date = header;
      } else if (!newMappings.value_date && lower.includes("value date")) {
        newMappings.value_date = header;
      } else if (!newMappings.description && (lower.includes("desc") || lower.includes("narr") || lower.includes("remark") || lower.includes("particular"))) {
        newMappings.description = header;
      } else if (!newMappings.debit_amount && (lower.includes("debit") || lower.includes("dr") || lower.includes("withdraw"))) {
        newMappings.debit_amount = header;
      } else if (!newMappings.credit_amount && (lower.includes("credit") || lower.includes("cr") || lower.includes("deposit"))) {
        newMappings.credit_amount = header;
      } else if (!newMappings.balance && (lower.includes("bal"))) {
        newMappings.balance = header;
      } else if (!newMappings.reference_no && (lower.includes("ref") || lower.includes("chq") || lower.includes("cheque") || lower.includes("utr"))) {
        newMappings.reference_no = header;
      }
    });

    setMappings(newMappings);

    // Try fetching saved preferences from server
    fetchSavedMappingPreference(headers);
  };

  const fetchSavedMappingPreference = async (headers: string[]) => {
    const fingerprint = headers.slice(0, 5).join("|").toLowerCase();
    try {
      const res = await apiClient.get(`/v1/imports/preferences?fingerprint=${encodeURIComponent(fingerprint)}`);
      if (res.data?.success && res.data?.data) {
        const savedMap = JSON.parse(res.data.data);
        setMappings((prev) => ({ ...prev, ...savedMap }));
      }
    } catch (e) {
      console.warn("No saved mapping preference for fingerprint");
    }
  };

  // ============================================================
  // STEP 2: MAPPING CONFIRMATION HANDLER
  // ============================================================

  const handleConfirmMapping = () => {
    if (!mappings.transaction_date) {
      setStepError("Please map the 'Transaction Date' column.");
      return;
    }
    if (!mappings.description) {
      setStepError("Please map the 'Description / Narration' column.");
      return;
    }
    if (!mappings.debit_amount && !mappings.credit_amount) {
      setStepError("Please map at least one of 'Debit Amount' or 'Credit Amount'.");
      return;
    }

    setStepError(null);

    // Save preferences to server
    const fingerprint = fileHeaders.slice(0, 5).join("|").toLowerCase();
    apiClient.post("/v1/imports/preferences", {
      fingerprint,
      mappingJson: JSON.stringify(mappings),
    }).catch(() => {});

    // Transform fileDataRows into ParsedRow[]
    const transformed: ParsedRow[] = fileDataRows.map((raw, idx) => {
      const rawDateStr = String(raw[mappings.transaction_date] || "").trim();
      const parsedDate = parseDateString(rawDateStr, dateFormat);

      const descStr = String(raw[mappings.description] || "").trim();

      const debitVal = mappings.debit_amount ? parseAmountString(raw[mappings.debit_amount]) : null;
      const creditVal = mappings.credit_amount ? parseAmountString(raw[mappings.credit_amount]) : null;
      const balVal = mappings.balance ? parseAmountString(raw[mappings.balance]) : null;
      const refStr = mappings.reference_no ? String(raw[mappings.reference_no] || "").trim() : "";
      const valueDateStr = mappings.value_date ? String(raw[mappings.value_date] || "").trim() : "";

      const isValidDate = parsedDate != null;
      const isValidAmount = (debitVal != null && debitVal > 0) || (creditVal != null && creditVal > 0);
      const isIncome = creditVal != null && creditVal > 0 && (!debitVal || debitVal === 0);
      const suggested = autoSuggestCategory(descStr, isIncome);

      return {
        _rawId: `row_${idx}_${Math.random().toString(36).substr(2, 6)}`,
        _original: { ...raw },
        transactionDate: parsedDate ? format(parsedDate, "yyyy-MM-dd") : "",
        rawDate: rawDateStr,
        valueDate: valueDateStr ? (parseDateString(valueDateStr, dateFormat) ? format(parseDateString(valueDateStr, dateFormat)!, "yyyy-MM-dd") : valueDateStr) : "",
        description: descStr,
        referenceNo: refStr,
        debitAmount: debitVal,
        creditAmount: creditVal,
        balance: balVal,
        category: suggested.category,
        subcategory: suggested.subcategory,
        isValidDate,
        isValidAmount,
        isDuplicate: false,
        isDeleted: false,
      };
    });

    setRows(transformed);
    setStep(3);
  };

  // ============================================================
  // PARSING HELPERS (Date & Amount)
  // ============================================================

  function parseAmountString(val: any): number | null {
    if (val == null || val === "") return null;
    let s = String(val).trim();

    // Handle accounting negative format: (450.00) -> -450.00
    if (s.startsWith("(") && s.endsWith(")")) {
      s = "-" + s.substring(1, s.length - 1);
    }

    // Strip currency symbols and commas
    s = s.replace(/[₹$€£Rs.,]/g, (match) => (match === "." ? "." : ""));
    const num = parseFloat(s);
    return isNaN(num) ? null : num;
  }

  function parseDateString(rawStr: string, formatHint: string): Date | null {
    if (!rawStr) return null;

    // Remove time portion if present
    const cleanStr = rawStr.split("T")[0].split(" ")[0].trim();

    // Map user label format to date-fns tokens
    let fnsFormat = "dd/MM/yyyy";
    switch (formatHint) {
      case "DD/MM/YYYY": fnsFormat = "dd/MM/yyyy"; break;
      case "MM/DD/YYYY": fnsFormat = "MM/dd/yyyy"; break;
      case "YYYY-MM-DD": fnsFormat = "yyyy-MM-dd"; break;
      case "DD-MM-YYYY": fnsFormat = "dd-MM-yyyy"; break;
      case "DD-MMM-YYYY": fnsFormat = "dd-MMM-yyyy"; break;
      case "DD MMM YYYY": fnsFormat = "dd MMM yyyy"; break;
      case "MM/DD/YY": fnsFormat = "MM/dd/yy"; break;
      case "YYYY/MM/DD": fnsFormat = "yyyy/MM/dd"; break;
    }

    // Try target format first
    let d = parse(cleanStr, fnsFormat, new Date());
    if (isValid(d)) return d;

    // Fallbacks
    const fallbacks = [
      "yyyy-MM-dd",
      "dd/MM/yyyy",
      "MM/dd/yyyy",
      "dd-MM-yyyy",
      "dd-MMM-yyyy",
      "yyyy/MM/dd",
    ];

    for (const fb of fallbacks) {
      d = parse(cleanStr, fb, new Date());
      if (isValid(d)) return d;
    }

    const nativeDate = new Date(cleanStr);
    return isValid(nativeDate) ? nativeDate : null;
  }

  // ============================================================
  // STEP 3: PREVIEW & INLINE EDITING HANDLERS
  // ============================================================

  const handleUpdateCell = (rawId: string, field: keyof ParsedRow, val: any) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r._rawId !== rawId) return r;
        const updated = { ...r, [field]: val };

        if (field === "transactionDate") {
          const d = parseDateString(val, "YYYY-MM-DD");
          updated.isValidDate = d != null;
        }

        if (field === "debitAmount" || field === "creditAmount") {
          const num = typeof val === "number" ? val : parseAmountString(val);
          if (field === "debitAmount") updated.debitAmount = num;
          if (field === "creditAmount") updated.creditAmount = num;

          updated.isValidAmount =
            (updated.debitAmount != null && updated.debitAmount > 0) ||
            (updated.creditAmount != null && updated.creditAmount > 0);
        }

        return updated;
      })
    );
  };

  const handleDeleteRow = (rawId: string) => {
    const target = rows.find((r) => r._rawId === rawId);
    if (target) {
      setRecentlyDeletedRow(target);
    }
    setRows((prev) => prev.map((r) => (r._rawId === rawId ? { ...r, isDeleted: true } : r)));
  };

  const handleUndoDelete = () => {
    if (!recentlyDeletedRow) return;
    setRows((prev) =>
      prev.map((r) => (r._rawId === recentlyDeletedRow._rawId ? { ...r, isDeleted: false } : r))
    );
    setRecentlyDeletedRow(null);
  };

  const handleResetRow = (rawId: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r._rawId !== rawId) return r;
        const rawDateStr = String(r._original[mappings.transaction_date] || "").trim();
        const parsedDate = parseDateString(rawDateStr, dateFormat);
        const descStr = String(r._original[mappings.description] || "").trim();
        const debitVal = mappings.debit_amount ? parseAmountString(r._original[mappings.debit_amount]) : null;
        const creditVal = mappings.credit_amount ? parseAmountString(r._original[mappings.credit_amount]) : null;

        const isIncome = creditVal != null && creditVal > 0 && (!debitVal || debitVal === 0);
        const suggested = autoSuggestCategory(descStr, isIncome);

        return {
          ...r,
          transactionDate: parsedDate ? format(parsedDate, "yyyy-MM-dd") : "",
          rawDate: rawDateStr,
          description: descStr,
          debitAmount: debitVal,
          creditAmount: creditVal,
          category: suggested.category,
          subcategory: suggested.subcategory,
          isValidDate: parsedDate != null,
          isValidAmount: (debitVal != null && debitVal > 0) || (creditVal != null && creditVal > 0),
          isDeleted: false,
        };
      })
    );
  };

  // Metrics summary calculation
  const activeRows = rows.filter((r) => !r.isDeleted);
  const deletedCount = rows.filter((r) => r.isDeleted).length;

  const validRows = activeRows.filter((r) => r.isValidDate && r.isValidAmount);
  const errorRows = activeRows.filter((r) => !r.isValidDate || !r.isValidAmount);
  const duplicateRows = activeRows.filter((r) => r.isDuplicate);

  // ============================================================
  // STEP 4: BATCH IMPORT SUBMISSION
  // ============================================================

  const handleExecuteImport = async () => {
    const importable = validRows;
    if (importable.length === 0) {
      setStepError("No valid rows available to import.");
      return;
    }

    setImportingLoading(true);
    setStepError(null);

    const payloadTransactions = importable.map((r) => ({
      transactionDate: r.transactionDate,
      valueDate: r.valueDate || r.transactionDate,
      description: r.description,
      referenceNo: r.referenceNo || null,
      debitAmount: r.debitAmount || null,
      creditAmount: r.creditAmount || null,
      balance: r.balance || null,
      category: r.category,
      subcategory: r.subcategory,
    }));

    try {
      const res = await apiClient.post("/v1/imports/batch", {
        importSessionName: file ? `Import — ${file.name}` : `Import ${format(new Date(), "yyyy-MM-dd")}`,
        fileName: file?.name || "statement.csv",
        fileType: file?.name.split(".").pop() || "csv",
        dateFormat: dateFormat,
        transactions: payloadTransactions,
      });

      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        setImportResult({
          importedCount: data.importedCount,
          skippedCount: data.skippedCount,
          failedCount: data.failedCount,
          totalDebits: data.totalDebits || 0,
          totalCredits: data.totalCredits || 0,
          startDate: data.startDate,
          endDate: data.endDate,
        });
        setStep(4);
      } else {
        throw new Error(res.data?.message || "Import failed.");
      }
    } catch (err: any) {
      console.error("Batch import API error:", err);
      setStepError(err.message || "Failed to execute batch import.");
    } finally {
      setImportingLoading(false);
    }
  };

  // ============================================================
  // RENDER MODAL UI
  // ============================================================

  const visiblePreviewRows = showAllRows ? activeRows : activeRows.slice(0, 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-5xl h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        {/* Header Bar */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Import Bank Statement
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Multi-step transaction wizard with smart mapping & validation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center justify-between px-8 py-3 bg-zinc-100/60 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-400">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-blue-600 dark:text-blue-400" : ""}`}>
            <span className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${step >= 1 ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950" : "border-zinc-300"}`}>1</span>
            <span>Upload File</span>
          </div>
          <div className={`h-[2px] flex-1 mx-4 ${step >= 2 ? "bg-blue-600/60" : "bg-zinc-200 dark:bg-zinc-800"}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-blue-600 dark:text-blue-400" : ""}`}>
            <span className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${step >= 2 ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950" : "border-zinc-300"}`}>2</span>
            <span>Column Mapping</span>
          </div>
          <div className={`h-[2px] flex-1 mx-4 ${step >= 3 ? "bg-blue-600/60" : "bg-zinc-200 dark:bg-zinc-800"}`} />
          <div className={`flex items-center gap-2 ${step >= 3 ? "text-blue-600 dark:text-blue-400" : ""}`}>
            <span className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${step >= 3 ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950" : "border-zinc-300"}`}>3</span>
            <span>Preview & Edit</span>
          </div>
          <div className={`h-[2px] flex-1 mx-4 ${step >= 4 ? "bg-blue-600/60" : "bg-zinc-200 dark:bg-zinc-800"}`} />
          <div className={`flex items-center gap-2 ${step >= 4 ? "text-blue-600 dark:text-blue-400" : ""}`}>
            <span className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${step >= 4 ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950" : "border-zinc-300"}`}>4</span>
            <span>Import Completed</span>
          </div>
        </div>

        {/* Step Error Notification Banner */}
        {stepError && (
          <div className="mx-6 mt-4 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{stepError}</span>
            </div>
            <button onClick={() => setStepError(null)} className="text-red-500 hover:text-red-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Body Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* STEP 1: UPLOAD FILE */}
          {step === 1 && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="group relative flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 rounded-2xl p-10 text-center transition-all cursor-pointer"
              >
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,.pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="p-4 rounded-full bg-white dark:bg-zinc-800 shadow-md group-hover:scale-105 transition-transform">
                  <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm font-extrabold text-zinc-900 dark:text-white">
                    {file ? file.name : "Drag & drop your statement file here"}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports Excel (.xlsx, .xls), CSV, or PDF statements"}
                  </p>
                </div>
              </div>

              {/* Password & Date Format Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-zinc-400" /> File Password (optional)
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Leave empty if not protected"
                      value={filePassword}
                      onChange={(e) => setFilePassword(e.target.value)}
                      className="pr-10 h-9 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" /> Statement Date Format
                  </label>
                  <Select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
                    {COMMON_DATE_FORMATS.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt} {fmt === "DD/MM/YYYY" ? "(Default - India)" : ""}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Settings2 className="h-3.5 w-3.5 text-zinc-400" /> Header Row Index
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={headerRowIndex}
                    onChange={(e) => setHeaderRowIndex(parseInt(e.target.value) || 1)}
                    className="h-9 text-xs max-w-xs"
                  />
                  <p className="text-[10px] text-zinc-400">
                    Row number where table headers start in your file (default: 1)
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleParseFile}
                  disabled={!file || parsingLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-xl shadow-md flex items-center gap-2"
                >
                  {parsingLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Parsing File...
                    </>
                  ) : (
                    <>
                      Next: Map Columns <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: COLUMN MAPPING */}
          {step === 2 && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
              {sheets.length > 1 && (
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    <Layers className="h-4 w-4 text-blue-600" />
                    <span>Excel Sheet:</span>
                  </div>
                  <Select
                    value={selectedSheet}
                    onChange={(e) => {
                      setSelectedSheet(e.target.value);
                      processExcelSheet({ SheetNames: sheets, Sheets: sheetData } as any, e.target.value, headerRowIndex);
                    }}
                    className="w-48 h-8 text-xs"
                  >
                    {sheets.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">DB Field</span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">Statement File Column</span>
                </div>

                {DB_FIELDS.map((field) => (
                  <div key={field.key} className="flex items-center justify-between gap-4 py-1.5">
                    <div>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {field.label}
                      </span>
                    </div>
                    <Select
                      value={mappings[field.key] || ""}
                      onChange={(e) => setMappings({ ...mappings, [field.key]: e.target.value })}
                      className="w-64 h-9 text-xs"
                    >
                      <option value="">-- Skip Field --</option>
                      {fileHeaders.map((header) => (
                        <option key={header} value={header}>{header}</option>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="h-10 px-5 rounded-xl font-bold text-xs flex items-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleConfirmMapping}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-xl shadow-md flex items-center gap-2"
                >
                  Next: Preview & Edit <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW & EDIT */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Summary Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-bold">
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> {validRows.length} Valid
                  </span>
                  <span className="text-amber-500 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> {duplicateRows.length} Duplicates
                  </span>
                  <span className="text-red-500 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> {errorRows.length} Errors
                  </span>
                  {deletedCount > 0 && (
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Trash2 className="h-4 w-4" /> {deletedCount} Deleted
                    </span>
                  )}
                </div>

                {recentlyDeletedRow && (
                  <Button
                    onClick={handleUndoDelete}
                    variant="outline"
                    className="h-7 text-[11px] font-bold text-blue-600 hover:bg-blue-50 px-2.5 rounded-lg flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" /> Undo Delete
                  </Button>
                )}
              </div>

              {/* Table Container */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden max-h-[50vh] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-100 dark:bg-zinc-950 sticky top-0 font-bold text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                      <th className="p-3 w-8">Status</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Sub-Category</th>
                      <th className="p-3 text-right">Debit</th>
                      <th className="p-3 text-right">Credit</th>
                      <th className="p-3 text-center w-16">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {visiblePreviewRows.map((r) => {
                      const isError = !r.isValidDate || !r.isValidAmount;

                      return (
                        <tr
                          key={r._rawId}
                          className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${
                            isError ? "bg-red-500/5" : r.isDuplicate ? "bg-amber-500/5" : ""
                          }`}
                        >
                          <td className="p-3">
                            {isError ? (
                              <span title="Date or amount invalid"><XCircle className="h-4 w-4 text-red-500" /></span>
                            ) : r.isDuplicate ? (
                              <span title="Possible duplicate entry"><AlertTriangle className="h-4 w-4 text-amber-500" /></span>
                            ) : (
                              <span title="Valid row"><CheckCircle className="h-4 w-4 text-emerald-500" /></span>
                            )}
                          </td>

                          {/* Date Cell */}
                          <td className="p-3 font-mono">
                            <input
                              type="text"
                              value={r.transactionDate || r.rawDate}
                              onChange={(e) => handleUpdateCell(r._rawId, "transactionDate", e.target.value)}
                              className={`w-28 h-7 px-2 rounded border bg-transparent text-xs ${
                                !r.isValidDate ? "border-red-500 text-red-600 font-bold" : "border-zinc-200 dark:border-zinc-700"
                              }`}
                            />
                          </td>

                          {/* Description Cell */}
                          <td className="p-3">
                            <input
                              type="text"
                              value={r.description}
                              onChange={(e) => handleUpdateCell(r._rawId, "description", e.target.value)}
                              className="w-full min-w-[160px] h-7 px-2 rounded border border-zinc-200 dark:border-zinc-700 bg-transparent text-xs"
                            />
                          </td>

                          {/* Category Select Cell */}
                          <td className="p-3">
                            <select
                              value={r.category || "Miscellaneous"}
                              onChange={(e) => {
                                const newCat = e.target.value;
                                const subOptions = CATEGORY_MAP[newCat] || ["General"];
                                handleUpdateCell(r._rawId, "category", newCat);
                                handleUpdateCell(r._rawId, "subcategory", subOptions[0]);
                              }}
                              className="w-36 h-7 px-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                            >
                              {Object.keys(CATEGORY_MAP).map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Sub-Category Select Cell */}
                          <td className="p-3">
                            <select
                              value={r.subcategory || (CATEGORY_MAP[r.category]?.[0] || "General")}
                              onChange={(e) => handleUpdateCell(r._rawId, "subcategory", e.target.value)}
                              className="w-36 h-7 px-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300"
                            >
                              {(CATEGORY_MAP[r.category] || ["General"]).map((sub) => (
                                <option key={sub} value={sub}>
                                  {sub}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Debit Cell */}
                          <td className="p-3 text-right font-mono">
                            <input
                              type="text"
                              value={r.debitAmount != null ? r.debitAmount : ""}
                              onChange={(e) => handleUpdateCell(r._rawId, "debitAmount", e.target.value)}
                              placeholder="-"
                              className="w-24 h-7 px-2 text-right rounded border border-zinc-200 dark:border-zinc-700 bg-transparent text-xs font-semibold text-red-600"
                            />
                          </td>

                          {/* Credit Cell */}
                          <td className="p-3 text-right font-mono">
                            <input
                              type="text"
                              value={r.creditAmount != null ? r.creditAmount : ""}
                              onChange={(e) => handleUpdateCell(r._rawId, "creditAmount", e.target.value)}
                              placeholder="-"
                              className="w-24 h-7 px-2 text-right rounded border border-zinc-200 dark:border-zinc-700 bg-transparent text-xs font-semibold text-emerald-600"
                            />
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleResetRow(r._rawId)}
                                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                title="Reset to original"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRow(r._rawId)}
                                className="p-1 text-zinc-400 hover:text-red-600"
                                title="Delete row"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Load All Button */}
              {activeRows.length > 100 && !showAllRows && (
                <div className="text-center pt-1">
                  <button
                    onClick={() => setShowAllRows(true)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Showing first 100 rows — Click to load all {activeRows.length} rows
                  </button>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="h-10 px-5 rounded-xl font-bold text-xs flex items-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" /> Back to Mapping
                </Button>
                <Button
                  onClick={handleExecuteImport}
                  disabled={validRows.length === 0 || importingLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-6 rounded-xl shadow-md flex items-center gap-2"
                >
                  {importingLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Importing Transactions...
                    </>
                  ) : (
                    <>
                      Import {validRows.length} Valid Transactions <Sparkles className="h-4 w-4 fill-white" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: IMPORT RESULT SUMMARY */}
          {step === 4 && importResult && (
            <div className="max-w-xl mx-auto space-y-6 text-center py-6 animate-in zoom-in-95 duration-200">
              <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 inline-block">
                <CheckCircle className="h-12 w-12" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                  Import Complete!
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Your bank transactions have been processed and saved into your account.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-left">
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Imported</p>
                  <p className="text-xl font-extrabold text-emerald-600">{importResult.importedCount}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Skipped (Dupes)</p>
                  <p className="text-xl font-extrabold text-amber-500">{importResult.skippedCount}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Failed</p>
                  <p className="text-xl font-extrabold text-red-500">{importResult.failedCount}</p>
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-bold">Total Debits:</span>
                  <span className="font-extrabold text-red-600">{formatCurrency(importResult.totalDebits, "INR")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-bold">Total Credits:</span>
                  <span className="font-extrabold text-emerald-600">{formatCurrency(importResult.totalCredits, "INR")}</span>
                </div>
                {importResult.startDate && importResult.endDate && (
                  <div className="flex justify-between border-t border-zinc-200 dark:border-zinc-800 pt-2 mt-2">
                    <span className="text-zinc-400 font-bold">Date Range:</span>
                    <span className="font-mono text-zinc-700 dark:text-zinc-300">
                      {importResult.startDate} — {importResult.endDate}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="h-10 px-5 rounded-xl font-bold text-xs"
                >
                  Import Another File
                </Button>
                <Button
                  onClick={() => {
                    onSuccess();
                    onClose();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-xl shadow-md"
                >
                  View Transactions
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
