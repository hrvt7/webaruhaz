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

export const PRICE_RANGE = { min: 5000, max: 120000 };
