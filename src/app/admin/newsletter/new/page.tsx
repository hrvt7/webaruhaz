import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import CampaignForm from "./CampaignForm";

export const revalidate = 0;

export default async function NewCampaignPage() {
  const sb = await supabaseServer();
  const [{ data: products }, { count: activeCount }] = await Promise.all([
    sb.from("products").select("slug, name, price, images, badge").eq("active", true).order("sort_order"),
    sb.from("newsletter_subscribers").select("id", { count: "exact", head: true }).is("unsubscribed_at", null),
  ]);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/newsletter"
          className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink"
        >
          ← Hírlevél
        </Link>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Új hírlevél</h1>
      </div>

      <CampaignForm products={products ?? []} activeCount={activeCount ?? 0} />
    </div>
  );
}
