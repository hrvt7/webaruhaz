export const metadata = { title: "About" };

export default function AboutPage() {
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
            <div className="text-[11px] tracking-widest-3 uppercase mb-4 opacity-90">Our story</div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95]">Quiet craft.<br />Built in Europe.</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 space-y-10 text-lg leading-relaxed text-muted">
        <p>
          A LUNARA 2020-ban indult Budapesten, azzal a szándékkal, hogy csendes,
          tartós alapdarabokat kínáljon — a gyorsdivat túlkínálata helyett.
          Minden kollekció európai műhelyekben készül, válogatott olasz,
          portugál és magyar szövőkből.
        </p>
        <p>
          A gondolkodásunk egyszerű: kevesebb, de jobb. Kevesebb szín, kevesebb
          fazon, kevesebb kompromisszum. Minden darab tíz évre szánt döntés.
        </p>
        <p>
          Fenntarthatóság nem marketing: a mintákat ólomkristály menta-gyapjúval
          vágjuk, a szövethulladékot újrahasznosítjuk, a csomagolás 100%-ban
          újrapapír.
        </p>
      </section>

      <section className="bg-bone py-20">
        <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-3 gap-10 text-center">
          {[
            { n: "2020", l: "Alapítva Budapesten" },
            { n: "14 éves", l: "átlagos tulajdonosi hordásidő" },
            { n: "100%", l: "európai gyártás" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-5xl md:text-6xl">{s.n}</div>
              <div className="mt-3 text-[11px] tracking-widest-2 uppercase text-muted">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
