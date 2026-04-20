"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Layers, Home, Inbox, Mail, Tags, Ticket, MapPin } from "lucide-react";

export default function AdminSidebar({
  labels,
}: {
  labels: {
    dashboard: string;
    products: string;
    collections: string;
    landing: string;
    orders: string;
  };
}) {
  const pathname = usePathname();
  const items = [
    { href: "/admin", label: labels.dashboard, icon: LayoutDashboard, exact: true },
    { href: "/admin/products", label: labels.products, icon: Package },
    { href: "/admin/categories", label: "Kategóriák", icon: Tags },
    { href: "/admin/collections", label: labels.collections, icon: Layers },
    { href: "/admin/landing", label: labels.landing, icon: Home },
    { href: "/admin/coupons", label: "Kuponok", icon: Ticket },
    { href: "/admin/pickup-locations", label: "Átvételi pontok", icon: MapPin },
    { href: "/admin/orders", label: labels.orders, icon: Inbox },
    { href: "/admin/newsletter", label: "Hírlevél", icon: Mail },
  ];
  return (
    <nav className="p-3 text-sm">
      {items.map((i) => {
        const active = i.exact
          ? pathname === i.href
          : pathname?.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded ${
              active ? "bg-ink text-white" : "hover:bg-bone"
            }`}
          >
            <i.icon size={16} strokeWidth={1.6} />
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
