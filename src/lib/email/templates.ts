// Egyszerű HTML email sablonok — Aetheris brand (Playfair + fekete-krém paletta).

type OrderItem = { name: string; color: string; size: string; qty: number; price: number };

const formatHuf = (n: number) => new Intl.NumberFormat("hu-HU").format(n) + " Ft";

const baseShell = (inner: string, preheader: string) => `<!DOCTYPE html>
<html lang="hu"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Aetheris</title>
<style>
  body { margin:0; background:#F5F1EA; font-family:-apple-system,"Helvetica Neue",Arial,sans-serif; color:#0a0a0a; line-height:1.5; }
  .preheader { display:none; color:#F5F1EA; font-size:1px; }
  .wrap { max-width:600px; margin:0 auto; background:#ffffff; }
  .logo { font-family:"Playfair Display",Georgia,serif; font-size:26px; letter-spacing:6px; text-align:center; padding:32px 24px 12px; }
  h1 { font-family:"Playfair Display",Georgia,serif; font-weight:400; font-size:24px; margin:0 0 8px; line-height:1.15; }
  .muted { color:#8b8b8b; font-size:13px; }
  .card { background:#F5F1EA; border-left:3px solid #D4C5A9; padding:16px 18px; margin:18px 0; }
  .row { display:flex; justify-content:space-between; padding:6px 0; font-size:14px; }
  .divider { border-top:1px solid #e5e0d7; margin:18px 0; }
  .mono { font-family:"Courier New",monospace; font-weight:600; font-size:14px; }
  .btn { display:inline-block; background:#0a0a0a; color:#ffffff !important; padding:12px 22px; text-decoration:none; font-size:11px; letter-spacing:2px; text-transform:uppercase; }
  .footer { color:#8b8b8b; font-size:11px; text-align:center; padding:24px; }
  .kicker { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:#8b8b8b; margin-bottom:8px; }
  table.items { width:100%; border-collapse:collapse; margin:12px 0; }
  table.items td { padding:6px 0; border-bottom:1px solid #e5e0d7; font-size:13px; }
  table.items td:last-child { text-align:right; font-weight:600; }
</style></head>
<body>
  <div class="preheader">${preheader}</div>
  <div class="wrap">
    <div class="logo">AETHERIS</div>
    <div style="padding:0 28px 24px;">${inner}</div>
    <div class="footer">
      Aetheris · Budapest · <a href="mailto:info@aetheris.hu" style="color:#8b8b8b;">info@aetheris.hu</a><br/>
      Ez egy automatikusan generált email. Ha kérdésed van, válaszolj erre az üzenetre.
    </div>
  </div>
</body></html>`;

const itemsTable = (items: OrderItem[]) => `
<table class="items">
  ${items.map((i) => `
    <tr>
      <td>${i.name} — ${i.color}, ${i.size}${i.qty > 1 ? ` × ${i.qty}` : ""}</td>
      <td>${formatHuf(i.price * i.qty)}</td>
    </tr>`).join("")}
</table>`;

export type PaymentMethod = "stripe" | "bank_transfer" | "cod";

export type OrderConfirmInput = {
  customerName: string;
  orderId: string;
  referenceCode: string;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  couponCode?: string | null;
  shippingFee: number;
  codFee?: number;
  total: number;
  paymentMethod: PaymentMethod;
  shippingMethod: "delivery" | "pickup" | "foxpost";
  shippingAddress?: string;
  pickupLocationName?: string;
  pickupLocationAddress?: string;
  // Banki adatok — csak bank_transfer esetén szükséges
  bank?: {
    name: string;
    account: string;
    beneficiary: string;
    iban?: string;
    swift?: string;
    deadlineDays: number;
  };
};

export function renderOrderConfirmation(d: OrderConfirmInput): { subject: string; html: string } {
  const isBank = d.paymentMethod === "bank_transfer";
  const isCod = d.paymentMethod === "cod";

  let intro = "";
  let paymentBlock = "";

  if (isBank && d.bank) {
    intro = `<h1>Megkaptuk a rendelésed!</h1>
<p>Köszönjük, <strong>${d.customerName}</strong>! A rendelés akkor válik véglegessé, amint az utalás megérkezik a számlánkra — általában 1-2 munkanap.</p>
<div class="kicker">Következő lépés</div>
<p>Utald át a <strong>${formatHuf(d.total)}</strong> összeget <strong>${d.bank.deadlineDays} munkanapon</strong> belül az alábbi számlára. A közleménybe <strong>pontosan</strong> a lenti azonosító kerüljön, hogy automatikusan párosítani tudjuk.</p>
<div class="card">
  <div class="row"><span class="muted">Bank</span><span>${d.bank.name}</span></div>
  <div class="row"><span class="muted">Kedvezményezett</span><span>${d.bank.beneficiary}</span></div>
  <div class="row"><span class="muted">Bankszámla</span><span class="mono">${d.bank.account}</span></div>
  ${d.bank.iban ? `<div class="row"><span class="muted">IBAN</span><span class="mono">${d.bank.iban}</span></div>` : ""}
  ${d.bank.swift ? `<div class="row"><span class="muted">SWIFT</span><span class="mono">${d.bank.swift}</span></div>` : ""}
  <div class="row"><span class="muted">Összeg</span><span><strong>${formatHuf(d.total)}</strong></span></div>
  <div class="divider"></div>
  <div class="row"><span class="muted">Közlemény</span><span class="mono">${d.referenceCode}</span></div>
</div>
<p class="muted">Amint az összeg beérkezik, emailt küldünk, és a csomag feladás alatt lesz.</p>`;
    paymentBlock = "";
  } else if (isCod) {
    intro = `<h1>Megkaptuk a rendelésed!</h1>
<p>Köszönjük, <strong>${d.customerName}</strong>! A csomagot hamarosan feladjuk, és ${d.shippingMethod === "delivery" ? "a futárnak" : d.shippingMethod === "foxpost" ? "az automatánál" : "az üzletben"} fizetsz majd átvételkor.</p>`;
  } else {
    // Stripe
    intro = `<h1>Köszönjük a rendelésed!</h1>
<p>Az összeg sikeresen lefoglalva, <strong>${d.customerName}</strong>. A csomagot hamarosan feladjuk.</p>`;
  }

  const shippingBlock = d.shippingMethod === "pickup"
    ? `<div class="card">
        <div class="kicker">Átvétel</div>
        <div><strong>${d.pickupLocationName}</strong></div>
        <div class="muted">${d.pickupLocationAddress ?? ""}</div>
      </div>`
    : `<div class="card">
        <div class="kicker">Kiszállítás</div>
        <div>${d.shippingAddress ?? ""}</div>
      </div>`;

  const summaryBlock = `
<div class="kicker">Rendelés #${d.referenceCode}</div>
${itemsTable(d.items)}
<div class="row"><span class="muted">Részösszeg</span><span>${formatHuf(d.subtotal)}</span></div>
${d.couponCode && d.discount ? `<div class="row" style="color:#6b1f23"><span>Kupon (${d.couponCode})</span><span>−${formatHuf(d.discount)}</span></div>` : ""}
<div class="row"><span class="muted">Szállítás</span><span>${d.shippingFee === 0 ? "Ingyenes" : formatHuf(d.shippingFee)}</span></div>
${d.codFee ? `<div class="row"><span class="muted">Utánvét díj</span><span>${formatHuf(d.codFee)}</span></div>` : ""}
<div class="divider"></div>
<div class="row" style="font-size:16px"><strong>Fizetendő</strong><strong>${formatHuf(d.total)}</strong></div>
${shippingBlock}
${paymentBlock}`;

  const subject = isBank
    ? `Utalási adatok — Aetheris rendelés #${d.referenceCode}`
    : `Megkaptuk a rendelésed — Aetheris #${d.referenceCode}`;

  return { subject, html: baseShell(intro + summaryBlock, subject) };
}

export function renderPaymentReceived(d: {
  customerName: string;
  referenceCode: string;
  total: number;
}): { subject: string; html: string } {
  const subject = `Utalásod megérkezett — Aetheris #${d.referenceCode}`;
  const inner = `<h1>Utalásod megérkezett ✓</h1>
<p>Köszönjük, <strong>${d.customerName}</strong>! A <strong>${formatHuf(d.total)}</strong> összeget megkaptuk.
A csomag most csomagolás alatt áll, és hamarosan feladjuk. Ha feladtuk, újabb emailt küldünk a csomagszám adatokkal.</p>
<div class="card">
  <div class="kicker">Rendelés</div>
  <div class="mono">#${d.referenceCode}</div>
</div>
<p class="muted">Köszönjük, hogy az Aetheris-t választottad.</p>`;
  return { subject, html: baseShell(inner, subject) };
}
