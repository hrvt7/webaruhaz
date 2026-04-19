"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2, UploadCloud } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { saveCollection, deleteCollection, CollectionInput } from "./actions";

type Labels = {
  save: string;
  delete: string;
  cancel: string;
  confirmDelete: string;
  dropImage: string;
  fields: {
    slug: string;
    title: string;
    subtitle: string;
    intro: string;
    heroImage: string;
    active: string;
  };
};

export default function CollectionForm({
  mode,
  initial,
  labels,
}: {
  mode: "new" | "edit";
  initial: CollectionInput & { id?: string | null };
  labels: Labels;
}) {
  const [state, setState] = useState<CollectionInput>(initial);
  const [uploading, setUploading] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File) => {
    setUploading(true);
    try {
      const sb = supabaseBrowser();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `collections/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await sb.storage
        .from("lunara-media")
        .upload(path, file, { cacheControl: "31536000" });
      if (upErr) throw upErr;
      const { data } = sb.storage.from("lunara-media").getPublicUrl(path);
      setState((s) => ({ ...s, hero_image: data.publicUrl }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      try {
        await saveCollection(initial.id ?? null, state);
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
        await deleteCollection(initial.id as string, initial.slug);
      } catch (e) {
        setError((e as Error).message);
      }
    });
  };

  return (
    <form onSubmit={submit} className="bg-white border border-line p-6 md:p-8 space-y-6 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-4">
        <Input label={labels.fields.title} value={state.title} onChange={(v) => setState({ ...state, title: v })} required />
        <Input label={labels.fields.slug} value={state.slug} onChange={(v) => setState({ ...state, slug: v })} required />
      </div>
      <Input label={labels.fields.subtitle} value={state.subtitle} onChange={(v) => setState({ ...state, subtitle: v })} />
      <Textarea label={labels.fields.intro} value={state.intro} onChange={(v) => setState({ ...state, intro: v })} rows={5} />

      <div>
        <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-2">
          {labels.fields.heroImage}
        </div>
        {state.hero_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={state.hero_image} alt="" className="w-full aspect-[16/7] object-cover bg-bone mb-3" />
        )}
        <div className="flex gap-3 items-center">
          <label className="inline-flex items-center gap-2 border border-line px-4 py-2 cursor-pointer hover:border-ink text-sm">
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
            <UploadCloud size={14} strokeWidth={1.5} />
            {uploading ? "…" : labels.dropImage}
          </label>
          <input
            value={state.hero_image}
            onChange={(e) => setState({ ...state, hero_image: e.target.value })}
            placeholder="https://..."
            className="flex-1 border-b border-line py-2 text-sm outline-none"
          />
        </div>
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
          href="/admin/collections"
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
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-1">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
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
      <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-1">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full border border-line focus:border-ink p-3 outline-none bg-transparent text-sm"
      />
    </label>
  );
}
