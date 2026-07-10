import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart, Heart, Search, User, Menu, X, Star, ChevronRight,
  ChevronLeft, Plus, Minus, Trash2, CreditCard, Lock, Check,
  Package, Truck, MapPin, ArrowRight, Filter, ChevronDown,
  Instagram, Twitter, Facebook, Youtube, Zap, Shield, RefreshCw,
  Bell, LogOut, Settings, Clock, Tag, Gift, Coffee
} from "lucide-react";

// ─── Tibeb Border (traditional Ethiopian woven pattern) ───────────────────────

function TibebBorder({ color = "#e8a020", thin = false }: { color?: string; thin?: boolean }) {
  const h = thin ? 8 : 14;
  const uid = color.replace("#", "") + h;
  return (
    <svg width="100%" height={h} viewBox={`0 0 64 ${h}`} preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
      <defs>
        <pattern id={`tibeb-${uid}`} x="0" y="0" width="8" height={h} patternUnits="userSpaceOnUse">
          {thin ? (
            <>
              <rect x="0" y="3" width="2" height="2" fill={color} opacity="0.9" />
              <rect x="3" y="0" width="2" height="2" fill={color} opacity="0.55" />
              <rect x="6" y="3" width="2" height="2" fill={color} opacity="0.9" />
            </>
          ) : (
            <>
              <polygon points="4,1 7,6 4,11 1,6" fill={color} opacity="0.85" />
              <rect x="0" y="6" width="1" height="5" fill={color} opacity="0.35" />
              <rect x="7" y="6" width="1" height="5" fill={color} opacity="0.35" />
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height={h} fill={`url(#tibeb-${uid})`} />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 1, name: "Habesha Kemis", slug: "kemis", image: "photo-1581044777550-4cfa60707c03", count: 148 },
  { id: 2, name: "Men's Gabi", slug: "gabi", image: "photo-1617137968427-85924c800a22", count: 94 },
  { id: 3, name: "Jewelry", slug: "jewelry", image: "photo-1599643478518-a784e5dc4c8f", count: 76 },
  { id: 4, name: "Leather Goods", slug: "leather", image: "photo-1548036328-c9fa89d128fa", count: 112 },
  { id: 5, name: "Coffee Sets", slug: "coffee", image: "photo-1495474472287-4d71bcdd2085", count: 58 },
  { id: 6, name: "Handwoven", slug: "handwoven", image: "photo-1611085583191-a3b181a88401", count: 84 },
];

const PRODUCTS = [
  {
    id: 1, name: "Selam Habesha Kemis", category: "Habesha Kemis", price: 189, originalPrice: 260,
    rating: 4.9, reviews: 214, badge: "Bestseller",
    image: "photo-1515886657613-9f3515b0c78f",
    images: ["photo-1515886657613-9f3515b0c78f", "photo-1469334031218-e382a71b716b"],
    colors: ["#f5e6c0", "#c0301a", "#1e6b30"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Handwoven in Addis Ababa. Fine cotton with traditional Tibeb border embroidery along the hem and sleeves. Each piece is unique — variations in pattern are a mark of authenticity.",
    inStock: true,
  },
  {
    id: 2, name: "Meskel Gold Cross Pendant", category: "Jewelry", price: 98, originalPrice: null,
    rating: 4.8, reviews: 187, badge: "New",
    image: "photo-1599643478518-a784e5dc4c8f",
    images: ["photo-1599643478518-a784e5dc4c8f", "photo-1515562141207-7a88fb7ce338"],
    colors: ["#e8a020", "#C0C0C0"],
    sizes: ["One Size"],
    description: "Lalibela-inspired cross design. Sterling silver with 18K gold vermeil. Hand-finished by artisans in Gondar. Comes in a handwoven gifting pouch.",
    inStock: true,
  },
  {
    id: 3, name: "Gabi Wrap — Men's", category: "Men's Gabi", price: 145, originalPrice: 195,
    rating: 4.7, reviews: 98, badge: "Sale",
    image: "photo-1617137968427-85924c800a22",
    images: ["photo-1617137968427-85924c800a22"],
    colors: ["#f5e6c0", "#1a1a1a", "#e8a020"],
    sizes: ["S/M", "L/XL", "XXL"],
    description: "Traditional heavy cotton Gabi with handwoven Tibeb stripes. Worn at ceremonies, kept for generations. Woven in the highlands of Wollo.",
    inStock: true,
  },
  {
    id: 4, name: "Addis Leather Tote", category: "Leather Goods", price: 210, originalPrice: null,
    rating: 4.9, reviews: 143, badge: null,
    image: "photo-1548036328-c9fa89d128fa",
    images: ["photo-1548036328-c9fa89d128fa", "photo-1590874103328-eac38a683ce7"],
    colors: ["#8B4513", "#1a1a1a", "#e8a020"],
    sizes: ["One Size"],
    description: "Hand-stitched full-grain leather from Kera tannery, Addis Ababa. Embossed with traditional patterns. Shoulder strap and interior pockets. Ages beautifully.",
    inStock: true,
  },
  {
    id: 5, name: "Jebena Coffee Set", category: "Coffee Sets", price: 78, originalPrice: null,
    rating: 5.0, reviews: 312, badge: "New",
    image: "photo-1495474472287-4d71bcdd2085",
    images: ["photo-1495474472287-4d71bcdd2085"],
    colors: ["#8B4513", "#1a1a1a"],
    sizes: ["6-Cup", "10-Cup"],
    description: "Hand-thrown clay Jebena (coffee pot) with 6 traditional Finjal cups. Painted with Ethio-geometric motifs. Fired in Addis. Ethiopia — the birthplace of coffee.",
    inStock: true,
  },
  {
    id: 6, name: "Injera Basket (Mesob)", category: "Handwoven", price: 55, originalPrice: 72,
    rating: 4.8, reviews: 89, badge: "Sale",
    image: "photo-1611085583191-a3b181a88401",
    images: ["photo-1611085583191-a3b181a88401"],
    colors: ["#e8a020", "#c0301a", "#1e6b30"],
    sizes: ["Small", "Medium", "Large"],
    description: "Traditionally woven Mesob from dyed grass and palm. Used as a dining table, storage, and décor. No two are identical. Crafted by women cooperatives in Harari Region.",
    inStock: true,
  },
  {
    id: 7, name: "Shuruba Beaded Necklace", category: "Jewelry", price: 64, originalPrice: null,
    rating: 4.6, reviews: 121, badge: null,
    image: "photo-1515562141207-7a88fb7ce338",
    images: ["photo-1515562141207-7a88fb7ce338"],
    colors: ["#e8a020", "#c0301a", "#1e6b30"],
    sizes: ["One Size"],
    description: "Handstrung glass seed beads in the colors of the Ethiopian flag. Traditional Shuruba style from the Omo Valley. Adjustable length.",
    inStock: true,
  },
  {
    id: 8, name: "Konso Leather Sandals", category: "Leather Goods", price: 92, originalPrice: null,
    rating: 4.5, reviews: 67, badge: null,
    image: "photo-1542291026-7eec264c27ff",
    images: ["photo-1542291026-7eec264c27ff"],
    colors: ["#8B4513", "#1a1a1a"],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43"],
    description: "Handmade in Konso. Vegetable-tanned cowhide sole and straps. Traditional cross-strap design updated for contemporary wear. Improve with every use.",
    inStock: true,
  },
];

const TESTIMONIALS = [
  { id: 1, name: "Tigist A.", location: "Addis Ababa, Ethiopia", rating: 5, text: "I ordered the Habesha Kemis for my sister's wedding and it was absolutely stunning. The Tibeb embroidery is so precise — you can feel the care in every stitch.", avatar: "photo-1494790108377-be9c29b29330" },
  { id: 2, name: "Dawit M.", location: "Washington DC, USA", rating: 5, text: "As an Ethiopian living abroad, DanShop lets me bring home to my family. The Jebena set arrived perfectly packaged — my mother cried happy tears.", avatar: "photo-1507003211169-0a1dd7228f2d" },
  { id: 3, name: "Rahel B.", location: "London, UK", rating: 5, text: "The leather tote is exceptional. Real Addis craftsmanship — not a factory imitation. I get compliments every single week. Already ordering my second.", avatar: "photo-1534528741775-53994a69daeb" },
];

type Page = "home" | "shop" | "product" | "cart" | "checkout" | "confirmation" | "account" | "wishlist";
type CheckoutStep = "shipping" | "payment" | "review";

interface CartItem {
  product: typeof PRODUCTS[0];
  quantity: number;
  size: string;
  color: string;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function formatCardNumber(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val: string) {
  const d = val.replace(/\D/g, "").slice(0, 4);
  if (d.length >= 3) return d.slice(0, 2) + "/" + d.slice(2);
  return d;
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? "#e8a020" : "none"} stroke={i <= Math.round(rating) ? "#e8a020" : "#a07840"} />
      ))}
    </div>
  );
}

function Countdown() {
  const [time, setTime] = useState({ h: 4, m: 22, s: 18 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) return { h: 4, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-card text-primary px-2 py-0.5 rounded-sm font-bold">{v}</span>
          {i < 2 && <span className="text-muted-foreground">:</span>}
        </span>
      ))}
    </div>
  );
}

function ProductCard({ product, onView, onAddToCart, wishlist, onToggleWishlist }: {
  product: typeof PRODUCTS[0]; onView: () => void; onAddToCart: () => void;
  wishlist: number[]; onToggleWishlist: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isWished = wishlist.includes(product.id);
  return (
    <div
      className="group relative bg-card border border-border overflow-hidden cursor-pointer transition-all duration-500"
      style={{ transform: hovered ? "translateY(-4px)" : "none", boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.6)" : "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onView}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-secondary">
        <img src={`https://images.unsplash.com/photo-${product.image}?w=600&h=800&fit=crop&auto=format`} alt={product.name} className="w-full h-full object-cover transition-transform duration-700" style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }} />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.badge && (
          <span className={`absolute top-3 left-3 text-xs font-mono font-medium px-2.5 py-1 tracking-widest uppercase ${product.badge === "Sale" ? "bg-red-800 text-yellow-100" : product.badge === "New" ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}`}>
            {product.badge}
          </span>
        )}
        <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-card/80 backdrop-blur-sm border border-border transition-all hover:bg-card">
          <Heart size={14} fill={isWished ? "#e8a020" : "none"} stroke={isWished ? "#e8a020" : "#a07840"} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <TibebBorder color="#e8a020" thin />
          <button onClick={(e) => { e.stopPropagation(); onAddToCart(); }} className="w-full py-2.5 text-xs font-mono font-medium tracking-widest uppercase" style={{ backgroundColor: "#e8a020", color: "#140800" }}>
            Quick Add
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-1">{product.category}</p>
        <h3 className="text-foreground text-base mb-2 leading-tight font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-primary font-mono font-semibold">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="text-muted-foreground text-xs font-mono line-through">{formatPrice(product.originalPrice)}</span>}
          </div>
          <div className="flex items-center gap-1.5">
            <Stars rating={product.rating} size={11} />
            <span className="text-muted-foreground text-xs font-mono">({product.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartSidebar({ open, onClose, cart, onUpdateQty, onRemove, onCheckout }: {
  open: boolean; onClose: () => void; cart: CartItem[];
  onUpdateQty: (id: number, size: string, delta: number) => void;
  onRemove: (id: number, size: string) => void; onCheckout: () => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  return (
    <>
      <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col transition-transform duration-400 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <TibebBorder color="#e8a020" />
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>Your Basket</h2>
            <p className="text-muted-foreground text-xs font-mono mt-0.5">{cart.length} {cart.length === 1 ? "item" : "items"}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingCart size={48} className="text-muted-foreground opacity-20" />
              <p className="text-muted-foreground text-lg" style={{ fontFamily: "'Fraunces', serif" }}>Your basket is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                <div className="w-20 h-24 bg-secondary flex-shrink-0 overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-${item.product.image}?w=160&h=192&fit=crop&auto=format`} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium leading-tight mb-1">{item.product.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono mb-3">Size: {item.size}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-border">
                      <button onClick={() => onUpdateQty(item.product.id, item.size, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-secondary transition-colors"><Minus size={12} /></button>
                      <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.product.id, item.size, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-secondary transition-colors"><Plus size={12} /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-primary font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                      <button onClick={() => onRemove(item.product.id, item.size)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <TibebBorder color="#e8a020" thin />
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="font-mono text-primary text-xs tracking-wider">Calculated at checkout</span></div>
              <div className="flex justify-between font-semibold pt-2 border-t border-border"><span>Total</span><span className="font-mono text-primary text-lg">{formatPrice(subtotal)}</span></div>
            </div>
            <button onClick={onCheckout} className="w-full py-3.5 text-sm font-mono font-medium tracking-widest uppercase" style={{ backgroundColor: "#e8a020", color: "#140800" }}>Proceed to Checkout</button>
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5"><Lock size={10} /> Secure checkout · SSL encrypted</p>
          </div>
        )}
      </div>
    </>
  );
}

function ProductDetail({ product, onBack, onAddToCart, wishlist, onToggleWishlist }: {
  product: typeof PRODUCTS[0]; onBack: () => void;
  onAddToCart: (size: string, color: string) => void;
  wishlist: number[]; onToggleWishlist: (id: number) => void;
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const isWished = wishlist.includes(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-mono mb-8"><ChevronLeft size={16} /> Back to Shop</button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-3">
            <div className="aspect-[3/4] bg-secondary overflow-hidden relative">
              <img src={`https://images.unsplash.com/photo-${product.images[activeImg]}?w=800&h=1067&fit=crop&auto=format`} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0"><TibebBorder color="#e8a020" /></div>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-24 bg-secondary overflow-hidden border-2 transition-colors ${i === activeImg ? "border-primary" : "border-transparent"}`}>
                    <img src={`https://images.unsplash.com/photo-${img}?w=160&h=192&fit=crop&auto=format`} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="py-4">
            <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">{product.category}</p>
            <h1 className="text-4xl font-semibold leading-tight mb-4" style={{ fontFamily: "'Fraunces', serif" }}>{product.name}</h1>
            <div className="flex items-center gap-3 mb-6"><Stars rating={product.rating} size={15} /><span className="text-muted-foreground text-sm font-mono">{product.reviews} reviews</span></div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-mono text-primary font-semibold">{formatPrice(product.price)}</span>
              {product.originalPrice && (<><span className="text-muted-foreground font-mono line-through text-lg">{formatPrice(product.originalPrice)}</span><span className="text-xs font-mono bg-red-900/40 text-red-400 px-2 py-0.5">−{discount}%</span></>)}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{product.description}</p>
            <TibebBorder color="#e8a020" thin />
            <div className="mt-6 mb-6">
              <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-3">Color</p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)} className="w-8 h-8 rounded-full border-2 transition-all" style={{ backgroundColor: c, borderColor: selectedColor === c ? "#e8a020" : "transparent", outline: selectedColor === c ? "1px solid rgba(232,160,32,0.5)" : "none", outlineOffset: "2px" }} />
                ))}
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground">Size</p>
                <button className="text-xs text-primary font-mono underline underline-offset-2">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`px-3 py-2 text-xs font-mono border transition-all ${selectedSize === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground/40"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mb-6">
              <button onClick={() => { onAddToCart(selectedSize, selectedColor); setAdded(true); setTimeout(() => setAdded(false), 2000); }}
                className="flex-1 py-4 text-sm font-mono font-medium tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: added ? "#1e6b30" : "#e8a020", color: added ? "#f5e6c0" : "#140800" }}>
                {added ? <><Check size={16} /> Added!</> : "Add to Basket"}
              </button>
              <button onClick={() => onToggleWishlist(product.id)} className="w-14 border border-border flex items-center justify-center hover:border-primary transition-colors">
                <Heart size={18} fill={isWished ? "#e8a020" : "none"} stroke={isWished ? "#e8a020" : "#a07840"} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border">
              {[{ icon: <Truck size={15} />, label: "Free Shipping", sub: "Orders over $100" }, { icon: <RefreshCw size={15} />, label: "Free Returns", sub: "30-day window" }, { icon: <Shield size={15} />, label: "Handmade", sub: "Certified artisan" }].map(f => (
                <div key={f.label} className="text-center">
                  <div className="flex justify-center text-primary mb-1.5">{f.icon}</div>
                  <p className="text-xs font-medium">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Checkout({ cart, onComplete, onBack }: { cart: CartItem[]; onComplete: (n: string) => void; onBack: () => void }) {
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [processing, setProcessing] = useState(false);
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 12;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;
  const [sf, setSf] = useState({ firstName: "Dawit", lastName: "Mengistu", email: "d.mengistu@email.com", phone: "+1 (202) 555-0193", address: "2020 16th Street NW", apt: "Apt 3A", city: "Washington", state: "DC", zip: "20009", country: "United States" });
  const [pf, setPf] = useState({ cardNumber: "", expiry: "", cvv: "", name: "Dawit Mengistu", method: "card" as "card" | "applepay" | "googlepay" });
  const steps = [{ key: "shipping", label: "Shipping" }, { key: "payment", label: "Payment" }, { key: "review", label: "Review" }] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-mono mb-8"><ChevronLeft size={16} /> Continue Shopping</button>
        <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Checkout</h1>
        <TibebBorder color="#e8a020" />
        <div className="flex items-center gap-0 my-8">
          {steps.map((s, i) => {
            const done = steps.findIndex(x => x.key === step) > i;
            const active = s.key === step;
            return (
              <div key={s.key} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase ${active ? "text-primary" : done ? "text-muted-foreground" : "text-muted-foreground/30"}`}>
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${done ? "bg-primary text-primary-foreground" : active ? "bg-primary/20 text-primary border border-primary" : "border border-muted-foreground/30"}`}>{done ? <Check size={10} /> : i + 1}</span>
                  {s.label}
                </div>
                {i < steps.length - 1 && <ChevronRight size={14} className="text-muted-foreground/30 mx-1" />}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <div className="bg-card border border-border p-6">
                <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: "'Fraunces', serif" }}>Shipping Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[{ key: "firstName", label: "First Name", col: 1 }, { key: "lastName", label: "Last Name", col: 1 }, { key: "email", label: "Email Address", col: 2 }, { key: "phone", label: "Phone", col: 2 }, { key: "address", label: "Street Address", col: 2 }, { key: "apt", label: "Apt / Suite (optional)", col: 2 }, { key: "city", label: "City", col: 1 }, { key: "state", label: "State", col: 1 }, { key: "zip", label: "ZIP Code", col: 1 }, { key: "country", label: "Country", col: 1 }].map(({ key, label, col }) => (
                    <div key={key} className={col === 2 ? "col-span-2" : "col-span-1"}>
                      <label className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-1.5">{label}</label>
                      <input type="text" value={sf[key as keyof typeof sf]} onChange={e => setSf(f => ({ ...f, [key]: e.target.value }))} className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep("payment")} className="w-full mt-6 py-3.5 text-sm font-mono font-medium tracking-widest uppercase" style={{ backgroundColor: "#e8a020", color: "#140800" }}>Continue to Payment</button>
              </div>
            )}
            {step === "payment" && (
              <div className="bg-card border border-border p-6">
                <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: "'Fraunces', serif" }}>Payment Method</h2>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[{ key: "applepay" as const, label: " Pay" }, { key: "googlepay" as const, label: "G Pay" }].map(({ key, label }) => (
                    <button key={key} onClick={() => setPf(f => ({ ...f, method: key }))} className={`py-3 border text-sm font-mono transition-colors flex items-center justify-center ${pf.method === key ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-foreground/30"}`}>{label}</button>
                  ))}
                </div>
                <div className="relative mb-6 flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-mono">OR PAY WITH CARD</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <button onClick={() => setPf(f => ({ ...f, method: "card" }))} className={`w-full text-left p-4 border mb-4 transition-colors ${pf.method === "card" ? "border-primary" : "border-border"}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard size={16} className="text-primary" />
                    <span className="text-sm font-medium">Credit / Debit Card</span>
                    <div className="ml-auto flex gap-1.5">{["VISA", "MC", "AMEX"].map(c => <span key={c} className="text-xs font-mono border border-border px-1.5 py-0.5 text-muted-foreground">{c}</span>)}</div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-1.5">Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" value={pf.cardNumber} onChange={e => setPf(f => ({ ...f, cardNumber: formatCardNumber(e.target.value) }))} className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-1.5">Expiry</label>
                        <input type="text" placeholder="MM/YY" value={pf.expiry} onChange={e => setPf(f => ({ ...f, expiry: formatExpiry(e.target.value) }))} className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono" />
                      </div>
                      <div>
                        <label className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-1.5">CVV</label>
                        <input type="password" placeholder="•••" maxLength={4} value={pf.cvv} onChange={e => setPf(f => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono" />
                      </div>
                      <div>
                        <label className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-1.5">Name</label>
                        <input type="text" value={pf.name} onChange={e => setPf(f => ({ ...f, name: e.target.value }))} className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </button>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-5"><Lock size={11} /> Payments processed securely via 256-bit SSL.</p>
                <div className="flex gap-3">
                  <button onClick={() => setStep("shipping")} className="px-6 py-3.5 border border-border text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">Back</button>
                  <button onClick={() => setStep("review")} className="flex-1 py-3.5 text-sm font-mono font-medium tracking-widest uppercase" style={{ backgroundColor: "#e8a020", color: "#140800" }}>Review Order</button>
                </div>
              </div>
            )}
            {step === "review" && (
              <div className="bg-card border border-border p-6">
                <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: "'Fraunces', serif" }}>Review & Place Order</h2>
                <div className="space-y-4 mb-6">
                  {[{ title: "Shipping to", lines: [`${sf.firstName} ${sf.lastName}`, `${sf.address}${sf.apt ? ", " + sf.apt : ""}`, `${sf.city}, ${sf.state} ${sf.zip}`, sf.email] }, { title: "Payment", lines: [pf.method === "card" ? `Card ending ${pf.cardNumber.slice(-4) || "••••"}` : pf.method === "applepay" ? " Pay" : "G Pay"] }].map(({ title, lines }) => (
                    <div key={title} className="p-4 bg-secondary/50 border border-border">
                      <p className="text-xs font-mono tracking-wider uppercase text-muted-foreground mb-2">{title}</p>
                      {lines.map((l, i) => <p key={i} className="text-sm">{l}</p>)}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep("payment")} className="px-6 py-3.5 border border-border text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">Back</button>
                  <button onClick={() => { setProcessing(true); setTimeout(() => { onComplete("DAN-" + Math.floor(100000 + Math.random() * 900000)); }, 2200); }}
                    disabled={processing} className="flex-1 py-3.5 text-sm font-mono font-medium tracking-widest uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    style={{ backgroundColor: "#e8a020", color: "#140800" }}>
                    {processing ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Processing...</span> : <><Lock size={14} /> Place Order · {formatPrice(total)}</>}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-card border border-border overflow-hidden sticky top-6">
              <TibebBorder color="#e8a020" />
              <div className="p-5">
                <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                      <div className="relative w-14 h-16 bg-secondary flex-shrink-0">
                        <img src={`https://images.unsplash.com/photo-${item.product.image}?w=112&h=128&fit=crop&auto=format`} alt={item.product.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full font-mono font-bold">{item.quantity}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium leading-tight">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">Size: {item.size}</p>
                        <p className="text-xs font-mono text-primary mt-1">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  {[["Subtotal", formatPrice(subtotal)], ["Shipping", shipping === 0 ? "Free" : formatPrice(shipping)], ["Tax (8%)", formatPrice(tax)]].map(([l, v]) => (
                    <div key={l} className="flex justify-between text-sm"><span className="text-muted-foreground">{l}</span><span className="font-mono">{v}</span></div>
                  ))}
                  <div className="flex justify-between font-semibold pt-2 border-t border-border"><span>Total</span><span className="font-mono text-primary">{formatPrice(total)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderConfirmation({ orderNum, onContinue }: { orderNum: string; onContinue: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "rgba(232,160,32,0.1)" }}>
          <Check size={36} className="text-primary" />
        </div>
        <TibebBorder color="#e8a020" />
        <div className="py-6">
          <h1 className="text-4xl font-semibold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Amasegenallo!</h1>
          <p className="text-muted-foreground text-sm mb-1 italic" style={{ fontFamily: "'Fraunces', serif" }}>( አመሰግናለሁ — Thank you, in Amharic)</p>
          <p className="text-muted-foreground mt-4 mb-2">Your order has been confirmed.</p>
          <p className="text-sm font-mono text-primary mb-8">Order #{orderNum}</p>
        </div>
        <TibebBorder color="#e8a020" />
        <div className="bg-card border border-border p-6 mt-6 mb-8 text-left space-y-4">
          {[{ icon: <Package size={16} className="text-primary" />, title: "Preparing your order", sub: "Our artisans are carefully packing your items" }, { icon: <Truck size={16} className="text-primary" />, title: "Estimated delivery: 5–8 business days", sub: "Tracking number will be emailed shortly" }, { icon: <Bell size={16} className="text-primary" />, title: "Email confirmation sent", sub: "Check your inbox for your order receipt" }].map(({ icon, title, sub }) => (
            <div key={title} className="flex gap-3">
              <div className="mt-0.5">{icon}</div>
              <div><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground mt-0.5">{sub}</p></div>
            </div>
          ))}
        </div>
        <button onClick={onContinue} className="px-8 py-3.5 text-sm font-mono font-medium tracking-widest uppercase" style={{ backgroundColor: "#e8a020", color: "#140800" }}>Continue Shopping</button>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([2, 5]);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [orderNum, setOrderNum] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const addToCart = (product: typeof PRODUCTS[0], size: string, color: string) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id && i.size === size);
      if (ex) return prev.map(i => i.product.id === product.id && i.size === size ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1, size, color }];
    });
    setCartOpen(true);
  };
  const updateQty = (id: number, size: string, delta: number) => setCart(prev => prev.map(i => i.product.id === id && i.size === size ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  const removeFromCart = (id: number, size: string) => setCart(prev => prev.filter(i => !(i.product.id === id && i.size === size)));
  const toggleWishlist = (id: number) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const viewProduct = (product: typeof PRODUCTS[0]) => { setSelectedProduct(product); setPage("product"); window.scrollTo(0, 0); };

  const filtered = PRODUCTS.filter(p => {
    const matchCat = filterCategory === "All" || p.category === filterCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => sortBy === "price-asc" ? a.price - b.price : sortBy === "price-desc" ? b.price - a.price : sortBy === "rating" ? b.rating - a.rating : 0);

  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  const navLinks = [
    { label: "Shop", cat: "All" },
    { label: "Kemis", cat: "Habesha Kemis" },
    { label: "Jewelry", cat: "Jewelry" },
    { label: "Leather", cat: "Leather Goods" },
    { label: "Coffee", cat: "Coffee Sets" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      {/* Ethiopian flag stripe */}
      <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, #1e6b30 33.3%, #e8a020 33.3% 66.6%, #c0301a 66.6%)" }} />

      {/* Announcement */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-xs font-mono tracking-widest uppercase">
        <span className="flex items-center justify-center gap-2">
          <Coffee size={11} />
          Handcrafted in Ethiopia · Free shipping on orders over $100 · Authentic artisan goods
          <Coffee size={11} />
        </span>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => { setPage("home"); setSelectedProduct(null); }} className="flex flex-col leading-none">
            <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Fraunces', serif", color: "#e8a020" }}>DanShop</span>
            <span className="text-xs font-mono tracking-[0.3em] text-muted-foreground uppercase" style={{ fontSize: "9px" }}>Addis Ababa · Est. 2018</span>
          </button>
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(({ label, cat }) => (
              <button key={label} onClick={() => { setPage("shop"); setFilterCategory(cat); }} className="text-xs font-mono tracking-widest uppercase transition-colors hover:text-primary text-muted-foreground">{label}</button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(v => !v)} className="text-muted-foreground hover:text-foreground transition-colors"><Search size={18} /></button>
            <button onClick={() => setPage("wishlist")} className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Heart size={18} />
              {wishlist.length > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-mono font-bold">{wishlist.length}</span>}
            </button>
            <button onClick={() => setPage("account")} className="hidden md:block text-muted-foreground hover:text-foreground transition-colors"><User size={18} /></button>
            <button onClick={() => setCartOpen(true)} className="relative text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-mono font-bold">{cartCount}</span>}
            </button>
            <button onClick={() => setMobileMenu(v => !v)} className="md:hidden text-muted-foreground">{mobileMenu ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        {searchOpen && (
          <div className="border-t border-border px-6 py-3 bg-background">
            <div className="max-w-xl mx-auto relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input ref={searchRef} type="text" placeholder="Search products..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage("shop"); }} className="w-full bg-input-background border border-border pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>
        )}
        {mobileMenu && (
          <div className="md:hidden border-t border-border bg-card p-6 space-y-4">
            {navLinks.map(({ label }) => (
              <button key={label} onClick={() => { setPage("shop"); setMobileMenu(false); }} className="block w-full text-left text-sm font-mono tracking-wider text-muted-foreground hover:text-foreground transition-colors py-1">{label}</button>
            ))}
          </div>
        )}
      </nav>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} onUpdateQty={updateQty} onRemove={removeFromCart} onCheckout={() => { setCartOpen(false); setPage("checkout"); }} />

      {page === "product" && selectedProduct ? (
        <ProductDetail product={selectedProduct} onBack={() => setPage("shop")} onAddToCart={(size, color) => addToCart(selectedProduct, size, color)} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
      ) : page === "checkout" ? (
        <Checkout cart={cart} onComplete={(n) => { setOrderNum(n); setCart([]); setPage("confirmation"); }} onBack={() => setPage("shop")} />
      ) : page === "confirmation" ? (
        <OrderConfirmation orderNum={orderNum} onContinue={() => setPage("home")} />
      ) : page === "account" ? (
        <AccountPage onBack={() => setPage("home")} />
      ) : page === "wishlist" ? (
        <WishlistPage wishlist={wishlist} products={PRODUCTS} onViewProduct={viewProduct} onRemoveWishlist={toggleWishlist} onAddToCart={(p) => addToCart(p, p.sizes[0], p.colors[0])} onBack={() => setPage("home")} />
      ) : page === "shop" ? (
        <ShopPage products={filtered} allProducts={PRODUCTS} filterCategory={filterCategory} setFilterCategory={setFilterCategory} sortBy={sortBy} setSortBy={setSortBy} filterOpen={filterOpen} setFilterOpen={setFilterOpen} onViewProduct={viewProduct} onAddToCart={(p) => addToCart(p, p.sizes[0], p.colors[0])} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
      ) : (
        <HomePage onShop={() => setPage("shop")} onViewProduct={viewProduct} onAddToCart={(p) => addToCart(p, p.sizes[0], p.colors[0])} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
      )}

      <Footer onNavigate={(p) => setPage(p as Page)} />
    </div>
  );
}

function HomePage({ onShop, onViewProduct, onAddToCart, wishlist, onToggleWishlist }: {
  onShop: () => void; onViewProduct: (p: typeof PRODUCTS[0]) => void;
  onAddToCart: (p: typeof PRODUCTS[0]) => void; wishlist: number[]; onToggleWishlist: (id: number) => void;
}) {
  const [heroImg, setHeroImg] = useState(0);
  const heroImages = [
    { id: "photo-1583172332547-c769b98d5de3", text: "Rooted in Tradition" },
    { id: "photo-1469334031218-e382a71b716b", text: "Worn with Pride" },
    { id: "photo-1527799820374-dcf8d9d4a388", text: "Made by Hands" },
  ];
  useEffect(() => { const t = setInterval(() => setHeroImg(i => (i + 1) % heroImages.length), 5500); return () => clearInterval(t); }, []);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        {heroImages.map((img, i) => (
          <div key={img.id} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: i === heroImg ? 1 : 0 }}>
            <img src={`https://images.unsplash.com/${img.id}?w=1920&h=1080&fit=crop&auto=format`} alt={img.text} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(20,8,0,0.88) 0%, rgba(20,8,0,0.45) 60%, transparent 100%)" }} />
          </div>
        ))}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(to right, #1e6b30 33.3%, #e8a020 33.3% 66.6%, #c0301a 66.6%)" }} />
        <div className="relative z-10 h-full flex items-center px-8 md:px-16 max-w-7xl mx-auto">
          <div className="max-w-xl">
            <p className="text-xs font-mono tracking-[0.4em] text-primary uppercase mb-4">Ethiopian Artisan Marketplace</p>
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-[0.95] mb-5" style={{ fontFamily: "'Fraunces', serif" }}>
              Crafted in<br />
              <em style={{ color: "#e8a020" }}>Ethiopia,</em><br />
              Worn Worldwide
            </h1>
            <p className="text-white/70 text-base mb-8 leading-relaxed max-w-sm">
              Handwoven Kemis, traditional Jebenas, leather goods from Addis — authentic Ethiopian craftsmanship, delivered to your door.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={onShop} className="px-8 py-3.5 text-sm font-mono font-medium tracking-widest uppercase transition-all hover:brightness-110" style={{ backgroundColor: "#e8a020", color: "#140800" }}>Shop Now</button>
              <button className="text-white text-sm font-mono tracking-wider uppercase flex items-center gap-2 hover:text-primary transition-colors">Our Story <ArrowRight size={14} /></button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroImg(i)} className="transition-all duration-300" style={{ width: i === heroImg ? "24px" : "8px", height: "2px", backgroundColor: i === heroImg ? "#e8a020" : "rgba(255,255,255,0.4)" }} />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10"><TibebBorder color="#e8a020" /></div>
      </section>

      {/* Flash Sale */}
      <section className="bg-secondary border-y border-border py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Tag size={18} className="text-primary" />
            <div>
              <p className="text-lg font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>Timkat Festival Sale</p>
              <p className="text-xs text-muted-foreground font-mono">Selected traditional items up to 35% off · Limited quantities</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-mono mb-1">Ends in</p>
              <Countdown />
            </div>
            <button onClick={onShop} className="px-5 py-2.5 border border-primary text-primary text-xs font-mono tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all">Shop Sale</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-3">
            <p className="text-xs font-mono tracking-[0.4em] text-muted-foreground uppercase mb-2">Explore</p>
            <h2 className="text-3xl font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>Shop by Category</h2>
          </div>
          <TibebBorder color="#e8a020" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
            {CATEGORIES.map(cat => (
              <button key={cat.id} className="group relative aspect-square overflow-hidden bg-secondary" onClick={onShop}>
                <img src={`https://images.unsplash.com/photo-${cat.image}?w=300&h=300&fit=crop&auto=format`} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/65 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-white font-semibold text-sm text-center px-2 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>{cat.name}</p>
                  <p className="text-white/60 text-xs font-mono mt-0.5">{cat.count} items</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"><TibebBorder color="#e8a020" thin /></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-4 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs font-mono tracking-[0.4em] text-muted-foreground uppercase mb-2">Handpicked</p>
              <h2 className="text-3xl font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>Featured Pieces</h2>
            </div>
            <button onClick={onShop} className="text-xs font-mono tracking-wider uppercase text-primary flex items-center gap-1.5 hover:gap-3 transition-all">View All <ArrowRight size={12} /></button>
          </div>
          <TibebBorder color="#e8a020" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {PRODUCTS.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} onView={() => onViewProduct(p)} onAddToCart={() => onAddToCart(p)} wishlist={wishlist} onToggleWishlist={() => onToggleWishlist(p.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* Split Banner */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
        {[
          { image: "photo-1583172332547-c769b98d5de3", label: "Traditional Wear", title: "Habesha Kemis", sub: "Handwoven with generations of craft" },
          { image: "photo-1495474472287-4d71bcdd2085", label: "Coffee Culture", title: "The Jebena Ceremony", sub: "Ethiopia — birthplace of coffee" },
        ].map(({ image, label, title, sub }) => (
          <button key={title} onClick={onShop} className="group relative overflow-hidden h-80 md:h-auto">
            <img src={`https://images.unsplash.com/${image}?w=800&h=600&fit=crop&auto=format`} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"><TibebBorder color="#e8a020" /></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-mono tracking-[0.4em] text-primary uppercase mb-3">{label}</p>
              <h3 className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Fraunces', serif" }}>{title}</h3>
              <p className="text-white/70 text-sm mb-5">{sub}</p>
              <span className="text-xs font-mono tracking-widest uppercase text-white border-b border-primary pb-0.5 group-hover:text-primary transition-colors">Shop Now</span>
            </div>
          </button>
        ))}
      </section>

      {/* Artisan Story */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=700&h=500&fit=crop&auto=format" alt="Ethiopian artisan" className="w-full aspect-[4/3] object-cover" />
            <div className="absolute bottom-0 left-0 right-0"><TibebBorder color="#e8a020" /></div>
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 font-mono text-xs tracking-widest uppercase font-bold">Made in Ethiopia</div>
          </div>
          <div>
            <p className="text-xs font-mono tracking-[0.4em] text-muted-foreground uppercase mb-3">Our Mission</p>
            <h2 className="text-4xl font-semibold mb-5 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>Connecting Artisans<br />to the World</h2>
            <p className="text-muted-foreground leading-relaxed mb-4 text-sm">DanShop was founded in Addis Ababa in 2018 with one mission: to bring authentic Ethiopian craftsmanship to a global audience while ensuring fair wages for the artisans who create it.</p>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm">Every Habesha Kemis, leather bag, and Jebena coffee set is made by hand in Ethiopia — by weavers in Wollo, leather workers from Kera, and pottery cooperatives in Dorze.</p>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              {[["400+", "Artisans"], ["12", "Regions"], ["50K+", "Items Sold"]].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="text-2xl font-bold text-primary font-mono">{n}</p>
                  <p className="text-xs text-muted-foreground mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-secondary/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-xs font-mono tracking-[0.4em] text-muted-foreground uppercase mb-2">Reviews</p>
            <h2 className="text-3xl font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>From Our Community</h2>
          </div>
          <TibebBorder color="#e8a020" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="bg-card border border-border p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0"><TibebBorder color="#c0301a" thin /></div>
                <Stars rating={t.rating} size={14} />
                <p className="text-muted-foreground text-sm leading-relaxed mt-4 mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={`https://images.unsplash.com/${t.avatar}?w=80&h=80&fit=crop&auto=format`} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary" />
                  <div><p className="text-sm font-medium">{t.name}</p><p className="text-xs text-muted-foreground font-mono">{t.location}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{ icon: <Truck size={24} />, title: "Free Shipping", sub: "On orders over $100" }, { icon: <RefreshCw size={24} />, title: "30-Day Returns", sub: "Easy exchanges" }, { icon: <Shield size={24} />, title: "100% Authentic", sub: "Certified handmade" }, { icon: <Gift size={24} />, title: "Artisan Packaging", sub: "Gift-ready by default" }].map(({ icon, title, sub }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2 py-4">
              <div className="text-primary mb-1">{icon}</div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      <NewsletterSection />
    </main>
  );
}

function ShopPage({ products, allProducts, filterCategory, setFilterCategory, sortBy, setSortBy, filterOpen, setFilterOpen, onViewProduct, onAddToCart, wishlist, onToggleWishlist }: {
  products: typeof PRODUCTS; allProducts: typeof PRODUCTS;
  filterCategory: string; setFilterCategory: (c: string) => void;
  sortBy: string; setSortBy: (s: string) => void;
  filterOpen: boolean; setFilterOpen: (v: boolean) => void;
  onViewProduct: (p: typeof PRODUCTS[0]) => void; onAddToCart: (p: typeof PRODUCTS[0]) => void;
  wishlist: number[]; onToggleWishlist: (id: number) => void;
}) {
  const categories = ["All", ...Array.from(new Set(allProducts.map(p => p.category)))];
  return (
    <div className="min-h-screen">
      <div className="border-b border-border py-6 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <TibebBorder color="#e8a020" />
          <div className="mt-4">
            <h1 className="text-4xl font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>{filterCategory === "All" ? "All Products" : filterCategory}</h1>
            <p className="text-muted-foreground text-sm mt-1 font-mono">{products.length} handcrafted items</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setFilterCategory(c)} className={`px-4 py-1.5 text-xs font-mono tracking-wider uppercase border transition-all ${filterCategory === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-foreground/40"}`}>{c}</button>
            ))}
          </div>
          <div className="ml-auto">
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none bg-input-background border border-border px-3 py-2 text-xs font-mono text-foreground pr-8 focus:outline-none focus:border-primary cursor-pointer">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Best Rated</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-24"><p className="text-muted-foreground text-lg" style={{ fontFamily: "'Fraunces', serif" }}>No products found</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} onView={() => onViewProduct(p)} onAddToCart={() => onAddToCart(p)} wishlist={wishlist} onToggleWishlist={() => onToggleWishlist(p.id)} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function WishlistPage({ wishlist, products, onViewProduct, onRemoveWishlist, onAddToCart, onBack }: {
  wishlist: number[]; products: typeof PRODUCTS; onViewProduct: (p: typeof PRODUCTS[0]) => void;
  onRemoveWishlist: (id: number) => void; onAddToCart: (p: typeof PRODUCTS[0]) => void; onBack: () => void;
}) {
  const wished = products.filter(p => wishlist.includes(p.id));
  return (
    <div className="min-h-screen">
      <div className="border-b border-border py-8 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground text-sm font-mono flex items-center gap-1.5 mb-3"><ChevronLeft size={14} /> Back</button>
          <h1 className="text-4xl font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>Saved Items</h1>
          <p className="text-muted-foreground text-sm mt-1 font-mono">{wished.length} items saved</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {wished.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={48} className="text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-xl text-muted-foreground" style={{ fontFamily: "'Fraunces', serif" }}>Nothing saved yet</p>
            <button onClick={onBack} className="mt-4 text-primary text-sm font-mono underline underline-offset-2">Browse Products</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {wished.map(p => (
              <div key={p.id} className="bg-card border border-border overflow-hidden">
                <div className="relative aspect-[3/4] bg-secondary overflow-hidden cursor-pointer" onClick={() => onViewProduct(p)}>
                  <img src={`https://images.unsplash.com/photo-${p.image}?w=400&h=533&fit=crop&auto=format`} alt={p.name} className="w-full h-full object-cover" />
                  <button onClick={e => { e.stopPropagation(); onRemoveWishlist(p.id); }} className="absolute top-3 right-3 w-8 h-8 bg-card/80 border border-border flex items-center justify-center hover:bg-destructive transition-colors"><X size={12} /></button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground font-mono mb-1">{p.category}</p>
                  <h3 className="text-sm mb-2" style={{ fontFamily: "'Fraunces', serif" }}>{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-primary font-semibold text-sm">{formatPrice(p.price)}</span>
                    <button onClick={() => onAddToCart(p)} className="text-xs font-mono px-3 py-1.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all">Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AccountPage({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("orders");
  const orders = [
    { id: "DAN-847291", date: "Dec 18, 2024", status: "Delivered", items: 2, total: 267 },
    { id: "DAN-634108", date: "Nov 5, 2024", status: "Delivered", items: 1, total: 98 },
    { id: "DAN-521047", date: "Oct 22, 2024", status: "Delivered", items: 3, total: 345 },
  ];
  const tabs = [{ key: "orders", label: "My Orders", icon: <Package size={14} /> }, { key: "profile", label: "Profile", icon: <User size={14} /> }, { key: "addresses", label: "Addresses", icon: <MapPin size={14} /> }, { key: "settings", label: "Settings", icon: <Settings size={14} /> }];
  return (
    <div className="min-h-screen">
      <div className="border-b border-border py-8 px-6 bg-card">
        <div className="max-w-5xl mx-auto">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground text-sm font-mono flex items-center gap-1.5 mb-3"><ChevronLeft size={14} /> Back</button>
          <TibebBorder color="#e8a020" />
          <div className="flex items-center gap-4 mt-4">
            <div className="w-14 h-14 rounded-full bg-secondary border-2 border-primary flex items-center justify-center text-xl font-semibold text-primary" style={{ fontFamily: "'Fraunces', serif" }}>D</div>
            <div>
              <h1 className="text-2xl font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>Dawit Mengistu</h1>
              <p className="text-xs text-muted-foreground font-mono">Member since March 2023 · Gold Member</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-1 mb-8 border-b border-border">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-2 px-4 py-3 text-xs font-mono tracking-wider uppercase border-b-2 -mb-px transition-colors ${activeTab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        {activeTab === "orders" && (
          <div className="space-y-3">
            {orders.map(o => (
              <div key={o.id} className="bg-card border border-border p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center"><Package size={16} className="text-primary" /></div>
                  <div><p className="text-sm font-medium font-mono">{o.id}</p><p className="text-xs text-muted-foreground mt-0.5">{o.date} · {o.items} items</p></div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs font-mono text-green-400 bg-green-900/20 px-2.5 py-1">{o.status}</span>
                  <span className="font-mono text-primary font-semibold">{formatPrice(o.total)}</span>
                  <button className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">View <ChevronRight size={12} className="inline" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "profile" && (
          <div className="bg-card border border-border p-6 max-w-lg">
            <h2 className="text-xl font-semibold mb-5" style={{ fontFamily: "'Fraunces', serif" }}>Personal Information</h2>
            <div className="space-y-4">
              {[["First Name", "Dawit"], ["Last Name", "Mengistu"], ["Email", "d.mengistu@email.com"], ["Phone", "+1 (202) 555-0193"]].map(([label, value]) => (
                <div key={label}>
                  <label className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-1.5">{label}</label>
                  <input defaultValue={value} className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
              ))}
              <button className="mt-2 px-6 py-2.5 text-xs font-mono tracking-widest uppercase" style={{ backgroundColor: "#e8a020", color: "#140800" }}>Save Changes</button>
            </div>
          </div>
        )}
        {activeTab === "addresses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-primary p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono tracking-wider uppercase text-primary">Default</span>
                <button className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
              </div>
              <p className="text-sm font-medium mb-1">Dawit Mengistu</p>
              <p className="text-sm text-muted-foreground">2020 16th Street NW, Apt 3A</p>
              <p className="text-sm text-muted-foreground">Washington, DC 20009</p>
              <p className="text-sm text-muted-foreground">United States</p>
            </div>
            <button className="border border-dashed border-border p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors min-h-32">
              <Plus size={20} /><span className="text-xs font-mono tracking-wider uppercase">Add New Address</span>
            </button>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="max-w-lg space-y-4">
            {[{ label: "Order confirmations", sub: "Email when order is placed" }, { label: "Shipping updates", sub: "Track your order via email" }, { label: "New arrivals", sub: "First to see new collections" }, { label: "Exclusive offers", sub: "Member-only sales" }].map(({ label, sub }) => (
              <div key={label} className="bg-card border border-border p-4 flex items-center justify-between">
                <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground mt-0.5">{sub}</p></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-secondary peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
            <button className="flex items-center gap-2 text-destructive text-sm font-mono mt-4 hover:opacity-80 transition-opacity"><LogOut size={14} /> Sign Out</button>
          </div>
        )}
      </div>
    </div>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="py-16 px-6 border-t border-border" style={{ background: "linear-gradient(135deg, #1f0e00 0%, #140800 60%)" }}>
      <div className="max-w-xl mx-auto text-center">
        <TibebBorder color="#e8a020" />
        <div className="pt-8 pb-4">
          <p className="text-xs font-mono tracking-[0.4em] text-muted-foreground uppercase mb-3">Stay Close</p>
          <h2 className="text-3xl font-semibold mb-3" style={{ fontFamily: "'Fraunces', serif" }}>The Inner Circle</h2>
          <p className="text-muted-foreground text-sm mb-7">New arrivals from our artisans, exclusive Timkat and Meskel offers, and stories from the workshops of Ethiopia.</p>
          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-primary"><Check size={18} /><span className="font-mono text-sm">Yene konjo! Welcome to the circle.</span></div>
          ) : (
            <div className="flex gap-0 max-w-sm mx-auto">
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className="flex-1 bg-input-background border border-border border-r-0 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
              <button onClick={() => email && setSubmitted(true)} className="px-6 py-3 text-xs font-mono font-medium tracking-widest uppercase whitespace-nowrap" style={{ backgroundColor: "#e8a020", color: "#140800" }}>Subscribe</button>
            </div>
          )}
        </div>
        <TibebBorder color="#e8a020" />
      </div>
    </section>
  );
}

function Footer({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <footer className="bg-card border-t border-border">
      <TibebBorder color="#e8a020" />
      <div className="px-6 pt-10 pb-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2">
            <p className="text-2xl font-bold mb-1" style={{ fontFamily: "'Fraunces', serif", color: "#e8a020" }}>DanShop</p>
            <p className="text-xs font-mono tracking-[0.3em] text-muted-foreground mb-4 uppercase" style={{ fontSize: "9px" }}>Addis Ababa · Est. 2018</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-3">Authentic Ethiopian craftsmanship — handwoven, hand-stitched, and hand-fired — delivered worldwide.</p>
            <div className="h-2 w-24 rounded-sm mb-4" style={{ background: "linear-gradient(to right, #1e6b30 33.3%, #e8a020 33.3% 66.6%, #c0301a 66.6%)" }} />
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"><Icon size={14} /></a>
              ))}
            </div>
          </div>
          {[
            { title: "Shop", links: ["Habesha Kemis", "Men's Gabi", "Jewelry", "Leather Goods", "Coffee Sets", "Handwoven"] },
            { title: "Company", links: ["Our Story", "Artisan Partners", "Sustainability", "Press", "Careers"] },
            { title: "Support", links: ["Size Guide", "Returns Policy", "Shipping Info", "FAQ", "Contact Us"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-xs font-mono tracking-[0.3em] uppercase text-foreground mb-4">{title}</p>
              <ul className="space-y-2">
                {links.map(link => <li key={link}><button onClick={() => onNavigate("shop")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</button></li>)}
              </ul>
            </div>
          ))}
        </div>
        <TibebBorder color="#e8a020" thin />
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">© 2025 DanShop. All rights reserved. Addis Ababa, Ethiopia.</p>
          <div className="flex items-center gap-4">{["Privacy", "Terms", "Accessibility"].map(l => <a key={l} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono">{l}</a>)}</div>
          <div className="flex items-center gap-2">
            <Lock size={11} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono">Secure payments</span>
            {["VISA", "MC", "AMEX", "PayPal"].map(c => <span key={c} className="text-xs font-mono border border-border px-1.5 py-0.5 text-muted-foreground">{c}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
