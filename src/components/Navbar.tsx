import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, ChevronDown, Keyboard, Mouse, Headphones, Monitor, Gamepad2, Cable, Package, Sparkles, User, LogOut, Settings, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "./CartDrawer";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  { id: "all", label: "All Products", icon: Sparkles },
  { id: "keyboards", label: "Keyboards", icon: Keyboard },
  { id: "mouse", label: "Mouse", icon: Mouse },
  { id: "headsets", label: "Headsets", icon: Headphones },
  { id: "monitors", label: "Monitors", icon: Monitor },
  { id: "controllers", label: "Controllers", icon: Gamepad2 },
  { id: "accessories", label: "Accessories", icon: Cable },
  { id: "bundles", label: "Bundles", icon: Package },
];

const navLinks = [
  { label: "Shop", href: "#shop", hasDropdown: true },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
];

const Navbar = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setDropdownOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `#shop`;
      window.dispatchEvent(new CustomEvent("navbar-search", { detail: searchQuery }));
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate("/");
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-area-top ${
        scrolled ? "border-b border-border bg-background/95 backdrop-blur-xl shadow-lg shadow-primary/5" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 sm:h-16 md:h-20 items-center justify-between px-3 sm:px-4 lg:px-6 xl:px-8 max-w-7xl">
        <motion.a
          href="/"
          className="font-display text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground relative group touch-manipulation"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          NOV<span className="text-gradient-pulse">A</span>
        </motion.a>

        <div className="hidden items-center gap-4 sm:gap-6 lg:gap-8 md:flex">
          {navLinks.map((link, index) => (
            <div key={link.label} className="relative" ref={link.hasDropdown ? dropdownRef : null}>
              {link.hasDropdown ? (
                <motion.button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="flex items-center gap-1 relative font-body text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground group"
                >
                  {link.label}
                  <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </motion.button>
              ) : link.href.startsWith("/") ? (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  <Link to={link.href} className="relative font-body text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground group">
                    {link.label}
                    <motion.span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                </motion.div>
              ) : (
                <motion.a
                  href={link.href}
                  className="relative font-body text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {link.label}
                  <motion.span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                </motion.a>
              )}

              {/* Shop Dropdown - Fixed styling */}
              <AnimatePresence>
                {link.hasDropdown && dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 min-w-[240px] rounded-xl border border-border bg-card backdrop-blur-xl p-2 shadow-2xl shadow-background/50"
                  >
                    <div className="grid gap-0.5">
                      {categories.map((category, i) => {
                        const Icon = category.icon;
                        const isAll = category.id === 'all';
                        return (
                          <motion.button
                            key={category.id}
                            onClick={() => {
                              setDropdownOpen(false);
                              window.dispatchEvent(new CustomEvent("navbar-category", { detail: category.id }));
                              const shopEl = document.getElementById('shop');
                              if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
                            }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 group relative overflow-hidden ${
                              isAll
                                ? 'bg-gradient-to-r from-primary/90 via-primary to-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80 hover:translate-x-1'
                            }`}
                          >
                            <Icon className={`h-4 w-4 relative z-10 ${isAll ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary transition-colors'}`} />
                            <span className="relative z-10 whitespace-nowrap">{category.label}</span>
                            {isAll && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          {/* Search */}
          <AnimatePresence>
            {searchOpen ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearch}
                className="flex items-center gap-2 rounded-lg border border-primary/50 bg-card px-3 py-2"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-32 sm:w-40 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </motion.form>
            ) : (
              <motion.button
                onClick={() => setSearchOpen(true)}
                className="relative text-muted-foreground transition-colors hover:text-foreground touch-manipulation p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            )}
          </AnimatePresence>

          <CartDrawer />

          {/* User Menu */}
          <div ref={userMenuRef} className="relative">
            {user ? (
              <motion.button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 touch-manipulation"
              >
                <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-xs sm:text-sm font-bold text-primary-foreground">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              </motion.button>
            ) : (
              <Link to="/login" className="flex items-center gap-1 sm:gap-2 rounded-lg border border-border bg-card px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:border-primary/30">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden md:inline">Sign In</span>
              </Link>
            )}

            <AnimatePresence>
              {userMenuOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-72 min-w-fit rounded-xl border border-border bg-card backdrop-blur-xl p-2 shadow-2xl shadow-background/50"
                >
                  <div className="px-3 py-2 border-b border-border mb-2 overflow-hidden">
                    <p className="font-medium text-sm text-foreground truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors whitespace-nowrap">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors whitespace-nowrap">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-primary hover:bg-primary/10 transition-colors whitespace-nowrap">
                      <Shield className="h-4 w-4" /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors whitespace-nowrap">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="relative text-muted-foreground md:hidden touch-manipulation p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden max-h-[80vh] overflow-y-auto scrollbar-hide safe-area-bottom"
          >
            <div className="px-4 py-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </form>

              {/* Categories */}
              <p className="mb-3 font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">Categories</p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {categories.map((category, i) => {
                  const Icon = category.icon;
                  const isAll = category.id === 'all';
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => {
                        setMobileOpen(false);
                        window.dispatchEvent(new CustomEvent("navbar-category", { detail: category.id }));
                        const shopEl = document.getElementById('shop');
                        if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 touch-manipulation relative overflow-hidden ${
                        isAll
                          ? 'bg-gradient-to-r from-primary/90 via-primary to-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-xl'
                          : 'border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/30 active:bg-secondary/80'
                      }`}
                    >
                      <Icon className={`h-4 w-4 relative z-10 ${isAll ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                      <span className="relative z-10 whitespace-nowrap">{category.label}</span>
                      {isAll && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* User Section */}
              {user ? (
                <div className="mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 mb-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-sm font-bold text-primary-foreground">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 text-primary">
                      <Shield className="h-4 w-4" /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="flex items-center gap-2 py-2 text-red-500">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 mb-6">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center rounded-lg gradient-pulse py-3 text-sm font-medium text-primary-foreground">Sign In</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center rounded-lg border border-border bg-card py-3 text-sm font-medium text-foreground">Sign Up</Link>
                </div>
              )}

              {/* Nav Links */}
              <div className="space-y-1">
                {navLinks.filter(l => !l.hasDropdown).map((link, index) => (
                  <motion.div key={link.label} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 + index * 0.1 }}>
                    <Link to={link.href} className="block font-body text-lg text-muted-foreground transition-colors hover:text-foreground py-2" onClick={() => setMobileOpen(false)}>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
