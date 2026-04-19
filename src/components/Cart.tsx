"use client";

import { useState } from "react";
import { X, Plus, Minus, Trash2, CreditCard, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useCart, lineKey } from "@/context/CartContext";
import { formatHUF } from "@/data/products";
import { useT } from "@/i18n/provider";
import PaymentBadges from "@/components/PaymentBadges";

const PHONE_RAW = "36305252336";
const STRIPE_ENABLED = Boolean(process.env.NEXT_PUBLIC_STRIPE_ENABLED === "1");

export default function Cart() {
  const { t, c } = useT();
  const { items, open, setOpen, inc, dec, remove, subtotal, clear } = useCart();
  const [step, setStep] = useState<"bag" | "checkout" | "done">("bag");
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState<null | "card" | "whatsapp">(null);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setTimeout(() => setStep("bag"), 300);
  };

  const payWithCard = async () => {
    setBusy("card");
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items, customer: form }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Ismeretlen hiba");
      }
      window.location.href = data.url;
    } catch (e) {
      setError((e as Error).message);
      setBusy(null);
    }
  };

  const orderViaWhatsApp = async () => {
    setBusy("whatsapp");
    const lines = items
      .map(
        (i) =>
          `• ${i.name} — ${i.color}, ${i.size} — ${formatHUF(i.price)}${
            i.qty > 1 ? " × " + i.qty : ""
          }`,
      )
      .join("\n");
    const message = `${t.whatsapp.greeting}

${t.whatsapp.intro}

${lines}

${t.whatsapp.subtotal}: ${formatHUF(subtotal)}

${t.whatsapp.nameLabel}: ${form.name}
${t.whatsapp.phoneLabel}: ${form.phone}
${t.whatsapp.addressLabel}: ${form.address}
${t.whatsapp.noteLabel}: ${form.note}`;

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_address: form.address,
          note: form.note,
          items,
          subtotal,
        }),
      });
    } catch {}

    window.open(
      `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
    setStep("done");
    setBusy(null);
    clear();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) return;
    // default path: card if enabled, else WhatsApp
    if (STRIPE_ENABLED) await payWithCard();
    else await orderViaWhatsApp();
  };

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-ink/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[440px] bg-white shadow-xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-[64px] px-6 flex items-center justify-between border-b border-line">
          <div className="font-display text-lg tracking-widest-2">
            {step === "bag" && t.cart.title}
            {step === "checkout" && t.cart.checkout}
            {step === "done" && t.cart.thankYou}
          </div>
          <button
            onClick={close}
            aria-label={t.close}
            className="h-9 w-9 -mr-2 grid place-items-center"
          >
            <X size={20} strokeWidth={1.4} />
          </button>
        </div>

        {step === "bag" && (
          <>
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full grid place-items-center text-center p-8">
                  <div>
                    <div className="font-display text-xl mb-2">{t.cart.empty}</div>
                    <p className="text-sm text-muted max-w-[260px] mx-auto">
                      {t.cart.emptyHint}
                    </p>
                    <Link
                      href="/shop"
                      onClick={close}
                      className="inline-block mt-6 bg-ink text-white text-[11px] tracking-widest-2 uppercase px-6 py-3"
                    >
                      {t.cart.shopAll}
                    </Link>
                  </div>
                </div>
              ) : (
                <ul>
                  {items.map((i) => {
                    const k = lineKey(i);
                    return (
                      <li
                        key={k}
                        className="grid grid-cols-[88px_1fr_auto] gap-4 p-6 border-b border-line"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={i.image}
                          alt={i.name}
                          className="aspect-[3/4] w-full object-cover bg-bone"
                        />
                        <div className="min-w-0">
                          <div className="font-display text-[15px] leading-tight truncate">
                            {i.name}
                          </div>
                          <div className="mt-1 text-xs text-muted">
                            {i.color} · {i.size}
                          </div>
                          <div className="mt-3 inline-flex items-center border border-line">
                            <button
                              aria-label="dec"
                              className="h-7 w-7 grid place-items-center hover:bg-bone"
                              onClick={() => dec(k)}
                            >
                              <Minus size={12} strokeWidth={1.6} />
                            </button>
                            <span className="price text-xs w-6 text-center">
                              {i.qty}
                            </span>
                            <button
                              aria-label="inc"
                              className="h-7 w-7 grid place-items-center hover:bg-bone"
                              onClick={() => inc(k)}
                            >
                              <Plus size={12} strokeWidth={1.6} />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <div className="price text-sm">
                            {formatHUF(i.price * i.qty)}
                          </div>
                          <button
                            aria-label="Remove"
                            className="text-muted hover:text-ink"
                            onClick={() => remove(k)}
                          >
                            <Trash2 size={15} strokeWidth={1.4} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-line p-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>{t.cart.subtotal}</span>
                  <span className="price">{formatHUF(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{t.cart.shippingLabel}</span>
                  <span>
                    {subtotal >= 30000 ? c.shippingValueFree : c.shippingValuePaid}
                  </span>
                </div>
                <button
                  onClick={() => setStep("checkout")}
                  className="w-full bg-ink text-white text-[12px] tracking-widest-2 uppercase py-4 hover:bg-accent transition-colors"
                >
                  {t.cart.checkout}
                </button>
                <button
                  onClick={close}
                  className="w-full border border-line text-[12px] tracking-widest-2 uppercase py-4 hover:bg-bone"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            )}
          </>
        )}

        {step === "checkout" && (
          <form onSubmit={submit} className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <Field label={t.cart.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Field label={t.cart.phone} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required type="tel" />
              <Field label={t.cart.address} value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
              <Field label={t.cart.note} value={form.note} onChange={(v) => setForm({ ...form, note: v })} textarea />

              <label className="flex items-start gap-2 text-xs text-muted leading-relaxed cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="accent-ink mt-0.5"
                />
                <span>
                  {c.acceptTerms.before}
                  <a href="/aszf" target="_blank" className="underline">{c.acceptTerms.aszf}</a>
                  {c.acceptTerms.and}
                  <a href="/adatkezeles" target="_blank" className="underline">{c.acceptTerms.privacy}</a>
                  {c.acceptTerms.after}
                </span>
              </label>

              {error && (
                <div className="text-xs text-sale border border-sale/30 bg-sale/5 px-3 py-2">
                  {error}
                </div>
              )}
            </div>

            <div className="border-t border-line p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>{t.cart.total}</span>
                <span className="price">{formatHUF(subtotal + (subtotal >= 30000 ? 0 : 1690))}</span>
              </div>

              {STRIPE_ENABLED && (
                <>
                  <button
                    type="button"
                    onClick={() => accepted && payWithCard()}
                    disabled={!accepted || busy !== null}
                    className="w-full bg-ink text-white text-[12px] tracking-widest-2 uppercase py-4 hover:bg-accent disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    <CreditCard size={14} strokeWidth={1.6} />
                    {busy === "card" ? "..." : c.cardPayment}
                  </button>
                  <PaymentBadges />
                  <div className="text-center text-[10px] tracking-widest-2 uppercase text-muted">
                    {c.secureCheckout}
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => accepted && orderViaWhatsApp()}
                disabled={!accepted || busy !== null}
                className={`w-full text-[12px] tracking-widest-2 uppercase py-4 disabled:opacity-40 flex items-center justify-center gap-2 ${
                  STRIPE_ENABLED
                    ? "border border-line hover:bg-bone"
                    : "bg-ink text-white hover:bg-accent"
                }`}
              >
                <MessageCircle size={14} strokeWidth={1.6} />
                {busy === "whatsapp" ? "..." : c.whatsappOrder}
              </button>

              <button
                type="button"
                onClick={() => setStep("bag")}
                className="w-full text-[12px] tracking-widest-2 uppercase py-2 text-muted"
              >
                {t.cart.back}
              </button>
            </div>
          </form>
        )}

        {step === "done" && (
          <div className="flex-1 grid place-items-center p-8 text-center">
            <div>
              <div className="font-display text-2xl">{t.cart.thankYou}</div>
              <p className="mt-3 text-sm text-muted max-w-[300px] mx-auto">
                {t.cart.thanksMessage}
              </p>
              <button
                onClick={close}
                className="mt-8 bg-ink text-white text-[11px] tracking-widest-2 uppercase px-8 py-3"
              >
                {t.cart.closeBtn}
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  textarea?: boolean;
}) {
  const base = "w-full bg-transparent border-b border-line focus:border-ink py-2 text-sm outline-none";
  return (
    <label className="block">
      <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">
        {label}
        {required && " *"}
      </div>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={base} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className={base} />
      )}
    </label>
  );
}
