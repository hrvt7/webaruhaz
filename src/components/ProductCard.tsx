import Link from "next/link";
import {
  Product,
  formatHUF,
  productCompareAt,
} from "@/data/products";

export default function ProductCard({ p }: { p: Product }) {
  const compareAt = productCompareAt(p);
  const onSale = compareAt && compareAt > p.price;
  return (
    <Link href={`/product/${p.slug}`} className="group block">
      <div className="hover-zoom relative aspect-[3/4] bg-bone overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.images[0]}
          alt={p.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {p.images[1] && (
          <img
            src={p.images[1]}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        )}
        {p.badge && (
          <span className="absolute top-3 left-3 bg-white text-ink text-[10px] tracking-widest-2 uppercase px-2 py-1">
            {p.badge}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display text-[15px] leading-tight truncate">
            {p.name}
          </div>
          <div className="mt-1 text-[11px] tracking-widest-2 uppercase text-muted">
            {p.colors.length} {p.colors.length === 1 ? "colour" : "colours"}
          </div>
        </div>
        <div className="text-right shrink-0">
          {onSale ? (
            <>
              <div className="price text-sm text-sale">{formatHUF(p.price)}</div>
              <div className="price text-[11px] text-muted line-through">
                {formatHUF(compareAt!)}
              </div>
            </>
          ) : (
            <div className="price text-sm">{formatHUF(p.price)}</div>
          )}
        </div>
      </div>
    </Link>
  );
}
