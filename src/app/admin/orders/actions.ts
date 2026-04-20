"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { renderPaymentReceived } from "@/lib/email/templates";
import { getLanding } from "@/lib/store";

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

// Előreutalás megérkezett: státusz -> paid, paid_at, email küldése a vevőnek.
export async function markOrderPaid(id: string) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: order, error: fetchErr } = await sb
    .from("orders")
    .select("id, customer_name, customer_email, amount_total, payment_method")
    .eq("id", id)
    .maybeSingle();
  if (fetchErr || !order) throw new Error("Rendelés nem található");

  const { error } = await sb
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;

  // Email — csak ha van email cím és előreutalás volt
  if (order.customer_email && order.payment_method === "bank_transfer") {
    const landing = await getLanding().catch(() => null);
    const prefix = landing?.payment_settings?.bank_memo_prefix ?? "AETHERIS";
    const shortId = order.id.replace(/-/g, "").slice(-8).toUpperCase();
    const referenceCode = `${prefix}-${shortId}`;
    const mail = renderPaymentReceived({
      customerName: order.customer_name ?? "",
      referenceCode,
      total: order.amount_total ?? 0,
    });
    sendEmail({ to: order.customer_email, subject: mail.subject, html: mail.html }).catch(() => {});
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
