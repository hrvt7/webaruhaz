import ShopGrid from "@/components/shop/ShopGrid";
import { getAllProducts } from "@/lib/store";

export const metadata = { title: "Shop all" };
export const revalidate = 30;

export default async function ShopPage() {
  const products = await getAllProducts();
  return (
    <ShopGrid
      title="Shop all"
      subtitle="A teljes LUNARA katalógus. Szűrj kategória, méret, szín és ár szerint."
      initial={products}
    />
  );
}
