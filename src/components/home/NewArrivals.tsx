"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";
import { useT } from "@/i18n/provider";

export default function NewArrivals({ items }: { items: Product[] }) {
  const { t } = useT();
  return (
    <section className="bg-bone py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
              {t.home.justIn}
            </div>
            <h2 className="font-display text-3xl md:text-5xl">{t.home.newArrivals}</h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-[11px] tracking-widest-2 uppercase hover:opacity-60"
          >
            {t.home.viewAll}
          </Link>
        </div>
      </div>

      <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-[15vw] sm:px-[27.5vw] md:px-[35vw] lg:px-[38.5vw]">
        {items.map((p) => (
          <div
            key={p.slug}
            className="shrink-0 snap-center w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[23vw]"
          >
            <ProductCard p={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
