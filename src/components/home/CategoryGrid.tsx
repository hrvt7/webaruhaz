"use client";

import Link from "next/link";
import { useT } from "@/i18n/provider";
import { Category, LandingContent } from "@/lib/store";
import { localize } from "@/lib/localize";

export default function CategoryGrid({
  data,
  categories,
}: {
  data?: LandingContent["categories"];
  categories: Category[];
}) {
  const { t, locale } = useT();

  // Kártyák forrása: a DB-ben lévő aktív kategóriák (kihagyva a "sale" alapértelmezetten)
  const cards = categories
    .filter((c) => c.slug !== "sale")
    .slice(0, 4) // max 4 kártya az esztétikáért
    .map((c) => ({
      title: localize(c.title, locale) || c.slug,
      href: `/shop/${c.slug}`,
      // Prioritás: kategória saját kép → landing-ban beállított legacy kép (ha van) → placeholder
      img:
        c.card_image ||
        (c.slug === "women" ? data?.women_image : null) ||
        (c.slug === "men" ? data?.men_image : null) ||
        (c.slug === "accessories" ? data?.sets_image : null) ||
        `/cat-${c.slug}.jpg`,
    }));

  if (cards.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 mb-10 md:mb-14">
        <div className="flex items-end justify-between">
          <div className="text-center md:text-left w-full md:w-auto">
            <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
              {t.home.theEdit}
            </div>
            <h2 className="font-display text-3xl md:text-5xl">{t.home.shopByCategory}</h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline text-[11px] tracking-widest-2 uppercase hover:opacity-60"
          >
            {t.home.viewAll}
          </Link>
        </div>
      </div>

      <div className={`hidden md:block mx-auto max-w-[1440px] px-6 md:px-10`}>
        <div
          className={`grid gap-4 md:gap-6 ${
            cards.length === 2 ? "md:grid-cols-2" : cards.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
          }`}
        >
          {cards.map((c) => (
            <Link key={c.title} href={c.href} className="group">
              <div className="hover-zoom aspect-[3/4] bg-bone overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.title} className="h-full w-full object-cover" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="font-display text-xl">{c.title}</div>
                <div className="text-[11px] tracking-widest-2 uppercase text-muted group-hover:text-ink transition-colors">
                  {t.home.shop}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="md:hidden flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-[15vw]">
        {cards.map((c) => (
          <Link key={c.title} href={c.href} className="shrink-0 snap-center w-[70vw] group">
            <div className="hover-zoom aspect-[3/4] bg-bone overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt={c.title} className="h-full w-full object-cover" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="font-display text-xl">{c.title}</div>
              <div className="text-[11px] tracking-widest-2 uppercase text-muted">
                {t.home.shop}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
