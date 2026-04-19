import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { getT } from "@/i18n/server";

export const revalidate = 0;

export default async function AdminDashboard() {
  const { t } = await getT();
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  const [{ count: productCount }, { count: collectionCount }, { count: orderCount }] =
    await Promise.all([
      sb.from("products").select("id", { count: "exact", head: true }),
      sb.from("collections").select("id", { count: "exact", head: true }),
      sb.from("orders").select("id", { count: "exact", head: true }),
    ]);

  const { data: latestOrders } = await sb
    .from("orders")
    .select("id, customer_name, subtotal, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-2">
        {t.admin.dashboard}
      </div>
      <h1 className="font-display text-4xl md:text-5xl">
        {t.admin.greeting} {user?.email?.split("@")[0] ?? ""}
      </h1>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label={t.admin.stats.products}
          value={productCount ?? 0}
          href="/admin/products"
        />
        <StatCard
          label={t.admin.stats.collections}
          value={collectionCount ?? 0}
          href="/admin/collections"
        />
        <StatCard
          label={t.admin.stats.orders}
          value={orderCount ?? 0}
          href="/admin/orders"
        />
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] tracking-widest-2 uppercase text-muted">
            {t.admin.orders}
          </div>
          <Link href="/admin/orders" className="text-[11px] tracking-widest-2 uppercase hover:opacity-60">
            {t.home.viewAll}
          </Link>
        </div>
        <div className="bg-white border border-line">
          {latestOrders && latestOrders.length > 0 ? (
            <ul>
              {latestOrders.map((o: { id: string; customer_name: string; subtotal: number; status: string; created_at: string }) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between px-5 py-4 border-b border-line last:border-0 text-sm"
                >
                  <div>
                    <div>{o.customer_name}</div>
                    <div className="text-xs text-muted">
                      {new Date(o.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] tracking-widest-2 uppercase bg-bone px-2 py-1">
                      {o.status}
                    </span>
                    <span className="price font-mono">
                      {new Intl.NumberFormat("hu-HU").format(o.subtotal)} Ft
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-sm text-muted">
              {t.admin.noOrders}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-white border border-line p-6 hover:border-ink transition-colors"
    >
      <div className="text-[10px] tracking-widest-2 uppercase text-muted">
        {label}
      </div>
      <div className="font-display text-5xl mt-3">{value}</div>
    </Link>
  );
}
