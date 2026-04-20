"use client";

import { useState, useTransition } from "react";
import { UploadCloud } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { LandingContent } from "@/lib/store";
import type { LocalizedText } from "@/lib/localize";
import { toI18nObject } from "@/lib/localize";
import { saveLanding } from "./actions";
import { I18nText, I18nTextarea } from "@/components/admin/I18nInput";

type I18n = { hu: string; en: string; de: string };

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

  // Apróbb helper a beágyazott szekciók frissítéséhez
  const updHero = (patch: Partial<LandingContent["hero"]>) =>
    setState((s) => ({ ...s, hero: { ...s.hero, ...patch } }));
  const updBrand = (patch: Partial<LandingContent["brand_story"]>) =>
    setState((s) => ({ ...s, brand_story: { ...s.brand_story, ...patch } }));
  const updColl = (patch: Partial<LandingContent["collection_highlight"]>) =>
    setState((s) => ({ ...s, collection_highlight: { ...s.collection_highlight, ...patch } }));
  const updCats = (patch: Partial<NonNullable<LandingContent["categories"]>>) =>
    setState((s) => ({
      ...s,
      categories: {
        women_image: s.categories?.women_image || "",
        men_image: s.categories?.men_image || "",
        sets_image: s.categories?.sets_image || "",
        ...patch,
      },
    }));
  const updPartner = (patch: Partial<NonNullable<LandingContent["partnership"]>>) =>
    setState((s) => ({
      ...s,
      partnership: {
        overline: s.partnership?.overline ?? "",
        title: s.partnership?.title ?? "",
        body_1: s.partnership?.body_1 ?? "",
        body_2: s.partnership?.body_2 ?? "",
        image: s.partnership?.image ?? "",
        link: s.partnership?.link ?? "",
        cta: s.partnership?.cta ?? "",
        ...patch,
      },
    }));
  const updEditorial = (patch: Partial<NonNullable<LandingContent["editorial"]>>) =>
    setState((s) => ({
      ...s,
      editorial: {
        image1: s.editorial?.image1 || "",
        image2: s.editorial?.image2 || "",
        image3: s.editorial?.image3 || "",
        overline: s.editorial?.overline,
        title: s.editorial?.title,
        ...patch,
      },
    }));
  const updNews = (patch: Partial<NonNullable<LandingContent["newsletter"]>>) =>
    setState((s) => ({
      ...s,
      newsletter: {
        overline: s.newsletter?.overline ?? "",
        title: s.newsletter?.title ?? "",
        body: s.newsletter?.body ?? "",
        ...patch,
      },
    }));
  const updFooter = (patch: Partial<NonNullable<LandingContent["footer"]>>) =>
    setState((s) => ({
      ...s,
      footer: { tagline: s.footer?.tagline ?? "", ...patch },
    }));

  return (
    <form onSubmit={submit} className="space-y-10">
      <Section title="Hero">
        <I18nText label="Overline" value={state.hero.overline} onChange={(v) => updHero({ overline: v })} />
        <div className="grid md:grid-cols-2 gap-4">
          <I18nText label="Title line 1" value={state.hero.title_line_1} onChange={(v) => updHero({ title_line_1: v })} />
          <I18nText label="Title line 2" value={state.hero.title_line_2} onChange={(v) => updHero({ title_line_2: v })} />
        </div>
        <I18nTextarea label="Subtitle" value={state.hero.subtitle} onChange={(v) => updHero({ subtitle: v })} rows={2} />
        <ImagePicker
          label="Hero image / video"
          v={state.hero.image}
          on={(url) => updHero({ image: url })}
          onFile={(f) => upload(f, (u) => updHero({ image: u }), "landing/hero")}
          dropLabel={labels.dropImage}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <I18nText label="CTA 1 (Women)" value={state.hero.cta_women} onChange={(v) => updHero({ cta_women: v })} />
          <I18nText label="CTA 2 (Men)" value={state.hero.cta_men} onChange={(v) => updHero({ cta_men: v })} />
        </div>
      </Section>

      <Section title="Brand story">
        <I18nText label="Overline" value={state.brand_story.overline} onChange={(v) => updBrand({ overline: v })} />
        <I18nTextarea label="Title (\\n sortörés)" value={state.brand_story.title} onChange={(v) => updBrand({ title: v })} rows={2} />
        <I18nTextarea label="Body 1" value={state.brand_story.body_1} onChange={(v) => updBrand({ body_1: v })} rows={4} />
        <I18nTextarea label="Body 2" value={state.brand_story.body_2} onChange={(v) => updBrand({ body_2: v })} rows={3} />
        <ImagePicker
          label="Kép / videó"
          v={state.brand_story.image}
          on={(url) => updBrand({ image: url })}
          onFile={(f) => upload(f, (u) => updBrand({ image: u }), "landing/brand")}
          dropLabel={labels.dropImage}
        />
      </Section>

      <Section title="Collection highlight">
        <I18nText label="Overline" value={state.collection_highlight.overline} onChange={(v) => updColl({ overline: v })} />
        <div className="grid md:grid-cols-2 gap-4">
          <I18nText label="Title" value={state.collection_highlight.title} onChange={(v) => updColl({ title: v })} />
          <Text label="Slug (cél URL)" v={state.collection_highlight.slug} on={(v) => updColl({ slug: v })} />
        </div>
        <I18nTextarea label="Subtitle" value={state.collection_highlight.subtitle} onChange={(v) => updColl({ subtitle: v })} rows={2} />
        <ImagePicker
          label="Háttér kép / videó"
          v={state.collection_highlight.image}
          on={(url) => updColl({ image: url })}
          onFile={(f) => upload(f, (u) => updColl({ image: u }), "landing/collection")}
          dropLabel={labels.dropImage}
        />
      </Section>

      <Section title="Kategória kártyák (Női / Férfi / Szettek)">
        <div className="grid md:grid-cols-3 gap-4">
          <ImagePicker label="Női kártya képe" v={state.categories?.women_image || ""} on={(url) => updCats({ women_image: url })} onFile={(f) => upload(f, (u) => updCats({ women_image: u }), "landing/categories")} dropLabel={labels.dropImage} />
          <ImagePicker label="Férfi kártya képe" v={state.categories?.men_image || ""} on={(url) => updCats({ men_image: url })} onFile={(f) => upload(f, (u) => updCats({ men_image: u }), "landing/categories")} dropLabel={labels.dropImage} />
          <ImagePicker label="Szettek kártya képe" v={state.categories?.sets_image || ""} on={(url) => updCats({ sets_image: url })} onFile={(f) => upload(f, (u) => updCats({ sets_image: u }), "landing/categories")} dropLabel={labels.dropImage} />
        </div>
      </Section>

      <Section title="Partnerség szekció">
        <I18nText label="Overline" value={state.partnership?.overline ?? ""} onChange={(v) => updPartner({ overline: v })} />
        <I18nText label="Cím" value={state.partnership?.title ?? ""} onChange={(v) => updPartner({ title: v })} />
        <I18nTextarea label="Első bekezdés" rows={3} value={state.partnership?.body_1 ?? ""} onChange={(v) => updPartner({ body_1: v })} />
        <I18nTextarea label="Második bekezdés" rows={2} value={state.partnership?.body_2 ?? ""} onChange={(v) => updPartner({ body_2: v })} />
        <ImagePicker label="Kép / videó" v={state.partnership?.image || ""} on={(url) => updPartner({ image: url })} onFile={(f) => upload(f, (u) => updPartner({ image: u }), "landing/partnership")} dropLabel={labels.dropImage} />
        <Text label="Link URL" v={state.partnership?.link || ""} on={(v) => updPartner({ link: v })} />
        <I18nText label="Gomb szöveg (CTA)" value={state.partnership?.cta ?? ""} onChange={(v) => updPartner({ cta: v })} />
      </Section>

      <Section title="Lookbook (3 kép)">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <I18nText
            label="Kis felirat (overline) — üresen hagyva eltűnik"
            value={state.editorial?.overline ?? ""}
            onChange={(v) => updEditorial({ overline: v })}
          />
          <I18nText
            label="Cím — üresen hagyva eltűnik"
            value={state.editorial?.title ?? ""}
            onChange={(v) => updEditorial({ title: v })}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <ImagePicker label="Első (nagy)" v={state.editorial?.image1 || ""} on={(url) => updEditorial({ image1: url })} onFile={(f) => upload(f, (u) => updEditorial({ image1: u }), "landing/editorial")} dropLabel={labels.dropImage} />
          <ImagePicker label="Második" v={state.editorial?.image2 || ""} on={(url) => updEditorial({ image2: url })} onFile={(f) => upload(f, (u) => updEditorial({ image2: u }), "landing/editorial")} dropLabel={labels.dropImage} />
          <ImagePicker label="Harmadik" v={state.editorial?.image3 || ""} on={(url) => updEditorial({ image3: url })} onFile={(f) => upload(f, (u) => updEditorial({ image3: u }), "landing/editorial")} dropLabel={labels.dropImage} />
        </div>
      </Section>

      <Section title="Hírlevél blokk">
        <I18nText label="Overline" value={state.newsletter?.overline ?? ""} onChange={(v) => updNews({ overline: v })} />
        <I18nText label="Cím" value={state.newsletter?.title ?? ""} onChange={(v) => updNews({ title: v })} />
        <I18nTextarea label="Leírás" rows={3} value={state.newsletter?.body ?? ""} onChange={(v) => updNews({ body: v })} />
      </Section>

      <Section title="Futó szalag (marquee)">
        <div className="text-xs text-muted mb-3">
          Szövegek nyelvenként, vesszővel elválasztva. Ha egy nyelv üres, a HU-t használja.
        </div>
        <MarqueeEditor
          items={state.marquee?.items ?? []}
          onChange={(items) => setState({ ...state, marquee: { items } })}
        />
      </Section>

      <Section title="Footer / lábléc szöveg">
        <div className="text-xs text-muted mb-2">
          A lábléc bal oldalán megjelenő márka-leírás. Nyelvenként szerkeszthető.
        </div>
        <I18nTextarea
          label="Tagline / márka-leírás"
          rows={3}
          value={state.footer?.tagline ?? ""}
          onChange={(v) => updFooter({ tagline: v })}
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

function MarqueeEditor({
  items,
  onChange,
}: {
  items: LocalizedText[];
  onChange: (items: LocalizedText[]) => void;
}) {
  // 3 nyelv: minden nyelvre vessződ-elválasztott lista
  const perLocale: Record<"hu" | "en" | "de", string[]> = {
    hu: items.map((it) => toI18nObject(it).hu).filter(Boolean),
    en: items.map((it) => toI18nObject(it).en).filter(Boolean),
    de: items.map((it) => toI18nObject(it).de).filter(Boolean),
  };
  const [tab, setTab] = useState<"hu" | "en" | "de">("hu");
  const update = (k: "hu" | "en" | "de", txt: string) => {
    const arr = txt.split(",").map((s) => s.trim()).filter(Boolean);
    perLocale[k] = arr;
    // Rebuild items: minden index egy lokalizált objektum, a 3 nyelvi lista összefűzésével
    const maxLen = Math.max(perLocale.hu.length, perLocale.en.length, perLocale.de.length);
    const rebuilt: LocalizedText[] = [];
    for (let i = 0; i < maxLen; i++) {
      rebuilt.push({
        hu: perLocale.hu[i] ?? "",
        en: perLocale.en[i] ?? "",
        de: perLocale.de[i] ?? "",
      });
    }
    onChange(rebuilt);
  };
  return (
    <div>
      <div className="flex gap-1 mb-2">
        {(["hu", "en", "de"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`text-[10px] tracking-widest-2 uppercase px-2 py-0.5 ${
              tab === k ? "bg-ink text-white" : "text-muted hover:text-ink"
            }`}
          >
            {k.toUpperCase()}
          </button>
        ))}
      </div>
      <textarea
        rows={3}
        value={perLocale[tab].join(", ")}
        onChange={(e) => update(tab, e.target.value)}
        className="w-full border border-line focus:border-ink p-3 outline-none bg-transparent text-sm"
      />
    </div>
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
