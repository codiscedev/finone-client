export interface TaxBracket {
  fromAmount: number;
  toAmount: number | null;
  ratePct: number;
}

export interface CountryTaxConfig {
  countryCode: string;
  countryName: string;
  currencyCode: string;
  currencySymbol: string;
  taxYear: string;
  standardDeduction: number;
  maxRetirementDeduction: number;
  maxHealthInsuranceDeduction: number;
  maxHomeLoanInterestDeduction: number;
  hasEducationBenefit: boolean;
  defaultRegime: string;
  alternativeRegimeName?: string;
  brackets: TaxBracket[];
  alternativeBrackets?: TaxBracket[];
  retirementProgramName: string;
  healthProgramName: string;
  housingProgramName: string;
}

export const GLOBAL_TAX_COUNTRIES: Record<string, CountryTaxConfig> = {
  "India": {
    countryCode: "IN",
    countryName: "India",
    currencyCode: "INR",
    currencySymbol: "₹",
    taxYear: "FY 2026-27",
    standardDeduction: 75000,
    maxRetirementDeduction: 200000, // 80C (1.5L) + 80CCD(1B) (50k)
    maxHealthInsuranceDeduction: 50000, // 80D
    maxHomeLoanInterestDeduction: 200000, // Sec 24(b)
    hasEducationBenefit: true,
    defaultRegime: "New Tax Regime",
    alternativeRegimeName: "Old Tax Regime",
    retirementProgramName: "Section 80C & NPS (80CCD)",
    healthProgramName: "Section 80D (Mediclaim)",
    housingProgramName: "Section 24(b) & HRA Exemption",
    brackets: [
      { fromAmount: 0, toAmount: 300000, ratePct: 0 },
      { fromAmount: 300000, toAmount: 700000, ratePct: 5 },
      { fromAmount: 700000, toAmount: 1000000, ratePct: 10 },
      { fromAmount: 1000000, toAmount: 1200000, ratePct: 15 },
      { fromAmount: 1200000, toAmount: 1500000, ratePct: 20 },
      { fromAmount: 1500000, toAmount: null, ratePct: 30 }
    ],
    alternativeBrackets: [
      { fromAmount: 0, toAmount: 250000, ratePct: 0 },
      { fromAmount: 250000, toAmount: 500000, ratePct: 5 },
      { fromAmount: 500000, toAmount: 1000000, ratePct: 20 },
      { fromAmount: 1000000, toAmount: null, ratePct: 30 }
    ]
  },
  "United States": {
    countryCode: "US",
    countryName: "United States",
    currencyCode: "USD",
    currencySymbol: "$",
    taxYear: "Tax Year 2026",
    standardDeduction: 14600,
    maxRetirementDeduction: 30000, // 401(k) $23k + IRA $7k
    maxHealthInsuranceDeduction: 4150, // HSA Single
    maxHomeLoanInterestDeduction: 750000,
    hasEducationBenefit: true, // Student loan interest up to $2,500
    defaultRegime: "Standard Deduction",
    alternativeRegimeName: "Itemized Deductions",
    retirementProgramName: "401(k) & Traditional IRA",
    healthProgramName: "HSA / FSA Health Savings",
    housingProgramName: "Mortgage Interest & Property Tax (SALT)",
    brackets: [
      { fromAmount: 0, toAmount: 11600, ratePct: 10 },
      { fromAmount: 11600, toAmount: 47150, ratePct: 12 },
      { fromAmount: 47150, toAmount: 100525, ratePct: 22 },
      { fromAmount: 100525, toAmount: 191950, ratePct: 24 },
      { fromAmount: 191950, toAmount: 243725, ratePct: 32 },
      { fromAmount: 243725, toAmount: 609350, ratePct: 35 },
      { fromAmount: 609350, toAmount: null, ratePct: 37 }
    ]
  },
  "United Kingdom": {
    countryCode: "GB",
    countryName: "United Kingdom",
    currencyCode: "GBP",
    currencySymbol: "£",
    taxYear: "2026-27",
    standardDeduction: 12570, // Personal Allowance
    maxRetirementDeduction: 60000, // Annual Pension Allowance
    maxHealthInsuranceDeduction: 0,
    maxHomeLoanInterestDeduction: 0,
    hasEducationBenefit: false,
    defaultRegime: "PAYE / Self Assessment",
    retirementProgramName: "Workplace Pension & SIPP Relief",
    healthProgramName: "NHS / Private Medical",
    housingProgramName: "Primary Residence Relief",
    brackets: [
      { fromAmount: 0, toAmount: 12570, ratePct: 0 },
      { fromAmount: 12570, toAmount: 50270, ratePct: 20 },
      { fromAmount: 50270, toAmount: 125140, ratePct: 40 },
      { fromAmount: 125140, toAmount: null, ratePct: 45 }
    ]
  },
  "Singapore": {
    countryCode: "SG",
    countryName: "Singapore",
    currencyCode: "SGD",
    currencySymbol: "S$",
    taxYear: "YA 2026",
    standardDeduction: 1000,
    maxRetirementDeduction: 15300, // SRS Supplementary Retirement Scheme
    maxHealthInsuranceDeduction: 8000, // MediSave Top-Up
    maxHomeLoanInterestDeduction: 0,
    hasEducationBenefit: true,
    defaultRegime: "Progressive Resident Tax",
    retirementProgramName: "CPF & SRS Voluntary Top-up",
    healthProgramName: "MediSave & MediShield Relief",
    housingProgramName: "CPF Housing Grant Scheme",
    brackets: [
      { fromAmount: 0, toAmount: 20000, ratePct: 0 },
      { fromAmount: 20000, toAmount: 30000, ratePct: 2 },
      { fromAmount: 30000, toAmount: 40000, ratePct: 3.5 },
      { fromAmount: 40000, toAmount: 80000, ratePct: 7 },
      { fromAmount: 80000, toAmount: 120000, ratePct: 11.5 },
      { fromAmount: 120000, toAmount: 160000, ratePct: 15 },
      { fromAmount: 160000, toAmount: 200000, ratePct: 18 },
      { fromAmount: 200000, toAmount: 240000, ratePct: 19 },
      { fromAmount: 240000, toAmount: 280000, ratePct: 19.5 },
      { fromAmount: 280000, toAmount: 320000, ratePct: 20 },
      { fromAmount: 320000, toAmount: null, ratePct: 22 }
    ]
  },
  "United Arab Emirates": {
    countryCode: "AE",
    countryName: "United Arab Emirates",
    currencyCode: "AED",
    currencySymbol: "د.إ",
    taxYear: "2026",
    standardDeduction: 0,
    maxRetirementDeduction: 0,
    maxHealthInsuranceDeduction: 0,
    maxHomeLoanInterestDeduction: 0,
    hasEducationBenefit: false,
    defaultRegime: "0% Personal Income Tax",
    retirementProgramName: "DIFC Employee Workplace Savings (DEWS)",
    healthProgramName: "Mandatory Employer Health Cover",
    housingProgramName: "Municipality Housing Fee",
    brackets: [
      { fromAmount: 0, toAmount: null, ratePct: 0 }
    ]
  },
  "Canada": {
    countryCode: "CA",
    countryName: "Canada",
    currencyCode: "CAD",
    currencySymbol: "C$",
    taxYear: "2026",
    standardDeduction: 15705, // Basic Personal Amount (BPA)
    maxRetirementDeduction: 31560, // RRSP limit
    maxHealthInsuranceDeduction: 2635,
    maxHomeLoanInterestDeduction: 0,
    hasEducationBenefit: true,
    defaultRegime: "Federal + Provincial Tax",
    retirementProgramName: "RRSP & TFSA Tax-Free Savings",
    healthProgramName: "Medical Expense Tax Credit",
    housingProgramName: "First-Time Home Buyer Tax Credit",
    brackets: [
      { fromAmount: 0, toAmount: 55867, ratePct: 15 },
      { fromAmount: 55867, toAmount: 111733, ratePct: 20.5 },
      { fromAmount: 111733, toAmount: 173205, ratePct: 26 },
      { fromAmount: 173205, toAmount: 246752, ratePct: 29 },
      { fromAmount: 246752, toAmount: null, ratePct: 33 }
    ]
  },
  "Germany": {
    countryCode: "DE",
    countryName: "Germany",
    currencyCode: "EUR",
    currencySymbol: "€",
    taxYear: "2026",
    standardDeduction: 11784, // Grundfreibetrag
    maxRetirementDeduction: 27566, // Altersvorsorgeaufwendungen
    maxHealthInsuranceDeduction: 2800,
    maxHomeLoanInterestDeduction: 0,
    hasEducationBenefit: true,
    defaultRegime: "Progressive Income Tax",
    retirementProgramName: "Rürup-Rente / Riester-Rente",
    healthProgramName: "Krankenversicherung & Pflege",
    housingProgramName: "Wohnungsbauprämie",
    brackets: [
      { fromAmount: 0, toAmount: 11784, ratePct: 0 },
      { fromAmount: 11784, toAmount: 17005, ratePct: 14 },
      { fromAmount: 17005, toAmount: 66760, ratePct: 24 },
      { fromAmount: 66760, toAmount: 277825, ratePct: 42 },
      { fromAmount: 277825, toAmount: null, ratePct: 45 }
    ]
  }
};

export function getCountryTaxConfig(countryName: string): CountryTaxConfig {
  if (!countryName) return GLOBAL_TAX_COUNTRIES["India"];
  const trimmed = countryName.trim();
  if (GLOBAL_TAX_COUNTRIES[trimmed]) return GLOBAL_TAX_COUNTRIES[trimmed];

  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(GLOBAL_TAX_COUNTRIES)) {
    if (key.toLowerCase() === lower || val.countryCode.toLowerCase() === lower) {
      return val;
    }
  }
  return GLOBAL_TAX_COUNTRIES["India"];
}

export function formatCountryCurrency(amount: number | null | undefined, countryName: string): string {
  const num = amount ?? 0;
  const config = getCountryTaxConfig(countryName);
  
  if (config.countryCode === "IN") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: config.currencyCode,
    maximumFractionDigits: 0
  }).format(num);
}
