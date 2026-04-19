import Link from "next/link";
import { notFound } from "next/navigation";
import CollectionForm from "../CollectionForm";
import { getT } from "@/i18n/server";
import { supabaseServer } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { t } = await getT();
  const sb = await supabaseServer();
  const { data: c } = await sb
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!c) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/collections"
          className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink"
        >
          ← {t.admin.collections}
        </Link>
        <h1 className="font-display text-4xl md:text-5xl mt-2">{c.title}</h1>
      </div>

      <CollectionForm
        mode="edit"
        labels={{
          save: t.admin.save,
          delete: t.admin.delete,
          cancel: t.admin.cancel,
          confirmDelete: t.admin.confirmDelete,
          dropImage: t.admin.dropImage,
          fields: {
            slug: t.admin.fields.slug,
            title: t.admin.fields.title,
            subtitle: t.admin.fields.subtitle,
            intro: t.admin.fields.intro,
            heroImage: t.admin.fields.heroImage,
            active: t.admin.fields.active,
          },
        }}
        initial={{
          id: c.id,
          slug: c.slug,
          title: c.title,
          subtitle: c.subtitle ?? "",
          intro: c.intro ?? "",
          hero_image: c.hero_image ?? "",
          active: c.active ?? true,
        }}
      />
    </div>
  );
}
