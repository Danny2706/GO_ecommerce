import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api, BackendOrder } from "../../services/api";

export interface OrdersState {
  items: BackendOrder[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    const res = await api.getOrders();
    return res || [];
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateOrderStatusAsync = createAsyncThunk(
  "orders/updateOrderStatusAsync",
  async ({ id, status }: { id: number; status: BackendOrder["status"] }, { rejectWithValue }) => {
    try {
      await api.updateOrderStatus(id, status);
      return { id, status };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createOrderAsync = createAsyncThunk(
  "orders/createOrderAsync",
  async (shipping_address: string, { rejectWithValue }) => {
    try {
      return await api.createOrder({ shipping_address });
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatusAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const ord = state.items.find((o) => o.id === action.payload.id);
        if (ord) {
          ord.status = action.payload.status;
        }
      })
      .addCase(createOrderAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.items.unshift(action.payload);
      });
  },
});

export default ordersSlice.reducer;
