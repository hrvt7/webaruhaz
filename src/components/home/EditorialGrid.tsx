"use client";

import { useT } from "@/i18n/provider";
import { LandingContent } from "@/lib/store";
import { localize } from "@/lib/localize";

const CAPTIONS = {
  hu: ["Lendület", "Kitartás", "Fegyelem"],
  en: ["Momentum", "Endurance", "Discipline"],
  de: ["Momentum", "Ausdauer", "Disziplin"],
};

export default function EditorialGrid({
  data,
}: {
  data?: LandingContent["editorial"];
}) {
  const { t, locale } = useT();
  const captions = CAPTIONS[locale];
  const shots = [
    data?.image1 || "/landing-2.jpg",
    data?.image2 || "/landing-3.jpg",
    data?.image3 || "/landing-4.jpg",
  ];

  const overline = data?.overline === undefined ? t.home.editorial : localize(data.overline, locale);
  const title = data?.title === undefined ? t.home.lookbook : localize(data.title, locale);
  const showHeader = Boolean((overline && overline.trim()) || (title && title.trim()));
  const textStyle = data?.style?.text_color ? { color: data.style.text_color } : undefined;

  return (
    <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 md:py-28">
      {showHeader && (
        <div className="flex items-end justify-between mb-10" style={textStyle}>
          <div className="text-center md:text-left w-full md:w-auto">
            {overline && overline.trim() && (
              <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
                {overline}
              </div>
            )}
            {title && title.trim() && (
              <h2 className="font-display text-3xl md:text-5xl">{title}</h2>
            )}
          </div>
        </div>
      )}
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
