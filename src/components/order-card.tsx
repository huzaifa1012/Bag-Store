import { ArrowUpRight, Package, Truck, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function getStatusVariant(status: string) {
    const s = status.toLowerCase();
    if (s === "paid" || s === "fulfilled" || s === "delivered") return "success";
    if (s === "pending" || s === "reserved") return "warning";
    if (s === "cancelled" || s === "failed") return "destructive";
    return "secondary";
}

export function OrderCard({ order }: { order: any }) {
    return (
        <div className="rounded-xl border bg-background overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-muted/40 px-5 py-4">
                <div>       
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
                <Badge variant="outline" className="capitalize">
                    {order.source}
                </Badge>
            </div>

            {/* Status row */}
            <div className="grid grid-cols-2 gap-3 px-5 py-4 border-b sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-lg border p-3">
                    <Wallet className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{order.payment?.method}</p>
                        <Badge variant={getStatusVariant(order.payment?.status)} className="mt-0.5">
                            {order.payment?.status}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border p-3">
                    <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Delivery</p>
                        <Badge variant={getStatusVariant(order.delivery?.status)} className="mt-0.5">
                            {order.delivery?.status}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Customer */}
            <div className="flex items-center justify-between px-5 py-3 border-b">
                <div>
                    <p className="text-sm font-medium">{order.customer?.name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer?.email}</p>
                </div>
                <Badge variant="secondary" className="capitalize">
                    {order.customer?.role?.replace("_", " ")}
                </Badge>
            </div>

            {/* Items */}
            <div className="divide-y">
                {order.items?.map((item: any) => {
                    const img = item.product?.images?.[0];
                    return (
                        <div key={item._id} className="flex items-center gap-3 px-5 py-3">
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-muted p-1.5">
                                {img ? (
                                    <img
                                        src={img.url}
                                        alt={item.productName}
                                        className="h-full w-full object-contain"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{item.productName}</p>
                                <p className="text-xs text-muted-foreground">
                                    Rs. {item.price.toLocaleString()} × {item.quantity}
                                </p>
                            </div>
                            <p className="text-sm font-medium">Rs. {item.total.toLocaleString()}</p>
                        </div>
                    );
                })}
            </div>

            {/* Notes */}
            {order.notes && (
                <div className="px-5 py-3 border-t bg-muted/30">
                    <p className="text-xs text-muted-foreground">Note: {order.notes}</p>
                </div>
            )}

            {/* Footer / total */}
            <div className="flex items-center justify-between border-t px-5 py-4">
                <p className="text-sm text-muted-foreground">Total amount</p>
                <p className="text-base font-semibold">Rs. {order.totalAmount.toLocaleString()}</p>
            </div>
        </div>
    );
}