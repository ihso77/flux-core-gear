import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("Thanks for subscribing! 🎉");
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <section className="relative overflow-hidden py-24">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full border border-primary/5"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute -left-40 -bottom-40 h-[500px] w-[500px] rounded-full border border-primary/5"
      />

      <div className="container relative mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-body text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Stay Updated
            </span>
          </motion.div>

          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl mb-4">
            Join the{" "}
            <span className="text-gradient-pulse">Nova</span>{" "}
            Community
          </h2>

          <p className="font-body text-muted-foreground mb-8">
            Get early access to new drops, exclusive deals, and pro gaming tips delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="relative mx-auto max-w-md">
            <motion.div
              className="relative flex items-center overflow-hidden rounded-2xl border border-border bg-card p-1.5 transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-[0_0_30px_-10px_hsl(271_81%_56%/0.3)]"
              whileHover={{ scale: 1.01 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none"
                required
              />
              <AnimatePresence mode="wait">
                <motion.button
                  key={submitted ? "done" : "send"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={submitted}
                  className="flex items-center gap-2 rounded-xl gradient-pulse px-6 py-3 font-body text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-[0_0_20px_hsl(271_81%_56%/0.5)]"
                >
                  {submitted ? (
                    <>
                      <Check className="h-4 w-4" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Subscribe
                    </>
                  )}
                </motion.button>
              </AnimatePresence>
            </motion.div>
          </form>

          <p className="mt-4 font-body text-xs text-muted-foreground">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
