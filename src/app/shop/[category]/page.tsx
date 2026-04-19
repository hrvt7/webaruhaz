import { notFound } from "next/navigation";
import ShopGrid from "@/components/shop/ShopGrid";
import { getAllProducts, getProducts } from "@/lib/store";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  women: { title: "Női", subtitle: "Kifinomult alapdarabok — felsők, nadrágok, ruhák, kabátok." },
  men: { title: "Férfi", subtitle: "Férfi alapdarabok — tailoring, kötöttáruk, denim." },
  accessories: { title: "Kiegészítők", subtitle: "Bőr, kasmír, acél. Kézzel készült részletek." },
  sale: { title: "Kiárusítás", subtitle: "Előző szezon, korlátozott darabszám. A minőség ugyanaz." },
};

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
  const meta = TITLES[category];
  if (!meta) notFound();

  let list;
  if (category === "women") list = await getProducts({ gender: "women" });
  else if (category === "men") list = await getProducts({ gender: "men" });
  else if (category === "accessories") list = await getProducts({ category: "accessories" });
  else if (category === "sale") list = await getProducts({ onlySale: true });
  else list = await getAllProducts();

  return <ShopGrid title={meta.title} subtitle={meta.subtitle} initial={list} />;
}
