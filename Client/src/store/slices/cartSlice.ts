import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../constants";

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
}

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem("selam_cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const initialState: CartState = {
  items: loadCart(),
  isDrawerOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.isDrawerOpen = true;
      localStorage.setItem("selam_cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem("selam_cart", JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
      } else {
        const item = state.items.find((i) => i.id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      }
      localStorage.setItem("selam_cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("selam_cart");
    },
    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCartDrawer, setCartDrawerOpen } =
  cartSlice.actions;

export default cartSlice.reducer;
