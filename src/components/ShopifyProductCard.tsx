import { motion } from "framer-motion";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCartStore, type ShopifyProduct } from "@/stores/cartStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => navigate(`/product/${node.handle}`)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:border-nebula/50 hover:shadow-[0_0_40px_-10px_hsl(271_81%_56%/0.2)]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10" />
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-125"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-5">
        <div>
          <h3 className="font-display text-base font-medium text-foreground transition-colors duration-300 group-hover:text-primary">
            {node.title}
          </h3>
          {node.description && (
            <p className="mt-1 line-clamp-2 font-body text-xs text-muted-foreground">
              {node.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-foreground">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </span>

          <motion.button
            onClick={handleAddToCart}
            disabled={isLoading || !variant?.availableForSale}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-lg gradient-pulse px-3 py-2 font-body text-xs font-medium text-primary-foreground transition-shadow duration-300 hover:glow-nebula disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopifyProductCard;
