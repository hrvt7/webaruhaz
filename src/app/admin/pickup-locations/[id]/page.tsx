import Link from "next/link";
import { notFound } from "next/navigation";
import PickupForm from "../PickupForm";
import { supabaseServer } from "@/lib/supabase/server";
import { PickupLocation } from "@/lib/shipping";

export const revalidate = 0;

export default async function EditPickupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = await supabaseServer();
  const { data } = await sb.from("pickup_locations").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const l = data as PickupLocation;

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/pickup-locations" className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink">← Átvételi pontok</Link>
        <h1 className="font-display text-4xl md:text-5xl mt-2">{l.name}</h1>
        <div className="text-xs text-muted mt-1">{l.postcode ? `${l.postcode} ` : ""}{l.city}, {l.address}</div>
      </div>
      <PickupForm
        mode="edit"
        initial={{
          id: l.id,
          name: l.name,
          address: l.address,
          city: l.city,
          postcode: l.postcode,
          phone: l.phone,
          hours: l.hours,
          notes: l.notes,
          sort_order: l.sort_order,
          active: l.active,
        }}
      />
    </div>
  );
}
