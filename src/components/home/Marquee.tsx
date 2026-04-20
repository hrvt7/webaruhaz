"use client";

import { LocalizedText, localize } from "@/lib/localize";
import { useT } from "@/i18n/provider";

const DEFAULT_ITEMS: Record<"hu" | "en" | "de", string[]> = {
  hu: ["Magyar márka", "Ingyenes szállítás 30.000 Ft felett", "14 napos visszaküldés", "Edzésre szabva"],
  en: ["Hungarian brand", "Free shipping over 30.000 Ft", "14-day returns", "Made for training"],
  de: ["Ungarische Marke", "Kostenloser Versand ab 30.000 Ft", "14 Tage Rückgabe", "Für das Training gemacht"],
};

export default function Marquee({ items }: { items?: LocalizedText[] }) {
  const { locale } = useT();
  const localized = (items ?? [])
    .map((it) => localize(it, locale))
    .filter((s) => s.trim().length > 0);
  const list = localized.length > 0 ? localized : DEFAULT_ITEMS[locale];
  return (
    <div className="border-y border-line overflow-hidden py-5">
      <div className="marquee-inner whitespace-nowrap flex gap-16 w-max">
        {[...list, ...list].map((t, i) => (
          <span
            key={i}
            className="text-[11px] tracking-widest-3 uppercase text-muted"
          >
            {t} <span className="mx-8 opacity-40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
