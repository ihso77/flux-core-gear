import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import productMouse from "@/assets/product-mouse.png";
import productKeyboard from "@/assets/product-keyboard.png";
import productHeadset from "@/assets/product-headset.png";
import productMousepad from "@/assets/product-mousepad.png";

const products = [
  {
    name: "Phantom MK-1 Mechanical Keyboard",
    category: "Keyboards",
    price: 189.99,
    image: productKeyboard,
    isHero: true,
    className: "col-span-2 md:col-span-6",
  },
  {
    name: "Spectre X1 Gaming Mouse",
    category: "Mice",
    price: 79.99,
    image: productMouse,
    className: "col-span-1 md:col-span-2",
  },
  {
    name: "Eclipse Pro Headset",
    category: "Audio",
    price: 149.99,
    image: productHeadset,
    className: "col-span-1 md:col-span-2",
  },
  {
    name: "Void XL Desk Pad",
    category: "Accessories",
    price: 39.99,
    image: productMousepad,
    className: "col-span-2 md:col-span-2",
  },
];

const FeaturedProducts = () => {
  return (
    <section id="featured" className="bg-background py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Curated Selection
          </p>
          <h2 className="font-display text-3xl font-medium text-foreground md:text-4xl">
            Featured Products
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-6 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
