const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://go-ecommerce-dd9m.onrender.com/api/v1";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
  created_at?: string;
  updated_at?: string;
}

export interface BackendProduct {
  id: number;
  title: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  category_id: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
export interface ProductListResponse {
  items: BackendProduct[];
  total: number;
  page: number;
  page_size: number;
}
export interface BackendCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface BackendOrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  product?: BackendProduct;
  quantity: number;
  price: number;
}

export interface BackendOrder {
  id: number;
  user_id: number;
  total_amount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  shipping_address: string;
  payment_status: string;
  items?: BackendOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface InventoryLog {
  id: number;
  product_id: number;
  stock_change: number;
  type: "restock" | "sale" | "adjustment";
  reason?: string;
  created_at: string;
}

export interface InventoryStatusItem {
  id: number;
  title: string;
  sku: string;
  stock: number;
  category_id: number;
  is_active: boolean;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("selam_auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err: any) {
    throw new Error(`Unable to connect to server at ${API_BASE}. Please ensure the Go backend is running on port 8080.`);
  }

  const json = await response.json().catch(() => ({
    success: false,
    message: "Invalid server JSON response",
  }));

  if (!response.ok || json.success === false) {
    const errorMsg = json.error || json.message || `HTTP Error ${response.status}`;
    throw new Error(errorMsg);
  }

  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Auth
  login: async (
    email: string,
    password: string,
  ): Promise<{ token: string; user: User }> => {
    return request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ token: string; user: User }> => {
    return request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Users
  getProfile: async (): Promise<User> => {
    return request<User>("/users/me");
  },

  updateProfile: async (data: {
    name?: string;
    email?: string;
  }): Promise<User> => {
    return request<User>("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Products
  getProducts: async (params?: {
    page?: number;
    page_size?: number;
    category_id?: number | string;
    search?: string;
  }): Promise<ProductListResponse> => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.page_size) query.append("page_size", params.page_size.toString());
    if (params?.category_id) query.append("category_id", params.category_id.toString());
    if (params?.search) query.append("search", params.search);
    const queryString = query.toString();
    return request<ProductListResponse>(`/products${queryString ? `?${queryString}` : ""}`);
  },

  getProduct: async (id: number | string): Promise<BackendProduct> => {
    return request<BackendProduct>(`/products/${id}`);
  },

  createProduct: async (data: {
    title: string;
    description?: string;
    sku: string;
    price: number;
    stock: number;
    category_id: number;
  }): Promise<BackendProduct> => {
    return request<BackendProduct>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateProduct: async (
    id: number | string,
    data: Partial<{
      title: string;
      description: string;
      sku: string;
      price: number;
      stock: number;
      category_id: number;
      is_active: boolean;
    }>,
  ): Promise<BackendProduct> => {
    return request<BackendProduct>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteProduct: async (id: number | string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/products/${id}`, {
      method: "DELETE",
    });
  },

  // Categories
  getCategories: async (): Promise<BackendCategory[]> => {
    return request<BackendCategory[]>("/categories");
  },

  createCategory: async (data: {
    name: string;
    slug: string;
    description?: string;
    parent_id?: number | null;
  }): Promise<BackendCategory> => {
    return request<BackendCategory>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateCategory: async (
    id: number | string,
    data: Partial<{
      name: string;
      slug: string;
      description: string;
      parent_id: number | null;
    }>,
  ): Promise<BackendCategory> => {
    return request<BackendCategory>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteCategory: async (id: number | string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/categories/${id}`, {
      method: "DELETE",
    });
  },

  // Orders
  getOrders: async (): Promise<BackendOrder[]> => {
    return request<BackendOrder[]>("/orders");
  },

  getOrder: async (id: number | string): Promise<BackendOrder> => {
    return request<BackendOrder>(`/orders/${id}`);
  },

  createOrder: async (data: {
    shipping_address: string;
  }): Promise<BackendOrder> => {
    return request<BackendOrder>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateOrderStatus: async (
    id: number | string,
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled",
  ): Promise<BackendOrder> => {
    return request<BackendOrder>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Inventory
  getInventoryStatus: async (): Promise<InventoryStatusItem[]> => {
    return request<InventoryStatusItem[]>("/inventory/status");
  },

  adjustStock: async (data: {
    product_id: number;
    stock_change: number;
    type: "restock" | "sale" | "adjustment";
    reason?: string;
  }): Promise<{ message: string }> => {
    return request<{ message: string }>("/inventory/adjust", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
