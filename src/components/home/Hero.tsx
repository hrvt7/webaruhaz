import Link from "next/link";
import { LandingContent } from "@/lib/store";

export default function Hero({ data, dict }: { data: LandingContent["hero"]; dict: { shopWomen: string; shopMen: string } }) {
  return (
    <section className="relative h-screen min-h-[640px] -mt-[64px] bg-bone overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.image}
        alt="Hero"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1440px] h-full px-6 md:px-10 flex items-end md:items-center pb-16 md:pb-0">
        <div className="max-w-2xl text-white">
          <div className="text-[11px] tracking-widest-3 uppercase mb-6 opacity-90">
            {data.overline}
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[88px] leading-[0.95] tracking-tight">
            {data.title_line_1} <br /> {data.title_line_2}
          </h1>
          <p className="mt-6 text-sm md:text-base max-w-md opacity-90 leading-relaxed">
            {data.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/shop/women"
              className="bg-white text-ink text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-bone transition-colors"
            >
              {dict.shopWomen}
            </Link>
            <Link
              href="/shop/men"
              className="border border-white/70 text-white text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-white hover:text-ink transition-colors"
            >
              {dict.shopMen}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
