import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const name = body.name ? String(body.name).trim() : null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Érvénytelen email." }, { status: 400 });
  }

  const sb = await supabaseServer();
  const { error } = await sb.from("newsletter_subscribers").insert({
    email,
    name,
    source: body.source ?? "footer",
  });
  if (error) {
    // Unique violation = already subscribed — silent success
    if (String(error.code) === "23505") return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
