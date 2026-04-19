import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "../ProductForm";
import { getT } from "@/i18n/server";
import { supabaseServer } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { t } = await getT();
  const sb = await supabaseServer();
  const [{ data: p }, { data: collections }] = await Promise.all([
    sb.from("products").select("*").eq("slug", slug).maybeSingle(),
    sb.from("collections").select("slug, title").order("created_at"),
  ]);

  if (!p) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink"
        >
          ← {t.admin.products}
        </Link>
        <h1 className="font-display text-4xl md:text-5xl mt-2">{p.name}</h1>
        <div className="mt-1 text-xs text-muted price">{p.sku}</div>
      </div>

      <ProductForm
        mode="edit"
        collections={collections ?? []}
        labels={{
          save: t.admin.save,
          delete: t.admin.delete,
          cancel: t.admin.cancel,
          confirmDelete: t.admin.confirmDelete,
          uploadImage: t.admin.uploadImage,
          dropImage: t.admin.dropImage,
          removeImage: t.admin.removeImage,
          images: t.admin.fields.images,
          fields: t.admin.fields,
        }}
        initial={{
          id: p.id,
          slug: p.slug,
          sku: p.sku,
          name: p.name,
          category: p.category,
          gender: p.gender,
          price: p.price,
          compare_at: p.compare_at,
          colors: p.colors ?? [],
          sizes: p.sizes ?? [],
          short_desc: p.short_desc ?? "",
          long_desc: p.long_desc ?? "",
          materials: p.materials ?? "",
          care: p.care ?? "",
          badge: p.badge,
          images: p.images ?? [],
          collection: p.collection,
          active: p.active,
          sort_order: p.sort_order,
        }}
      />
    </div>
  );
}
