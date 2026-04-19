const items = [
  "Crafted in Europe",
  "14-day returns",
  "Carbon-neutral shipping",
  "Since 2020",
  "Made to last",
  "Minimalist essentials",
];

export default function Marquee() {
  return (
    <div className="border-y border-line overflow-hidden py-5">
      <div className="marquee-inner whitespace-nowrap flex gap-16 w-max">
        {[...items, ...items].map((t, i) => (
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
