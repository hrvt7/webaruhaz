"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SignOutButton from "./SignOutButton";

export default function AdminShell({
  children,
  userEmail,
  labels,
  signOutLabel,
  viewSiteLabel,
}: {
  children: React.ReactNode;
  userEmail: string;
  labels: {
    dashboard: string;
    products: string;
    collections: string;
    landing: string;
    orders: string;
  };
  signOutLabel: string;
  viewSiteLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Route váltáskor automatikusan zárjuk a mobil menüt
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr] bg-bone">
      {/* Mobil header */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-line h-[56px] flex items-center justify-between px-4">
        <Link href="/admin" className="font-display text-lg tracking-[0.25em]">
          Aetheris
        </Link>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Menü"
          className="h-10 w-10 -mr-2 grid place-items-center"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Overlay mobile-on */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-ink/30"
        />
      )}

      {/* Sidebar (desktop sticky + mobile drawer) */}
      <aside
        className={`bg-white border-r border-line flex flex-col z-50
          md:min-h-screen md:sticky md:top-0
          fixed md:relative inset-y-0 left-0 w-[280px] max-w-[85vw]
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 border-b border-line hidden md:block">
          <Link
            href="/admin"
            className="font-display text-xl tracking-[0.25em] block"
          >
            Aetheris
          </Link>
          <div className="mt-1 text-[10px] tracking-widest-2 uppercase text-muted">
            Admin
          </div>
        </div>

        <div className="md:hidden h-[56px] flex items-center justify-between px-5 border-b border-line">
          <div className="font-display text-lg tracking-[0.25em]">Aetheris</div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Bezárás"
            className="h-10 w-10 -mr-2 grid place-items-center"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AdminSidebar labels={labels} />
        </div>

        <div className="mt-auto p-5 border-t border-line space-y-3">
          <Link
            href="/"
            target="_blank"
            className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink block"
          >
            {viewSiteLabel}
          </Link>
          <LanguageSwitcher />
          <div className="text-xs text-muted truncate">{userEmail}</div>
          <SignOutButton label={signOutLabel} />
        </div>
      </aside>

      <main className="min-h-screen">
        <div className="max-w-[1200px] mx-auto p-5 md:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
