"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export type CouponInput = {
  code: string;
  description: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order: number;
  max_uses: number | null;
  expires_at: string | null; // ISO vagy null
  active: boolean;
};

async function requireAdmin() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data } = await sb.from("admin_users").select("email").eq("email", user.email ?? "").maybeSingle();
  if (!data) throw new Error("Not admin");
  return sb;
}

export async function saveCoupon(id: string | null, input: CouponInput) {
  const sb = await requireAdmin();
  const payload = {
    ...input,
    code: input.code.trim().toUpperCase(),
    updated_at: new Date().toISOString(),
  };
  if (id) {
    const { error } = await sb.from("coupons").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await sb.from("coupons").insert(payload);
    if (error) throw error;
  }
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  const sb = await requireAdmin();
  const { error } = await sb.from("coupons").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}
