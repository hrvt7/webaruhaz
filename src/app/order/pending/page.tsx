import Link from "next/link";
import { Info } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import { getLanding } from "@/lib/store";
import CopyButton from "./CopyButton";

export const revalidate = 0;

function formatHuf(n: number) {
  return new Intl.NumberFormat("hu-HU").format(n) + " Ft";
}

export default async function OrderPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const landing = await getLanding().catch(() => null);
  const pay = landing?.payment_settings ?? {};

  // Rendelés adatok lekérése a ref alapján (order.id utolsó 8 karakter)
  let total = 0;
  let customerName = "";
  if (ref) {
    const shortId = ref.split("-").pop() ?? "";
    const sb = await supabaseServer();
    const { data } = await sb
      .from("orders")
      .select("amount_total, customer_name, id")
      .ilike("id", `%${shortId.toLowerCase()}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) {
      total = data.amount_total ?? 0;
      customerName = data.customer_name ?? "";
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">Rendelés #{ref}</div>
      <h1 className="font-display text-4xl md:text-5xl mb-4">Köszönjük a rendelést!</h1>
      <p className="text-muted leading-relaxed mb-10">
        {customerName ? `${customerName}, a` : "A"} rendelést rögzítettük. A csomagot akkor adjuk fel, amint az
        utalásod megérkezett a számlánkra. Az adatokat emailben is elküldtük.
      </p>

      <div className="bg-bone p-6 md:p-8 border-l-4 border-sand">
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-4">Utalási adatok</div>

        <div className="space-y-4">
          <Row label="Bank" value={pay.bank_name ?? "—"} />
          <Row label="Kedvezményezett" value={pay.bank_beneficiary ?? "—"} />
          <Row label="Bankszámlaszám" value={pay.bank_account ?? "—"} copy mono />
          {pay.bank_iban && <Row label="IBAN" value={pay.bank_iban} copy mono />}
          {pay.bank_swift && <Row label="SWIFT / BIC" value={pay.bank_swift} copy mono />}
          <div className="border-t border-line pt-4">
            <Row label="Fizetendő összeg" value={formatHuf(total)} highlight />
            <Row label="Közlemény (kötelező!)" value={ref ?? ""} copy mono highlight />
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 text-xs text-muted">
          <Info size={14} strokeWidth={1.5} className="mt-0.5 shrink-0" />
          <div>
            Kérjük, a közlemény mezőt <strong>pontosan</strong> a fenti formában töltsd ki — ez alapján
            párosítjuk a beérkező utalást a rendelésedhez. Határidő: <strong>{pay.bank_payment_deadline_days ?? 3} munkanap</strong>.
            Amint megérkezik, emailt küldünk a csomag feladásáról.
          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-3">
        <Link
          href="/shop"
          className="inline-block border border-ink text-ink text-[11px] tracking-widest-2 uppercase px-6 py-3 hover:bg-ink hover:text-white transition-colors"
        >
          Tovább a boltba
        </Link>
        <Link
          href="/contact"
          className="inline-block text-[11px] tracking-widest-2 uppercase px-6 py-3 text-muted hover:text-ink"
        >
          Kapcsolat
        </Link>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  copy,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  copy?: boolean;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-xs text-muted shrink-0">{label}</div>
      <div className={`text-right ${mono ? "font-mono text-sm" : "text-sm"} ${highlight ? "font-semibold" : ""}`}>
        {value}
        {copy && (
          <CopyButton value={value} />
        )}
      </div>
    </div>
  );
}

