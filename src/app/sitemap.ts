import type { MetadataRoute } from "next";
import { getAllProducts, getAllCollections } from "@/lib/store";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://webaruhaz-gamma.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/shop/women`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/shop/men`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/shop/accessories`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/shop/sale`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/stores`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/size-guide`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/shipping`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/aszf`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/adatkezeles`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  let products: MetadataRoute.Sitemap = [];
  let collections: MetadataRoute.Sitemap = [];
  try {
    const [ps, cs] = await Promise.all([getAllProducts(), getAllCollections()]);
    products = ps.map((p) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
    collections = cs
      .filter((c) => c.active !== false)
      .map((c) => ({
        url: `${SITE_URL}/collections/${c.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
  } catch {
    // ha a DB nem elérhető build időben, csak a statikus route-ok mennek ki
  }

  return [...staticRoutes, ...collections, ...products];
}
