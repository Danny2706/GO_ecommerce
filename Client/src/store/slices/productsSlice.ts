import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api, BackendProduct } from "../../services/api";

export interface ProductsState {
  items: BackendProduct[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
}

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
  selectedCategory: "all",
  searchQuery: "",
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getProducts();
      return data.items;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const addProductAsync = createAsyncThunk(
  "products/addProductAsync",
  async (
    data: { title: string; sku: string; price: number; stock: number; category_id: number; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const newProd = await api.createProduct(data);
      return newProd;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateProductAsync = createAsyncThunk(
  "products/updateProductAsync",
  async ({ id, data }: { id: number; data: Partial<BackendProduct> }, { rejectWithValue }) => {
    try {
      const updated = await api.updateProduct(id, data);
      return updated;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteProductAsync = createAsyncThunk(
  "products/deleteProductAsync",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.deleteProduct(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addProductAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProductAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      .addCase(deleteProductAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { setCategoryFilter, setSearchQuery } = productsSlice.actions;
export default productsSlice.reducer;
