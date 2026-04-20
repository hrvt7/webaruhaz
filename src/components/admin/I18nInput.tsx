"use client";

import { useState } from "react";
import type { LocalizedText } from "@/lib/localize";
import { toI18nObject } from "@/lib/localize";

type LocaleKey = "hu" | "en" | "de";

const LABELS: Record<LocaleKey, string> = { hu: "HU", en: "EN", de: "DE" };

function useI18nValue(value: LocalizedText): {
  hu: string;
  en: string;
  de: string;
} {
  return toI18nObject(value);
}

/** Szövegmező 3 nyelvre. Az adminnak mindhárom nyelvre meg kell adnia
 *  (vagy ha üresen hagy egy nyelvet, a megjelenítéskor a hu-ra esik vissza). */
export function I18nText({
  label,
  value,
  onChange,
}: {
  label: string;
  value: LocalizedText;
  onChange: (v: { hu: string; en: string; de: string }) => void;
}) {
  const v = useI18nValue(value);
  const [tab, setTab] = useState<LocaleKey>("hu");
  const update = (k: LocaleKey, nv: string) => onChange({ ...v, [k]: nv });
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[10px] tracking-widest-2 uppercase text-muted">{label}</div>
        <div className="flex gap-1">
          {(Object.keys(LABELS) as LocaleKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`text-[10px] tracking-widest-2 uppercase px-2 py-0.5 ${
                tab === k ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              {LABELS[k]}
              {v[k].trim() ? "" : "·"}
            </button>
          ))}
        </div>
      </div>
      <input
        type="text"
        value={v[tab]}
        onChange={(e) => update(tab, e.target.value)}
        className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm"
      />
    </label>
  );
}

/** Textarea változat (hosszabb szöveghez). */
export function I18nTextarea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: LocalizedText;
  onChange: (v: { hu: string; en: string; de: string }) => void;
  rows?: number;
}) {
  const v = useI18nValue(value);
  const [tab, setTab] = useState<LocaleKey>("hu");
  const update = (k: LocaleKey, nv: string) => onChange({ ...v, [k]: nv });
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[10px] tracking-widest-2 uppercase text-muted">{label}</div>
        <div className="flex gap-1">
          {(Object.keys(LABELS) as LocaleKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`text-[10px] tracking-widest-2 uppercase px-2 py-0.5 ${
                tab === k ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              {LABELS[k]}
              {v[k].trim() ? "" : "·"}
            </button>
          ))}
        </div>
      </div>
      <textarea
        rows={rows}
        value={v[tab]}
        onChange={(e) => update(tab, e.target.value)}
        className="w-full border border-line focus:border-ink p-3 outline-none bg-transparent text-sm"
      />
    </label>
  );
}
