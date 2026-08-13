import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api, BackendCategory } from "../../services/api";

export interface CategoriesState {
  items: BackendCategory[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const data = await api.getCategories();
    return data || [];
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const addCategoryAsync = createAsyncThunk(
  "categories/addCategoryAsync",
  async (data: { name: string; slug: string; description?: string; parent_id?: number | null }, { rejectWithValue }) => {
    try {
      return await api.createCategory(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCategoryAsync = createAsyncThunk(
  "categories/updateCategoryAsync",
  async ({ id, data }: { id: number; data: Partial<BackendCategory> }, { rejectWithValue }) => {
    try {
      return await api.updateCategory(id, data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  "categories/deleteCategoryAsync",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.deleteCategory(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addCategoryAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.items.push(action.payload);
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
