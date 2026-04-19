"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Send, Eye } from "lucide-react";
import { sendCampaign } from "../actions";

type P = {
  slug: string;
  name: string;
  price: number;
  images: string[];
  badge: string | null;
};

export default function CampaignForm({ products, activeCount }: { products: P[]; activeCount: number }) {
  const [subject, setSubject] = useState("Új kollekció érkezett — LUNARA");
  const [introHtml, setIntroHtml] = useState(
    "<p>Kedves Vásárlónk,</p><p>Az új kollekcióban válogatott darabokat hoztunk nektek. Fedezd fel lent.</p>",
  );
  const [picked, setPicked] = useState<string[]>(
    products.filter((p) => p.badge === "New arrival").slice(0, 4).map((p) => p.slug),
  );
  const [testRecipient, setTestRecipient] = useState("");
  const [pending, start] = useTransition();
  const [result, setResult] = useState<null | { ok: boolean; sent: number; mode: string; errors?: string[] }>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const toggle = (slug: string) =>
    setPicked((p) => (p.includes(slug) ? p.filter((x) => x !== slug) : [...p, slug]));

  const doSend = (testOnly: boolean) => {
    setResult(null);
    start(async () => {
      const res = await sendCampaign({
        subject,
        introHtml,
        productSlugs: picked,
        testRecipient: testOnly ? testRecipient : undefined,
      });
      setResult(res);
    });
  };

  const doPreview = async () => {
    // Render preview via same template client-side-safe: fetch with dry-run
    const html = await renderPreviewClient({ subject, introHtml, picked, products });
    setPreviewHtml(html);
    setShowPreview(true);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8">
      <div className="bg-white border border-line p-6 md:p-8 space-y-5">
        <Field label="Tárgy">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-base"
          />
        </Field>

        <Field label="Bevezető szöveg (HTML engedélyezett)">
          <textarea
            rows={6}
            value={introHtml}
            onChange={(e) => setIntroHtml(e.target.value)}
            className="w-full border border-line focus:border-ink p-3 outline-none bg-transparent text-sm font-mono"
          />
          <div className="mt-2 text-xs text-muted">
            Használható HTML: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a href=&quot;...&quot;&gt;, &lt;br&gt;
          </div>
        </Field>

        <Field label={`Termékek az emailben (${picked.length} kiválasztva)`}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto border border-line p-3">
            {products.map((p) => {
              const active = picked.includes(p.slug);
              return (
                <button
                  type="button"
                  key={p.slug}
                  onClick={() => toggle(p.slug)}
                  className={`text-left border p-2 ${
                    active ? "border-ink" : "border-line hover:border-muted"
                  }`}
                >
                  <div className="relative aspect-[3/4] bg-bone">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images?.[0]} alt="" className="h-full w-full object-cover" />
                    {active && (
                      <div className="absolute top-1 right-1 bg-ink text-white text-[10px] px-1.5 py-0.5">
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs font-display truncate">{p.name}</div>
                  <div className="text-[10px] text-muted font-mono">
                    {new Intl.NumberFormat("hu-HU").format(p.price)} Ft
                  </div>
                </button>
              );
            })}
          </div>
        </Field>

        {result && (
          <div
            className={`border p-4 text-sm ${
              result.ok
                ? "border-green-600/30 bg-green-50 text-green-900"
                : "border-sale/30 bg-sale/5 text-sale"
            }`}
          >
            {result.ok
              ? `✓ ${result.sent} email ${result.mode === "dry-run" ? "SZIMULÁLVA (demo — nincs valódi küldés)" : "elküldve."}`
              : `Hiba: ${result.errors?.join("; ")}`}
          </div>
        )}
      </div>

      <aside className="bg-white border border-line p-6 space-y-5 h-fit sticky top-6">
        <div>
          <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-2">
            Aktív feliratkozók
          </div>
          <div className="font-display text-4xl">{activeCount}</div>
        </div>

        <button
          type="button"
          onClick={doPreview}
          className="w-full border border-line text-[11px] tracking-widest-2 uppercase py-3 hover:border-ink flex items-center justify-center gap-2"
        >
          <Eye size={13} strokeWidth={1.6} /> Előnézet
        </button>

        <div className="border-t border-line pt-5 space-y-3">
          <div className="text-[11px] tracking-widest-2 uppercase text-muted">
            Teszt küldés
          </div>
          <input
            type="email"
            placeholder="teszt@email.hu"
            value={testRecipient}
            onChange={(e) => setTestRecipient(e.target.value)}
            className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm"
          />
          <button
            type="button"
            disabled={pending || !testRecipient}
            onClick={() => doSend(true)}
            className="w-full border border-ink text-[11px] tracking-widest-2 uppercase py-3 hover:bg-ink hover:text-white disabled:opacity-40"
          >
            Teszt küldése
          </button>
        </div>

        <div className="border-t border-line pt-5">
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm(`Biztosan kiküldöd a kampányt ${activeCount} feliratkozónak?`)) return;
              doSend(false);
            }}
            className="w-full bg-ink text-white text-[11px] tracking-widest-2 uppercase py-4 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send size={14} strokeWidth={1.6} />
            {pending ? "Küldés..." : `Küldés mind ${activeCount} címzettnek`}
          </button>
          <div className="mt-3 text-[10px] text-muted leading-relaxed">
            {emailEnabledNote()}
          </div>
        </div>

        <Link
          href="/admin/newsletter"
          className="block text-center text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink"
        >
          ← Vissza
        </Link>
      </aside>

      {showPreview && (
        <div className="fixed inset-0 z-50 bg-ink/40 grid place-items-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-line">
              <div className="text-[11px] tracking-widest-2 uppercase">Előnézet</div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-[11px] tracking-widest-2 uppercase"
              >
                Bezárás
              </button>
            </div>
            <iframe
              srcDoc={previewHtml}
              className="flex-1 w-full"
              title="preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-2">{label}</div>
      {children}
    </label>
  );
}

function emailEnabledNote() {
  return (
    <>
      Ha a <code className="font-mono">RESEND_API_KEY</code> env nincs beállítva, a küldés
      <strong> demo módban </strong>fut: nem megy ki valódi email, csak a DB-ben rögzül
      a kampány.
    </>
  );
}

// Preview uses a lightweight server-free render. We just request the HTML back via an endpoint.
async function renderPreviewClient(input: {
  subject: string;
  introHtml: string;
  picked: string[];
  products: P[];
}): Promise<string> {
  const res = await fetch("/api/newsletter/preview", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      subject: input.subject,
      introHtml: input.introHtml,
      productSlugs: input.picked,
    }),
  });
  const data = await res.json();
  return data.html ?? "";
}
