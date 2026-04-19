"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function signInAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/admin");

  const sb = await supabaseServer();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  // Verify the user is on the admin allowlist
  const {
    data: { user },
  } = await sb.auth.getUser();
  const { data: allowed } = await sb
    .from("admin_users")
    .select("email")
    .eq("email", user?.email ?? "")
    .maybeSingle();

  if (!allowed) {
    await sb.auth.signOut();
    return { error: "Ez a fiók nem admin." };
  }

  redirect(redirectTo || "/admin");
}
