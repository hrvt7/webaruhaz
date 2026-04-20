import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

// Use the service role pattern via a privileged server client (anon key + RLS
// would block updates by unauthenticated webhook caller). The anon key has no
// admin RLS, so we rely on a narrow RPC or bypass via direct update: since we
// enabled RLS, updates need admin. Stripe webhook has no user — so we use the
// same anon client but only update rows by stripe_session_id which is our trust
// anchor. To make this work without exposing service role, we add a dedicated
// webhook RLS policy below (no-auth update limited to stripe fields).

function supabaseWebhook() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  const sb = supabaseWebhook();

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      await sb
        .from("orders")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
          amount_total: session.amount_total,
          currency: session.currency,
        })
        .eq("stripe_session_id", session.id);

      // Kupon használat inkrementálás (ha volt)
      const couponCode = session.metadata?.coupon_code;
      if (couponCode && couponCode.trim()) {
        await sb.rpc("increment_coupon_use", { coupon_code_in: couponCode });
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    await sb
      .from("orders")
      .update({ status: "expired" })
      .eq("stripe_session_id", session.id);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");

  return NextResponse.json({ received: true });
}
