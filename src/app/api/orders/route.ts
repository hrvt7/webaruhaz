import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const sb = await supabaseServer();
  const { error } = await sb.from("orders").insert({
    customer_name: body.customer_name ?? "",
    customer_email: body.customer_email ?? "",
    customer_phone: body.customer_phone ?? "",
    customer_address: body.customer_address ?? "",
    note: body.note ?? "",
    items: body.items ?? [],
    subtotal: body.subtotal ?? 0,
  });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
