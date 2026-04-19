import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[calc(100vh-64px)] min-h-[640px] bg-bone overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80&auto=format&fit=crop"
        alt="Spring 2026 editorial"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1440px] h-full px-6 md:px-10 flex items-end md:items-center pb-16 md:pb-0">
        <div className="max-w-2xl text-white">
          <div className="text-[11px] tracking-widest-3 uppercase mb-6 opacity-90">
            Spring / Summer 2026
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[88px] leading-[0.95] tracking-tight">
            Quiet <br /> Luxury.
          </h1>
          <p className="mt-6 text-sm md:text-base max-w-md opacity-90 leading-relaxed">
            Minimalista alapdarabok európai szövetekből. Csendesen, tartósan,
            időtlenül.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/shop/women"
              className="bg-white text-ink text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-bone transition-colors"
            >
              Shop Women
            </Link>
            <Link
              href="/shop/men"
              className="border border-white/70 text-white text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-white hover:text-ink transition-colors"
            >
              Shop Men
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 text-white text-[10px] tracking-widest-3 uppercase opacity-80 hidden md:block">
        Scroll ↓
      </div>
    </section>
  );
}
