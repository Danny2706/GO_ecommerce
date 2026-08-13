import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, TrendingUp, Shield, Truck, RefreshCw, Star, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { CATEGORIES as STATIC_CATEGORIES, PRODUCTS, type Product } from "../constants";
import { formatETB } from "../utils/format";
import { useApp } from "../store/AppContext";
import { api, type BackendCategory } from "../services/api";
import { normalizeBackendProduct } from "../utils/productAdapter";

// PER USER REQUEST: Demo data is ONLY used on the hero page slider
const HERO_PRODUCTS = PRODUCTS.slice(0, 3);

const perks = [
  { icon: Truck, title: "Free Delivery", desc: "Orders above 500 ETB", color: "text-primary" },
  { icon: Shield, title: "Secure Payment", desc: "CBE Birr, TeleBirr, Amole", color: "text-accent" },
  { icon: RefreshCw, title: "Easy Returns", desc: "14-day return policy", color: "text-chart-3" },
  { icon: TrendingUp, title: "Best Prices", desc: "Guaranteed authentic goods", color: "text-primary" },
];

const CATEGORY_IMAGES: Record<string, { image: string; icon: string }> = {
  clothing: {
    image: "https://images.unsplash.com/photo-1598122666068-59b41e0a3193?w=400&h=300&fit=crop&auto=format",
    icon: "👗",
  },
  coffee: {
    image: "https://images.unsplash.com/photo-1540965555-ef9a836372ed?w=400&h=300&fit=crop&auto=format",
    icon: "☕",
  },
  spices: {
    image: "https://images.unsplash.com/photo-1784501025488-001592b6ee31?w=400&h=300&fit=crop&auto=format",
    icon: "🌶️",
  },
  handcrafts: {
    image: "https://images.unsplash.com/photo-1552710307-537199cd41c0?w=400&h=300&fit=crop&auto=format",
    icon: "🏺",
  },
  electronics: {
    image: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=400&h=300&fit=crop&auto=format",
    icon: "📱",
  },
  beauty: {
    image: "https://images.unsplash.com/photo-1633980990942-80e0da50977e?w=400&h=300&fit=crop&auto=format",
    icon: "✨",
  },
};

export default function HomePage() {
  const { lang } = useApp();
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Fetch categories and products from backend
    Promise.all([
      api.getCategories().catch(() => []),
      api.getProducts({ page_size: 20 }).catch(() => ({ items: [], total: 0, page: 1, page_size: 20 })),
    ]).then(([cats, res]) => {
      if (!isMounted) return;
      setCategories(cats);

      const normalized = (res.items || []).map((bp) => normalizeBackendProduct(bp, cats));
      setFeaturedProducts(normalized.slice(0, 8));
      setNewArrivals(normalized.slice(0, 4));
      setLoadingProducts(false);
    });

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO SECTION (USES DEMO DATA AS REQUESTED) ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1572851569977-e18b9ea6edbe?w=1600&h=900&fit=crop&auto=format"
            alt="Ethiopian market"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: copy */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-primary/20 border border-primary/30 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-primary font-medium tracking-wider uppercase">
                {lang === "en" ? "Ethiopia's Largest Online Market" : "የኢትዮጵያ ትልቁ የኦንላይን ገበያ"}
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl xl:text-7xl font-bold text-background leading-[1.05] tracking-tight">
              {lang === "en" ? (
                <>Where<br /><em className="text-primary not-italic">Ethiopia</em><br />Shops</>
              ) : (
                <>ኢትዮጵያ<br /><em className="text-primary not-italic">የምትገዛ</em><br />እዚህ ነው</>
              )}
            </h1>

            <p className="text-background/75 text-lg leading-relaxed max-w-md">
              Authentic Ethiopian crafts, premium coffee, traditional clothing, and more — delivered
              to your door anywhere in Ethiopia and beyond.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors text-sm shadow-lg shadow-primary/30"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link
                to="/shop?category=coffee"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-background/10 text-background border border-background/30 rounded-xl font-medium hover:bg-background/20 transition-colors text-sm backdrop-blur-sm"
              >
                Our Coffee <span className="text-lg">☕</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-2">
              {[
                { value: "50K+", label: "Products" },
                { value: "120K+", label: "Customers" },
                { value: "4.8★", label: "Rating" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-mono font-bold text-2xl text-background">{s.value}</div>
                  <div className="text-xs text-background/50 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating product cards (HERO DEMO PRODUCTS) */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {HERO_PRODUCTS.map((p, i) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className={`bg-card/80 backdrop-blur-md rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 transition-all group shadow-xl ${i === 0 ? "col-span-2" : ""}`}
              >
                <div className={`overflow-hidden bg-secondary ${i === 0 ? "h-44" : "h-32"}`}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3.5">
                  <div className="text-xs font-mono text-muted-foreground">{p.location}</div>
                  <div className="text-sm font-medium text-foreground mt-0.5 truncate">{p.name}</div>
                  <div className="font-mono text-sm font-bold text-primary mt-1">{formatETB(p.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERKS STRIP ── */}
      <section className="border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {perks.map((p) => (
              <div key={p.title} className="flex items-center gap-3.5 py-5 px-4 md:px-6">
                <div className={`shrink-0 w-10 h-10 rounded-xl bg-secondary flex items-center justify-center ${p.color}`}>
                  <p.icon size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DYNAMIC CATEGORIES FROM BACKEND ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Browse by</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              {lang === "en" ? "Categories" : "ምድቦች"}
            </h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all">
            View all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(categories.length > 0
            ? categories.map((cat) => ({
                id: cat.slug,
                name: cat.name,
                image: CATEGORY_IMAGES[cat.slug.toLowerCase()]?.image || "https://images.unsplash.com/photo-1572851569977-e18b9ea6edbe?w=400&h=300&fit=crop&auto=format",
                icon: CATEGORY_IMAGES[cat.slug.toLowerCase()]?.icon || "📦",
              }))
            : STATIC_CATEGORIES
          ).map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-3.5">
                <span className="text-2xl mb-1">{cat.icon}</span>
                <div className="text-background font-semibold text-sm leading-tight">
                  {cat.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DYNAMIC FEATURED PRODUCTS FROM BACKEND ── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Live Inventory</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Featured Products</h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all">
            View all <ChevronRight size={16} />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl h-72 border border-border p-3 space-y-3">
                <div className="bg-secondary h-44 rounded-xl" />
                <div className="bg-secondary h-4 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── PROMO BANNER: Coffee ── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="relative rounded-3xl overflow-hidden min-h-[340px] flex items-center">
          <img
            src="https://images.unsplash.com/photo-1540965555-ef9a836372ed?w=1400&h=500&fit=crop&auto=format"
            alt="Ethiopian coffee ceremony"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 to-foreground/20" />
          <div className="relative px-10 md:px-16 py-12 max-w-lg">
            <span className="inline-block text-xs font-mono text-primary uppercase tracking-widest mb-4 bg-primary/15 px-3 py-1 rounded-full">
              UNESCO Heritage
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-background mb-4 leading-tight">
              The Birthplace<br />of Coffee
            </h2>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              Ethiopia is where coffee was discovered. Our direct-trade beans come from Yirgacheffe,
              Sidama, and Harrar — the world's finest origins.
            </p>
            <Link
              to="/shop?category=coffee"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Explore Coffee <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DYNAMIC NEW ARRIVALS FROM BACKEND ── */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Just in</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">New Arrivals</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all">
              See all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── PROMO: Traditional Clothing ── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="relative rounded-3xl overflow-hidden min-h-[260px] flex items-end">
            <img
              src="https://images.unsplash.com/photo-1598122666068-59b41e0a3193?w=700&h=400&fit=crop&auto=format"
              alt="Habesha clothing"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
            <div className="relative p-7">
              <div className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Traditional Wear</div>
              <h3 className="font-serif text-2xl font-bold text-background mb-3">Habesha Kemis Collection</h3>
              <Link
                to="/shop?category=clothing"
                className="inline-flex items-center gap-2 text-sm text-background/80 hover:text-background transition-colors font-medium"
              >
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden min-h-[260px] flex items-end">
            <img
              src="https://images.unsplash.com/photo-1552710307-537199cd41c0?w=700&h=400&fit=crop&auto=format"
              alt="Ethiopian handcrafts"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
            <div className="relative p-7">
              <div className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Artisan Crafts</div>
              <h3 className="font-serif text-2xl font-bold text-background mb-3">Handwoven Textiles & Pottery</h3>
              <Link
                to="/shop?category=handcrafts"
                className="inline-flex items-center gap-2 text-sm text-background/80 hover:text-background transition-colors font-medium"
              >
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
