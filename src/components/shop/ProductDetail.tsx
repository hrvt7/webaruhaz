"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Heart, Ruler } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  COLOR_HEX,
  Product,
  productCompareAt,
  productLongDesc,
  productShortDesc,
} from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useT } from "@/i18n/provider";
import { formatMoney } from "@/lib/currency";

export default function ProductDetail({
  product: p,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { t, c, locale } = useT();
  const { add, setOpen } = useCart();
  const [color, setColor] = useState(p.colors[0]);
  const [size, setSize] = useState<string | null>(
    p.sizes.length === 1 ? p.sizes[0] : null,
  );
  const [qty, setQty] = useState(1);
  const [openAcc, setOpenAcc] = useState<string | null>("description");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const compareAt = productCompareAt(p);
  const onSale = compareAt && compareAt > p.price;

  const addToBag = () => {
    if (!size) return;
    add(
      {
        slug: p.slug,
        name: p.name,
        price: p.price,
        image: p.images[0],
        size,
        color,
      },
      qty,
    );
    setOpen(true);
  };

  const acc = (id: string, title: string, body: React.ReactNode) => (
    <div className="border-b border-line">
      <button
        onClick={() => setOpenAcc(openAcc === id ? null : id)}
        className="w-full flex items-center justify-between py-4 text-[11px] tracking-widest-2 uppercase"
      >
        {title}
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`transition-transform ${openAcc === id ? "rotate-180" : ""}`}
        />
      </button>
      {openAcc === id && (
        <div className="pb-6 text-sm text-muted leading-relaxed">{body}</div>
      )}
    </div>
  );

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-4 md:px-10 py-6 md:py-10 grid lg:grid-cols-[1fr_480px] gap-10">
        <div className="space-y-2 md:space-y-3">
          {p.images.map((src, i) => (
            <div key={i} className="aspect-[3/4] bg-bone overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={p.name} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <nav className="text-[11px] tracking-widest-2 uppercase text-muted mb-4">
            <Link href="/shop" className="hover:text-ink">Shop</Link>
            <span className="mx-2">/</span>
            <span>{c.categoryLabel[p.category as keyof typeof c.categoryLabel] ?? p.category}</span>
          </nav>

          {p.badge && (
            <div className="inline-block text-[10px] tracking-widest-2 uppercase bg-ink text-white px-2 py-1 mb-4">
              {p.badge}
            </div>
          )}

          <h1 className="font-display text-3xl md:text-4xl leading-tight">{p.name}</h1>

          <div className="mt-3 flex items-baseline gap-3">
            {onSale ? (
              <>
                <span className="price text-xl text-sale">{formatMoney(p.price, locale)}</span>
                <span className="price text-sm text-muted line-through">
                  {formatMoney(compareAt!, locale)}
                </span>
              </>
            ) : (
              <span className="price text-xl">{formatMoney(p.price, locale)}</span>
            )}
          </div>

          <p className="mt-5 text-sm text-muted leading-relaxed">{productShortDesc(p)}</p>

          <div className="mt-8">
            <div className="flex items-center justify-between text-[11px] tracking-widest-2 uppercase mb-3">
              <span>Colour — <span className="text-muted normal-case tracking-normal">{color}</span></span>
            </div>
            <div className="flex flex-wrap gap-2">
              {p.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={c}
                  className={`h-8 w-8 rounded-full border ${
                    color === c
                      ? "ring-2 ring-offset-2 ring-ink border-ink"
                      : "border-line"
                  }`}
                  style={{ background: COLOR_HEX[c] || "#ccc" }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between text-[11px] tracking-widest-2 uppercase mb-3">
              <span>Size</span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-muted flex items-center gap-1 hover:text-ink normal-case tracking-normal text-xs"
              >
                <Ruler size={13} strokeWidth={1.6} /> Size guide
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {p.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-11 border text-sm ${
                    size === s
                      ? "bg-ink text-white border-ink"
                      : "border-line hover:border-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {!size && (
              <div className="mt-2 text-[11px] text-muted">Válassz méretet.</div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="text-[11px] tracking-widest-2 uppercase">Qty</div>
            <div className="inline-flex border border-line">
              <button
                className="h-10 w-10 hover:bg-bone"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                −
              </button>
              <span className="price w-10 text-center grid place-items-center">
                {qty}
              </span>
              <button
                className="h-10 w-10 hover:bg-bone"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={addToBag}
            disabled={!size}
            className="mt-8 w-full bg-ink text-white text-[12px] tracking-widest-2 uppercase py-4 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add to bag
          </button>
          <button className="mt-2 w-full border border-line text-[12px] tracking-widest-2 uppercase py-4 hover:border-ink flex items-center justify-center gap-2">
            <Heart size={14} strokeWidth={1.4} /> Add to wishlist
          </button>

          <div className="mt-10">
            {acc("description", "Description", productLongDesc(p))}
            {acc(
              "materials",
              "Materials",
              <>
                {p.materials}
                <div className="mt-2 text-xs text-muted font-mono">SKU: {p.sku}</div>
              </>,
            )}
            {acc("care", "Care", p.care)}
            {acc(
              "shipping",
              "Shipping & Returns",
              <>
                Ingyenes szállítás 30.000 Ft felett. 14 napos ingyenes visszaküldés.
                Részletek a{" "}
                <Link href="/shipping" className="underline">
                  Shipping & Returns
                </Link>{" "}
                oldalon.
              </>,
            )}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1440px] px-4 md:px-10 py-20">
        <h2 className="font-display text-2xl md:text-3xl mb-8">You may also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {related.map((r) => (
            <ProductCard key={r.slug} p={r} />
          ))}
        </div>
      </section>

      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 grid place-items-center p-4">
          <div className="bg-white max-w-xl w-full max-h-[80vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="font-display text-2xl">Size guide</div>
              <button onClick={() => setSizeGuideOpen(false)} className="text-sm uppercase tracking-widest-2">
                Close
              </button>
            </div>
            <SizeTable />
            <div className="mt-6">
              <Link
                href="/size-guide"
                className="text-[11px] tracking-widest-2 uppercase underline"
              >
                Full size guide →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SizeTable() {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-line text-[11px] tracking-widest-2 uppercase text-muted">
          <th className="text-left py-2">Size</th>
          <th className="text-left py-2">Bust (cm)</th>
          <th className="text-left py-2">Waist (cm)</th>
          <th className="text-left py-2">Hips (cm)</th>
        </tr>
      </thead>
      <tbody className="price">
        {[
          ["XS", "80–84", "60–64", "86–90"],
          ["S", "84–88", "64–68", "90–94"],
          ["M", "88–92", "68–72", "94–98"],
          ["L", "92–98", "72–78", "98–104"],
          ["XL", "98–104", "78–84", "104–110"],
        ].map((r) => (
          <tr key={r[0]} className="border-b border-line">
            {r.map((c, i) => (
              <td key={i} className="py-2">{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
