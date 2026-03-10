import { motion } from "framer-motion";

const footerLinks = {
  Shop: ["All Products", "Keyboards", "Mice", "Headsets"],
  Support: ["Contact Us", "Shipping", "Returns", "FAQ"],
  Company: ["About", "Careers", "Press"],
};

const Footer = () => {
  return (
    <footer id="about" className="border-t border-border bg-background py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-2xl font-bold tracking-tight text-foreground"
            >
              NOV<span className="text-gradient-pulse">A</span>
            </motion.span>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-muted-foreground">
              Premium gaming peripherals engineered for competitive excellence.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 font-display text-sm font-medium text-foreground">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-body text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="font-body text-xs text-muted-foreground">
            © 2026 Nova. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground">Privacy</a>
            <a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
