"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, User, ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop/women", label: "Women" },
  { href: "/shop/men", label: "Men" },
  { href: "/shop/accessories", label: "Accessories" },
  { href: "/shop/sale", label: "Sale" },
  { href: "/stores", label: "Stores" },
];

export default function Header() {
  const { totalQty, setOpen, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="w-full bg-ink text-white text-[11px] tracking-widest-3 uppercase py-2 text-center">
        Ingyenes szállítás 30.000 Ft felett · 14 napos visszaküldés
      </div>
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white transition-[border-color,box-shadow] duration-300 ${
          scrolled ? "border-b border-line" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 h-[64px] grid grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
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
            className="font-display text-[26px] leading-none tracking-[0.2em] select-none"
            aria-label="LUNARA"
          >
            LUNARA
          </Link>

          <div className="flex items-center justify-end gap-1 md:gap-3">
            <Link
              href="/stores"
              className="hidden lg:inline text-[12px] tracking-widest-2 uppercase hover:opacity-60 transition-opacity mr-4"
            >
              Stores
            </Link>
            <button
              aria-label="Search"
              className="h-9 w-9 grid place-items-center hover:opacity-60"
            >
              <Search size={18} strokeWidth={1.4} />
            </button>
            <button
              aria-label="Account"
              className="h-9 w-9 hidden sm:grid place-items-center hover:opacity-60 disabled:opacity-40"
              disabled
              title="Hamarosan"
            >
              <User size={18} strokeWidth={1.4} />
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Cart"
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

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-[64px] px-4 flex items-center justify-between border-b border-line">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="font-display text-xl tracking-[0.2em]"
            >
              LUNARA
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close"
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
                About LUNARA
              </Link>
              <Link href="/size-guide" onClick={() => setMobileOpen(false)}>
                Size guide
              </Link>
              <Link href="/shipping" onClick={() => setMobileOpen(false)}>
                Shipping & returns
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                Contact
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
