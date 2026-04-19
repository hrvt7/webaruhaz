import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SiteChrome from "@/components/SiteChrome";
import { I18nProvider } from "@/i18n/provider";
import { getT } from "@/i18n/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://webaruhaz-gamma.vercel.app"),
  title: {
    default: "LUNARA — Modern wardrobe essentials",
    template: "%s · LUNARA",
  },
  description:
    "LUNARA — minimalista prémium divat. Válogatott, tartós alapdarabok nőknek és férfiaknak. Budapest.",
  openGraph: {
    title: "LUNARA — Modern wardrobe essentials",
    description: "Minimalista prémium divat. Budapest.",
    type: "website",
    locale: "hu_HU",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale } = await getT();
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "LUNARA",
              email: "hello@lunara.hu",
              telephone: "+36 30 525 2336",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Budapest",
                addressCountry: "HU",
              },
              sameAs: [
                "https://instagram.com/lunara.hu",
                "https://facebook.com/lunara.hu",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-ink">
        <I18nProvider locale={locale}>
          <CartProvider>
            <SiteChrome>{children}</SiteChrome>
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
