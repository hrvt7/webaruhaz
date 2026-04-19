import { notFound } from "next/navigation";
import ShopGrid from "@/components/shop/ShopGrid";
import { getAllProducts, getProducts } from "@/lib/store";
import { getT } from "@/i18n/server";

export const revalidate = 30;

export function generateStaticParams() {
  return [{ category: "women" }, { category: "men" }, { category: "accessories" }, { category: "sale" }];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const { c } = await getT();
  const meta = c.categoryPage[category as keyof typeof c.categoryPage];
  if (!meta) notFound();

  let list;
  if (category === "women") list = await getProducts({ gender: "women" });
  else if (category === "men") list = await getProducts({ gender: "men" });
  else if (category === "accessories") list = await getProducts({ category: "accessories" });
  else if (category === "sale") list = await getProducts({ onlySale: true });
  else list = await getAllProducts();

  return <ShopGrid title={meta.title} subtitle={meta.subtitle} initial={list} />;
}
