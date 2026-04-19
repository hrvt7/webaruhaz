export const metadata = { title: "Shipping & Returns" };

const sections = [
  {
    t: "Szállítás Magyarországon",
    b: "30.000 Ft feletti rendelés esetén ingyenes. 30.000 Ft alatt 1.690 Ft átalány. A csomagok GLS-szel 1–2 munkanap alatt érkeznek.",
  },
  {
    t: "Nemzetközi szállítás",
    b: "EU-n belül 3–5 munkanap, 6.900 Ft átalány. EU-n kívül egyedi ajánlatot adunk, kérlek írj az hello@lunara.hu címre.",
  },
  {
    t: "Express szállítás Budapesten",
    b: "Budapesten belül hétköznap 14:00 előtt leadott rendelésekre aznapi futárszolgálat elérhető, 3.900 Ft.",
  },
  {
    t: "Visszaküldés",
    b: "14 napos ingyenes visszaküldés minden online rendelésre. A terméknek eredeti állapotban, címkével kell visszakerülnie. Outlet termékek esetén csak csere lehetséges.",
  },
  {
    t: "Csere",
    b: "Más méretre vagy színre ingyenes csere a termék kézhezvételétől számított 30 napon belül. Írj az hello@lunara.hu címre a csere indításához.",
  },
  {
    t: "Garancia",
    b: "Minden LUNARA terméket 2 év gyártási garanciával értékesítünk. Anyag- vagy varrási hibát díjmentesen javítunk vagy cserélünk.",
  },
];

export default function ShippingPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">Info</div>
      <h1 className="font-display text-5xl md:text-6xl leading-[1]">Shipping & returns</h1>

      <div className="mt-14 space-y-10">
        {sections.map((s) => (
          <div key={s.t} className="border-b border-line pb-10">
            <div className="font-display text-xl mb-3">{s.t}</div>
            <p className="text-muted leading-relaxed">{s.b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
