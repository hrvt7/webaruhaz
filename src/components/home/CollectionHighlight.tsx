"use client";

import Link from "next/link";
import { LandingContent } from "@/lib/store";
import { useT } from "@/i18n/provider";

export default function CollectionHighlight({
  data,
}: {
  data: LandingContent["collection_highlight"];
}) {
  const { t } = useT();
  return (
    <section className="relative h-[80vh] min-h-[520px] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={data.image} alt={data.title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-ink/30" />
      <div className="relative z-10 h-full grid place-items-center text-center text-white px-6">
        <div className="max-w-xl">
          <div className="text-[11px] tracking-widest-3 uppercase mb-5 opacity-90">
            {t.home.collection}
          </div>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95]">{data.title}</h2>
          <p className="mt-6 text-sm md:text-base opacity-90">{data.subtitle}</p>
          <Link
            href={`/collections/${data.slug}`}
            className="inline-block mt-10 bg-white text-ink text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-bone transition-colors"
          >
            {t.home.discoverCollection}
          </Link>
        </div>
      </div>
    </section>
  );
}
