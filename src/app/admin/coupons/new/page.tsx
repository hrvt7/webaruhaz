import Link from "next/link";
import CouponForm from "../CouponForm";

export default function NewCouponPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/coupons" className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink">← Kuponok</Link>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Új kupon</h1>
      </div>
      <CouponForm
        mode="new"
        initial={{
          code: "",
          description: "",
          discount_type: "percent",
          discount_value: 10,
          min_order: 0,
          max_uses: null,
          expires_at: null,
          active: true,
        }}
      />
    </div>
  );
}
