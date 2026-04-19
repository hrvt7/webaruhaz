import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function NewArrivals() {
  const items = products.slice(0, 8);
  return (
    <section className="bg-bone py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
              Just In
            </div>
            <h2 className="font-display text-3xl md:text-5xl">New arrivals</h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-[11px] tracking-widest-2 uppercase hover:opacity-60"
          >
            View all →
          </Link>
        </div>

        <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar -mx-6 md:mx-0 px-6 md:px-0 snap-x snap-mandatory">
          {items.map((p) => (
            <div
              key={p.slug}
              className="shrink-0 snap-start w-[70%] sm:w-[45%] md:w-[30%] lg:w-[23%]"
            >
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
