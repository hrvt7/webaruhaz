"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { LandingContent } from "@/lib/store";

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

export async function saveLanding(data: LandingContent) {
  const sb = await requireAdmin();
  const { error } = await sb
    .from("site_content")
    .upsert({ id: "landing", data });
  if (error) throw error;
  revalidatePath("/", "layout");
  revalidatePath("/admin/landing");
  return { ok: true };
}
