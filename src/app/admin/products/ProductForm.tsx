"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2, UploadCloud } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { saveProduct, deleteProduct, ProductInput, ProductI18nFields } from "./actions";

type Labels = {
  save: string;
  delete: string;
  cancel: string;
  confirmDelete: string;
  uploadImage: string;
  dropImage: string;
  removeImage: string;
  images: string;
  fields: {
    name: string;
    slug: string;
    sku: string;
    category: string;
    gender: string;
    price: string;
    compareAt: string;
    colors: string;
    sizes: string;
    shortDesc: string;
    longDesc: string;
    materials: string;
    care: string;
    size_guide?: string;
    badge: string;
    collection: string;
    active: string;
    sortOrder: string;
  };
};

type Props = {
  mode: "new" | "edit";
  initial: ProductInput & { id?: string | null };
  collections: { slug: string; title: string }[];
  categories: { slug: string; label: string }[];
  labels: Labels;
};

const GENDERS = ["women", "men", "unisex"] as const;

type LocaleKey = "hu" | "en" | "de";

export default function ProductForm({ mode, initial, collections, categories, labels }: Props) {
  const [state, setState] = useState<ProductInput>({ ...initial, i18n: initial.i18n ?? {} });
  const [colorsText, setColorsText] = useState(initial.colors.join(", "));
  const [sizesText, setSizesText] = useState(initial.sizes.join(", "));
  const [uploading, setUploading] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<LocaleKey>("hu");

  // Olvasás: hu → fő oszlopok, en/de → state.i18n[locale]
  const getField = (f: keyof ProductI18nFields): string => {
    if (locale === "hu") {
      switch (f) {
        case "name": return state.name;
        case "short_desc": return state.short_desc;
        case "long_desc": return state.long_desc;
        case "materials": return state.materials;
        case "care": return state.care;
        case "size_guide": return state.size_guide ?? "";
      }
    }
    return state.i18n?.[locale]?.[f] ?? "";
  };
  const setField = (f: keyof ProductI18nFields, v: string) => {
    if (locale === "hu") {
      setState((s) => ({ ...s, [f]: v }));
      return;
    }
    setState((s) => ({
      ...s,
      i18n: { ...(s.i18n || {}), [locale]: { ...(s.i18n?.[locale] || {}), [f]: v } },
    }));
  };
  const hasTranslation = (loc: LocaleKey): boolean => {
    if (loc === "hu") return true;
    const x = state.i18n?.[loc];
    if (!x) return false;
    return !!(x.name || x.short_desc || x.long_desc || x.materials || x.care || x.size_guide);
  };

  const onFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const sb = supabaseBrowser();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await sb.storage
        .from("lunara-media")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (upErr) throw upErr;
      const { data } = sb.storage.from("lunara-media").getPublicUrl(path);
      setState((s) => ({ ...s, images: [...s.images, data.publicUrl] }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: ProductInput = {
      ...state,
      colors: colorsText.split(",").map((s) => s.trim()).filter(Boolean),
      sizes: sizesText.split(",").map((s) => s.trim()).filter(Boolean),
      price: Number(state.price) || 0,
      compare_at: state.compare_at ? Number(state.compare_at) : null,
      sort_order: Number(state.sort_order) || 0,
      badge: state.badge || null,
      collection: state.collection || null,
    };
    start(async () => {
      try {
        await saveProduct(initial.id ?? null, payload);
      } catch (e) {
        setError((e as Error).message);
      }
    });
  };

  const remove = () => {
    if (!initial.id) return;
    if (!confirm(labels.confirmDelete)) return;
    start(async () => {
      try {
        await deleteProduct(initial.id as string, initial.slug);
      } catch (e) {
        setError((e as Error).message);
      }
    });
  };

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-8">
      <div className="bg-white border border-line p-6 md:p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Input label={labels.fields.sku} value={state.sku} onChange={(v) => setState({ ...state, sku: v })} required />
          <Input label={labels.fields.slug} value={state.slug} onChange={(v) => setState({ ...state, slug: v })} required />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Select
            label={labels.fields.category}
            value={state.category}
            onChange={(v) => setState({ ...state, category: v })}
            options={
              categories.length > 0
                ? categories.map((c) => ({ value: c.slug, label: c.label }))
                : [{ value: state.category, label: state.category }]
            }
          />
          <Select
            label={labels.fields.gender}
            value={state.gender}
            onChange={(v) => setState({ ...state, gender: v as typeof GENDERS[number] })}
            options={GENDERS.map((g) => ({ value: g, label: g }))}
          />
          <Input
            label={labels.fields.badge}
            value={state.badge ?? ""}
            onChange={(v) => setState({ ...state, badge: v })}
            placeholder="Bestseller / New arrival / ..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label={labels.fields.price}
            type="number"
            value={String(state.price)}
            onChange={(v) => setState({ ...state, price: Number(v) })}
          />
          <Input
            label={labels.fields.compareAt}
            type="number"
            value={state.compare_at ? String(state.compare_at) : ""}
            onChange={(v) => setState({ ...state, compare_at: v ? Number(v) : null })}
          />
        </div>

        <Input label={labels.fields.colors} value={colorsText} onChange={setColorsText} />
        <Input label={labels.fields.sizes} value={sizesText} onChange={setSizesText} />

        {/* Nyelvi fülek a lefordítható mezőkhöz */}
        <div className="flex items-center gap-2 pt-2 border-t border-line">
          <div className="text-[10px] tracking-widest-2 uppercase text-muted">Nyelv:</div>
          {(["hu", "en", "de"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setLocale(k)}
              className={`text-[11px] tracking-widest-2 uppercase px-3 py-1 ${
                locale === k ? "bg-ink text-white" : "border border-line text-muted hover:border-ink"
              }`}
            >
              {k.toUpperCase()}
              {hasTranslation(k) ? "" : k === "hu" ? "" : " ·"}
            </button>
          ))}
          <div className="text-[10px] text-muted ml-auto">
            {locale === "hu"
              ? "Alap nyelv (fő adatok)"
              : `${locale.toUpperCase()} fordítás — üres mező a HU-ra esik vissza`}
          </div>
        </div>

        <Input label={labels.fields.name} value={getField("name")} onChange={(v) => setField("name", v)} required={locale === "hu"} />
        <Textarea label={labels.fields.shortDesc} value={getField("short_desc")} onChange={(v) => setField("short_desc", v)} rows={2} />
        <Textarea label={labels.fields.longDesc} value={getField("long_desc")} onChange={(v) => setField("long_desc", v)} rows={5} />
        <Input label={labels.fields.materials} value={getField("materials")} onChange={(v) => setField("materials", v)} />
        <Input label={labels.fields.care} value={getField("care")} onChange={(v) => setField("care", v)} />
        <Textarea
          label={labels.fields.size_guide ?? "Méret táblázat"}
          value={getField("size_guide")}
          onChange={(v) => setField("size_guide", v)}
          rows={6}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label={labels.fields.collection}
            value={state.collection ?? ""}
            onChange={(v) => setState({ ...state, collection: v || null })}
            options={[{ value: "", label: "—" }, ...collections.map((c) => ({ value: c.slug, label: c.title }))]}
          />
          <Input
            label={labels.fields.sortOrder}
            type="number"
            value={String(state.sort_order)}
            onChange={(v) => setState({ ...state, sort_order: Number(v) })}
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={state.active}
            onChange={(e) => setState({ ...state, active: e.target.checked })}
            className="accent-ink"
          />
          <span className="text-sm">{labels.fields.active}</span>
        </label>

        {error && (
          <div className="text-xs text-sale border border-sale/30 bg-sale/5 px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-line">
          <button
            type="submit"
            disabled={pending}
            className="bg-ink text-white text-[11px] tracking-widest-2 uppercase px-6 py-3 disabled:opacity-60"
          >
            {pending ? "…" : labels.save}
          </button>
          <Link
            href="/admin/products"
            className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink"
          >
            {labels.cancel}
          </Link>
          {mode === "edit" && (
            <button
              type="button"
              onClick={remove}
              className="ml-auto text-[11px] tracking-widest-2 uppercase text-sale hover:opacity-60 flex items-center gap-1"
            >
              <Trash2 size={14} strokeWidth={1.4} /> {labels.delete}
            </button>
          )}
        </div>
      </div>

      <aside className="bg-white border border-line p-6 space-y-4 h-fit">
        <div className="text-[11px] tracking-widest-2 uppercase">{labels.images}</div>

        <label className="block border border-dashed border-line hover:border-ink p-6 text-center cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }}
          />
          <UploadCloud size={22} strokeWidth={1.4} className="mx-auto text-muted" />
          <div className="mt-2 text-xs text-muted">
            {uploading ? "…" : labels.dropImage}
          </div>
        </label>

        <div className="grid grid-cols-2 gap-2">
          {state.images.map((url, i) => (
            <div key={i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="w-full aspect-[3/4] object-cover bg-bone"
              />
              <button
                type="button"
                onClick={() =>
                  setState({
                    ...state,
                    images: state.images.filter((_, idx) => idx !== i),
                  })
                }
                className="absolute top-1 right-1 bg-white/90 text-ink text-[9px] tracking-widest-2 uppercase px-2 py-1 opacity-0 group-hover:opacity-100"
              >
                {labels.removeImage}
              </button>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-muted leading-relaxed">
          URL-eket is beilleszthetsz:
        </div>
        <div className="flex gap-2">
          <input
            placeholder="https://..."
            className="flex-1 border-b border-line py-1 text-xs outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const v = (e.target as HTMLInputElement).value.trim();
                if (v) {
                  setState({ ...state, images: [...state.images, v] });
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
        </div>
      </aside>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-1">
        {label}
      </div>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-1">
        {label}
      </div>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line focus:border-ink p-3 outline-none bg-transparent text-sm"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-1">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
