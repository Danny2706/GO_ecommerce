import React, { useState } from "react";
import { Link } from "react-router";
import { User, Mail, Shield, ShoppingBag, LogOut, Check, Save } from "lucide-react";
import { useAuth } from "../store/AuthContext";

export default function ProfilePage() {
  const { user, updateProfile, logout, isAdmin } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, email });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-2xl uppercase">
                {user?.name ? user.name[0] : "U"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      isAdmin
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}
                  >
                    <Shield size={12} />
                    {user?.role?.toUpperCase()} ACCOUNT
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Shield size={16} />
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 border border-border text-foreground hover:bg-destructive/10 hover:text-destructive text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Personal Details</h2>
            {saved && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl flex items-center gap-2">
                <Check size={16} />
                Profile details updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save size={16} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                My Orders & Purchases
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Track current deliveries or review your transaction history
              </p>
            </div>
            <Link
              to="/orders"
              className="px-4 py-2 border border-border text-foreground hover:bg-secondary text-sm font-medium rounded-xl transition-colors"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
