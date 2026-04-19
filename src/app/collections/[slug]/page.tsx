import { notFound } from "next/navigation";
import Link from "next/link";
import { getCollection, getProducts } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

export const revalidate = 30;
export const dynamicParams = true;

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await getCollection(slug);
  if (!c) notFound();
  const items = await getProducts({ collection: slug });

  return (
    <>
      <section className="relative h-[80vh] min-h-[540px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.hero_image} alt={c.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/25" />
        <div className="relative z-10 h-full grid place-items-center text-center text-white px-6">
          <div className="max-w-xl">
            <div className="text-[11px] tracking-widest-3 uppercase mb-5 opacity-90">Kollekció</div>
            <h1 className="font-display text-5xl md:text-7xl">{c.title}</h1>
            <p className="mt-6 text-sm md:text-base opacity-90">{c.subtitle}</p>
          </div>
        </div>
      </section>

      {c.intro && (
        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-muted leading-relaxed whitespace-pre-line">{c.intro}</p>
        </section>
      )}

      <section className="mx-auto max-w-[1440px] px-4 md:px-10 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center text-muted">
              A kollekció hamarosan.
            </div>
          )}
        </div>
        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-block border border-ink text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-ink hover:text-white transition-colors"
          >
            Teljes katalógus
          </Link>
        </div>
      </section>
    </>
  );
}
