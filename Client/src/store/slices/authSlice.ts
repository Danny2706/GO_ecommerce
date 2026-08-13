import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, User } from "../../services/api";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const storedUser = (): User | null => {
  try {
    const raw = localStorage.getItem("selam_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const storedToken = (): string | null => {
  return localStorage.getItem("selam_auth_token") || null;
};

const initialUser = storedUser();
const initialToken = storedToken();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialUser,
  isAdmin: initialUser?.role === "admin",
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.login(email, password);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to log in");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.register(name, email, password);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Registration failed");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const user = await api.getProfile();
      return user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (data: { name?: string; email?: string }, { rejectWithValue }) => {
    try {
      const updated = await api.updateProfile(data);
      return updated;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to update profile");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.error = null;
      localStorage.removeItem("selam_user");
      localStorage.removeItem("selam_auth_token");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user.role === "admin";
        localStorage.setItem("selam_user", JSON.stringify(action.payload.user));
        localStorage.setItem("selam_auth_token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user.role === "admin";
        localStorage.setItem("selam_user", JSON.stringify(action.payload.user));
        localStorage.setItem("selam_auth_token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Profile
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAdmin = action.payload.role === "admin";
        localStorage.setItem("selam_user", JSON.stringify(action.payload));
      })

      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("selam_user", JSON.stringify(action.payload));
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
