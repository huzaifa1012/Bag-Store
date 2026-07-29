import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/api";
import { formatPrice, primaryImage } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

export function ProductCard({ product }: { product: Product }) {
  
  const queryClient = useQueryClient();
  const img = primaryImage(product);

  return (
    <Link
      to="/products/$id"
      params={{ id: product._id }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-foreground/20 hover:shadow-xl"
      onClick={() => {
        // Seed the cache so the detail page has data instantly
        queryClient.setQueryData(["product", product._id], product);
      }}
    >
      {/* <div className="relative aspect-square overflow-hidden bg-muted">
        {img ? (
          <img
            src={img?.url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <div className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div> */}
      <div className="relative aspect-square overflow-hidden bg-muted p-4">
        {img ? (
          <img
            src={img?.url}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <div className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-1 font-semibold text-foreground">
          {product.name}
        </h3>
        {product.category && (
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {product.category}
          </p>
        )}
        <p className="mt-2 text-lg font-bold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
