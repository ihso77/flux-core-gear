import { motion, useInView } from "framer-motion";
import { Zap, Shield, Cpu, Trophy, Headphones, Rocket } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "1ms response time across all peripherals. Zero lag, pure performance.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Built to Last",
    description: "Premium materials engineered for millions of keypresses and clicks.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Cpu,
    title: "Pro-Grade Tech",
    description: "Competition-ready sensors and switches trusted by professionals.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Trophy,
    title: "Tournament Ready",
    description: "Designed in collaboration with esports champions worldwide.",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    icon: Headphones,
    title: "Immersive Audio",
    description: "Crystal clear sound with spatial audio support for competitive edge.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Rocket,
    title: "Future Proof",
    description: "Regular firmware updates and modular designs for longevity.",
    gradient: "from-red-500 to-rose-500",
  },
];

const FeaturesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="collections" className="relative overflow-hidden bg-background py-32">
      {/* Background decorations */}
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] bg-primary/3 blur-[150px]" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-[400px] w-[400px] bg-primary/2 blur-[120px]" />

      <div ref={ref} className="container relative mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚡
            </motion.span>
            <p className="font-body text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Why Nova
            </p>
          </motion.div>
          
          <motion.h2
            className="font-display text-4xl font-bold text-foreground md:text-5xl"
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
                  "0 0 20px hsl(271 81% 56% / 0.4)",
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
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_50px_-15px_hsl(271_81%_56%/0.15)] overflow-hidden"
            >
              {/* Background gradient on hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Top corner accent */}
              <motion.div
                className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className={`relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                style={{
                  boxShadow: `0 10px 30px -10px hsl(271 81% 56% / 0.3)`,
                }}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </motion.div>
              
              <motion.h3
                className="relative mb-3 font-display text-xl font-semibold text-foreground"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                {feature.title}
              </motion.h3>
              
              <p className="relative font-body text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>

              {/* Bottom glow line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
              />

              {/* Learn more link */}
              <motion.div
                className="mt-4 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ y: 10 }}
                whileHover={{ y: 0 }}
              >
                Learn more
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
