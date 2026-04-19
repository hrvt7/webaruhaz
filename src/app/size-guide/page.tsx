import { getT } from "@/i18n/server";

const women = [
  ["XS", "80–84", "60–64", "86–90"],
  ["S", "84–88", "64–68", "90–94"],
  ["M", "88–92", "68–72", "94–98"],
  ["L", "92–98", "72–78", "98–104"],
  ["XL", "98–104", "78–84", "104–110"],
];

const men = [
  ["S", "92–96", "76–80", "96–100"],
  ["M", "96–100", "80–84", "100–104"],
  ["L", "100–104", "84–88", "104–108"],
  ["XL", "104–108", "88–92", "108–112"],
];

const denim = [
  ["26", "68", "92", "76"],
  ["28", "72", "96", "78"],
  ["30", "76", "100", "80"],
  ["32", "80", "104", "82"],
  ["34", "84", "108", "84"],
  ["36", "88", "112", "86"],
];

export default async function SizeGuidePage() {
  const { c } = await getT();
  const h = c.sizeGuide.headers;
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
        {c.sizeGuide.overline}
      </div>
      <h1 className="font-display text-5xl md:text-6xl leading-[1]">
        {c.sizeGuide.title}
      </h1>

      <p className="mt-6 text-muted leading-relaxed max-w-xl">{c.sizeGuide.intro}</p>

      <div className="mt-12 space-y-14">
        <Table title={c.sizeGuide.women} head={[h.size, h.bust, h.waist, h.hips]} rows={women} />
        <Table title={c.sizeGuide.men} head={[h.size, h.chest, h.waist, h.hips]} rows={men} />
        <Table title={c.sizeGuide.denim} head={[h.size, h.waist, h.hips, h.inseam]} rows={denim} />
      </div>

      <div className="mt-16 border-t border-line pt-10 text-sm text-muted leading-relaxed">
        {c.sizeGuide.unsure}
      </div>
    </section>
  );
}

function Table({
  title,
  head,
  rows,
}: {
  title: string;
  head: string[];
  rows: string[][];
}) {
  return (
    <div>
      <div className="font-display text-2xl mb-4">{title}</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] tracking-widest-2 uppercase text-muted">
            {head.map((h) => (
              <th key={h} className="text-left py-2 font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="price">
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-line">
              {r.map((cell, i) => (
                <td key={i} className="py-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
