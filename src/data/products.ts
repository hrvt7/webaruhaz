// Shared client-safe types + utils.
// The actual product catalog lives in the Supabase `products` table and is
// fetched server-side via `src/lib/store.ts`.

export type Product = {
  id?: string;
  slug: string;
  sku: string;
  name: string;
  category: string;
  gender: "women" | "men" | "unisex";
  price: number;
  compare_at?: number | null;
  // legacy alias for compatibility with older components
  compareAt?: number | null;
  colors: string[];
  sizes: string[];
  short_desc?: string;
  shortDesc?: string;
  long_desc?: string;
  longDesc?: string;
  materials: string;
  care: string;
  size_guide?: string | null;
  badge?: string | null;
  i18n?: {
    en?: { name?: string; short_desc?: string; long_desc?: string; materials?: string; care?: string; size_guide?: string };
    de?: { name?: string; short_desc?: string; long_desc?: string; materials?: string; care?: string; size_guide?: string };
  } | null;
  images: string[];
  collection?: string | null;
  active?: boolean;
};

export const CATEGORY_LABEL: Record<string, string> = {
  "women-tops": "Women · Tops",
  "women-bottoms": "Women · Bottoms",
  "women-dresses": "Women · Dresses",
  "men-tops": "Men · Tops",
  "men-bottoms": "Men · Bottoms",
  accessories: "Accessories",
  sale: "Sale",
};

export const COLOR_HEX: Record<string, string> = {
  Fehér: "#f5f4f0",
  Bézs: "#d9c8ab",
  Fekete: "#0a0a0a",
  Szürke: "#8b8b8b",
  Bordó: "#6b1f23",
  Indigo: "#223a5e",
  Champagne: "#e7d6bc",
  Camel: "#c19a6b",
  "Off-white": "#efeae0",
  Navy: "#1a2647",
  Charcoal: "#3a3a3a",
  Olive: "#707d4a",
  Sand: "#d9c8ab",
  Black: "#0a0a0a",
  "Raw Indigo": "#1a2647",
  Cognac: "#924a22",
  Grey: "#8b8b8b",
  Silver: "#c6c6c6",
  Gold: "#c9a668",
};

export const STATIC_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "26",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "One Size",
];

export const STATIC_COLORS = Object.keys(COLOR_HEX);

export const formatHUF = (n: number) =>
  new Intl.NumberFormat("hu-HU").format(n) + " Ft";

export function productPrice(p: Product) {
  return p.price;
}
export function productCompareAt(p: Product): number | null {
  return (p.compare_at ?? p.compareAt) ?? null;
}
export function productShortDesc(p: Product): string {
  return p.short_desc ?? p.shortDesc ?? "";
}
export function productLongDesc(p: Product): string {
  return p.long_desc ?? p.longDesc ?? "";
}

// Lokalizált termék mezők olvasása. `hu` az alapértelmezett (= fő oszlopok),
// `en`/`de` a `i18n` JSONB oszlopból, ha meg van adva.
export function productField(
  p: Product,
  field: "name" | "short_desc" | "long_desc" | "materials" | "care" | "size_guide",
  locale: "hu" | "en" | "de",
): string {
  if (locale !== "hu") {
    const loc = p.i18n?.[locale];
    const v = loc?.[field];
    if (v && v.trim()) return v;
  }
  // fallback hu (fő oszlop)
  switch (field) {
    case "name": return p.name || "";
    case "short_desc": return p.short_desc ?? p.shortDesc ?? "";
    case "long_desc": return p.long_desc ?? p.longDesc ?? "";
    case "materials": return p.materials || "";
    case "care": return p.care || "";
    case "size_guide": return p.size_guide || "";
  }
}

export const PRICE_RANGE = { min: 5000, max: 120000 };
