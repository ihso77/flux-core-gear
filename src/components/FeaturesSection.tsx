import { motion } from "framer-motion";
import { Zap, Shield, Cpu } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "1ms response time across all peripherals. Zero lag, pure performance.",
  },
  {
    icon: Shield,
    title: "Built to Last",
    description: "Premium materials engineered for millions of keypresses and clicks.",
  },
  {
    icon: Cpu,
    title: "Pro-Grade Tech",
    description: "Competition-ready sensors and switches trusted by professionals.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="collections" className="relative overflow-hidden bg-background py-32">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] bg-primary/3 blur-[150px]" />

      <div className="container relative mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Why Nova
          </p>
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Engineered for Excellence
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_50px_-15px_hsl(271_81%_56%/0.15)]"
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl gradient-pulse"
              >
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </motion.div>
              <h3 className="mb-3 font-display text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
