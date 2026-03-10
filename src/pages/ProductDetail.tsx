import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShoppingCart, Check } from "lucide-react";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const isLoading = useCartStore(s => s.isLoading);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    fetchProductByHandle(handle)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background pt-20">
        <p className="font-display text-2xl text-foreground">Product not found</p>
        <button onClick={() => navigate("/")} className="mt-4 text-primary hover:underline">
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
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </motion.button>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-card">
              {images[selectedImage] && (
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || product.title}
                  className="h-full w-full object-contain p-8"
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-16 w-16 overflow-hidden rounded-lg border transition-all duration-300 ${
                      i === selectedImage ? "border-primary glow-nebula" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img src={img.node.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
              {product.title}
            </h1>
            <p className="mb-6 font-body text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {variant && (
              <p className="mb-8 font-display text-3xl font-bold text-foreground">
                {variant.price.currencyCode} {parseFloat(variant.price.amount).toFixed(2)}
              </p>
            )}

            {/* Variants */}
            {product.variants.edges.length > 1 && (
              <div className="mb-8">
                <p className="mb-3 font-body text-sm font-medium text-foreground">Variant</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((v, i) => (
                    <button
                      key={v.node.id}
                      onClick={() => setSelectedVariantIdx(i)}
                      className={`rounded-lg border px-4 py-2 font-body text-sm transition-all duration-300 ${
                        i === selectedVariantIdx
                          ? "border-primary bg-primary/10 text-foreground glow-nebula"
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

            <motion.button
              onClick={handleAddToCart}
              disabled={isLoading || !variant?.availableForSale}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-3 rounded-xl gradient-pulse py-4 font-body text-base font-semibold text-primary-foreground transition-all duration-300 glow-nebula hover:glow-nebula-lg disabled:opacity-50 sm:w-auto sm:px-12"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : added ? (
                <>
                  <Check className="h-5 w-5" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </>
              )}
            </motion.button>

            {!variant?.availableForSale && (
              <p className="mt-4 font-body text-sm text-destructive">Out of stock</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
