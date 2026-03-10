import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import productKeyboard from "@/assets/product-keyboard.png";

const SpecialOffer = () => {
  return (
    <section className="bg-background py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card"
        >
          {/* Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/8 blur-[100px]" />

          <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-16">
            <div>
              <span className="mb-4 inline-block rounded-full gradient-pulse px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-widest text-primary-foreground">
                Limited Offer
              </span>
              <h2 className="mb-4 font-display text-3xl font-medium text-foreground md:text-4xl">
                Phantom MK-1
                <br />
                <span className="text-gradient-pulse">Launch Edition</span>
              </h2>
              <p className="mb-8 max-w-sm font-body text-base leading-relaxed text-muted-foreground">
                Hot-swappable switches, premium PBT keycaps, and a machined
                aluminum frame. Available for a limited time at 20% off.
              </p>
              <div className="flex items-center gap-4">
                <span className="font-display text-2xl font-semibold text-foreground">
                  $151.99
                </span>
                <span className="font-body text-base text-muted-foreground line-through">
                  $189.99
                </span>
              </div>
              <button className="mt-6 inline-flex items-center gap-2 rounded-lg gradient-pulse px-7 py-3.5 font-body text-sm font-medium text-primary-foreground transition-all duration-300 glow-nebula hover:glow-nebula-lg">
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex justify-center">
              <img
                src={productKeyboard}
                alt="Phantom MK-1 Launch Edition keyboard"
                className="w-full max-w-md animate-float"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialOffer;
