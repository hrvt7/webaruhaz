"use client";

import Link from "next/link";
import { LandingContent } from "@/lib/store";
import { useT } from "@/i18n/provider";

export default function BrandStory({ data }: { data: LandingContent["brand_story"] }) {
  const { t } = useT();
  return (
    <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 md:py-32 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div className="aspect-[4/5] bg-ink overflow-hidden">
        <video
          src="/brand-story.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={data.image}
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-5">
          {t.home.ourStory}
        </div>
        <h2 className="font-display text-4xl md:text-5xl leading-[1.05] whitespace-pre-line">
          {data.title}
        </h2>
        <p className="mt-6 text-muted leading-relaxed max-w-md">{data.body_1}</p>
        {data.body_2 && (
          <p className="mt-4 text-muted leading-relaxed max-w-md">{data.body_2}</p>
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
