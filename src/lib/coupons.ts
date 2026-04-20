import { supabaseServer } from "@/lib/supabase/server";

export type Coupon = {
  id: string;
  code: string;
  description: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order: number;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  active: boolean;
};

export type CouponCheck =
  | { ok: true; discount: number; coupon: Coupon }
  | { ok: false; error: string };

// Szerver-oldali kupon validálás.
// Visszaadja a pontos kedvezmény összegét HUF-ban (fix összeg vagy százalékos).
export async function validateCoupon(
  codeInput: string,
  subtotalHuf: number,
): Promise<CouponCheck> {
  if (!codeInput || !codeInput.trim()) {
    return { ok: false, error: "EMPTY_CODE" };
  }
  const sb = await supabaseServer();
  const code = codeInput.trim();
  const { data, error } = await sb
    .from("coupons")
    .select("*")
    .ilike("code", code)
    .maybeSingle();
  if (error) return { ok: false, error: "LOOKUP_FAILED" };
  if (!data) return { ok: false, error: "NOT_FOUND" };
  const c = data as Coupon;

  if (!c.active) return { ok: false, error: "INACTIVE" };
  if (c.expires_at && new Date(c.expires_at) < new Date()) {
    return { ok: false, error: "EXPIRED" };
  }
  if (c.max_uses !== null && c.uses_count >= c.max_uses) {
    return { ok: false, error: "USED_UP" };
  }
  if (c.min_order > 0 && subtotalHuf < c.min_order) {
    return { ok: false, error: `MIN_ORDER:${c.min_order}` };
  }

  let discount = 0;
  if (c.discount_type === "percent") {
    // Százalékos, felfelé kerekítve, soha nem több mint a subtotal
    discount = Math.min(Math.round((subtotalHuf * c.discount_value) / 100), subtotalHuf);
  } else {
    discount = Math.min(c.discount_value, subtotalHuf);
  }
  if (discount <= 0) return { ok: false, error: "ZERO_DISCOUNT" };

  return { ok: true, discount, coupon: c };
}

// Használat-inkrementálás (fizetés után hívandó). RPC-n keresztül, atomikus.
export async function incrementCouponUse(code: string) {
  const sb = await supabaseServer();
  await sb.rpc("increment_coupon_use", { coupon_code_in: code });
}
