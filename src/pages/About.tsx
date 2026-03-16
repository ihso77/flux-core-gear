import { motion } from "framer-motion";
import { Zap, Shield, Headphones, Trophy, Users, Rocket } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  { icon: Zap, title: "Performance First", desc: "Every product is tested for competitive gaming standards." },
  { icon: Shield, title: "Quality Guaranteed", desc: "2-year warranty on all products with hassle-free returns." },
  { icon: Headphones, title: "24/7 Support", desc: "Our gaming experts are always ready to help you." },
  { icon: Trophy, title: "Pro Approved", desc: "Endorsed by professional esports players worldwide." },
  { icon: Users, title: "Community Driven", desc: "Built by gamers, for gamers. Your feedback shapes us." },
  { icon: Rocket, title: "Innovation", desc: "Constantly pushing boundaries in gaming peripherals." },
];

const stats = [
  { value: "50K+", label: "Happy Gamers" },
  { value: "200+", label: "Products" },
  { value: "30+", label: "Countries" },
  { value: "4.9★", label: "Average Rating" },
];

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    {/* Hero */}
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-foreground mb-6"
        >
          About <span className="text-gradient-pulse">Nova</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="mx-auto max-w-2xl font-body text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          We're on a mission to equip every gamer with world-class peripherals that elevate performance and redefine the gaming experience.
        </motion.p>
      </div>
    </section>

    {/* Stats */}
    <section className="py-12 border-y border-border bg-card/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease }}
              className="text-center"
            >
              <p className="font-display text-3xl sm:text-4xl font-bold text-primary">{s.value}</p>
              <p className="font-body text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-2xl sm:text-4xl font-bold text-foreground text-center mb-12"
        >
          Our Core Values
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease }}
              className="group rounded-2xl border border-border bg-card p-6 sm:p-8 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_hsl(271_81%_56%/0.2)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-pulse">
                <v.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Story */}
    <section className="py-16 sm:py-24 bg-card/30 border-y border-border">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-8"
        >
          Our Story
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="space-y-4 font-body text-muted-foreground leading-relaxed"
        >
          <p>Founded in 2024, Nova started as a passion project by a group of competitive gamers frustrated with the lack of high-quality, affordable gaming peripherals.</p>
          <p>Today we partner with the world's top manufacturers to bring you curated, pro-tested gear at prices that won't break the bank. Every product in our catalog has been vetted by our team of gaming enthusiasts and professional players.</p>
          <p>Our vision is simple: <span className="text-foreground font-semibold">empower every gamer to perform at their best</span>, regardless of budget or skill level.</p>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
