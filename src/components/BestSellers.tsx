import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import productMouse from "@/assets/product-mouse.png";
import productKeyboard from "@/assets/product-keyboard.png";
import productHeadset from "@/assets/product-headset.png";
import productMonitorArm from "@/assets/product-monitor-arm.png";

const bestsellers = [
  {
    name: "Wraith Pro Wireless Mouse",
    category: "Mice",
    price: 129.99,
    image: productMouse,
  },
  {
    name: "Obsidian TKL Keyboard",
    category: "Keyboards",
    price: 159.99,
    image: productKeyboard,
  },
  {
    name: "Resonance 7.1 Headset",
    category: "Audio",
    price: 199.99,
    image: productHeadset,
  },
  {
    name: "Arc Monitor Arm",
    category: "Desk Setup",
    price: 89.99,
    image: productMonitorArm,
  },
];

const BestSellers = () => {
  return (
    <section id="bestsellers" className="bg-background py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Most Popular
          </p>
          <h2 className="font-display text-3xl font-medium text-foreground md:text-4xl">
            Best Sellers
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
