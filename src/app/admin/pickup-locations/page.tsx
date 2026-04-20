import Link from "next/link";
import { Plus, MapPin } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import { PickupLocation } from "@/lib/shipping";

export const revalidate = 0;

export default async function PickupLocationsAdminPage() {
  const sb = await supabaseServer();
  const { data } = await sb.from("pickup_locations").select("*").order("sort_order");
  const locations = (data as PickupLocation[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">Átvételi pontok</h1>
          <p className="text-sm text-muted mt-2 max-w-xl">
            Személyes átvételi helyek (saját boltok, raktár). A vevő a kosárban választhatja,
            ha a <strong>Személyes átvétel</strong> opciót választja. Ingyenes, nincs szállítási díj.
          </p>
        </div>
        <Link
          href="/admin/pickup-locations/new"
          className="inline-flex items-center gap-2 bg-ink text-white text-[11px] tracking-widest-2 uppercase px-5 py-3 hover:bg-accent"
        >
          <Plus size={14} /> Új bolt
        </Link>
      </div>

      {locations.length === 0 ? (
        <div className="bg-white border border-line p-10 text-center text-muted">
          Még nincs átvételi pont.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {locations.map((l) => (
            <Link
              key={l.id}
              href={`/admin/pickup-locations/${l.id}`}
              className="bg-white border border-line hover:border-ink p-5 flex gap-4"
            >
              <div className="w-12 h-12 bg-bone shrink-0 grid place-items-center">
                <MapPin size={20} strokeWidth={1.4} className="text-ink/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-xl truncate">{l.name}</div>
                <div className="text-xs text-muted mt-1">
                  {l.postcode ? `${l.postcode} ` : ""}
                  {l.city}, {l.address}
                </div>
                {l.hours && (
                  <div className="text-[10px] text-muted whitespace-pre-line mt-2">{l.hours}</div>
                )}
                <div className="text-[10px] text-muted mt-2">
                  {l.active ? "✓ Aktív" : "⊘ Rejtve"} · Sorrend: {l.sort_order}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
