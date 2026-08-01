import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { fetchProduct, formatPrice, primaryImage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/cart-context";

const SITE_URL = "https://bag-store-olive.vercel.app";

// function getOgImageUrl(image?: string) {
//   console.log("image ss", image)
//   if (!image.url) return `${SITE_URL}/favicon-96x96.png`;
//   if (image.url.startsWith("http://") || image.url.startsWith("https://")) return image.url;
//   if (image.url.startsWith("/")) return `${SITE_URL}${image}`;
//   return `${SITE_URL}/${image}`;
// }
// function getOgImageUrl(image?: { url: string }) {
//   if (!image?.url) return `${SITE_URL}/favicon-96x96.png`;
//   if (image.url.startsWith("http://") || image.url.startsWith("https://")) return image.url;
//   if (image.url.startsWith("/")) return `${SITE_URL}${image.url}`;
//   return `${SITE_URL}/${image.url}`;
// }
function getOgImageUrl(image?: { url: string }) {
  const fallback = `${SITE_URL}/favicon-96x96.png`;
  if (!image?.url) return fallback;

  const raw = image.url.startsWith("http")
    ? image.url
    : `${SITE_URL}${image.url.startsWith("/") ? "" : "/"}${image.url}`;

  // Pad the image into a clean 1200x630 canvas with white background
  return `https://wsrv.nl/?url=${encodeURIComponent(raw)}&w=1200&h=630&fit=contain&bg=white`;
}
export const Route = createFileRoute("/products/$id")({
  head: async ({ params }) => {
    const product = await fetchProduct(params.id);
    const title = product ? `${product.name} — Carryon` : "Carryon — Premium Laptop Bags";
    const description = product?.description
      ? product.description
      : "Shop premium laptop bags — backpacks, sleeves and briefcases engineered for professionals.";
    const image = getOgImageUrl(primaryImage(product || { _id: params.id, name: "", price: 0 } as any) || "/favicon-96x96.png");

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `${SITE_URL}/products/${params.id}` },
        { property: "og:image", content: image },
        { property: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    staleTime: Infinity, // trust the seeded data, don't refetch in background
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {(error as Error)?.message || "This item is no longer available."}
        </p>
        <Link to="/products" className="mt-6 inline-block">
          <Button variant="outline">Back to shop</Button>
        </Link>
      </div>
    );
  }

  const img = primaryImage(product);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate({ to: "/products" })}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </button>

      <div className="grid gap-10 md:grid-cols-2">
        {/* <div className="overflow-hidden rounded-3xl border border-border/60 bg-muted">
          {img ? (
            <div className="aspect-square overflow-hidden rounded-3xl border border-border/60 bg-white flex items-center justify-center">
              <img
                src={img?.url}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            // <img
            //   src={img?.url}
            //   alt={product.name}
            //   className="aspect-square w-full object-cover"
            // />
          ) : (
            <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div> */}

        <div className="overflow-hidden rounded-3xl border border-border/60 bg-muted">
          {img ? (
            <div className="aspect-square overflow-hidden rounded-3xl border border-border/60 bg-white flex items-center justify-center">
              <img
                src={img?.url}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            // <img
            //   src={img?.url}
            //   alt={product.name}
            //   className="aspect-square w-full object-cover"
            // />
          ) : (
            <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <div className="flex flex-col">
          {product.category && (
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              {product.category}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold">{formatPrice(product.price)}</p>

          {product.description && (
            <p className="mt-6 text-base text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-l-full hover:bg-muted"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-r-full hover:bg-muted"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={() => {
                add(product, qty);
                toast.success(`${product.name} added to cart`, {
                  icon: <Check className="h-4 w-4" />,
                });
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">Free shipping</p>
              <p>Over $99</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">2-year warranty</p>
              <p>Included</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">30-day returns</p>
              <p>No questions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
