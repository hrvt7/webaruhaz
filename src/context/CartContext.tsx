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

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  totalQty: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  hydrated: boolean;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "lunara-cart-v1";

export const lineKey = (i: Pick<CartItem, "slug" | "size" | "color">) =>
  `${i.slug}__${i.size}__${i.color}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
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

  const clear = () => setItems([]);

  const totalQty = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.qty * i.price, 0),
    [items],
  );

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
