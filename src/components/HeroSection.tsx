import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-keyboard.png";
import { useRef, useEffect, useState } from "react";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);

  // Mouse parallax for hero image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 30);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 20);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  // Typewriter effect
  const words = ["Game", "Setup", "Victory"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center overflow-hidden bg-background">
      {/* Animated mesh gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Orbiting circles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -left-1/4 -top-1/4 h-[900px] w-[900px] rounded-full border border-primary/[0.04]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute -right-1/4 -bottom-1/4 h-[700px] w-[700px] rounded-full border border-primary/[0.06]"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/3 top-1/4 h-[400px] w-[400px] rounded-full border border-primary/[0.03]"
        />

        {/* Gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-[180px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.02, 0.06, 0.02] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-nebula blur-[150px]"
        />

        {/* Floating particles - more particles with varied sizes */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary"
            style={{
              left: `${8 + i * 8}%`,
              top: `${15 + (i % 4) * 18}%`,
              width: `${2 + (i % 3) * 2}px`,
              height: `${2 + (i % 3) * 2}px`,
              opacity: 0.2 + (i % 3) * 0.15,
            }}
            animate={{
              y: [0, -(20 + i * 5), 0],
              x: [0, (i % 2 === 0 ? 10 : -10), 0],
              opacity: [0.15, 0.5, 0.15],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Radial fade from center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,hsl(var(--background))_70%)]" />
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="container relative mx-auto grid items-center gap-8 px-4 pt-24 sm:pt-20 lg:grid-cols-2 lg:gap-0 lg:px-8"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl md:text-8xl"
          >
            Elevate
            <br />
            Your{" "}
            <span className="relative inline-block">
              <motion.span
                key={words[wordIndex]}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-gradient-pulse inline-block"
              >
                {words[wordIndex]}
              </motion.span>
              {/* Underline accent */}
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full gradient-pulse"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 max-w-md font-body text-base leading-relaxed text-muted-foreground sm:text-lg sm:mb-10"
          >
            Performance peripherals designed for those who demand excellence.
            Every detail engineered for victory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4"
          >
            <motion.a
              href="#shop"
              className="group relative inline-flex items-center gap-2 rounded-2xl gradient-pulse px-6 py-3 sm:px-8 sm:py-4 font-body text-sm font-semibold text-primary-foreground transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px hsl(271 81% 56% / 0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Animated shimmer */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </motion.a>

            <motion.a
              href="#collections"
              className="group relative inline-flex items-center gap-2 rounded-2xl border border-border px-6 py-3 sm:px-8 sm:py-4 font-body text-sm font-semibold text-foreground transition-all duration-500 hover:border-primary/50 hover:bg-primary/5 overflow-hidden"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
              View Collections
            </motion.a>
          </motion.div>

          {/* Stats with counting animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex gap-6 sm:gap-10 sm:mt-14"
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
                transition={{ delay: 0.7 + i * 0.1 }}
                className="text-left group"
              >
                <motion.div
                  className="font-display text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary sm:text-2xl"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="font-body text-xs text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Hero image with mouse parallax - hidden on small mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotateY: -20, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden sm:flex items-center justify-center"
          style={{ perspective: 1200 }}
        >
          <motion.div
            style={{ x: springX, y: springY }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Multi-layer glow rings */}
            <motion.div
              className="absolute -inset-10 rounded-full border border-primary/15"
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{ rotate: { duration: 30, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
            />
            <motion.div
              className="absolute -inset-20 rounded-full border border-primary/8"
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -inset-32 rounded-full border border-primary/[0.04]"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />

            {/* Background glow */}
            <div className="pointer-events-none absolute -inset-20 rounded-full bg-primary/8 blur-[120px]" />

            {/* Main image */}
            <motion.img
              src={heroImage}
              alt="Premium gaming keyboard"
              className="relative w-full max-w-2xl rounded-2xl drop-shadow-2xl"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
            />

            {/* Floating badges with glassmorphism */}
            <motion.div
              className="absolute -right-2 sm:-right-6 top-1/4 flex items-center gap-2 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 px-3 py-1.5 sm:px-4 sm:py-2 shadow-2xl"
              animate={{ y: [0, -12, 0], x: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-body text-xs font-medium text-foreground">In Stock</span>
            </motion.div>

            <motion.div
              className="absolute -left-6 bottom-1/4 flex items-center gap-2 rounded-2xl bg-primary/15 backdrop-blur-xl border border-primary/25 px-4 py-2"
              animate={{ y: [0, 12, 0], x: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="font-body text-xs font-medium text-primary">New Arrival</span>
            </motion.div>

            <motion.div
              className="absolute -right-2 bottom-1/6 flex items-center gap-2 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 px-3 py-1.5 shadow-xl"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >
              <span className="font-display text-sm font-bold text-foreground">⭐ 4.9</span>
              <span className="font-body text-[10px] text-muted-foreground">Rating</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#shop"
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <motion.span
            className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors"
          >
            Scroll to explore
          </motion.span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-6 items-start justify-center rounded-full border border-muted-foreground/30 p-1.5 group-hover:border-primary/50 transition-colors"
          >
            <motion.div className="h-2 w-1 rounded-full bg-primary" />
          </motion.div>
        </motion.a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
