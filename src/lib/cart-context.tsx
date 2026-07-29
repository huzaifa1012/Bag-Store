import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "./api";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "lb_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = (p: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === p._id);
      if (existing) {
        return prev.map((i) =>
          i.product._id === p._id ? { ...i, quantity: i.quantity + qty } : i,
        );
      }
      return [...prev, { product: p, quantity: qty }];
    });
  };
  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.product._id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((i) =>
        i.product._id === id ? { ...i, quantity: Math.max(1, qty) } : i,
      ),
    );
  const clear = () => setItems([]);

  const total = items.reduce(
    (s, i) => s + (i.product.price || 0) * i.quantity,
    0,
  );
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
