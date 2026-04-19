import { getT } from "@/i18n/server";

export default async function StoresPage() {
  const { t } = await getT();
  return (
    <>
      <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-16 md:py-24">
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">{t.stores.findUs}</div>
        <h1 className="font-display text-5xl md:text-7xl">{t.stores.title}</h1>
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
            <div>{t.stores.hoursMonFri}</div>
            <div>{t.stores.hoursSat}</div>
            <div className="text-muted">{t.stores.hoursSun}</div>
          </div>
          <div className="mt-6 text-sm">
            <a href="tel:+36305252336" className="underline">+36 30 525 2336</a><br />
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
