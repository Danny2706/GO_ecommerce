// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router";
// import {
//   ShoppingCart, Heart, Share2, Star, MapPin, Shield,
//   Truck, RefreshCw, ChevronRight, Plus, Minus, Check, ArrowLeft
// } from "lucide-react";
// import { useApp } from "../store/AppContext";
// import { formatETB, discount } from "../utils/format";
// import ProductCard from "../components/ProductCard";
// import { api, type BackendCategory } from "../services/api";
// import { normalizeBackendProduct } from "../utils/productAdapter";
// import type { Product } from "../constants";

// export default function ProductDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const { dispatch } = useApp();

//   const [product, setProduct] = useState<Product | null>(null);
//   const [related, setRelated] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [activeImg, setActiveImg] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [wishlisted, setWishlisted] = useState(false);
//   const [added, setAdded] = useState(false);
//   const [activeTab, setActiveTab] = useState<"description" | "reviews" | "seller">("description");

//   useEffect(() => {
//     if (!id) return;
//     let isMounted = true;
//     setLoading(true);
//     setError(null);
//     setActiveImg(0);

//     Promise.all([
//       api.getProduct(id),
//       api.getCategories().catch(() => [] as BackendCategory[]),
//     ])
//       .then(([bp, cats]) => {
//         if (!isMounted) return;
//         const normalized = normalizeBackendProduct(bp, cats);
//         setProduct(normalized);
//         setLoading(false);

//         // Fetch related products in the same category
//         if (bp.category_id) {
//           api.getProducts({ category_id: bp.category_id, page_size: 5 })
//             .then((res) => {
//               if (!isMounted) return;
//               const rel = (res.items || [])
//                 .filter((item) => String(item.id) !== String(bp.id))
//                 .slice(0, 4)
//                 .map((item) => normalizeBackendProduct(item, cats));
//               setRelated(rel);
//             })
//             .catch(() => {});
//         }
//       })
//       .catch((err) => {
//         if (!isMounted) return;
//         setError(err.message || "Failed to load product details");
//         setLoading(false);
//       });

//     return () => { isMounted = false; };
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background max-w-7xl mx-auto px-6 py-12 animate-pulse">
//         <div className="h-6 bg-secondary rounded w-48 mb-8" />
//         <div className="grid lg:grid-cols-2 gap-12">
//           <div className="aspect-square bg-secondary rounded-2xl w-full" />
//           <div className="space-y-4">
//             <div className="h-8 bg-secondary rounded w-3/4" />
//             <div className="h-4 bg-secondary rounded w-1/4" />
//             <div className="h-10 bg-secondary rounded w-1/2" />
//             <div className="h-32 bg-secondary rounded w-full" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center p-6">
//         <div className="text-center bg-card border border-border rounded-2xl p-10 max-w-md">
//           <div className="text-5xl mb-4">😕</div>
//           <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Product Not Found</h2>
//           <p className="text-sm text-muted-foreground mb-6">
//             {error || "The product you requested could not be loaded from the backend."}
//           </p>
//           <Link
//             to="/shop"
//             className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90"
//           >
//             <ArrowLeft size={16} /> Return to Shop
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   function handleAddToCart() {
//     if (!product) return;
//     for (let i = 0; i < qty; i++) {
//       dispatch({ type: "ADD_ITEM", payload: product });
//     }
//     setAdded(true);
//     setTimeout(() => setAdded(false), 2000);
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Breadcrumb */}
//       <div className="bg-secondary border-b border-border">
//         <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-muted-foreground font-mono">
//           <Link to="/" className="hover:text-primary transition-colors">Home</Link>
//           <ChevronRight size={12} />
//           <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
//           <ChevronRight size={12} />
//           <Link to={`/shop?category=${product.category}`} className="hover:text-primary transition-colors capitalize">
//             {product.category}
//           </Link>
//           <ChevronRight size={12} />
//           <span className="text-foreground truncate max-w-48">{product.name}</span>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-10">
//         <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
//           {/* Images */}
//           <div className="space-y-4">
//             <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary">
//               <img
//                 src={product.images[activeImg] || product.image}
//                 alt={product.name}
//                 className="w-full h-full object-cover"
//               />
//               {product.badge && (
//                 <span className={`absolute top-4 left-4 text-xs font-mono font-medium px-3 py-1.5 rounded-full ${
//                   product.badge === "Sale" ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
//                 }`}>
//                   {product.badge}
//                   {product.originalPrice && ` −${discount(product.originalPrice, product.price)}%`}
//                 </span>
//               )}
//             </div>
//             {product.images.length > 1 && (
//               <div className="flex gap-3">
//                 {product.images.map((img, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setActiveImg(i)}
//                     className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
//                       activeImg === i ? "border-primary" : "border-border hover:border-muted-foreground"
//                     }`}
//                   >
//                     <img src={img} alt="" className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Details */}
//           <div className="space-y-6">
//             {/* Header */}
//             <div>
//               <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
//                 <MapPin size={11} />
//                 {product.location} · {product.seller}
//               </div>
//               <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-1">
//                 {product.name}
//               </h1>
//               {product.nameAm && <p className="text-sm font-serif italic text-muted-foreground">{product.nameAm}</p>}
//             </div>

//             {/* Rating */}
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-0.5">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <Star key={i} size={15} className={i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-muted-foreground/30"} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
//                 ))}
//               </div>
//               <span className="font-mono text-sm text-foreground font-medium">{product.rating}</span>
//               <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
//             </div>

//             {/* Price */}
//             <div className="flex items-baseline gap-3 pb-5 border-b border-border">
//               <span className="font-mono font-bold text-3xl text-foreground">
//                 {formatETB(product.price)}
//               </span>
//               {product.originalPrice && (
//                 <>
//                   <span className="font-mono text-lg text-muted-foreground line-through">
//                     {formatETB(product.originalPrice)}
//                   </span>
//                   <span className="text-sm font-mono text-destructive font-medium">
//                     Save {formatETB(product.originalPrice - product.price)}
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* Stock */}
//             <div className="flex items-center gap-2">
//               <div className={`w-2.5 h-2.5 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-destructive"}`} />
//               <span className="text-sm font-medium text-foreground">
//                 {product.inStock ? "In Stock — Ready to ship" : "Out of Stock"}
//               </span>
//             </div>

//             {/* Qty + Add to cart */}
//             {product.inStock && (
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2 bg-secondary rounded-xl p-1.5 border border-border">
//                   <button
//                     onClick={() => setQty((q) => Math.max(1, q - 1))}
//                     className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-foreground"
//                   >
//                     <Minus size={15} />
//                   </button>
//                   <span className="w-10 text-center font-mono font-semibold text-foreground text-base">
//                     {qty}
//                   </span>
//                   <button
//                     onClick={() => setQty((q) => q + 1)}
//                     className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-foreground"
//                   >
//                     <Plus size={15} />
//                   </button>
//                 </div>

//                 <button
//                   onClick={handleAddToCart}
//                   className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl font-medium text-sm transition-all ${
//                     added
//                       ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
//                       : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
//                   }`}
//                 >
//                   {added ? <><Check size={16} /> Added to Cart</> : <><ShoppingCart size={16} /> Add to Cart</>}
//                 </button>

//                 <button
//                   onClick={() => setWishlisted((w) => !w)}
//                   className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-colors ${
//                     wishlisted ? "border-destructive bg-destructive/10 text-destructive" : "border-border hover:bg-secondary text-muted-foreground"
//                   }`}
//                 >
//                   <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
//                 </button>

//                 <button className="w-11 h-11 flex items-center justify-center rounded-xl border border-border hover:bg-secondary text-muted-foreground transition-colors">
//                   <Share2 size={18} />
//                 </button>
//               </div>
//             )}

//             {/* Trust badges */}
//             <div className="grid grid-cols-3 gap-3 pt-2">
//               {[
//                 { icon: Truck, title: "Free Delivery", desc: "Orders 500+ ETB" },
//                 { icon: Shield, title: "Authentic", desc: "Verified seller" },
//                 { icon: RefreshCw, title: "Easy Return", desc: "14-day policy" },
//               ].map(({ icon: Icon, title, desc }) => (
//                 <div key={title} className="flex flex-col items-center gap-1.5 p-3 bg-secondary rounded-xl text-center">
//                   <Icon size={16} className="text-primary" />
//                   <div className="text-xs font-medium text-foreground leading-tight">{title}</div>
//                   <div className="text-[10px] text-muted-foreground">{desc}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="mt-14 border-b border-border">
//           <div className="flex gap-1">
//             {(["description", "reviews", "seller"] as const).map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
//                   activeTab === tab
//                     ? "border-primary text-primary"
//                     : "border-transparent text-muted-foreground hover:text-foreground"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="py-8 max-w-3xl">
//           {activeTab === "description" && (
//             <div className="text-muted-foreground leading-relaxed text-sm space-y-4">
//               <p>{product.description}</p>
//               <div className="mt-6 grid sm:grid-cols-2 gap-3">
//                 {[
//                   { label: "Seller", value: product.seller },
//                   { label: "Origin", value: product.location },
//                   { label: "Category", value: product.category },
//                   { label: "Availability", value: product.inStock ? "In Stock" : "Out of Stock" },
//                 ].map(({ label, value }) => (
//                   <div key={label} className="flex items-center justify-between py-2.5 px-4 bg-secondary rounded-xl">
//                     <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
//                     <span className="text-sm text-foreground font-medium capitalize">{value}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//           {activeTab === "reviews" && (
//             <div className="space-y-6">
//               <div className="flex items-center gap-5">
//                 <div className="text-center">
//                   <div className="font-mono font-bold text-5xl text-foreground">{product.rating}</div>
//                   <div className="flex items-center gap-0.5 mt-1 justify-center">
//                     {Array.from({ length: 5 }).map((_, i) => (
//                       <Star key={i} size={13} className={i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-muted-foreground/30"} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
//                     ))}
//                   </div>
//                   <div className="text-xs text-muted-foreground mt-1 font-mono">{product.reviewCount} reviews</div>
//                 </div>
//                 <div className="flex-1 space-y-1.5">
//                   {[5, 4, 3, 2, 1].map((star) => {
//                     const pct = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 2 : 2;
//                     return (
//                       <div key={star} className="flex items-center gap-2 text-xs">
//                         <span className="font-mono text-muted-foreground w-2">{star}</span>
//                         <Star size={10} className="text-accent fill-accent" fill="currentColor" />
//                         <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
//                           <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
//                         </div>
//                         <span className="font-mono text-muted-foreground w-6">{pct}%</span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           )}
//           {activeTab === "seller" && (
//             <div className="flex items-start gap-5">
//               <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-2xl shrink-0">
//                 {product.seller[0]}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-foreground text-lg">{product.seller}</h3>
//                 <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 font-mono">
//                   <MapPin size={10} /> {product.location}
//                 </div>
//                 <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
//                   Verified seller on Selam Market. All products are authentic and sourced directly from
//                   Ethiopian artisans and producers. Ships nationwide within 2–4 business days.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Related products */}
//         {related.length > 0 && (
//           <div className="mt-8">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="font-serif text-2xl font-bold text-foreground">Related Products</h2>
//               <Link to={`/shop?category=${product.category}`} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
//                 View all <ChevronRight size={14} />
//               </Link>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
//               {related.map((p) => <ProductCard key={p.id} product={p} />)}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
