import Link from "next/link";

export default function BrandStory() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 md:py-32 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div className="aspect-[4/5] bg-bone overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=80&auto=format&fit=crop"
          alt="Atelier"
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-5">
          Our story
        </div>
        <h2 className="font-display text-4xl md:text-5xl leading-[1.05]">
          Crafted in Europe.<br />
          Built to last.
        </h2>
        <p className="mt-6 text-muted leading-relaxed max-w-md">
          A LUNARA 2020-ban indult Budapesten, azzal a szándékkal, hogy csendes,
          minimalista alapdarabokat kínáljon a zsúfolt piac helyett. Minden darab
          európai műhelyekben, válogatott szövetekből készül — úgy, hogy évekig
          szolgáljon.
        </p>
        <p className="mt-4 text-muted leading-relaxed max-w-md">
          A wardrobe nem trend kérdése. A wardrobe egy hosszú döntéssorozat.
        </p>
        <Link
          href="/about"
          className="inline-block mt-10 border border-ink text-ink text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-ink hover:text-white transition-colors"
        >
          Read more
        </Link>
      </div>
    </section>
  );
}
