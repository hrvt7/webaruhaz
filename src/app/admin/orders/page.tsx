import { supabaseServer } from "@/lib/supabase/server";
import { getT } from "@/i18n/server";
import OrderRow from "./OrderRow";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const { t } = await getT();
  const sb = await supabaseServer();
  const { data: orders } = await sb
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-10">
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-2">
          {t.admin.orders}
        </div>
        <h1 className="font-display text-4xl md:text-5xl">{t.admin.orders}</h1>
      </div>

      <div className="bg-white border border-line overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] tracking-widest-2 uppercase text-muted border-b border-line">
              <th className="p-3 w-12"></th>
              <th className="p-4">Ügyfél</th>
              <th className="p-4">Idő</th>
              <th className="p-4">Összeg</th>
              <th className="p-4">{t.admin.orderStatus}</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-muted text-sm">
                  {t.admin.noOrders}
                </td>
              </tr>
            )}
            {(orders ?? []).map((o) => (
              <OrderRow
                key={o.id}
                order={o}
                labels={{
                  status: t.admin.orderStatus,
                  statusOptions: [
                    { value: "new", label: t.admin.statusNew },
                    { value: "processing", label: t.admin.statusProcessing },
                    { value: "shipped", label: t.admin.statusShipped },
                    { value: "done", label: t.admin.statusDone },
                  ],
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
