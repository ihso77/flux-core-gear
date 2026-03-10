import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { label: "Shop", href: "#shop" },
  { label: "Collections", href: "#collections" },
  { label: "About", href: "#about" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-border bg-background/90 backdrop-blur-xl shadow-lg shadow-primary/5" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        <motion.a 
          href="/" 
          className="font-display text-2xl font-bold tracking-tight text-foreground relative group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          NOV<span className="text-gradient-pulse">A</span>
          <motion.span
            className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-primary/50"
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </motion.a>

        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="relative font-body text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground group"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              whileHover={{ y: -2 }}
            >
              {link.label}
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                style={{ transformOrigin: "left" }}
              />
              <motion.span
                className="absolute -bottom-1 left-1/2 h-0.5 w-0 bg-primary/50"
                whileHover={{ width: "100%", x: "-50%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <motion.button 
            className="relative text-muted-foreground transition-colors hover:text-foreground group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            <motion.span
              className="absolute inset-0 rounded-full bg-primary/20"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          </motion.button>
          <CartDrawer />
          <motion.button
            className="relative text-muted-foreground md:hidden overflow-hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-6">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="font-body text-lg text-muted-foreground transition-colors hover:text-foreground relative overflow-hidden"
                  onClick={() => setMobileOpen(false)}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <motion.span
                    className="absolute left-0 top-1/2 h-0.5 w-0 bg-primary"
                    whileHover={{ width: 30 }}
                    transition={{ duration: 0.2 }}
                    style={{ y: "-50%" }}
                  />
                  <span className="ml-8">{link.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
