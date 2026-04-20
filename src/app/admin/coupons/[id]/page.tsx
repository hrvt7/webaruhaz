import Link from "next/link";
import { notFound } from "next/navigation";
import CouponForm from "../CouponForm";
import { supabaseServer } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = await supabaseServer();
  const { data } = await sb.from("coupons").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const c = data as {
    id: string; code: string; description: string; discount_type: "percent" | "fixed";
    discount_value: number; min_order: number; max_uses: number | null;
    uses_count: number; expires_at: string | null; active: boolean;
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/coupons" className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink">← Kuponok</Link>
        <h1 className="font-display text-4xl md:text-5xl mt-2 font-mono tracking-widest-2 uppercase">{c.code}</h1>
      </div>
      <CouponForm
        mode="edit"
        initial={{
          id: c.id,
          code: c.code,
          description: c.description ?? "",
          discount_type: c.discount_type,
          discount_value: c.discount_value,
          min_order: c.min_order,
          max_uses: c.max_uses,
          expires_at: c.expires_at,
          active: c.active,
          uses_count: c.uses_count,
        }}
      />
    </div>
  );
}
