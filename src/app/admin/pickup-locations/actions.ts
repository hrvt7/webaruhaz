"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export type PickupLocationInput = {
  name: string;
  address: string;
  city: string;
  postcode: string | null;
  phone: string | null;
  hours: string | null;
  notes: string | null;
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

export async function savePickupLocation(id: string | null, input: PickupLocationInput) {
  const sb = await requireAdmin();
  const payload = { ...input, updated_at: new Date().toISOString() };
  if (id) {
    const { error } = await sb.from("pickup_locations").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await sb.from("pickup_locations").insert(payload);
    if (error) throw error;
  }
  revalidatePath("/admin/pickup-locations");
  revalidatePath("/", "layout");
  redirect("/admin/pickup-locations");
}

export async function deletePickupLocation(id: string) {
  const sb = await requireAdmin();
  const { error } = await sb.from("pickup_locations").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/pickup-locations");
  revalidatePath("/", "layout");
  redirect("/admin/pickup-locations");
}
