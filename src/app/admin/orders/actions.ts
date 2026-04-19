"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

export async function updateOrderStatus(id: string, status: string) {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await sb.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
