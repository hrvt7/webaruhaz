"use client";

import { useState, useTransition } from "react";
import { UploadCloud } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { LandingContent } from "@/lib/store";
import { saveLanding } from "./actions";

export default function LandingForm({
  initial,
  labels,
}: {
  initial: LandingContent;
  labels: { save: string; savedAt: string; dropImage: string };
}) {
  const [state, setState] = useState<LandingContent>(initial);
  const [pending, start] = useTransition();
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = async (
    file: File,
    set: (url: string) => void,
    folder = "landing",
  ) => {
    try {
      const sb = supabaseBrowser();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await sb.storage
        .from("lunara-media")
        .upload(path, file, { cacheControl: "31536000" });
      if (upErr) throw upErr;
      const { data } = sb.storage.from("lunara-media").getPublicUrl(path);
      set(data.publicUrl);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      try {
        await saveLanding(state);
        setSavedAt(new Date().toLocaleTimeString());
      } catch (e) {
        setError((e as Error).message);
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-10">
      <Section title="Hero">
        <Text label="Overline" v={state.hero.overline} on={(v) => setState({ ...state, hero: { ...state.hero, overline: v } })} />
        <div className="grid md:grid-cols-2 gap-4">
          <Text label="Title line 1" v={state.hero.title_line_1} on={(v) => setState({ ...state, hero: { ...state.hero, title_line_1: v } })} />
          <Text label="Title line 2" v={state.hero.title_line_2} on={(v) => setState({ ...state, hero: { ...state.hero, title_line_2: v } })} />
        </div>
        <Text label="Subtitle" v={state.hero.subtitle} on={(v) => setState({ ...state, hero: { ...state.hero, subtitle: v } })} />
        <ImagePicker
          label="Hero image"
          v={state.hero.image}
          on={(url) => setState({ ...state, hero: { ...state.hero, image: url } })}
          onFile={(f) => upload(f, (u) => setState((s) => ({ ...s, hero: { ...s.hero, image: u } })), "landing/hero")}
          dropLabel={labels.dropImage}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <Text label="CTA 1 (Women)" v={state.hero.cta_women} on={(v) => setState({ ...state, hero: { ...state.hero, cta_women: v } })} />
          <Text label="CTA 2 (Men)" v={state.hero.cta_men} on={(v) => setState({ ...state, hero: { ...state.hero, cta_men: v } })} />
        </div>
      </Section>

      <Section title="Brand story">
        <Text label="Overline" v={state.brand_story.overline} on={(v) => setState({ ...state, brand_story: { ...state.brand_story, overline: v } })} />
        <Area label="Title (\\n for line-break)" v={state.brand_story.title} on={(v) => setState({ ...state, brand_story: { ...state.brand_story, title: v } })} rows={2} />
        <Area label="Body 1" v={state.brand_story.body_1} on={(v) => setState({ ...state, brand_story: { ...state.brand_story, body_1: v } })} rows={4} />
        <Area label="Body 2" v={state.brand_story.body_2} on={(v) => setState({ ...state, brand_story: { ...state.brand_story, body_2: v } })} rows={3} />
        <ImagePicker
          label="Image"
          v={state.brand_story.image}
          on={(url) => setState({ ...state, brand_story: { ...state.brand_story, image: url } })}
          onFile={(f) => upload(f, (u) => setState((s) => ({ ...s, brand_story: { ...s.brand_story, image: u } })), "landing/brand")}
          dropLabel={labels.dropImage}
        />
      </Section>

      <Section title="Collection highlight">
        <Text label="Overline" v={state.collection_highlight.overline} on={(v) => setState({ ...state, collection_highlight: { ...state.collection_highlight, overline: v } })} />
        <div className="grid md:grid-cols-2 gap-4">
          <Text label="Title" v={state.collection_highlight.title} on={(v) => setState({ ...state, collection_highlight: { ...state.collection_highlight, title: v } })} />
          <Text label="Slug (cél URL)" v={state.collection_highlight.slug} on={(v) => setState({ ...state, collection_highlight: { ...state.collection_highlight, slug: v } })} />
        </div>
        <Text label="Subtitle" v={state.collection_highlight.subtitle} on={(v) => setState({ ...state, collection_highlight: { ...state.collection_highlight, subtitle: v } })} />
        <ImagePicker
          label="Background image"
          v={state.collection_highlight.image}
          on={(url) => setState({ ...state, collection_highlight: { ...state.collection_highlight, image: url } })}
          onFile={(f) => upload(f, (u) => setState((s) => ({ ...s, collection_highlight: { ...s.collection_highlight, image: u } })), "landing/collection")}
          dropLabel={labels.dropImage}
        />
      </Section>

      <Section title="Lookbook (3 kép a főoldal alján)">
        <div className="grid md:grid-cols-3 gap-4">
          <ImagePicker
            label="Első (nagy, bal oldal)"
            v={state.editorial?.image1 || ""}
            on={(url) => setState({ ...state, editorial: { image1: url, image2: state.editorial?.image2 || "", image3: state.editorial?.image3 || "" } })}
            onFile={(f) => upload(f, (u) => setState((s) => ({ ...s, editorial: { image1: u, image2: s.editorial?.image2 || "", image3: s.editorial?.image3 || "" } })), "landing/editorial")}
            dropLabel={labels.dropImage}
          />
          <ImagePicker
            label="Második (jobb felül)"
            v={state.editorial?.image2 || ""}
            on={(url) => setState({ ...state, editorial: { image1: state.editorial?.image1 || "", image2: url, image3: state.editorial?.image3 || "" } })}
            onFile={(f) => upload(f, (u) => setState((s) => ({ ...s, editorial: { image1: s.editorial?.image1 || "", image2: u, image3: s.editorial?.image3 || "" } })), "landing/editorial")}
            dropLabel={labels.dropImage}
          />
          <ImagePicker
            label="Harmadik (jobb alul)"
            v={state.editorial?.image3 || ""}
            on={(url) => setState({ ...state, editorial: { image1: state.editorial?.image1 || "", image2: state.editorial?.image2 || "", image3: url } })}
            onFile={(f) => upload(f, (u) => setState((s) => ({ ...s, editorial: { image1: s.editorial?.image1 || "", image2: s.editorial?.image2 || "", image3: u } })), "landing/editorial")}
            dropLabel={labels.dropImage}
          />
        </div>
      </Section>

      <Section title="Futó szalag (marquee)">
        <div className="text-xs text-muted mb-3">
          A hero alatt ismétlődő szövegek, vesszővel elválasztva. Pl: <em>Magyar márka, Ingyenes szállítás 30.000 Ft felett, 14 napos visszaküldés, Edzésre szabva</em>
        </div>
        <Area
          label="Szövegek (vesszővel elválasztva)"
          v={(state.marquee?.items ?? []).join(", ")}
          on={(v) =>
            setState({
              ...state,
              marquee: { items: v.split(",").map((s) => s.trim()).filter(Boolean) },
            })
          }
          rows={3}
        />
      </Section>

      {error && (
        <div className="text-xs text-sale border border-sale/30 bg-sale/5 px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 sticky bottom-0 bg-bone py-4 border-t border-line">
        <button
          type="submit"
          disabled={pending}
          className="bg-ink text-white text-[11px] tracking-widest-2 uppercase px-8 py-4 disabled:opacity-60"
        >
          {pending ? "…" : labels.save}
        </button>
        {savedAt && (
          <div className="text-xs text-muted">
            ✓ {labels.savedAt} {savedAt}
          </div>
        )}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-line p-6 md:p-8 space-y-5">
      <div className="font-display text-2xl">{title}</div>
      {children}
    </div>
  );
}

function Text({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-1">{label}</div>
      <input
        value={v}
        onChange={(e) => on(e.target.value)}
        className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm"
      />
    </label>
  );
}

function Area({ label, v, on, rows }: { label: string; v: string; on: (v: string) => void; rows?: number }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-1">{label}</div>
      <textarea
        value={v}
        rows={rows}
        onChange={(e) => on(e.target.value)}
        className="w-full border border-line focus:border-ink p-3 outline-none bg-transparent text-sm"
      />
    </label>
  );
}

function ImagePicker({
  label,
  v,
  on,
  onFile,
  dropLabel,
}: {
  label: string;
  v: string;
  on: (v: string) => void;
  onFile: (f: File) => void;
  dropLabel: string;
}) {
  return (
    <div>
      <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-2">{label}</div>
      {v && (
        /\.(mp4|webm|mov|m4v)(\?|$)/i.test(v) ? (
          <video src={v} autoPlay loop muted playsInline className="w-full aspect-[16/7] object-cover bg-bone mb-3" />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={v} alt="" className="w-full aspect-[16/7] object-cover bg-bone mb-3" />
        )
      )}
      <div className="flex gap-3 items-center">
        <label className="inline-flex items-center gap-2 border border-line px-4 py-2 cursor-pointer hover:border-ink text-sm">
          <input
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }}
          />
          <UploadCloud size={14} strokeWidth={1.5} />
          {dropLabel}
        </label>
        <input
          value={v}
          onChange={(e) => on(e.target.value)}
          placeholder="https://..."
          className="flex-1 border-b border-line py-2 text-sm outline-none"
        />
      </div>
    </div>
  );
}
