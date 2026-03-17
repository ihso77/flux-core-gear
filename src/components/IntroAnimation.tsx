import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroAnimation = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem('nova_intro_shown')) {
      setShow(false);
      return;
    }
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('nova_intro_shown', 'true');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          {/* Background particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary"
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0, 1.5, 0],
                y: [0, -40 - Math.random() * 60],
              }}
              transition={{
                duration: 2,
                delay: 0.5 + Math.random() * 1.5,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Expanding ring */}
          <motion.div
            className="absolute rounded-full border-2 border-primary/30"
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 600, height: 600, opacity: 0 }}
            transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
          />
          <motion.div
            className="absolute rounded-full border border-primary/20"
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 800, height: 800, opacity: 0 }}
            transition={{ duration: 2.5, delay: 1, ease: "easeOut" }}
          />

          {/* Logo */}
          <div className="relative flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.4 }}
              className="relative"
            >
              {/* Glow behind text */}
              <motion.div
                className="absolute inset-0 blur-3xl bg-primary/30 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h1 className="font-display text-6xl sm:text-8xl font-bold tracking-tight text-foreground relative z-10">
                NOV<span className="text-gradient-pulse">A</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="font-body text-sm sm:text-base text-muted-foreground tracking-[0.3em] uppercase"
            >
              Premium Gaming Gear
            </motion.p>

            {/* Loading bar */}
            <motion.div
              className="w-40 h-0.5 bg-border rounded-full overflow-hidden mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                className="h-full gradient-pulse rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 1.3, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
