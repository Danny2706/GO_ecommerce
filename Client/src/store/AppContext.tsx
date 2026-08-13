import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import type { Product } from "../constants";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_DRAWER" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          isDrawerOpen: true,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        isDrawerOpen: true,
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "UPDATE_QTY":
      return {
        ...state,
        items:
          action.payload.quantity <= 0
            ? state.items.filter((i) => i.id !== action.payload.id)
            : state.items.map((i) =>
                i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
              ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_DRAWER":
      return { ...state, isDrawerOpen: !state.isDrawerOpen };
    case "OPEN_DRAWER":
      return { ...state, isDrawerOpen: true };
    case "CLOSE_DRAWER":
      return { ...state, isDrawerOpen: false };
    default:
      return state;
  }
}

interface AppContextValue {
  cart: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
  theme: "light" | "dark";
  toggleTheme: () => void;
  lang: "en" | "am";
  toggleLang: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const stored = (): CartItem[] => {
  try {
    const raw = localStorage.getItem("selam_cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const storedTheme = (): "light" | "dark" => {
  try {
    const raw = localStorage.getItem("selam_theme");
    if (raw === "dark" || raw === "light") return raw;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: stored(),
    isDrawerOpen: false,
  });

  const [theme, setTheme] = useState<"light" | "dark">(storedTheme);
  const [lang, setLang] = useState<"en" | "am">("en");

  useEffect(() => {
    localStorage.setItem("selam_cart", JSON.stringify(cart.items));
  }, [cart.items]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("selam_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const toggleLang = () => setLang((l) => (l === "en" ? "am" : "en"));

  const totalItems = cart.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <AppContext.Provider value={{ cart, dispatch, totalItems, totalPrice, theme, toggleTheme, lang, toggleLang }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
