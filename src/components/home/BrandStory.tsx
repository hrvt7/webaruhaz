"use client";

import Link from "next/link";
import { LandingContent } from "@/lib/store";
import { useT } from "@/i18n/provider";

import { localize } from "@/lib/localize";

export default function BrandStory({ data }: { data: LandingContent["brand_story"] }) {
  const { t, locale } = useT();
  const overline = localize(data.overline, locale) || t.home.ourStory;
  const title = localize(data.title, locale);
  const body1 = localize(data.body_1, locale);
  const body2 = localize(data.body_2, locale);
  const textStyle = data.style?.text_color ? { color: data.style.text_color } : undefined;
  return (
    <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 md:py-32 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div className="aspect-[4/5] bg-ink overflow-hidden">
        {/\.(mp4|webm|mov|m4v)(\?|$)/i.test(data.image || "") ? (
          <video
            src={data.image || "/brand-story.mp4"}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={data.image || "/brand-story.mp4"}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="text-center md:text-left" style={textStyle}>
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-5">
          {overline}
        </div>
        <h2 className="font-display text-4xl md:text-5xl leading-[1.05] whitespace-pre-line">
          {title}
        </h2>
        {body1 && <p className="mt-6 text-muted leading-relaxed max-w-md mx-auto md:mx-0">{body1}</p>}
        {body2 && (
          <p className="mt-4 text-muted leading-relaxed max-w-md mx-auto md:mx-0">{body2}</p>
        )}
        <Link
          href="/about"
          className="inline-block mt-10 border border-ink text-ink text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-ink hover:text-white transition-colors"
        >
          {t.home.readMore}
        </Link>
      </div>
    </section>
  );
}
