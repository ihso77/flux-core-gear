import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Package, SearchX, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import ShopifyProductCard from "./ShopifyProductCard";
import CategoryFilter, { categories } from "./CategoryFilter";
import SearchBar from "./SearchBar";
import { toast } from "sonner";

const ProductGrid = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Listen for navbar events
  useEffect(() => {
    const handleNavbarSearch = (e: CustomEvent) => {
      setSearchQuery(e.detail);
      // Scroll to shop section
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    };

    const handleNavbarCategory = (e: CustomEvent) => {
      setActiveCategory(e.detail);
      // Scroll to shop section
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("navbar-search", handleNavbarSearch as EventListener);
    window.addEventListener("navbar-category", handleNavbarCategory as EventListener);

    return () => {
      window.removeEventListener("navbar-search", handleNavbarSearch as EventListener);
      window.removeEventListener("navbar-category", handleNavbarCategory as EventListener);
    };
  }, []);

  // Fetch products based on category and search
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const category = categories.find(c => c.id === activeCategory);
      let query = "";
      
      if (category && category.query) {
        query = category.query;
      }
      
      if (debouncedSearch) {
        query = query ? `${query} ${debouncedSearch}` : debouncedSearch;
      }
      
      const results = await fetchProducts(50, query || undefined);
      setProducts(results);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, debouncedSearch]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const activeCategoryData = categories.find(c => c.id === activeCategory);

  return (
    <section id="shop" className="relative bg-background py-16 sm:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-primary/3 blur-[150px] rounded-full" />

      <div className="container relative mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Package className="h-5 w-5 text-primary" />
            </motion.span>
            <p className="font-body text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Our Products
            </p>
          </motion.div>
          
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl mb-4">
            Shop the{" "}
            <motion.span
              className="text-gradient-pulse inline-block"
              animate={{
                textShadow: [
                  "0 0 10px hsl(271 81% 56% / 0.2)",
                  "0 0 20px hsl(271 81% 56% / 0.4)",
                  "0 0 10px hsl(271 81% 56% / 0.2)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Collection
            </motion.span>
          </h2>
          
          <p className="max-w-2xl mx-auto font-body text-muted-foreground">
            Discover premium gaming gear engineered for competitive excellence
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search keyboards, mice, headsets..."
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <span className="font-body text-sm text-muted-foreground">
              {!loading && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {products.length} {products.length === 1 ? "product" : "products"}
                  {activeCategoryData && activeCategoryData.id !== "all" && (
                    <span> in <span className="text-primary font-medium">{activeCategoryData.label}</span></span>
                  )}
                  {debouncedSearch && (
                    <span> for "<span className="text-foreground">{debouncedSearch}</span>"</span>
                  )}
                </motion.span>
              )}
            </span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isFilterOpen 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>
            
            <div className="flex rounded-lg border border-border bg-card p-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[400px] items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-8 w-8 text-primary" />
              </motion.div>
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <SearchX className="h-16 w-16 text-muted-foreground/50" />
              </motion.div>
              <p className="mt-6 font-display text-xl text-muted-foreground">No products found</p>
              <p className="mt-2 font-body text-sm text-muted-foreground max-w-md text-center">
                {debouncedSearch 
                  ? `We couldn't find any products matching "${debouncedSearch}"`
                  : "Try adjusting your filters or search terms"}
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="mt-6 rounded-lg gradient-pulse px-6 py-2 font-body text-sm font-medium text-primary-foreground"
              >
                Clear All Filters
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1 md:grid-cols-2"
              }`}
            >
              <AnimatePresence>
                {products.map((product, index) => (
                  <ShopifyProductCard 
                    key={product.node.id} 
                    product={product} 
                    index={index} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button (if needed) */}
        {products.length >= 20 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loadProducts}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3 font-body text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
            >
              Load More Products
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
