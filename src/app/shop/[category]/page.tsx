import { notFound } from "next/navigation";
import ShopGrid from "@/components/shop/ShopGrid";
import { products, byGender, onSale } from "@/data/products";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  women: {
    title: "Women",
    subtitle: "Kifinomult alapdarabok a női wardrobe-hoz — tops, bottoms, dresses, coats.",
  },
  men: {
    title: "Men",
    subtitle: "Férfi alapdarabok — tailoring, knitwear, denim. Klasszikus, jól szabott.",
  },
  accessories: {
    title: "Accessories",
    subtitle: "Bőr, kasmír, acél. Kézzel készült részletek.",
  },
  sale: {
    title: "Sale",
    subtitle: "Előző szezon, korlátozott darabszám. A minőség ugyanaz.",
  },
};

export function generateStaticParams() {
  return [{ category: "women" }, { category: "men" }, { category: "accessories" }, { category: "sale" }];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = TITLES[category];
  if (!meta) notFound();

  let list = products;
  if (category === "women") list = byGender("women");
  if (category === "men") list = byGender("men");
  if (category === "accessories") list = products.filter((p) => p.category === "accessories");
  if (category === "sale") list = onSale;

  return <ShopGrid title={meta.title} subtitle={meta.subtitle} initial={list} />;
}
