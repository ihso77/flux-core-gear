"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCartStore, type ShopifyProduct } from "@/stores/cartStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
  index: number;
}

const ShopifyProductCard = ({ product, index }: ShopifyProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const router = useRouter();
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const variant = node.variants.edges[0]?.node;

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
    toast.success(`${node.title} added to cart`, { position: "top-center" });
  };

  const handleClick = () => {
    router.push(`/product/${node.handle}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={handleClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_hsl(271_81%_56%/0.3)]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {/* Shimmer overlay on hover */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          }}
        />
        
        {/* Hover overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent z-10"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Corner accent */}
        <motion.div
          className="absolute top-4 right-4 z-20"
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-primary/20 text-primary backdrop-blur-sm">
            NEW
          </span>
        </motion.div>
        
        {image ? (
          <motion.img
            src={image.url}
            alt={image.altText || node.title}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
        
        {/* Quick action button - appears on hover */}
        <motion.button
          className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/product/${node.handle}`);
          }}
        >
          View Details
        </motion.button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-5">
        <div>
          <motion.h3 
            className="font-display text-base font-medium text-foreground transition-colors duration-300 group-hover:text-primary"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            {node.title}
          </motion.h3>
          {node.description && (
            <p className="mt-1 line-clamp-2 font-body text-xs text-muted-foreground">
              {node.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <motion.span 
              className="font-display text-lg font-bold text-foreground"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
            </motion.span>
          </div>

          <motion.button
            onClick={handleAddToCart}
            disabled={isLoading || !variant?.availableForSale}
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 rounded-lg gradient-pulse px-3 py-2 font-body text-xs font-medium text-primary-foreground transition-shadow duration-300 hover:shadow-[0_0_20px_hsl(271_81%_56%/0.5)] disabled:opacity-50 overflow-hidden"
          >
            {/* Button shimmer effect */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 relative z-10" />
                <span className="hidden sm:inline relative z-10">Add</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
      
      {/* Bottom border glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
};

export default ShopifyProductCard;
