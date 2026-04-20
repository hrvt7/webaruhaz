"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
};

export type AppliedCoupon = {
  code: string;
  description: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  discount: number; // konkrét HUF levonás, validálás pillanatában rögzítve
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  totalQty: number;
  subtotal: number;
  coupon: AppliedCoupon | null;
  discount: number; // a kosár tartalmához igazított kedvezmény (ha a subtotal csökkent)
  setCoupon: (c: AppliedCoupon | null) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  hydrated: boolean;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "lunara-cart-v1";
const COUPON_KEY = "lunara-coupon-v1";

export const lineKey = (i: Pick<CartItem, "slug" | "size" | "color">) =>
  `${i.slug}__${i.size}__${i.color}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCouponState] = useState<AppliedCoupon | null>(null);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
      const rawC = localStorage.getItem(COUPON_KEY);
      if (rawC) setCouponState(JSON.parse(rawC));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(KEY, JSON.stringify(items));
      } catch {}
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) {
      try {
        if (coupon) localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
        else localStorage.removeItem(COUPON_KEY);
      } catch {}
    }
  }, [coupon, hydrated]);

  const setCoupon: CartCtx["setCoupon"] = (c) => setCouponState(c);

  const add: CartCtx["add"] = (item, qty = 1) =>
    setItems((prev) => {
      const key = lineKey(item);
      const f = prev.find((i) => lineKey(i) === key);
      if (f)
        return prev.map((i) =>
          lineKey(i) === key ? { ...i, qty: i.qty + qty } : i,
        );
      return [...prev, { ...item, qty }];
    });

  const inc: CartCtx["inc"] = (key) =>
    setItems((prev) =>
      prev.map((i) => (lineKey(i) === key ? { ...i, qty: i.qty + 1 } : i)),
    );

  const dec: CartCtx["dec"] = (key) =>
    setItems((prev) =>
      prev.flatMap((i) => {
        if (lineKey(i) === key)
          return i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : [];
        return [i];
      }),
    );

  const remove: CartCtx["remove"] = (key) =>
    setItems((prev) => prev.filter((i) => lineKey(i) !== key));

  const clear = () => {
    setItems([]);
    setCouponState(null);
  };

  const totalQty = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.qty * i.price, 0),
    [items],
  );

  // A kedvezmény a kosárhoz igazított: ha a subtotal csökken a coupon validálása óta,
  // a kedvezmény nem lehet nagyobb mint a subtotal.
  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.discount_type === "percent") {
      return Math.min(Math.round((subtotal * coupon.discount_value) / 100), subtotal);
    }
    return Math.min(coupon.discount_value, subtotal);
  }, [coupon, subtotal]);

  return (
    <Ctx.Provider
      value={{
        items,
        add,
        inc,
        dec,
        remove,
        clear,
        totalQty,
        subtotal,
        coupon,
        discount,
        setCoupon,
        open,
        setOpen,
        hydrated,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
