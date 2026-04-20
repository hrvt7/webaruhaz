import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryForm from "../CategoryForm";
import { supabaseServer } from "@/lib/supabase/server";
import { Category } from "@/lib/store";
import { localize } from "@/lib/localize";

export const revalidate = 0;

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sb = await supabaseServer();
  const { data } = await sb.from("categories").select("*").eq("slug", slug).maybeSingle();
  const c = data as Category | null;
  if (!c) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/categories" className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink">← Kategóriák</Link>
        <h1 className="font-display text-4xl md:text-5xl mt-2">{localize(c.title, "hu") || c.slug}</h1>
        <div className="text-xs text-muted font-mono mt-1">/shop/{c.slug}</div>
      </div>
      <CategoryForm
        mode="edit"
        initial={{
          id: c.id,
          slug: c.slug,
          title: c.title,
          subtitle: c.subtitle,
          image: c.image,
          card_image: c.card_image,
          sort_order: c.sort_order,
          active: c.active,
        }}
      />
    </div>
  );
}
