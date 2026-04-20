"use client";

import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useT } from "@/i18n/provider";

export default function Footer({ taglineOverride }: { taglineOverride?: string }) {
  const { t, c } = useT();
  const tagline = (taglineOverride && taglineOverride.trim()) || t.footer.tagline;
  const cols = [
    {
      title: t.footer.shop,
      links: [
        [t.footer.shopLinks.women, "/shop/women"],
        [t.footer.shopLinks.men, "/shop/men"],
        [t.footer.shopLinks.accessories, "/shop/accessories"],
        [t.footer.shopLinks.sale, "/shop/sale"],
        [t.footer.shopLinks.newArrivals, "/shop?sort=newest"],
      ],
    },
    {
      title: t.footer.help,
      links: [
        [t.footer.helpLinks.sizeGuide, "/size-guide"],
        [t.footer.helpLinks.shipping, "/shipping"],
        [t.footer.helpLinks.contact, "/contact"],
        [t.footer.helpLinks.stores, "/stores"],
        [c.legal.aszf, "/aszf"],
        [c.legal.privacy, "/adatkezeles"],
      ],
    },
    {
      title: t.footer.lunara,
      links: [
        [t.footer.brandLinks.about, "/about"],
        [t.footer.brandLinks.collections, "/collections/spring-2026"],
        [t.footer.brandLinks.journal, "#"],
        [t.footer.brandLinks.sustainability, "#"],
      ],
    },
  ];

  return (
    <footer className="bg-bone border-t border-line mt-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-16 grid gap-12 lg:grid-cols-[1.3fr_repeat(3,1fr)_1.3fr]">
        <div>
          <div className="font-display text-2xl tracking-[0.25em]">AETHERIS</div>
          <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
            {tagline}
          </p>
          <div className="mt-6">
            <LanguageSwitcher />
          </div>
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
          <div className="text-[11px] tracking-widest-2 uppercase mb-4">
            {t.footer.follow}
          </div>
          <div className="flex items-center gap-3 text-muted">
            <a
              href="https://instagram.com/aetheris.hu"
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
              href="https://facebook.com/profile.php?id=61580621469300"
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
            info@aetheris.hu<br />
            +36 30 525 2336
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] tracking-widest-2 uppercase text-muted">
          <div>© {new Date().getFullYear()} AETHERIS. {t.footer.allRights}</div>
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
