import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getLanding } from "@/lib/store";
import { validateCoupon, incrementCouponUse } from "@/lib/coupons";
import { sendEmail } from "@/lib/email/send";
import { renderOrderConfirmation } from "@/lib/email/templates";

type Item = { slug: string; name: string; price: number; qty: number; size: string; color: string; image: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      items: Item[];
      customer: { name: string; email: string; phone: string; address: string; note: string };
      payment_method: "bank_transfer" | "cod";
      shipping?:
        | { method: "delivery"; address: string }
        | { method: "pickup"; location_id: string; location_name: string; location_address: string }
        | { method: "foxpost"; apm_id: string; apm_name: string; apm_address: string };
      coupon?: { code: string } | null;
    };

    if (!body.items?.length) {
      return NextResponse.json({ ok: false, error: "Üres kosár." }, { status: 400 });
    }
    if (!body.customer?.name || !body.customer?.email) {
      return NextResponse.json({ ok: false, error: "Hiányzó vevő adatok." }, { status: 400 });
    }

    const sb = await supabaseServer();

    // Landing-ben tárolt fizetési beállítások
    const landing = await getLanding();
    const pay = landing?.payment_settings ?? {};
    const codFee = pay.cod_fee_huf ?? 490;

    // Subtotal szerver-oldalon számolva (biztonság)
    const subtotalHuf = body.items.reduce((s, i) => s + i.price * i.qty, 0);

    // Kupon szerver-oldali újraellenőrzése
    let discountHuf = 0;
    let couponCode: string | null = null;
    if (body.coupon?.code) {
      const check = await validateCoupon(body.coupon.code, subtotalHuf);
      if (check.ok) {
        discountHuf = check.discount;
        couponCode = check.coupon.code;
      }
    }
    const discountedSubtotal = Math.max(0, subtotalHuf - discountHuf);

    // Szállítási díj
    const shippingMethod = body.shipping?.method ?? "delivery";
    let shippingFee = 0;
    if (shippingMethod === "delivery") {
      shippingFee = discountedSubtotal >= 30000 ? 0 : 1690;
    } else if (shippingMethod === "foxpost") {
      shippingFee = discountedSubtotal >= 30000 ? 0 : 890;
    }

    // Utánvét díj csak házhoz szállításnál számolódik plusz
    const codFeeApplied = body.payment_method === "cod" && shippingMethod === "delivery" ? codFee : 0;
    const totalHuf = discountedSubtotal + shippingFee + codFeeApplied;

    // Rendelés mentése
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
        currency: "huf",
        status: body.payment_method === "bank_transfer" ? "awaiting_payment" : "new",
        payment_method: body.payment_method,
        coupon_code: couponCode,
        discount_amount: discountHuf,
        shipping_method: shippingMethod,
        shipping_details: body.shipping ?? {},
        shipping_fee: shippingFee + codFeeApplied,
      })
      .select("id")
      .single();

    if (insErr) {
      return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
    }

    // Közlemény / referencia-kód — az order.id utolsó 8 karaktere nagybetűsen
    const shortId = order.id.replace(/-/g, "").slice(-8).toUpperCase();
    const prefix = (pay.bank_memo_prefix ?? "AETHERIS").trim() || "AETHERIS";
    const referenceCode = `${prefix}-${shortId}`;

    // Kuponhasználat inkrementálás (mert nincs Stripe webhook ami később megtenné)
    if (couponCode) await incrementCouponUse(couponCode);

    // Email — rendelés visszaigazolás
    const shipDetails = body.shipping;
    const emailHtml = renderOrderConfirmation({
      customerName: body.customer.name,
      orderId: order.id,
      referenceCode,
      items: body.items,
      subtotal: subtotalHuf,
      discount: discountHuf || undefined,
      couponCode: couponCode,
      shippingFee,
      codFee: codFeeApplied || undefined,
      total: totalHuf,
      paymentMethod: body.payment_method,
      shippingMethod: shippingMethod,
      shippingAddress: shipDetails?.method === "delivery" ? shipDetails.address : body.customer.address,
      pickupLocationName: shipDetails?.method === "pickup" ? shipDetails.location_name : undefined,
      pickupLocationAddress: shipDetails?.method === "pickup" ? shipDetails.location_address : undefined,
      bank:
        body.payment_method === "bank_transfer" && pay.bank_account
          ? {
              name: pay.bank_name ?? "",
              account: pay.bank_account ?? "",
              beneficiary: pay.bank_beneficiary ?? "",
              iban: pay.bank_iban,
              swift: pay.bank_swift,
              deadlineDays: pay.bank_payment_deadline_days ?? 3,
            }
          : undefined,
    });

    // Küldés — nem blokkoljuk a választ ha nem megy ki (dry-run vagy Resend hiba)
    sendEmail({
      to: body.customer.email,
      subject: emailHtml.subject,
      html: emailHtml.html,
    }).catch(() => {});

    return NextResponse.json({
      ok: true,
      order_id: order.id,
      reference_code: referenceCode,
      total: totalHuf,
      payment_method: body.payment_method,
      bank:
        body.payment_method === "bank_transfer"
          ? {
              name: pay.bank_name ?? "",
              account: pay.bank_account ?? "",
              beneficiary: pay.bank_beneficiary ?? "",
              iban: pay.bank_iban,
              swift: pay.bank_swift,
              deadlineDays: pay.bank_payment_deadline_days ?? 3,
            }
          : null,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}
