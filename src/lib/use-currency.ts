/**
 * useCurrency — returns a formatter function based on the user's currency from auth token.
 * Falls back to INR (₹) if not present.
 */

// Map of currency codes to Intl locale hints
const CURRENCY_LOCALE_MAP: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  AED: "ar-AE",
  SGD: "en-SG",
  CAD: "en-CA",
  AUD: "en-AU",
};

export function formatCurrency(
  amount: number,
  currency: string = "INR"
): string {
  const locale = CURRENCY_LOCALE_MAP[currency] ?? "en-IN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCurrencySymbol(currency: string = "INR"): string {
  const locale = CURRENCY_LOCALE_MAP[currency] ?? "en-IN";
  return (
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    })
      .formatToParts(0)
      .find((p) => p.type === "currency")?.value ?? "₹"
  );
}
