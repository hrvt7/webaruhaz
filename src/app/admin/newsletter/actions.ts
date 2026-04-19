"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { renderNewsletterHtml } from "@/lib/email/newsletter-template";
import { sendEmail, emailConfigured } from "@/lib/email/send";
import type { Product } from "@/lib/store";

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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://webaruhaz-gamma.vercel.app";

export async function sendCampaign(input: {
  subject: string;
  introHtml: string;
  productSlugs: string[];
  testRecipient?: string;
}): Promise<{ ok: boolean; sent: number; mode: "live" | "dry-run"; campaignId?: string; errors?: string[] }> {
  const sb = await requireAdmin();

  // Fetch selected products
  const { data: products } = await sb
    .from("products")
    .select("*")
    .in("slug", input.productSlugs.length ? input.productSlugs : ["__none__"]);

  // Insert the campaign as draft first
  const { data: campaign, error: campErr } = await sb
    .from("newsletter_campaigns")
    .insert({
      subject: input.subject,
      intro_html: input.introHtml,
      product_slugs: input.productSlugs,
      status: "draft",
    })
    .select("id")
    .single();
  if (campErr || !campaign) {
    return { ok: false, sent: 0, mode: emailConfigured() ? "live" : "dry-run", errors: [campErr?.message ?? "Insert failed"] };
  }

  // Resolve recipients
  let recipients: { email: string; token: string }[];
  if (input.testRecipient) {
    recipients = [{ email: input.testRecipient, token: "test" }];
  } else {
    const { data: subs } = await sb
      .from("newsletter_subscribers")
      .select("email, unsubscribe_token")
      .is("unsubscribed_at", null);
    recipients = (subs ?? []).map((s) => ({ email: s.email, token: s.unsubscribe_token }));
  }

  const errors: string[] = [];
  let sent = 0;
  const mode = emailConfigured() ? "live" : "dry-run";

  for (const r of recipients) {
    const html = renderNewsletterHtml({
      subject: input.subject,
      introHtml: input.introHtml,
      products: (products as Product[]) ?? [],
      baseUrl: SITE_URL,
      unsubscribeUrl: `${SITE_URL}/newsletter/unsubscribe?t=${encodeURIComponent(r.token)}`,
    });
    const res = await sendEmail({ to: r.email, subject: input.subject, html });
    if (res.ok) sent++;
    else errors.push(`${r.email}: ${res.error ?? "unknown"}`);
  }

  // Mark campaign sent
  await sb
    .from("newsletter_campaigns")
    .update({
      status: "sent",
      recipients_count: sent,
      sent_at: new Date().toISOString(),
    })
    .eq("id", campaign.id);

  revalidatePath("/admin/newsletter");
  return { ok: errors.length === 0, sent, mode, campaignId: campaign.id, errors: errors.length ? errors : undefined };
}

export async function sendCampaignAndRedirect(formData: FormData) {
  const subject = String(formData.get("subject") ?? "");
  const introHtml = String(formData.get("introHtml") ?? "");
  const productSlugs = String(formData.get("productSlugs") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const testRecipient = (formData.get("testRecipient") as string) || undefined;

  await sendCampaign({ subject, introHtml, productSlugs, testRecipient });
  redirect("/admin/newsletter");
}
