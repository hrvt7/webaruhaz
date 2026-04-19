import { getT } from "@/i18n/server";

export default async function AboutPage() {
  const { locale } = await getT();

  const content = {
    hu: {
      overline: "A történetünk",
      title: "Csendes mesterség.\nEurópában készítve.",
      p1: "A LUNARA 2020-ban indult Budapesten, azzal a szándékkal, hogy csendes, tartós alapdarabokat kínáljon — a gyorsdivat túlkínálata helyett. Minden kollekció európai műhelyekben készül, válogatott olasz, portugál és magyar szövőkből.",
      p2: "A gondolkodásunk egyszerű: kevesebb, de jobb. Kevesebb szín, kevesebb fazon, kevesebb kompromisszum. Minden darab tíz évre szánt döntés.",
      p3: "A fenntarthatóság nem marketing: a mintákat gondosan vágjuk, a szövethulladékot újrahasznosítjuk, a csomagolás 100%-ban újrapapír.",
      stats: [
        ["2020", "Alapítva Budapesten"],
        ["14 éves", "átlagos hordásidő"],
        ["100%", "európai gyártás"],
      ],
    },
    en: {
      overline: "Our story",
      title: "Quiet craft.\nBuilt in Europe.",
      p1: "LUNARA was founded in 2020 in Budapest with one intention: to offer quiet, durable essentials instead of the overflow of fast fashion. Each collection is made in European workshops from selected Italian, Portuguese and Hungarian mills.",
      p2: "Our thinking is simple: fewer, better. Fewer colours, fewer silhouettes, fewer compromises. Every piece is a ten-year decision.",
      p3: "Sustainability is not marketing: we cut patterns carefully, recycle fabric waste, and our packaging is 100% recycled paper.",
      stats: [
        ["2020", "Founded in Budapest"],
        ["14 yrs", "average wear life"],
        ["100%", "European production"],
      ],
    },
    de: {
      overline: "Unsere Geschichte",
      title: "Leises Handwerk.\nGefertigt in Europa.",
      p1: "LUNARA wurde 2020 in Budapest gegründet — mit der Absicht, leise, langlebige Essentials anzubieten, statt dem Überfluss der Fast Fashion. Jede Kollektion entsteht in europäischen Werkstätten aus ausgewählten italienischen, portugiesischen und ungarischen Stoffen.",
      p2: "Unser Ansatz: weniger, aber besser. Weniger Farben, weniger Silhouetten, weniger Kompromisse. Jedes Stück ist eine Entscheidung für zehn Jahre.",
      p3: "Nachhaltigkeit ist kein Marketing: wir schneiden Muster sorgfältig, recyceln Stoffreste und unsere Verpackung besteht zu 100% aus Recyclingpapier.",
      stats: [
        ["2020", "Gegründet in Budapest"],
        ["14 J.", "durchschnittliche Trage­dauer"],
        ["100%", "europäische Fertigung"],
      ],
    },
  }[locale];

  return (
    <>
      <section className="relative h-[60vh] min-h-[440px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80&auto=format&fit=crop"
          alt="LUNARA"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="relative z-10 h-full grid place-items-end px-6 md:px-10 pb-14 text-white">
          <div className="max-w-[1440px] w-full mx-auto">
            <div className="text-[11px] tracking-widest-3 uppercase mb-4 opacity-90">{content.overline}</div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] whitespace-pre-line">{content.title}</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 space-y-10 text-lg leading-relaxed text-muted">
        <p>{content.p1}</p>
        <p>{content.p2}</p>
        <p>{content.p3}</p>
      </section>

      <section className="bg-bone py-20">
        <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-3 gap-10 text-center">
          {content.stats.map((s) => (
            <div key={s[1]}>
              <div className="font-display text-5xl md:text-6xl">{s[0]}</div>
              <div className="mt-3 text-[11px] tracking-widest-2 uppercase text-muted">
                {s[1]}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
