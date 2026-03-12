import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-keyboard.png";
import { useRef } from "react";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center overflow-hidden bg-background">
      {/* Animated background particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Rotating circles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full border border-primary/5"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute -right-1/4 -bottom-1/4 h-[600px] w-[600px] rounded-full border border-primary/5"
        />
        
        {/* Pulsing glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-[150px]"
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/40"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="container relative mx-auto grid items-center gap-12 px-4 pt-20 lg:grid-cols-2 lg:gap-0 lg:px-8"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 inline-flex items-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <p className="font-body text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Premium Gaming Gear
            </p>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 font-display text-6xl font-bold leading-[1.05] text-foreground md:text-8xl"
          >
            Elevate
            <br />
            Your <motion.span 
              className="text-gradient-pulse inline-block"
              animate={{ 
                textShadow: [
                  "0 0 20px hsl(271 81% 56% / 0.3)",
                  "0 0 40px hsl(271 81% 56% / 0.5)",
                  "0 0 20px hsl(271 81% 56% / 0.3)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >Game</motion.span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 max-w-md font-body text-lg leading-relaxed text-muted-foreground"
          >
            Performance peripherals designed for those who demand excellence.
            Every detail engineered for victory.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4"
          >
            <motion.a
              href="#shop"
              className="group relative inline-flex items-center gap-2 rounded-xl gradient-pulse px-8 py-4 font-body text-sm font-semibold text-primary-foreground transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Button shimmer */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </motion.a>
            
            <motion.a
              href="#collections"
              className="group relative inline-flex items-center gap-2 rounded-xl border border-border px-8 py-4 font-body text-sm font-semibold text-foreground transition-all duration-500 hover:border-primary/50 hover:bg-primary/5 overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              View Collections
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex gap-8"
          >
            {[
              { value: "1ms", label: "Response Time" },
              { value: "50M+", label: "Clicks Lifespan" },
              { value: "Pro", label: "Grade Tech" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="text-left"
              >
                <motion.div
                  className="font-display text-2xl font-bold text-foreground"
                  whileHover={{ scale: 1.05, color: "hsl(271, 81%, 56%)" }}
                >
                  {stat.value}
                </motion.div>
                <div className="font-body text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center perspective-1000"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute -inset-8 rounded-full border border-primary/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -inset-16 rounded-full border border-primary/10"
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Background glow */}
            <div className="pointer-events-none absolute -inset-16 rounded-full bg-primary/10 blur-[100px]" />
            
            {/* Main image */}
            <motion.img
              src={heroImage}
              alt="Premium gaming keyboard"
              className="relative w-full max-w-2xl rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />

            {/* Floating badges */}
            <motion.div
              className="absolute -right-4 top-1/4 flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm border border-border px-3 py-1.5 shadow-lg"
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-body text-xs font-medium text-foreground">In Stock</span>
            </motion.div>

            <motion.div
              className="absolute -left-4 bottom-1/4 flex items-center gap-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 px-3 py-1.5"
              animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="font-body text-xs font-medium text-primary">New Arrival</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#shop"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-muted-foreground/30 p-1.5 cursor-pointer hover:border-primary/50 transition-colors"
        >
          <motion.div className="h-2 w-1 rounded-full bg-primary" />
        </motion.a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
