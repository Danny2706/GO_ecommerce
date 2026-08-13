import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useApp } from "../store/AppContext";
import { formatETB } from "../utils/format";

export default function CartDrawer() {
  const { cart, dispatch, totalItems, totalPrice } = useApp();

  if (!cart.isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
        onClick={() => dispatch({ type: "CLOSE_DRAWER" })}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">Your Cart</h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => dispatch({ type: "CLOSE_DRAWER" })}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingBag size={32} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Discover amazing Ethiopian products</p>
              </div>
              <Link
                to="/shop"
                onClick={() => dispatch({ type: "CLOSE_DRAWER" })}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Start Shopping <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <Link
                  to={`/product/${item.id}`}
                  onClick={() => dispatch({ type: "CLOSE_DRAWER" })}
                  className="w-20 h-24 rounded-xl overflow-hidden bg-secondary shrink-0"
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.id}`}
                    onClick={() => dispatch({ type: "CLOSE_DRAWER" })}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors leading-snug line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{item.seller}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    {/* Qty controls */}
                    <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                      <button
                        onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, quantity: item.quantity - 1 } })}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-foreground transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-mono font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, quantity: item.quantity + 1 } })}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-foreground transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {formatETB(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="px-6 py-5 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-mono font-semibold text-foreground text-lg">{formatETB(totalPrice)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={() => dispatch({ type: "CLOSE_DRAWER" })}
                className="flex items-center justify-center py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={() => dispatch({ type: "CLOSE_DRAWER" })}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Checkout <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
