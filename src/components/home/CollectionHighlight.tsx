import Link from "next/link";

export default function CollectionHighlight() {
  return (
    <section className="relative h-[80vh] min-h-[520px] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1920&q=80&auto=format&fit=crop"
        alt="Spring 2026"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/30" />
      <div className="relative z-10 h-full grid place-items-center text-center text-white px-6">
        <div className="max-w-xl">
          <div className="text-[11px] tracking-widest-3 uppercase mb-5 opacity-90">
            Collection
          </div>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95]">
            Spring 2026
          </h2>
          <p className="mt-6 text-sm md:text-base opacity-90">
            Az új szezon. Könnyed szövetek, lágy palette, építkező sziluettek.
          </p>
          <Link
            href="/collections/spring-2026"
            className="inline-block mt-10 bg-white text-ink text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-bone transition-colors"
          >
            Discover the collection
          </Link>
        </div>
      </div>
    </section>
  );
}
