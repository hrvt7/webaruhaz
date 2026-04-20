import Link from "next/link";
import { Plus } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";

export const revalidate = 0;

type CouponRow = {
  id: string;
  code: string;
  description: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order: number;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  active: boolean;
};

export default async function CouponsAdminPage() {
  const sb = await supabaseServer();
  const { data } = await sb.from("coupons").select("*").order("created_at", { ascending: false });
  const coupons = (data as CouponRow[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">Kuponok</h1>
          <p className="text-sm text-muted mt-2 max-w-xl">
            Kuponkódok létrehozása és kezelése. A vásárló a kosárban adja meg a kódot,
            az oldal szerver-oldalon ellenőrzi és levonja a kedvezményt.
          </p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center gap-2 bg-ink text-white text-[11px] tracking-widest-2 uppercase px-5 py-3 hover:bg-accent"
        >
          <Plus size={14} /> Új kupon
        </Link>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-white border border-line p-10 text-center text-muted">Még nincs kupon.</div>
      ) : (
        <div className="bg-white border border-line overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bone">
              <tr className="text-[10px] tracking-widest-2 uppercase text-muted">
                <th className="text-left py-3 px-4">Kód</th>
                <th className="text-left py-3 px-4">Leírás</th>
                <th className="text-left py-3 px-4">Kedvezmény</th>
                <th className="text-left py-3 px-4">Min. rendelés</th>
                <th className="text-left py-3 px-4">Használat</th>
                <th className="text-left py-3 px-4">Lejárat</th>
                <th className="text-left py-3 px-4">Státusz</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => {
                const expired = c.expires_at && new Date(c.expires_at) < new Date();
                const usedUp = c.max_uses !== null && c.uses_count >= c.max_uses;
                const state = !c.active ? "INAKTÍV" : expired ? "LEJÁRT" : usedUp ? "ELFOGYOTT" : "AKTÍV";
                const stateColor = state === "AKTÍV" ? "text-green-700" : "text-muted";
                return (
                  <tr key={c.id} className="border-t border-line hover:bg-bone/50">
                    <td className="py-3 px-4">
                      <Link href={`/admin/coupons/${c.id}`} className="font-mono tracking-widest-2 uppercase hover:underline">
                        {c.code}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted max-w-xs truncate">{c.description || "—"}</td>
                    <td className="py-3 px-4 price">
                      {c.discount_type === "percent" ? `${c.discount_value}%` : `${c.discount_value.toLocaleString("hu-HU")} Ft`}
                    </td>
                    <td className="py-3 px-4 price text-xs">
                      {c.min_order > 0 ? `${c.min_order.toLocaleString("hu-HU")} Ft` : "—"}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {c.uses_count}
                      {c.max_uses !== null ? ` / ${c.max_uses}` : ""}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {c.expires_at ? new Date(c.expires_at).toLocaleDateString("hu-HU") : "Soha"}
                    </td>
                    <td className={`py-3 px-4 text-[11px] tracking-widest-2 uppercase ${stateColor}`}>
                      {state}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
