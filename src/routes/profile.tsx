// import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
// import { useQuery } from "@tanstack/react-query";
// import { useEffect } from "react";
// import { LogOut, Mail, User as UserIcon, Package } from "lucide-react";
// import { useAuth } from "@/lib/auth-context";
// import { fetchMyOrders, formatPrice } from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";

// export const Route = createFileRoute("/profile")({
//   head: () => ({
//     meta: [
//       { title: "Your profile — Carryon" },
//       { name: "description", content: "Manage your account and view orders." },
//     ],
//   }),
//   component: ProfilePage,
// });

// function ProfilePage() {
//   const { user, token, signOut, loading } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading && !token) navigate({ to: "/login" });
//   }, [loading, token, navigate]);

//   const ordersQ = useQuery({
//     queryKey: ["orders", "me"],
//     queryFn: fetchMyOrders,
//     enabled: !!token,
//     retry: 1,
//   });

//   if (!token) return null;

//   const initials = (user?.name || user?.email || "?")
//     .split(/\s+/)
//     .map((p: string) => p[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   return (
//     <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
//       <div className="rounded-3xl border border-border/60 bg-card p-8">
//         <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-5">
//             <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-bold">
//               {initials}
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold">
//                 {user?.name || "Your account"}
//               </h1>
//               <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
//                 {user?.email && (
//                   <span className="inline-flex items-center gap-1.5">
//                     <Mail className="h-3.5 w-3.5" /> {user.email}
//                   </span>
//                 )}
//                 {(user?._id || user?.id) && (
//                   <span className="inline-flex items-center gap-1.5 font-mono text-xs">
//                     <UserIcon className="h-3.5 w-3.5" />
//                     {String(user._id || user.id).slice(0, 12)}…
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//           <Button
//             variant="outline"
//             className="gap-2"
//             onClick={() => {
//               signOut();
//               navigate({ to: "/" });
//             }}
//           >
//             <LogOut className="h-4 w-4" />
//             Sign out
//           </Button>
//         </div>
//       </div>

//       <section className="mt-10">
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-xl font-bold">Your orders</h2>
//         </div>

//         {ordersQ.isLoading ? (
//           <div className="space-y-3">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <Skeleton key={i} className="h-24 w-full rounded-2xl" />
//             ))}
//           </div>
//         ) : ordersQ.error ? (
//           <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
//             Couldn't load orders. {(ordersQ.error as Error).message}
//           </div>
//         ) : !ordersQ.data?.length ? (
//           <div className="rounded-2xl border border-border/60 bg-muted/30 p-10 text-center">
//             <Package className="mx-auto h-8 w-8 text-muted-foreground" />
//             <p className="mt-3 font-medium">No orders yet</p>
//             <p className="mt-1 text-sm text-muted-foreground">
//               When you place an order, it'll show up here.
//             </p>
//             <Link to="/products" className="mt-4 inline-block">
//               <Button>Start shopping</Button>
//             </Link>
//           </div>
//         ) : (
//           <ul className="space-y-3">
//             {ordersQ.data.map((o) => (
//               <li
//                 key={o._id}
//                 className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
//               >
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <p className="font-mono text-xs text-muted-foreground">
//                       #{o._id.slice(-8)}
//                     </p>
//                     {o.status && (
//                       <Badge variant="secondary" className="capitalize">
//                         {o.status}
//                       </Badge>
//                     )}
//                   </div>
//                   <p className="mt-1 text-sm">
//                     {o.items?.length || 0} item{(o.items?.length || 0) === 1 ? "" : "s"}
//                     {o.createdAt && (
//                       <> · {new Date(o.createdAt).toLocaleDateString()}</>
//                     )}
//                   </p>
//                 </div>
//                 {typeof o.total === "number" && (
//                   <p className="font-bold">{formatPrice(o.total)}</p>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { LogOut, Mail, User as UserIcon, Package } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchMyOrders, formatPrice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderCard } from "@/components/order-card";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Carryon" },
      { name: "description", content: "Manage your account and view orders." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, token, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !token) navigate({ to: "/login" });
  }, [loading, token, navigate]);

  const ordersQ = useQuery({
    queryKey: ["orders", "me"],
    queryFn: fetchMyOrders,
    enabled: !!token,
    retry: 1,
  });

  if (!token) return null;

  const initials = (user?.name || user?.email || "?")
    .split(/\s+/)
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border/60 bg-card p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-bold">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {user?.name || "Your account"}
              </h1>
              <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                {user?.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {user.email}
                  </span>
                )}
                {(user?._id || user?.id) && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                    <UserIcon className="h-3.5 w-3.5" />
                    {String(user._id || user.id).slice(0, 12)}…
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              signOut();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Your orders</h2>
        </div>

        {ordersQ.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : ordersQ.error ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
            Couldn't load orders. {(ordersQ.error as Error).message}
          </div>
        ) : !ordersQ.data?.length ? (
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-10 text-center">
            <Package className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              When you place an order, it'll show up here.
            </p>
            <Link to="/products" className="mt-4 inline-block">
              <Button>Start shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ordersQ.data.map((o) => (
              <OrderCard key={o._id} order={o} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}