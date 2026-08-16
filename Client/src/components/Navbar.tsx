import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  Search,
  ShoppingCart,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Phone,
  Globe,
  User,
  Shield,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { useAuth } from "../store/AuthContext";
import { NAV_LINKS, CATEGORIES as STATIC_CATEGORIES } from "../constants";
import { api, type BackendCategory } from "../services/api";

const CATEGORY_ICONS: Record<string, string> = {
  clothing: "👗",
  coffee: "☕",
  spices: "🌶️",
  handcrafts: "🏺",
  electronics: "📱",
  beauty: "✨",
};

export default function Navbar() {
  const { totalItems, dispatch, toggleTheme, theme, lang, toggleLang } =
    useApp();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [mobileSearchVal, setMobileSearchVal] = useState("");
  const [catsOpen, setCatsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api
      .getCategories()
      .then((catList) => {
        if (isMounted) setCategories(catList);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal("");
    }
  }

  function handleMobileSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mobileSearchVal.trim()) {
      navigate(`/shop?search=${encodeURIComponent(mobileSearchVal.trim())}`);
      setMenuOpen(false);
      setMobileSearchVal("");
    }
  }

  const categoryItems =
    categories.length > 0
      ? categories.map((cat) => ({
          id: cat.slug,
          name: cat.name,
          nameAm: cat.name,
          icon: CATEGORY_ICONS[cat.slug.toLowerCase()] || "📦",
        }))
      : STATIC_CATEGORIES;

  return (
    <>
      {/* Top strip */}
      <div className="bg-primary text-primary-foreground text-[10px] xs:text-xs py-1.5 xs:py-2 hidden sm:block">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 md:px-6 flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex items-center gap-3 xs:gap-5">
            <span className="flex items-center gap-1 xs:gap-1.5 whitespace-nowrap">
              <Phone size={11} className="hidden xs:inline" />
              <span className="hidden xs:inline">+251 11 518 0000</span>
              <span className="xs:hidden">+251...</span>
            </span>
            <span className="flex items-center gap-1 xs:gap-1.5 whitespace-nowrap">
              <MapPin size={11} className="hidden xs:inline" />
              <span className="hidden xs:inline">Addis Ababa, Ethiopia</span>
              <span className="xs:hidden">Addis</span>
            </span>
          </div>
          <div className="flex items-center gap-3 xs:gap-5">
            <span className="hidden xs:inline">
              Free shipping on orders above 500 ETB
            </span>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 hover:opacity-75 transition-opacity whitespace-nowrap text-[10px] xs:text-xs"
            >
              <Globe size={11} />
              {lang === "en" ? "አማርኛ" : "English"}
            </button>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-2 xs:px-3 md:px-6">
          <div className="flex items-center justify-between h-14 xs:h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-1.5 xs:gap-2.5 shrink-0"
            >
              <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-sm bg-primary flex items-center justify-center">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  className="w-4 h-4 xs:w-5 xs:h-5"
                >
                  <path
                    d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4z"
                    fill="currentColor"
                    className="text-primary-foreground"
                    opacity="0.15"
                  />
                  <path
                    d="M16 6l2.5 7.5H27l-6.5 4.5 2.5 7.5L16 21l-7 4.5 2.5-7.5L5 13.5h8.5L16 6z"
                    fill="currentColor"
                    className="text-primary-foreground"
                  />
                </svg>
              </div>
              <div className="hidden xs:block">
                <span className="font-serif text-base xs:text-lg md:text-xl font-bold text-foreground tracking-tight leading-none block">
                  Selam
                </span>
                <span className="text-[8px] xs:text-[9px] font-mono text-muted-foreground tracking-widest uppercase leading-none">
                  Market
                </span>
              </div>
              <span className="xs:hidden font-serif text-sm font-bold text-foreground tracking-tight">
                Selam
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              <div
                className="relative"
                onMouseEnter={() => setCatsOpen(true)}
                onMouseLeave={() => setCatsOpen(false)}
              >
                <button className="flex items-center gap-1.5 px-3 xl:px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-secondary whitespace-nowrap">
                  Categories{" "}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      catsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {catsOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 xs:w-64 bg-card border border-border rounded-xl shadow-xl p-2 z-50">
                    {categoryItems.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.id}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-sm text-foreground"
                        onClick={() => setCatsOpen(false)}
                      >
                        <span className="text-lg">{cat.icon}</span>
                        <div>
                          <div className="font-medium">
                            {lang === "en" ? cat.name : cat.nameAm}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path + link.label}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 xl:px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-primary bg-secondary"
                        : "text-foreground hover:text-primary hover:bg-secondary"
                    }`
                  }
                >
                  {lang === "en" ? link.label : link.labelAm}
                </NavLink>
              ))}
            </div>

            {/* Actions: Search, Auth, Cart, Theme */}
            <div className="flex items-center gap-0.5 xs:gap-1 md:gap-2">
              {/* Search Desktop */}
              <div
                className={`hidden md:flex items-center transition-all duration-300 ${
                  searchOpen ? "w-48 xl:w-56" : "w-9 xl:w-10"
                }`}
              >
                {searchOpen ? (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center gap-2 w-full bg-secondary rounded-full px-3 xl:px-4 py-1.5 xl:py-2 border border-border"
                  >
                    <Search
                      size={14}
                      className="text-muted-foreground shrink-0"
                    />
                    <input
                      autoFocus
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      placeholder="Search products..."
                      className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground min-w-[60px]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchVal("");
                      }}
                    >
                      <X size={12} className="text-muted-foreground" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="w-9 h-9 xl:w-10 xl:h-10 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Search size={17} xl:size={18} />
                  </button>
                )}
              </div>

              {/* Mobile search icon (always visible on small screens) */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  // Focus on mobile search input
                  setTimeout(() => {
                    const input = document.getElementById(
                      "mobile-search-input",
                    ) as HTMLInputElement;
                    if (input) input.focus();
                  }, 100);
                }}
                className="md:hidden w-9 h-9 xs:w-10 xs:h-10 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Search"
              >
                <Search size={17} xs:size={18} />
              </button>

              {/* Authentication Controls */}
              {isAuthenticated ? (
                <div
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                  className="relative"
                >
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 xs:gap-2 px-2 xs:px-3 py-1.5 rounded-full hover:bg-secondary text-foreground transition-colors border border-border"
                  >
                    <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full bg-primary/20 text-primary font-bold text-[10px] xs:text-xs flex items-center justify-center uppercase">
                      {user?.name ? user.name[0] : "U"}
                    </div>
                    <span className="text-[10px] xs:text-xs font-semibold hidden sm:inline max-w-[60px] xs:max-w-[100px] truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={11}
                      xs:size={12}
                      className="text-muted-foreground hidden xs:inline"
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 xs:w-56 bg-card border border-border rounded-2xl shadow-xl p-2 z-50 space-y-1">
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <div className="text-sm font-bold text-foreground truncate">
                          {user?.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </div>
                        <div className="mt-1">
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                              isAdmin
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {user?.role}
                          </span>
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-secondary text-sm text-foreground transition-colors"
                      >
                        <User size={15} className="text-muted-foreground" />
                        Profile & Settings
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-secondary text-sm text-foreground transition-colors"
                      >
                        <ShoppingBag
                          size={15}
                          className="text-muted-foreground"
                        />
                        My Orders
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-500/10 text-sm text-amber-500 font-semibold transition-colors"
                        >
                          <Shield size={15} />
                          Admin Dashboard
                        </Link>
                      )}

                      <div className="border-t border-border pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                            navigate("/");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-destructive/10 text-sm text-destructive transition-colors text-left font-medium"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 xs:gap-2">
                  <Link
                    to="/login"
                    className="px-2.5 xs:px-3 md:px-4 py-1.5 xs:py-2 text-[10px] xs:text-xs font-semibold border border-border text-foreground hover:bg-secondary rounded-xl transition-colors whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-2.5 xs:px-3 md:px-4 py-1.5 xs:py-2 text-[10px] xs:text-xs font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Cart */}
              <button
                onClick={() => dispatch({ type: "TOGGLE_DRAWER" })}
                className="relative w-9 h-9 xs:w-10 xs:h-10 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart size={17} xs:size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 xs:w-5 xs:h-5 bg-primary text-primary-foreground text-[9px] xs:text-[10px] font-bold rounded-full flex items-center justify-center font-mono border border-card">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 xs:w-10 xs:h-10 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun size={16} xs:size={18} />
                ) : (
                  <Moon size={16} xs:size={18} />
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="lg:hidden w-9 h-9 xs:w-10 xs:h-10 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X size={18} xs:size={20} />
                ) : (
                  <Menu size={18} xs:size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="lg:hidden pb-4 border-t border-border mt-1 pt-3 xs:pt-4 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto">
              <form
                onSubmit={handleMobileSearchSubmit}
                className="flex items-center gap-2 bg-secondary rounded-xl px-3 xs:px-4 py-2 xs:py-2.5 mb-2 xs:mb-3"
              >
                <Search size={14} className="text-muted-foreground shrink-0" />
                <input
                  id="mobile-search-input"
                  value={mobileSearchVal}
                  onChange={(e) => setMobileSearchVal(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                />
                {mobileSearchVal && (
                  <button
                    type="button"
                    onClick={() => setMobileSearchVal("")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>

              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-semibold bg-secondary rounded-xl border border-border text-foreground"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-semibold bg-primary text-primary-foreground rounded-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {isAuthenticated && (
                <div className="p-3 bg-secondary/50 rounded-xl mb-3 space-y-2">
                  <div className="text-sm font-bold text-foreground">
                    {user?.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-1.5 bg-background rounded-lg text-xs font-medium border border-border"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-1.5 bg-background rounded-lg text-xs font-medium border border-border"
                    >
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <div className="text-[10px] xs:text-xs font-mono text-muted-foreground uppercase tracking-widest px-3 pb-1">
                Categories
              </div>
              <div className="grid grid-cols-2 gap-1 xs:gap-1.5">
                {categoryItems.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.id}`}
                    className="flex items-center gap-2 xs:gap-3 px-2 xs:px-3 py-2 xs:py-2.5 rounded-lg hover:bg-secondary text-sm text-foreground transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="text-base xs:text-lg">{cat.icon}</span>
                    <span className="text-xs xs:text-sm truncate">
                      {lang === "en" ? cat.name : cat.nameAm}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-border pt-3 mt-3 space-y-1">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.path + link.label}
                    to={link.path}
                    className={({ isActive }) =>
                      `block px-3 py-2.5 rounded-lg text-sm text-foreground transition-colors ${
                        isActive
                          ? "bg-secondary text-primary"
                          : "hover:bg-secondary"
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {lang === "en" ? link.label : link.labelAm}
                  </NavLink>
                ))}
              </div>

              {/* Mobile bottom actions */}
              <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
                <button
                  onClick={toggleLang}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe size={14} />
                  {lang === "en" ? "አማርኛ" : "English"}
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
