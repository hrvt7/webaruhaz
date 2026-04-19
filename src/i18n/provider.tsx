"use client";

import { createContext, useContext, ReactNode } from "react";
import { Dict, Locale, getDict } from "./dict";

type Ctx = { locale: Locale; t: Dict };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <I18nCtx.Provider value={{ locale, t: getDict(locale) }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useT(): Ctx {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useT must be used within I18nProvider");
  return ctx;
}
