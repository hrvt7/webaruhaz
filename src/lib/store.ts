import { supabaseServer } from "@/lib/supabase/server";

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
  badge: string | null;
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

export type LandingContent = {
  hero: {
    overline: string;
    title_line_1: string;
    title_line_2: string;
    subtitle: string;
    image: string;
    cta_women: string;
    cta_men: string;
  };
  brand_story: {
    overline: string;
    title: string;
    body_1: string;
    body_2: string;
    image: string;
  };
  collection_highlight: {
    overline: string;
    title: string;
    subtitle: string;
    image: string;
    slug: string;
  };
  marquee?: {
    items: string[];
  };
  editorial?: {
    image1: string;
    image2: string;
    image3: string;
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
