import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api, InventoryStatusItem } from "../../services/api";

export interface InventoryState {
  items: InventoryStatusItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchInventory = createAsyncThunk("inventory/fetchInventory", async (_, { rejectWithValue }) => {
  try {
    const res = await api.getInventoryStatus();
    return res || [];
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const adjustStockAsync = createAsyncThunk(
  "inventory/adjustStockAsync",
  async (
    data: { product_id: number; stock_change: number; type: "restock" | "sale" | "adjustment"; reason?: string },
    { rejectWithValue }
  ) => {
    try {
      await api.adjustStock(data);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(adjustStockAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const item = state.items.find((i) => i.id === action.payload.product_id);
        if (item) {
          const delta = action.payload.type === "sale" ? -action.payload.stock_change : action.payload.stock_change;
          item.stock = Math.max(0, item.stock + delta);
          item.status = item.stock > 10 ? "in_stock" : item.stock > 0 ? "low_stock" : "out_of_stock";
        }
      });
  },
});

export default inventorySlice.reducer;
