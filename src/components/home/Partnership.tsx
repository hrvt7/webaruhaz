"use client";

export default function Partnership() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 md:py-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div className="aspect-[4/3] bg-bone overflow-hidden order-2 md:order-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/partnership-szkka.jpg"
          alt="SZKKA × Aetheris együttműködés"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="text-center md:text-left order-1 md:order-2">
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-5">
          Partnerség · 2026
        </div>
        <h2 className="font-display text-3xl md:text-5xl leading-[1.05]">
          Hajrá Szombathely.
        </h2>
        <p className="mt-6 text-muted leading-relaxed max-w-md mx-auto md:mx-0">
          A <strong>Szombathelyi Kézilabda Klub és Akadémia</strong> együttműködik
          az Aetherisszel. Az általunk készített edzőruhát az SZKKA lányai fogják
          hordani a felkészülés és a hétköznapi edzések során a szezon végéig.
        </p>
        <p className="mt-4 text-muted leading-relaxed max-w-md mx-auto md:mx-0">
          Egy magyar márka, egy magyar csapat, egy közös szemlélet: <em>küzdeni,
          csapatban gondolkodni, kitartani.</em>
        </p>

        <a
          href="https://www.szombathelyikezilabda.hu/hirek/uj-helyi-egyuttmukodes-az-szkka-es-az-aetheris-kozott"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-10 border border-ink text-ink text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-ink hover:text-bone transition-colors"
        >
          Elolvasom a hírt →
        </a>
      </div>
    </section>
  );
}
