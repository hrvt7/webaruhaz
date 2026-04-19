"use client";

import { useState } from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCart, lineKey } from "@/context/CartContext";
import { formatHUF } from "@/data/products";

const PHONE_RAW = "36301234567";

export default function Cart() {
  const { items, open, setOpen, inc, dec, remove, subtotal, clear } = useCart();
  const [step, setStep] = useState<"bag" | "checkout" | "done">("bag");
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });

  const close = () => {
    setOpen(false);
    setTimeout(() => setStep("bag"), 300);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = items
      .map(
        (i) =>
          `• ${i.name} — ${i.color}, ${i.size} — ${formatHUF(i.price)}${
            i.qty > 1 ? " × " + i.qty : ""
          }`,
      )
      .join("\n");
    const message = `Szia LUNARA! 👋

Szeretnék rendelni:

${lines}

Részösszeg: ${formatHUF(subtotal)}

Név: ${form.name}
Telefon: ${form.phone}
Szállítási cím: ${form.address}
Megjegyzés: ${form.note}`;
    window.open(
      `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
    setStep("done");
    clear();
  };

  return (
    <>
      {/* backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-ink/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[440px] bg-white shadow-xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-[64px] px-6 flex items-center justify-between border-b border-line">
          <div className="font-display text-lg tracking-widest-2">
            {step === "bag" && "SHOPPING BAG"}
            {step === "checkout" && "CHECKOUT"}
            {step === "done" && "THANK YOU"}
          </div>
          <button
            onClick={close}
            aria-label="Close"
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
                    <div className="font-display text-xl mb-2">A kosár üres</div>
                    <p className="text-sm text-muted max-w-[260px] mx-auto">
                      Fedezd fel az új kollekciót és állítsd össze a wardrobe-od
                      alapdarabjait.
                    </p>
                    <Link
                      href="/shop"
                      onClick={close}
                      className="inline-block mt-6 bg-ink text-white text-[11px] tracking-widest-2 uppercase px-6 py-3"
                    >
                      Shop all
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
                  <span>Részösszeg</span>
                  <span className="price">{formatHUF(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Szállítás</span>
                  <span>Egyeztetés után</span>
                </div>
                <button
                  onClick={() => setStep("checkout")}
                  className="w-full bg-ink text-white text-[12px] tracking-widest-2 uppercase py-4 hover:bg-accent transition-colors"
                >
                  Checkout
                </button>
                <button
                  onClick={close}
                  className="w-full border border-line text-[12px] tracking-widest-2 uppercase py-4 hover:bg-bone"
                >
                  Folytatom a böngészést
                </button>
              </div>
            )}
          </>
        )}

        {step === "checkout" && (
          <form onSubmit={submit} className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <Field label="Név" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Field
                label="Telefon"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                required
                type="tel"
              />
              <Field
                label="Szállítási cím"
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
                required
              />
              <Field
                label="Megjegyzés"
                value={form.note}
                onChange={(v) => setForm({ ...form, note: v })}
                textarea
              />
              <div className="text-xs text-muted border border-line p-4 leading-relaxed">
                A megrendelést WhatsApp-on erősítjük meg. A szállítási díjat a
                visszajelzésben közöljük.
              </div>
            </div>
            <div className="border-t border-line p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Összesen</span>
                <span className="price">{formatHUF(subtotal)}</span>
              </div>
              <button
                type="submit"
                className="w-full bg-ink text-white text-[12px] tracking-widest-2 uppercase py-4 hover:bg-accent"
              >
                Rendelés véglegesítése
              </button>
              <button
                type="button"
                onClick={() => setStep("bag")}
                className="w-full text-[12px] tracking-widest-2 uppercase py-2 text-muted"
              >
                ← Vissza
              </button>
            </div>
          </form>
        )}

        {step === "done" && (
          <div className="flex-1 grid place-items-center p-8 text-center">
            <div>
              <div className="font-display text-2xl">Köszönjük!</div>
              <p className="mt-3 text-sm text-muted max-w-[300px] mx-auto">
                A rendelést elküldtük WhatsApp-on. Hamarosan visszajelzünk a
                szállítással kapcsolatban.
              </p>
              <button
                onClick={close}
                className="mt-8 bg-ink text-white text-[11px] tracking-widest-2 uppercase px-8 py-3"
              >
                Bezárás
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
  const base =
    "w-full bg-transparent border-b border-line focus:border-ink py-2 text-sm outline-none";
  return (
    <label className="block">
      <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">
        {label}
        {required && " *"}
      </div>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={base}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={base}
        />
      )}
    </label>
  );
}
