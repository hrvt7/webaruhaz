import Link from "next/link";

const cols = [
  {
    title: "Shop",
    links: [
      ["Women", "/shop/women"],
      ["Men", "/shop/men"],
      ["Accessories", "/shop/accessories"],
      ["Sale", "/shop/sale"],
      ["New arrivals", "/shop?sort=newest"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Size guide", "/size-guide"],
      ["Shipping & returns", "/shipping"],
      ["Contact", "/contact"],
      ["Stores", "/stores"],
    ],
  },
  {
    title: "LUNARA",
    links: [
      ["About", "/about"],
      ["Collections", "/collections/spring-2026"],
      ["Journal", "#"],
      ["Sustainability", "#"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-bone border-t border-line mt-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-16 grid gap-12 lg:grid-cols-[1.3fr_repeat(3,1fr)_1.3fr]">
        <div>
          <div className="font-display text-2xl tracking-[0.25em]">LUNARA</div>
          <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
            Modern wardrobe essentials. Minimalista prémium divat, tartós alapdarabok.
            Budapest.
          </p>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-[11px] tracking-widest-2 uppercase mb-4">
              {c.title}
            </div>
            <ul className="space-y-2 text-sm text-muted">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-ink transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <div className="text-[11px] tracking-widest-2 uppercase mb-4">Follow</div>
          <div className="flex items-center gap-3 text-muted">
            <a
              href="https://instagram.com/lunara.hu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="h-9 w-9 border border-line grid place-items-center hover:bg-ink hover:text-white hover:border-ink transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://facebook.com/lunara.hu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="h-9 w-9 border border-line grid place-items-center hover:bg-ink hover:text-white hover:border-ink transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 22v-8h2.7l.4-3.1H13V8.9c0-.9.3-1.6 1.6-1.6H16V4.5c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H6.6V14h2.7v8H13z" />
              </svg>
            </a>
          </div>
          <div className="mt-6 text-xs text-muted leading-relaxed">
            hello@lunara.hu<br />
            +36 30 123 4567
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] tracking-widest-2 uppercase text-muted">
          <div>© {new Date().getFullYear()} LUNARA. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>Apple Pay</span>
            <span>Google Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
