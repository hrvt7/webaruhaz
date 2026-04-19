export const metadata = { title: "Size guide" };

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

export default function SizeGuidePage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">Guide</div>
      <h1 className="font-display text-5xl md:text-6xl leading-[1]">Size guide</h1>

      <p className="mt-6 text-muted leading-relaxed max-w-xl">
        Méreteink európai szabványon alapulnak. A megadott értékek az adott
        testméretnek megfelelőek — lazább fazonoknál eggyel kisebb, szűkebb
        szabásoknál eggyel nagyobb méret ajánlott.
      </p>

      <div className="mt-12 space-y-14">
        <Table title="Women" head={["Size", "Bust", "Waist", "Hips"]} rows={women} />
        <Table title="Men" head={["Size", "Chest", "Waist", "Hips"]} rows={men} />
        <Table title="Denim" head={["Size", "Waist (cm)", "Hips (cm)", "Inseam (cm)"]} rows={denim} />
      </div>

      <div className="mt-16 border-t border-line pt-10 text-sm text-muted leading-relaxed">
        Bizonytalan vagy? Írj nekünk az <a href="mailto:hello@lunara.hu" className="underline">hello@lunara.hu</a> címre, és stílusstábunk segít a méretválasztásban.
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
              {r.map((c, i) => (
                <td key={i} className="py-2">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
