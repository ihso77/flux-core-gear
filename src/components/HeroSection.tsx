import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-keyboard.png";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-background pt-16">
      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container relative mx-auto grid items-center gap-12 px-4 lg:grid-cols-2 lg:gap-0 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <p className="mb-4 font-body text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Precision Engineered
          </p>
          <h1 className="mb-6 font-display text-5xl font-medium leading-[1.1] text-foreground md:text-7xl">
            Instruments
            <br />
            of <span className="text-gradient-pulse">Mastery</span>
          </h1>
          <p className="mb-10 max-w-md font-body text-base leading-relaxed text-muted-foreground">
            High-performance peripherals designed for those who refuse to
            compromise. Every detail engineered for competitive advantage.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#featured"
              className="group inline-flex items-center gap-2 rounded-lg gradient-pulse px-7 py-3.5 font-body text-sm font-medium text-primary-foreground transition-all duration-300 glow-nebula hover:glow-nebula-lg"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#bestsellers"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-7 py-3.5 font-body text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/50 hover:bg-secondary"
            >
              Best Sellers
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          <div className="relative animate-float">
            <div className="pointer-events-none absolute -inset-10 rounded-full bg-primary/10 blur-[80px]" />
            <img
              src={heroImage}
              alt="Premium mechanical keyboard with violet backlighting"
              className="relative w-full max-w-2xl rounded-2xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
