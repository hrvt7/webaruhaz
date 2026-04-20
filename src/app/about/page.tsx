import { getT } from "@/i18n/server";
import { getLanding } from "@/lib/store";
import { localize } from "@/lib/localize";

export const revalidate = 30;

// Fallback (akkor érvényes, ha az admin még nem töltötte ki az about szekciót)
const FALLBACK = {
  hu: {
    overline: "A történetünk",
    title: "Magyar márka.\nÉletformának tervezve.",
    p1: "Az Aetheris 2020-ban indult Budapesten, azzal a szándékkal, hogy prémium, magyar gyártású edzőruházatot kínáljon azoknak, akik nem hobbiként, hanem életformaként sportolnak.",
    p2: "Minden modellünket magunk is hordjuk edzés közben. Ha nem áll meg rajtunk egy hétig anélkül, hogy kinyúlna, nem áruljuk. Egyszerű szabály, erős eredmény.",
    p3: "Kitartás, fejlődés, közösség — ezekhez tervezzük a darabokat. Nem másolat: eredeti szabás, magyar műhely, átgondolt anyagválasztás.",
    stat1v: "2020",
    stat1l: "Alapítva Budapesten",
    stat2v: "100%",
    stat2l: "Magyar gyártás",
    stat3v: "0%",
    stat3l: "Kompromisszum",
  },
  en: {
    overline: "Our story",
    title: "Hungarian brand.\nBuilt for a lifestyle.",
    p1: "Aetheris was founded in 2020 in Budapest with a simple intention: to offer premium, Hungarian-made training apparel for those who treat sport as a lifestyle, not a hobby.",
    p2: "We wear every model ourselves while training. If it doesn't hold up on us for a week without stretching out, we don't sell it. Simple rule, strong result.",
    p3: "Endurance, progress, community — these are the goals we design for. Not copies: original cuts, Hungarian workshops, considered material choices.",
    stat1v: "2020",
    stat1l: "Founded in Budapest",
    stat2v: "100%",
    stat2l: "Hungarian production",
    stat3v: "0%",
    stat3l: "Compromise",
  },
  de: {
    overline: "Unsere Geschichte",
    title: "Ungarische Marke.\nFür einen Lebensstil gemacht.",
    p1: "Aetheris wurde 2020 in Budapest gegründet — mit der Absicht, hochwertige, in Ungarn gefertigte Trainingsbekleidung für alle anzubieten, die Sport als Lebensstil betrachten, nicht als Hobby.",
    p2: "Jedes Modell tragen wir selbst beim Training. Wenn es bei uns nicht eine Woche hält, ohne sich auszuleiern, verkaufen wir es nicht. Einfache Regel, starkes Ergebnis.",
    p3: "Ausdauer, Fortschritt, Gemeinschaft — für diese Ziele designen wir. Keine Kopien: originale Schnitte, ungarische Werkstätten, durchdachte Materialauswahl.",
    stat1v: "2020",
    stat1l: "Gegründet in Budapest",
    stat2v: "100%",
    stat2l: "Ungarische Fertigung",
    stat3v: "0%",
    stat3l: "Kompromiss",
  },
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1920&q=80&auto=format&fit=crop";

export default async function AboutPage() {
  const { locale } = await getT();
  const landing = await getLanding().catch(() => null);
  const data = landing?.about;
  const fb = FALLBACK[locale];

  // Admin mező vagy fallback
  const overline = localize(data?.overline, locale) || fb.overline;
  const title = localize(data?.title, locale) || fb.title;
  const p1 = localize(data?.body_1, locale) || fb.p1;
  const p2 = localize(data?.body_2, locale) || fb.p2;
  const p3 = localize(data?.body_3, locale) || fb.p3;
  const image = data?.image || DEFAULT_IMAGE;

  const stats: [string, string][] = [
    [localize(data?.stat_1_value, locale) || fb.stat1v, localize(data?.stat_1_label, locale) || fb.stat1l],
    [localize(data?.stat_2_value, locale) || fb.stat2v, localize(data?.stat_2_label, locale) || fb.stat2l],
    [localize(data?.stat_3_value, locale) || fb.stat3v, localize(data?.stat_3_label, locale) || fb.stat3l],
  ];

  const textStyle = data?.style?.text_color ? { color: data.style.text_color } : undefined;
  const isVideo = /\.(mp4|webm|mov|m4v)(\?|$)/i.test(image);

  return (
    <>
      <section className="relative h-[60vh] min-h-[440px] overflow-hidden">
        {isVideo ? (
          <video
            src={image}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-ink/30" />
        <div className="relative z-10 h-full grid place-items-end px-6 md:px-10 pb-14 text-white" style={textStyle}>
          <div className="max-w-[1440px] w-full mx-auto">
            <div className="text-[11px] tracking-widest-3 uppercase mb-4 opacity-90">{overline}</div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] whitespace-pre-line">{title}</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 space-y-10 text-lg leading-relaxed text-muted">
        {p1 && <p>{p1}</p>}
        {p2 && <p>{p2}</p>}
        {p3 && <p>{p3}</p>}
      </section>

      <section className="bg-bone py-20">
        <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-3 gap-10 text-center">
          {stats.map((s, i) => (
            s[0] || s[1] ? (
              <div key={`${s[1]}-${i}`}>
                <div className="font-display text-5xl md:text-6xl">{s[0]}</div>
                {s[1] && (
                  <div className="mt-3 text-[11px] tracking-widest-2 uppercase text-muted">
                    {s[1]}
                  </div>
                )}
              </div>
            ) : null
          ))}
        </div>
      </section>
    </>
  );
}
