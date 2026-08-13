import { useState } from "react";
import { Link } from "react-router";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import type { Product } from "../constants";
import { useApp } from "../store/AppContext";
import { formatETB, discount } from "../utils/format";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { dispatch } = useApp();
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    dispatch({ type: "ADD_ITEM", payload: product });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
    >
      {/* Image area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full ${
                product.badge === "Sale"
                  ? "bg-destructive text-destructive-foreground"
                  : product.badge === "New" || product.isNew
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.originalPrice && !product.badge && (
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-destructive text-destructive-foreground">
              -{discount(product.originalPrice, product.price)}%
            </span>
          )}
          {!product.inStock && (
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              Out of Stock
            </span>
          )}
        </div>

        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted((w) => !w); }}
            className={`w-9 h-9 flex items-center justify-center rounded-full border border-border backdrop-blur-sm transition-colors ${
              wishlisted ? "bg-destructive text-destructive-foreground border-destructive" : "bg-card/90 text-foreground hover:bg-secondary"
            }`}
          >
            <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
          </button>
          <Link
            to={`/product/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-card/90 border border-border backdrop-blur-sm hover:bg-secondary text-foreground transition-colors"
          >
            <Eye size={15} />
          </Link>
        </div>

        {/* Add to cart hover overlay */}
        {product.inStock && (
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                added
                  ? "bg-accent text-accent-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              <ShoppingCart size={15} />
              {added ? "Added!" : "Add to Cart"}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
          {product.location}
        </div>
        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-muted-foreground/40"}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="font-mono font-semibold text-foreground">
            {formatETB(product.price)}
          </span>
          {product.originalPrice && (
            <span className="font-mono text-xs text-muted-foreground line-through">
              {formatETB(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
