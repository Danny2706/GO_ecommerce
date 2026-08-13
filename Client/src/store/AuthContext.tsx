import React, { createContext, useContext } from "react";
import { useAppDispatch, useAppSelector } from "./index";
import { loginUser, registerUser, updateUserProfile, logout } from "./slices/authSlice";
import { User } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isAdmin, loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (email: string, password: string): Promise<User> => {
    const result = await dispatch(loginUser({ email, password })).unwrap();
    return result.user;
  };

  const handleRegister = async (name: string, email: string, password: string): Promise<User> => {
    const result = await dispatch(registerUser({ name, email, password })).unwrap();
    return result.user;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateProfile = async (data: { name?: string; email?: string }) => {
    await dispatch(updateUserProfile(data)).unwrap();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateProfile: handleUpdateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
