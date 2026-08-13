import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Warehouse,
  Plus, Edit, Trash2, RefreshCw, CheckCircle2, AlertTriangle, Search,
  X, DollarSign, TrendingUp, Shield, ArrowUpRight, LogOut
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store";
import { useAuth } from "../../store/AuthContext";
import {
  fetchProducts, addProductAsync, updateProductAsync, deleteProductAsync
} from "../../store/slices/productsSlice";
import {
  fetchCategories, addCategoryAsync, updateCategoryAsync, deleteCategoryAsync
} from "../../store/slices/categoriesSlice";
import {
  fetchOrders, updateOrderStatusAsync
} from "../../store/slices/ordersSlice";
import {
  fetchInventory, adjustStockAsync
} from "../../store/slices/inventorySlice";
import { BackendProduct, BackendCategory, BackendOrder } from "../../services/api";

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const products = useAppSelector((state) => state.products.items);
  const productsStatus = useAppSelector((state) => state.products.status);
  const productsError = useAppSelector((state) => state.products.error);

  const categories = useAppSelector((state) => state.categories.items);
  const orders = useAppSelector((state) => state.orders.items);
  const inventory = useAppSelector((state) => state.inventory.items);

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "categories" | "orders" | "inventory">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BackendProduct | null>(null);
  const [productForm, setProductForm] = useState({
    title: "",
    sku: "",
    price: 0,
    stock: 0,
    category_id: 1,
    description: "",
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BackendCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    parent_id: null as number | null,
  });

  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState({
    product_id: 1,
    stock_change: 10,
    type: "restock" as "restock" | "sale" | "adjustment",
    reason: "",
  });

  const loadData = () => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchOrders());
    dispatch(fetchInventory());
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Product CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await dispatch(updateProductAsync({ id: editingProduct.id, data: productForm })).unwrap();
        showToast("Product updated successfully!");
      } else {
        await dispatch(addProductAsync(productForm)).unwrap();
        showToast("Product added to database!");
      }
      setProductModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      showToast(err || "Failed to save product", "error");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product from the database?")) return;
    try {
      await dispatch(deleteProductAsync(id)).unwrap();
      showToast("Product deleted successfully!");
    } catch (err: any) {
      showToast(err || "Failed to delete product", "error");
    }
  };

  // Category CRUD
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await dispatch(updateCategoryAsync({ id: editingCategory.id, data: categoryForm })).unwrap();
        showToast("Category updated successfully!");
      } else {
        await dispatch(addCategoryAsync(categoryForm)).unwrap();
        showToast("Category added to database!");
      }
      setCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      showToast(err || "Failed to save category", "error");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category from the database?")) return;
    try {
      await dispatch(deleteCategoryAsync(id)).unwrap();
      showToast("Category deleted successfully!");
    } catch (err: any) {
      showToast(err || "Failed to delete category", "error");
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (id: number, status: BackendOrder["status"]) => {
    try {
      await dispatch(updateOrderStatusAsync({ id, status })).unwrap();
      showToast(`Order #${id} status changed to ${status}`);
    } catch (err: any) {
      showToast(err || "Failed to update order status", "error");
    }
  };

  // Inventory Stock Adjustment
  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(adjustStockAsync(adjustForm)).unwrap();
      showToast("Stock level adjusted successfully!");
      setInventoryModalOpen(false);
    } catch (err: any) {
      showToast(err || "Failed to adjust stock", "error");
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const lowStockCount = inventory.filter((i) => i.stock < 10).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Toast Notification */}
      {statusMsg && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-sm font-medium text-white transition-all duration-300 ${
            statusMsg.type === "success" ? "bg-emerald-600 border-emerald-500" : "bg-destructive border-destructive"
          }`}
        >
          <CheckCircle2 size={16} />
          {statusMsg.text}
        </div>
      )}

      {/* Admin Top Navbar */}
      <div className="bg-card border-b border-border py-4 px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Admin Portal</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Role: {user?.role}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Connected directly to Go backend database (`http://localhost:8080/api/v1`)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="px-3.5 py-2 bg-secondary border border-border text-foreground hover:bg-secondary/80 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw size={14} className={productsStatus === "loading" ? "animate-spin" : ""} /> Sync Database
            </button>
            <Link
              to="/shop"
              className="px-3.5 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              Storefront <ArrowUpRight size={14} />
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-3.5 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {productsError && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            Database API Notice: {productsError}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-px mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutDashboard size={16} /> Overview
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "products"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package size={16} /> Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "categories"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderTree size={16} /> Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "orders"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingCart size={16} /> Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "inventory"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Warehouse size={16} /> Inventory ({lowStockCount > 0 ? `${lowStockCount} Low Stock` : "Stock OK"})
          </button>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Sales</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <DollarSign size={18} />
                  </div>
                </div>
                <div className="mt-3 text-2xl font-extrabold text-foreground">{totalRevenue.toLocaleString()} ETB</div>
                <div className="mt-1 text-xs text-emerald-500 flex items-center gap-1 font-medium">
                  <TrendingUp size={12} /> Real DB Records
                </div>
              </div>

              <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <ShoppingCart size={18} />
                  </div>
                </div>
                <div className="mt-3 text-2xl font-extrabold text-foreground">{orders.length}</div>
                <div className="mt-1 text-xs text-muted-foreground">Backend Orders</div>
              </div>

              <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Products Catalog</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <Package size={18} />
                  </div>
                </div>
                <div className="mt-3 text-2xl font-extrabold text-foreground">{products.length}</div>
                <div className="mt-1 text-xs text-muted-foreground">Backend Products</div>
              </div>

              <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Low Stock Alerts</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <AlertTriangle size={18} />
                  </div>
                </div>
                <div className="mt-3 text-2xl font-extrabold text-foreground">{lowStockCount}</div>
                <div className="mt-1 text-xs text-amber-500 font-medium">Inventory Logs</div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS CRUD */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter product SKU or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ title: "", sku: "", price: 100, stock: 10, category_id: categories[0]?.id || 1, description: "" });
                  setProductModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Product to Database
              </button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-foreground">
                  <thead className="bg-secondary/60 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
                    <tr>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No products found in PostgreSQL database. Click "Add Product to Database" to create one.
                        </td>
                      </tr>
                    ) : (
                      products
                        .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="p-4 font-mono text-xs text-muted-foreground">{p.sku}</td>
                            <td className="p-4 font-medium text-foreground">{p.title}</td>
                            <td className="p-4 text-xs text-muted-foreground">
                              {categories.find((c) => c.id === p.category_id)?.name || `Category #${p.category_id}`}
                            </td>
                            <td className="p-4 font-bold text-foreground">{p.price.toLocaleString()} ETB</td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  p.stock > 10
                                    ? "bg-emerald-500/10 text-emerald-500"
                                    : p.stock > 0
                                    ? "bg-amber-500/10 text-amber-500"
                                    : "bg-destructive/10 text-destructive"
                                }`}
                              >
                                {p.stock} in stock
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductForm({
                                    title: p.title,
                                    sku: p.sku,
                                    price: p.price,
                                    stock: p.stock,
                                    category_id: p.category_id,
                                    description: p.description || "",
                                  });
                                  setProductModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES CRUD */}
        {activeTab === "categories" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({ name: "", slug: "", description: "", parent_id: null });
                  setCategoryModalOpen(true);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
              >
                <Plus size={16} /> Add Category to Database
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.length === 0 ? (
                <div className="col-span-full bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
                  No categories in database yet.
                </div>
              ) : (
                categories.map((cat) => (
                  <div key={cat.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-foreground text-base">{cat.name}</h3>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                          {cat.slug}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{cat.description || "No description provided."}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setCategoryForm({
                            name: cat.name,
                            slug: cat.slug,
                            description: cat.description || "",
                            parent_id: cat.parent_id || null,
                          });
                          setCategoryModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-medium text-foreground hover:bg-secondary/80 flex items-center gap-1"
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="px-3 py-1.5 rounded-lg bg-destructive/10 text-xs font-medium text-destructive hover:bg-destructive/20 flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-foreground">
                  <thead className="bg-secondary/60 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer ID</th>
                      <th className="p-4">Address</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No customer orders in database yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="p-4 font-mono text-xs text-muted-foreground">#{ord.id}</td>
                          <td className="p-4 font-medium text-foreground">User #{ord.user_id}</td>
                          <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">{ord.shipping_address}</td>
                          <td className="p-4 font-bold text-foreground">{ord.total_amount.toLocaleString()} ETB</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase ${
                                ord.status === "delivered"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : ord.status === "shipped"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : ord.status === "paid"
                                  ? "bg-purple-500/10 text-purple-500"
                                  : ord.status === "pending"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                              className="bg-background border border-border rounded-lg text-xs p-1.5 text-foreground focus:ring-2 focus:ring-primary/50"
                            >
                              <option value="pending">pending</option>
                              <option value="paid">paid</option>
                              <option value="shipped">shipped</option>
                              <option value="delivered">delivered</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY MANAGEMENT */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setInventoryModalOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
              >
                <Warehouse size={16} /> Stock Level Adjustment
              </button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-foreground">
                  <thead className="bg-secondary/60 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
                    <tr>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Stock Units</th>
                      <th className="p-4">Inventory Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {inventory.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                          No inventory logs recorded in database.
                        </td>
                      </tr>
                    ) : (
                      inventory.map((inv) => (
                        <tr key={inv.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="p-4 font-mono text-xs text-muted-foreground">{inv.sku}</td>
                          <td className="p-4 font-medium text-foreground">{inv.title}</td>
                          <td className="p-4 font-bold text-foreground">{inv.stock} units</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase ${
                                inv.stock > 10
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : inv.stock > 0
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {inv.stock > 10 ? "IN STOCK" : inv.stock > 0 ? "LOW STOCK" : "OUT OF STOCK"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {editingProduct ? "Edit Product" : "Add Product to Database"}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full p-2 bg-background border border-border rounded-xl text-sm text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full p-2 bg-background border border-border rounded-xl text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Category</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: Number(e.target.value) })}
                    className="w-full p-2 bg-background border border-border rounded-xl text-sm text-foreground"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Price (ETB)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full p-2 bg-background border border-border rounded-xl text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Stock Level</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full p-2 bg-background border border-border rounded-xl text-sm text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2 bg-background border border-border rounded-xl text-sm text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-border text-foreground text-xs font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-xl hover:bg-primary/90"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h3>
              <button onClick={() => setCategoryModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  className="w-full p-2 bg-background border border-border rounded-xl text-sm text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="w-full p-2 bg-background border border-border rounded-xl text-sm text-foreground font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Description</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full p-2 bg-background border border-border rounded-xl text-sm text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 border border-border text-foreground text-xs font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-xl hover:bg-primary/90"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADJUST INVENTORY MODAL */}
      {inventoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">Stock Adjustment</h3>
              <button onClick={() => setInventoryModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Product</label>
                <select
                  value={adjustForm.product_id}
                  onChange={(e) => setAdjustForm({ ...adjustForm, product_id: Number(e.target.value) })}
                  className="w-full p-2 bg-background border border-border rounded-xl text-sm text-foreground"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Type</label>
                  <select
                    value={adjustForm.type}
                    onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value as any })}
                    className="w-full p-2 bg-background border border-border rounded-xl text-sm text-foreground"
                  >
                    <option value="restock">Restock (+)</option>
                    <option value="sale">Sale (-)</option>
                    <option value="adjustment">Adjustment (+/-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Stock Change</label>
                  <input
                    type="number"
                    required
                    value={adjustForm.stock_change}
                    onChange={(e) => setAdjustForm({ ...adjustForm, stock_change: Number(e.target.value) })}
                    className="w-full p-2 bg-background border border-border rounded-xl text-sm text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Reason / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Shipment arrival batch #42"
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  className="w-full p-2 bg-background border border-border rounded-xl text-sm text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setInventoryModalOpen(false)}
                  className="px-4 py-2 border border-border text-foreground text-xs font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-xl hover:bg-primary/90"
                >
                  Apply Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
