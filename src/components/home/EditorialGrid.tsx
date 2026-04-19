"use client";

import { useT } from "@/i18n/provider";

const CAPTIONS = {
  hu: ["Lendület", "Kitartás", "Fegyelem"],
  en: ["Momentum", "Endurance", "Discipline"],
  de: ["Momentum", "Ausdauer", "Disziplin"],
};

export default function EditorialGrid() {
  const { t, locale } = useT();
  const captions = CAPTIONS[locale];
  const shots = ["/landing-2.jpg", "/landing-3.jpg", "/landing-4.jpg"];

  return (
    <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 md:py-28">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
            {t.home.editorial}
          </div>
          <h2 className="font-display text-3xl md:text-5xl">{t.home.lookbook}</h2>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="hover-zoom aspect-[3/4] md:aspect-[4/5] md:row-span-2 bg-bone overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shots[0]} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-4 left-4 text-white text-[11px] tracking-widest-2 uppercase drop-shadow">
            {captions[0]}
          </div>
        </div>
        {shots.slice(1).map((s, i) => (
          <div key={s} className="hover-zoom aspect-[4/3] bg-bone overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s} alt="" className="h-full w-full object-cover" />
            <div className="absolute bottom-4 left-4 text-white text-[11px] tracking-widest-2 uppercase drop-shadow">
              {captions[i + 1]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
