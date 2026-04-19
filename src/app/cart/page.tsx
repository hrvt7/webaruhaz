"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { setOpen } = useCart();

  useEffect(() => {
    setOpen(true);
  }, [setOpen]);

  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">Bag</div>
      <h1 className="font-display text-4xl md:text-5xl">Shopping bag</h1>
      <p className="mt-5 text-muted max-w-sm mx-auto leading-relaxed">
        A kosár jobb oldalt nyílik meg. Ott tudod véglegesíteni a rendelést
        WhatsApp-on keresztül.
      </p>
      <Link
        href="/shop"
        className="inline-block mt-10 border border-ink text-[11px] tracking-widest-2 uppercase px-8 py-4 hover:bg-ink hover:text-white transition-colors"
      >
        Continue shopping
      </Link>
    </section>
  );
}
