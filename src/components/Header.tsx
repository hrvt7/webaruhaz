"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useT } from "@/i18n/provider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const { t } = useT();
  const { totalQty, setOpen, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const transparent = pathname === "/" && !scrolled;
  const hideTopbar = pathname?.startsWith("/product/") ?? false;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NAV = [
    { href: "/shop", label: t.nav.shop },
    { href: "/shop/women", label: t.nav.women },
    { href: "/shop/men", label: t.nav.men },
    { href: "/shop/accessories", label: t.nav.accessories },
    { href: "/shop/sale", label: t.nav.sale },
    { href: "/stores", label: t.nav.stores },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40">
      <header
        className={`transition-all duration-300 ${
          transparent
            ? "bg-transparent text-white"
            : scrolled
            ? "bg-white text-ink border-b border-line"
            : "bg-ink text-white"
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 h-[64px] grid grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label={t.menu}
              className="lg:hidden h-9 w-9 -ml-2 grid place-items-center"
            >
              <MenuIcon size={20} strokeWidth={1.4} />
            </button>
            <nav className="hidden lg:flex items-center gap-7 text-[12px] tracking-widest-2 uppercase">
              {NAV.slice(0, 5).map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="hover:opacity-60 transition-opacity"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href="/"
            className="font-display text-[22px] leading-none tracking-[0.25em] select-none"
            aria-label="Aetheris"
          >
            AETHERIS
          </Link>

          <div className="flex items-center justify-end gap-1 md:gap-3">
            <div className="hidden md:inline">
              <LanguageSwitcher />
            </div>
            <Link
              href="/stores"
              className="hidden xl:inline text-[12px] tracking-widest-2 uppercase hover:opacity-60 ml-4"
            >
              {t.nav.stores}
            </Link>
            <button
              aria-label={t.search}
              className="h-9 w-9 grid place-items-center hover:opacity-60"
            >
              <Search size={18} strokeWidth={1.4} />
            </button>
            <button
              aria-label={t.account}
              className="h-9 w-9 hidden sm:grid place-items-center hover:opacity-60 disabled:opacity-40"
              disabled
            >
              <User size={18} strokeWidth={1.4} />
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label={t.cart.title}
              className="h-9 w-9 relative grid place-items-center hover:opacity-60"
            >
              <ShoppingBag size={18} strokeWidth={1.4} />
              {hydrated && totalQty > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-ink text-white text-[10px] font-mono h-4 min-w-4 px-1 grid place-items-center rounded-full">
                  {totalQty}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <div
        className={`w-full bg-ink text-white text-[11px] tracking-widest-3 uppercase text-center overflow-hidden transition-all duration-300 ${
          scrolled && !hideTopbar ? "max-h-10 py-2 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        {t.topbar}
      </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-[64px] px-4 flex items-center justify-between border-b border-line">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="font-display text-lg tracking-[0.25em]"
            >
              AETHERIS
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label={t.close}
              className="h-9 w-9 grid place-items-center"
            >
              <X size={22} strokeWidth={1.4} />
            </button>
          </div>
          <nav className="p-6 flex flex-col gap-5 text-lg tracking-widest-2 uppercase">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="py-1"
              >
                {n.label}
              </Link>
            ))}
            <div className="border-t border-line pt-5 flex flex-col gap-3 text-sm normal-case tracking-normal text-muted">
              <Link href="/about" onClick={() => setMobileOpen(false)}>
                {t.aboutLink}
              </Link>
              <Link href="/size-guide" onClick={() => setMobileOpen(false)}>
                {t.sizeGuideLink}
              </Link>
              <Link href="/shipping" onClick={() => setMobileOpen(false)}>
                {t.shippingLink}
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                {t.contactLink}
              </Link>
              <div className="pt-3">
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
