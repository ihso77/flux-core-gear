import { motion } from "framer-motion";
import { Github, Twitter, Instagram, Youtube } from "lucide-react";

const footerLinks = {
  Shop: ["All Products", "Keyboards", "Mice", "Headsets"],
  Support: ["Contact Us", "Shipping", "Returns", "FAQ"],
  Company: ["About", "Careers", "Press"],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Github, href: "#", label: "GitHub" },
];

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <footer id="about" className="relative border-t border-border bg-background py-10 sm:py-16 overflow-hidden">
      {/* Background glow effect */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-primary/5 blur-[150px] rounded-full" />
      
      <div className="container relative mx-auto px-4 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
            <motion.span
              whileHover={{ scale: 1.02 }}
              className="inline-block font-display text-2xl font-bold tracking-tight text-foreground cursor-pointer"
            >
              NOV<span className="text-gradient-pulse">A</span>
            </motion.span>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-muted-foreground">
              Premium gaming peripherals engineered for competitive excellence.
            </p>
            
            {/* Social links */}
            <motion.div 
              className="flex gap-3 mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/50 text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary hover:bg-primary/10"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {Object.entries(footerLinks).map(([title, links], colIndex) => (
            <motion.div key={title} variants={itemVariants}>
              <motion.h4 
                className="mb-4 font-display text-sm font-medium text-foreground"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                {title}
              </motion.h4>
              <ul className="space-y-2.5">
                {links.map((link, linkIndex) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + colIndex * 0.1 + linkIndex * 0.05 }}
                  >
                    <a
                      href="#"
                      className="group relative font-body text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground inline-block"
                    >
                      <span className="relative z-10">{link}</span>
                      <motion.span
                        className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300"
                      />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row"
        >
          <p className="font-body text-xs text-muted-foreground">
            © 2026 Nova. All rights reserved.
          </p>
          <div className="flex gap-6">
            <motion.a 
              href="#" 
              className="font-body text-xs text-muted-foreground hover:text-foreground relative group"
              whileHover={{ y: -2 }}
            >
              Privacy
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </motion.a>
            <motion.a 
              href="#" 
              className="font-body text-xs text-muted-foreground hover:text-foreground relative group"
              whileHover={{ y: -2 }}
            >
              Terms
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
