import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Zap, Shield, Cpu, Trophy, Headphones, Rocket } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "1ms response time across all peripherals. Zero lag, pure performance.",
    color: "from-yellow-500/20 to-orange-500/20",
    iconBg: "from-yellow-500 to-orange-500",
    accent: "yellow-500",
  },
  {
    icon: Shield,
    title: "Built to Last",
    description: "Premium materials engineered for millions of keypresses and clicks.",
    color: "from-blue-500/20 to-cyan-500/20",
    iconBg: "from-blue-500 to-cyan-500",
    accent: "blue-500",
  },
  {
    icon: Cpu,
    title: "Pro-Grade Tech",
    description: "Competition-ready sensors and switches trusted by professionals.",
    color: "from-purple-500/20 to-pink-500/20",
    iconBg: "from-purple-500 to-pink-500",
    accent: "purple-500",
  },
  {
    icon: Trophy,
    title: "Tournament Ready",
    description: "Designed in collaboration with esports champions worldwide.",
    color: "from-amber-500/20 to-yellow-500/20",
    iconBg: "from-amber-500 to-yellow-500",
    accent: "amber-500",
  },
  {
    icon: Headphones,
    title: "Immersive Audio",
    description: "Crystal clear sound with spatial audio support for competitive edge.",
    color: "from-green-500/20 to-emerald-500/20",
    iconBg: "from-green-500 to-emerald-500",
    accent: "green-500",
  },
  {
    icon: Rocket,
    title: "Future Proof",
    description: "Regular firmware updates and modular designs for longevity.",
    color: "from-red-500/20 to-rose-500/20",
    iconBg: "from-red-500 to-rose-500",
    accent: "red-500",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-[0_20px_60px_-15px_hsl(271_81%_56%/0.15)] overflow-hidden will-change-transform"
    >
      {/* Background gradient on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
      />

      {/* Spotlight effect following mouse */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.06), transparent 60%)",
        }}
      />

      {/* Top corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.04] rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <motion.div
        whileHover={{ rotate: [0, -15, 15, -5, 0], scale: 1.15 }}
        transition={{ duration: 0.6 }}
        className={`relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.iconBg} shadow-lg`}
      >
        <feature.icon className="h-6 w-6 text-primary-foreground" />
      </motion.div>

      <motion.h3
        className="relative mb-3 font-display text-xl font-semibold text-foreground"
        whileHover={{ x: 6 }}
        transition={{ duration: 0.3 }}
      >
        {feature.title}
      </motion.h3>

      <p className="relative font-body text-sm leading-relaxed text-muted-foreground">
        {feature.description}
      </p>

      {/* Bottom glow line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Learn more with arrow */}
      <motion.div
        className="relative mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
      >
        Discover more
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          →
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="collections" className="relative overflow-hidden bg-background py-16 sm:py-32">
      {/* Background decorations */}
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] bg-primary/[0.03] blur-[180px]" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-[400px] w-[400px] bg-primary/[0.02] blur-[150px]" />

      <div ref={ref} className="container relative mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 sm:mb-20 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚡
            </motion.span>
            <p className="font-body text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Why Nova
            </p>
          </motion.div>

          <motion.h2
            className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Engineered for{" "}
            <motion.span
              className="text-gradient-pulse inline-block"
              animate={{
                textShadow: [
                  "0 0 10px hsl(271 81% 56% / 0.2)",
                  "0 0 30px hsl(271 81% 56% / 0.5)",
                  "0 0 10px hsl(271 81% 56% / 0.2)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Excellence
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-4 max-w-2xl mx-auto font-body text-muted-foreground"
          >
            Every product is crafted with precision and passion, delivering the performance edge you need.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
