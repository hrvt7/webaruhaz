import { notFound } from "next/navigation";
import { products, findProduct, related as rel } from "@/data/products";
import ProductDetail from "@/components/shop/ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = findProduct(slug);
  return { title: p?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = findProduct(slug);
  if (!p) notFound();
  return <ProductDetail product={p} related={rel(p, 4)} />;
}
