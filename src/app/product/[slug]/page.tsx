import { notFound } from "next/navigation";
import { getProductBySlug, getRelated } from "@/lib/store";
import ProductDetail from "@/components/shop/ProductDetail";

export const revalidate = 30;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  return { title: p?.name ?? "Termék" };
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
  return <ProductDetail product={p} related={related} />;
}
