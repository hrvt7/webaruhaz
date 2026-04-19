import { NextResponse } from "next/server";
import { LOCALES, type Locale } from "@/i18n/dict";

export async function POST(req: Request) {
  const { locale } = (await req.json()) as { locale: Locale };
  if (!LOCALES.includes(locale)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("lunara-locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}
