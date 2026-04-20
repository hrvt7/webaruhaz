import Link from "next/link";
import CategoryForm from "../CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/categories" className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink">← Kategóriák</Link>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Új kategória</h1>
      </div>
      <CategoryForm
        mode="new"
        initial={{
          slug: "",
          title: { hu: "", en: "", de: "" },
          subtitle: { hu: "", en: "", de: "" },
          image: null,
          card_image: null,
          sort_order: 100,
          active: true,
        }}
      />
    </div>
  );
}
