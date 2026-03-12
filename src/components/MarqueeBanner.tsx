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
    <div className="relative overflow-hidden border-y border-border bg-card/50 py-3">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="mx-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"
          >
            <item.icon className="h-4 w-4 text-primary" />
            <span className="font-body">{item.text}</span>
            <span className="ml-8 text-primary/30">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeBanner;
