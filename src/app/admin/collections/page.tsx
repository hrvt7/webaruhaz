import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { getT } from "@/i18n/server";

export const revalidate = 0;

export default async function AdminCollectionsPage() {
  const { t } = await getT();
  const sb = await supabaseServer();
  const { data: collections } = await sb
    .from("collections")
    .select("*")
    .order("created_at");

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-2">
            {t.admin.collections}
          </div>
          <h1 className="font-display text-4xl md:text-5xl">{t.admin.collections}</h1>
        </div>
        <Link
          href="/admin/collections/new"
          className="bg-ink text-white text-[11px] tracking-widest-2 uppercase px-6 py-3"
        >
          + {t.admin.collections}
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {(collections ?? []).map((c: { id: string; slug: string; title: string; subtitle: string; hero_image: string; active: boolean }) => (
          <Link
            key={c.id}
            href={`/admin/collections/${c.slug}`}
            className="bg-white border border-line hover:border-ink transition-colors"
          >
            <div className="aspect-[16/9] bg-bone overflow-hidden">
              {c.hero_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.hero_image} alt={c.title} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-5">
              <div className="font-display text-2xl">{c.title}</div>
              <div className="text-xs text-muted mt-1">{c.subtitle}</div>
              <div className="mt-3 text-[10px] tracking-widest-2 uppercase text-muted">
                /collections/{c.slug}
              </div>
            </div>
          </Link>
        ))}
        {(!collections || collections.length === 0) && (
          <div className="md:col-span-2 bg-white border border-line p-10 text-center text-muted text-sm">
            —
          </div>
        )}
      </div>
    </div>
  );
}
