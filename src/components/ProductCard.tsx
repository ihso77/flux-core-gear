import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  name: string;
  category: string;
  price: number;
  image: string;
  isHero?: boolean;
}

const ProductCard = ({ name, category, price, image, isHero = false }: ProductCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-500 ${
        hovered ? "border-nebula/60" : "border-border"
      } ${isHero ? "col-span-2 row-span-2 md:col-span-3 lg:col-span-6" : "col-span-1 md:col-span-3 lg:col-span-2"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image area */}
      <div className={`relative overflow-hidden bg-secondary ${isHero ? "aspect-[16/9]" : "aspect-square"}`}>
        <div
          className={`absolute inset-0 bg-background/40 transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />
        <img
          src={image}
          alt={name}
          className={`h-full w-full object-contain p-6 transition-all duration-500 ${
            hovered ? "scale-105 brightness-110" : "scale-100 brightness-100"
          } ${isHero ? "p-10" : "p-6"}`}
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-5">
        <div>
          <p className="mb-1 font-body text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {category}
          </p>
          <h3 className={`font-display font-medium text-foreground ${isHero ? "text-xl" : "text-base"}`}>
            {name}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-foreground">
            ${price.toFixed(2)}
          </span>

          <motion.button
            className="flex items-center gap-2 rounded-lg gradient-pulse px-3 py-2 font-body text-xs font-medium text-primary-foreground transition-shadow duration-300 hover:glow-nebula"
            animate={{ width: hovered ? "auto" : 36 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ShoppingCart className="h-4 w-4 shrink-0" />
            <motion.span
              initial={false}
              animate={{ opacity: hovered ? 1 : 0, width: hovered ? "auto" : 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              Add to Cart
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
