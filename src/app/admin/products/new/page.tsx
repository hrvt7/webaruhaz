import Link from "next/link";
import ProductForm from "../ProductForm";
import { getT } from "@/i18n/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getCategories } from "@/lib/store";
import { localize } from "@/lib/localize";

export const revalidate = 0;

export default async function NewProductPage() {
  const { t, locale } = await getT();
  const sb = await supabaseServer();
  const [{ data: collections }, cats] = await Promise.all([
    sb.from("collections").select("slug, title").order("created_at"),
    getCategories(false),
  ]);
  const categories = cats.map((c) => ({ slug: c.slug, label: localize(c.title, locale) || c.slug }));

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink"
        >
          ← {t.admin.products}
        </Link>
        <h1 className="font-display text-4xl md:text-5xl mt-2">{t.admin.newProduct}</h1>
      </div>

      <ProductForm
        mode="new"
        collections={collections ?? []}
        categories={categories}
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
          slug: "",
          sku: "",
          name: "",
          category: categories[0]?.slug ?? "women",
          gender: "women",
          price: 0,
          compare_at: null,
          colors: [],
          sizes: [],
          short_desc: "",
          long_desc: "",
          materials: "",
          care: "",
          size_guide: "",
          badge: null,
          images: [],
          collection: null,
          active: true,
          sort_order: 100,
          i18n: {},
        }}
      />
    </div>
  );
}
