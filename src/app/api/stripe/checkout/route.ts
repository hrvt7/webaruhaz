import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase/server";
import {
  FREE_SHIPPING_THRESHOLD_HUF,
  SHIPPING_FEE_HUF,
  hufToEurCents,
} from "@/lib/currency";

type Item = {
  slug: string;
  name: string;
  price: number;
  qty: number;
  size: string;
  color: string;
  image: string;
};

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Demo mód — a bankkártyás fizetés hamarosan aktív. Jelenleg kérjük, rendelj WhatsApp-on, 1 percen belül visszajelzünk.",
      },
      { status: 503 },
    );
  }

  const body = (await req.json()) as {
    items: Item[];
    customer: { name: string; email: string; phone: string; address: string; note: string };
    locale?: "hu" | "en" | "de";
  };

  if (!body.items?.length) {
    return NextResponse.json({ error: "Üres kosár." }, { status: 400 });
  }

  const locale = body.locale ?? "hu";
  const useEur = locale !== "hu";
  const currency = useEur ? "eur" : "huf";

  // subtotal is always computed in HUF (DB prices are HUF)
  const subtotalHuf = body.items.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingHuf = subtotalHuf >= FREE_SHIPPING_THRESHOLD_HUF ? 0 : SHIPPING_FEE_HUF;
  const totalHuf = subtotalHuf + shippingHuf;

  // Persist draft order (always in HUF internally)
  const sb = await supabaseServer();
  const { data: order, error: insErr } = await sb
    .from("orders")
    .insert({
      customer_name: body.customer.name,
      customer_email: body.customer.email,
      customer_phone: body.customer.phone,
      customer_address: body.customer.address,
      note: body.customer.note,
      items: body.items,
      subtotal: subtotalHuf,
      amount_total: totalHuf,
      currency,
      status: "pending_payment",
      payment_method: "stripe",
    })
    .select("id")
    .single();
  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  const origin = req.headers.get("origin") ?? "https://webaruhaz-gamma.vercel.app";

  // Stripe requires integer "minor units" (fillér for HUF, cents for EUR).
  // HUF on Stripe is zero-decimal — unit_amount = HUF exact integer.
  // EUR is two-decimal — unit_amount = cents.
  const toUnit = (huf: number) => (useEur ? hufToEurCents(huf) : huf);

  const shippingLabel = useEur
    ? locale === "de"
      ? "Versand"
      : "Shipping"
    : "Szállítás";

  type LineItem = {
    quantity: number;
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string; images?: string[] };
    };
  };
  const lineItems: LineItem[] = [
    ...body.items.map((i) => ({
      quantity: i.qty,
      price_data: {
        currency,
        unit_amount: toUnit(i.price),
        product_data: {
          name: `${i.name} — ${i.color}, ${i.size}`,
          images: i.image ? [i.image] : undefined,
        },
      },
    })),
  ];
  if (shippingHuf > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency,
        unit_amount: toUnit(shippingHuf),
        product_data: { name: shippingLabel },
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    customer_email: body.customer.email || undefined,
    shipping_address_collection: undefined,
    phone_number_collection: { enabled: false },
    locale: locale === "en" ? "en" : locale === "de" ? "de" : "hu",
    metadata: {
      order_id: order.id,
      customer_name: body.customer.name,
      customer_phone: body.customer.phone,
      display_currency: currency,
      locale,
    },
    success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/order/cancel?session_id={CHECKOUT_SESSION_ID}`,
  });

  await sb
    .from("orders")
    .update({ stripe_session_id: session.id })
    .eq("id", order.id);

  return NextResponse.json({ url: session.url });
}
