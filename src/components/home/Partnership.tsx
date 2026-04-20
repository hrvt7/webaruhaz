"use client";

import { LandingContent } from "@/lib/store";

const FALLBACK = {
  overline: "Partnerség · 2026",
  title: "Hajrá Szombathely.",
  body_1:
    "A Szombathelyi Kézilabda Klub és Akadémia együttműködik az Aetherisszel. Az általunk készített edzőruhát az SZKKA lányai fogják hordani a felkészülés és a hétköznapi edzések során a szezon végéig.",
  body_2:
    "Egy magyar márka, egy magyar csapat, egy közös szemlélet: küzdeni, csapatban gondolkodni, kitartani.",
  image: "/partnership-szkka.jpg",
  link: "https://www.szombathelyikezilabda.hu/hirek/uj-helyi-egyuttmukodes-az-szkka-es-az-aetheris-kozott",
  cta: "Elolvasom a hírt →",
};

export default function Partnership({
  data,
}: {
  data?: LandingContent["partnership"];
}) {
  const overline = data?.overline?.trim() || FALLBACK.overline;
  const title = data?.title?.trim() || FALLBACK.title;
  const body_1 = data?.body_1?.trim() || FALLBACK.body_1;
  const body_2 = data?.body_2?.trim() || FALLBACK.body_2;
  const image = data?.image?.trim() || FALLBACK.image;
  const link = data?.link?.trim() || FALLBACK.link;
  const cta = data?.cta?.trim() || FALLBACK.cta;

  const isVideo = /\.(mp4|webm|mov|m4v)(\?|$)/i.test(image);

  return (
    <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 md:py-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div className="aspect-[4/3] bg-bone overflow-hidden order-2 md:order-1">
        {isVideo ? (
          <video
            src={image}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={image} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="text-center md:text-left order-1 md:order-2">
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-5">
          {overline}
        </div>
        <h2 className="font-display text-3xl md:text-5xl leading-[1.05]">
          {title}
        </h2>
        <p className="mt-6 text-muted leading-relaxed max-w-md mx-auto md:mx-0 whitespace-pre-line">
          {body_1}
        </p>
        {body_2 && (
          <p className="mt-4 text-muted leading-relaxed max-w-md mx-auto md:mx-0 whitespace-pre-line">
            {body_2}
          </p>
        )}
        {link && cta && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-10 border border-ink text-ink text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-ink hover:text-white transition-colors"
          >
            {cta}
          </a>
        )}
      </div>
    </section>
  );
}
