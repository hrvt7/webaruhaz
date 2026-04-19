import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";

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
  metadataBase: new URL("https://lunara.vercel.app"),
  title: {
    default: "LUNARA — Modern wardrobe essentials",
    template: "%s · LUNARA",
  },
  description:
    "LUNARA — minimalista prémium divat. Válogatott, tartós alapdarabok nőknek és férfiaknak. Budapest.",
  keywords: [
    "lunara",
    "minimalist fashion",
    "wardrobe essentials",
    "prémium divat",
    "budapest",
  ],
  openGraph: {
    title: "LUNARA — Modern wardrobe essentials",
    description: "Minimalista prémium divat. Budapest.",
    type: "website",
    locale: "hu_HU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="hu"
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
              url: "https://lunara.vercel.app",
              logo: "https://lunara.vercel.app/logo.svg",
              email: "hello@lunara.hu",
              telephone: "+36 30 123 4567",
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
        <CartProvider>
          <Header />
          <main className="flex-1 pt-[64px]">{children}</main>
          <Footer />
          <Cart />
        </CartProvider>
      </body>
    </html>
  );
}
