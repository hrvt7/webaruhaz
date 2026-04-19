"use client";

import { useT } from "@/i18n/provider";

const MARQUEE = {
  hu: [
    "Európai gyártás",
    "14 napos visszaküldés",
    "Karbonsemleges szállítás",
    "2020 óta",
    "Hosszútávra tervezve",
    "Minimalista alapdarabok",
  ],
  en: [
    "Crafted in Europe",
    "14-day returns",
    "Carbon-neutral shipping",
    "Since 2020",
    "Made to last",
    "Minimalist essentials",
  ],
  de: [
    "In Europa gefertigt",
    "14 Tage Rückgabe",
    "CO₂-neutraler Versand",
    "Seit 2020",
    "Für die Ewigkeit",
    "Minimalistische Essentials",
  ],
};

export default function Marquee() {
  const { locale } = useT();
  const items = MARQUEE[locale];
  return (
    <div className="border-y border-line overflow-hidden py-5">
      <div className="marquee-inner whitespace-nowrap flex gap-16 w-max">
        {[...items, ...items].map((t, i) => (
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
