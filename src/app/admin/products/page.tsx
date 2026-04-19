import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { getT } from "@/i18n/server";
import { CATEGORY_LABEL } from "@/lib/store";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const { t } = await getT();
  const sb = await supabaseServer();
  const { data: products } = await sb
    .from("products")
    .select("id, slug, name, sku, price, compare_at, category, images, active, sort_order")
    .order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-2">
            {t.admin.products}
          </div>
          <h1 className="font-display text-4xl md:text-5xl">{t.admin.products}</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-ink text-white text-[11px] tracking-widest-2 uppercase px-6 py-3"
        >
          {t.admin.newProduct}
        </Link>
      </div>

      <div className="bg-white border border-line overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] tracking-widest-2 uppercase text-muted border-b border-line">
              <th className="p-4 w-16"></th>
              <th className="p-4">{t.admin.fields.name}</th>
              <th className="p-4">{t.admin.fields.sku}</th>
              <th className="p-4">{t.admin.fields.category}</th>
              <th className="p-4">{t.admin.fields.price}</th>
              <th className="p-4 w-20">{t.admin.fields.active}</th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p: {
              id: string;
              slug: string;
              name: string;
              sku: string;
              price: number;
              compare_at: number | null;
              category: string;
              images: string[];
              active: boolean;
            }) => (
              <tr key={p.id} className="border-b border-line last:border-0 hover:bg-bone">
                <td className="p-3">
                  {p.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-12 h-16 object-cover bg-bone"
                    />
                  )}
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/products/${p.slug}`}
                    className="font-display hover:underline"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="p-4 price text-muted">{p.sku}</td>
                <td className="p-4 text-muted">
                  {CATEGORY_LABEL[p.category] ?? p.category}
                </td>
                <td className="p-4 price">
                  {new Intl.NumberFormat("hu-HU").format(p.price)} Ft
                  {p.compare_at && (
                    <span className="ml-2 text-xs text-muted line-through">
                      {new Intl.NumberFormat("hu-HU").format(p.compare_at)}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      p.active ? "bg-green-600" : "bg-muted"
                    }`}
                  />
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-muted text-sm">
                  —
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
