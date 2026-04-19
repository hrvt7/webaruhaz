"use client";

import Link from "next/link";
import { useT } from "@/i18n/provider";

export default function CategoryGrid() {
  const { t } = useT();
  const cards = [
    {
      title: t.nav.women,
      href: "/shop/women",
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80&auto=format&fit=crop",
    },
    {
      title: t.nav.men,
      href: "/shop/men",
      img: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=900&q=80&auto=format&fit=crop",
    },
    {
      title: t.nav.accessories,
      href: "/shop/accessories",
      img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80&auto=format&fit=crop",
    },
  ];
  return (
    <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 md:py-28">
      <div className="flex items-end justify-between mb-10 md:mb-14">
        <div>
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
      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((c) => (
          <Link key={c.title} href={c.href} className="group">
            <div className="hover-zoom aspect-[3/4] bg-bone overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.img}
                alt={c.title}
                className="h-full w-full object-cover"
              />
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
    </section>
  );
}
