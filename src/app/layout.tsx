import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SiteChrome from "@/components/SiteChrome";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import { I18nProvider } from "@/i18n/provider";
import { getT } from "@/i18n/server";
import { getLanding } from "@/lib/store";
import { localize } from "@/lib/localize";

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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://webaruhaz-gamma.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aetheris — Modern wardrobe essentials",
    template: "%s · Aetheris",
  },
  description:
    "Aetheris — minimalista prémium divat. Válogatott, tartós alapdarabok nőknek és férfiaknak. Budapest.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aetheris — Modern wardrobe essentials",
    description: "Minimalista prémium divat. Budapest.",
    type: "website",
    locale: "hu_HU",
    url: SITE_URL,
    siteName: "Aetheris",
    images: [
      {
        url: "/aetheris-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Aetheris — Modern wardrobe essentials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aetheris — Modern wardrobe essentials",
    description: "Minimalista prémium divat. Budapest.",
    images: ["/aetheris-hero.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale } = await getT();
  const landing = await getLanding().catch(() => null);
  const footerTagline = localize(landing?.footer?.tagline, locale);
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
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: "Aetheris",
                  url: SITE_URL,
                  logo: `${SITE_URL}/aetheris-logo.jpg`,
                  email: "info@aetheris.hu",
                  telephone: "+36 30 525 2336",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Budapest",
                    addressCountry: "HU",
                  },
                  sameAs: [
                    "https://instagram.com/aetheris.hu",
                    "https://facebook.com/profile.php?id=61580621469300",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: "Aetheris",
                  description:
                    "Minimalista prémium divat. Modern wardrobe essentials.",
                  publisher: { "@id": `${SITE_URL}/#organization` },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                  inLanguage: ["hu", "en", "de"],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-ink">
        <Analytics />
        <I18nProvider locale={locale}>
          <CartProvider>
            <SiteChrome footerTagline={footerTagline}>{children}</SiteChrome>
          </CartProvider>
        </I18nProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
