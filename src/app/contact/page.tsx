"use client";

import { useT } from "@/i18n/provider";

export default function ContactPage() {
  const { t } = useT();
  return (
    <section className="mx-auto max-w-[1100px] px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-12">
      <div>
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">{t.contact.contact}</div>
        <h1 className="font-display text-5xl md:text-6xl leading-[1]">{t.contact.title}</h1>
        <p className="mt-6 text-muted max-w-md leading-relaxed">{t.contact.body}</p>

        <div className="mt-10 space-y-6 text-sm">
          <div>
            <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">{t.contact.email}</div>
            <a href="mailto:info@aetheris.hu" className="hover:underline">info@aetheris.hu</a>
          </div>
          <div>
            <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">{t.contact.phone}</div>
            <a href="tel:+36305252336" className="hover:underline">+36 30 525 2336</a>
          </div>
          <div>
            <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">{t.contact.instagram}</div>
            <a
              href="https://instagram.com/aetheris.hu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              @aetheris.hu
            </a>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert(t.contact.thanksForm);
        }}
        className="space-y-5"
      >
        <label className="block">
          <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">{t.contact.formName}</div>
          <input className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent" />
        </label>
        <label className="block">
          <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">{t.contact.formEmail}</div>
          <input type="email" required className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent" />
        </label>
        <label className="block">
          <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">{t.contact.formMessage}</div>
          <textarea rows={6} className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent" />
        </label>
        <button className="bg-ink text-white text-[11px] tracking-widest-2 uppercase px-8 py-4">
          {t.contact.send}
        </button>
      </form>
    </section>
  );
}
