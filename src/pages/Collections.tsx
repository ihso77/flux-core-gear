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
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-8 sm:pt-36">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-4 text-center"
          >
            Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-center font-body text-muted-foreground mb-10 max-w-lg mx-auto"
          >
            Browse our curated collections of premium gaming gear
          </motion.p>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
            {categories.map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                onClick={() => handleCategory(c.id)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 font-body text-xs sm:text-sm font-medium transition-all duration-300 ${
                  active === c.id
                    ? "border-primary bg-primary/10 text-foreground glow-nebula"
                    : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                }`}
              >
                <c.icon className="h-3.5 w-3.5" />
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
