import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { motion, AnimatePresence } from "framer-motion";

const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    items, 
    isLoading, 
    isSyncing, 
    updateQuantity, 
    removeItem, 
    getCheckoutUrl, 
    syncCart,
    discountCode,
    discountPercentage,
    applyDiscount,
    removeDiscount
  } = useCartStore();
  const [discountInput, setDiscountInput] = useState("");
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const totalPrice = subtotal - discountAmount;
  const currency = items[0]?.price.currencyCode || 'USD';

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
    }
  };

  const handleApplyDiscount = () => {
    if (!discountInput.trim()) return;
    const result = applyDiscount(discountInput);
    if (result.success) {
      toast.success(result.message);
      setDiscountInput("");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative text-muted-foreground transition-colors hover:text-foreground touch-manipulation p-1.5 sm:p-0">
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full gradient-pulse text-[8px] sm:text-[10px] font-bold text-primary-foreground"
            >
              {totalItems}
            </motion.span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col border-border bg-background sm:max-w-lg p-0 safe-area-top">
        <SheetHeader className="px-4 pt-4 sm:pt-6">
          <SheetTitle className="font-display text-base sm:text-lg md:text-xl text-foreground">Cart</SheetTitle>
          <SheetDescription className="text-xs sm:text-sm text-muted-foreground">
            {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col min-h-0 pt-3 sm:pt-4 md:pt-6 px-3 sm:px-4 md:px-6">
          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="mx-auto mb-3 sm:mb-4 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-muted-foreground" />
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-0.5 sm:pr-1 md:pr-2 min-h-0 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="mb-2 sm:mb-3 md:mb-4 flex gap-2 sm:gap-3 rounded-lg border border-border bg-card p-2 sm:p-2.5 md:p-3"
                    >
                      <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="truncate font-display text-[10px] sm:text-xs md:text-sm font-medium text-foreground">
                          {item.product.node.title}
                        </h4>
                        <p className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground truncate">
                          {item.selectedOptions.map(o => o.value).join(" · ")}
                        </p>
                        <p className="mt-0.5 sm:mt-1 font-display text-[10px] sm:text-xs md:text-sm font-semibold text-foreground">
                          {currency} {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5 sm:gap-1 md:gap-2">
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-muted-foreground transition-colors hover:text-destructive touch-manipulation p-1"
                        >
                          <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </button>
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded border border-border text-foreground transition-colors hover:bg-secondary touch-manipulation"
                          >
                            <Minus className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3" />
                          </button>
                          <span className="w-4 sm:w-5 md:w-6 text-center text-[9px] sm:text-[10px] md:text-xs text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded border border-border text-foreground transition-colors hover:bg-secondary touch-manipulation"
                          >
                            <Plus className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex-shrink-0 space-y-2 sm:space-y-3 md:space-y-4 border-t border-border pt-4 sm:pt-5 md:pt-6 pb-4 sm:pb-6 md:pb-0 px-3 sm:px-4 md:px-0 safe-area-bottom">
                {/* Discount Code Section */}
                {!discountCode ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Discount code"
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value)}
                        className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                      />
                    </div>
                    <button
                      onClick={handleApplyDiscount}
                      className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-md bg-primary/10 px-3 py-2 text-primary">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span className="text-xs font-semibold">{discountCode} Applied</span>
                      <span className="text-[10px] bg-primary/20 px-1.5 rounded">{discountPercentage}% OFF</span>
                    </div>
                    <button
                      onClick={removeDiscount}
                      className="hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{currency} {subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-xs sm:text-sm text-primary font-medium">
                      <span>Discount ({discountPercentage}%)</span>
                      <span>-{currency} {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-display text-sm sm:text-base md:text-lg font-semibold text-foreground">Total</span>
                    <span className="font-display text-base sm:text-lg md:text-xl font-bold text-foreground">{currency} {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || isSyncing}
                  className="flex w-full items-center justify-center gap-2 rounded-lg sm:rounded-xl gradient-pulse py-2.5 sm:py-3 md:py-3.5 font-body text-xs sm:text-sm font-medium text-primary-foreground transition-all duration-300 glow-nebula hover:glow-nebula-lg disabled:opacity-50 touch-manipulation"
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Checkout with Shopify
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
