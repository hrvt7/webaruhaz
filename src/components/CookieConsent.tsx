"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Consent = {
  necessary: true;
  statistics: boolean;
  marketing: boolean;
  ts: number;
};

const STORAGE_KEY = "aetheris-cookie-consent-v1";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function pushConsent(c: Consent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const gtag = (...args: unknown[]) => {
    window.dataLayer!.push(args);
  };
  window.gtag = window.gtag || gtag;
  window.gtag("consent", "update", {
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
    analytics_storage: c.statistics ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [detail, setDetail] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setShow(true);
        return;
      }
      const c = JSON.parse(raw) as Consent;
      pushConsent(c);
    } catch {
      setShow(true);
    }
  }, []);

  const save = (stats: boolean, mkt: boolean) => {
    const c: Consent = {
      necessary: true,
      statistics: stats,
      marketing: mkt,
      ts: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    } catch {}
    pushConsent(c);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Süti beállítások"
      className="fixed inset-x-0 bottom-0 z-[100] bg-white border-t border-line shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-5 md:py-6">
        <div className="grid md:grid-cols-[1fr_auto] gap-5 items-start md:items-center">
          <div>
            <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-2">
              Süti beállítások
            </div>
            <p className="text-sm text-ink leading-relaxed">
              Sütiket használunk az oldal működéséhez, a forgalom méréséhez és —
              a te döntésed alapján — marketing célra. Részletek az{" "}
              <Link href="/adatkezeles" className="underline hover:no-underline">
                Adatkezelési tájékoztatóban
              </Link>
              .
            </p>

            {detail && (
              <div className="mt-4 space-y-2 text-sm">
                <label className="flex items-center gap-3 opacity-60 cursor-not-allowed">
                  <input type="checkbox" checked readOnly className="accent-ink" />
                  <span>
                    <strong>Szükséges</strong> — az oldal működéséhez szükséges
                    sütik (kosár, bejelentkezés). Mindig aktív.
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statistics}
                    onChange={(e) => setStatistics(e.target.checked)}
                    className="accent-ink"
                  />
                  <span>
                    <strong>Statisztika</strong> — anonim látogatottsági adatok
                    (Google Analytics).
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="accent-ink"
                  />
                  <span>
                    <strong>Marketing</strong> — hirdetés-személyre szabás
                    (Meta Pixel, Google Ads).
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            {!detail ? (
              <button
                type="button"
                onClick={() => setDetail(true)}
                className="text-[11px] tracking-widest-2 uppercase px-5 py-3 border border-line hover:border-ink"
              >
                Beállítom
              </button>
            ) : (
              <button
                type="button"
                onClick={() => save(statistics, marketing)}
                className="text-[11px] tracking-widest-2 uppercase px-5 py-3 border border-line hover:border-ink"
              >
                Kiválasztottak mentése
              </button>
            )}
            <button
              type="button"
              onClick={() => save(false, false)}
              className="text-[11px] tracking-widest-2 uppercase px-5 py-3 border border-line hover:border-ink"
            >
              Csak szükséges
            </button>
            <button
              type="button"
              onClick={() => save(true, true)}
              className="text-[11px] tracking-widest-2 uppercase px-5 py-3 bg-ink text-white hover:bg-accent"
            >
              Mindet elfogadom
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
