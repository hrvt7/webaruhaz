import { cookies } from "next/headers";
import { DEFAULT_LOCALE, Locale, LOCALES, getDict } from "./dict";

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const v = c.get("lunara-locale")?.value as Locale | undefined;
  return v && LOCALES.includes(v) ? v : DEFAULT_LOCALE;
}

export async function getT() {
  const locale = await getLocale();
  return { locale, t: getDict(locale) };
}
