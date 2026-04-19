"use client";

import { useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { LOCALES, LOCALE_LABEL, Locale } from "@/i18n/dict";
import { useT } from "@/i18n/provider";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale } = useT();
  const [pending, start] = useTransition();

  const change = (next: Locale) => {
    start(async () => {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      window.location.reload();
    });
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={locale}
        onChange={(e) => change(e.target.value as Locale)}
        disabled={pending}
        className={`appearance-none bg-transparent pr-5 text-[11px] tracking-widest-2 uppercase cursor-pointer outline-none ${
          compact ? "" : ""
        }`}
      >
        {LOCALES.map((l) => (
          <option key={l} value={l}>
            {l.toUpperCase()} — {LOCALE_LABEL[l]}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        strokeWidth={1.8}
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
      />
    </div>
  );
}
