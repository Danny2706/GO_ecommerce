import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Package, Clock, CheckCircle2, Truck, XCircle, ArrowLeft } from "lucide-react";
import { api, BackendOrder } from "../services/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await api.getOrders();
        setOrders(res || []);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusBadge = (status: BackendOrder["status"]) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 size={12} /> Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Truck size={12} /> Shipped
          </span>
        );
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <CheckCircle2 size={12} /> Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock size={12} /> Processing
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-destructive/10 text-destructive border border-destructive/20">
            <XCircle size={12} /> Cancelled
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link to="/profile" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-1">
              <ArrowLeft size={12} /> Back to Profile
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Order History</h1>
          </div>
          <Link
            to="/shop"
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <Package size={48} className="mx-auto text-muted-foreground mb-3 opacity-40" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No orders placed yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explore our marketplace and place your first order.
            </p>
            <Link to="/shop" className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground font-mono">ORDER #{ord.id}</div>
                    <div className="text-sm text-muted-foreground">
                      Placed on {new Date(ord.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(ord.status)}
                    <span className="text-lg font-bold text-foreground">
                      {ord.total_amount.toLocaleString()} ETB
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">Shipping Address: </span>
                  {ord.shipping_address}
                </div>

                {ord.items && ord.items.length > 0 && (
                  <div className="bg-secondary/40 rounded-xl p-3 text-xs space-y-1.5">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-foreground">
                        <span>Product #{item.product_id} × {item.quantity}</span>
                        <span className="font-medium">{(item.price * item.quantity).toLocaleString()} ETB</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
