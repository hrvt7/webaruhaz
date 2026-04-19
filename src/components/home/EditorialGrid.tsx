const shots = [
  {
    src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1000&q=80&auto=format&fit=crop",
    caption: "Off duty — Merino & denim",
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&q=80&auto=format&fit=crop",
    caption: "The linen edit",
  },
  {
    src: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1000&q=80&auto=format&fit=crop",
    caption: "Tailoring — Spring 2026",
  },
];

export default function EditorialGrid() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 md:py-28">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
            Editorial
          </div>
          <h2 className="font-display text-3xl md:text-5xl">Lookbook</h2>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="hover-zoom aspect-[3/4] md:aspect-[4/5] md:row-span-2 bg-bone overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shots[0].src} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-4 left-4 text-white text-[11px] tracking-widest-2 uppercase drop-shadow">
            {shots[0].caption}
          </div>
        </div>
        {shots.slice(1).map((s) => (
          <div
            key={s.src}
            className="hover-zoom aspect-[4/3] bg-bone overflow-hidden relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt="" className="h-full w-full object-cover" />
            <div className="absolute bottom-4 left-4 text-white text-[11px] tracking-widest-2 uppercase drop-shadow">
              {s.caption}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
