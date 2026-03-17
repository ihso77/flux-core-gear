import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShoppingCart, Check } from "lucide-react";
import { fetchProductById, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const isLoading = useCartStore(s => s.isLoading);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProductById(id)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-16 sm:pt-20">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background pt-16 sm:pt-20 px-4">
        <p className="font-display text-xl sm:text-2xl text-foreground text-center">Product not found</p>
        <button onClick={() => navigate("/")} className="mt-4 text-primary hover:underline text-sm sm:text-base">
          Go back
        </button>
      </div>
    );
  }

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const images = product.images.edges;

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    setAdded(true);
    toast.success(`${product.title} added to cart`, { position: "top-center" });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pt-14 sm:pt-16 md:pt-20 pb-16 sm:pb-12 overflow-x-hidden">
      <div className="mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 max-w-7xl">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 font-body text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground touch-manipulation py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </motion.button>

        <div className="grid gap-6 sm:gap-8 md:gap-12 lg:grid-cols-2">
          {/* Images Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card w-full">
              {images[selectedImage] && (
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || product.title}
                  className="h-full w-full object-contain p-4 sm:p-6 md:p-8"
                />
              )}
            </div>
            
            {/* Thumbnail Images - Horizontal scroll on mobile */}
            {images.length > 1 && (
              <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl border transition-all duration-300 touch-manipulation snap-start ${
                      i === selectedImage ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img src={img.node.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-w-0"
          >
            {/* Title */}
            <h1 className="mb-2 sm:mb-3 md:mb-4 font-display text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight break-words">
              {product.title}
            </h1>
            
            {/* Description */}
            <p className="mb-3 sm:mb-4 md:mb-6 font-body text-xs sm:text-sm md:text-base leading-relaxed text-muted-foreground break-words">
              {product.description}
            </p>

            {/* Price */}
            {variant && (
              <p className="mb-4 sm:mb-6 md:mb-8 font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                {variant.price.currencyCode} {parseFloat(variant.price.amount).toFixed(2)}
              </p>
            )}

            {/* Variants - Horizontal scroll on mobile */}
            {product.variants.edges.length > 1 && (
              <div className="mb-4 sm:mb-6 md:mb-8">
                <p className="mb-2 sm:mb-3 font-body text-xs sm:text-sm font-medium text-foreground">Select Variant</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-32 overflow-y-auto">
                  {product.variants.edges.map((v, i) => (
                    <button
                      key={v.node.id}
                      onClick={() => setSelectedVariantIdx(i)}
                      className={`rounded-lg sm:rounded-xl border px-3 sm:px-4 py-2 sm:py-2.5 font-body text-xs sm:text-sm transition-all duration-300 touch-manipulation whitespace-nowrap ${
                        i === selectedVariantIdx
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                      } ${!v.node.availableForSale ? "opacity-40 cursor-not-allowed" : ""}`}
                      disabled={!v.node.availableForSale}
                    >
                      {v.node.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={isLoading || !variant?.availableForSale}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex w-full items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl gradient-pulse py-3.5 sm:py-4 font-body text-sm sm:text-base font-semibold text-primary-foreground transition-all duration-300 disabled:opacity-50 touch-manipulation"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
              ) : added ? (
                <>
                  <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Add to Cart</span>
                </>
              )}
            </motion.button>

            {!variant?.availableForSale && (
              <p className="mt-3 sm:mt-4 font-body text-xs sm:text-sm text-destructive text-center">
                Out of stock
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
