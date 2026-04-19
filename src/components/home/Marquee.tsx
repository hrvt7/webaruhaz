const DEFAULT_ITEMS = [
  "Magyar márka",
  "Ingyenes szállítás 30.000 Ft felett",
  "14 napos visszaküldés",
  "Edzésre szabva",
];

export default function Marquee({ items }: { items?: string[] }) {
  const list = items && items.length > 0 ? items : DEFAULT_ITEMS;
  return (
    <div className="border-y border-line overflow-hidden py-5">
      <div className="marquee-inner whitespace-nowrap flex gap-16 w-max">
        {[...list, ...list].map((t, i) => (
          <span
            key={i}
            className="text-[11px] tracking-widest-3 uppercase text-muted"
          >
            {t} <span className="mx-8 opacity-40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
