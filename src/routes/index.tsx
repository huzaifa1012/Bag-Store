import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Truck, Shield, Package } from "lucide-react";
import {
  fetchActiveBanners,
  fetchFeaturedProducts,
  fetchProducts,
  type Banner,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Carryon — Premium Laptop Bags" },
      {
        name: "description",
        content:
          "Shop premium laptop bags — backpacks, sleeves and briefcases engineered for professionals.",
      },
      { property: "og:title", content: "Carryon — Premium Laptop Bags" },
      {
        property: "og:description",
        content: "Shop premium laptop bags — backpacks, sleeves and briefcases engineered for professionals.",
      },
    ],
  }),
  component: HomePage,
});

function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent/70 px-8 py-20 text-primary-foreground md:px-16 md:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3 w-3" />
            New collection 2026
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
            Bags built for<br />where work travels.
          </h1>
          <p className="mt-4 max-w-lg text-base text-primary-foreground/80 md:text-lg">
            Precision-crafted laptop bags, backpacks and sleeves — engineered
            with premium materials for the modern professional.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products">
              <Button size="lg" variant="secondary" className="gap-2">
                Shop the collection <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const b = banners[idx];
  console.log(b)
  return (
    <div className="relative overflow-hidden rounded-3xl bg-muted">
      {b.image && (
        <img
          src={b.image.url}
          alt={b.title || "Banner"}
          className="h-[380px] w-full object-cover md:h-[520px]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex items-end p-6 md:items-center md:p-16">
        <div className="max-w-xl text-white">
          {b.title && (
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              {b.title}
            </h1>
          )}
          {b.link && (
            <a href={`/products/${b.link?.productId}`} className="mt-6 inline-block">
              <Button size="lg" variant="secondary" className="gap-2">
                Discover <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-4 bg-white/50"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HomePage() {
  const bannersQ = useQuery({
    queryKey: ["banners"],
    queryFn: fetchActiveBanners,
    retry: 1,
  });
  const featuredQ = useQuery({
    queryKey: ["featured"],
    queryFn: fetchFeaturedProducts,
    retry: 1,
  });
  console.log("featuredQ", featuredQ.data)

  const productsQ = useQuery({
    queryKey: ["products", "home"],
    queryFn: () => fetchProducts({ page: 1, limit: 8 }),
    retry: 1,
  });
  console.log("productsQ", productsQ.data)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Banner */}
      {bannersQ.isLoading ? (
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      ) : (
        <BannerCarousel banners={bannersQ.data || []} />
      )}

      {/* Value props */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Truck, title: "Free shipping", desc: "On orders over $99" },
          { icon: Shield, title: "2-year warranty", desc: "Craft you can trust" },
          { icon: Package, title: "30-day returns", desc: "Hassle-free exchanges" },
        ].map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{f.title}</p>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured */}
      {/* {featuredQ.data[0].isActive &&
        <section className="mt-20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                Editor's picks
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                {featuredQ.data[0].title || "Featured bags"}
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredQ.data[0].products.map((val: any, index: number)=>(

          ))}
            <ProductGrid
            loading={featuredQ.isLoading}
            error={featuredQ.error as Error | null}
            products={val.product || []}
            />
        </section>
      }
       */}
      {featuredQ.data?.[0]?.isActive && (
        <section className="mt-20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                Editor's picks
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                {featuredQ.data[0].title || "Featured bags"}
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ProductGrid
            loading={featuredQ.isLoading}
            error={featuredQ.error as Error | null}
            products={
              featuredQ.data[0].products.map((item) => item.product)
            }
          />
        </section>
      )}

      {/* All products */}
      <section className="mt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              Full collection
            </p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Shop all bags</h2>
          </div>
        </div>
        <ProductGrid
          loading={productsQ.isLoading}
          error={productsQ.error as Error | null}
          products={productsQ.data || []}
        />
      </section>
    </div>
  );
}

function ProductGrid({
  loading,
  error,
  products,
}: {
  loading: boolean;
  error: Error | null;
  products: any[];
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
        Couldn't reach the store API. Make sure your server is running on{" "}
        <code>http://localhost:3000</code>. ({error.message})
      </div>
    );
  }
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-border/60 bg-muted/30 p-10 text-center text-sm text-muted-foreground">
        No products available yet.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
