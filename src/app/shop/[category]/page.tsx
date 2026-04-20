import { notFound } from "next/navigation";
import ShopGrid from "@/components/shop/ShopGrid";
import {
  getAllProducts,
  getProducts,
  getCategoryBySlug,
} from "@/lib/store";
import { getT } from "@/i18n/server";
import { localize } from "@/lib/localize";

export const revalidate = 30;

// Dinamikus render — a kategóriák DB-ből jönnek, nem statikus.
// (A revalidate = 30 miatt 30 mp-enként cache-el.)

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const { c, locale } = await getT();
  const cat = await getCategoryBySlug(category);

  // Cím/alcím: admin DB-ből, ha nincs, visszaesik az i18n default-ra
  let title = cat ? localize(cat.title, locale) : "";
  let subtitle = cat ? localize(cat.subtitle, locale) : "";

  const fallbackMeta = c.categoryPage[category as keyof typeof c.categoryPage];
  if (!title && fallbackMeta) title = fallbackMeta.title;
  if (!subtitle && fallbackMeta) subtitle = fallbackMeta.subtitle;

  // Ha sem DB-ben nincs, sem a default i18n-ben → 404
  if (!title) notFound();

  // Termékek szűrése:
  //  - "sale": áthúzott árú termékek
  //  - "women" / "men": gender szerint (ha a slug pontosan ez)
  //  - egyébként: category mező szerint
  let list;
  if (category === "sale") list = await getProducts({ onlySale: true });
  else if (category === "women") list = await getProducts({ gender: "women" });
  else if (category === "men") list = await getProducts({ gender: "men" });
  else list = await getProducts({ category });

  // Ha semmi találat, de a kategória létezik, tegyük minden termékre a fallbackot? — NEM, üres lista marad.
  if (list.length === 0 && !cat && !fallbackMeta) {
    list = await getAllProducts();
  }

  return <ShopGrid title={title} subtitle={subtitle} initial={list} />;
}
