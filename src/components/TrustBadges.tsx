import { motion } from "framer-motion";
import { Shield, Truck, RotateCcw, Headphones } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On orders over $50",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    desc: "256-bit SSL encryption",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "30-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Dedicated help center",
  },
];

const TrustBadges = () => {
  return (
    <section className="relative border-y border-border bg-card/30 py-10 sm:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-card/50 transition-all duration-500"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                transition={{ duration: 0.5 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500"
              >
                <badge.icon className="h-6 w-6" />
              </motion.div>
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">
                  {badge.title}
                </h3>
                <p className="mt-1 font-body text-xs text-muted-foreground">
                  {badge.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
