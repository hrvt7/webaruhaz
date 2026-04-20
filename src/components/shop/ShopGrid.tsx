"use client";

import { useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import {
  COLOR_HEX,
  PRICE_RANGE,
  Product,
} from "@/data/products";
import { useT } from "@/i18n/provider";

type Sort = "newest" | "price-asc" | "price-desc" | "bestseller";

export default function ShopGrid({
  title,
  subtitle,
  initial,
  hideCategoryFilter,
}: {
  title: string;
  subtitle?: string;
  initial: Product[];
  hideCategoryFilter?: boolean;
}) {
  const { t, c } = useT();
  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(initial.map((p) => p.category))).map((code) => ({
        value: code,
        label: c.categoryLabel[code as keyof typeof c.categoryLabel] ?? code,
      })),
    [initial, c],
  );

  const allColors = useMemo(
    () => Array.from(new Set(initial.flatMap((p) => p.colors))).sort(),
    [initial],
  );
  const allSizes = useMemo(
    () => Array.from(new Set(initial.flatMap((p) => p.sizes))),
    [initial],
  );
  const maxPrice = useMemo(
    () => Math.max(PRICE_RANGE.max, ...initial.map((p) => p.price)),
    [initial],
  );

  const [cats, setCats] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(maxPrice);
  const [sort, setSort] = useState<Sort>("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let r = initial.filter((p) => {
      if (cats.length && !cats.includes(p.category)) return false;
      if (sizes.length && !p.sizes.some((s) => sizes.includes(s))) return false;
      if (colors.length && !p.colors.some((c) => colors.includes(c))) return false;
      if (p.price > priceMax) return false;
      return true;
    });
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "bestseller")
      r = [...r].sort(
        (a, b) =>
          (b.badge === "Bestseller" ? 1 : 0) - (a.badge === "Bestseller" ? 1 : 0),
      );
    return r;
  }, [initial, cats, sizes, colors, priceMax, sort]);

  const activeCount =
    cats.length + sizes.length + colors.length + (priceMax < maxPrice ? 1 : 0);

  const clearAll = () => {
    setCats([]);
    setSizes([]);
    setColors([]);
    setPriceMax(maxPrice);
  };

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-10 py-8 md:py-14">
      <header className="mb-8 md:mb-12">
        <div className="text-[11px] tracking-widest-3 uppercase text-muted">{t.product.shop}</div>
        <h1 className="font-display text-4xl md:text-6xl mt-2">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-sm text-muted max-w-xl">{subtitle}</p>
        )}
      </header>

      <div className="flex items-center justify-between border-y border-line py-3 mb-6">
        <button
          onClick={() => setFilterOpen(true)}
          className="text-[11px] tracking-widest-2 uppercase flex items-center gap-2"
        >
          {t.shop.filter} {activeCount > 0 && <span className="text-muted">({activeCount})</span>}
        </button>
        <div className="text-[11px] tracking-widest-2 uppercase text-muted">
          {filtered.length} {t.shop.products}
        </div>
        <label className="text-[11px] tracking-widest-2 uppercase flex items-center gap-2">
          <span className="hidden sm:inline">{t.shop.sort}</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="appearance-none bg-transparent pr-5 text-[11px] tracking-widest-2 uppercase cursor-pointer outline-none"
            >
              <option value="newest">{t.shop.newest}</option>
              <option value="price-asc">{t.shop.priceAsc}</option>
              <option value="price-desc">{t.shop.priceDesc}</option>
              <option value="bestseller">{t.shop.bestseller}</option>
            </select>
            <ChevronDown
              size={12}
              strokeWidth={1.8}
              className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </label>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block">
          <Filters
            categoryOptions={categoryOptions}
            hideCategoryFilter={hideCategoryFilter}
            allColors={allColors}
            allSizes={allSizes}
            maxPrice={maxPrice}
            cats={cats}
            sizes={sizes}
            colors={colors}
            priceMax={priceMax}
            setCats={setCats}
            setSizes={setSizes}
            setColors={setColors}
            setPriceMax={setPriceMax}
            toggle={toggle}
            clearAll={clearAll}
          />
        </aside>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-10 md:gap-x-6">
          {filtered.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted text-sm">
              {t.shop.noResults}
            </div>
          )}
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-ink/30"
            onClick={() => setFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-[360px] bg-white h-full flex flex-col">
            <div className="h-[64px] px-6 flex items-center justify-between border-b border-line">
              <div className="font-display text-lg tracking-widest-2">{t.shop.filter.toUpperCase()}</div>
              <button
                onClick={() => setFilterOpen(false)}
                className="h-9 w-9 -mr-2 grid place-items-center"
              >
                <X size={20} strokeWidth={1.4} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <Filters
                categoryOptions={categoryOptions}
                hideCategoryFilter={hideCategoryFilter}
                allColors={allColors}
                allSizes={allSizes}
                maxPrice={maxPrice}
                cats={cats}
                sizes={sizes}
                colors={colors}
                priceMax={priceMax}
                setCats={setCats}
                setSizes={setSizes}
                setColors={setColors}
                setPriceMax={setPriceMax}
                toggle={toggle}
                clearAll={clearAll}
              />
            </div>
            <div className="border-t border-line p-6 grid grid-cols-2 gap-3">
              <button
                onClick={clearAll}
                className="border border-line py-3 text-[11px] tracking-widest-2 uppercase"
              >
                {t.shop.clear}
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="bg-ink text-white py-3 text-[11px] tracking-widest-2 uppercase"
              >
                {t.shop.apply}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Filters({
  categoryOptions,
  hideCategoryFilter,
  allColors,
  allSizes,
  maxPrice,
  cats,
  sizes,
  colors,
  priceMax,
  setCats,
  setSizes,
  setColors,
  setPriceMax,
  toggle,
  clearAll,
}: {
  categoryOptions: { value: string; label: string }[];
  hideCategoryFilter?: boolean;
  allColors: string[];
  allSizes: string[];
  maxPrice: number;
  cats: string[];
  sizes: string[];
  colors: string[];
  priceMax: number;
  setCats: (v: string[]) => void;
  setSizes: (v: string[]) => void;
  setColors: (v: string[]) => void;
  setPriceMax: (v: number) => void;
  toggle: (arr: string[], set: (v: string[]) => void, v: string) => void;
  clearAll: () => void;
}) {
  const { t } = useT();
  return (
    <div className="space-y-8 text-sm">
      {!hideCategoryFilter && categoryOptions.length > 1 && (
        <Group title={t.shop.category}>
          <div className="space-y-2">
            {categoryOptions.map((c) => (
              <label
                key={c.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={cats.includes(c.value)}
                  onChange={() => toggle(cats, setCats, c.value)}
                  className="accent-ink"
                />
                {c.label}
              </label>
            ))}
          </div>
        </Group>
      )}

      <Group title={t.shop.size}>
        <div className="grid grid-cols-4 gap-2">
          {allSizes.map((s) => (
            <button
              key={s}
              onClick={() => toggle(sizes, setSizes, s)}
              className={`h-9 border text-xs ${
                sizes.includes(s)
                  ? "bg-ink text-white border-ink"
                  : "border-line hover:border-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Group>

      <Group title={t.shop.colour}>
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => (
            <button
              key={c}
              onClick={() => toggle(colors, setColors, c)}
              title={c}
              className={`h-7 w-7 rounded-full border ${
                colors.includes(c)
                  ? "ring-2 ring-offset-2 ring-ink border-ink"
                  : "border-line"
              }`}
              style={{ background: COLOR_HEX[c] || "#ccc" }}
            />
          ))}
        </div>
      </Group>

      <Group title={t.shop.price}>
        <input
          type="range"
          min={5000}
          max={maxPrice}
          step={1000}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-ink"
        />
        <div className="mt-2 flex justify-between text-xs text-muted price">
          <span>5 000 Ft</span>
          <span>{new Intl.NumberFormat("hu-HU").format(priceMax)} Ft</span>
        </div>
      </Group>

      <button
        onClick={clearAll}
        className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink"
      >
        {t.shop.clearAll}
      </button>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] tracking-widest-2 uppercase mb-3">{title}</div>
      {children}
    </div>
  );
}
