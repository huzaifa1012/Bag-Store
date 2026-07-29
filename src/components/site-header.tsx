import { Link } from "@tanstack/react-router";
import { Briefcase, ShoppingBag, User as UserIcon } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { count } = useCart();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">CARRYON</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              laptop bags
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors [&.active]:text-foreground">
            Home
          </Link>
          <Link to="/products" className="hover:text-foreground transition-colors [&.active]:text-foreground">
            Shop
          </Link>
          {user && (
            <Link to="/profile" className="hover:text-foreground transition-colors [&.active]:text-foreground">
              Profile
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Button>
          </Link>
          {user ? (
            <Link to="/profile">
              <Button variant="outline" size="sm" className="gap-2">
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {user.name?.split(" ")[0] || "Account"}
                </span>
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30 mt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="font-bold tracking-tight">CARRYON</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Premium laptop bags engineered for the modern professional.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-foreground">All bags</Link></li>
              <li><Link to="/" className="hover:text-foreground">Featured</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-foreground">Sign in</Link></li>
              <li><Link to="/register" className="hover:text-foreground">Create account</Link></li>
              <li><Link to="/profile" className="hover:text-foreground">Orders</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Carryon. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
