"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import CookieBanner from "@/components/CookieBanner";
import { useT } from "@/i18n/provider";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale } = useT();
  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }
  return (
    <>
      <Header />
      <main className="flex-1 pt-[64px]">{children}</main>
      <Footer />
      <Cart />
      <CookieBanner locale={locale} />
    </>
  );
}
