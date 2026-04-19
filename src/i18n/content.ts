import type { Locale } from "./dict";

type CategoryCode =
  | "women-tops"
  | "women-bottoms"
  | "women-dresses"
  | "men-tops"
  | "men-bottoms"
  | "accessories"
  | "sale";

type CategoryPageKey = "women" | "men" | "accessories" | "sale";

type Content = {
  categoryLabel: Record<CategoryCode, string>;
  categoryPage: Record<CategoryPageKey, { title: string; subtitle: string }>;
  order: {
    successOverline: string;
    successTitle: string;
    successBody: string;
    successBodyWithName: (n: string) => string;
    paidAmount: string;
    backToStore: string;
    cancelOverline: string;
    cancelTitle: string;
    cancelBody: string;
    continueShopping: string;
  };
  secureCheckout: string;
  cardPayment: string;
  whatsappOrder: string;
  demoModeMsg: string;
  acceptTerms: { before: string; aszf: string; and: string; privacy: string; after: string };
  shippingValueFree: string;
  shippingValuePaid: string;
  sizeGuide: {
    overline: string;
    title: string;
    intro: string;
    women: string;
    men: string;
    denim: string;
    unsure: string;
    headers: { size: string; bust: string; chest: string; waist: string; hips: string; inseam: string };
  };
  shipping: {
    overline: string;
    title: string;
    sections: { t: string; b: string }[];
  };
  stores: {
    flagshipName: string;
    address1: string;
    address2: string;
    address3: string;
  };
  productCard: {
    colour: string;
    colours: string;
  };
  collections: {
    overline: string;
    comingSoon: string;
    shopAll: string;
  };
  legal: {
    aszf: string;
    privacy: string;
  };
};

const hu: Content = {
  categoryLabel: {
    "women-tops": "Női · Felsők",
    "women-bottoms": "Női · Alsók",
    "women-dresses": "Női · Ruhák",
    "men-tops": "Férfi · Felsők",
    "men-bottoms": "Férfi · Alsók",
    accessories: "Kiegészítők",
    sale: "Kiárusítás",
  },
  categoryPage: {
    women: {
      title: "Női",
      subtitle: "Kifinomult alapdarabok — felsők, nadrágok, ruhák, kabátok.",
    },
    men: {
      title: "Férfi",
      subtitle: "Férfi alapdarabok — tailoring, kötöttáruk, denim.",
    },
    accessories: {
      title: "Kiegészítők",
      subtitle: "Bőr, kasmír, acél. Kézzel készült részletek.",
    },
    sale: {
      title: "Kiárusítás",
      subtitle: "Előző szezon, korlátozott darabszám. A minőség ugyanaz.",
    },
  },
  order: {
    successOverline: "Rendelés visszaigazolva",
    successTitle: "Köszönjük!",
    successBody:
      "A rendelését rögzítettük. Hamarosan visszajelzünk a szállítással kapcsolatban.",
    successBodyWithName: (n) =>
      `Kedves ${n}, a rendelését rögzítettük. Hamarosan e-mailben és/vagy WhatsApp-on visszajelzünk a szállítás pontos idejével kapcsolatban.`,
    paidAmount: "Fizetett összeg:",
    backToStore: "Vissza a boltba",
    cancelOverline: "Fizetés",
    cancelTitle: "Megszakítva",
    cancelBody:
      "A fizetést megszakítottad. A kosarad tartalma megmaradt, bármikor folytathatod.",
    continueShopping: "Vissza a boltba",
  },
  secureCheckout: "Biztonságos fizetés · Stripe",
  cardPayment: "Bankkártyás fizetés",
  whatsappOrder: "Rendelés WhatsApp-on",
  demoModeMsg:
    "Demo mód — a bankkártyás fizetés hamarosan aktív. Jelenleg kérjük, rendelj WhatsApp-on.",
  acceptTerms: {
    before: "Elolvastam és elfogadom az ",
    aszf: "ÁSZF",
    and: "-et és az ",
    privacy: "Adatkezelési tájékoztatót",
    after: ".",
  },
  shippingValueFree: "Ingyenes",
  shippingValuePaid: "1.690 Ft",
  sizeGuide: {
    overline: "Útmutató",
    title: "Mérettáblázat",
    intro:
      "Méreteink európai szabványon alapulnak. Lazább fazonoknál eggyel kisebb, szűkebb szabásoknál eggyel nagyobb méret ajánlott.",
    women: "Női",
    men: "Férfi",
    denim: "Denim",
    unsure:
      "Bizonytalan vagy? Írj az hello@lunara.hu címre, és segítünk a méretválasztásban.",
    headers: {
      size: "Méret",
      bust: "Mellbőség (cm)",
      chest: "Mellkas (cm)",
      waist: "Derékbőség (cm)",
      hips: "Csípőbőség (cm)",
      inseam: "Belső szárhossz (cm)",
    },
  },
  shipping: {
    overline: "Információ",
    title: "Szállítás és visszaküldés",
    sections: [
      {
        t: "Szállítás Magyarországon",
        b: "30.000 Ft feletti rendelés esetén ingyenes. 30.000 Ft alatt 1.690 Ft átalány. A csomagok GLS-szel 1–2 munkanap alatt érkeznek.",
      },
      {
        t: "Nemzetközi szállítás",
        b: "EU-n belül 3–5 munkanap, 6.900 Ft átalány. EU-n kívül egyedi ajánlatot adunk, kérlek írj az hello@lunara.hu címre.",
      },
      {
        t: "Express szállítás Budapesten",
        b: "Budapesten belül hétköznap 14:00 előtt leadott rendelésekre aznapi futárszolgálat elérhető, 3.900 Ft.",
      },
      {
        t: "Visszaküldés",
        b: "14 napos ingyenes visszaküldés minden online rendelésre. A terméknek eredeti állapotban, címkével kell visszakerülnie. Outlet termékek esetén csak csere lehetséges.",
      },
      {
        t: "Csere",
        b: "Más méretre vagy színre ingyenes csere a termék kézhezvételétől számított 30 napon belül. Írj az hello@lunara.hu címre a csere indításához.",
      },
      {
        t: "Garancia",
        b: "Minden LUNARA terméket 2 év gyártási garanciával értékesítünk. Anyag- vagy varrási hibát díjmentesen javítunk vagy cserélünk.",
      },
    ],
  },
  stores: {
    flagshipName: "LUNARA Flagship",
    address1: "Bazilika 1051 Budapest",
    address2: "Október 6. utca 12.",
    address3: "Magyarország",
  },
  productCard: { colour: "szín", colours: "szín" },
  collections: {
    overline: "Kollekció",
    comingSoon: "A kollekció hamarosan.",
    shopAll: "Teljes katalógus",
  },
  legal: { aszf: "ÁSZF", privacy: "Adatkezelési tájékoztató" },
};

const en: Content = {
  categoryLabel: {
    "women-tops": "Women · Tops",
    "women-bottoms": "Women · Bottoms",
    "women-dresses": "Women · Dresses",
    "men-tops": "Men · Tops",
    "men-bottoms": "Men · Bottoms",
    accessories: "Accessories",
    sale: "Sale",
  },
  categoryPage: {
    women: {
      title: "Women",
      subtitle: "Refined essentials — tops, bottoms, dresses, coats.",
    },
    men: { title: "Men", subtitle: "Essentials — tailoring, knitwear, denim." },
    accessories: {
      title: "Accessories",
      subtitle: "Leather, cashmere, steel. Handmade detail.",
    },
    sale: {
      title: "Sale",
      subtitle: "Previous season, limited stock. Same quality.",
    },
  },
  order: {
    successOverline: "Order confirmed",
    successTitle: "Thank you!",
    successBody:
      "Your order has been recorded. We'll be in touch shortly regarding shipping.",
    successBodyWithName: (n) =>
      `Dear ${n}, your order has been recorded. We will contact you via email and/or WhatsApp with shipping details shortly.`,
    paidAmount: "Amount paid:",
    backToStore: "Back to store",
    cancelOverline: "Payment",
    cancelTitle: "Cancelled",
    cancelBody:
      "Your payment was cancelled. Your cart is still here — you can continue any time.",
    continueShopping: "Back to store",
  },
  secureCheckout: "Secure checkout · Stripe",
  cardPayment: "Pay by card",
  whatsappOrder: "Order via WhatsApp",
  demoModeMsg:
    "Demo mode — card payment is coming soon. Please use WhatsApp to order.",
  acceptTerms: {
    before: "I have read and accept the ",
    aszf: "Terms",
    and: " and the ",
    privacy: "Privacy Policy",
    after: ".",
  },
  shippingValueFree: "Free",
  shippingValuePaid: "1,690 Ft",
  sizeGuide: {
    overline: "Guide",
    title: "Size guide",
    intro:
      "Our sizing follows European standards. For looser fits go one size down, for fitted cuts go one up.",
    women: "Women",
    men: "Men",
    denim: "Denim",
    unsure:
      "Not sure? Write to hello@lunara.hu and we'll help with sizing.",
    headers: {
      size: "Size",
      bust: "Bust (cm)",
      chest: "Chest (cm)",
      waist: "Waist (cm)",
      hips: "Hips (cm)",
      inseam: "Inseam (cm)",
    },
  },
  shipping: {
    overline: "Info",
    title: "Shipping & returns",
    sections: [
      {
        t: "Shipping within Hungary",
        b: "Free over 30,000 Ft. Flat 1,690 Ft below that. Deliveries via GLS within 1–2 business days.",
      },
      {
        t: "International shipping",
        b: "Within EU 3–5 business days, flat 6,900 Ft. Outside EU on request — please email hello@lunara.hu.",
      },
      {
        t: "Express within Budapest",
        b: "Same-day courier available weekdays on orders placed before 14:00, 3,900 Ft.",
      },
      {
        t: "Returns",
        b: "14-day free returns on all online orders. Items must be returned in original condition with tags. Outlet items are exchange-only.",
      },
      {
        t: "Exchanges",
        b: "Free size or colour exchange within 30 days of receipt. Email hello@lunara.hu to start an exchange.",
      },
      {
        t: "Warranty",
        b: "All LUNARA products come with a 2-year manufacturing warranty. Material or stitching defects repaired or replaced free.",
      },
    ],
  },
  stores: {
    flagshipName: "LUNARA Flagship",
    address1: "Bazilika 1051 Budapest",
    address2: "Október 6. utca 12.",
    address3: "Hungary",
  },
  productCard: { colour: "colour", colours: "colours" },
  collections: {
    overline: "Collection",
    comingSoon: "Collection coming soon.",
    shopAll: "Shop all",
  },
  legal: { aszf: "Terms & Conditions", privacy: "Privacy Policy" },
};

const de: Content = {
  categoryLabel: {
    "women-tops": "Damen · Oberteile",
    "women-bottoms": "Damen · Hosen & Röcke",
    "women-dresses": "Damen · Kleider",
    "men-tops": "Herren · Oberteile",
    "men-bottoms": "Herren · Hosen",
    accessories: "Accessoires",
    sale: "Sale",
  },
  categoryPage: {
    women: {
      title: "Damen",
      subtitle: "Feine Essentials — Oberteile, Hosen, Kleider, Mäntel.",
    },
    men: {
      title: "Herren",
      subtitle: "Essentials — Tailoring, Strick, Denim.",
    },
    accessories: {
      title: "Accessoires",
      subtitle: "Leder, Kaschmir, Stahl. Handgefertigte Details.",
    },
    sale: {
      title: "Sale",
      subtitle: "Vorsaison, limitierte Stückzahl. Gleiche Qualität.",
    },
  },
  order: {
    successOverline: "Bestellung bestätigt",
    successTitle: "Danke!",
    successBody:
      "Ihre Bestellung wurde aufgenommen. Wir melden uns in Kürze wegen des Versands.",
    successBodyWithName: (n) =>
      `Liebe/r ${n}, Ihre Bestellung wurde aufgenommen. Wir melden uns in Kürze per E-Mail und/oder WhatsApp mit den Versanddetails.`,
    paidAmount: "Bezahlter Betrag:",
    backToStore: "Zurück zum Shop",
    cancelOverline: "Zahlung",
    cancelTitle: "Abgebrochen",
    cancelBody:
      "Ihre Zahlung wurde abgebrochen. Ihr Warenkorb bleibt — Sie können jederzeit fortfahren.",
    continueShopping: "Zurück zum Shop",
  },
  secureCheckout: "Sichere Zahlung · Stripe",
  cardPayment: "Per Karte zahlen",
  whatsappOrder: "Via WhatsApp bestellen",
  demoModeMsg:
    "Demo-Modus — Kartenzahlung kommt bald. Bitte über WhatsApp bestellen.",
  acceptTerms: {
    before: "Ich habe die ",
    aszf: "AGB",
    and: " und die ",
    privacy: "Datenschutzerklärung",
    after: " gelesen und akzeptiere sie.",
  },
  shippingValueFree: "Kostenlos",
  shippingValuePaid: "1.690 Ft",
  sizeGuide: {
    overline: "Guide",
    title: "Größentabelle",
    intro:
      "Unsere Größen folgen europäischen Standards. Für lockerere Schnitte eine Größe kleiner, für enger eine größer.",
    women: "Damen",
    men: "Herren",
    denim: "Denim",
    unsure:
      "Unsicher? Schreib an hello@lunara.hu und wir helfen bei der Größe.",
    headers: {
      size: "Größe",
      bust: "Brust (cm)",
      chest: "Brust (cm)",
      waist: "Taille (cm)",
      hips: "Hüfte (cm)",
      inseam: "Schrittlänge (cm)",
    },
  },
  shipping: {
    overline: "Info",
    title: "Versand & Rückgabe",
    sections: [
      {
        t: "Versand innerhalb Ungarn",
        b: "Ab 30.000 Ft kostenlos. Pauschal 1.690 Ft darunter. Lieferung via GLS, 1–2 Werktage.",
      },
      {
        t: "Internationaler Versand",
        b: "EU 3–5 Werktage, pauschal 6.900 Ft. Außerhalb EU auf Anfrage — E-Mail an hello@lunara.hu.",
      },
      {
        t: "Express in Budapest",
        b: "Werktags vor 14:00 aufgegebene Bestellungen liefern wir am selben Tag, 3.900 Ft.",
      },
      {
        t: "Rückgabe",
        b: "14 Tage kostenlose Rückgabe. Originalzustand mit Etikett. Outlet-Artikel nur Umtausch.",
      },
      {
        t: "Umtausch",
        b: "Kostenloser Größen- oder Farbumtausch innerhalb 30 Tagen. E-Mail an hello@lunara.hu.",
      },
      {
        t: "Garantie",
        b: "Alle LUNARA Produkte mit 2 Jahren Herstellergarantie. Material- oder Verarbeitungsfehler kostenlos repariert oder ersetzt.",
      },
    ],
  },
  stores: {
    flagshipName: "LUNARA Flagship",
    address1: "Bazilika 1051 Budapest",
    address2: "Október 6. utca 12.",
    address3: "Ungarn",
  },
  productCard: { colour: "Farbe", colours: "Farben" },
  collections: {
    overline: "Kollektion",
    comingSoon: "Kollektion kommt bald.",
    shopAll: "Alle Produkte",
  },
  legal: { aszf: "AGB", privacy: "Datenschutzerklärung" },
};

export const content: Record<Locale, Content> = { hu, en, de };
export const getContent = (locale: Locale) => content[locale] ?? content.hu;
export type { Content, CategoryCode, CategoryPageKey };
