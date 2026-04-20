import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { validateCoupon, incrementCouponUse } from "@/lib/coupons";

export async function POST(req: Request) {
  const body = await req.json();
  const sb = await supabaseServer();

  const subtotal = Number(body.subtotal ?? 0);

  // Kupon szerver-oldali újraellenőrzése (a client payload-nak nem hiszünk)
  let discount = 0;
  let couponCode: string | null = null;
  if (body.coupon_code) {
    const check = await validateCoupon(String(body.coupon_code), subtotal);
    if (check.ok) {
      discount = check.discount;
      couponCode = check.coupon.code;
    }
  }

  const { error } = await sb.from("orders").insert({
    customer_name: body.customer_name ?? "",
    customer_email: body.customer_email ?? "",
    customer_phone: body.customer_phone ?? "",
    customer_address: body.customer_address ?? "",
    note: body.note ?? "",
    items: body.items ?? [],
    subtotal,
    coupon_code: couponCode,
    discount_amount: discount,
    payment_method: "whatsapp",
  });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // WhatsApp rendelésnél azonnal inkrementáljuk a kuponhasználatot
  // (nincs fizetés-webhook ami később megtenné).
  if (couponCode) {
    await incrementCouponUse(couponCode);
  }

  return NextResponse.json({ ok: true });
}
