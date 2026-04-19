// HUF is the source of truth in the DB. Non-HU locales display / charge EUR.
// Exchange rate — update in one place; EUR ≈ 395 HUF (April 2026 reference).
export const HUF_TO_EUR = 395;

export type Currency = "HUF" | "EUR";
export type AppLocale = "hu" | "en" | "de";

export function currencyFor(locale: string): Currency {
  return locale === "hu" ? "HUF" : "EUR";
}

export function hufToEur(hufAmount: number): number {
  return hufAmount / HUF_TO_EUR;
}

export function hufToEurCents(hufAmount: number): number {
  return Math.round((hufAmount / HUF_TO_EUR) * 100);
}

const LOCALE_TAG: Record<AppLocale, string> = {
  hu: "hu-HU",
  en: "en-IE",
  de: "de-DE",
};

export function formatMoney(hufAmount: number, locale: AppLocale): string {
  const currency = currencyFor(locale);
  if (currency === "HUF") {
    return new Intl.NumberFormat("hu-HU").format(Math.round(hufAmount)) + " Ft";
  }
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(hufToEur(hufAmount));
}

export const FREE_SHIPPING_THRESHOLD_HUF = 30000;
export const SHIPPING_FEE_HUF = 1690;
