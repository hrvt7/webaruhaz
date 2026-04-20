"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2, UploadCloud } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { saveCategory, deleteCategory, CategoryInput } from "./actions";
import { I18nText } from "@/components/admin/I18nInput";

export default function CategoryForm({
  mode,
  initial,
}: {
  mode: "new" | "edit";
  initial: CategoryInput & { id?: string | null };
}) {
  const [state, setState] = useState<CategoryInput>(initial);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, set: (url: string) => void, folder: string) => {
    try {
      const sb = supabaseBrowser();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await sb.storage.from("lunara-media").upload(path, file, { cacheControl: "31536000" });
      if (upErr) throw upErr;
      const { data } = sb.storage.from("lunara-media").getPublicUrl(path);
      set(data.publicUrl);
    } catch (e) { setError((e as Error).message); }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      try { await saveCategory(initial.id ?? null, state); }
      catch (e) { setError((e as Error).message); }
    });
  };

  const remove = () => {
    if (!initial.id || !confirm("Biztosan törlöd? A termékek kategória-mezője megmarad, csak a kategória törlődik.")) return;
    start(async () => {
      try { await deleteCategory(initial.id as string, initial.slug); }
      catch (e) { setError((e as Error).message); }
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl bg-white border border-line p-6 md:p-8 space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-1">Slug (URL rész, pl. `women`, `accessories`)</div>
          <input
            required
            value={state.slug}
            onChange={(e) => setState({ ...state, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
            className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm font-mono"
          />
        </label>
        <label className="block">
          <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-1">Sorrend (kisebb = előrébb)</div>
          <input
            type="number"
            value={state.sort_order}
            onChange={(e) => setState({ ...state, sort_order: Number(e.target.value) })}
            className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm"
          />
        </label>
      </div>

      <I18nText
        label="Kategória név"
        value={state.title}
        onChange={(v) => setState({ ...state, title: v })}
      />
      <I18nText
        label="Alcím (shop oldal alatti leírás)"
        value={state.subtitle}
        onChange={(v) => setState({ ...state, subtitle: v })}
      />

      <ImagePick
        label="Főoldali kártya képe (főoldalon megjelenik)"
        v={state.card_image || ""}
        on={(url) => setState({ ...state, card_image: url })}
        onFile={(f) => upload(f, (u) => setState((s) => ({ ...s, card_image: u })), "categories/card")}
      />
      <ImagePick
        label="Shop oldal fejléc képe (opcionális)"
        v={state.image || ""}
        on={(url) => setState({ ...state, image: url })}
        onFile={(f) => upload(f, (u) => setState((s) => ({ ...s, image: u })), "categories/hero")}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={state.active}
          onChange={(e) => setState({ ...state, active: e.target.checked })}
          className="accent-ink"
        />
        <span className="text-sm">Aktív (látható a boltban)</span>
      </label>

      {error && <div className="text-xs text-sale border border-sale/30 bg-sale/5 px-3 py-2">{error}</div>}

      <div className="flex items-center gap-3 pt-4 border-t border-line">
        <button type="submit" disabled={pending} className="bg-ink text-white text-[11px] tracking-widest-2 uppercase px-6 py-3 disabled:opacity-60">
          {pending ? "…" : "Mentés"}
        </button>
        <Link href="/admin/categories" className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink">Mégse</Link>
        {mode === "edit" && (
          <button type="button" onClick={remove} className="ml-auto text-[11px] tracking-widest-2 uppercase text-sale hover:opacity-60 flex items-center gap-1">
            <Trash2 size={14} strokeWidth={1.4} /> Törlés
          </button>
        )}
      </div>
    </form>
  );
}

function ImagePick({
  label, v, on, onFile,
}: {
  label: string; v: string; on: (v: string) => void; onFile: (f: File) => void;
}) {
  return (
    <div>
      <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-2">{label}</div>
      {v && (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(v)
        ? <video src={v} autoPlay loop muted playsInline className="w-full aspect-[4/5] object-cover bg-bone mb-3" />
        : <img src={v} alt="" className="w-full aspect-[4/5] object-cover bg-bone mb-3" />)}
      <div className="flex gap-3 items-center">
        <label className="inline-flex items-center gap-2 border border-line px-4 py-2 cursor-pointer hover:border-ink text-sm">
          <input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
          <UploadCloud size={14} strokeWidth={1.5} /> Feltöltés
        </label>
        <input value={v} onChange={(e) => on(e.target.value)} placeholder="https://..." className="flex-1 border-b border-line py-2 text-sm outline-none" />
      </div>
    </div>
  );
}
