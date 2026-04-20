import { supabaseServer } from "@/lib/supabase/server";
import type { LocalizedText } from "@/lib/localize";

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: string;
  gender: "women" | "men" | "unisex";
  price: number;
  compare_at: number | null;
  colors: string[];
  sizes: string[];
  short_desc: string;
  long_desc: string;
  materials: string;
  care: string;
  size_guide: string | null;
  badge: string | null;
  i18n?: {
    en?: { name?: string; short_desc?: string; long_desc?: string; materials?: string; care?: string; size_guide?: string };
    de?: { name?: string; short_desc?: string; long_desc?: string; materials?: string; care?: string; size_guide?: string };
  } | null;
  images: string[];
  collection: string | null;
  active: boolean;
  sort_order: number;
};

export type Collection = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  hero_image: string;
  active: boolean;
};

export type Category = {
  id: string;
  slug: string;
  title: LocalizedText;      // {hu,en,de}
  subtitle: LocalizedText;
  image: string | null;      // nagy fejléc kép a shop oldalhoz
  card_image: string | null; // főoldali kártya kép
  sort_order: number;
  active: boolean;
};

// Opcionális stílus felülbírálás egy-egy szekciónak (pl. sötét háttérképen fehér szöveg).
export type SectionStyle = {
  text_color?: string;   // pl. "#ffffff" vagy "#0a0a0a"
  overline_color?: string;
};

export type LandingContent = {
  hero: {
    overline: LocalizedText;
    title_line_1: LocalizedText;
    title_line_2: LocalizedText;
    subtitle: LocalizedText;
    image: string;
    cta_women: LocalizedText;
    cta_men: LocalizedText;
    style?: SectionStyle;
  };
  brand_story: {
    overline: LocalizedText;
    title: LocalizedText;
    body_1: LocalizedText;
    body_2: LocalizedText;
    image: string;
    style?: SectionStyle;
  };
  collection_highlight: {
    overline: LocalizedText;
    title: LocalizedText;
    subtitle: LocalizedText;
    image: string;
    slug: string;
    style?: SectionStyle;
  };
  marquee?: {
    items: LocalizedText[]; // minden item önálló lokalizált szöveg is lehet
    style?: SectionStyle;
  };
  editorial?: {
    overline?: LocalizedText;
    title?: LocalizedText;
    image1: string;
    image2: string;
    image3: string;
    style?: SectionStyle;
  };
  newsletter?: {
    overline: LocalizedText;
    title: LocalizedText;
    body: LocalizedText;
    style?: SectionStyle;
  };
  categories?: {
    women_image: string;
    men_image: string;
    sets_image: string;
  };
  partnership?: {
    overline: LocalizedText;
    title: LocalizedText;
    body_1: LocalizedText;
    body_2: LocalizedText;
    image: string;
    link: string;
    cta: LocalizedText;
    style?: SectionStyle;
  };
  footer?: {
    tagline: LocalizedText;
    style?: SectionStyle;
  };
  about?: {
    overline: LocalizedText;
    title: LocalizedText;
    body_1: LocalizedText;
    body_2: LocalizedText;
    body_3: LocalizedText;
    image: string;
    stat_1_value: LocalizedText;
    stat_1_label: LocalizedText;
    stat_2_value: LocalizedText;
    stat_2_label: LocalizedText;
    stat_3_value: LocalizedText;
    stat_3_label: LocalizedText;
    style?: SectionStyle;
  };
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

export const formatHUF = (n: number) =>
  new Intl.NumberFormat("hu-HU").format(n) + " Ft";

export async function getProducts(opts: {
  category?: string;
  gender?: string;
  onlySale?: boolean;
  collection?: string;
} = {}): Promise<Product[]> {
  const sb = await supabaseServer();
  let q = sb.from("products").select("*").eq("active", true).order("sort_order");
  if (opts.category) q = q.eq("category", opts.category);
  if (opts.gender) q = q.eq("gender", opts.gender);
  if (opts.onlySale) q = q.eq("category", "sale");
  if (opts.collection) q = q.eq("collection", opts.collection);
  const { data, error } = await q;
  if (error) throw error;
  return (data as Product[]) || [];
}

export async function getAllProducts(): Promise<Product[]> {
  const sb = await supabaseServer();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw error;
  return (data as Product[]) || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Product) || null;
}

export async function getRelated(p: Product, n = 4): Promise<Product[]> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("products")
    .select("*")
    .eq("active", true)
    .or(`gender.eq.${p.gender},category.eq.${p.category}`)
    .neq("slug", p.slug)
    .limit(n);
  return (data as Product[]) || [];
}

export async function getCollection(slug: string): Promise<Collection | null> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Collection) || null;
}

export async function getAllCollections(): Promise<Collection[]> {
  const sb = await supabaseServer();
  const { data } = await sb.from("collections").select("*").order("created_at");
  return (data as Collection[]) || [];
}

// ============== CATEGORIES ==============
export async function getCategories(onlyActive = true): Promise<Category[]> {
  const sb = await supabaseServer();
  let q = sb.from("categories").select("*").order("sort_order");
  if (onlyActive) q = q.eq("active", true);
  const { data } = await q;
  return (data as Category[]) || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Category) || null;
}

export async function getLanding(): Promise<LandingContent> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("site_content")
    .select("data")
    .eq("id", "landing")
    .maybeSingle();
  return (data?.data as LandingContent) || DEFAULT_LANDING;
}

const DEFAULT_LANDING: LandingContent = {
  hero: {
    overline: "Spring / Summer 2026",
    title_line_1: "Quiet",
    title_line_2: "Luxury.",
    subtitle:
      "Minimalista alapdarabok európai szövetekből. Csendesen, tartósan, időtlenül.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80&auto=format&fit=crop",
    cta_women: "Shop Women",
    cta_men: "Shop Men",
  },
  brand_story: {
    overline: "Our story",
    title: "Crafted in Europe.\nBuilt to last.",
    body_1:
      "A Aetheris 2020-ban indult Budapesten, azzal a szándékkal, hogy csendes, minimalista alapdarabokat kínáljon a zsúfolt piac helyett.",
    body_2: "A wardrobe nem trend kérdése. A wardrobe egy hosszú döntéssorozat.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=80&auto=format&fit=crop",
  },
  collection_highlight: {
    overline: "Collection",
    title: "Spring 2026",
    subtitle:
      "Az új szezon. Könnyed szövetek, lágy palette, építkező sziluettek.",
    image:
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1920&q=80&auto=format&fit=crop",
    slug: "spring-2026",
  },
};
