import { useState } from "react";
import { motion } from "framer-motion";
import { Keyboard, Mouse, Headphones, Monitor, Gamepad2, Cable, Package, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

const categories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "keyboards", label: "Keyboards", icon: Keyboard },
  { id: "mouse", label: "Mouse", icon: Mouse },
  { id: "headsets", label: "Headsets", icon: Headphones },
  { id: "monitors", label: "Monitors", icon: Monitor },
  { id: "controllers", label: "Controllers", icon: Gamepad2 },
  { id: "accessories", label: "Accessories", icon: Cable },
  { id: "bundles", label: "Bundles", icon: Package },
];

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const Collections = () => {
  const [active, setActive] = useState("all");

  const handleCategory = (id: string) => {
    setActive(id);
    window.dispatchEvent(new CustomEvent("navbar-category", { detail: id }));
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <section className="pt-20 sm:pt-28 md:pt-36 pb-4 sm:pb-6 md:pb-8">
        <div className="container mx-auto px-3 sm:px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 text-center"
          >
            Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-center font-body text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6 md:mb-10 max-w-lg mx-auto px-2"
          >
            Browse our curated collections of premium gaming gear
          </motion.p>

          {/* Category pills - Horizontal scroll on mobile */}
          <div className="flex gap-1.5 sm:gap-2 md:gap-3 overflow-x-auto pb-3 sm:pb-4 mb-4 sm:mb-6 md:mb-10 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-hide snap-x snap-mandatory">
            {categories.map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                onClick={() => handleCategory(c.id)}
                className={`flex items-center gap-1.5 sm:gap-2 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 font-body text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-300 flex-shrink-0 touch-manipulation snap-start ${
                  active === c.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                }`}
              >
                <c.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {c.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <ProductGrid />
      <Footer />
    </div>
  );
};

export default Collections;
