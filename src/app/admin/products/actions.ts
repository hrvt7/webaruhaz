"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export type ProductI18nFields = {
  name?: string;
  short_desc?: string;
  long_desc?: string;
  materials?: string;
  care?: string;
  size_guide?: string;
};

export type ProductInput = {
  slug: string;
  sku: string;
  name: string;
  category: string;
  gender: "women" | "men" | "unisex";
  price: number;
  compare_at: number | null;
  colors: string[];
  sizes: string[];
  short_desc: string;
  long_desc: string;
  materials: string;
  care: string;
  size_guide: string;
  badge: string | null;
  images: string[];
  collection: string | null;
  active: boolean;
  sort_order: number;
  i18n: { en?: ProductI18nFields; de?: ProductI18nFields };
};

async function requireAdmin() {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data } = await sb
    .from("admin_users")
    .select("email")
    .eq("email", user.email ?? "")
    .maybeSingle();
  if (!data) throw new Error("Not admin");
  return sb;
}

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/shop/women");
  revalidatePath("/shop/men");
  revalidatePath("/shop/accessories");
  revalidatePath("/shop/sale");
  revalidatePath("/admin/products");
}

export async function saveProduct(id: string | null, input: ProductInput) {
  const sb = await requireAdmin();
  const payload = { ...input };
  if (id) {
    const { error } = await sb.from("products").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await sb.from("products").insert(payload);
    if (error) throw error;
  }
  revalidateAll();
  revalidatePath(`/product/${input.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string, slug: string) {
  const sb = await requireAdmin();
  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) throw error;
  revalidateAll();
  revalidatePath(`/product/${slug}`);
  redirect("/admin/products");
}
