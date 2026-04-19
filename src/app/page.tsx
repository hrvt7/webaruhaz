import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import CategoryGrid from "@/components/home/CategoryGrid";
import NewArrivals from "@/components/home/NewArrivals";
import BrandStory from "@/components/home/BrandStory";
import CollectionHighlight from "@/components/home/CollectionHighlight";
import EditorialGrid from "@/components/home/EditorialGrid";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <CategoryGrid />
      <NewArrivals />
      <BrandStory />
      <CollectionHighlight />
      <EditorialGrid />
      <Newsletter />
    </>
  );
}
