import type { Product } from "@/lib/store";

const fmtHUF = (n: number) => new Intl.NumberFormat("hu-HU").format(n) + " Ft";

export function renderNewsletterHtml(opts: {
  subject: string;
  introHtml: string;
  products: Product[];
  baseUrl: string;
  unsubscribeUrl: string;
}) {
  const { subject, introHtml, products, baseUrl, unsubscribeUrl } = opts;

  const productCells = products
    .map(
      (p) => `
        <td valign="top" style="padding:8px;width:50%;">
          <a href="${baseUrl}/product/${p.slug}" style="text-decoration:none;color:#0a0a0a;">
            <img src="${p.images?.[0] ?? ""}" alt="${escapeHtml(p.name)}" style="width:100%;height:auto;display:block;background:#F5F1EA;" />
            <div style="font-family:Georgia, serif;font-size:17px;margin-top:10px;line-height:1.25;color:#0a0a0a;">${escapeHtml(p.name)}</div>
            <div style="font-family:'Courier New',monospace;font-size:13px;margin-top:4px;color:#0a0a0a;">
              ${fmtHUF(p.price)}
              ${p.compare_at && p.compare_at > p.price ? `<span style="text-decoration:line-through;color:#888;margin-left:6px;">${fmtHUF(p.compare_at)}</span>` : ""}
            </div>
          </a>
        </td>`,
    )
    .join("");

  // Two columns: group products by pairs
  const productRows: string[] = [];
  for (let i = 0; i < products.length; i += 2) {
    const cellA = productCells.split("</td>")[i] + "</td>";
    const cellB = products[i + 1]
      ? productCells.split("</td>")[i + 1] + "</td>"
      : `<td style="width:50%;"></td>`;
    productRows.push(`<tr>${cellA}${cellB}</tr>`);
  }

  return `<!doctype html>
<html lang="hu">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#F5F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0a0a0a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F1EA;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
          <tr>
            <td align="center" style="padding:40px 24px 24px;border-bottom:1px solid #e5e0d7;">
              <div style="font-family:Georgia, serif;font-size:28px;letter-spacing:0.25em;">LUNARA</div>
              <div style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#6b6b6b;margin-top:6px;">Modern wardrobe essentials</div>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 32px 16px;">
              <h1 style="font-family:Georgia, serif;font-weight:500;font-size:26px;line-height:1.2;margin:0 0 16px;">${escapeHtml(subject)}</h1>
              <div style="font-size:15px;line-height:1.7;color:#3a3a3a;">${introHtml}</div>
            </td>
          </tr>

          ${
            products.length > 0
              ? `<tr>
                  <td style="padding:8px 24px 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${productRows.join("")}
                    </table>
                  </td>
                </tr>`
              : ""
          }

          <tr>
            <td align="center" style="padding:24px 32px 40px;">
              <a href="${baseUrl}/shop" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;padding:14px 32px;">Shop all</a>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px;border-top:1px solid #e5e0d7;font-size:11px;color:#6b6b6b;line-height:1.6;">
              <div>LUNARA · Budapest · hello@lunara.hu</div>
              <div style="margin-top:10px;">
                Ezt az emailt azért kaptad, mert feliratkoztál a LUNARA hírlevelére.
                <a href="${unsubscribeUrl}" style="color:#6b6b6b;text-decoration:underline;">Leiratkozás</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
