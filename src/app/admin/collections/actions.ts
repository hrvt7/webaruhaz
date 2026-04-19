"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export type CollectionInput = {
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  hero_image: string;
  active: boolean;
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

export async function saveCollection(id: string | null, input: CollectionInput) {
  const sb = await requireAdmin();
  if (id) {
    const { error } = await sb.from("collections").update(input).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await sb.from("collections").insert(input);
    if (error) throw error;
  }
  revalidatePath("/", "layout");
  revalidatePath(`/collections/${input.slug}`);
  revalidatePath("/admin/collections");
  redirect("/admin/collections");
}

export async function deleteCollection(id: string, slug: string) {
  const sb = await requireAdmin();
  const { error } = await sb.from("collections").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/", "layout");
  revalidatePath(`/collections/${slug}`);
  revalidatePath("/admin/collections");
  redirect("/admin/collections");
}
