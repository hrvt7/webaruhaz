import Link from "next/link";
import { LandingContent } from "@/lib/store";
import { localize } from "@/lib/localize";
import type { Locale } from "@/i18n/dict";

export default function Hero({
  data,
  dict,
  locale,
}: {
  data: LandingContent["hero"];
  dict: { shopWomen: string; shopMen: string };
  locale: Locale;
}) {
  const overline = localize(data.overline, locale);
  const title1 = localize(data.title_line_1, locale);
  const title2 = localize(data.title_line_2, locale);
  const subtitle = localize(data.subtitle, locale);
  const ctaWomen = localize(data.cta_women, locale) || dict.shopWomen;
  const ctaMen = localize(data.cta_men, locale) || dict.shopMen;
  const textStyle = data.style?.text_color ? { color: data.style.text_color } : undefined;
  return (
    <section className="relative h-screen min-h-[640px] -mt-[96px] bg-ink overflow-hidden">
      {/\.(mp4|webm|mov|m4v)(\?|$)/i.test(data.image || "/hero-video.mp4") ? (
        <video
          src={data.image || "/hero-video.mp4"}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={data.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/10" />

      <div className="relative z-10 mx-auto max-w-[1440px] h-full px-6 md:px-10 flex items-end md:items-center pb-16 md:pb-0">
        <div className="max-w-2xl text-white text-center md:text-left mx-auto md:mx-0" style={textStyle}>
          {overline && (
            <div className="text-[11px] tracking-widest-3 uppercase mb-6 opacity-90">
              {overline}
            </div>
          )}
          <h1 className="font-display text-5xl md:text-7xl lg:text-[88px] leading-[0.95] tracking-tight">
            {title1} <br /> {title2}
          </h1>
          {subtitle && (
            <p className="mt-6 text-sm md:text-base max-w-md mx-auto md:mx-0 opacity-90 leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="mt-10 flex flex-wrap gap-3 justify-center md:justify-start">
            <Link
              href="/shop/women"
              className="bg-white text-ink text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-bone transition-colors"
            >
              {ctaWomen}
            </Link>
            <Link
              href="/shop/men"
              className="border border-white/70 text-white text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-white hover:text-ink transition-colors"
            >
              {ctaMen}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
