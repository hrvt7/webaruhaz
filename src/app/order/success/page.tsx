import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { getT } from "@/i18n/server";

export const metadata = { title: "Köszönjük" };

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { c } = await getT();
  const { session_id } = await searchParams;
  let order: {
    customer_name: string;
    amount_total: number | null;
    status: string;
  } | null = null;
  if (session_id) {
    const sb = await supabaseServer();
    const { data } = await sb
      .from("orders")
      .select("customer_name, amount_total, status")
      .eq("stripe_session_id", session_id)
      .maybeSingle();
    order = data;
  }

  return (
    <section className="min-h-[70vh] grid place-items-center px-6 py-16">
      <div className="max-w-xl text-center">
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
          {c.order.successOverline}
        </div>
        <h1 className="font-display text-5xl md:text-6xl">{c.order.successTitle}</h1>
        <p className="mt-5 text-muted leading-relaxed">
          {order?.customer_name
            ? c.order.successBodyWithName(order.customer_name)
            : c.order.successBody}
        </p>
        {order?.amount_total && (
          <div className="mt-6 price text-lg">
            {c.order.paidAmount}{" "}
            {new Intl.NumberFormat("hu-HU").format(order.amount_total)} Ft
          </div>
        )}
        <Link
          href="/"
          className="inline-block mt-10 bg-ink text-white text-[11px] tracking-widest-2 uppercase px-8 py-4"
        >
          {c.order.backToStore}
        </Link>
      </div>
    </section>
  );
}
