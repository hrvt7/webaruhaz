export type Category =
  | "women-tops"
  | "women-bottoms"
  | "women-dresses"
  | "men-tops"
  | "men-bottoms"
  | "accessories"
  | "sale";

export type Gender = "women" | "men" | "unisex";

export type Product = {
  slug: string;
  sku: string;
  name: string;
  category: Category;
  gender: Gender;
  price: number;
  compareAt?: number;
  colors: string[];
  sizes: string[];
  shortDesc: string;
  longDesc: string;
  materials: string;
  care: string;
  badge?: "New arrival" | "Bestseller" | "Limited" | "Sale";
  images: string[];
  collection?: string;
};

const img = (seed: string, w = 900, h = 1200) =>
  `https://picsum.photos/seed/lunara-${seed}/${w}/${h}`;

export const products: Product[] = [
  {
    slug: "linen-oversized-shirt",
    sku: "LNR-W-001",
    name: "Linen Oversized Shirt",
    category: "women-tops",
    gender: "women",
    price: 24900,
    colors: ["Fehér", "Bézs", "Fekete"],
    sizes: ["XS", "S", "M", "L", "XL"],
    shortDesc:
      "Légies len. Lazán szabott, kényelmes, feltűrhető ujjal. A könnyed hétköznapok kedvence.",
    longDesc:
      "Prémium európai len szövetből készült, oversized fazonú ing. Ellazult váll, nyitott gallér, elegáns esés. Laza farmerral vagy szoknyával egyaránt viselhető.",
    materials: "100% európai len",
    care: "30°C-on mosható, alacsony hőfokon vasalható.",
    badge: "New arrival",
    images: [img("shirt-1-a"), img("shirt-1-b"), img("shirt-1-c")],
    collection: "spring-2026",
  },
  {
    slug: "cashmere-turtleneck",
    sku: "LNR-W-002",
    name: "Cashmere Turtleneck",
    category: "women-tops",
    gender: "women",
    price: 38900,
    colors: ["Szürke", "Bordó"],
    sizes: ["S", "M", "L"],
    shortDesc:
      "Érzéki mongol kasmír, puha garbó fazon. A hidegebb hónapok csendes luxusa.",
    longDesc:
      "100% kasmír fonalból kötött, finom ribbel szegélyezett garbó. Testre simuló, mégis lélegző. Skandináv steppek és olasz tervezés találkozása.",
    materials: "100% mongol kasmír",
    care: "Kézi mosás hideg vízben, fektetve szárítani.",
    badge: "Bestseller",
    images: [img("turtleneck-2-a"), img("turtleneck-2-b"), img("turtleneck-2-c")],
  },
  {
    slug: "silk-blouse-noir",
    sku: "LNR-W-003",
    name: "Silk Blouse Noir",
    category: "women-tops",
    gender: "women",
    price: 32900,
    colors: ["Fekete"],
    sizes: ["XS", "S", "M", "L"],
    shortDesc:
      "Tiszta selyem. Lágy esés, diszkrét fény. Klasszikus french-girl darab.",
    longDesc:
      "Mulberry selyemből szabott blúz, rejtett gombolással és nőies ujjal. Estére is, irodába is.",
    materials: "100% mulberry selyem",
    care: "Kézi mosás vagy vegytisztítás.",
    images: [img("silk-3-a"), img("silk-3-b"), img("silk-3-c")],
  },
  {
    slug: "wide-leg-wool-trousers",
    sku: "LNR-W-010",
    name: "Wide-Leg Wool Trousers",
    category: "women-bottoms",
    gender: "women",
    price: 42900,
    colors: ["Fekete", "Szürke"],
    sizes: ["36", "38", "40", "42"],
    shortDesc: "Magas derekú, bő szárú gyapjúnadrág. A minimalista wardrobe gerince.",
    longDesc:
      "Súlyozott olasz gyapjúkeverék, éles vasalt él, rejtett cipzár. Hidegebb hónapokra szabva, egész nap komfortos.",
    materials: "70% gyapjú, 30% viszkóz",
    care: "Vegytisztítás javasolt.",
    images: [img("trousers-4-a"), img("trousers-4-b"), img("trousers-4-c")],
    collection: "spring-2026",
  },
  {
    slug: "high-rise-denim-classic",
    sku: "LNR-W-011",
    name: "High-Rise Denim Classic",
    category: "women-bottoms",
    gender: "women",
    price: 28900,
    colors: ["Indigo", "Fekete"],
    sizes: ["26", "28", "30", "32"],
    shortDesc: "Egyenes szárú, magas derekú farmer. Japán denim, amerikai forma.",
    longDesc:
      "Nyers japán pamut denim szövetből, tömör varrásokkal. Alapdarab minden stíluskollekcióhoz.",
    materials: "100% pamut, japán denim",
    care: "Fordítva, 30°C hideg vízben mosható.",
    images: [img("denim-5-a"), img("denim-5-b"), img("denim-5-c")],
  },
  {
    slug: "midi-slip-dress",
    sku: "LNR-W-020",
    name: "Midi Slip Dress",
    category: "women-dresses",
    gender: "women",
    price: 36900,
    colors: ["Fekete", "Champagne"],
    sizes: ["XS", "S", "M", "L"],
    shortDesc: "Bias-szabású midi ruha. Selymes szatén, csupasz hát.",
    longDesc:
      "Finom pántos, állítható, testre simuló fazon. Stilisztikailag állomás az esti ruhatár közepén — alkalmi sminkkel, nappal pulóver alá is.",
    materials: "92% viszkóz, 8% elasztán szatén",
    care: "Kézi mosás 30°C-on.",
    badge: "Bestseller",
    images: [img("slip-6-a"), img("slip-6-b"), img("slip-6-c")],
    collection: "spring-2026",
  },
  {
    slug: "structured-wool-coat",
    sku: "LNR-W-021",
    name: "Structured Wool Coat",
    category: "women-dresses",
    gender: "women",
    price: 89900,
    colors: ["Camel", "Fekete"],
    sizes: ["S", "M", "L"],
    shortDesc: "Nehéz gyapjú, dupla sorú gombolás, klasszikus forma.",
    longDesc:
      "Strukturált válú, bélelt gyapjúkabát. Olasz kelme, kézzel illesztett szabás. Évtizedekig hordható darab.",
    materials: "80% gyapjú, 20% kasmír",
    care: "Csak vegytisztítás.",
    badge: "Limited",
    images: [img("coat-7-a"), img("coat-7-b"), img("coat-7-c")],
  },
  {
    slug: "heavy-cotton-crewneck",
    sku: "LNR-M-001",
    name: "Heavy Cotton Crewneck",
    category: "men-tops",
    gender: "men",
    price: 22900,
    colors: ["Off-white", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    shortDesc: "Japán heavyweight pamut pulóver. Strukturált, mégis puha.",
    longDesc:
      "400 g/m² pamut szövet, box fit. Bolyhosított belső felület, ribbelt csuklók és derék. Évről évre megtartja a formáját.",
    materials: "100% japán pamut",
    care: "30°C-on mosható.",
    badge: "Bestseller",
    images: [img("crew-8-a"), img("crew-8-b"), img("crew-8-c")],
  },
  {
    slug: "merino-wool-pullover",
    sku: "LNR-M-002",
    name: "Merino Wool Pullover",
    category: "men-tops",
    gender: "men",
    price: 34900,
    colors: ["Charcoal", "Olive"],
    sizes: ["M", "L", "XL"],
    shortDesc: "Tisztán finom merinó. Vékony, meleg, lélegző.",
    longDesc:
      "Olasz Cariaggi merinó fonal, fine-gauge kötés. Tailoring alatt ingre, vagy önmagában kabát alá.",
    materials: "100% extrafinom merinó gyapjú",
    care: "Kézi mosás hideg vízben.",
    images: [img("merino-9-a"), img("merino-9-b"), img("merino-9-c")],
  },
  {
    slug: "relaxed-chino-pant",
    sku: "LNR-M-010",
    name: "Relaxed Chino Pant",
    category: "men-bottoms",
    gender: "men",
    price: 24900,
    colors: ["Sand", "Black"],
    sizes: ["30", "32", "34", "36"],
    shortDesc: "Lágy, relaxed chino. Kényelmes, mégis nem hétköznapi.",
    longDesc:
      "Washed pamut keverék, pici sztreccsel. Elegánsabb mint egy farmer, oldottabb mint egy öltöny.",
    materials: "98% pamut, 2% elasztán",
    care: "30°C-on mosható.",
    images: [img("chino-10-a"), img("chino-10-b"), img("chino-10-c")],
  },
  {
    slug: "premium-selvedge-denim",
    sku: "LNR-M-011",
    name: "Premium Selvedge Denim",
    category: "men-bottoms",
    gender: "men",
    price: 39900,
    colors: ["Raw Indigo"],
    sizes: ["30", "32", "34", "36"],
    shortDesc: "Nyers selvedge denim. Egy év múlva is jobban áll.",
    longDesc:
      "14 oz japán selvedge denim, natural indigo festéssel. Szűk egyenes szár, erős varrások, réz szegecsek.",
    materials: "100% japán pamut, selvedge",
    care: "Fordítva, ritkán mosható.",
    badge: "Limited",
    images: [img("selvedge-11-a"), img("selvedge-11-b"), img("selvedge-11-c")],
  },
  {
    slug: "leather-crossbody-bag",
    sku: "LNR-A-001",
    name: "Leather Crossbody Bag",
    category: "accessories",
    gender: "unisex",
    price: 54900,
    colors: ["Black", "Cognac"],
    sizes: ["One Size"],
    shortDesc: "Kompakt bőr crossbody. Minimalista vonalak, kézzel varrva.",
    longDesc:
      "Olasz növényi cserzésű marhabőr. Állítható vállszíj, rejtett mágnes-zár, belső zseb.",
    materials: "100% növényi cserzésű bőr",
    care: "Bőrápolóval időnként impregnálandó.",
    badge: "New arrival",
    images: [img("bag-12-a"), img("bag-12-b"), img("bag-12-c")],
  },
  {
    slug: "wool-cashmere-scarf",
    sku: "LNR-A-002",
    name: "Wool Cashmere Scarf",
    category: "accessories",
    gender: "unisex",
    price: 18900,
    colors: ["Grey", "Camel", "Black"],
    sizes: ["One Size"],
    shortDesc: "Gyapjú-kasmír sál. Súlya van, mégis nem nyomasztó.",
    longDesc:
      "70% gyapjú, 30% kasmír, rojtos széllel. 200×40 cm, unisex fazon.",
    materials: "70% gyapjú, 30% kasmír",
    care: "Vegytisztítás javasolt.",
    images: [img("scarf-13-a"), img("scarf-13-b"), img("scarf-13-c")],
  },
  {
    slug: "minimalist-watch",
    sku: "LNR-A-003",
    name: "Minimalist Watch",
    category: "accessories",
    gender: "unisex",
    price: 29900,
    colors: ["Silver", "Gold"],
    sizes: ["One Size"],
    shortDesc: "36 mm tok, lapos számlap. Semmi fölösleges.",
    longDesc:
      "Rozsdamentes acél tok, szafirkristály üveg, japán kvarc szerkezet. Cserélhető bőrszíjjal.",
    materials: "Rozsdamentes acél, bőrszíj",
    care: "Vízlepergető, nem vízálló.",
    images: [img("watch-14-a"), img("watch-14-b"), img("watch-14-c")],
  },
  {
    slug: "previous-season-blazer",
    sku: "LNR-S-001",
    name: "Previous Season Blazer",
    category: "sale",
    gender: "women",
    price: 24900,
    compareAt: 49900,
    colors: ["Fekete"],
    sizes: ["S", "M", "L"],
    shortDesc: "Előző szezon, megmaradt készlet. Továbbra is időtlen.",
    longDesc:
      "Single-breasted, szűkített derék, félig bélelt. Selymes viszkóz szövet, könnyű nyárra és átmeneti időre.",
    materials: "65% viszkóz, 35% poliészter",
    care: "Vegytisztítás.",
    badge: "Sale",
    images: [img("blazer-15-a"), img("blazer-15-b"), img("blazer-15-c")],
  },
  {
    slug: "summer-linen-dress",
    sku: "LNR-S-002",
    name: "Summer Linen Dress",
    category: "sale",
    gender: "women",
    price: 18900,
    compareAt: 32900,
    colors: ["Fehér"],
    sizes: ["S", "M"],
    shortDesc: "Könnyed len ruha — a nyár legmenőbb easy darabja.",
    longDesc:
      "Lazán szabott, ujjatlan, maxi fazon. Állítható pántokkal, pamut béléssel.",
    materials: "100% európai len",
    care: "30°C-on mosható, gyűrődő anyag.",
    badge: "Sale",
    images: [img("linen-dress-16-a"), img("linen-dress-16-b"), img("linen-dress-16-c")],
  },
];

export const CATEGORY_LABEL: Record<Category, string> = {
  "women-tops": "Women · Tops",
  "women-bottoms": "Women · Bottoms",
  "women-dresses": "Women · Dresses",
  "men-tops": "Men · Tops",
  "men-bottoms": "Men · Bottoms",
  accessories: "Accessories",
  sale: "Sale",
};

export const GENDER_LABEL: Record<Gender, string> = {
  women: "Women",
  men: "Men",
  unisex: "Unisex",
};

export const formatHUF = (n: number) =>
  new Intl.NumberFormat("hu-HU").format(n) + " Ft";

export const findProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const byGender = (g: Gender) =>
  products.filter((p) => p.gender === g && p.category !== "sale");

export const byCategory = (c: Category) =>
  products.filter((p) => p.category === c);

export const onSale = products.filter((p) => p.category === "sale");

export const newArrivals = products.filter((p) => p.badge === "New arrival");

export const related = (p: Product, n = 4) =>
  products
    .filter(
      (x) =>
        x.slug !== p.slug &&
        (x.gender === p.gender || x.category === p.category),
    )
    .slice(0, n);

export const allColors = Array.from(
  new Set(products.flatMap((p) => p.colors)),
).sort();

export const allSizes = Array.from(
  new Set(products.flatMap((p) => p.sizes)),
);

export const priceRange = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
};

export const COLOR_HEX: Record<string, string> = {
  Fehér: "#f5f4f0",
  Bézs: "#d9c8ab",
  Fekete: "#0a0a0a",
  Szürke: "#8b8b8b",
  Bordó: "#6b1f23",
  Indigo: "#223a5e",
  Champagne: "#e7d6bc",
  Camel: "#c19a6b",
  "Off-white": "#efeae0",
  Navy: "#1a2647",
  Charcoal: "#3a3a3a",
  Olive: "#707d4a",
  Sand: "#d9c8ab",
  Black: "#0a0a0a",
  "Raw Indigo": "#1a2647",
  Cognac: "#924a22",
  Grey: "#8b8b8b",
  Silver: "#c6c6c6",
  Gold: "#c9a668",
};
