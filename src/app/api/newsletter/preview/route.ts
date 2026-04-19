import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { renderNewsletterHtml } from "@/lib/email/newsletter-template";
import type { Product } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json();
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const slugs: string[] = body.productSlugs ?? [];
  const { data: products } = await sb
    .from("products")
    .select("*")
    .in("slug", slugs.length ? slugs : ["__none__"]);

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://webaruhaz-gamma.vercel.app";

  const html = renderNewsletterHtml({
    subject: body.subject ?? "",
    introHtml: body.introHtml ?? "",
    products: (products as Product[]) ?? [],
    baseUrl: base,
    unsubscribeUrl: `${base}/newsletter/unsubscribe?t=preview`,
  });

  return NextResponse.json({ html });
}
