import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { fetchProducts } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Shop all laptop bags — Carryon" },
      {
        name: "description",
        content:
          "Browse the full Carryon collection of laptop bags, backpacks and sleeves.",
      },
      { property: "og:title", content: "Shop all laptop bags — Carryon" },
      {
        property: "og:description",
        content: "Browse the full Carryon collection.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [q, setQ] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => fetchProducts({ page: 1, limit: 100 }),
    retry: 1,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter((p) => p.name?.toLowerCase().includes(s));
  }, [data, q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            Collection
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">All laptop bags</h1>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search bags..."
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          Couldn't reach the API. Ensure your server runs on{" "}
          <code>http://localhost:3000</code>. ({(error as Error).message})
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-muted/30 p-10 text-center text-sm text-muted-foreground">
          No bags match your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}