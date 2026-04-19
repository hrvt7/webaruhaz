import ShopGrid from "@/components/shop/ShopGrid";
import { products } from "@/data/products";

export const metadata = { title: "Shop all" };

export default function ShopPage() {
  return (
    <ShopGrid
      title="Shop all"
      subtitle="A teljes LUNARA katalógus. Szűrj kategória, méret, szín és ár szerint."
      initial={products}
    />
  );
}
