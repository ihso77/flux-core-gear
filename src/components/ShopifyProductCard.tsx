import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShoppingCart, Loader2, Eye, Sparkles } from "lucide-react";
import { useCartStore, type ShopifyProduct } from "@/stores/cartStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { autoCategorize, getCategoryLabel } from "@/lib/autoCategory";
import { extractProductId } from "@/lib/shopify";
import { useRef } from "react";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
  index: number;
}

const ShopifyProductCard = ({ product, index }: ShopifyProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const navigate = useNavigate();
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const variant = node.variants.edges[0]?.node;
  const cardRef = useRef<HTMLDivElement>(null);

  // Get numeric product ID for URL
  const productId = extractProductId(node.id);

  // Auto-categorize the product
  const detectedCategory = autoCategorize(node.title, node.description);
  const categoryLabel = getCategoryLabel(detectedCategory);

  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${node.title} added to cart`, {
      position: "top-center",
      description: `Category: ${categoryLabel}`,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/product/${productId}`)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl border border-border bg-card transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_60px_-15px_hsl(271_81%_56%/0.25)] will-change-transform touch-manipulation"
    >
      {/* Category badge - auto-detected */}
      {detectedCategory !== "all" && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.05 }}
          className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 md:top-3 md:left-3 z-20 flex items-center gap-0.5 sm:gap-1 md:gap-1.5 rounded-full bg-primary/15 backdrop-blur-md border border-primary/20 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1"
        >
          <Sparkles className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 text-primary" />
          <span className="font-body text-[7px] sm:text-[8px] md:text-[10px] font-semibold text-primary uppercase tracking-wider">
            {categoryLabel}
          </span>
        </motion.div>
      )}

      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 z-10 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Shine sweep on hover */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {image ? (
          <motion.img
            src={image.url}
            alt={image.altText || node.title}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}

        {/* Quick actions overlay - hidden on mobile */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-20 hidden sm:flex items-center justify-center gap-3 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${productId}`);
            }}
            className="flex items-center gap-2 rounded-full bg-card/90 backdrop-blur-sm border border-border px-4 py-2.5 font-body text-xs font-medium text-foreground shadow-lg hover:bg-card transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            Quick View
          </motion.button>
        </motion.div>
      </div>

      {/* Info section */}
      <div className="flex flex-1 flex-col justify-between gap-1 sm:gap-1.5 md:gap-2 p-2 sm:p-2.5 md:p-4">
        <div>
          <h3 className="font-display text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-semibold text-foreground line-clamp-1 transition-colors duration-300 group-hover:text-primary">
            {node.title}
          </h3>
          {node.description && (
            <p className="mt-0.5 sm:mt-1 line-clamp-1 md:line-clamp-2 font-body text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs leading-relaxed text-muted-foreground">
              {node.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1 sm:pt-1.5 md:pt-2 border-t border-border/50">
          <div className="flex flex-col">
            <span className="font-display text-[10px] sm:text-xs md:text-sm lg:text-lg font-bold text-foreground">
              {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
            </span>
          </div>

          <motion.button
            onClick={handleAddToCart}
            disabled={isLoading || !variant?.availableForSale}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="relative flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 rounded-md sm:rounded-lg md:rounded-xl gradient-pulse px-2 py-1.5 sm:px-2.5 sm:py-1.5 md:px-4 md:py-2.5 font-body text-[8px] sm:text-[9px] md:text-xs font-semibold text-primary-foreground transition-shadow duration-300 hover:shadow-[0_0_25px_hsl(271_81%_56%/0.5)] disabled:opacity-50 overflow-hidden touch-manipulation"
          >
            {/* Animated shimmer */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            {isLoading ? (
              <Loader2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 animate-spin relative z-10" />
            ) : (
              <>
                <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 relative z-10" />
                <span className="hidden md:inline relative z-10">Add</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Bottom glow line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Corner accent glow */}
      <div className="absolute -bottom-10 -right-10 h-20 w-20 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
};

export default ShopifyProductCard;
