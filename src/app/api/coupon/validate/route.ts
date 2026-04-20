import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupons";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = String(body.code ?? "").trim();
    const subtotal = Number(body.subtotal ?? 0);

    if (!code) {
      return NextResponse.json({ ok: false, error: "EMPTY_CODE" }, { status: 400 });
    }

    const result = await validateCoupon(code, subtotal);
    if (!result.ok) {
      return NextResponse.json(result, { status: 200 });
    }
    return NextResponse.json({
      ok: true,
      code: result.coupon.code,
      description: result.coupon.description,
      discount_type: result.coupon.discount_type,
      discount_value: result.coupon.discount_value,
      discount: result.discount,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}
