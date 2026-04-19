import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import CategoryGrid from "@/components/home/CategoryGrid";
import NewArrivals from "@/components/home/NewArrivals";
import BrandStory from "@/components/home/BrandStory";
import CollectionHighlight from "@/components/home/CollectionHighlight";
import EditorialGrid from "@/components/home/EditorialGrid";
import Partnership from "@/components/home/Partnership";
import Newsletter from "@/components/home/Newsletter";
import { getLanding, getAllProducts } from "@/lib/store";
import { getT } from "@/i18n/server";

export const revalidate = 30;

export default async function Home() {
  const [{ t }, landing, allProducts] = await Promise.all([
    getT(),
    getLanding(),
    getAllProducts(),
  ]);
  const newArrivals = allProducts.slice(0, 8);
  return (
    <>
      <Hero data={landing.hero} dict={{ shopWomen: t.home.shopWomen, shopMen: t.home.shopMen }} />
      <Marquee items={landing.marquee?.items} />
      <CategoryGrid />
      <NewArrivals items={newArrivals} />
      <BrandStory data={landing.brand_story} />
      <CollectionHighlight data={landing.collection_highlight} />
      <EditorialGrid data={landing.editorial} />
      <Partnership />
      <Newsletter />
    </>
  );
}
