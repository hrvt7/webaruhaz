import { notFound } from "next/navigation";
import { getProductBySlug, getRelated } from "@/lib/store";
import ProductDetail from "@/components/shop/ProductDetail";

export const revalidate = 30;
export const dynamicParams = true;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://webaruhaz-gamma.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Termék" };
  const desc = (p.short_desc || p.long_desc || "").slice(0, 155);
  const image = p.images?.[0];
  return {
    title: p.name,
    description: desc,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: {
      title: p.name,
      description: desc,
      type: "website",
      url: `/product/${p.slug}`,
      images: image ? [{ url: image, alt: p.name }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();
  const related = await getRelated(p, 4);

  const categoryPath =
    p.gender === "men" ? "/shop/men" :
    p.gender === "women" ? "/shop/women" :
    p.category === "accessories" ? "/shop/accessories" : "/shop";
  const categoryLabel =
    p.gender === "men" ? "Férfi" :
    p.gender === "women" ? "Női" :
    p.category === "accessories" ? "Kiegészítők" : "Shop";

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    description: p.long_desc || p.short_desc || p.name,
    image: p.images && p.images.length > 0 ? p.images : undefined,
    brand: { "@type": "Brand", name: "Aetheris" },
    offers: {
      "@type": "Offer",
      price: String(p.price),
      priceCurrency: "HUF",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/product/${p.slug}`,
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop", item: `${SITE_URL}/shop` },
      { "@type": "ListItem", position: 2, name: categoryLabel, item: `${SITE_URL}${categoryPath}` },
      { "@type": "ListItem", position: 3, name: p.name, item: `${SITE_URL}/product/${p.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductDetail product={p} related={related} />
    </>
  );
}
