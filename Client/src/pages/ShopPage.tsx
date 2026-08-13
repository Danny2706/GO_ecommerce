import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { SlidersHorizontal, Grid3X3, LayoutList, X, ChevronDown, RefreshCw, ChevronLeft, ChevronRight, Search } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { CATEGORIES as STATIC_CATEGORIES, type Product } from "../constants";
import { useApp } from "../store/AppContext";
import { api, type BackendCategory } from "../services/api";
import { normalizeBackendProduct } from "../utils/productAdapter";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
];

const PRICE_RANGES = [
  { label: "Under 200 ETB", min: 0, max: 200 },
  { label: "200 – 500 ETB", min: 200, max: 500 },
  { label: "500 – 2,000 ETB", min: 500, max: 2000 },
  { label: "2,000 – 5,000 ETB", min: 2000, max: 5000 },
  { label: "Above 5,000 ETB", min: 5000, max: Infinity },
];

const CATEGORY_ICONS: Record<string, string> = {
  clothing: "👗",
  coffee: "☕",
  spices: "🌶️",
  handcrafts: "🏺",
  electronics: "📱",
  beauty: "✨",
};

export default function ShopPage() {
  const { lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL params
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "featured";
  const minPriceParam = searchParams.get("min_price") ? Number(searchParams.get("min_price")) : null;
  const maxPriceParam = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : null;
  const inStockParam = searchParams.get("in_stock") === "true";
  const currentPage = Number(searchParams.get("page") || "1");

  // Local state
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParam);

  // Sync search input state when searchParam changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Load Categories once or on mount
  useEffect(() => {
    let isMounted = true;
    api.getCategories()
      .then((catList) => {
        if (isMounted) setCategories(catList);
      })
      .catch(() => {
        // Silent fallback for categories
      });
    return () => { isMounted = false; };
  }, []);

  // Map category slug to category ID
  const selectedCatObj = useMemo(() => {
    if (categoryParam === "all") return null;
    return categories.find(
      (c) => c.slug.toLowerCase() === categoryParam.toLowerCase() || String(c.id) === categoryParam
    ) || null;
  }, [categoryParam, categories]);

  // Fetch backend products whenever relevant URL search params change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const categoryId = selectedCatObj ? selectedCatObj.id : undefined;

    api.getProducts({
      page: currentPage,
      page_size: pageSize,
      category_id: categoryId,
      search: searchParam,
    })
      .then((res) => {
        if (!isMounted) return;
        const normalized = (res.items || []).map((item) =>
          normalizeBackendProduct(item, categories)
        );
        setProducts(normalized);
        setTotalItems(res.total || normalized.length);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Failed to load products from server");
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [categoryParam, searchParam, currentPage, pageSize, selectedCatObj, categories]);

  // Helper functions to update URL params
  function updateParam(key: string, value: string | null, resetPage = true) {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === "" || value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    if (resetPage) {
      newParams.delete("page");
    }
    setSearchParams(newParams);
  }

  function handleCategorySelect(catSlug: string) {
    updateParam("category", catSlug === "all" ? null : catSlug);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParam("search", searchInput.trim() || null);
  }

  function handlePriceRangeSelect(min: number, max: number) {
    const active = minPriceParam === min && maxPriceParam === max;
    const newParams = new URLSearchParams(searchParams);
    if (active) {
      newParams.delete("min_price");
      newParams.delete("max_price");
    } else {
      newParams.set("min_price", String(min));
      if (max === Infinity) {
        newParams.delete("max_price");
      } else {
        newParams.set("max_price", String(max));
      }
    }
    newParams.delete("page");
    setSearchParams(newParams);
  }

  function handleInStockToggle() {
    updateParam("in_stock", inStockParam ? null : "true");
  }

  function handleSortChange(sortVal: string) {
    updateParam("sort", sortVal, false);
  }

  function handleClearAllFilters() {
    setSearchParams(new URLSearchParams());
    setSearchInput("");
  }

  // Filter products client-side for price range & in_stock, plus client sort
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (minPriceParam !== null) {
      list = list.filter((p) => p.price >= minPriceParam);
    }
    if (maxPriceParam !== null) {
      list = list.filter((p) => p.price <= maxPriceParam);
    }
    if (inStockParam) {
      list = list.filter((p) => p.inStock);
    }

    switch (sortParam) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return list;
  }, [products, minPriceParam, maxPriceParam, inStockParam, sortParam]);

  const activeCategoryIcon = selectedCatObj
    ? CATEGORY_ICONS[selectedCatObj.slug.toLowerCase()] || "🛍️"
    : "🛍️";
  const activeCategoryName = selectedCatObj ? selectedCatObj.name : "All Products";

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-primary uppercase tracking-widest mb-1">
                {activeCategoryIcon} Shop
              </p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {activeCategoryName}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                {loading
                  ? "Loading live backend inventory..."
                  : `${totalItems} product${totalItems === 1 ? "" : "s"} available`}
              </p>
            </div>

            {/* Shop Page Search bar */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products in database..."
                className="w-full pl-10 pr-10 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary shadow-sm"
              />
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateParam("search", null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => handleCategorySelect("all")}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              categoryParam === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/40"
            }`}
          >
            All
          </button>
          {(categories.length > 0
            ? categories
            : STATIC_CATEGORIES.map((sc) => ({ id: Number(sc.id) || 0, name: sc.name, slug: sc.id, description: "" }))
          ).map((cat) => {
            const icon = CATEGORY_ICONS[cat.slug.toLowerCase()] || "📦";
            const isActive =
              categoryParam.toLowerCase() === cat.slug.toLowerCase() ||
              categoryParam === String(cat.id);
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary/40"
                }`}
              >
                <span>{icon}</span> {cat.name}
              </button>
            );
          })}
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-28 space-y-6">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Price Range</h3>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((range) => {
                    const active = minPriceParam === range.min && maxPriceParam === range.max;
                    return (
                      <button
                        key={range.label}
                        onClick={() => handlePriceRangeSelect(range.min, range.max)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Availability</h3>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={handleInStockToggle}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${inStockParam ? "bg-primary" : "bg-muted"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${inStockParam ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm text-foreground">In Stock Only</span>
                </label>
              </div>

              {(categoryParam !== "all" || searchParam || minPriceParam !== null || inStockParam) && (
                <button
                  onClick={handleClearAllFilters}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors border-t border-border pt-4 w-full"
                >
                  <X size={13} /> Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Product grid area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-3">
              <button
                onClick={() => setFiltersOpen((o) => !o)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <SlidersHorizontal size={15} /> Filters
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${viewMode === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Grid3X3 size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${viewMode === "list" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <LayoutList size={15} />
                  </button>
                </div>

                <div className="relative">
                  <select
                    value={sortParam}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Mobile filters panel */}
            {filtersOpen && (
              <div className="lg:hidden mb-5 p-4 bg-card border border-border rounded-2xl space-y-5">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Price Range</h3>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range) => {
                      const active = minPriceParam === range.min && maxPriceParam === range.max;
                      return (
                        <button
                          key={range.label}
                          onClick={() => handlePriceRangeSelect(range.min, range.max)}
                          className={`px-3 py-1.5 rounded-full text-xs transition-colors border ${active ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/40"}`}
                        >
                          {range.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={handleInStockToggle}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${inStockParam ? "bg-primary" : "bg-muted"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${inStockParam ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm text-foreground">In Stock Only</span>
                </label>
              </div>
            )}

            {/* Results / Skeletons / Error */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden h-72 p-3 space-y-3">
                    <div className="bg-secondary h-40 rounded-xl w-full" />
                    <div className="bg-secondary h-4 rounded w-3/4" />
                    <div className="bg-secondary h-4 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-card border border-destructive/30 rounded-2xl p-8 max-w-lg mx-auto">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Backend Connection Error</h3>
                <p className="text-sm text-muted-foreground mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90"
                >
                  <RefreshCw size={14} /> Retry Connection
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-card border border-border rounded-2xl">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex gap-5 bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-colors p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-28 h-28 object-cover rounded-xl bg-secondary shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-muted-foreground uppercase">{product.location}</div>
                      <h3 className="font-medium text-foreground mt-1 leading-snug">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-mono font-bold text-foreground">
                          {new Intl.NumberFormat("en-ET").format(product.price)} ETB
                        </span>
                        {product.inStock && (
                          <button
                            onClick={() => {}}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => updateParam("page", String(currentPage - 1), false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  const isActive = pNum === currentPage;
                  return (
                    <button
                      key={pNum}
                      onClick={() => updateParam("page", String(pNum), false)}
                      className={`w-9 h-9 rounded-xl font-mono text-sm font-medium transition-colors border ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => updateParam("page", String(currentPage + 1), false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
