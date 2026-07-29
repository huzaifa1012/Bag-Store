import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { bookOrder, formatPrice, primaryImage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Carryon" },
      { name: "description", content: "Review your bag selection and check out." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, setQty, total, clear } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (!token) {
      toast.info("Please sign in to place your order");
      navigate({ to: "/login", search: { redirect: "/cart" } as any });
      return;
    }
    if (!items.length) return;
    const customerId = user?._id || user?.id;
    if (!customerId) {
      toast.error("Your account is missing an ID. Please sign in again.");
      return;
    }
    setSubmitting(true);
    try {
      await bookOrder({
        customer: String(customerId),
        items: items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
        })),
        notes: notes.trim() || undefined,
      });
      toast.success("Order placed successfully!");
      clear();
      navigate({ to: "/profile" });
    } catch (e) {
      toast.error((e as Error).message || "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse the collection and find your next everyday carry.
        </p>
        <Link to="/products" className="mt-6 inline-block">
          <Button>Shop bags</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold md:text-4xl">Your cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-border rounded-2xl border border-border/60 bg-card">
          {items.map((i) => {
            const img = primaryImage(i.product);
            return (
              <li key={i.product._id} className="flex gap-4 p-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {img && (
                    <img
                      src={img?.url}
                      alt={i.product.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{i.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(i.product.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(i.product._id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        onClick={() => setQty(i.product._id, i.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-l-full hover:bg-muted"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {i.quantity}
                      </span>
                      <button
                        onClick={() => setQty(i.product._id, i.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-r-full hover:bg-muted"
                        aria-label="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="font-semibold">
                      {formatPrice(i.product.price * i.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-semibold">
                {total > 99 ? "Free" : formatPrice(9)}
              </span>
            </div>
          </div>
          <div className="my-4 h-px bg-border" />
          <div className="flex justify-between text-base">
            <span className="font-semibold">Total</span>
            <span className="font-bold">
              {formatPrice(total > 99 ? total : total + 9)}
            </span>
          </div>

          <div className="mt-5">
            <label className="text-xs font-medium text-muted-foreground">
              Order notes (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any delivery instructions?"
              className="mt-1"
              rows={3}
            />
          </div>

          <Button
            onClick={handleCheckout}
            disabled={submitting}
            size="lg"
            className="mt-5 w-full gap-2"
          >
            {submitting ? "Placing order..." : (
              <>
                {token ? "Place order" : "Sign in to check out"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          {!token && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              You'll be prompted to sign in.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
