import { getT } from "@/i18n/server";

export default async function ShippingPage() {
  const { c } = await getT();
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
        {c.shipping.overline}
      </div>
      <h1 className="font-display text-5xl md:text-6xl leading-[1]">
        {c.shipping.title}
      </h1>

      <div className="mt-14 space-y-10">
        {c.shipping.sections.map((s) => (
          <div key={s.t} className="border-b border-line pb-10">
            <div className="font-display text-xl mb-3">{s.t}</div>
            <p className="text-muted leading-relaxed">{s.b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
