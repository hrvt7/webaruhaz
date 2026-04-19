"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "lunara-cookie-consent-v1";

type Consent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  setAt: string;
};

const CONTENT = {
  hu: {
    title: "Sütik (cookie) kezelése",
    body:
      "Az oldal működéséhez elengedhetetlen sütiket mindenképp használunk. Az analitikai és marketingsütik segítenek minket a szolgáltatás fejlesztésében. Az „Összes elfogadása” gombbal hozzájárulsz ezek használatához, vagy testre szabhatod.",
    acceptAll: "Összes elfogadása",
    onlyEssential: "Csak a szükségesek",
    customize: "Testreszabás",
    save: "Mentés",
    essential: "Szükséges",
    essentialNote:
      "Alapvető működéshez. Pl. bejelentkezés, kosár, nyelvválasztás.",
    analytics: "Analitika",
    analyticsNote:
      "Névtelen látogatási statisztikák az oldal fejlesztéséhez.",
    marketing: "Marketing",
    marketingNote: "Hirdetések személyre szabásához.",
    privacyLink: "Adatkezelési tájékoztató",
    always: "Mindig aktív",
  },
  en: {
    title: "Cookie preferences",
    body:
      "We use essential cookies to operate the site. Analytics and marketing cookies help us improve. Accept all or customize your choice below.",
    acceptAll: "Accept all",
    onlyEssential: "Essential only",
    customize: "Customize",
    save: "Save",
    essential: "Essential",
    essentialNote: "Required for core functionality (login, cart, language).",
    analytics: "Analytics",
    analyticsNote: "Anonymous visit stats for improvement.",
    marketing: "Marketing",
    marketingNote: "Personalised ad preferences.",
    privacyLink: "Privacy policy",
    always: "Always on",
  },
  de: {
    title: "Cookie-Einstellungen",
    body:
      "Wir verwenden notwendige Cookies für den Betrieb der Seite. Analyse- und Marketing-Cookies helfen uns zu verbessern. Alle akzeptieren oder individuell anpassen.",
    acceptAll: "Alle akzeptieren",
    onlyEssential: "Nur notwendige",
    customize: "Anpassen",
    save: "Speichern",
    essential: "Notwendig",
    essentialNote: "Für Login, Warenkorb, Sprache.",
    analytics: "Analyse",
    analyticsNote: "Anonyme Besuchsstatistiken.",
    marketing: "Marketing",
    marketingNote: "Personalisierte Werbung.",
    privacyLink: "Datenschutz",
    always: "Immer an",
  },
};

export default function CookieBanner({
  locale,
}: {
  locale: "hu" | "en" | "de";
}) {
  const t = CONTENT[locale] ?? CONTENT.hu;
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (c: Omit<Consent, "setAt" | "essential">) => {
    const consent: Consent = {
      essential: true,
      analytics: c.analytics,
      marketing: c.marketing,
      setAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(consent));
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-line shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8 py-5 md:py-6">
        {!expanded ? (
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="font-display text-lg">{t.title}</div>
              <p className="mt-1 text-xs md:text-sm text-muted leading-relaxed">
                {t.body}{" "}
                <Link href="/adatkezeles" className="underline">
                  {t.privacyLink}
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setExpanded(true)}
                className="border border-line px-4 py-2.5 text-[11px] tracking-widest-2 uppercase hover:border-ink"
              >
                {t.customize}
              </button>
              <button
                onClick={() => save({ analytics: false, marketing: false })}
                className="border border-line px-4 py-2.5 text-[11px] tracking-widest-2 uppercase hover:border-ink"
              >
                {t.onlyEssential}
              </button>
              <button
                onClick={() => save({ analytics: true, marketing: true })}
                className="bg-ink text-white px-5 py-2.5 text-[11px] tracking-widest-2 uppercase"
              >
                {t.acceptAll}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="font-display text-lg mb-4">{t.customize}</div>
            <div className="space-y-3 text-sm">
              <Row
                title={t.essential}
                note={t.essentialNote}
                alwaysOn
                always={t.always}
                checked
                onChange={() => {}}
              />
              <Row
                title={t.analytics}
                note={t.analyticsNote}
                checked={analytics}
                onChange={setAnalytics}
              />
              <Row
                title={t.marketing}
                note={t.marketingNote}
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => save({ analytics: false, marketing: false })}
                className="border border-line px-4 py-2.5 text-[11px] tracking-widest-2 uppercase hover:border-ink"
              >
                {t.onlyEssential}
              </button>
              <button
                onClick={() => save({ analytics, marketing })}
                className="bg-ink text-white px-5 py-2.5 text-[11px] tracking-widest-2 uppercase"
              >
                {t.save}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  title,
  note,
  checked,
  onChange,
  alwaysOn,
  always,
}: {
  title: string;
  note: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  alwaysOn?: boolean;
  always?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border border-line p-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted mt-0.5">{note}</div>
      </div>
      {alwaysOn ? (
        <span className="text-[10px] tracking-widest-2 uppercase text-muted whitespace-nowrap">
          {always}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onChange(!checked)}
          aria-pressed={checked}
          className={`relative w-10 h-6 rounded-full transition-colors ${
            checked ? "bg-ink" : "bg-muted/40"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              checked ? "translate-x-4" : ""
            }`}
          />
        </button>
      )}
    </div>
  );
}
