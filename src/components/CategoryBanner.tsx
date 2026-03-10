import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Keyboards",
    description: "Mechanical precision for every keystroke",
    id: "keyboards",
  },
  {
    title: "Mice",
    description: "Sensor accuracy meets ergonomic design",
    id: "mice",
  },
  {
    title: "Headsets",
    description: "Immersive audio, zero compromise",
    id: "headsets",
  },
  {
    title: "Accessories",
    description: "Complete your setup",
    id: "accessories",
  },
];

const CategoryBanner = () => {
  return (
    <section className="bg-background py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Browse by Category
          </p>
          <h2 className="font-display text-3xl font-medium text-foreground md:text-4xl">
            Find Your Edge
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.a
              key={cat.id}
              href={`#${cat.id}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex flex-col justify-end overflow-hidden rounded-xl border border-border bg-card p-8 transition-all duration-500 hover:border-nebula/40 hover:bg-secondary"
              style={{ minHeight: 220 }}
            >
              <div>
                <h3 className="mb-2 font-display text-xl font-medium text-foreground">
                  {cat.title}
                </h3>
                <p className="mb-4 font-body text-sm text-muted-foreground">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-primary transition-colors group-hover:text-nebula">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBanner;
