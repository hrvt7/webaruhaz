"use client";


export default function ContactPage() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-12">
      <div>
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">Contact</div>
        <h1 className="font-display text-5xl md:text-6xl leading-[1]">Kapcsolat</h1>
        <p className="mt-6 text-muted max-w-md leading-relaxed">
          Írj bármiben — méretválasztás, személyes stíluskonzultáció, egyedi
          kérések. H–P 9:00 és 18:00 között visszajelzünk.
        </p>

        <div className="mt-10 space-y-6 text-sm">
          <div>
            <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">Email</div>
            <a href="mailto:hello@lunara.hu" className="hover:underline">hello@lunara.hu</a>
          </div>
          <div>
            <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">Phone / WhatsApp</div>
            <a href="tel:+36301234567" className="hover:underline">+36 30 123 4567</a>
          </div>
          <div>
            <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">Instagram</div>
            <a
              href="https://instagram.com/lunara.hu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              @lunara.hu
            </a>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Köszönjük, hamarosan jelentkezünk.");
        }}
        className="space-y-5"
      >
        <label className="block">
          <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">Név</div>
          <input className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent" />
        </label>
        <label className="block">
          <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">Email</div>
          <input type="email" required className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent" />
        </label>
        <label className="block">
          <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">Üzenet</div>
          <textarea rows={6} className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent" />
        </label>
        <button className="bg-ink text-white text-[11px] tracking-widest-2 uppercase px-8 py-4">
          Küldés
        </button>
      </form>
    </section>
  );
}
