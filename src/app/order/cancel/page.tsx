import Link from "next/link";

export const metadata = { title: "Fizetés megszakítva" };

export default function OrderCancelPage() {
  return (
    <section className="min-h-[70vh] grid place-items-center px-6 py-16">
      <div className="max-w-xl text-center">
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
          Fizetés
        </div>
        <h1 className="font-display text-5xl md:text-6xl">Megszakítva</h1>
        <p className="mt-5 text-muted leading-relaxed">
          A fizetést megszakítottad. A kosarad tartalma megmaradt, bármikor
          folytathatod.
        </p>
        <Link
          href="/shop"
          className="inline-block mt-10 bg-ink text-white text-[11px] tracking-widest-2 uppercase px-8 py-4"
        >
          Vissza a boltba
        </Link>
      </div>
    </section>
  );
}
