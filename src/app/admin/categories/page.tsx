import Link from "next/link";
import { Plus } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import { Category } from "@/lib/store";
import { localize } from "@/lib/localize";

export const revalidate = 0;

export default async function CategoriesAdminPage() {
  const sb = await supabaseServer();
  const { data } = await sb.from("categories").select("*").order("sort_order");
  const categories = (data as Category[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">Kategóriák</h1>
          <p className="text-sm text-muted mt-2 max-w-xl">
            Új kategória létrehozása, meglévők átnevezése, képcsere. A kategória <code className="font-mono text-xs">slug</code>-ja az URL-ben jelenik meg:
            például a <code className="font-mono text-xs">women</code> kategória → <code className="font-mono text-xs">/shop/women</code>.
            A termék szerkesztésnél a kategória legördülő mező innen olvassa fel a listát.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-ink text-white text-[11px] tracking-widest-2 uppercase px-5 py-3 hover:bg-accent"
        >
          <Plus size={14} /> Új kategória
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white border border-line p-10 text-center text-muted">Még nincs kategória.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/admin/categories/${c.slug}`}
              className="bg-white border border-line hover:border-ink p-5 flex items-center gap-4"
            >
              {c.card_image ? (
                /\.(mp4|webm|mov|m4v)(\?|$)/i.test(c.card_image) ? (
                  <video src={c.card_image} autoPlay loop muted playsInline className="w-20 h-20 object-cover bg-bone shrink-0" />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={c.card_image} alt="" className="w-20 h-20 object-cover bg-bone shrink-0" />
                )
              ) : (
                <div className="w-20 h-20 bg-bone shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-display text-xl truncate">{localize(c.title, "hu") || c.slug}</div>
                <div className="text-xs text-muted font-mono">/{c.slug}</div>
                <div className="text-[10px] text-muted mt-1">
                  {c.active ? "✓ Aktív" : "⊘ Rejtve"} · Sorrend: {c.sort_order}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
