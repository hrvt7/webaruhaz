export const metadata = { title: "Stores" };

export default function StoresPage() {
  return (
    <>
      <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-16 md:py-24">
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">Find us</div>
        <h1 className="font-display text-5xl md:text-7xl">Stores</h1>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 md:px-10 pb-24 grid md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-[4/3] bg-bone overflow-hidden mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format&fit=crop"
              alt="LUNARA Flagship"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="font-display text-2xl">LUNARA Flagship</div>
          <div className="mt-2 text-sm text-muted leading-relaxed">
            Bazilika 1051 Budapest<br />
            Október 6. utca 12.<br />
            Magyarország
          </div>
          <div className="mt-6 space-y-1 text-sm">
            <div>H–P 10:00 – 19:00</div>
            <div>Szo 10:00 – 17:00</div>
            <div className="text-muted">V zárva</div>
          </div>
          <div className="mt-6 text-sm">
            <a href="tel:+36301234567" className="underline">+36 30 123 4567</a><br />
            <a href="mailto:hello@lunara.hu" className="underline">hello@lunara.hu</a>
          </div>
        </div>

        <div className="aspect-[4/3] md:aspect-auto md:min-h-[520px] border border-line overflow-hidden">
          <iframe
            title="LUNARA Flagship"
            src="https://www.google.com/maps?q=Budapest%20Bazilika&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </section>
    </>
  );
}
