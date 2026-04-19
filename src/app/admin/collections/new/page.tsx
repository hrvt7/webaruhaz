import Link from "next/link";
import CollectionForm from "../CollectionForm";
import { getT } from "@/i18n/server";

export default async function NewCollectionPage() {
  const { t } = await getT();
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/collections"
          className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink"
        >
          ← {t.admin.collections}
        </Link>
        <h1 className="font-display text-4xl md:text-5xl mt-2">+ {t.admin.collections}</h1>
      </div>

      <CollectionForm
        mode="new"
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
          slug: "",
          title: "",
          subtitle: "",
          intro: "",
          hero_image: "",
          active: true,
        }}
      />
    </div>
  );
}
