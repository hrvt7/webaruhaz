import Link from "next/link";
import PickupForm from "../PickupForm";

export default function NewPickupPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/pickup-locations" className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink">← Átvételi pontok</Link>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Új átvételi pont</h1>
      </div>
      <PickupForm
        mode="new"
        initial={{
          name: "",
          address: "",
          city: "",
          postcode: null,
          phone: null,
          hours: null,
          notes: null,
          sort_order: 100,
          active: true,
        }}
      />
    </div>
  );
}
