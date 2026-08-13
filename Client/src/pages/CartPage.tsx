import { Link } from "react-router";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from "lucide-react";
import { useApp } from "../store/AppContext";
import { formatETB } from "../utils/format";
import ProductCard from "../components/ProductCard";
import { PRODUCTS } from "../constants";

export default function CartPage() {
  const { cart, dispatch, totalItems, totalPrice } = useApp();
  const suggestions = PRODUCTS.filter((p) => !cart.items.find((i) => i.id === p.id)).slice(0, 4);
  const shipping = totalPrice >= 500 ? 0 : 80;
  const total = totalPrice + shipping;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-1">🛒 Shopping Cart</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            {totalItems === 0 ? "Your Cart" : `Your Cart (${totalItems})`}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {cart.items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Start shopping to fill it with amazing Ethiopian products</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Start Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-medium text-foreground">{totalItems} item{totalItems !== 1 ? "s" : ""}</h2>
                <button
                  onClick={() => dispatch({ type: "CLEAR_CART" })}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              </div>

              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-5 bg-card border border-border rounded-2xl p-4">
                  <Link to={`/product/${item.id}`} className="w-24 h-28 rounded-xl overflow-hidden bg-secondary shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-mono text-muted-foreground">{item.location}</div>
                        <Link to={`/product/${item.id}`} className="font-medium text-foreground hover:text-primary transition-colors text-sm leading-snug mt-0.5 block">
                          {item.name}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.seller}</div>
                      </div>
                      <button
                        onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                        <button
                          onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, quantity: item.quantity - 1 } })}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-foreground transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center font-mono font-semibold text-foreground text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, quantity: item.quantity + 1 } })}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-foreground transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-foreground">{formatETB(item.price * item.quantity)}</div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-muted-foreground font-mono">{formatETB(item.price)} each</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-5">
              {/* Promo code */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Tag size={15} className="text-primary" /> Promo Code
                </h3>
                <div className="flex gap-2">
                  <input
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                  />
                  <button className="px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Order summary */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-3.5">
                <h3 className="font-serif text-lg font-semibold text-foreground">Order Summary</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-mono">{formatETB(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className={`font-mono ${shipping === 0 ? "text-chart-3" : ""}`}>
                      {shipping === 0 ? "Free" : formatETB(shipping)}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <div className="text-xs text-chart-3 bg-chart-3/10 rounded-lg px-3 py-1.5 font-medium">
                      You qualify for free shipping!
                    </div>
                  )}
                  {shipping > 0 && (
                    <div className="text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-1.5">
                      Add {formatETB(500 - totalPrice)} more for free shipping
                    </div>
                  )}
                  <div className="border-t border-border pt-2.5 flex justify-between font-semibold text-foreground">
                    <span>Total</span>
                    <span className="font-mono text-lg">{formatETB(total)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors mt-2"
                >
                  Proceed to Checkout <ArrowRight size={15} />
                </Link>

                <Link
                  to="/shop"
                  className="w-full flex items-center justify-center py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Payment methods */}
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2 text-center">Secure payment via</p>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {["CBE Birr", "TeleBirr", "Amole", "Visa", "Mastercard"].map((m) => (
                      <span key={m} className="text-[10px] font-mono px-2.5 py-1 bg-secondary border border-border rounded text-muted-foreground">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-16">
            <div className="mb-6">
              <p className="text-xs font-mono text-primary uppercase tracking-widest mb-1">You might also like</p>
              <h2 className="font-serif text-2xl font-bold text-foreground">Recommended for You</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
