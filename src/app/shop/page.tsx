import ShopGrid from "@/components/shop/ShopGrid";
import { getAllProducts } from "@/lib/store";
import { getT } from "@/i18n/server";

export const revalidate = 30;

export default async function ShopPage() {
  const { t } = await getT();
  const products = await getAllProducts();
  return (
    <ShopGrid
      title={t.shop.allTitle}
      subtitle={t.shop.allSub}
      initial={products}
    />
  );
}
