"use client";

import { useEffect, useState } from "react";
import { X, Plus, Minus, Trash2, CreditCard, Truck, MapPin, Package, Landmark, Banknote } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, lineKey } from "@/context/CartContext";
import { useT } from "@/i18n/provider";
import { formatMoney, FREE_SHIPPING_THRESHOLD_HUF } from "@/lib/currency";
import PaymentBadges from "@/components/PaymentBadges";

const STRIPE_ENABLED = Boolean(process.env.NEXT_PUBLIC_STRIPE_ENABLED === "1");

export default function Cart() {
  const { t, c, locale } = useT();
  const { items, open, setOpen, inc, dec, remove, subtotal, clear, coupon, discount, setCoupon } = useCart();
  const [step, setStep] = useState<"bag" | "checkout" | "done">("bag");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", note: "" });
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState<null | "card" | "bank" | "cod">(null);
  type PaymentMethod = "stripe" | "bank_transfer" | "cod";
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [codFeeHuf, setCodFeeHuf] = useState(490);
  const router = useRouter();

  // Csak HU nyelvnél ajánlunk fel előreutalást/utánvétet
  const extraPaymentsAvailable = locale === "hu";
  const [error, setError] = useState<string | null>(null);

  // Kupon UI állapot
  const [couponInput, setCouponInput] = useState("");
  const [couponChecking, setCouponChecking] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Szállítási mód
  type ShippingMethod = "delivery" | "pickup";
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("delivery");
  type PickupLoc = { id: string; name: string; address: string; city: string; postcode: string | null; hours: string | null };
  const [pickupLocations, setPickupLocations] = useState<PickupLoc[]>([]);
  const [pickupId, setPickupId] = useState<string>("");

  useEffect(() => {
    fetch("/api/shipping/pickup-locations")
      .then((r) => r.json())
      .then((d) => {
        setPickupLocations(d.locations ?? []);
        if (d.locations?.[0]) setPickupId(d.locations[0].id);
      })
      .catch(() => {});
    // COD díj lekérés (landing.payment_settings.cod_fee_huf)
    fetch("/api/payment-settings")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.cod_fee_huf === "number") setCodFeeHuf(d.cod_fee_huf);
      })
      .catch(() => {});
  }, []);

  const discountedSubtotal = Math.max(0, subtotal - discount);

  // Szállítási díj az aktuális mód alapján
  const FREE_SHIPPING = 30000;
  const shipping =
    shippingMethod === "pickup"
      ? 0
      : discountedSubtotal >= FREE_SHIPPING
        ? 0
        : 1690;
  // Utánvét díj csak házhoz szállításnál adódik hozzá
  const codFee = paymentMethod === "cod" && shippingMethod === "delivery" ? codFeeHuf : 0;
  const grandTotal = discountedSubtotal + shipping + codFee;
  const selectedPickup = pickupLocations.find((l) => l.id === pickupId);

  const couponErrorText = (code: string): string => {
    if (code.startsWith("MIN_ORDER:")) {
      const min = Number(code.split(":")[1]);
      return locale === "en"
        ? `Minimum order: ${formatMoney(min, locale)}`
        : locale === "de"
          ? `Mindestbestellwert: ${formatMoney(min, locale)}`
          : `Minimum rendelési érték: ${formatMoney(min, locale)}`;
    }
    const dict: Record<string, Record<string, string>> = {
      hu: { NOT_FOUND: "Érvénytelen kuponkód", INACTIVE: "Ez a kupon inaktív", EXPIRED: "Lejárt kupon", USED_UP: "Elfogyott a kupon", EMPTY_CODE: "Adj meg kódot", ZERO_DISCOUNT: "Nem alkalmazható", LOOKUP_FAILED: "Ellenőrzés sikertelen" },
      en: { NOT_FOUND: "Invalid coupon code", INACTIVE: "Coupon inactive", EXPIRED: "Coupon expired", USED_UP: "Coupon fully redeemed", EMPTY_CODE: "Enter a code", ZERO_DISCOUNT: "Cannot apply", LOOKUP_FAILED: "Validation failed" },
      de: { NOT_FOUND: "Ungültiger Code", INACTIVE: "Gutschein inaktiv", EXPIRED: "Gutschein abgelaufen", USED_UP: "Gutschein aufgebraucht", EMPTY_CODE: "Code eingeben", ZERO_DISCOUNT: "Nicht anwendbar", LOOKUP_FAILED: "Prüfung fehlgeschlagen" },
    };
    return dict[locale][code] ?? code;
  };

  const applyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim();
    if (!code) return;
    setCouponChecking(true);
    setCouponError(null);
    try {
      const r = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await r.json();
      if (!data.ok) {
        setCouponError(couponErrorText(String(data.error ?? "NOT_FOUND")));
        return;
      }
      setCoupon({
        code: data.code,
        description: data.description ?? "",
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        discount: data.discount,
      });
      setCouponInput("");
    } catch (err) {
      setCouponError((err as Error).message);
    } finally {
      setCouponChecking(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError(null);
  };

  const close = () => {
    setOpen(false);
    setTimeout(() => setStep("bag"), 300);
  };

  const payWithCard = async () => {
    setBusy("card");
    setError(null);
    try {
      const shippingPayload =
        shippingMethod === "pickup" && selectedPickup
          ? {
              method: "pickup" as const,
              location_id: selectedPickup.id,
              location_name: selectedPickup.name,
              location_address: `${selectedPickup.postcode ? selectedPickup.postcode + " " : ""}${selectedPickup.city}, ${selectedPickup.address}`,
            }
          : { method: "delivery" as const, address: form.address };

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items, customer: form, locale, coupon, shipping: shippingPayload }),
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

  const buildShippingPayload = () =>
    shippingMethod === "pickup" && selectedPickup
      ? {
          method: "pickup" as const,
          location_id: selectedPickup.id,
          location_name: selectedPickup.name,
          location_address: `${selectedPickup.postcode ? selectedPickup.postcode + " " : ""}${selectedPickup.city}, ${selectedPickup.address}`,
        }
      : { method: "delivery" as const, address: form.address };

  const placeNonStripeOrder = async (method: "bank_transfer" | "cod") => {
    setBusy(method === "bank_transfer" ? "bank" : "cod");
    setError(null);
    try {
      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items,
          customer: form,
          payment_method: method,
          shipping: buildShippingPayload(),
          coupon,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Rendelés létrehozás hiba");
      }
      // Átirányítás
      if (method === "bank_transfer") {
        router.push(`/order/pending?ref=${encodeURIComponent(data.reference_code)}`);
      } else {
        router.push(`/order/success?cod=1&ref=${encodeURIComponent(data.reference_code)}`);
      }
      clear();
      setOpen(false);
    } catch (e) {
      setError((e as Error).message);
      setBusy(null);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) return;
    if (paymentMethod === "stripe") return payWithCard();
    if (paymentMethod === "bank_transfer") return placeNonStripeOrder("bank_transfer");
    if (paymentMethod === "cod") return placeNonStripeOrder("cod");
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
        className={`fixed top-0 right-0 z-50 h-[100dvh] w-full max-w-[440px] bg-white shadow-xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-[64px] shrink-0 px-6 flex items-center justify-between border-b border-line">
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
                            {formatMoney(i.price * i.qty, locale)}
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
              <div className="shrink-0 border-t border-line p-6 space-y-3">
                {subtotal < FREE_SHIPPING_THRESHOLD_HUF ? (
                  <div className="bg-bone p-3 space-y-2">
                    <div className="text-xs text-ink">
                      {locale === "hu" && <>Még <span className="price font-medium">{formatMoney(FREE_SHIPPING_THRESHOLD_HUF - subtotal, locale)}</span> az ingyenes szállításhoz</>}
                      {locale === "en" && <>Add <span className="price font-medium">{formatMoney(FREE_SHIPPING_THRESHOLD_HUF - subtotal, locale)}</span> more for free shipping</>}
                      {locale === "de" && <>Noch <span className="price font-medium">{formatMoney(FREE_SHIPPING_THRESHOLD_HUF - subtotal, locale)}</span> bis zum kostenlosen Versand</>}
                    </div>
                    <div className="h-1 bg-line overflow-hidden rounded-full">
                      <div
                        className="h-full bg-ink transition-all duration-500"
                        style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_HUF) * 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-bone p-3 text-xs text-ink">
                    {locale === "hu" && <>✓ A szállítás <strong>ingyenes</strong></>}
                    {locale === "en" && <>✓ <strong>Free shipping</strong> unlocked</>}
                    {locale === "de" && <>✓ <strong>Kostenloser Versand</strong> freigeschaltet</>}
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span>{t.cart.subtotal}</span>
                  <span className="price">{formatMoney(subtotal, locale)}</span>
                </div>

                {/* Kuponkód blokk */}
                <div className="border-t border-b border-line py-3 space-y-2">
                  {coupon ? (
                    <div className="flex items-center justify-between text-sm">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-ink text-white px-2 py-0.5 text-[10px] tracking-widest-2 uppercase font-mono">
                            {coupon.code}
                          </span>
                          <span className="text-xs text-muted truncate">
                            {coupon.description}
                          </span>
                        </div>
                        <div className="price text-sale text-xs mt-1">
                          −{formatMoney(discount, locale)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-[10px] tracking-widest-2 uppercase text-muted hover:text-ink ml-2"
                        title={locale === "hu" ? "Eltávolítás" : locale === "de" ? "Entfernen" : "Remove"}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={applyCoupon} className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value); setCouponError(null); }}
                        placeholder={locale === "en" ? "Coupon code" : locale === "de" ? "Gutscheincode" : "Kuponkód"}
                        className="flex-1 border-b border-line focus:border-ink bg-transparent text-sm py-1 outline-none uppercase tracking-widest-2 font-mono"
                        maxLength={32}
                      />
                      <button
                        type="submit"
                        disabled={couponChecking || !couponInput.trim()}
                        className="text-[10px] tracking-widest-2 uppercase border border-line hover:border-ink px-3 py-1 disabled:opacity-40"
                      >
                        {couponChecking ? "…" : locale === "en" ? "Apply" : locale === "de" ? "Anwenden" : "Beváltás"}
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <div className="text-[11px] text-sale">{couponError}</div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{t.cart.shippingLabel}</span>
                  <span>
                    {discountedSubtotal >= 30000 ? c.shippingValueFree : c.shippingValuePaid}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base font-medium border-t border-line pt-3">
                  <span>{locale === "en" ? "Total" : locale === "de" ? "Gesamt" : "Összesen"}</span>
                  <span className="price">{formatMoney(grandTotal, locale)}</span>
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
              <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required type="email" />
              <Field label={t.cart.phone} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required type="tel" />

              {/* Szállítási mód blokk */}
              <div className="border border-line p-4 space-y-3">
                <div className="text-[10px] tracking-widest-2 uppercase text-muted">
                  {locale === "en" ? "Shipping method" : locale === "de" ? "Versandart" : "Szállítási mód"}
                </div>

                <ShippingOption
                  selected={shippingMethod === "delivery"}
                  onClick={() => setShippingMethod("delivery")}
                  icon={<Truck size={16} strokeWidth={1.5} />}
                  title={locale === "en" ? "Home delivery" : locale === "de" ? "Lieferung nach Hause" : "Házhoz szállítás"}
                  subtitle={locale === "en" ? "GLS courier, 1-3 business days" : locale === "de" ? "GLS-Kurier, 1-3 Werktage" : "GLS futár, 1-3 munkanap"}
                  fee={
                    discountedSubtotal >= FREE_SHIPPING
                      ? (locale === "en" ? "Free" : locale === "de" ? "Kostenlos" : "Ingyenes")
                      : formatMoney(1690, locale)
                  }
                />

                <ShippingOption
                  selected={shippingMethod === "pickup"}
                  onClick={() => pickupLocations.length > 0 && setShippingMethod("pickup")}
                  disabled={pickupLocations.length === 0}
                  icon={<MapPin size={16} strokeWidth={1.5} />}
                  title={locale === "en" ? "Personal pickup" : locale === "de" ? "Persönliche Abholung" : "Személyes átvétel"}
                  subtitle={
                    pickupLocations.length === 0
                      ? (locale === "en" ? "No pickup points currently" : locale === "de" ? "Keine Abholpunkte" : "Nincs elérhető átvételi pont")
                      : (locale === "en" ? `${pickupLocations.length} pickup point${pickupLocations.length > 1 ? "s" : ""}` : locale === "de" ? `${pickupLocations.length} Abholpunkt${pickupLocations.length > 1 ? "e" : ""}` : `${pickupLocations.length} üzlet`)
                  }
                  fee={locale === "en" ? "Free" : locale === "de" ? "Kostenlos" : "Ingyenes"}
                />

                {/* Foxpost előkészítve, regisztráció után aktiválható */}
                <ShippingOption
                  selected={false}
                  onClick={() => {}}
                  disabled
                  icon={<Package size={16} strokeWidth={1.5} />}
                  title="Foxpost automata"
                  subtitle={locale === "en" ? "Coming soon" : locale === "de" ? "Demnächst" : "Hamarosan"}
                  fee={formatMoney(890, locale)}
                />

                {/* Pickup választó */}
                {shippingMethod === "pickup" && pickupLocations.length > 0 && (
                  <div className="pt-3 border-t border-line space-y-2">
                    <div className="text-[10px] tracking-widest-2 uppercase text-muted">
                      {locale === "en" ? "Choose a pickup point" : locale === "de" ? "Abholpunkt wählen" : "Válassz átvételi pontot"}
                    </div>
                    {pickupLocations.map((l) => (
                      <label
                        key={l.id}
                        className={`flex items-start gap-3 p-3 border cursor-pointer ${
                          pickupId === l.id ? "border-ink bg-bone" : "border-line hover:border-ink/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="pickup"
                          checked={pickupId === l.id}
                          onChange={() => setPickupId(l.id)}
                          className="accent-ink mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{l.name}</div>
                          <div className="text-xs text-muted mt-0.5">
                            {l.postcode ? `${l.postcode} ` : ""}{l.city}, {l.address}
                          </div>
                          {l.hours && (
                            <div className="text-[10px] text-muted mt-1 whitespace-pre-line">{l.hours}</div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {shippingMethod === "delivery" && (
                <Field label={t.cart.address} value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
              )}
              <Field label={t.cart.note} value={form.note} onChange={(v) => setForm({ ...form, note: v })} textarea />

              {/* Fizetési mód blokk — csak HU nyelven jelennek meg a non-Stripe opciók */}
              <div className="border border-line p-4 space-y-3">
                <div className="text-[10px] tracking-widest-2 uppercase text-muted">
                  {locale === "en" ? "Payment method" : locale === "de" ? "Zahlungsmethode" : "Fizetési mód"}
                </div>

                <ShippingOption
                  selected={paymentMethod === "stripe"}
                  onClick={() => setPaymentMethod("stripe")}
                  icon={<CreditCard size={16} strokeWidth={1.5} />}
                  title={locale === "en" ? "Credit / debit card" : locale === "de" ? "Kredit- / Debitkarte" : "Bankkártya"}
                  subtitle={locale === "en" ? "Visa, Mastercard, Apple Pay, Google Pay" : locale === "de" ? "Visa, Mastercard, Apple Pay, Google Pay" : "Visa, Mastercard, Apple Pay, Google Pay"}
                  fee={locale === "en" ? "Instant" : locale === "de" ? "Sofort" : "Azonnali"}
                />

                {extraPaymentsAvailable && (
                  <ShippingOption
                    selected={paymentMethod === "bank_transfer"}
                    onClick={() => setPaymentMethod("bank_transfer")}
                    icon={<Landmark size={16} strokeWidth={1.5} />}
                    title="Előreutalás"
                    subtitle="Utalási adatokat emailben küldünk · 2-3 munkanap"
                    fee="0 Ft"
                  />
                )}

                {extraPaymentsAvailable && (
                  <ShippingOption
                    selected={paymentMethod === "cod"}
                    onClick={() => setPaymentMethod("cod")}
                    icon={<Banknote size={16} strokeWidth={1.5} />}
                    title="Utánvét"
                    subtitle={
                      shippingMethod === "delivery"
                        ? `Futárnak fizetés átvételkor · +${formatMoney(codFeeHuf, locale)}`
                        : shippingMethod === "pickup"
                          ? "Üzletben fizetsz átvételkor (kp / kártya)"
                          : "Automatánál fizetsz átvételkor"
                    }
                    fee={shippingMethod === "delivery" ? formatMoney(codFeeHuf, locale) : "0 Ft"}
                  />
                )}
              </div>

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

            <div className="shrink-0 border-t border-line p-5 space-y-2.5">
              {coupon && discount > 0 && (
                <div className="flex items-center justify-between text-xs text-sale">
                  <span>
                    <span className="font-mono tracking-widest-2 uppercase">{coupon.code}</span>
                    {" "}
                    {locale === "en" ? "discount" : locale === "de" ? "Rabatt" : "kedvezmény"}
                  </span>
                  <span className="price">−{formatMoney(discount, locale)}</span>
                </div>
              )}
              {codFee > 0 && (
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Utánvét díj</span>
                  <span className="price">+{formatMoney(codFee, locale)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span>{t.cart.total}</span>
                <span className="price">{formatMoney(grandTotal, locale)}</span>
              </div>

              {/* Dinamikus fizetési gomb a kiválasztott módhoz */}
              {paymentMethod === "stripe" && (
                <>
                  <button
                    type="button"
                    onClick={() => accepted && payWithCard()}
                    disabled={!accepted || busy !== null}
                    className="w-full bg-ink text-white text-[12px] tracking-widest-2 uppercase py-3.5 hover:bg-accent disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    <CreditCard size={14} strokeWidth={1.6} />
                    {busy === "card" ? "..." : c.cardPayment}
                  </button>
                  {STRIPE_ENABLED ? (
                    <>
                      <PaymentBadges />
                      <div className="text-center text-[10px] tracking-widest-2 uppercase text-muted">
                        {c.secureCheckout}
                      </div>
                    </>
                  ) : (
                    <div className="bg-bone p-3 text-[11px] text-muted text-center">
                      Demo mód — a fizetés a Stripe kulcsok beállítása után válik aktívvá.
                    </div>
                  )}
                </>
              )}

              {paymentMethod === "bank_transfer" && (
                <button
                  type="button"
                  onClick={() => accepted && placeNonStripeOrder("bank_transfer")}
                  disabled={!accepted || busy !== null}
                  className="w-full bg-ink text-white text-[12px] tracking-widest-2 uppercase py-4 hover:bg-accent disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Landmark size={14} strokeWidth={1.6} />
                  {busy === "bank" ? "..." : "Utalási adatok kérése"}
                </button>
              )}

              {paymentMethod === "cod" && (
                <button
                  type="button"
                  onClick={() => accepted && placeNonStripeOrder("cod")}
                  disabled={!accepted || busy !== null}
                  className="w-full bg-ink text-white text-[12px] tracking-widest-2 uppercase py-4 hover:bg-accent disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Banknote size={14} strokeWidth={1.6} />
                  {busy === "cod" ? "..." : "Rendelés leadása — utánvéttel"}
                </button>
              )}

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

function ShippingOption({
  selected,
  disabled,
  onClick,
  icon,
  title,
  subtitle,
  fee,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  fee: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 border text-left transition-colors ${
        disabled
          ? "border-line opacity-40 cursor-not-allowed"
          : selected
            ? "border-ink bg-bone"
            : "border-line hover:border-ink/40 cursor-pointer"
      }`}
    >
      <div className="shrink-0 text-ink/70">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[13px] leading-tight">{title}</div>
        <div className="text-[11px] text-muted leading-tight mt-0.5 truncate">{subtitle}</div>
      </div>
      <div className="price text-xs shrink-0">{fee}</div>
    </button>
  );
}
