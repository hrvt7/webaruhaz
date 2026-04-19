import Link from "next/link";
import { getT } from "@/i18n/server";

export default async function OrderCancelPage() {
  const { c } = await getT();
  return (
    <section className="min-h-[70vh] grid place-items-center px-6 py-16">
      <div className="max-w-xl text-center">
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
          {c.order.cancelOverline}
        </div>
        <h1 className="font-display text-5xl md:text-6xl">{c.order.cancelTitle}</h1>
        <p className="mt-5 text-muted leading-relaxed">{c.order.cancelBody}</p>
        <Link
          href="/shop"
          className="inline-block mt-10 bg-ink text-white text-[11px] tracking-widest-2 uppercase px-8 py-4"
        >
          {c.order.continueShopping}
        </Link>
      </div>
    </section>
  );
}
