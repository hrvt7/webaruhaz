"use client";

import { useState } from "react";
import { useT } from "@/i18n/provider";
import { LandingContent } from "@/lib/store";
import { localize } from "@/lib/localize";

const FALLBACK = {
  hu: {
    overline: "Hírlevél",
    title: "Iratkozz fel a hírlevelünkre",
    body: "Új kollekciók, akciós kódok, csendes ajánlatok — havonta egyszer, nem többször.",
  },
  en: {
    overline: "Newsletter",
    title: "Join our newsletter",
    body: "New collections, discount codes, quiet offers — once a month, no more.",
  },
  de: {
    overline: "Newsletter",
    title: "Abonniere unseren Newsletter",
    body: "Neue Kollektionen, Rabattcodes, leise Angebote — einmal im Monat, nicht mehr.",
  },
};

export default function Newsletter({
  data,
}: {
  data?: LandingContent["newsletter"];
}) {
  const { t, locale } = useT();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const fb = FALLBACK[locale];
  const overline = localize(data?.overline, locale) || fb.overline;
  const title = localize(data?.title, locale) || fb.title;
  const body = localize(data?.body, locale) || fb.body;
  const textStyle = data?.style?.text_color ? { color: data.style.text_color } : undefined;

  return (
    <section className="bg-ink text-white py-24" style={textStyle}>
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="text-[11px] tracking-widest-3 uppercase opacity-70 mb-5">
          {overline}
        </div>
        <h2 className="font-display text-3xl md:text-5xl leading-tight">
          {title}
        </h2>
        <p className="mt-5 text-sm md:text-base opacity-80 max-w-md mx-auto">
          {body}
        </p>
        {sent ? (
          <div className="mt-10 text-sm opacity-90">{t.home.thanksSubscribe}</div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email.trim()) return;
              try {
                await fetch("/api/newsletter/subscribe", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ email: email.trim(), source: "footer" }),
                });
              } catch {}
              setSent(true);
            }}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.home.yourEmail}
              className="flex-1 bg-transparent border-b border-white/40 focus:border-white py-2 text-sm outline-none text-center sm:text-left"
            />
            <button className="bg-white text-ink text-[11px] tracking-widest-2 uppercase px-6 py-3 hover:bg-bone transition-colors">
              {t.home.subscribe}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
