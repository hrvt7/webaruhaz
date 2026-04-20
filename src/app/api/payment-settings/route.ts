import { NextResponse } from "next/server";
import { getLanding } from "@/lib/store";

export const revalidate = 60;

// Csak a publikus szempontból lényeges mezőket adjuk át (nem a teljes bank infót —
// az email-ben + /order/pending oldalon mutatjuk, nem kell szerepelnie a HTML-ben rendelés előtt).
export async function GET() {
  const landing = await getLanding().catch(() => null);
  const pay = landing?.payment_settings;
  return NextResponse.json({
    cod_fee_huf: pay?.cod_fee_huf ?? 490,
    bank_configured: Boolean(pay?.bank_account),
  });
}
