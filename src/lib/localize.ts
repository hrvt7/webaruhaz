import type { Locale } from "@/i18n/dict";

// A szöveg lehet régi, egynyelvű string (legacy), vagy új, lokalizált objektum.
// Az objektum részei mind opcionálisak — a `localize` visszalép a hu-ra fallback-ként.
export type LocalizedText =
  | string
  | { hu?: string; en?: string; de?: string }
  | null
  | undefined;

export function localize(value: LocalizedText, locale: Locale): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[locale] || value.hu || value.en || value.de || "";
}

// Biztonsági olvasás: elfogadja akár a régi, akár az új szerkezetet, és mindig {hu,en,de} formában ad vissza.
export function toI18nObject(value: LocalizedText): {
  hu: string;
  en: string;
  de: string;
} {
  if (value == null) return { hu: "", en: "", de: "" };
  if (typeof value === "string") return { hu: value, en: "", de: "" };
  return {
    hu: value.hu ?? "",
    en: value.en ?? "",
    de: value.de ?? "",
  };
}

// Admin beállítás után: ha mindhárom üres, ne mentsen JSONB-t (maradjon undefined vagy üres string).
export function cleanI18n(
  v: { hu: string; en: string; de: string },
): { hu?: string; en?: string; de?: string } | undefined {
  const out: { hu?: string; en?: string; de?: string } = {};
  if (v.hu.trim()) out.hu = v.hu;
  if (v.en.trim()) out.en = v.en;
  if (v.de.trim()) out.de = v.de;
  if (!out.hu && !out.en && !out.de) return undefined;
  return out;
}
