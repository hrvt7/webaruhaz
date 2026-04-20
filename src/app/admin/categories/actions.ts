"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import type { LocalizedText } from "@/lib/localize";

export type CategoryInput = {
  slug: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  image: string | null;
  card_image: string | null;
  sort_order: number;
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

function revalAll() {
  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
}

export async function saveCategory(id: string | null, input: CategoryInput) {
  const sb = await requireAdmin();
  if (id) {
    const { error } = await sb.from("categories").update({ ...input, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await sb.from("categories").insert(input);
    if (error) throw error;
  }
  revalAll();
  revalidatePath(`/shop/${input.slug}`);
  redirect("/admin/categories");
}

export async function deleteCategory(id: string, slug: string) {
  const sb = await requireAdmin();
  const { error } = await sb.from("categories").delete().eq("id", id);
  if (error) throw error;
  revalAll();
  revalidatePath(`/shop/${slug}`);
  redirect("/admin/categories");
}
