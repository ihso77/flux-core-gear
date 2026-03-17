import { motion } from "framer-motion";
import { Zap, Star, Shield, Truck } from "lucide-react";

const items = [
  { icon: Zap, text: "Free Shipping on $50+" },
  { icon: Star, text: "Premium Quality" },
  { icon: Shield, text: "2 Year Warranty" },
  { icon: Truck, text: "Fast Delivery" },
  { icon: Zap, text: "Free Shipping on $50+" },
  { icon: Star, text: "Premium Quality" },
  { icon: Shield, text: "2 Year Warranty" },
  { icon: Truck, text: "Fast Delivery" },
];

const MarqueeBanner = () => {
  return (
    <div className="relative overflow-hidden border-y border-border bg-card/50 py-2 sm:py-3">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="mx-4 sm:mx-8 inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground"
          >
            <item.icon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="font-body">{item.text}</span>
            <span className="ml-4 sm:ml-8 text-primary/30 hidden sm:inline">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeBanner;
